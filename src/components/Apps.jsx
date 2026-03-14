import { motion } from 'framer-motion'
import { config } from '../data/config'
import './Apps.css'

export function Apps() {
  return (
    <section id="apps" className="section section-apps">
      <div className="container">
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Download our apps
        </motion.p>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Our apps
        </motion.h2>
        <div className="apps-grid">
          <motion.article
            className="app-card app-card-client"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
          >
            <h3 className="app-card-title">Book care – Client app</h3>
            <p className="app-card-desc">
              Book elder care, physiotherapy, home nurses, and mother & baby care. Easy booking,
              transparent billing, trusted care at home.
            </p>
            <div className="app-card-qr">
              <img
                src={config.qrClientApp}
                alt="QR code for client app"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextElementSibling?.classList.remove('hide')
                }}
                onLoad={(e) => e.target.nextElementSibling?.classList.add('hide')}
              />
              <div className="app-qr-placeholder hide">QR code – add image to /public/assets/qr-client-app.png</div>
            </div>
            <a href={config.clientAppUrl} className="app-store-link" target="_blank" rel="noopener noreferrer">
              Get it on Google Play
            </a>
            <p className="app-note">Edit app link and QR in src/data/config.js</p>
          </motion.article>

          <motion.article
            className="app-card app-card-caregiver"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -4 }}
          >
            <h3 className="app-card-title">Caregiver Partner app</h3>
            <p className="app-card-desc">
              Want to associate with us as a caregiver? Download our app, register, and get
              caregiving work in homecare or hospitals. Flexible opportunities with Ambimed.
            </p>
            <div className="app-card-qr">
              <img
                src={config.qrCaregiverApp}
                alt="QR code for caregiver app"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextElementSibling?.classList.remove('hide')
                }}
                onLoad={(e) => e.target.nextElementSibling?.classList.add('hide')}
              />
              <div className="app-qr-placeholder hide">QR code – add image to /public/assets/qr-caregiver-app.png</div>
            </div>
            <a href={config.caregiverAppUrl} className="app-store-link" target="_blank" rel="noopener noreferrer">
              Download Caregiver App
            </a>
            <p className="app-note">Edit app link and QR in src/data/config.js</p>
          </motion.article>
        </div>
      </div>
    </section>
  )
}
