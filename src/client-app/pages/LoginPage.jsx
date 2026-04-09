import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { authService } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { supabaseConfigured } from '../lib/supabase'
import { TERMS_PDF_URL } from '../../data/legal'
import { clearPendingBookingDraft, getPendingBookingDraft } from '../lib/pendingBooking'

const OTP_LEN = 6

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [phone, setPhone] = useState('')
  const [otpDigits, setOtpDigits] = useState(() => Array(OTP_LEN).fill(''))
  const otpInputRefs = useRef([])
  const otp = otpDigits.join('')
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

  const onPhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
    setPhone(digits)
  }

  const sendOtp = async (e) => {
    e.preventDefault()
    setError('')
    if (!acceptedTerms) {
      setError('Please accept the terms and conditions to continue.')
      return
    }
    if (!/^\d{10}$/.test(phone)) {
      setError('Enter a valid 10-digit mobile number.')
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
    if (!/^\d{6}$/.test(otp)) {
      setError('Enter the 6-digit code.')
      return
    }
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

  useEffect(() => {
    if (step === 'otp') {
      setOtpDigits(Array(OTP_LEN).fill(''))
      const t = requestAnimationFrame(() => otpInputRefs.current[0]?.focus())
      return () => cancelAnimationFrame(t)
    }
  }, [step])

  const handleOtpChange = (i, e) => {
    const raw = e.target.value.replace(/\D/g, '')
    if (raw.length === 0) {
      setOtpDigits((prev) => {
        const next = [...prev]
        next[i] = ''
        return next
      })
      return
    }
    if (raw.length === 1) {
      setOtpDigits((prev) => {
        const next = [...prev]
        next[i] = raw
        return next
      })
      if (i < OTP_LEN - 1) otpInputRefs.current[i + 1]?.focus()
      return
    }
    const chars = raw.slice(0, OTP_LEN).split('')
    setOtpDigits((prev) => {
      const next = [...prev]
      chars.forEach((c, j) => {
        if (i + j < OTP_LEN) next[i + j] = c
      })
      return next
    })
    const nextFocus = Math.min(i + chars.length, OTP_LEN - 1)
    otpInputRefs.current[nextFocus]?.focus()
  }

  const handleOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otpDigits[i] && i > 0) {
      e.preventDefault()
      setOtpDigits((prev) => {
        const next = [...prev]
        next[i - 1] = ''
        return next
      })
      otpInputRefs.current[i - 1]?.focus()
    }
  }

  const handleOtpPaste = (i, e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LEN)
    if (!text) return
    e.preventDefault()
    const chars = text.split('')
    setOtpDigits((prev) => {
      const next = [...prev]
      chars.forEach((c, j) => {
        if (i + j < OTP_LEN) next[i + j] = c
      })
      return next
    })
    const nextFocus = Math.min(i + chars.length, OTP_LEN - 1)
    otpInputRefs.current[nextFocus]?.focus()
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
            <div className="login-phone-row">
              <span className="login-phone-prefix" aria-hidden="true">
                +91
              </span>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="10-digit number"
                value={phone}
                onChange={onPhoneChange}
                maxLength={10}
                pattern="[0-9]{10}"
                title="10-digit mobile number"
                required
              />
            </div>
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
            <label id="otp-label">Enter the code we sent</label>
            <div className="login-otp-row" role="group" aria-labelledby="otp-label">
              {Array.from({ length: OTP_LEN }, (_, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    otpInputRefs.current[i] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={i === 0 ? 'one-time-code' : 'off'}
                  className="login-otp-box"
                  maxLength={i === 0 ? 6 : 1}
                  value={otpDigits[i]}
                  onChange={(e) => handleOtpChange(i, e)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  onPaste={(e) => handleOtpPaste(i, e)}
                  aria-label={`Digit ${i + 1} of ${OTP_LEN}`}
                />
              ))}
            </div>
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
                  setOtpDigits(Array(OTP_LEN).fill(''))
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
