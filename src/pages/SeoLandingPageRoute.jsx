import { useParams, Navigate } from 'react-router-dom'
import { getServiceBySlug } from '../data/seoServices'
import { parseCityServiceSlug } from '../data/seoHelpers'
import { seoServices } from '../data/seoServices'
import { cities } from '../data/cities'
import { ServicePage } from './ServicePage'

/**
 * Unified SEO landing page route.
 * Handles: /home-nurse-services, /home-nurse-services-gurugram, etc.
 */
export default function SeoLandingPageRoute() {
  const { slug } = useParams()

  const service = getServiceBySlug(slug)
  if (service) {
    return <ServicePage service={service} />
  }

  const parsed = parseCityServiceSlug(slug, seoServices, cities)
  if (parsed) {
    return <ServicePage service={parsed.service} city={parsed.city} />
  }

  return <Navigate to="/" replace />
}
