import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  referralService,
  filterReferralsByStatus,
  buildStatsFromReferrals,
} from '../services/referralService'
import { organizationService } from '../services/organizationService'
import { doctorService } from '../services/doctorService'
import { formatInr } from '../lib/pricingDisplay'
import './DoctorWorkspacePage.css'

const PANELS = [
  { id: 'summary', label: 'Summary' },
  { id: 'referrals', label: 'All referrals' },
  { id: 'about', label: 'How it works' },
]

function formatDate(d) {
  if (!d) return '—'
  try {
    return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(d))
  } catch {
    return String(d)
  }
}

export function DoctorWorkspacePage() {
  const { user } = useAuth()
  const [panel, setPanel] = useState('summary')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)
  const [memberships, setMemberships] = useState(null)
  const [hospitalAssociation, setHospitalAssociation] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  /** Summary: payment totals only for rows with referral_status = referral_booked */
  const summaryStats = useMemo(() => {
    if (!stats?.referrals) return stats
    const rows = filterReferralsByStatus(stats.referrals, 'referral_booked')
    return buildStatsFromReferrals(rows)
  }, [stats])

  /** All referrals tab: user-controlled filter */
  const filteredStats = useMemo(() => {
    if (!stats?.referrals) return stats
    const rows = filterReferralsByStatus(stats.referrals, statusFilter)
    return buildStatsFromReferrals(rows)
  }, [stats, statusFilter])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!user?.id) return
      setLoading(true)
      setError(null)
      try {
        const [refResult, memResult, hospResult] = await Promise.allSettled([
          referralService.fetchReferralDashboardForUser(user.id),
          organizationService.getMembershipsForDisplay(user.id),
          doctorService.fetchHospitalAssociationForAuthUid(user.id),
        ])
        if (!cancelled) {
          if (memResult.status === 'fulfilled') {
            setMemberships(memResult.value)
          } else {
            console.error(memResult.reason)
            setMemberships([])
          }
          if (hospResult.status === 'fulfilled') {
            setHospitalAssociation(hospResult.value)
          } else {
            console.error(hospResult.reason)
            setHospitalAssociation(null)
          }
          if (refResult.status === 'fulfilled') {
            setStats(refResult.value.stats)
            setError(refResult.value.fetchError ?? null)
          } else {
            console.error(refResult.reason)
            setStats(null)
            setError('Could not load referral data. Try again later.')
          }
        }
      } catch (e) {
        console.error(e)
        if (!cancelled) setError('Could not load referral data. Try again later.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user?.id])

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || 'there'

  return (
    <div className="doctor-workspace">
      {hospitalAssociation && <DoctorHospitalBanner text={hospitalAssociation} />}

      {memberships && memberships.length > 0 && (
        <AffiliationBanner memberships={memberships} />
      )}

      <header className="doctor-workspace-header">
        <div>
          <p className="doctor-workspace-kicker">Referral hub</p>
          <h1 className="doctor-workspace-title">Welcome, {displayName}</h1>
          <p className="doctor-workspace-sub">
            Track referral incentives tied to you as a referring doctor and/or to facilities linked to your
            organization.
          </p>
        </div>
      </header>

      <div className="doctor-workspace-body">
        <nav className="doctor-workspace-nav" aria-label="Referral hub sections">
          {PANELS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`doctor-workspace-nav-btn ${panel === p.id ? 'is-active' : ''}`}
              onClick={() => setPanel(p.id)}
            >
              {p.label}
            </button>
          ))}
        </nav>

        <div className="doctor-workspace-content">
          {loading && (
            <div className="doctor-workspace-card">
              <p className="muted">Loading your dashboard…</p>
            </div>
          )}
          {!loading && error && (
            <div className="doctor-workspace-card doctor-workspace-card--warn">
              <p>{error}</p>
            </div>
          )}
          {!loading && !error && panel === 'referrals' && (
            <ReferralStatusFilter value={statusFilter} onChange={setStatusFilter} />
          )}
          {!loading && !error && panel === 'summary' && (
            <SummaryPanel stats={summaryStats} formatDate={formatDate} />
          )}
          {!loading && !error && panel === 'referrals' && (
            <ReferralsTablePanel stats={filteredStats} formatDate={formatDate} />
          )}
          {!loading && !error && panel === 'about' && <AboutPanel />}
        </div>
      </div>
    </div>
  )
}

