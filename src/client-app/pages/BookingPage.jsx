import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import dayjs from 'dayjs'
import { useAuth } from '../context/AuthContext'
import { useMetadata } from '../context/MetadataContext'
import { addressService } from '../services/addressService'
import { clearPendingBookingDraft, getPendingBookingDraft, savePendingBookingDraft } from '../lib/pendingBooking'

const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00',
]

function formatAddressLine(a) {
  return [a.houseAddress, a.streetAddress, a.city, a.state, a.pincode, a.country].filter(Boolean).join(', ')
}

export function BookingPage() {
  const { serviceId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isLoading: authLoading } = useAuth()
  const { services, loading: metaLoading } = useMetadata()

  const service = services.find((s) => s.id === serviceId)
  const subtypes = service?.subtypes ?? []
  const [selectedSubtype, setSelectedSubtype] = useState(subtypes[0] ?? null)
  const [genderPreference, setGenderPreference] = useState()
  const [startDate, setStartDate] = useState(() => dayjs().format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(() => dayjs().format('YYYY-MM-DD'))
  const [startTime, setStartTime] = useState('09:00')
  const [notes, setNotes] = useState('')
  const [addresses, setAddresses] = useState([])
  const [addressesLoading, setAddressesLoading] = useState(true)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [newAddr, setNewAddr] = useState({
    houseAddress: '',
    streetAddress: '',
    city: '',
    state: '',
    pincode: '',
  })
  const [savingAddr, setSavingAddr] = useState(false)
  const resumeHydratedRef = useRef(false)
  const [error, setError] = useState('')

  useEffect(() => {
    resumeHydratedRef.current = false
  }, [serviceId])

  const minBookingDays = Math.max(1, service?.minimumBookingDays ?? 1)
  const minimumEndDate = dayjs(startDate).add(minBookingDays - 1, 'day').format('YYYY-MM-DD')

  useEffect(() => {
    setSelectedSubtype(subtypes[0] ?? null)
  }, [serviceId, subtypes.length])

  useEffect(() => {
    if (dayjs(endDate).isBefore(dayjs(minimumEndDate), 'day')) {
      setEndDate(minimumEndDate)
    }
  }, [minBookingDays, startDate, minimumEndDate, endDate])

  /** After sign-in, restore guest’s choices from sessionStorage (visit address is added below). */
  useEffect(() => {
    if (!user?.id || !service || subtypes.length === 0 || resumeHydratedRef.current) return
    if (!location.state?.resumeBooking) return
    const draft = getPendingBookingDraft()
    if (!draft || String(draft.serviceTypeId) !== String(service.id)) return
    if (draft.addressId || (draft.addressDisplay && draft.addressDisplay.trim())) return

    const sub = subtypes.find((s) => String(s.id) === String(draft.serviceId))
    if (sub) setSelectedSubtype(sub)
    if (draft.genderPreference === 'male' || draft.genderPreference === 'female') {
      setGenderPreference(draft.genderPreference)
    }
    if (draft.startDate) setStartDate(draft.startDate)
    if (draft.endDate) setEndDate(draft.endDate)
    if (draft.startTime) setStartTime(draft.startTime)
    if (draft.notes != null) setNotes(draft.notes)

    resumeHydratedRef.current = true
    navigate(location.pathname, { replace: true, state: {} })
  }, [user?.id, service?.id, subtypes.length, location.pathname, location.state?.resumeBooking, navigate])

  useEffect(() => {
    if (!user?.id) {
      setAddresses([])
      setSelectedAddress(null)
      setAddressesLoading(false)
      return
    }
    let c = false
    ;(async () => {
      setAddressesLoading(true)
      const list = await addressService.fetchAddresses(user.id)
      if (!c) {
        setAddresses(list)
        if (list.length === 1) setSelectedAddress(list[0])
        setAddressesLoading(false)
      }
    })()
    return () => {
      c = true
    }
  }, [user?.id])

  const refreshAddresses = async () => {
    if (!user?.id) return
    const list = await addressService.fetchAddresses(user.id)
    setAddresses(list)
    if (list.length === 1) setSelectedAddress(list[0])
  }

  const saveNewAddress = async (e) => {
    e.preventDefault()
    if (!user?.id) return
    const { houseAddress, city, state, pincode } = newAddr
    if (!houseAddress?.trim() || !city?.trim() || !state?.trim() || !pincode?.trim()) {
      setError('Fill house, city, state, and pincode.')
      return
    }
    setSavingAddr(true)
    setError('')
    try {
      const result = await addressService.createAddress(user.id, {
        houseAddress: houseAddress.trim(),
        streetAddress: newAddr.streetAddress?.trim() || '',
        city: city.trim(),
        state: state.trim(),
        country: 'India',
        pincode: pincode.trim(),
        isPrimary: addresses.length === 0,
      })
      if (result.success && result.address) {
        setShowAddressForm(false)
        setNewAddr({ houseAddress: '', streetAddress: '', city: '', state: '', pincode: '' })
        await refreshAddresses()
        setSelectedAddress(result.address)
      } else {
        setError(result.message || 'Failed to add address')
      }
    } finally {
      setSavingAddr(false)
    }
  }

  const buildReviewPayload = () => ({
    serviceId: selectedSubtype.id,
    serviceTypeId: service.id,
    serviceName: selectedSubtype.userFriendlyName,
    servicesOffered: selectedSubtype.servicesOffered || [],
    genderPreference: genderPreference || '',
    startDate,
    endDate,
    startTime,
    endTime: startTime,
    notes,
  })

  const goReview = () => {
    setError('')
    if (!selectedSubtype) {
      setError('Select a shift option.')
      return
    }
    if (service?.hasGenderPreference) {
      if (genderPreference !== 'male' && genderPreference !== 'female') {
        setError('Select caregiver gender preference — Male or Female is required.')
        return
      }
    }

    const base = buildReviewPayload()

    if (user?.id) {
      if (addressesLoading) {
        setError('Loading addresses… please wait a moment.')
        return
      }
      if (!selectedAddress) {
        setError('Select an address for the visit.')
        return
      }
      clearPendingBookingDraft()
      navigate('/app/book/review', {
        state: {
          ...base,
          addressId: selectedAddress.id,
          addressDisplay: formatAddressLine(selectedAddress),
        },
      })
      return
    }

    savePendingBookingDraft({
      ...base,
    })
    navigate('/app/login', { state: { from: `/app/book/${service.id}`, reason: 'booking' } })
  }

  if (metaLoading || authLoading) {
    return (
      <div className="client-app-card">
        <p className="muted">Loading…</p>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="client-app-card">
        <p>Service not found.</p>
        <Link to="/app/booking">← Back</Link>
      </div>
    )
  }

  if (subtypes.length === 0) {
    return (
      <div className="client-app-card">
        <p>No booking options for this service.</p>
        <Link to="/app/booking">← Back</Link>
      </div>
    )
  }

  const reviewCtaLabel = user?.id ? 'Review booking' : 'Continue to sign in'

  return (
    <div>
      <div className="client-app-card">
        <Link to="/app/booking" className="muted">
          ← Back
        </Link>
        <h1 style={{ marginTop: '0.5rem' }}>{service.name}</h1>
        <p className="muted">{service.description}</p>
        {!user?.id && (
          <p className="muted" style={{ marginTop: '0.75rem' }}>
            Choose your options, then sign in. You’ll add your visit address on the next step before review.
          </p>
        )}
      </div>

      <div className="client-app-card">
        <h2>Shift option</h2>
        {subtypes.map((sub) => (
          <button
            key={sub.id}
            type="button"
            className={`shift-option ${selectedSubtype?.id === sub.id ? 'selected' : ''}`}
            onClick={() => setSelectedSubtype(sub)}
          >
            <div>
              <div>{sub.userFriendlyName}</div>
              <div className="muted" style={{ fontSize: '0.85rem' }}>
                {sub.shiftTypeName} • {sub.shiftDurationHours}h • ₹{sub.price}
              </div>
            </div>
            <span>{selectedSubtype?.id === sub.id ? '●' : '○'}</span>
          </button>
        ))}
      </div>

      {service.hasGenderPreference && (
        <div className="client-app-card">
          <h2>Caregiver preference</h2>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {['male', 'female'].map((g) => (
              <button
                key={g}
                type="button"
                className={`btn ${genderPreference === g ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1 }}
                onClick={() => setGenderPreference(g)}
              >
                {g === 'male' ? 'Male' : 'Female'}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="client-app-card">
        <h2>Start date & time</h2>
        <label htmlFor="sd">Start date</label>
        <input id="sd" type="date" value={startDate} min={dayjs().format('YYYY-MM-DD')} onChange={(e) => setStartDate(e.target.value)} />

        <div className="time-slots">
          {TIME_SLOTS.map((t) => (
            <button key={t} type="button" className={`time-slot ${startTime === t ? 'active' : ''}`} onClick={() => setStartTime(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="client-app-card">
        <h2>End date</h2>
        {minBookingDays > 1 && (
          <p className="muted">Minimum booking: {minBookingDays} days. For custom needs call{' '}
            <a href="tel:+918726568502">+91 8726568502</a>.
          </p>
        )}
        <label htmlFor="ed">End date</label>
        <input id="ed" type="date" value={endDate} min={minimumEndDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      <div className="client-app-card">
        <h2>Notes (optional)</h2>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Requirements for the visit…" />
      </div>

      {user?.id && (
        <div className="client-app-card">
          <h2>Visit address</h2>
          {addressesLoading ? (
            <p className="muted">Loading addresses…</p>
          ) : addresses.length === 0 && !showAddressForm ? (
            <>
              <p className="muted">No address saved. Add one to continue.</p>
              <button type="button" className="btn btn-primary" onClick={() => setShowAddressForm(true)}>
                Add address
              </button>
            </>
          ) : (
            <>
              {addresses.map((addr) => (
                <button
                  key={addr.id}
                  type="button"
                  className={`addr-option ${selectedAddress?.id === addr.id ? 'selected' : ''}`}
                  onClick={() => setSelectedAddress(addr)}
                >
                  <span>{selectedAddress?.id === addr.id ? '●' : '○'}</span>
                  <span>{formatAddressLine(addr)}</span>
                </button>
              ))}
              <button type="button" className="btn btn-outline" style={{ marginTop: '0.5rem' }} onClick={() => setShowAddressForm(true)}>
                + Add another address
              </button>
            </>
          )}

          {showAddressForm && (
            <form onSubmit={saveNewAddress} style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
              <label>House / flat</label>
              <input value={newAddr.houseAddress} onChange={(e) => setNewAddr((p) => ({ ...p, houseAddress: e.target.value }))} required />
              <label>Street</label>
              <input value={newAddr.streetAddress} onChange={(e) => setNewAddr((p) => ({ ...p, streetAddress: e.target.value }))} />
              <label>City</label>
              <input value={newAddr.city} onChange={(e) => setNewAddr((p) => ({ ...p, city: e.target.value }))} required />
              <label>State</label>
              <input value={newAddr.state} onChange={(e) => setNewAddr((p) => ({ ...p, state: e.target.value }))} required />
              <label>Pincode</label>
              <input value={newAddr.pincode} onChange={(e) => setNewAddr((p) => ({ ...p, pincode: e.target.value }))} required />
              <button type="submit" className="btn btn-primary" disabled={savingAddr}>
                {savingAddr ? 'Saving…' : 'Save address'}
              </button>
              <button type="button" className="btn btn-outline" style={{ marginLeft: '0.5rem' }} onClick={() => setShowAddressForm(false)}>
                Cancel
              </button>
            </form>
          )}
        </div>
      )}

      {error && <div className="error">{error}</div>}
      <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={goReview}>
        {reviewCtaLabel}
      </button>
    </div>
  )
}
