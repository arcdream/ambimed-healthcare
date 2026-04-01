import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { referralService } from '../services/referralService'
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

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!user?.id) return
      setLoading(true)
      setError(null)
      try {
        const s = await referralService.fetchForDoctor(user.id)
        if (!cancelled) setStats(s)
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
    [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || 'Doctor'

  return (
    <div className="doctor-workspace">
      <header className="doctor-workspace-header">
        <div>
          <p className="doctor-workspace-kicker">Referral hub</p>
          <h1 className="doctor-workspace-title">Welcome, {displayName}</h1>
          <p className="doctor-workspace-sub">
            Track referrals you have made and incentive amounts in one place.
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
          When an incentive is marked settled, we show the referred person&apos;s name as recorded by
          Ambimed.
        </p>
        {settledRows.length === 0 ? (
          <p className="muted">No settled referrals yet.</p>
        ) : (
          <ul className="doctor-workspace-settled-list">
            {settledRows.map((r) => (
              <li key={r.id} className="doctor-workspace-settled-item">
                <div className="doctor-workspace-settled-main">
                  <span className="doctor-workspace-settled-name">
                    {r.referred_name?.trim() || 'Name on file'}
                  </span>
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
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
                <th scope="col">Settled on</th>
                <th scope="col">Referred person</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td data-label="Date">{formatDate(r.referral_date)}</td>
                  <td data-label="Amount">{formatInr(r.referral_amount)}</td>
                  <td data-label="Status">
                    <span
                      className={`doctor-workspace-badge ${r.is_settled ? 'is-settled' : 'is-pending'}`}
                    >
                      {r.is_settled ? 'Settled' : 'Pending'}
                    </span>
                  </td>
                  <td data-label="Settled on">{r.settlement_date ? formatDate(r.settlement_date) : '—'}</td>
                  <td data-label="Referred person">
                    {r.is_settled ? r.referred_name?.trim() || '—' : '—'}
                  </td>
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
          <strong>Referrals</strong> are recorded when you direct a patient or facility to Ambimed. Each
          row shows the incentive amount linked to that referral.
        </li>
        <li>
          <strong>Pending</strong> means the incentive has not been paid or finalized yet.{' '}
          <strong>Settled</strong> means it has been processed; we then show the referred person&apos;s
          name when available.
        </li>
        <li>
          Totals on the summary screen are based on rows in your ledger. For questions about a specific
          case, contact Ambimed support.
        </li>
      </ul>
    </div>
  )
}
