import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
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
          Mobile apps
        </motion.p>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Our apps
        </motion.h2>
        <motion.div
          className="apps-coming-soon"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="apps-coming-soon-text">
            <strong>Coming soon.</strong> Our mobile apps aren’t ready yet — we’re finishing the experience for clients and
            caregivers. You can still book care on the web anytime.
          </p>
          <Link to="/app/booking" className="btn btn-primary apps-book-link">
            Book care on the web
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
