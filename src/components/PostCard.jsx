import { Link } from 'react-router-dom'
import { formatDate } from '../lib/blog.js'

export default function PostCard({ post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="postcard" data-reveal data-cursor="Ler">
      <p className="mono postcard__meta">
        <span>{post.tag}</span>
        <span>{formatDate(post.date)} · {post.minutes} min</span>
      </p>
      <h3>{post.title}</h3>
      <p className="postcard__excerpt">{post.excerpt}</p>
      <span className="postcard__more mono">Ler artigo →</span>
    </Link>
  )
}
