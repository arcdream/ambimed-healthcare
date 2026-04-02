import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { referralService } from '../services/referralService'
import { organizationService } from '../services/organizationService'
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

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!user?.id) return
      setLoading(true)
      setError(null)
      try {
        const [refResult, memResult] = await Promise.allSettled([
          referralService.fetchReferralDashboardForUser(user.id),
          organizationService.getMembershipsForDisplay(user.id),
        ])
        if (!cancelled) {
          if (memResult.status === 'fulfilled') {
            setMemberships(memResult.value)
          } else {
            console.error(memResult.reason)
            setMemberships([])
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
          {!loading && !error && panel === 'summary' && (
            <SummaryPanel stats={stats} formatDate={formatDate} />
          )}
          {!loading && !error && panel === 'referrals' && (
            <ReferralsTablePanel stats={stats} formatDate={formatDate} />
          )}
          {!loading && !error && panel === 'about' && <AboutPanel />}
        </div>
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
          Settled incentives are listed below with amount and dates. Referral party details may be added to
          your ledger by the operations team when available.
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
                <th scope="col">Facility</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
                <th scope="col">Settled on</th>
                <th scope="col">Ref</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td data-label="Date">{formatDate(r.referral_date)}</td>
                  <td data-label="Facility" className="doctor-workspace-cell-mono">
                    {r.facility_id ? `${String(r.facility_id).slice(0, 8)}…` : '—'}
                  </td>
                  <td data-label="Amount">{formatInr(r.referral_amount)}</td>
                  <td data-label="Status">
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
          Totals on the summary screen are based on rows in your ledger. For questions about a specific
          case, contact Ambimed support.
        </li>
      </ul>
    </div>
  )
}
