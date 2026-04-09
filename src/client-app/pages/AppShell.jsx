import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '../../components/Header'
import '../ClientApp.css'

/**
 * Shared site header + booking content — matches marketing site chrome.
 */
export function AppShell() {
  const location = useLocation()
  const wideMain = location.pathname.startsWith('/app/doctor')

  return (
    <div className="client-app-shell">
      <Header />
      <div className="client-app-shell-bg" aria-hidden />
      <main className={`client-app-shell-main${wideMain ? ' client-app-shell-main--wide' : ''}`}>
        {/* class `client-app` scopes shared form/service styles from ClientApp.css */}
        <div className="client-app client-app--in-shell">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
