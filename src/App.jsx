import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './client-app/context/AuthContext.jsx'
import { ClientAppProviders } from './client-app/ClientAppProviders.jsx'
import MarketingSite from './MarketingSite.jsx'
import { RouteFallback } from './components/RouteFallback.jsx'
import { WhatsAppFloat } from './components/WhatsAppFloat.jsx'

const TermsPage = lazy(() => import('./components/TermsPage.jsx'))
const SeoLandingPageRoute = lazy(() => import('./pages/SeoLandingPageRoute.jsx'))
const ServicesIndexPage = lazy(() => import('./pages/ServicesIndexPage.jsx'))
const BlogIndexPage = lazy(() => import('./pages/BlogIndexPage.jsx'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage.jsx'))
const ClientAppRoutes = lazy(() =>
  import('./client-app/ClientAppRoutes.jsx').then((m) => ({ default: m.ClientAppRoutes })),
)

export default function App() {
  return (
    <HelmetProvider>
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
            <Route
              path="/blog"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <BlogIndexPage />
                </Suspense>
              }
            />
            <Route
              path="/blog/:slug"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <BlogPostPage />
                </Suspense>
              }
            />
            <Route
              path="/services"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <ServicesIndexPage />
                </Suspense>
              }
            />
            <Route
              path="/:slug"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <SeoLandingPageRoute />
                </Suspense>
              }
            />
            <Route path="/*" element={<MarketingSite />} />
          </Routes>
          <WhatsAppFloat />
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  )
}
