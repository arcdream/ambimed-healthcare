import { motion } from 'framer-motion'
import { config } from '../data/config'
import './Contact.css'

const CONTACT = config.contact

export function Contact() {
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
          className="contact-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="contact-grid">
            <div className="contact-item">
              <span className="contact-label">Phone</span>
              <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="contact-value">
                {CONTACT.phone}
              </a>
            </div>
            <div className="contact-item">
              <span className="contact-label">Email</span>
              <a href={`mailto:${CONTACT.email}`} className="contact-value">
                {CONTACT.email}
              </a>
            </div>
          </div>
          <p className="contact-note">
            For bookings and enquiries, call or email us. We’re here to help you arrange
            elder care, physiotherapy, home nurses, or mother & baby care.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
