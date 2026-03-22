import { Booking, BreakupDayInfo } from '../types/models'
import { supabase } from '../lib/supabase'
import { getProfileImagePublicUrl } from './profileService'
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

type AppointmentFromDB = {
  id: number;
  created_at: string;
  client_id: string;
  service_subtype_id?: number;
  service_sub_type_id?: number;
  service_type_id?: number;
  starts_at: string;
  ends_at: string;
  status_id?: number;
  appointment_note: string | null;
  caregiver_gender_preference: "male" | "female" | null;
  service_subtypes?: {
    id: number;
    user_friendly_name: string;
    services_offered: string[] | string;
    service_types?: { name: string };
  };
  service_types?: {
    id: number;
    name: string;
    subtype?: string;
  };
  appointment_statuses?: {
    id: number;
    code: string;
  };
  appointment_code?: string | null;
  is_payment_settled?: boolean | null;
  appointment_breakup?: {
    service_amount: number;
    booking_discount_pct?: number;
    service_amount_with_discount?: number | null;
    amount_paid?: number | null;
    service_date: string;
    visit_pin?: string | null;
    service_start_date_time?: string | null;
    caregiver_id: string | null;
    caregiver_first_name: string | null;
    /** DB column is misspelled: careegiver_last_name */
    careegiver_last_name: string | null;
    caregiver_phone_number: string | null;
    caregiver_profile_pic: string | null;
    status_id?: number | null;
  }[];
}

/** appointment_statuses: 1=scheduled, 2=completed, 3=missed, 4=cancelled, 5=rescheduled, 6=in_progress */
// Explicit columns only (appointments no longer has caregiver_id / caregiver_phone / caregiver_name)
const APPOINTMENT_SELECT_COLS =
  "id, created_at, client_id, service_sub_type_id, starts_at, ends_at, status_id, appointment_note, caregiver_gender_preference, address_id, client_phone, appointment_code, is_payment_settled";
const STATUS_ID_SCHEDULED = 1;
const STATUS_ID_CANCELLED = 4;

/**
 * Maps appointment_statuses.code (or status_id) to Booking status
 */
function mapStatusFromDB(
  code: string | undefined,
  statusId: number | undefined,
): "upcoming" | "completed" | "cancelled" {
  if (code) {
    switch (code) {
      case "scheduled":
      case "in_progress":
      case "rescheduled":
        return "upcoming";
      case "completed":
        return "completed";
      case "cancelled":
      case "missed":
        return "cancelled";
      default:
        return "upcoming";
    }
  }
  if (statusId != null) {
    if (statusId === 2) return "completed";
    if (statusId === 4 || statusId === 3) return "cancelled";
  }
  return "upcoming";
}

/**
 * Maps database appointments format to application Booking model.
 * Caregiver details (name, phone, pic) come from appointment_breakup columns.
 */
