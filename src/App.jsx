import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Services } from './components/Services'
import { About } from './components/About'
import { Caregivers } from './components/Caregivers'
import { config } from './data/config'
import { Pricing } from './components/Pricing'
import { Mission } from './components/Mission'
import { Testimonials } from './components/Testimonials'
import { Apps } from './components/Apps'
import { Team } from './components/Team'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

import './components/Header.css'
import './components/Hero.css'
import './components/Services.css'
import './components/About.css'
import './components/Caregivers.css'
import './components/Pricing.css'
import './components/Mission.css'
import './components/Testimonials.css'
import './components/Apps.css'
import './components/Team.css'
import './components/Contact.css'
import './components/Footer.css'

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        {config.showAboutSection && <About />}
        <Caregivers />
        <Pricing />
        <Mission />
        <Testimonials />
        <Apps />
        {config.showTeamSection && <Team />}
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
