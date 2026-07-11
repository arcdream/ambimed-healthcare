import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { config } from '../data/config'
import { SeoHead } from '../components/SeoHead'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import {
  buildPageUrl,
  buildServiceTitle,
  buildServiceDescription,
  buildLocalBusinessSchema,
  buildServiceSchema,
  buildFaqSchema,
  buildBreadcrumbSchema,
} from '../data/seoHelpers'
import { cities } from '../data/cities'
import { getRelatedServices } from '../data/seoServices'
import '../components/Header.css'
import '../components/Footer.css'
import '../components/ServicePage.css'

function StarRating({ count = 5 }) {
  return (
    <span className="sp-stars" aria-label={`${count} out of 5 stars`}>
      {'★'.repeat(count)}
    </span>
  )
}

function ServiceLeadForm({ service, city }) {
  const [submitted, setSubmitted] = useState(false)
  const cityName = city?.displayName || ''

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="sp-form sp-form--success">
        <p className="sp-form-success-title">Request received!</p>
        <p>Our care team will call you within 30 minutes to confirm your {service.shortTitle.toLowerCase()} booking{cityName ? ` in ${cityName}` : ''}.</p>
        <a href={`tel:${config.contact.phone.replace(/\s/g, '')}`} className="sp-form-call">
          Or call {config.contact.phone}
        </a>
      </div>
    )
  }

  return (
    <form className="sp-form" onSubmit={handleSubmit}>
      <h3 className="sp-form-title">Book {service.shortTitle}{cityName ? ` in ${cityName}` : ''}</h3>
      <label className="sp-form-label">
        Full Name
        <input type="text" name="name" required placeholder="Your full name" className="sp-form-input" />
      </label>
      <label className="sp-form-label">
        Phone Number
        <input type="tel" name="phone" required placeholder="+91 XXXXX XXXXX" className="sp-form-input" />
      </label>
      <label className="sp-form-label">
        City
        <input type="text" name="city" defaultValue={cityName} placeholder="Your city" className="sp-form-input" />
      </label>
      <label className="sp-form-label">
        Service Required
        <select name="service" defaultValue={service.slug} className="sp-form-input">
          <option value={service.slug}>{service.title}</option>
        </select>
      </label>
      <button type="submit" className="sp-form-submit">Submit Request</button>
    </form>
  )
}

function FaqAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="sp-faq-list">
      {faqs.map((faq, i) => (
        <div key={faq.question} className={`sp-faq-item${openIndex === i ? ' sp-faq-item--open' : ''}`}>
          <button
            type="button"
            className="sp-faq-question"
            aria-expanded={openIndex === i}
            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
          >
            {faq.question}
            <span className="sp-faq-chevron" aria-hidden>{openIndex === i ? '−' : '+'}</span>
          </button>
          {openIndex === i && <p className="sp-faq-answer">{faq.answer}</p>}
        </div>
      ))}
    </div>
  )
}

