import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { SeoHead } from '../components/SeoHead'
import { seoServices } from '../data/seoServices'
import '../components/Header.css'
import '../components/Footer.css'
import '../components/Services.css'

export default function ServicesIndexPage() {
  return (
    <>
      <SeoHead
        title="Home Healthcare Services | Ambimed"
        description="Home nursing, elder care, caregivers, physiotherapy, mother & baby care, ICU care, and more. Book trusted healthcare at home across India."
        path="/services"
      />
      <Header />
      <main className="section" style={{ paddingTop: '6.5rem' }}>
        <div className="container">
          <p className="section-subtitle">What we offer</p>
          <h1 className="section-title">All Home Healthcare Services</h1>
          <p className="section-subheading">
            Professional, verified healthcare at home — book online with transparent pricing.
          </p>
          <div className="services-grid">
            {seoServices.map((item) => (
              <Link
                key={item.slug}
                to={`/${item.slug}`}
                className="service-card-link"
                aria-label={`Learn about ${item.title}`}
              >
                <article className="service-card">
                  {item.image && (
                    <div className="service-card-image-wrap">
                      <img src={item.image} alt={item.heroImageAlt} loading="lazy" />
                    </div>
                  )}
                  <h2 className="service-title">{item.title}</h2>
                  <p className="service-desc">{item.metaDescriptionBase}</p>
                  <span className="service-card-cta">View service →</span>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
