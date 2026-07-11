import { useParams, Link, Navigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { SeoHead } from '../components/SeoHead'
import { getBlogPost } from '../data/blogPosts'
import { getServiceBySlug } from '../data/seoServices'
import { buildPageUrl } from '../data/seoHelpers'
import '../components/Header.css'
import '../components/Footer.css'
import './Blog.css'

export default function BlogPostPage() {
  const { slug } = useParams()
  const post = getBlogPost(slug)

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  const path = `/blog/${post.slug}`

  return (
    <>
      <SeoHead
        title={`${post.title} | Ambimed Blog`}
        description={post.excerpt}
        path={path}
        schemas={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            author: { '@type': 'Organization', name: post.author },
            datePublished: post.publishedAt,
            publisher: { '@type': 'Organization', name: 'Ambimed Healthcare', url: buildPageUrl('/') },
            url: buildPageUrl(path),
          },
        ]}
      />
      <Header />
      <main className="blog-page blog-post">
        <article className="container blog-article">
          <p className="blog-back">
            <Link to="/blog">← All articles</Link>
          </p>
          <p className="blog-card-meta">
            <span className="blog-card-category">{post.category}</span>
            <span>{post.readTime}</span>
            <span>{post.publishedAt}</span>
          </p>
          <h1 className="blog-article-title">{post.title}</h1>

          {post.content.map((block, i) =>
            block.type === 'h2' ? (
              <h2 key={i} className="blog-article-h2">{block.text}</h2>
            ) : (
              <p key={i} className="blog-article-p">{block.text}</p>
            ),
          )}

          {post.relatedServices?.length > 0 && (
            <aside className="blog-related">
              <h3>Related Services</h3>
              <ul>
                {post.relatedServices.map((s) => (
                  <li key={s}>
                    <Link to={`/${s}`}>{getServiceBySlug(s)?.title ?? s}</Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </article>
      </main>
      <Footer />
    </>
  )
}
