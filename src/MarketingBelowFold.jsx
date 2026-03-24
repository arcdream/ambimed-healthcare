import { About } from './components/About'
import { Apps } from './components/Apps'
import { Caregivers } from './components/Caregivers'
import { Contact } from './components/Contact'
import { Mission } from './components/Mission'
import { Pricing } from './components/Pricing'
import { SeoContentSection } from './components/SeoContentSection'
import { Services } from './components/Services'
import { Team } from './components/Team'
import { Testimonials } from './components/Testimonials'
import { config } from './data/config'

import './components/Services.css'
import './components/About.css'
import './components/SeoContentSection.css'
import './components/Caregivers.css'
import './components/Pricing.css'
import './components/Mission.css'
import './components/Testimonials.css'
import './components/Apps.css'
import './components/Team.css'
import './components/Contact.css'

/** Loaded after first paint — keeps initial JS smaller for faster INP on hero/header interactions */
export default function MarketingBelowFold() {
  return (
    <>
      <Services />
      <SeoContentSection />
      {config.showAboutSection && <About />}
      <Caregivers />
      <Pricing />
      <Mission />
      <Testimonials />
      <Apps />
      {config.showTeamSection && <Team />}
      <Contact />
    </>
  )
}
