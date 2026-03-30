import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { useAuth } from '../context/AuthContext'
import { useMetadata } from '../context/MetadataContext'
import { bookingService } from '../services/bookingService'
import { addressService } from '../services/addressService'
import { fetchDiscountForClient } from '../services/discountService'
import { discountedAmount, formatInr } from '../lib/pricingDisplay'
import { clearPendingBookingDraft, getPendingBookingDraft } from '../lib/pendingBooking'

export function ReviewPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { services } = useMetadata()

  const params = location.state ?? getPendingBookingDraft()

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
        <p>Nothing to review. Start a booking from Book care.</p>
        <Link to="/app/booking">← Book care</Link>
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
    addressDraft,
  } = params

  const hasAddressForBooking =
    !!addressId || !!addressDraft || !!(addressDisplay && String(addressDisplay).trim())

  if (!hasAddressForBooking) {
    return (
      <div className="client-app-card">
        <p>Your booking needs a visit address before you can review it.</p>
        <Link to={serviceTypeId ? `/app/book/${serviceTypeId}` : '/app/booking'}>← Continue booking</Link>
      </div>
    )
  }

  const startStr = dayjs(startDate).format('YYYY-MM-DD')
  const endStr = dayjs(endDate).format('YYYY-MM-DD')
  const days = Math.max(1, dayjs(endStr).diff(dayjs(startStr), 'day') + 1)
  const subtype = services.flatMap((s) => s.subtypes ?? []).find((st) => st.id === serviceId)
  const listPerDay = subtype?.price ?? 0
  const discountPct = discount?.discountPct ?? 0
  const dealPerDay = discountedAmount(listPerDay, discountPct)
  const total = days * listPerDay
  const discountAmount = total * (discountPct / 100)
  const finalPrice = total - discountAmount

  const confirm = async () => {
    if (!user) return
    setError('')
    setLoading(true)
    try {
      let resolvedAddressId = addressId

      if (addressDraft && !resolvedAddressId) {
        const { houseAddress, city, state, pincode } = addressDraft
        if (!houseAddress?.trim() || !city?.trim() || !state?.trim() || !pincode?.trim()) {
          setError('Address is incomplete. Go back and update your visit address.')
          setLoading(false)
          return
        }
        const addrRes = await addressService.createAddress(user.id, {
          houseAddress: houseAddress.trim(),
          streetAddress: addressDraft.streetAddress?.trim() || '',
          city: city.trim(),
          state: state.trim(),
          country: addressDraft.country || 'India',
          pincode: pincode.trim(),
          isPrimary: true,
        })
        if (!addrRes.success || !addrRes.address) {
          setError(addrRes.message || 'Could not save address')
          setLoading(false)
          return
        }
        resolvedAddressId = addrRes.address.id
      }

      if (!resolvedAddressId) {
        setError('Please select an address for the visit.')
        setLoading(false)
        return
      }

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
        addressId: resolvedAddressId,
      })
      if (response.success) {
        clearPendingBookingDraft()
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
        <p>
          Per day:{' '}
          {discountPct > 0 ? (
            <>
              <span style={{ textDecoration: 'line-through', opacity: 0.65 }}>{formatInr(listPerDay)}</span>{' '}
              <span style={{ fontWeight: 600 }}>{formatInr(dealPerDay)}</span>
              <span className="muted" style={{ marginLeft: '0.35rem' }}>
                ({discountPct}% off)
              </span>
            </>
          ) : (
            formatInr(listPerDay)
          )}
        </p>
        <p>Subtotal ({days} {days === 1 ? 'day' : 'days'}): {formatInr(total)}</p>
        {discountPct > 0 && (
          <p>
            Discount ({discountPct}%): {formatInr(discountAmount)}
          </p>
        )}
        <p>
          <strong>Final (estimate): {formatInr(finalPrice)}</strong>
        </p>
      </div>

      <div className="client-app-card">
        <h2>Address</h2>
        <p>{addressDisplay || '—'}</p>
        {addressDraft && !addressId && (
          <p className="muted" style={{ marginTop: '0.5rem' }}>
            This address will be saved to your account when you confirm.
          </p>
        )}
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
