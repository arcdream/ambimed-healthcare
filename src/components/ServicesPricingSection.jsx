import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { metadataService } from '../client-app/services/metadataService'
import { fetchDefaultDiscount } from '../client-app/services/discountService'
import { supabaseConfigured } from '../client-app/lib/supabase'
import './ServicesPricingSection.css'

function formatInr(n) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(n)
}

function discountedAmount(price, discountPct) {
  if (!discountPct || discountPct <= 0) return price
  return Math.round((price * (100 - discountPct)) / 100)
}

export function ServicesPricingSection() {
  const [services, setServices] = useState([])
  const [discountPct, setDiscountPct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!supabaseConfigured) {
        setLoading(false)
        setError(true)
        return
      }
      setLoading(true)
      setError(false)
      try {
        const [svc, disc] = await Promise.all([
          metadataService.fetchServicesMetadata(),
          fetchDefaultDiscount(),
        ])
        if (cancelled) return
        setServices(svc ?? [])
        const pct = disc?.discountPct ?? 0
        setDiscountPct(Number.isFinite(pct) ? pct : 0)
      } catch (e) {
        console.error(e)
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const showDiscount = discountPct != null && discountPct > 0

  return (
    <section id="services-pricing" className="section section-services-pricing" aria-labelledby="services-pricing-heading">
      <div className="container services-pricing-inner">
        <div className="services-pricing-header">
          {showDiscount && (
            <motion.div
              className="services-pricing-promo-pill"
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <span className="services-pricing-promo-pill__spark" aria-hidden>
                ✦
              </span>
              <span>
                Up to <strong>{discountPct}% off</strong> on eligible bookings
              </span>
            </motion.div>
          )}
          <motion.p
            className="section-subtitle services-pricing-subtitle"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Plans &amp; savings
          </motion.p>
          <motion.h2
            id="services-pricing-heading"
            className="section-title services-pricing-title"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.04 }}
          >
            Services, prices &amp; discounts
          </motion.h2>
          <motion.p
            className="services-pricing-lead"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
          >
            Real numbers from our catalogue—no hidden fees. Save more when you book with our current
            offers.
          </motion.p>
        </div>

        {loading && (
          <div className="services-pricing-skeleton" aria-busy="true" aria-label="Loading prices">
            {[1, 2, 3].map((i) => (
              <div key={i} className="services-pricing-skeleton-card" />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="services-pricing-fallback">
            Pricing is loading from our system. For the latest rates and offers,{' '}
            <a href="#contact">contact us</a> or open booking to see live plans.
          </p>
        )}

        {!loading && !error && services.length === 0 && (
          <p className="services-pricing-fallback">
            Service plans will appear here once configured. <a href="#contact">Get in touch</a> for a
            quote.
          </p>
        )}

        {!loading && !error && services.length > 0 && (
          <div className="services-pricing-grid">
            {services.map((svc, si) => {
              const subtypes = svc.subtypes ?? []
              return (
                <motion.article
                  key={svc.id}
                  className="services-pricing-card"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: si * 0.06 }}
                >
                  <div className="services-pricing-card__top">
                    <h3 className="services-pricing-card__title">{svc.name}</h3>
                    {svc.description ? (
                      <p className="services-pricing-card__desc">{svc.description}</p>
                    ) : null}
                  </div>
                  {subtypes.length === 0 ? (
                    <div className="services-pricing-card__empty">
                      <span>Flexible plans — pick duration when you book.</span>
                      <Link className="services-pricing-book" to={`/app/book/${svc.id}`}>
                        View plans &amp; book
                      </Link>
                    </div>
                  ) : (
                    <ul className="services-pricing-lines">
                      {subtypes.map((sub) => {
                        const orig = sub.price
                        const deal = discountedAmount(orig, discountPct ?? 0)
                        return (
                          <li key={sub.id} className="services-pricing-line">
                            <div className="services-pricing-line__meta">
                              <span className="services-pricing-line__name">{sub.userFriendlyName}</span>
                              <span className="services-pricing-line__detail">
                                {sub.shiftTypeName}
                                {sub.shiftDurationHours ? ` · ${sub.shiftDurationHours}h` : ''}
                              </span>
                            </div>
                            <div className="services-pricing-line__price">
                              {showDiscount && deal < orig ? (
                                <>
                                  <span className="services-pricing-line__strike">
                                    {formatInr(orig)}
                                  </span>
                                  <span className="services-pricing-line__deal">
                                    {formatInr(deal)}
                                  </span>
                                  <span className="services-pricing-line__badge">{discountPct}% off</span>
                                </>
                              ) : (
                                <span className="services-pricing-line__deal">{formatInr(orig)}</span>
                              )}
                              <span className="services-pricing-line__unit">/ day</span>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                  {subtypes.length > 0 && (
                    <div className="services-pricing-card__foot">
                      <Link className="services-pricing-book" to={`/app/book/${svc.id}`}>
                        Book {svc.name}
                      </Link>
                    </div>
                  )}
                </motion.article>
              )
            })}
          </div>
        )}

        {!loading && !error && services.length > 0 && (
          <>
            <motion.p
              className="services-pricing-footnote"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Prices reflect our catalogue; final totals may vary by dates and add-ons. Discount applies
              where eligible per our terms.
            </motion.p>
            <motion.p
              className="services-pricing-caregiver-note"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Prices may vary slightly based on the experience and qualifications of the caregiver.
            </motion.p>
          </>
        )}
      </div>
    </section>
  )
}
