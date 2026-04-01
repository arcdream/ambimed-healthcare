import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './pages/AppShell'
import { AppEntry } from './pages/AppEntry'
import { LoginPage } from './pages/LoginPage'
import { RequireAuth } from './pages/RequireAuth'
import { AppHomePage } from './pages/AppHomePage'
import { BookingPage } from './pages/BookingPage'
import { ReviewPage } from './pages/ReviewPage'
import { HistoryPage } from './pages/HistoryPage'
import { DoctorWorkspacePage } from './pages/DoctorWorkspacePage'
import { RequireDoctor } from './pages/RequireDoctor'
import './ClientApp.css'

export function ClientAppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<AppEntry />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="booking" element={<AppHomePage />} />
        <Route path="home" element={<Navigate to="/app/booking" replace />} />
        <Route path="book/:serviceId" element={<BookingPage />} />
        <Route element={<RequireAuth />}>
          <Route path="book/review" element={<ReviewPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route element={<RequireDoctor />}>
            <Route path="doctor" element={<DoctorWorkspacePage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/app/booking" replace />} />
      </Route>
    </Routes>
  )
}