function mapBookingFromDB(dbAppointment: AppointmentFromDB): Booking {
  const startDateTime = dayjs(dbAppointment.starts_at);
  const endDateTime = dayjs(dbAppointment.ends_at);

  const serviceIdRaw =
    dbAppointment.service_sub_type_id ??
    dbAppointment.service_subtype_id ??
    dbAppointment.service_type_id;
  const serviceId = serviceIdRaw != null ? String(serviceIdRaw) : "";

  const serviceName =
    dbAppointment.service_subtypes?.user_friendly_name ??
    dbAppointment.service_subtypes?.service_types?.name ??
    dbAppointment.service_types?.name ??
    (serviceId ? `Service ${serviceId}` : "Service");

  const servicesOffered = (() => {
    const raw = dbAppointment.service_subtypes?.services_offered;
    if (raw == null) return undefined;
    if (Array.isArray(raw)) {
      const arr = raw.filter(Boolean).map((s) => String(s).trim());
      return arr.length > 0 ? arr : undefined;
    }
    const s = String(raw).trim();
    return s ? [s] : undefined;
  })();

  const serviceCharge =
    dbAppointment.appointment_breakup?.length &&
    dbAppointment.appointment_breakup.length > 0
      ? dbAppointment.appointment_breakup.reduce(
          (sum, row) => sum + Number(row.service_amount ?? 0),
          0
        )
      : undefined;

  const numberOfBreakups =
    dbAppointment.appointment_breakup != null &&
    Array.isArray(dbAppointment.appointment_breakup)
      ? dbAppointment.appointment_breakup.length
      : undefined;

  const breakup = dbAppointment.appointment_breakup;
  const activeBreakup =
    breakup?.filter(
      (row) => row.status_id == null || row.status_id !== STATUS_ID_CANCELLED,
    ) ?? [];
  let totalServicePrice: number | undefined;
  let discountPct: number | undefined;
  let discountAmount: number | undefined;
  let finalServiceCharge: number | undefined;
  let amountPaid: number | undefined;
  if (activeBreakup.length > 0) {
    totalServicePrice = activeBreakup.reduce(
      (sum, row) => sum + Number(row.service_amount ?? 0),
      0
    );
    amountPaid = activeBreakup.reduce(
      (sum, row) => sum + Number(row.amount_paid ?? 0),
      0
    );
    const withDiscount = activeBreakup.reduce(
      (sum, row) =>
        sum +
        Number(
          row.service_amount_with_discount != null
            ? row.service_amount_with_discount
            : row.service_amount ?? 0
        ),
      0
    );
    finalServiceCharge = withDiscount;
    discountAmount =
      totalServicePrice > 0 ? totalServicePrice - finalServiceCharge : 0;
    const first = breakup[0];
        discountPct =
      first?.booking_discount_pct != null
        ? Number(first.booking_discount_pct)
        : discountAmount > 0 && totalServicePrice > 0
          ? Math.round((discountAmount / totalServicePrice) * 100)
          : 0;
  }

  const caregiverAssignments: { id: string; name: string; firstName?: string | null; lastName?: string | null; email?: string | null; phone?: string | null; profilePic?: string | null; days: string[] }[] = [];
  const unassignedDays: string[] = [];

  // Build one entry per caregiver from appointment_breakup (caregiver_id + caregiver_* columns)
  const byCaregiverId = new Map<string, { id: string; name: string; firstName?: string | null; lastName?: string | null; phone?: string | null; profilePic?: string | null; days: string[] }>();
  if (activeBreakup.length > 0) {
    for (const row of activeBreakup) {
      const date = row.service_date ?? "";
      if (!date) continue;
      const cid = row.caregiver_id;
      if (cid) {
        let entry = byCaregiverId.get(cid);
        if (!entry) {
          const firstName = row.caregiver_first_name ?? null;
          const lastName = row.careegiver_last_name ?? null;
          const name =
            firstName || lastName
              ? [firstName, lastName].filter(Boolean).join(" ").trim()
              : "Caregiver";
          entry = {
            id: cid,
            name,
            firstName,
            lastName,
            phone: row.caregiver_phone_number ?? undefined,
            profilePic: getProfileImagePublicUrl(row.caregiver_profile_pic) ?? undefined,
            days: [],
          };
          byCaregiverId.set(cid, entry);
        }
        entry.days.push(date);
      } else {
        unassignedDays.push(date);
      }
    }
  }

  byCaregiverId.forEach((entry) => {
    caregiverAssignments.push({
      id: entry.id,
      name: entry.name,
      firstName: entry.firstName,
      lastName: entry.lastName,
      phone: entry.phone,
      profilePic: entry.profilePic,
      days: entry.days.sort(),
    });
  });

  const breakupByDate: Record<string, BreakupDayInfo> = {};
  if (activeBreakup.length > 0) {
    for (const row of activeBreakup) {
      const date = row.service_date ?? "";
      if (!date) continue;
      const name =
        row.caregiver_first_name || row.careegiver_last_name
          ? [row.caregiver_first_name, row.careegiver_last_name]
              .filter(Boolean)
              .join(" ")
              .trim()
          : "Caregiver";
      breakupByDate[date] = {
        visitPin: row.visit_pin ?? null,
        serviceStartDateTime: row.service_start_date_time ?? null,
        caregiver: row.caregiver_id
          ? {
              id: row.caregiver_id,
              name,
              phone: row.caregiver_phone_number ?? null,
              profilePic: getProfileImagePublicUrl(row.caregiver_profile_pic) ?? null,
            }
          : null,
      };
    }
  }

  return {
    id: dbAppointment.id != null ? String(dbAppointment.id) : "",
    userId: dbAppointment.client_id ?? "",
    serviceId,
    serviceName,
    servicesOffered,
    genderPreference: dbAppointment.caregiver_gender_preference || undefined,
    startDate: startDateTime.format("YYYY-MM-DD"),
    endDate: endDateTime.format("YYYY-MM-DD"),
    startTime: startDateTime.format("HH:mm"),
    endTime: endDateTime.format("HH:mm"),
    notes: dbAppointment.appointment_note || undefined,
    status: mapStatusFromDB(
      dbAppointment.appointment_statuses?.code,
      dbAppointment.status_id,
    ),
    statusCode: dbAppointment.appointment_statuses?.code,
    statusId: dbAppointment.appointment_statuses?.id,
    createdAt: dbAppointment.created_at ?? "",
    address: undefined,
    appointmentCode: dbAppointment.appointment_code ?? undefined,
    serviceCharge: finalServiceCharge ?? serviceCharge,
    totalServicePrice,
    discountPct,
    discountAmount,
    finalServiceCharge,
    numberOfBreakups,
    amountPaid: amountPaid != null ? amountPaid : undefined,
    caregiverAssignments: caregiverAssignments.length > 0 ? caregiverAssignments : undefined,
    unassignedDays: unassignedDays.length > 0 ? unassignedDays : undefined,
    breakupByDate: Object.keys(breakupByDate).length > 0 ? breakupByDate : undefined,
    isPaymentSettled: dbAppointment.is_payment_settled ?? undefined,
  };
}

