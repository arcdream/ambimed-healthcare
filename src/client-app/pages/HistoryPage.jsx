import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { useAuth } from '../context/AuthContext'
import { bookingService } from '../services/bookingService'

export function HistoryPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const list = await bookingService.fetchBookings(user.id)
      setBookings(list)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return (
      <div className="client-app-card">
        <p className="muted">Loading bookings…</p>
      </div>
    )
  }

  return (
    <div>
      <div className="client-app-card">
        <Link to="/app/home" className="muted">
          ← Home
        </Link>
        <h1 style={{ marginTop: '0.5rem' }}>My bookings</h1>
      </div>

      {bookings.length === 0 ? (
        <div className="client-app-card">
          <p className="muted">No bookings yet.</p>
          <Link to="/app/home">Book a service</Link>
        </div>
      ) : (
        bookings.map((b) => (
          <div key={b.id} className="client-app-card">
            <p>
              <strong>{b.serviceName}</strong>{' '}
              <span className="muted">({b.status})</span>
            </p>
            <p className="muted">
              {dayjs(`${b.startDate} ${b.startTime}`).format('MMM D, YYYY h:mm A')}
              {' — '}
              {dayjs(`${b.endDate} ${b.endTime}`).format('MMM D, YYYY h:mm A')}
            </p>
            {b.appointmentCode && (
              <p>
                Code: <strong>{b.appointmentCode}</strong>
              </p>
            )}
            {b.finalServiceCharge != null && (
              <p>Amount: ₹{Number(b.finalServiceCharge).toLocaleString('en-IN')}</p>
            )}
          </div>
        ))
      )}
    </div>
  )
}
