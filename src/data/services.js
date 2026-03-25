/**
 * Services offered – edit this file to update services on the website.
 *
 * `bookingServiceTypeId` must match `service_types.id` in Supabase (same id used in /app/book/:serviceId).
 * Update these values if your database uses different ids.
 */
export const services = [
  {
    id: 'caregiver-assistant',
    bookingServiceTypeId: '5',
    title: 'Caregiver Assistant',
    description: 'Compassionate, professional care for seniors at home. Daily assistance, companionship, and medication support.',
    icon: 'elder',
    image: '/assets/service-elder-care.png',
  },
  {
    id: 'physiotherapy',
    bookingServiceTypeId: '2',
    title: 'Physiotherapy',
    description: 'Home physiotherapy made easy. Trained physiotherapists for rehabilitation and mobility at your convenience.',
    icon: 'physio',
    image: '/assets/service-physiotherapy.png',
  },
  {
    id: 'home-nurse',
    bookingServiceTypeId: '1',
    title: 'Home Nurse',
    description: 'Skilled nursing care at home—post-surgery, palliative care, and general nursing when you need it.',
    icon: 'nurse',
    image: '/assets/service-home-nurses.png',
  },
  {
    id: 'mother-baby',
    bookingServiceTypeId: '3',
    title: 'Mother Baby Care',
    description: 'Postnatal and newborn care at home. Experienced caregivers for mother and baby wellness.',
    icon: 'baby',
    image: '/assets/service-mother-baby.png',
  },
]
