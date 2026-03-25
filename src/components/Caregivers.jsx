import { motion } from 'framer-motion'
import './Caregivers.css'

export function Caregivers() {
  return (
    <section id="caregivers" className="section section-caregivers">
      <div className="container">
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Our people
        </motion.p>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Well-trained, well-groomed caregivers
        </motion.h2>
        <motion.h3
          className="section-subheading"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
        >
          What we look for in every caregiver
        </motion.h3>
        <motion.div
          className="caregivers-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="caregivers-image-wrap">
            <img src="/assets/elder-care-home.png" alt="Caregiver assisting elderly client at home" />
          </div>
          <p className="caregivers-text">
            Every Ambimed caregiver is trained and groomed to the highest standards. We believe
            that quality care starts with quality people—professional, empathetic, and dedicated
            to your family’s comfort and safety.
          </p>
          <ul className="caregivers-list">
            <li>Rigorous training and background checks</li>
            <li>Uniform and professional appearance</li>
            <li>Compassionate and respectful</li>
            <li>Skilled in elder care, nursing, physio, and mother & baby care</li>
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
