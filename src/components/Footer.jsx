import { motion } from 'framer-motion'
import { config } from '../data/config'

const quickLinksBase = [
  { id: 'services', label: 'Services' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
  { id: 'apps', label: 'Our Apps' },
]

export function Footer() {
  const quickLinks = config.showAboutSection ? quickLinksBase : quickLinksBase.filter((l) => l.id !== 'about')
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="container footer-grid">
        <div className="footer-brand">
          <span className="logo-text">
            <span className="logo-ambi">AMBI</span><span className="logo-med">MED</span>
          </span>
          <p className="footer-tagline">Trusted home healthcare. Easy booking. Transparent billing.</p>
        </div>
        <div className="footer-links">
          <h4>Quick links</h4>
          <ul>
            {quickLinks.map((link) => (
              <li key={link.id}>
                <button type="button" className="footer-link" onClick={() => scrollTo(link.id)}>
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-contact">
          <h4>Contact</h4>
          <p>{config.contact.phone} · {config.contact.email}</p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} Ambimed Healthcare. Motivated by serving society.</p>
        </div>
      </div>
    </motion.footer>
  )
}
