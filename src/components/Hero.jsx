import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-bg" aria-hidden />
      <div className="container hero-inner">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="hero-badge">Trusted Home Healthcare</p>
          <h1 className="hero-title">
            Care when you need it — <span className="hero-highlight">at home</span>
          </h1>
          <p className="hero-desc">
            Elder care, physiotherapy, home nurses, and mother & baby care. Well-trained,
            well-groomed caregivers. Easy booking, transparent billing.
          </p>
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <a href="#contact" className="btn btn-primary" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>Book care</a>
            <a href="#services" className="btn btn-secondary" onClick={(e) => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }}>Our services</a>
          </motion.div>
        </motion.div>
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="hero-image-wrap">
            <img src="/assets/hero-caregiver-home.png" alt="Caregiver welcomed at home by family" />
          </div>
          <div className="hero-card">
            <p className="hero-card-title">Easy Booking. Transparent Billing.</p>
            <p className="hero-card-sub">Trusted care for your family</p>
            <div className="hero-card-steps">
              <span>Tap</span>
              <span className="arrow">→</span>
              <span>Confirm</span>
              <span className="arrow">→</span>
              <span>Caregiver arrives</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
