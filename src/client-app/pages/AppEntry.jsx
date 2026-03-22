import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function AppEntry() {
  const { user, isLoading } = useAuth()
  if (isLoading) {
    return (
      <div className="client-app-card">
        <p className="muted">Loading…</p>
      </div>
    )
  }
  if (user) return <Navigate to="/app/home" replace />
  return <Navigate to="/app/login" replace />
}
