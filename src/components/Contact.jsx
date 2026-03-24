import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { config } from '../data/config'
import { TERMS_PDF_URL } from '../data/legal'
import './Contact.css'

const LOGO_IMG = '/assets/ambimed-logo.png'

const CONTACT = config.contact
const SOCIAL = config.social
const CITIES = config.citiesOperating ?? []

export function Contact() {
  const telHref = `tel:${CONTACT.phone.replace(/\s/g, '')}`
  const waHref = CONTACT.whatsapp ? `https://wa.me/${String(CONTACT.whatsapp).replace(/\D/g, '')}` : null

  return (
    <section id="contact" className="section section-contact">
      <div className="container">
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Get in touch
        </motion.p>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Contact us
        </motion.h2>

        <motion.div
          className="contact-ref"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="contact-ref-grid">
            <div className="contact-ref-col contact-ref-col-brand">
              <Link to="/" className="contact-ref-logo-wrap">
                <img src={LOGO_IMG} alt="Ambimed" className="contact-ref-logo" />
              </Link>
              <p className="contact-ref-intro">{CONTACT.contactIntro}</p>

              <h3 className="contact-ref-heading">Contact us</h3>
              <p className="contact-ref-line">
                <span className="contact-ref-label">Customer care</span>
                <a href={telHref} className="contact-ref-link">
                  {CONTACT.phone}
                </a>
              </p>
              {waHref && (
                <p className="contact-ref-line">
                  <span className="contact-ref-label">Ambimed WhatsApp</span>
                  <a href={waHref} className="contact-ref-link" target="_blank" rel="noopener noreferrer">
                    {CONTACT.phone}
                  </a>
                </p>
              )}
              <p className="contact-ref-line contact-ref-email-line">
                <span className="contact-ref-label">Email</span>
                <a href={`mailto:${CONTACT.email}`} className="contact-ref-link contact-ref-email">
                  {CONTACT.email}
                </a>
              </p>

              <ul className="contact-social">
                <li>
                  <a href={SOCIAL.facebook} className="contact-social-link" target="_blank" rel="noopener noreferrer" aria-label="Ambimed on Facebook">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href={SOCIAL.instagram} className="contact-social-link" target="_blank" rel="noopener noreferrer" aria-label="Ambimed on Instagram">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href={SOCIAL.x} className="contact-social-link" target="_blank" rel="noopener noreferrer" aria-label="Ambimed on X">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href={SOCIAL.youtube} className="contact-social-link" target="_blank" rel="noopener noreferrer" aria-label="Ambimed on YouTube">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href={SOCIAL.linkedin} className="contact-social-link" target="_blank" rel="noopener noreferrer" aria-label="Ambimed on LinkedIn">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>

            <div className="contact-ref-col">
              <h3 className="contact-ref-heading">Cities Operating</h3>
              <ul className="contact-ref-list contact-ref-list--cities">
                {CITIES.map((city) => (
                  <li key={city}>Ambimed {city}</li>
                ))}
              </ul>
            </div>

            <div className="contact-ref-col">
              <h3 className="contact-ref-heading">Company</h3>
              <ul className="contact-ref-list contact-ref-list-links">
                <li>
                  <a href={config.privacyPolicyUrl} className="contact-ref-company-link">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href={TERMS_PDF_URL} className="contact-ref-company-link" target="_blank" rel="noopener noreferrer">
                    Terms &amp; Conditions
                  </a>
                </li>
                <li>
                  <Link to="/app/booking" className="contact-ref-company-link">
                    Book care
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
