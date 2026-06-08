import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../client-app/context/AuthContext.jsx'
import { config } from '../data/config'

function GooglePlayIcon() {
  return (
    <svg className="hero-app-promo-play-icon" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M3.6 2.4A1.2 1.2 0 0 0 2.4 3.6v16.8a1.2 1.2 0 0 0 1.8 1.05l12.6-7.2a1.2 1.2 0 0 0 0-2.1L3.6 2.4Z"
      />
    </svg>
  )
}

function HeroAppPromo({ personalized }) {
  return (
    <motion.div
      className="hero-app-promo"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: personalized ? 0.52 : 0.58, duration: 0.5 }}
    >
      <div className="hero-app-promo-shine" aria-hidden />
      <div className="hero-app-promo-inner">
        <div className="hero-app-promo-copy">
          <span className="hero-app-promo-ribbon">
            <GooglePlayIcon />
            Now on Google Play
          </span>
          <p className="hero-app-promo-title">
            {personalized ? 'Get the full experience on mobile' : 'Download the app for the best experience'}
          </p>
          <p className="hero-app-promo-desc">
            {personalized
              ? 'Live caregiver tracking, instant reminders, and faster rebooking — right in your pocket.'
              : 'OTP login, live tracking, booking history, and timely care updates — faster than the web.'}
          </p>
          <ul className="hero-app-promo-perks" aria-label="App benefits">
            <li>Book in seconds</li>
            <li>Track your caregiver</li>
            <li>Manage appointments</li>
          </ul>
        </div>
        <a
          href={config.clientAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hero-app-promo-cta"
          aria-label="Get Ambimed Healthcare on Google Play"
        >
          <img
            src="/assets/google-play-badge.svg"
            alt="Get it on Google Play"
            className="hero-app-promo-badge"
            width={200}
            height={60}
          />
        </a>
      </div>
    </motion.div>
  )
}

export function Hero() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const first = user?.firstName?.trim()
  const personalized = isAuthenticated && !isLoading && !!user

  return (
    <section id="hero" className={`hero${personalized ? ' hero--personalized' : ''}`}>
      <div className="hero-bg" aria-hidden />
      <div className="container hero-inner">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {personalized ? (
            <>
              <p className="hero-badge hero-badge--welcome">Welcome back{first ? `, ${first}` : ''}</p>
              <h1 className="hero-title">
                Your care hub is <span className="hero-highlight">ready</span>
              </h1>
              <p className="hero-desc">
                Book visits, review upcoming appointments, and manage home care in one place — same trusted Ambimed
                experience online.
              </p>
              <motion.div
                className="hero-actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                <Link to="/app/booking" className="btn btn-primary">
                  Open dashboard
                </Link>
                <Link to="/app/booking" className="btn btn-secondary">
                  Book new care
                </Link>
              </motion.div>
              <HeroAppPromo personalized />
              <motion.div
                className="hero-trust-box"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.58 }}
                role="status"
                aria-live="polite"
              >
                <span className="hero-trust-stat">{config.heroTrustStats.headline}</span>
                <span className="hero-trust-label">{config.heroTrustStats.subline}</span>
              </motion.div>
            </>
          ) : (
            <>
              <p className="hero-badge">Trusted Home Healthcare</p>
              <h1 className="hero-title">
                Care when you need it — <span className="hero-highlight">at home</span>
              </h1>
              <p className="hero-desc">
                Elder care, physiotherapy, home nurses, and mother & baby care. Well-trained, well-groomed caregivers.
                Easy booking, transparent billing.
              </p>
              <motion.div
                className="hero-actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Link to="/app/booking" className="btn btn-primary">
                  Book care
                </Link>
                <a
                  href="#services"
                  className="btn btn-secondary"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Our services
                </a>
              </motion.div>
              <HeroAppPromo personalized={false} />
            </>
          )}
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
            <p className="hero-card-title">{personalized ? 'Signed in · Ambimed' : 'Now on Google Play'}</p>
            <p className="hero-card-sub">
              {personalized ? 'Pick up where you left off on web or app.' : 'Book care faster on the Ambimed app'}
            </p>
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
