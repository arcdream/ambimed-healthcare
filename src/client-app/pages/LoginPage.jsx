import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { authService } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { supabaseConfigured } from '../lib/supabase'
import { TERMS_PDF_URL } from '../../data/legal'
import { clearPendingBookingDraft, getPendingBookingDraft } from '../lib/pendingBooking'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('phone')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!supabaseConfigured) {
    return (
      <div className="login-page">
        <div className="login-hero">
          <div className="login-hero-icon" aria-hidden>
            ⚙
          </div>
          <h1>Client app unavailable</h1>
          <p>Add your Supabase keys to enable secure sign-in.</p>
        </div>
        <div className="login-card">
          <p className="muted" style={{ margin: 0 }}>
            Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your <code>.env</code> file
            (same as the Ambimed mobile app). Then restart the dev server.
          </p>
        </div>
        <p className="login-back">
          <Link to="/">← Back to website</Link>
        </p>
      </div>
    )
  }

  const sendOtp = async (e) => {
    e.preventDefault()
    setError('')
    if (!acceptedTerms) {
      setError('Please accept the terms and conditions to continue.')
      return
    }
    setLoading(true)
    try {
      const r = await authService.sendOtp(phone)
      if (r.success) setStep('otp')
      else setError(r.message || 'Failed to send OTP')
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const verify = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const r = await login(phone, otp)
      if (r.success) {
        const draft = getPendingBookingDraft()
        const resumingBooking = location.state?.reason === 'booking' && draft
        if (resumingBooking) {
          navigate(`/app/book/${draft.serviceTypeId}`, { replace: true, state: { resumeBooking: true } })
        } else {
          if (draft) clearPendingBookingDraft()
          const from = location.state?.from
          navigate(typeof from === 'string' && from.startsWith('/app') ? from : '/app/booking', { replace: true })
        }
      } else setError(r.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-hero">
        <div className="login-hero-icon" aria-hidden>
          ✓
        </div>
        <h1>{location.state?.reason === 'booking' ? 'Sign in to continue your booking' : 'Sign in to book care'}</h1>
        <p>
          {location.state?.reason === 'booking'
            ? 'After verification, you’ll add your visit address, then review and confirm.'
            : 'Use the same phone number as your Ambimed app — your profile and bookings stay in sync.'}
        </p>
      </div>

      <div className="login-card client-app">
        <div className="login-steps" role="status" aria-live="polite">
          <span className={`login-step${step === 'phone' ? ' active' : ''}`}>1. Phone</span>
          <span className={`login-step${step === 'otp' ? ' active' : ''}`}>2. OTP</span>
        </div>

        {step === 'phone' ? (
          <form onSubmit={sendOtp}>
            {error && <div className="error">{error}</div>}
            <label htmlFor="phone">Mobile number</label>
            <input
              id="phone"
              type="tel"
              placeholder="10-digit mobile or +91…"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              required
            />
            <div className="login-terms">
              <input
                id="accept-terms"
                type="checkbox"
                className="login-terms-checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              <label htmlFor="accept-terms" className="login-terms-label">
                I agree to the{' '}
                <a href={TERMS_PDF_URL} target="_blank" rel="noopener noreferrer">
                  terms &amp; conditions
                </a>{' '}
                and understand how Ambimed uses my information for booking and care coordination.
              </label>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={loading || !acceptedTerms}
            >
              {loading ? 'Sending code…' : 'Send verification code'}
            </button>
          </form>
        ) : (
          <form onSubmit={verify}>
            {error && <div className="error">{error}</div>}
            <label htmlFor="otp">Enter the code we sent</label>
            <input
              id="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: '1 1 140px' }} disabled={loading}>
                {loading ? 'Verifying…' : 'Verify & continue'}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                style={{ flex: '1 1 120px' }}
                onClick={() => {
                  setStep('phone')
                  setOtp('')
                }}
              >
                Change number
              </button>
            </div>
          </form>
        )}

        <div className="login-trust">
          <span aria-hidden>🔒</span>
          <span>
            <strong>Secure OTP sign-in.</strong> We never post your number publicly. Need help? Use the same account as
            the mobile app.
          </span>
        </div>
      </div>

      <p className="login-back">
        <Link to="/">← Back to website</Link>
      </p>
    </div>
  )
}
