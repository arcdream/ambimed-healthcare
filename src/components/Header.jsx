import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { config } from '../data/config'

const LOGO_IMG = '/assets/ambimed-logo.png'

const navLinksBase = [
  { id: 'hero', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'about', label: 'About' },
  { id: 'caregivers', label: 'Caregivers' },
  { id: 'testimonials', label: 'Feedback' },
  { id: 'apps', label: 'Our Apps' },
  { id: 'team', label: 'Team' },
  { id: 'contact', label: 'Contact' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const navLinks = navLinksBase.filter(
    (l) => (l.id === 'about' ? config.showAboutSection : l.id === 'team' ? config.showTeamSection : true)
  )

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <motion.header
      className="header"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="header-inner container">
        <a href="#hero" className="logo" onClick={(e) => { e.preventDefault(); scrollTo('hero') }}>
          {!logoError && (
            <img
              src={LOGO_IMG}
              alt=""
              className="logo-img"
              onError={() => setLogoError(true)}
            />
          )}
          <span className="logo-text">
            <span className="logo-ambi">AMBI</span><span className="logo-med">MED</span>
          </span>
        </a>
        <nav className="nav desktop">
          {navLinks.map((link) => (
            <button key={link.id} type="button" className="nav-link" onClick={() => scrollTo(link.id)}>
              {link.label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          className="menu-toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          <span className={open ? 'open' : ''} />
          <span className={open ? 'open' : ''} />
          <span className={open ? 'open' : ''} />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            className="nav mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            {navLinks.map((link) => (
              <button key={link.id} type="button" className="nav-link" onClick={() => scrollTo(link.id)}>
                {link.label}
              </button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
