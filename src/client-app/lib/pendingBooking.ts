/**
 * Persists booking choices for guests (before sign-in) and full review payload after address is set.
 */
const STORAGE_KEY = 'ambimed_pending_booking_v1'

export type AddressDraft = {
  houseAddress: string
  streetAddress: string
  city: string
  state: string
  pincode: string
  country?: string
}

export type ReviewLocationState = {
  serviceId: string
  serviceTypeId: string
  serviceName: string
  servicesOffered: string[]
  genderPreference: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  notes: string
  addressId?: string
  /** Set once visit address is chosen (logged-in) */
  addressDisplay?: string
  /** Present when the user was a guest — address is created on confirm after login */
  addressDraft?: AddressDraft
}

export function savePendingBookingDraft(state: ReviewLocationState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* ignore quota / private mode */
  }
}

export function getPendingBookingDraft(): ReviewLocationState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as ReviewLocationState
  } catch {
    return null
  }
}

export function clearPendingBookingDraft(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
