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

/** 24-hour live-in disclaimers (shown under catalogue line for these services only). */
const LIVE_IN_DISCLAIMERS = {
  nurse: { title: 'Nurse', range: '₹1,318 – ₹3,000', accent: 'nurse' },
  caregiver: { title: 'Caregiver', range: '₹1,060 – ₹2,000', accent: 'caregiver' },
}

function liveInDisclaimerKey(svc) {
  const name = (svc.name || '').toLowerCase()
  if (name.includes('home nurse')) return 'nurse'
  if (name.includes('caregiver')) return 'caregiver'
  const id = String(svc.id ?? '')
  if (id === '1') return 'nurse'
  if (id === '5') return 'caregiver'
  return null
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
                        const discKey = liveInDisclaimerKey(svc)
                        const showLiveInNote =
                          sub.shiftDurationHours === 24 && discKey && LIVE_IN_DISCLAIMERS[discKey]
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
                            {showLiveInNote ? (
                              <div
                                className={`services-pricing-livein services-pricing-livein--${LIVE_IN_DISCLAIMERS[discKey].accent}`}
                                role="note"
                              >
                                <div className="services-pricing-livein__icon" aria-hidden>
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path
                                      d="M12 16v-4M12 8h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"
                                      stroke="currentColor"
                                      strokeWidth="1.75"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                </div>
                                <div className="services-pricing-livein__body">
                                  <span className="services-pricing-livein__kicker">24-hour live-in · indicative range</span>
                                  <p className="services-pricing-livein__role">{LIVE_IN_DISCLAIMERS[discKey].title}</p>
                                  <p className="services-pricing-livein__range">
                                    Pricing: <strong>{LIVE_IN_DISCLAIMERS[discKey].range}</strong>
                                  </p>
                                  <p className="services-pricing-livein__hint">Depends on requirements.</p>
                                </div>
                              </div>
                            ) : null}
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
