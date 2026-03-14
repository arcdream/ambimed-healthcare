import { motion } from 'framer-motion'
import './WhatWeDo.css'

const items = [
  {
    id: 1,
    title: 'Mother & Baby Care at Home',
    image: '/assets/what-we-do-mother-baby.png',
    description: 'Postnatal and newborn care with experienced, caring nurses at your home.',
  },
  {
    id: 2,
    title: 'Home Physiotherapy',
    image: '/assets/what-we-do-physio.png',
    description: 'Recovery and mobility support in the comfort of your home.',
  },
  {
    id: 3,
    title: 'Caregiving at Home & Hospital',
    image: '/assets/what-we-do-caregiver.png',
    description: 'Trusted caregivers for home and hospital settings.',
  },
]

export function WhatWeDo() {
  return (
    <section id="what-we-do" className="section section-what-we-do">
      <div className="container">
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          In action
        </motion.p>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          What we do
        </motion.h2>
        <div className="what-we-do-grid">
          {items.map((item, i) => (
            <motion.article
              key={item.id}
              className="what-we-do-card"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="what-we-do-image-wrap">
                <img
                  src={item.image}
                  alt=""
                  onError={(e) => {
                    e.target.style.display = 'none'
                    const pl = e.target.nextElementSibling
                    if (pl) pl.classList.remove('hide')
                  }}
                />
                <div className="what-we-do-placeholder hide">Image</div>
              </div>
              <div className="what-we-do-body">
                <h3 className="what-we-do-title">{item.title}</h3>
                <p className="what-we-do-desc">{item.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
