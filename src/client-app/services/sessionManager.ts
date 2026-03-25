import type { Session, User } from '../types/models'

const SESSION_KEY = 'ambimed_web_session'
const SESSION_DURATION_MONTHS = 6

export const sessionManager = {
  async saveSession(user: User): Promise<void> {
    const now = Date.now()
    const expiryTimestamp = now + SESSION_DURATION_MONTHS * 30 * 24 * 60 * 60 * 1000
    const session: Session = {
      sessionId: `session_${now}_${Math.random().toString(36).slice(2, 9)}`,
      user,
      expiryTimestamp,
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  },

  async getSession(): Promise<Session | null> {
    try {
      const sessionStr = localStorage.getItem(SESSION_KEY)
      if (!sessionStr) return null
      const session: Session = JSON.parse(sessionStr)
      if (Date.now() > session.expiryTimestamp) {
        await this.clearSession()
        return null
      }
      return session
    } catch {
      return null
    }
  },

  async clearSession(): Promise<void> {
    localStorage.removeItem(SESSION_KEY)
  },

  async updateUser(user: User): Promise<void> {
    const session = await this.getSession()
    if (session) {
      session.user = user
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    }
  },
}
