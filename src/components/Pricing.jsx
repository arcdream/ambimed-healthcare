import { motion } from 'framer-motion'
import './Pricing.css'

export function Pricing() {
  return (
    <section id="pricing" className="section section-pricing">
      <div className="container">
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Value for you
        </motion.p>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Very reasonable pricing
        </motion.h2>
        <motion.div
          className="pricing-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="pricing-text">
            We keep our prices fair and transparent so that more families can access quality
            home care. No hidden charges—you see what you pay. Contact us for a quote
            tailored to your needs.
          </p>
          <div className="pricing-cta">
            <a href="#contact" className="btn btn-primary" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>Get a quote</a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
