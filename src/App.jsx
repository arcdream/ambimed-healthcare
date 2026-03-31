import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './client-app/context/AuthContext.jsx'
import { ClientAppProviders } from './client-app/ClientAppProviders.jsx'
import MarketingSite from './MarketingSite.jsx'
import { RouteFallback } from './components/RouteFallback.jsx'
import { WhatsAppFloat } from './components/WhatsAppFloat.jsx'

const TermsPage = lazy(() => import('./components/TermsPage.jsx'))
const ClientAppRoutes = lazy(() =>
  import('./client-app/ClientAppRoutes.jsx').then((m) => ({ default: m.ClientAppRoutes })),
)

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/app/*"
            element={
              <ClientAppProviders>
                <Suspense fallback={<RouteFallback />}>
                  <ClientAppRoutes />
                </Suspense>
              </ClientAppProviders>
            }
          />
          <Route
            path="/terms"
            element={
              <Suspense fallback={<RouteFallback />}>
                <TermsPage />
              </Suspense>
            }
          />
          <Route path="/*" element={<MarketingSite />} />
        </Routes>
        <WhatsAppFloat />
      </BrowserRouter>
    </AuthProvider>
  )
}
