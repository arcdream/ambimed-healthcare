import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { useAuth } from '../context/AuthContext'
import { useMetadata } from '../context/MetadataContext'
import { bookingService } from '../services/bookingService'
import { fetchDiscountForClient } from '../services/discountService'

export function ReviewPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { services } = useMetadata()
  const params = location.state

  const [loading, setLoading] = useState(false)
  const [discount, setDiscount] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user?.id || !params) return
    fetchDiscountForClient(user.id).then(setDiscount)
  }, [user?.id, params])

  if (!params) {
    return (
      <div className="client-app-card">
        <p>Nothing to review. Start a booking from the app home.</p>
        <Link to="/app/home">← App home</Link>
      </div>
    )
  }

  const {
    serviceId,
    serviceTypeId,
    serviceName,
    servicesOffered,
    genderPreference,
    startDate,
    endDate,
    startTime,
    endTime,
    notes,
    addressId,
    addressDisplay,
  } = params

  const startStr = dayjs(startDate).format('YYYY-MM-DD')
  const endStr = dayjs(endDate).format('YYYY-MM-DD')
  const days = Math.max(1, dayjs(endStr).diff(dayjs(startStr), 'day') + 1)
  const subtype = services.flatMap((s) => s.subtypes ?? []).find((st) => st.id === serviceId)
  const perDay = subtype?.price ?? 0
  const total = days * perDay
  const discountPct = discount?.discountPct ?? 0
  const discountAmount = total * (discountPct / 100)
  const finalPrice = total - discountAmount

  const confirm = async () => {
    if (!user) return
    setError('')
    setLoading(true)
    try {
      const response = await bookingService.createBooking({
        userId: user.id,
        serviceId,
        serviceTypeId,
        serviceName,
        genderPreference: genderPreference || undefined,
        startDate: startStr,
        endDate: endStr,
        startTime,
        endTime,
        notes: notes || '',
        addressId,
      })
      if (response.success) {
        navigate('/app/history', { replace: true, state: { booked: true } })
      } else {
        setError(response.message || 'Booking failed')
      }
    } catch (e) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="client-app-card">
        <button type="button" className="muted" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} onClick={() => navigate(-1)}>
          ← Edit
        </button>
        <h1 style={{ marginTop: '0.5rem' }}>Review booking</h1>
        <p className="muted">Please confirm details before submitting.</p>
      </div>

      <div className="client-app-card">
        <h2>Service</h2>
        <p>
          <strong>{serviceName}</strong>
        </p>
        {Array.isArray(servicesOffered) && servicesOffered.length > 0 && (
          <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem' }}>
            {servicesOffered.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
        {genderPreference && (
          <p className="muted" style={{ marginTop: '0.5rem' }}>
            Preference: {genderPreference}
          </p>
        )}
      </div>

      <div className="client-app-card">
        <h2>Schedule</h2>
        <p>
          {dayjs(startStr).format('MMM D, YYYY')} {startTime} → {dayjs(endStr).format('MMM D, YYYY')} {endTime}
        </p>
      </div>

      <div className="client-app-card">
        <h2>Pricing (estimate)</h2>
        <p>
          Duration: {days} {days === 1 ? 'day' : 'days'}
        </p>
        <p>Per day: ₹{Number(perDay).toLocaleString('en-IN')}</p>
        <p>Total: ₹{Number(total).toLocaleString('en-IN')}</p>
        {discountPct > 0 && (
          <p>
            Discount: {discountPct}% (₹{Number(discountAmount).toLocaleString('en-IN')})
          </p>
        )}
        <p>
          <strong>Final (estimate): ₹{Number(finalPrice).toLocaleString('en-IN')}</strong>
        </p>
      </div>

      <div className="client-app-card">
        <h2>Address</h2>
        <p>{addressDisplay}</p>
      </div>

      {notes && (
        <div className="client-app-card">
          <h2>Notes</h2>
          <p>{notes}</p>
        </div>
      )}

      {error && <div className="error">{error}</div>}

      <button type="button" className="btn btn-primary" style={{ width: '100%', marginBottom: '0.75rem' }} onClick={confirm} disabled={loading}>
        {loading ? 'Confirming…' : 'Confirm booking'}
      </button>
      <button type="button" className="btn btn-outline" style={{ width: '100%' }} onClick={() => navigate(-1)}>
        Edit details
      </button>
    </div>
  )
}