function DoctorHospitalBanner({ text }) {
  const items = String(text)
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <section className="refhub-dr" aria-labelledby="refhub-dr-heading">
      <div className="refhub-dr__inner">
        <span className="refhub-dr__icon" aria-hidden>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 21h18M5 21V10l7-3 7 3v11M9 21v-4h6v4M10 9h4M12 7v4"
              stroke="currentColor"
              strokeWidth="1.65"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div className="refhub-dr__copy">
          <h2 id="refhub-dr-heading" className="refhub-dr__title">
            Your practice &amp; association
          </h2>
          {items.length > 0 ? (
            <ul className="refhub-dr__list">
              {items.map((name, i) => (
                <li key={`${i}-${name}`}>{name}</li>
              ))}
            </ul>
          ) : (
            <p className="refhub-dr__body">{text}</p>
          )}
        </div>
      </div>
    </section>
  )
}

function formatReferralStage(code) {
  if (code === 'referral_received') return 'Referral received'
  if (code === 'referral_booked') return 'Referral booked'
  return null
}

function ReferralStatusFilter({ value, onChange }) {
  return (
    <div className="refhub-toolbar">
      <label htmlFor="refhub-status-filter" className="refhub-toolbar__label">
        View referrals
      </label>
      <div className="refhub-toolbar__select-wrap">
        <select
          id="refhub-status-filter"
          className="refhub-toolbar__select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Filter referrals by stage"
        >
          <option value="all">All</option>
          <option value="referral_received">Referral received</option>
          <option value="referral_booked">Referral booked</option>
        </select>
        <span className="refhub-toolbar__chevron" aria-hidden>
          ▾
        </span>
      </div>
    </div>
  )
}

function formatRoleLabel(role) {
  if (!role || !String(role).trim()) return null
  const r = String(role).trim()
  return r.charAt(0).toUpperCase() + r.slice(1).toLowerCase()
}

