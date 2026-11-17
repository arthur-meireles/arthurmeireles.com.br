import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import NotFound from './NotFound.jsx'
import { formatDate, getPost, posts, renderPost } from '../lib/blog.js'

export default function Post() {
  const { slug } = useParams()
  const post = getPost(slug)

  const [html, setHtml] = useState('')
  useEffect(() => {
    let alive = true
    setHtml('')
    if (post) renderPost(post).then((h) => alive && setHtml(h))
    return () => {
      alive = false
    }
  }, [post])

  useEffect(() => {
    if (post) document.title = `${post.title} — Arthur Meireles`
  }, [post])

  if (!post) return <NotFound />
  const next = posts[(posts.indexOf(post) + 1) % posts.length]

  return (
    <article className="is-light post">
      <div className="post__inner">
        <Link to="/blog" className="mono post__back">← Blog</Link>
        <p className="mono post__meta">{post.tag} · {formatDate(post.date)} · {post.minutes} min de leitura</p>
        <h1>{post.title}</h1>
        <p className="lead">{post.excerpt}</p>
        {/* O HTML vem dos arquivos .md do próprio repositório (conteúdo confiável). */}
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

        {next !== post && (
          <Link to={`/blog/${next.slug}`} className="post__next" data-cursor="Ler">
            <span className="mono">Próximo artigo</span>
            <strong>{next.title} →</strong>
          </Link>
        )}
      </div>
    </article>
  )
}
