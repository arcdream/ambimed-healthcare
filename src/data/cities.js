/**
 * Cities where Ambimed operates — used for local SEO landing pages.
 */
export const cities = [
  { slug: 'delhi', name: 'Delhi', displayName: 'Delhi' },
  { slug: 'bengaluru', name: 'Bengaluru', displayName: 'Bengaluru' },
  { slug: 'kolkata', name: 'Kolkata', displayName: 'Kolkata' },
  { slug: 'mumbai', name: 'Mumbai', displayName: 'Mumbai' },
  { slug: 'ahmedabad', name: 'Ahmedabad', displayName: 'Ahmedabad' },
  { slug: 'lucknow', name: 'Lucknow', displayName: 'Lucknow' },
  { slug: 'chennai', name: 'Chennai', displayName: 'Chennai' },
  { slug: 'noida', name: 'Noida', displayName: 'Noida' },
  { slug: 'gurugram', name: 'Gurugram', displayName: 'Gurgaon' },
  { slug: 'ghaziabad', name: 'Ghaziabad', displayName: 'Ghaziabad' },
  { slug: 'faridabad', name: 'Faridabad', displayName: 'Faridabad' },
  { slug: 'pune', name: 'Pune', displayName: 'Pune' },
]

export function getCityBySlug(slug) {
  return cities.find((c) => c.slug === slug) ?? null
}
