import { Link } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { TERMS_PDF_URL } from '../data/legal'
import './Header.css'
import './Footer.css'
import './TermsPage.css'

export function TermsPage() {
  return (
    <>
      <Header />
      <article className="terms-page container">
        <p className="terms-back">
          <Link to="/app/login">← Back to sign in</Link>
        </p>
        <h1>Terms &amp; conditions</h1>
        <p className="terms-lead">
          The official terms and conditions are available as a PDF on ambimed.in. Use the button below to open it in a new
          tab.
        </p>
        <p className="terms-pdf-actions">
          <a className="terms-pdf-btn" href={TERMS_PDF_URL} target="_blank" rel="noopener noreferrer">
            View terms &amp; conditions (PDF)
          </a>
        </p>
        <p className="terms-pdf-url">
          <a href={TERMS_PDF_URL}>{TERMS_PDF_URL}</a>
        </p>
        <p className="terms-back">
          <Link to="/">← Website home</Link>
        </p>
      </article>
      <Footer />
    </>
  )
}