export const bookingService = {
  /**
   * Creates a new appointment in Supabase
   * Combines startDate/startTime and endDate/endTime into starts_at and ends_at timestamps
   */
  async createBooking(
    bookingData: Omit<Booking, "id" | "createdAt" | "status" | "address"> & {
      addressId: string;
      /** Optional: service type id (used only when DB has service_type_id column). */
      serviceTypeId?: string;
    },
  ): Promise<{ success: boolean; booking?: Booking; message: string }> {
    try {
      console.log("createBooking - ", bookingData);
      // Get authenticated user
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        return {
          success: false,
          message: "User not authenticated",
        };
      }

      const startDate = dayjs(bookingData.startDate).format("YYYY-MM-DD");
      const startDateTime = `${startDate}T${bookingData.startTime}:00Z`;

      const endDate = dayjs(bookingData.endDate).format("YYYY-MM-DD");
      const endDateTime = `${endDate}T${bookingData.endTime}:00Z`;

      if (!dayjs.utc(endDateTime).isAfter(dayjs.utc(startDateTime))) {
        return {
          success: false,
          message: "End time must be after start time",
        };
      }

      console.log("createBooking - 31111", bookingData);

      // serviceId is the service_subtype_id (from selected subtype in booking flow)
      const serviceSubtypeId = parseInt(bookingData.serviceId, 10);
      if (isNaN(serviceSubtypeId)) {
        return {
          success: false,
          message: "Invalid service ID",
        };
      }

      // Require address_id (appointments.address_id NOT NULL)
      if (!bookingData.addressId || typeof bookingData.addressId !== "string") {
        return {
          success: false,
          message: "Please select an address for the visit",
        };
      }

      const clientPhone = authUser.phone ?? authUser.email ?? "";
      if (!clientPhone.trim()) {
        return {
          success: false,
          message: "Unable to use your contact number. Please ensure you are signed in with a phone number.",
        };
      }

      // Prepare insert data (column name: service_sub_type_id; status_id 1 = scheduled)
      const insertData: Record<string, unknown> = {
        service_sub_type_id: serviceSubtypeId,
        starts_at: startDateTime,
        ends_at: endDateTime,
        status_id: STATUS_ID_SCHEDULED,
        address_id: bookingData.addressId,
        client_phone: clientPhone,
      };

      // Add appointment_note if provided
      if (bookingData.notes && bookingData.notes.trim()) {
        insertData.appointment_note = bookingData.notes.trim();
      }

      // Add caregiver_gender_preference if provided and valid
      if (
        bookingData.genderPreference &&
        (bookingData.genderPreference === "male" ||
          bookingData.genderPreference === "female")
      ) {
        insertData.caregiver_gender_preference = bookingData.genderPreference;
      }

      console.log("Creating appointment:", {
        client_id: authUser.id,
        service_sub_type_id: serviceSubtypeId,
        status_id: STATUS_ID_SCHEDULED,
        starts_at: startDateTime,
        ends_at: endDateTime,
        caregiver_gender_preference: insertData.caregiver_gender_preference,
        appointment_note: insertData.appointment_note,
      });

      // Insert appointment into database
      const { data, error } = await supabase
        .from("appointments")
        .insert(insertData)
        .select(
          `
          *,
          appointment_statuses (
            id,
            code
          ),
          service_subtypes (
            id,
            user_friendly_name,
            services_offered,
            service_types (
              name
            )
          )
        `,
        )
        .single();

      if (error) {
        console.error("Error creating appointment:", error);
        return {
          success: false,
          message: error.message || "Failed to create booking",
        };
      }

      if (!data) {
        return {
          success: false,
          message: "No data returned from database",
        };
      }

      const booking = mapBookingFromDB(data);

      console.log("Appointment created successfully:", booking.id);

      return {
        success: true,
        booking,
        message: "Booking created successfully",
      };
    } catch (error) {
      console.error("Unexpected error creating booking:", error);
      return {
        success: false,
        message: "An unexpected error occurred while creating booking",
      };
    }
  },

  /**
   * Fetches all appointments for a given user (client_id)
   * Includes service type information and caregiver information via joins
   */
  async fetchBookings(userId: string): Promise<Booking[]> {
    try {
      console.log("Fetching bookings for user_id:", userId);

      const { data, error } = await supabase
        .from("appointments")
        .select(
          `
          *,
          appointment_statuses (
            id,
            code
          ),
          service_subtypes (
            id,
            user_friendly_name,
            services_offered,
            service_types (
              name
            )
          )
        `,
        )
        .eq("client_id", userId)
        .order("starts_at", { ascending: false });

      if (error) {
        console.error("Error fetching appointments:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log("No appointments found for user_id:", userId);
        return [];
      }

      const bookings = data.map(mapBookingFromDB);
      console.log(`Fetched ${bookings.length} bookings successfully`);

      return bookings;
    } catch (error) {
      console.error("Unexpected error fetching bookings:", error);
      return [];
    }
  },

  /**
   * Fetches a single appointment by ID
   * Includes service type information via joins.
   * Note: We do NOT select caregiver_id (column removed). If you see
   * "column a.caregiver_id does not exist", fix the database: drop any RLS
   * policy on appointments that references caregiver_id (see supabase/migrations).
   */
  async fetchBookingDetails(bookingId: string): Promise<Booking | null> {
    try {
      console.log("Fetching booking details for id:", bookingId);

      const appointmentId = parseInt(bookingId, 10);
      if (isNaN(appointmentId)) {
        console.error("Invalid booking ID:", bookingId);
        return null;
      }

      const { data, error } = await supabase
        .from("appointments")
        .select(
          `
          *,
          appointment_statuses (
            id,
            code
          ),
          service_subtypes (
            id,
            user_friendly_name,
            services_offered,
            service_types (
              name
            )
          ),
          appointment_breakup (
            service_amount,
            booking_discount_pct,
            service_amount_with_discount,
            amount_paid,
            service_date,
            visit_pin,
            service_start_date_time,
            caregiver_id,
            caregiver_first_name,
            caregiver_last_name,
            caregiver_phone_number,
            caregiver_profile_pic,
            status_id
          )
        `,
        )
        .eq("id", appointmentId)
        .single();

      if (error) {
        console.error("Error fetching appointment:", error);
        if (error.code === "PGRST116") {
          return null;
        }
        throw error;
      }

      if (!data) {
        return null;
      }

      const booking = mapBookingFromDB(data);
      return booking;
    } catch (error) {
      console.error("Unexpected error fetching booking details:", error);
      return null;
    }
  },

  /**
   * Fetches upcoming appointments for a user
   * Filters for upcoming status and future start times
   */
  async getUpcomingBookings(userId: string): Promise<Booking[]> {
    try {
      const bookings = await this.fetchBookings(userId);
      const now = dayjs();

      return bookings.filter((b) => {
        const startDateTime = dayjs(`${b.startDate} ${b.startTime}`);
        return b.status === "upcoming" && startDateTime.isAfter(now);
      });
    } catch (error) {
      console.error("Error fetching upcoming bookings:", error);
      return [];
    }
  },

  /**
   * Fetches today's appointment for the user (if any).
   * Returns the first upcoming booking that has today as a service date, with that day's breakup info.
   */
  async getTodaysAppointment(
    userId: string,
  ): Promise<{ booking: Booking; todayBreakup: BreakupDayInfo } | null> {
    try {
      const today = dayjs().format("YYYY-MM-DD");
      const bookings = await this.fetchBookings(userId);
      const candidate = bookings.find(
        (b) =>
          b.status === "upcoming" &&
          today >= b.startDate &&
          today <= b.endDate,
      );
      if (!candidate) return null;
      const details = await this.fetchBookingDetails(candidate.id);
      if (!details?.breakupByDate?.[today]) return null;
      return {
        booking: details,
        todayBreakup: details.breakupByDate[today],
      };
    } catch (error) {
      console.error("Error fetching today's appointment:", error);
      return null;
    }
  },

  /**
   * Cancels one or more service days within an appointment by updating the corresponding
   * appointment_breakup rows to status 'cancelled'.
   */
  async cancelBookingDates(
    bookingId: string,
    serviceDates: string[],
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log("Cancelling booking dates:", { bookingId, serviceDates });

      const appointmentId = parseInt(bookingId, 10);
      if (isNaN(appointmentId)) {
        return {
          success: false,
          message: "Invalid booking ID",
        };
      }

      const uniqueDates = Array.from(
        new Set(
          serviceDates
            .map((d) => d.trim())
            .filter(Boolean),
        ),
      );
      if (uniqueDates.length === 0) {
        return {
          success: false,
          message: "No valid service dates provided",
        };
      }

      const parsedDates = uniqueDates.map((d) =>
        ({ raw: d, parsed: dayjs(d, "YYYY-MM-DD", true) }) as const,
      );
      if (parsedDates.some(({ parsed }) => !parsed.isValid())) {
        return {
          success: false,
          message: "One or more service dates are invalid",
        };
      }

      // Get authenticated user
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        return {
          success: false,
          message: "User not authenticated",
        };
      }

      // Ensure the appointment belongs to this user
      const { data: appointment, error: appointmentError } = await supabase
        .from("appointments")
        .select("id, client_id")
        .eq("id", appointmentId)
        .single();

      if (appointmentError || !appointment) {
        console.error("Error fetching appointment for cancelBookingDate:", appointmentError);
        return {
          success: false,
          message: "Unable to find this booking",
        };
      }

      if (appointment.client_id !== authUser.id) {
        return {
          success: false,
          message: "You are not allowed to modify this booking",
        };
      }

      const isoDates = parsedDates.map(({ parsed }) =>
        parsed.format("YYYY-MM-DD"),
      );

      // Update appointment_breakup rows for the specified dates
      const { error: updateError } = await supabase
        .from("appointment_breakup")
        .update({ status_id: STATUS_ID_CANCELLED })
        .eq("appointment_id", appointmentId)
        .in("service_date", isoDates)
        .neq("status_id", STATUS_ID_CANCELLED)
        .select("id");

      if (updateError) {
        console.error("Error cancelling appointment dates:", updateError);
        return {
          success: false,
          message: updateError.message || "Failed to cancel selected days",
        };
      }

      console.log("Booking dates cancelled successfully");
      return {
        success: true,
        message: "Selected days have been cancelled successfully",
      };
    } catch (error) {
      console.error("Unexpected error cancelling booking dates:", error);
      return {
        success: false,
        message: "An unexpected error occurred while cancelling selected days",
      };
    }
  },

  /**
   * Cancels a single service day convenience wrapper around cancelBookingDates.
   */
  async cancelBookingDate(
    bookingId: string,
    serviceDate: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.cancelBookingDates(bookingId, [serviceDate]);
  },

  /**
   * Cancels an appointment by updating its status to 'cancelled'
   * (use cancelBookingDate to cancel only specific days).
   */
  async cancelBooking(
    bookingId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log("Cancelling booking:", bookingId);

      const appointmentId = parseInt(bookingId, 10);
      if (isNaN(appointmentId)) {
        return {
          success: false,
          message: "Invalid booking ID",
        };
      }

      // Get authenticated user to ensure they own this booking
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        return {
          success: false,
          message: "User not authenticated",
        };
      }

      // Update appointment status to cancelled (status_id 4)
      const { error } = await supabase
        .from("appointments")
        .update({ status_id: STATUS_ID_CANCELLED })
        .eq("id", appointmentId)
        .eq("client_id", authUser.id); // Ensure user owns this appointment

      if (error) {
        console.error("Error cancelling appointment:", error);
        return {
          success: false,
          message: error.message || "Failed to cancel booking",
        };
      }

      console.log("Booking cancelled successfully");
      return {
        success: true,
        message: "Booking cancelled successfully",
      };
    } catch (error) {
      console.error("Unexpected error cancelling booking:", error);
      return {
        success: false,
        message: "An unexpected error occurred while cancelling booking",
      };
    }
  },
};