function AffiliationBanner({ memberships }) {
  return (
    <section className="refhub-affil" aria-labelledby="refhub-affil-heading">
      <div className="refhub-affil__inner">
        <div className="refhub-affil__intro">
          <span className="refhub-affil__icon" aria-hidden>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 21V10.5L12 4l8 6.5V21h-5v-6H9v6H4z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div>
            <h2 id="refhub-affil-heading" className="refhub-affil__title">
              Your organization &amp; facilities
            </h2>
            <p className="refhub-affil__lead">
              You are linked to the following accounts. Referral totals below may include activity for these
              facilities.
            </p>
          </div>
        </div>

        <ul className="refhub-affil__grid">
          {memberships.map((m) => (
            <li key={m.membershipId} className="refhub-affil-card">
              <div className="refhub-affil-card__top">
                <span className="refhub-affil-card__badge refhub-affil-card__badge--org" aria-hidden>
                  Org
                </span>
                {formatRoleLabel(m.role) && (
                  <span className="refhub-affil-card__role">{formatRoleLabel(m.role)}</span>
                )}
              </div>
              <p className="refhub-affil-card__org-name">{m.organization.name}</p>
              <div className="refhub-affil-card__fac">
                <span className="refhub-affil-card__fac-icon" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 3l9 5v6c0 5-3.8 9.7-9 11-5.2-1.3-9-6-9-11V8l9-5z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {m.facility ? (
                  <span className="refhub-affil-card__fac-text">{m.facility.name}</span>
                ) : (
                  <span className="refhub-affil-card__fac-text refhub-affil-card__fac-text--muted">
                    Organization-wide (no specific facility)
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function SummaryPanel({ stats, formatDate }) {
  const settledRows = (stats?.referrals ?? []).filter((r) => r.is_settled)

  return (
    <div className="doctor-workspace-panels">
      <div className="doctor-workspace-stat-grid">
        <div className="doctor-workspace-stat">
          <span className="doctor-workspace-stat-label">Total referrals</span>
          <strong className="doctor-workspace-stat-value">{stats?.totalCount ?? 0}</strong>
        </div>
        <div className="doctor-workspace-stat">
          <span className="doctor-workspace-stat-label">Earned (settled)</span>
          <strong className="doctor-workspace-stat-value doctor-workspace-stat-value--money">
            {formatInr(stats?.totalEarnedSettled ?? 0)}
          </strong>
        </div>
        <div className="doctor-workspace-stat">
          <span className="doctor-workspace-stat-label">Pending amount</span>
          <strong className="doctor-workspace-stat-value doctor-workspace-stat-value--pending">
            {formatInr(stats?.totalPendingAmount ?? 0)}
          </strong>
        </div>
        <div className="doctor-workspace-stat">
          <span className="doctor-workspace-stat-label">Settled / pending</span>
          <strong className="doctor-workspace-stat-value">
            {stats?.settledCount ?? 0} / {stats?.pendingCount ?? 0}
          </strong>
        </div>
      </div>

      <section className="doctor-workspace-card">
        <h2 className="doctor-workspace-section-title">Settled referrals</h2>
        <p className="doctor-workspace-section-lead muted">
          Figures above count only referrals in the <strong>Referral booked</strong> stage. Settled incentives
          are listed below with amount and dates.
        </p>
        {settledRows.length === 0 ? (
          <p className="muted">No settled referrals yet.</p>
        ) : (
          <ul className="doctor-workspace-settled-list">
            {settledRows.map((r) => (
              <li key={r.id} className="doctor-workspace-settled-item">
                <div className="doctor-workspace-settled-main">
                  <span className="doctor-workspace-settled-name">Referral #{r.id}</span>
                  <span className="doctor-workspace-settled-amt">{formatInr(r.referral_amount)}</span>
                </div>
                <div className="doctor-workspace-settled-meta">
                  <span>Referred {formatDate(r.referral_date)}</span>
                  {r.settlement_date && (
                    <span>Settled {formatDate(r.settlement_date)}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function ReferralsTablePanel({ stats, formatDate }) {
  const rows = stats?.referrals ?? []

  return (
    <div className="doctor-workspace-card doctor-workspace-card--table">
      <h2 className="doctor-workspace-section-title">Every referral</h2>
      {rows.length === 0 ? (
        <p className="muted">No referral rows yet.</p>
      ) : (
        <div className="doctor-workspace-table-wrap">
          <table className="doctor-workspace-table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Client name</th>
                <th scope="col">Client phone</th>
                <th scope="col">Facility</th>
                <th scope="col">Referral stage</th>
                <th scope="col">Amount</th>
                <th scope="col">Settlement</th>
                <th scope="col">Settled on</th>
                <th scope="col">Ref</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td data-label="Date">{formatDate(r.referral_date)}</td>
                  <td data-label="Client name">{r.client_name?.trim() || '—'}</td>
                  <td data-label="Client phone">
                    {r.client_phone_number?.trim() ? (
                      <a
                        href={`tel:${String(r.client_phone_number).trim().replace(/\s/g, '')}`}
                        className="doctor-workspace-phone-link"
                      >
                        {r.client_phone_number.trim()}
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td data-label="Facility">
                    {r.facility_name?.trim() ? r.facility_name : '—'}
                  </td>
                  <td data-label="Referral stage">
                    {formatReferralStage(r.referral_status) ? (
                      <span className="doctor-workspace-badge doctor-workspace-badge--stage">
                        {formatReferralStage(r.referral_status)}
                      </span>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td data-label="Amount">{formatInr(r.referral_amount)}</td>
                  <td data-label="Settlement">
                    <span
                      className={`doctor-workspace-badge ${r.is_settled ? 'is-settled' : 'is-pending'}`}
                    >
                      {r.is_settled ? 'Settled' : 'Pending'}
                    </span>
                  </td>
                  <td data-label="Settled on">{r.settlement_date ? formatDate(r.settlement_date) : '—'}</td>
                  <td data-label="Ref">#{r.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function AboutPanel() {
  return (
    <div className="doctor-workspace-card">
      <h2 className="doctor-workspace-section-title">How your referral hub works</h2>
      <ul className="doctor-workspace-about-list">
        <li>
          <strong>Doctor-linked</strong> rows match your profile as the referring doctor.{' '}
          <strong>Corporate / facility</strong> rows appear when your account is tied to an organization
          facility and the referral is recorded against that facility.
        </li>
        <li>
          <strong>Pending</strong> means the incentive has not been paid or finalized yet.{' '}
          <strong>Settled</strong> means it has been processed and recorded in your ledger.
        </li>
        <li>
          <strong>Summary</strong> totals and settled amounts use only referrals in the{' '}
          <strong>Referral booked</strong> stage (payment view).
        </li>
        <li>
          On <strong>All referrals</strong>, use <strong>View referrals</strong> to filter the table by all
          rows, <strong>Referral received</strong>, or <strong>Referral booked</strong>.
        </li>
        <li>
          For questions about a specific case, contact Ambimed support.
        </li>
      </ul>
    </div>
  )
}
