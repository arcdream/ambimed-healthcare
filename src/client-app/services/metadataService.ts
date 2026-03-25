import { Service, AppointmentStatus } from '../types/models'
import { supabase } from '../lib/supabase'

type ServiceTypeRow = {
  id: number;
  name: string;
  description: string | null;
  icon: string;
  has_gender_preference: boolean;
  gender_options: string[] | null;
  minimum_booking_days?: number | null;
};

type ServiceSubtypeRow = {
  id: number;
  service_type_id: number;
  user_friendly_name: string;
  subtype_name: string;
  price: number;
  /** DB column is text[] */
  services_offered: string[] | string;
  shift_type_id: number;
  shift_types: {
    shift_type_id: number;
    shift_type_name: string;
    shift_duration_hours: number;
  } | null;
};

function toServicesOfferedArray(value: string[] | string | null | undefined): string[] {
  if (value == null) return [];
  if (Array.isArray(value)) return value.filter(Boolean).map((s) => String(s).trim());
  return String(value)
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function mapServiceFromDB(
  typeRow: ServiceTypeRow,
  subtypeRows: ServiceSubtypeRow[],
): Service {
  const genderOptions =
    typeRow.gender_options && typeRow.gender_options.length > 0
      ? (typeRow.gender_options as ("male" | "female")[])
      : undefined;

  const subtypes: Service["subtypes"] = subtypeRows.map((s) => ({
    id: s.id.toString(),
    userFriendlyName: s.user_friendly_name,
    subtypeName: s.subtype_name,
    price: Number(s.price),
    servicesOffered: toServicesOfferedArray(s.services_offered),
    shiftTypeId: s.shift_type_id,
    shiftTypeName: s.shift_types?.shift_type_name ?? "",
    shiftDurationHours: Number(s.shift_types?.shift_duration_hours ?? 0),
  }));

  return {
    id: typeRow.id.toString(),
    name: typeRow.name,
    description: typeRow.description ?? "",
    icon: typeRow.icon,
    hasGenderPreference: typeRow.has_gender_preference,
    genderOptions,
    minimumBookingDays:
      typeRow.minimum_booking_days != null && typeRow.minimum_booking_days >= 1
        ? typeRow.minimum_booking_days
        : undefined,
    subtypes: subtypes.length > 0 ? subtypes : undefined,
  };
}

export const metadataService = {
  /**
   * Fetches appointment_statuses (id, code, description, is_active) for display and filtering.
   */
  async fetchAppointmentStatuses(): Promise<AppointmentStatus[]> {
    try {
      const { data, error } = await supabase
        .from("appointment_statuses")
        .select("id, code, description, is_active")
        .eq("is_active", true)
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching appointment_statuses:", error);
        return [];
      }

      return (data ?? []).map((row: { id: number; code: string; description: string | null; is_active: boolean }) => ({
        id: row.id,
        code: row.code,
        description: row.description ?? null,
        isActive: row.is_active ?? true,
      }));
    } catch (e) {
      console.error("Unexpected error fetching appointment_statuses:", e);
      return [];
    }
  },

  /**
   * Fetches service types with subtypes and shift options from Supabase.
   * Uses service_types, service_subtypes, and shift_types.
   * Gender options come from service_types.gender_options.
   * Service details (services_offered) come from service_subtypes.
   */
  async fetchServicesMetadata(): Promise<Service[]> {
    try {
      const { data: typeRows, error: typeError } = await supabase
        .from("service_types")
        .select("id, name, description, icon, has_gender_preference, gender_options, minimum_booking_days")
        .eq("is_service_available", true)
        .order("id", { ascending: true });

      if (typeError) {
        console.error("Error fetching service_types:", typeError);
        throw typeError;
      }

      if (!typeRows?.length) {
        return [];
      }

      const { data: subtypeRows, error: subtypeError } = await supabase
        .from("service_subtypes")
        .select(
          `
          id,
          service_type_id,
          user_friendly_name,
          subtype_name,
          price,
          services_offered,
          shift_type_id,
          shift_types (
            shift_type_id,
            shift_type_name,
            shift_duration_hours
          )
        `,
        )
        .order("id", { ascending: true });

      if (subtypeError) {
        console.error("Error fetching service_subtypes:", subtypeError);
        throw subtypeError;
      }

      const subtypesByTypeId = (subtypeRows ?? []).reduce(
        (acc, row) => {
          const key = row.service_type_id;
          if (!acc[key]) acc[key] = [];
          acc[key].push(row as ServiceSubtypeRow);
          return acc;
        },
        {} as Record<number, ServiceSubtypeRow[]>,
      );

      const services = typeRows.map((t) =>
        mapServiceFromDB(t as ServiceTypeRow, subtypesByTypeId[t.id] ?? []),
      );

      return services;
    } catch (error) {
      console.error("Unexpected error fetching services metadata:", error);
      return [];
    }
  },
};
