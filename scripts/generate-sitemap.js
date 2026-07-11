/**
 * Generates public/sitemap.xml from service and city data.
 * Run: node scripts/generate-sitemap.js
 */
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const siteUrl = 'https://www.ambimed.in'

const services = [
  'home-nurse-services',
  'home-nursing-near-me',
  'home-care-nurse',
  'patient-care-at-home',
  'icu-care-at-home',
  'caregiver-services',
  'general-duty-assistant',
  'home-caregiver',
  'elder-care-services',
  'senior-citizen-care',
  'home-attendant-services',
  'mother-and-baby-care',
  'japa-care-services',
  'post-delivery-care',
  'newborn-baby-care',
  'home-physiotherapy-services',
  'physiotherapist-at-home',
  'rehabilitation-at-home',
  'home-healthcare-services',
  'best-home-healthcare-company',
]

const cities = [
  'delhi', 'bengaluru', 'kolkata', 'mumbai', 'ahmedabad', 'lucknow',
  'chennai', 'noida', 'gurugram', 'ghaziabad', 'faridabad', 'pune',
]

const blogPosts = [
  'how-to-choose-home-nurse',
  'cost-of-home-nursing-gurgaon',
  'signs-parents-need-elder-care',
]

const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/app/booking', priority: '0.9', changefreq: 'weekly' },
  { loc: '/services', priority: '0.9', changefreq: 'weekly' },
  { loc: '/blog', priority: '0.8', changefreq: 'weekly' },
  { loc: '/terms', priority: '0.6', changefreq: 'monthly' },
]

const urls = [...staticPages]

for (const slug of services) {
  urls.push({ loc: `/${slug}`, priority: '0.9', changefreq: 'weekly' })
}

for (const service of services) {
  for (const city of cities) {
    urls.push({ loc: `/${service}-${city}`, priority: '0.85', changefreq: 'weekly' })
  }
}

for (const slug of blogPosts) {
  urls.push({ loc: `/blog/${slug}`, priority: '0.7', changefreq: 'monthly' })
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${siteUrl}${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

const outPath = join(__dirname, '..', 'public', 'sitemap.xml')
writeFileSync(outPath, xml, 'utf8')
console.log(`Sitemap written: ${outPath} (${urls.length} URLs)`)
