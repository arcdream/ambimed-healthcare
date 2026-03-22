import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './pages/AppShell'
import { AppEntry } from './pages/AppEntry'
import { LoginPage } from './pages/LoginPage'
import { RequireAuth } from './pages/RequireAuth'
import { AppHomePage } from './pages/AppHomePage'
import { BookingPage } from './pages/BookingPage'
import { ReviewPage } from './pages/ReviewPage'
import { HistoryPage } from './pages/HistoryPage'
import './ClientApp.css'

export function ClientAppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<AppEntry />} />
        <Route path="login" element={<LoginPage />} />
        <Route element={<RequireAuth />}>
          <Route path="home" element={<AppHomePage />} />
          <Route path="book/:serviceId" element={<BookingPage />} />
          <Route path="book/review" element={<ReviewPage />} />
          <Route path="history" element={<HistoryPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Route>
    </Routes>
  )
}
