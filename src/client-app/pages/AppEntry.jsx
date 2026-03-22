import { Navigate } from 'react-router-dom'

/** Everyone lands on browse/home — login is only required for review & account pages */
export function AppEntry() {
  return <Navigate to="/app/home" replace />
}
