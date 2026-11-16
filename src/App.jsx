import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ReadyContext, ScrollTrigger, scrollToTarget, startLenis } from './lib/motion.js'
import Preloader from './components/Preloader.jsx'
import Nav from './components/Nav.jsx'
import Cursor from './components/Cursor.jsx'
import Contact from './sections/Contact.jsx'
import Home from './pages/Home.jsx'
import Projects from './pages/Projects.jsx'
import Project from './pages/Project.jsx'
import Blog from './pages/Blog.jsx'
import Post from './pages/Post.jsx'
import NotFound from './pages/NotFound.jsx'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // Dá tempo de a página montar e os pins medirem antes de rolar até a âncora.
      const id = setTimeout(() => {
        ScrollTrigger.refresh()
        scrollToTarget(hash)
      }, 350)
      return () => clearTimeout(id)
    }
    scrollToTarget(0, true)
    window.scrollTo(0, 0)
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [pathname, hash])
  return null
}

export default function App() {
  const [ready, setReady] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => startLenis(), [])
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <ReadyContext.Provider value={ready}>
      <Preloader onDone={() => setReady(true)} />
      <ScrollManager />
      <Cursor />
      <Nav />
      <main key={pathname} className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projetos" element={<Projects />} />
          <Route path="/projetos/:slug" element={<Project />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Post />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Contact />
    </ReadyContext.Provider>
  )
}
