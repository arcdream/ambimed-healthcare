import { lazy, Suspense } from 'react'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { RouteFallback } from './components/RouteFallback'

import './components/Header.css'
import './components/Hero.css'
import './components/Footer.css'

const MarketingBelowFold = lazy(() => import('./MarketingBelowFold.jsx'))

export default function MarketingSite() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Suspense fallback={<RouteFallback />}>
          <MarketingBelowFold />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
