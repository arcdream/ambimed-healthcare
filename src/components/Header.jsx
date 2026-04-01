import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { config } from '../data/config'
import { useAuth } from '../client-app/context/AuthContext.jsx'

const LOGO_IMG = '/assets/ambimed-logo.png'

const marketingNavBase = [
  { id: 'hero', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'services-pricing', label: 'Our Pricing' },
  { id: 'about', label: 'About' },
  { id: 'caregivers', label: 'Caregivers' },
  { id: 'testimonials', label: 'Feedback' },
  { id: 'apps', label: 'Our Apps' },
  { id: 'team', label: 'Team' },
  { id: 'achievements', label: 'Recognition' },
  { id: 'contact', label: 'Contact' },
]

const appNavLinks = [
  { to: '/', label: 'Website home' },
  { to: '/#services', label: 'Services' },
  { to: '/#services-pricing', label: 'Our Pricing' },
  { to: '/#achievements', label: 'Recognition' },
  { to: '/#contact', label: 'Contact' },
  { to: '/app/booking', label: 'Book care' },
  { to: '/app/history', label: 'My bookings' },
]

export function Header() {
  const location = useLocation()
  const isApp = location.pathname.startsWith('/app')
  const { user, isAuthenticated, isDoctor, isLoading, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  const marketingNav = marketingNavBase.filter(
    (l) => (l.id === 'about' ? config.showAboutSection : l.id === 'team' ? config.showTeamSection : true),
  )

  useEffect(() => {
    const close = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false)
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  /**
   * Close menu first, then scroll after layout settles (mobile menu animation / iOS).
   * Retries briefly if the target is not mounted yet.
   */
  const scrollTo = useCallback((id) => {
    setOpen(false)
    window.setTimeout(() => {
      const tryScroll = () => {
        const el = document.getElementById(id)
        if (!el) return false
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return true
      }
      if (tryScroll()) return
      let n = 0
      const t = window.setInterval(() => {
        n += 1
        if (tryScroll() || n >= 40) window.clearInterval(t)
      }, 50)
    }, 280)
  }, [])

  const appNavLinksResolved = useMemo(() => {
    const links = [...appNavLinks]
    if (isDoctor) {
      const idx = links.findIndex((l) => l.to === '/app/history')
      if (idx >= 0) links.splice(idx + 1, 0, { to: '/app/doctor', label: 'Referral hub' })
    }
    return links
  }, [isDoctor])

  const displayName = user?.firstName?.trim() || (user?.mobileNumber ? `…${String(user.mobileNumber).slice(-4)}` : 'there')
  const avatarLetter = (
    user?.firstName?.trim()?.[0] ||
    String(user?.mobileNumber || '').replace(/\D/g, '').slice(-1) ||
    'U'
  ).toUpperCase()

  const authDesktop = (
    <div className="header-auth">
      {isLoading ? (
        <span className="header-auth-loading" aria-hidden>
          …
        </span>
      ) : isAuthenticated ? (
        <div className="header-user-wrap" ref={userMenuRef}>
          <button
            type="button"
            className="header-user-trigger"
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
            onClick={() => setUserMenuOpen((v) => !v)}
          >
            <span className="header-user-avatar">{avatarLetter}</span>
            <span className="header-user-name">Hi, {displayName}</span>
            <span className="header-user-chevron" aria-hidden>
              ▾
            </span>
          </button>
          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                className="header-user-dropdown"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                <Link to="/app/booking" onClick={() => setUserMenuOpen(false)}>
                  Book care
                </Link>
                <Link to="/app/history" onClick={() => setUserMenuOpen(false)}>
                  My bookings
                </Link>
                {isDoctor && (
                  <Link to="/app/doctor" onClick={() => setUserMenuOpen(false)}>
                    Referral hub
                  </Link>
                )}
                <button
                  type="button"
                  className="header-user-signout"
                  onClick={() => {
                    logout()
                    setUserMenuOpen(false)
                  }}
                >
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <Link to="/app/login" className="header-btn-login">
          Log in
        </Link>
      )}
    </div>
  )

  return (
    <motion.header className={`header ${isApp ? 'header--app' : ''}`} initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
      <div className="header-inner container">
        <Link to="/" className="logo" onClick={() => setOpen(false)}>
          {!logoError && <img src={LOGO_IMG} alt="" className="logo-img" onError={() => setLogoError(true)} />}
          <span className="logo-text">
            <span className="logo-ambi">AMBI</span>
            <span className="logo-med">MED</span>
          </span>
        </Link>

        <nav className="nav desktop">
          {isApp
            ? appNavLinksResolved.map((item) => (
                <Link key={item.to + item.label} to={item.to} className="nav-link">
                  {item.label}
                </Link>
              ))
            : marketingNav.map((link) => (
                <button key={link.id} type="button" className="nav-link" onClick={() => scrollTo(link.id)}>
                  {link.label}
                </button>
              ))}
          {!isApp && (
            <Link to="/app/booking" className="nav-link nav-link--cta">
              Book care
            </Link>
          )}
          {authDesktop}
        </nav>

        <div className="header-mobile-actions">
          {!isLoading && !isAuthenticated && (
            <Link to="/app/login" className="header-btn-login header-btn-login--compact">
              Log in
            </Link>
          )}
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(!open)}
          >
            <span className="menu-toggle-glyph" aria-hidden>
              {open ? '✕' : '☰'}
            </span>
          </button>
        </div>
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
            {isApp
              ? appNavLinksResolved.map((item) => (
                  <Link key={item.to + item.label} to={item.to} className="nav-link" onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                ))
              : marketingNav.map((link) => (
                  <button key={link.id} type="button" className="nav-link" onClick={() => scrollTo(link.id)}>
                    {link.label}
                  </button>
                ))}
            {!isApp && (
              <Link to="/app/booking" className="nav-link nav-link--cta" onClick={() => setOpen(false)}>
                Book care
              </Link>
            )}
            {!isLoading && !isAuthenticated && (
              <Link to="/app/login" className="nav-link nav-link--login-mobile" onClick={() => setOpen(false)}>
                Log in
              </Link>
            )}
            {!isLoading && isAuthenticated && (
              <>
                <Link to="/app/booking" className="nav-link" onClick={() => setOpen(false)}>
                  Book care (dashboard)
                </Link>
                <Link to="/app/history" className="nav-link" onClick={() => setOpen(false)}>
                  My bookings
                </Link>
                {isDoctor && (
                  <Link to="/app/doctor" className="nav-link" onClick={() => setOpen(false)}>
                    Referral hub
                  </Link>
                )}
                <button
                  type="button"
                  className="nav-link nav-link--signout"
                  onClick={() => {
                    logout()
                    setOpen(false)
                  }}
                >
                  Sign out
                </button>
              </>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
