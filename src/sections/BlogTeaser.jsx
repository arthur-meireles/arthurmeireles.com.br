import { useRef } from 'react'
import { Link } from 'react-router-dom'
import PostCard from '../components/PostCard.jsx'
import { gsap, MOTION_OK, revealOnScroll, useGSAP } from '../lib/motion.js'
import { posts } from '../lib/blog.js'

export default function BlogTeaser() {
  const root = useRef(null)
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => revealOnScroll(root.current))
    },
    { scope: root }
  )

  return (
    <section className="blogteaser is-light" ref={root}>
      <div className="wrap">
        <header className="blogteaser__head">
          <div>
            <p className="eyebrow mono" data-reveal>(07) Blog</p>
            <h2 className="h2" data-reveal>
              Notas sobre design<br />e <em className="serif">produto.</em>
            </h2>
          </div>
          <Link to="/blog" className="btn" data-reveal data-magnetic>Todos os artigos <span>→</span></Link>
        </header>
        <div className="postgrid">
          {posts.slice(0, 3).map((p) => <PostCard post={p} key={p.slug} />)}
        </div>
      </div>
    </section>
  )
}
