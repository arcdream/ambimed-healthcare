import { motion } from 'framer-motion'
import { config } from '../data/config'
import './Apps.css'

export function Apps() {
  return (
    <section id="apps" className="section section-apps">
      <div className="container">
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Mobile Apps
        </motion.p>

        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Our Apps
        </motion.h2>

        <motion.h3
          className="section-subheading"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Book healthcare services or join as a caregiver partner
        </motion.h3>

        <motion.div
          className="apps-grid"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Featured Client App */}
          <div className="app-card featured">
            <span className="app-badge">TO BOOK SERVICES</span>

            <h4 className="app-card-title">
              AmbiMed Healthcare
            </h4>

            <p className="app-card-desc">
              Book nurses, attendants, caregivers, physiotherapy and home
              healthcare services directly from your mobile phone.
            </p>

            <ul className="app-features">
              <li>Book healthcare services instantly</li>
              <li>Track and manage appointments</li>
              <li>Secure booking experience</li>
              <li>Fast support and updates</li>
            </ul>

            <a
              href={config.clientAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="play-badge-link"
            >
              <img
                src="/assets/google-play-badge.svg"
                alt="Get it on Google Play"
                className="google-play-badge"
              />
            </a>
          </div>

          {/* Caregiver App */}
          <div className="app-card">
            <h4 className="app-card-title">
              AmbiMed Caregiver Partner
            </h4>

            <p className="app-card-desc">
              Designed for nurses, attendants and caregivers who provide
              healthcare services through the AmbiMed platform.
            </p>

            <ul className="app-features">
              <li>Receive service requests</li>
              <li>Manage schedules</li>
              <li>Track assignments</li>
              <li>Grow your professional network</li>
            </ul>

            <a
              href={config.caregiverAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="play-badge-link"
            >
              <img
                src="/assets/google-play-badge.svg"
                alt="Get it on Google Play"
                className="google-play-badge"
              />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}