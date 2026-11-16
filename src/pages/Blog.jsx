import PageHead from '../components/PageHead.jsx'
import PostCard from '../components/PostCard.jsx'
import { posts } from '../lib/blog.js'

export default function Blog() {
  return (
    <div className="is-light blogpage">
      <PageHead eyebrow={`Blog — ${posts.length} artigos`} lines={['Notas sobre', 'design e produto.']} title="Blog">
        <p className="lead">O que aprendo desenhando interfaces, sistemas e negócios digitais.</p>
      </PageHead>
      <section className="wrap postgrid">
        {posts.map((p) => <PostCard post={p} key={p.slug} />)}
      </section>
    </div>
  )
}
