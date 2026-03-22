import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MarketingSite from './MarketingSite.jsx'
import { TermsPage } from './components/TermsPage.jsx'
import { AuthProvider } from './client-app/context/AuthContext.jsx'
import { ClientAppProviders } from './client-app/ClientAppProviders.jsx'
import { ClientAppRoutes } from './client-app/ClientAppRoutes.jsx'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/app/*"
            element={
              <ClientAppProviders>
                <ClientAppRoutes />
              </ClientAppProviders>
            }
          />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/*" element={<MarketingSite />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
