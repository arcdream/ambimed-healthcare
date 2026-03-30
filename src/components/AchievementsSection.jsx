import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './AchievementsSection.css'

const CERT_DPIIT = '/assets/certificates/dpiit-startup-india.png'
const CERT_UP = '/assets/certificates/startup-up-lucknow.png'

const items = [
  {
    id: 'dpiit',
    title: 'DPIIT startup recognition',
    subtitle: 'Certificate of recognition — #StartupIndia',
    body:
      'Ambimed Healthcare Private Limited is recognized as a startup by the Department for Promotion of Industry and Internal Trade (DPIIT), Ministry of Commerce & Industry, Government of India. Our focus areas are Healthcare & Lifesciences and Healthcare IT.',
    meta: 'Certificate no. DIPP129622 · Issued April 2023 · Valid through April 2033',
    image: CERT_DPIIT,
    imageAlt:
      'Certificate of Recognition from DPIIT, Ministry of Commerce & Industry, Government of India for Ambimed Healthcare Private Limited',
  },
  {
    id: 'startup-up',
    title: 'Start In UP — registered startup',
    subtitle: 'Certificate of registration',
    body:
      'Recognized as a startup by the Department of IT & Electronics, Government of Uttar Pradesh, through Uttar Pradesh Electronics Corporation Ltd. (UPLC), under the Start In UP initiative.',
    meta: 'Registration no. R/STARTUP/UP/LKO/2023/00005105 · Issued 25 April 2023, Lucknow',
    image: CERT_UP,
    imageAlt:
      'Certificate of Registration under Start In UP for Ambimed Healthcare as a private limited startup',
  },
]

export function AchievementsSection() {
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [lightbox])

  return (
    <section id="achievements" className="section section-achievements" aria-labelledby="achievements-heading">
      <div className="container">
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Trust & credibility
        </motion.p>
        <motion.h2
          id="achievements-heading"
          className="section-title"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.04 }}
        >
          Achievements &amp; recognition
        </motion.h2>
        <motion.p
          className="achievements-lead"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
        >
          We are proud to carry official startup recognition at the national and state level—reflecting our
          commitment to compliant, technology-enabled home healthcare.
        </motion.p>

        <div className="achievements-grid">
          {items.map((item, i) => (
            <motion.article
              key={item.id}
              className="achievements-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-32px' }}
              transition={{ delay: i * 0.08 }}
            >
              <button
                type="button"
                className="achievements-card__thumb-wrap"
                onClick={() => setLightbox(item.id)}
                aria-label={`View larger: ${item.title}`}
              >
                <img className="achievements-card__thumb" src={item.image} alt={item.imageAlt} loading="lazy" />
                <span className="achievements-card__zoom-hint">Tap to enlarge</span>
              </button>
              <h3 className="achievements-card__title">{item.title}</h3>
              <p className="achievements-card__subtitle">{item.subtitle}</p>
              <p className="achievements-card__body">{item.body}</p>
              <p className="achievements-card__meta">{item.meta}</p>
            </motion.article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="achievements-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Certificate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="achievements-lightbox__inner"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="achievements-lightbox__close"
                onClick={() => setLightbox(null)}
                aria-label="Close"
              >
                ✕
              </button>
              <img
                src={items.find((x) => x.id === lightbox)?.image}
                alt={items.find((x) => x.id === lightbox)?.imageAlt ?? ''}
                className="achievements-lightbox__img"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
