import { motion } from 'framer-motion'
import { team } from '../data/team'
import './Team.css'

export function Team() {
  return (
    <section id="team" className="section section-team">
      <div className="container">
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Who we are
        </motion.p>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Our team
        </motion.h2>
        <div className="team-grid">
          {team.map((member, i) => (
            <motion.article
              key={member.id}
              className="team-card"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <div className="team-photo-wrap">
                <img
                  src={member.photo}
                  alt=""
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextElementSibling?.classList.remove('hide')
                  }}
                />
                <div className="team-photo-placeholder hide">Photo</div>
              </div>
              <h3 className="team-name">{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <p className="team-bio">{member.bio}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
