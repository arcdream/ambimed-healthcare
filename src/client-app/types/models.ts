/** Shared with Ambimed mobile app – keep in sync with ambimed/frontend types */

export interface User {
  id: string
  mobileNumber: string
  firstName?: string
  lastName?: string
  email?: string
}

export interface Address {
  id: string
  houseAddress: string
  streetAddress?: string | null
  city: string
  state: string
  country?: string
  pincode: string
  isPrimary: boolean
}

export interface Session {
  sessionId: string
  user: User
  expiryTimestamp: number
}

export interface AppointmentStatus {
  id: number
  code: string
  description: string | null
  isActive: boolean
}

export interface ServiceSubtype {
  id: string
  userFriendlyName: string
  subtypeName: string
  price: number
  servicesOffered: string[]
  shiftTypeId: number
  shiftTypeName: string
  shiftDurationHours: number
}

export interface Service {
  id: string
  name: string
  description: string
  icon: string
  hasGenderPreference: boolean
  genderOptions?: ('male' | 'female')[]
  minimumBookingDays?: number
  subtypes?: ServiceSubtype[]
}

export interface BreakupDayInfo {
  visitPin: string | null
  serviceStartDateTime: string | null
  caregiver: {
    id: string
    name: string
    phone: string | null
    profilePic: string | null
  } | null
}

export interface Booking {
  id: string
  userId: string
  serviceId: string
  serviceName: string
  genderPreference?: 'male' | 'female'
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  notes?: string
  status: 'upcoming' | 'completed' | 'cancelled'
  createdAt: string
  appointmentCode?: string
  serviceCharge?: number
  statusCode?: string
  statusId?: number
  servicesOffered?: string[]
  totalServicePrice?: number
  discountPct?: number
  discountAmount?: number
  finalServiceCharge?: number
  numberOfBreakups?: number
  amountPaid?: number
  isPaymentSettled?: boolean
  breakupByDate?: Record<string, BreakupDayInfo>
  caregiverAssignments?: unknown[]
  unassignedDays?: string[]
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (mobileNumber: string, otp: string) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<void>
}

export interface MetadataContextType {
  services: Service[]
  appointmentStatuses: AppointmentStatus[]
  loading: boolean
  refreshMetadata: () => Promise<void>
}
