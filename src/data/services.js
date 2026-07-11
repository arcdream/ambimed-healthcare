/**
 * Services offered on the homepage — derived from seoServices for consistency.
 */
import { getHomepageServices } from './seoServices'

export const services = getHomepageServices().map((s) => ({
  id: s.id,
  slug: s.slug,
  bookingServiceTypeId: s.bookingServiceTypeId,
  title: s.shortTitle,
  description: s.metaDescriptionBase,
  icon: s.icon,
  image: s.image,
  imageAlt: s.heroImageAlt,
}))
