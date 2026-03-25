import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { useAuth } from '../context/AuthContext'
import { useMetadata } from '../context/MetadataContext'
import { bookingService } from '../services/bookingService'

export function AppHomePage() {
  const { user } = useAuth()
  const { services, loading: metaLoading } = useMetadata()
  const [upcoming, setUpcoming] = useState(null)
  const [upcomingLoading, setUpcomingLoading] = useState(false)

  const loadUpcoming = useCallback(async () => {
    if (!user?.id) {
      setUpcoming(null)
      return
    }
    setUpcomingLoading(true)
    try {
      const list = await bookingService.getUpcomingBookings(user.id)
      setUpcoming(list[0] ?? null)
    } catch (e) {
      console.error(e)
    } finally {
      setUpcomingLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    loadUpcoming()
  }, [loadUpcoming])

  if (metaLoading) {
    return (
      <div className="client-app-card">
        <p className="muted">Loading services…</p>
      </div>
    )
  }

  return (
    <div>
      <div className="client-app-card app-dashboard-welcome">
        <p className="app-dashboard-kicker">{user?.id ? 'Your care dashboard' : 'Book care'}</p>
        <h1>{user?.id ? `Welcome back${user?.firstName ? `, ${user.firstName}` : ''}` : 'Home healthcare, on your schedule'}</h1>
        <p className="muted">
          {user?.id
            ? 'Book home care the same way as in the Ambimed app — one account for web and mobile.'
            : 'Browse services and build a booking. Sign in when you’re ready to review and confirm.'}
        </p>
      </div>

      {user?.id && upcomingLoading && (
        <div className="client-app-card">
          <p className="muted">Loading your bookings…</p>
        </div>
      )}

      {user?.id && !upcomingLoading && upcoming && (
        <div className="client-app-card">
          <h2>Next booking</h2>
          <p>
            <strong>{upcoming.serviceName}</strong>
          </p>
          <p className="muted">
            {dayjs(`${upcoming.startDate} ${upcoming.startTime}`).format('MMM D, YYYY h:mm A')}
            {' → '}
            {dayjs(`${upcoming.endDate} ${upcoming.endTime}`).format('MMM D, YYYY h:mm A')}
          </p>
          {upcoming.appointmentCode && (
            <p>
              Code: <strong>{upcoming.appointmentCode}</strong>
            </p>
          )}
          <Link to="/app/history">View all bookings</Link>
        </div>
      )}

      <h2 style={{ marginBottom: '0.75rem' }}>Book a service</h2>
      <div className="service-grid">
        {services.map((s) => (
          <Link key={s.id} to={`/app/book/${s.id}`} className="service-tile">
            <strong>{s.name}</strong>
            <p className="muted" style={{ margin: '0.35rem 0 0', fontSize: '0.9rem' }}>
              {s.description?.slice(0, 120)}
              {(s.description?.length || 0) > 120 ? '…' : ''}
            </p>
          </Link>
        ))}
      </div>
      {services.length === 0 && (
        <div className="client-app-card">
          <p className="muted">No services available from the server. Check Supabase metadata.</p>
        </div>
      )}
    </div>
  )
}
