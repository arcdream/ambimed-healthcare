import { Helmet } from 'react-helmet-async'
import { config } from '../data/config'
import { buildPageUrl } from '../data/seoHelpers'

const DEFAULT_OG_IMAGE = '/assets/hero-caregiver-home.png'

export function SeoHead({
  title,
  description,
  path = '/',
  ogImage = DEFAULT_OG_IMAGE,
  schemas = [],
  noindex = false,
}) {
  const url = buildPageUrl(path)
  const imageUrl = ogImage.startsWith('http') ? ogImage : buildPageUrl(ogImage)

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Ambimed Healthcare" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content="en_IN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}

export function HomeSeoHead() {
  return (
    <SeoHead
      title="Ambimed Healthcare | Home Nursing, Elder Care & Physiotherapy at Home"
      description="Certified home nurses, caregivers, physiotherapists and mother & baby care professionals across India. Book trusted healthcare at home with Ambimed. 25,000+ families served."
      path="/"
      schemas={[
        {
          '@context': 'https://schema.org',
          '@type': 'MedicalBusiness',
          name: 'Ambimed Healthcare',
          url: config.siteUrl,
          logo: buildPageUrl('/assets/ambimed-logo.png'),
          telephone: config.contact.phone.replace(/\s/g, ''),
          email: config.contact.email,
          description: 'Trusted home healthcare services across India.',
          areaServed: 'India',
          openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: '00:00',
            closes: '23:59',
          },
        },
      ]}
    />
  )
}
