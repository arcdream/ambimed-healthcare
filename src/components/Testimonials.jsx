import { motion } from 'framer-motion'
import { testimonials } from '../data/testimonials'
import './Testimonials.css'

function StarRating({ rating }) {
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rating ? 'star filled' : 'star'}>★</span>
      ))}
    </span>
  )
}

export function Testimonials() {
  return (
    <section id="testimonials" className="section section-testimonials">
      <div className="container">
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          What families say
        </motion.p>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Customer feedback
        </motion.h2>
        <div className="testimonials-grid">
          {testimonials.map((item, i) => (
            <motion.article
              key={item.id}
              className="testimonial-card"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <StarRating rating={item.rating} />
              <blockquote className="testimonial-text">"{item.text}"</blockquote>
              <footer className="testimonial-author">
                <h3 className="testimonial-name">{item.name}</h3>
                <p className="testimonial-role">{item.role}</p>
              </footer>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
