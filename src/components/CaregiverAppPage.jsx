import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { config } from '../data/config'
import './CaregiverAppPage.css'

const LOGO_IMG = '/assets/ambimed-logo.png'

const setupSteps = [
  {
    title: 'Download from Google Play',
    body: 'Tap the Google Play button below on your Android phone, or search “Ambimed Caregiver Partner” in the Play Store.',
  },
  {
    title: 'Install & open the app',
    body: 'Allow the install to finish, then open Ambimed Caregiver Partner from your home screen or app drawer.',
  },
  {
    title: 'Sign in with your phone number',
    body: 'Enter your mobile number and verify with the OTP sent to your phone. No password is required.',
  },
  {
    title: 'Complete your caregiver profile',
    body: 'Add your professional details, experience, skills, and upload any documents requested in the app.',
  },
  {
    title: 'Submit for Ambimed approval',
    body: 'Review your profile and submit it for verification. Our team will review your information before activating your account.',
  },
  {
    title: 'Start managing assignments',
    body: 'Once approved, you can view assignments, track completed jobs, and monitor payouts directly in the app.',
  },
]

export default function CaregiverAppPage() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Ambimed Caregiver Partner — Download & Setup'

    let robotsMeta = document.querySelector('meta[name="robots"][data-caregiver-app]')
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta')
      robotsMeta.setAttribute('name', 'robots')
      robotsMeta.setAttribute('data-caregiver-app', 'true')
      document.head.appendChild(robotsMeta)
    }
    robotsMeta.setAttribute('content', 'noindex, nofollow')

    return () => {
      document.title = previousTitle
      robotsMeta?.remove()
    }
  }, [])

  return (
    <div className="caregiver-app-page">
      <header className="caregiver-app-topbar">
        <Link to="/" className="caregiver-app-logo" aria-label="Ambimed Healthcare home">
          <img src={LOGO_IMG} alt="Ambimed Healthcare" width={140} height={40} />
        </Link>
      </header>

      <section className="caregiver-app-hero">
        <div className="caregiver-app-hero-bg" aria-hidden />
        <div className="container caregiver-app-hero-inner">
          <motion.div
            className="caregiver-app-hero-copy"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <span className="caregiver-app-eyebrow">Partner app · Android</span>
            <h1>
              Ambimed <span className="caregiver-app-highlight">Caregiver Partner</span>
            </h1>
            <p className="caregiver-app-lead">
              For home nurses, caregivers, attendants, and elder-care professionals. Download the app,
              complete onboarding, and manage your Ambimed assignments from your phone.
            </p>
            <ul className="caregiver-app-tags" aria-label="Who can use this app">
              <li>Home nurses</li>
              <li>Caregivers</li>
              <li>Patient attendants</li>
              <li>Elder care staff</li>
            </ul>
            <a
              href={config.caregiverAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="caregiver-app-play-link"
              aria-label="Get Ambimed Caregiver Partner on Google Play"
            >
              <img
                src="/assets/google-play-badge.svg"
                alt="Get it on Google Play"
                className="caregiver-app-play-badge"
                width={220}
                height={66}
              />
            </a>
          </motion.div>

          <motion.div
            className="caregiver-app-hero-card"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.12 }}
          >
            <p className="caregiver-app-hero-card-label">Quick start</p>
            <ol className="caregiver-app-hero-card-steps">
              <li>Download</li>
              <li>Verify phone</li>
              <li>Complete profile</li>
              <li>Get approved</li>
            </ol>
            <p className="caregiver-app-hero-card-note">
              Use the same phone number you shared with Ambimed so we can match your account faster.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="caregiver-app-setup section">
        <div className="container caregiver-app-setup-inner">
          <motion.div
            className="caregiver-app-setup-header"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="section-subtitle">Setup guide</p>
            <h2>How to download &amp; configure the app</h2>
            <p>
              Follow these steps on your Android device. You can add more detailed instructions here
              later as your onboarding process evolves.
            </p>
          </motion.div>

          <ol className="caregiver-app-steps">
            {setupSteps.map((step, index) => (
              <motion.li
                key={step.title}
                className="caregiver-app-step"
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: index * 0.05 }}
              >
                <span className="caregiver-app-step-num" aria-hidden>
                  {index + 1}
                </span>
                <div className="caregiver-app-step-body">
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </motion.li>
            ))}
          </ol>

          <motion.div
            className="caregiver-app-download-cta"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p>Ready to get started?</p>
            <a
              href={config.caregiverAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="caregiver-app-play-link caregiver-app-play-link--center"
            >
              <img
                src="/assets/google-play-badge.svg"
                alt="Get it on Google Play"
                className="caregiver-app-play-badge"
                width={220}
                height={66}
              />
            </a>
          </motion.div>
        </div>
      </section>

      <section className="caregiver-app-support">
        <div className="container caregiver-app-support-inner">
          <motion.div
            className="caregiver-app-support-card"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Need help during setup?</h2>
            <p>
              If you face issues installing the app, verifying OTP, or completing your profile, reach
              out to the Ambimed caregiver support team.
            </p>
            <a href="mailto:aayush.tiwari@ambimed.in" className="caregiver-app-support-email">
              aayush.tiwari@ambimed.in
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
