import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../client-app/context/AuthContext.jsx'

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
            <p className="hero-card-title">{personalized ? 'Signed in · Ambimed' : 'Easy Booking. Transparent Billing.'}</p>
            <p className="hero-card-sub">
              {personalized ? 'Pick up where you left off on web or app.' : 'Trusted care for your family'}
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
