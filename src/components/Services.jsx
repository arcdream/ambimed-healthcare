import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { services } from '../data/services'
import './Services.css'

const icons = {
  elder: '👴',
  physio: '🏥',
  nurse: '🩺',
  baby: '👶',
}

export function Services() {
  return (
    <section id="services" className="section section-services">
      <div className="container">
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          What we offer
        </motion.p>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
        >
          Our services
        </motion.h2>
        <div className="services-grid">
          {services.map((item, i) => (
            <Link
              key={item.id}
              to={`/${item.slug}`}
              className="service-card-link"
              aria-label={`Learn about ${item.title}`}
            >
              <motion.article
                className="service-card"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                {item.image && (
                  <div className="service-card-image-wrap">
                    <img src={item.image} alt={item.imageAlt || item.title} loading="lazy" />
                  </div>
                )}
                <span className="service-icon" aria-hidden>{icons[item.icon] || '•'}</span>
                <h3 className="service-title">{item.title}</h3>
                <p className="service-desc">{item.description}</p>
                <span className="service-card-cta">View service →</span>
              </motion.article>
            </Link>
          ))}
        </div>
        <p className="services-more">
          <Link to="/services">View all 20 services →</Link>
        </p>
      </div>
    </section>
  )
}
