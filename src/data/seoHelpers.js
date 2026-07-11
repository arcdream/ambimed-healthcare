import { config } from './config'
import { serviceSlugs } from './seoServices'

export function buildPageUrl(path) {
  const base = config.siteUrl.replace(/\/$/, '')
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}

export function buildServiceTitle(service, city = null) {
  if (city) {
    return `${service.title} in ${city.displayName} | Ambimed`
  }
  return `${service.title} | Ambimed`
}

export function buildServiceDescription(service, city = null) {
  if (city) {
    return `Certified ${service.primaryKeyword} in ${city.displayName}. ${service.metaDescriptionBase} Book with Ambimed.`
  }
  return service.metaDescriptionBase
}

export function buildCityServiceSlug(serviceSlug, citySlug) {
  return `${serviceSlug}-${citySlug}`
}

/** Match city-service URLs like /home-nurse-services-gurugram — longest slug first */
export function parseCityServiceSlug(slug, services, cities) {
  const sorted = [...services].sort((a, b) => b.slug.length - a.slug.length)
  for (const city of cities) {
    const suffix = `-${city.slug}`
    if (slug.endsWith(suffix)) {
      const serviceSlug = slug.slice(0, -suffix.length)
      const service = sorted.find((s) => s.slug === serviceSlug)
      if (service) return { service, city }
    }
  }
  return null
}

export function isServiceSlug(slug) {
  return serviceSlugs.includes(slug)
}

export function buildLocalBusinessSchema({ service, city }) {
  const areaServed = city ? city.displayName : 'India'
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: 'Ambimed Healthcare',
    url: config.siteUrl,
    logo: buildPageUrl('/assets/ambimed-logo.png'),
    image: buildPageUrl(service?.heroImage || '/assets/hero-caregiver-home.png'),
    telephone: config.contact.phone.replace(/\s/g, ''),
    email: config.contact.email,
    description: buildServiceDescription(service, city),
    areaServed: {
      '@type': 'City',
      name: areaServed,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    priceRange: '₹₹',
    sameAs: Object.values(config.social).filter((u) => u && u !== '#'),
  }
}

export function buildServiceSchema({ service, city, pageUrl }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: city ? `${service.title} in ${city.displayName}` : service.title,
    description: buildServiceDescription(service, city),
    provider: {
      '@type': 'MedicalBusiness',
      name: 'Ambimed Healthcare',
      url: config.siteUrl,
    },
    areaServed: city
      ? { '@type': 'City', name: city.displayName }
      : { '@type': 'Country', name: 'India' },
    url: pageUrl,
    serviceType: service.primaryKeyword,
  }
}

export function buildFaqSchema(faqs) {
  if (!faqs?.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function buildBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
