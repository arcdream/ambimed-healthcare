import { motion } from 'framer-motion'
import './About.css'

export function About() {
  return (
    <section id="about" className="section section-about">
      <div className="container about-inner">
        <motion.div
          className="about-content"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <p className="section-subtitle">Who we are</p>
          <h2 className="section-title">About Ambimed Healthcare</h2>
          <p className="about-text">
            We bring trusted healthcare to your doorstep—elder care, physiotherapy, home nurses,
            and mother & baby care. Our mission is to make quality care accessible and affordable.
          </p>
          <p className="about-text">
            We are motivated by serving society. Every caregiver is well trained and well groomed,
            and we keep our pricing very reasonable so more families can benefit.
          </p>
          <ul className="about-list">
            <li>Well-trained, well-groomed caregivers</li>
            <li>Transparent billing and easy booking</li>
            <li>Reasonable prices</li>
            <li>Committed to serving society</li>
          </ul>
        </motion.div>
        <motion.div
          className="about-visual"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="about-image-wrap">
            <img
              src="/assets/about-care-at-home.png"
              alt="Ambimed care at home"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling?.classList.remove('hide'); }}
            />
            <div className="about-placeholder hide">
              <span className="about-placeholder-text">Care at home</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