export function ServicePage({ service, city = null }) {
  const path = city
    ? `/${service.slug}-${city.slug}`
    : `/${service.slug}`
  const title = buildServiceTitle(service, city)
  const description = buildServiceDescription(service, city)
  const telHref = `tel:${config.contact.phone.replace(/\s/g, '')}`
  const bookHref = `/app/book/${service.bookingServiceTypeId}`
  const themeClass = service.theme === 'pink' ? 'sp--pink' : 'sp--teal'

  const breadcrumbs = [
    { name: 'Home', url: buildPageUrl('/') },
    { name: 'Services', url: buildPageUrl('/#services') },
    ...(city
      ? [
          { name: service.shortTitle, url: buildPageUrl(`/${service.slug}`) },
          { name: city.displayName, url: buildPageUrl(path) },
        ]
      : [{ name: service.shortTitle, url: buildPageUrl(path) }]),
  ]

  const schemas = [
    buildLocalBusinessSchema({ service, city }),
    buildServiceSchema({ service, city, pageUrl: buildPageUrl(path) }),
    buildBreadcrumbSchema(breadcrumbs),
    buildFaqSchema(service.faqs),
  ].filter(Boolean)

  const serviceTestimonials = [
    { name: 'Priya S.', city: city?.displayName || 'Delhi', text: `Ambimed's ${service.shortTitle.toLowerCase()} team was professional, punctual, and caring. Highly recommended for families needing trusted home care.`, rating: 5 },
    { name: 'Ramesh K.', city: city?.displayName || 'Bengaluru', text: `We booked ${service.shortTitle.toLowerCase()} through Ambimed and the experience was seamless — transparent billing and excellent staff quality.`, rating: 5 },
    { name: 'Anita D.', city: city?.displayName || 'Mumbai', text: `The caregiver was well-trained and gentle. Ambimed made it easy to get reliable ${service.shortTitle.toLowerCase()} at home.`, rating: 5 },
  ]

  const relatedServices = getRelatedServices(service.relatedLinks ?? [])

  return (
    <>
      <SeoHead title={title} description={description} path={path} ogImage={service.heroImage} schemas={schemas} />
      <Header />
      <main className={`service-page ${themeClass}`}>
        {/* Hero */}
        <section className="sp-hero">
          <div className="container sp-hero-inner">
            <motion.div
              className="sp-hero-content"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <nav className="sp-breadcrumbs" aria-label="Breadcrumb">
                <Link to="/">Home</Link>
                <span aria-hidden> › </span>
                <Link to="/#services">Services</Link>
                <span aria-hidden> › </span>
                {city ? (
                  <>
                    <Link to={`/${service.slug}`}>{service.shortTitle}</Link>
                    <span aria-hidden> › </span>
                    <span aria-current="page">{city.displayName}</span>
                  </>
                ) : (
                  <span aria-current="page">{service.shortTitle}</span>
                )}
              </nav>

              <h1 className="sp-hero-title">
                {city ? `${service.title} in ${city.displayName}` : service.title}
              </h1>
              <p className="sp-hero-tagline">{service.heroTagline}</p>
              {city && (
                <p className="sp-hero-local">
                  Trusted {service.shortTitle.toLowerCase()} professionals serving families in {city.displayName} and nearby areas.
                </p>
              )}

              <div className="sp-hero-actions">
                <Link to={bookHref} className="sp-btn sp-btn--primary">{service.ctaBook}</Link>
                <a href={telHref} className="sp-btn sp-btn--secondary">{service.ctaCall}</a>
              </div>

              <ul className="sp-trust-badges">
                {service.trustBadges.map((badge) => (
                  <li key={badge} className="sp-trust-badge">
                    <span className="sp-trust-icon" aria-hidden>✓</span>
                    {badge}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="sp-hero-visual"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <img
                src={service.heroImage}
                alt={city ? `${service.heroImageAlt} in ${city.displayName}` : service.heroImageAlt}
                width={560}
                height={420}
                className="sp-hero-image"
              />
            </motion.div>
          </div>
        </section>

        {/* Offerings */}
        <section className="sp-section sp-offerings">
          <div className="container">
            <p className="sp-section-label">OUR {service.shortTitle.toUpperCase()} SERVICES</p>
            <h2 className="sp-section-title">{service.offeringsTitle}</h2>
            <div className="sp-offerings-grid">
              {service.offerings.map((item, i) => (
                <motion.article
                  key={item.title}
                  className="sp-offering-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <span className="sp-offering-icon" aria-hidden>{item.icon}</span>
                  <h3 className="sp-offering-title">{item.title}</h3>
                  <p className="sp-offering-desc">{item.description}</p>
                </motion.article>
              ))}
            </div>
            <div className="sp-section-cta">
              <Link to={bookHref} className="sp-btn sp-btn--primary">View All Services</Link>
            </div>
          </div>
        </section>

        {/* Why Choose */}
        <section className="sp-section sp-why">
          <div className="container">
            <p className="sp-section-label">WHY CHOOSE AMBIMED</p>
            <h2 className="sp-section-title">Your Care. Our Priority.</h2>
            <div className="sp-why-grid">
              {service.whyChoose.map((item, i) => (
                <motion.div
                  key={item.title}
                  className="sp-why-item"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className="sp-why-icon" aria-hidden>
                    <svg viewBox="0 0 48 48" width="48" height="48" fill="none">
                      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
                      <path d="M16 24l5 5 11-11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="sp-why-title">{item.title}</h3>
                  <p className="sp-why-desc">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="sp-section sp-how">
          <div className="container sp-how-inner">
            <div className="sp-how-visual">
              <img
                src={service.heroImage}
                alt={service.heroImageAlt}
                width={480}
                height={360}
                loading="lazy"
                className="sp-how-image"
              />
            </div>
            <div className="sp-how-content">
              <p className="sp-section-label">HOW IT WORKS</p>
              <h2 className="sp-section-title">
                Simple Steps to Get {service.shortTitle}{city ? ` in ${city.displayName}` : ''} at Home
              </h2>
              <ol className="sp-steps">
                {service.howItWorks.map((step, i) => (
                  <li key={step.title} className="sp-step">
                    <span className="sp-step-num">{i + 1}</span>
                    <div>
                      <h3 className="sp-step-title">{step.title}</h3>
                      <p className="sp-step-desc">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="sp-section sp-testimonials">
          <div className="container">
            <p className="sp-section-label">WHAT FAMILIES SAY</p>
            <h2 className="sp-section-title">Trusted by Thousands of Families</h2>
            <div className="sp-testimonials-grid">
              {serviceTestimonials.map((t) => (
                <article key={t.name} className="sp-testimonial-card">
                  <StarRating count={t.rating} />
                  <blockquote className="sp-testimonial-text">&ldquo;{t.text}&rdquo;</blockquote>
                  <p className="sp-testimonial-author">— {t.name}, {t.city}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="sp-section sp-content">
          <div className="container sp-content-inner">
            {service.contentSections.map((section) => (
              <div key={section.heading} className="sp-content-block">
                <h2>{section.heading}</h2>
                <p>{section.body}</p>
              </div>
            ))}
            <div className="sp-content-block">
              <h2>Pricing</h2>
              <p>{service.pricingNote}</p>
            </div>
            {city && (
              <div className="sp-content-block">
                <h2>Areas Served in {city.displayName}</h2>
                <p>
                  Ambimed provides {service.shortTitle.toLowerCase()} across {city.displayName} and surrounding neighbourhoods.
                  Whether you are in the city centre or the outskirts, our verified professionals are ready to serve your family.
                  We also operate in {cities.filter((c) => c.slug !== city.slug).slice(0, 5).map((c) => c.displayName).join(', ')}, and more.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* FAQ + Form */}
        <section className="sp-section sp-faq-form">
          <div className="container sp-faq-form-inner">
            <div className="sp-faq-col">
              <h2 className="sp-faq-heading">Common Questions</h2>
              <FaqAccordion faqs={service.faqs} />
            </div>
            <div className="sp-form-col">
              <ServiceLeadForm service={service} city={city} />
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="sp-bottom-cta">
          <div className="container sp-bottom-cta-inner">
            <div className="sp-bottom-cta-item">
              <span className="sp-bottom-cta-icon" aria-hidden>📞</span>
              <div>
                <p className="sp-bottom-cta-label">Need help? Call us anytime</p>
                <a href={telHref} className="sp-bottom-cta-phone">{config.contact.phone}</a>
              </div>
            </div>
            <div className="sp-bottom-cta-item">
              <span className="sp-bottom-cta-icon" aria-hidden>🎧</span>
              <p className="sp-bottom-cta-label">24/7 Support</p>
            </div>
            <div className="sp-bottom-cta-item">
              <span className="sp-bottom-cta-icon" aria-hidden>⏱️</span>
              <p className="sp-bottom-cta-label">Quick Response Within 30 Minutes</p>
            </div>
            <Link to={bookHref} className="sp-btn sp-btn--primary sp-bottom-cta-btn">{service.ctaBook}</Link>
          </div>
        </section>

        {/* Related services — internal linking for SEO */}
        {relatedServices.length > 0 && (
          <section className="sp-section sp-related">
            <div className="container">
              <h2 className="sp-section-title">Related Services</h2>
              <ul className="sp-cities-list">
                {relatedServices.map((related) => (
                  <li key={related.slug}>
                    <Link to={`/${related.slug}`}>{related.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* City links for service pages */}
        {!city && (
          <section className="sp-section sp-cities">
            <div className="container">
              <h2 className="sp-section-title">{service.shortTitle} by City</h2>
              <p className="sp-cities-intro">Find {service.shortTitle.toLowerCase()} services in your city:</p>
              <ul className="sp-cities-list">
                {cities.map((c) => (
                  <li key={c.slug}>
                    <Link to={`/${service.slug}-${c.slug}`}>
                      {service.shortTitle} in {c.displayName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
