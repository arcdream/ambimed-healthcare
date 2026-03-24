import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { homeSeoArticle } from '../data/homePageSeoCopy'
import './SeoContentSection.css'

export function SeoContentSection() {
  const { eyebrow, title, lead, sections } = homeSeoArticle

  return (
    <section
      id="home-healthcare-guide"
      className="section section-seo-article"
      aria-labelledby="seo-article-heading"
    >
      <div className="container">
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {eyebrow}
        </motion.p>
        <motion.h2
          id="seo-article-heading"
          className="section-title"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
        >
          {title}
        </motion.h2>
        <motion.article
          className="seo-article-body"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <p className="seo-article-lead">{lead}</p>
          {sections.map((block) => (
            <section
              key={block.id}
              className="seo-article-block"
              aria-labelledby={`seo-h3-${block.id}`}
            >
              <h3 id={`seo-h3-${block.id}`} className="seo-article-h3">
                {block.heading}
              </h3>
              {block.paragraphs.map((p, i) => (
                <p key={i} className="seo-article-p">
                  {p}
                </p>
              ))}
            </section>
          ))}
          <p className="seo-article-cta">
            <Link to="/app/booking" className="seo-article-book-link">
              Book home care online
            </Link>{' '}
            or scroll to{' '}
            <a href="#contact">contact us</a> for a tailored quote.
          </p>
        </motion.article>
      </div>
    </section>
  )
}
