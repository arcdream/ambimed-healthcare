import { motion } from 'framer-motion'
import './Mission.css'

export function Mission() {
  return (
    <section id="mission" className="section section-mission">
      <div className="container">
        <motion.div
          className="mission-card"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="section-subtitle mission-subtitle">Our motivation</p>
          <h2 className="mission-title">We are motivated by serving society</h2>
          <h3 className="mission-subheading">Dependable care for families and communities</h3>
          <p className="mission-text">
            Ambimed exists to bring dependable, affordable healthcare to your home. Every service we
            offer—elder care, physiotherapy, home nurses, mother & baby care—is driven by a simple
            goal: to serve families and society with integrity and compassion.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
