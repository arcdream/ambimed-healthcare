import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { SeoHead } from '../components/SeoHead'
import { blogPosts } from '../data/blogPosts'
import '../components/Header.css'
import '../components/Footer.css'
import './Blog.css'

export default function BlogIndexPage() {
  return (
    <>
      <SeoHead
        title="Healthcare Blog | Home Care Tips & Guides | Ambimed"
        description="Expert guides on home nursing, elder care, physiotherapy, and patient care. Tips for families choosing healthcare at home in India."
        path="/blog"
      />
      <Header />
      <main className="blog-page">
        <div className="container">
          <p className="blog-label">AMBIMED BLOG</p>
          <h1 className="blog-title">Healthcare at Home — Guides &amp; Tips</h1>
          <p className="blog-intro">
            Practical advice for families navigating home healthcare — from choosing a nurse to understanding costs and recognising care needs.
          </p>
          <div className="blog-grid">
            {blogPosts.map((post) => (
              <article key={post.slug} className="blog-card">
                <p className="blog-card-meta">
                  <span className="blog-card-category">{post.category}</span>
                  <span>{post.readTime}</span>
                </p>
                <h2 className="blog-card-title">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <Link to={`/blog/${post.slug}`} className="blog-card-link">
                  Read article →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
