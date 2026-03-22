import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function RequireAuth() {
  const { user, isLoading } = useAuth()
  if (isLoading) {
    return (
      <div className="client-app-card">
        <p className="muted">Loading…</p>
      </div>
    )
  }
  if (!user) return <Navigate to="/app/login" replace state={{ from: window.location.pathname }} />
  return <Outlet />
}
