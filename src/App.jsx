import { lazy, Suspense, useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ReadyContext, ScrollTrigger, scrollToTarget, startLenis } from './lib/motion.js'
import Preloader from './components/Preloader.jsx'
import Nav from './components/Nav.jsx'
import Cursor from './components/Cursor.jsx'
import Contact from './sections/Contact.jsx'
import Home from './pages/Home.jsx'
// Páginas internas viram arquivos separados, baixados só quando a pessoa entra nelas.
const Projects = lazy(() => import('./pages/Projects.jsx'))
const Project = lazy(() => import('./pages/Project.jsx'))
const Blog = lazy(() => import('./pages/Blog.jsx'))
const Post = lazy(() => import('./pages/Post.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

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
      {/* Filtro do contorno dos nomes (hero e rodapé): letra cheia menos a mesma letra "encolhida" = só a borda. */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="text-outline" x="-2%" y="-10%" width="104%" height="120%" colorInterpolationFilters="sRGB">
          <feMorphology in="SourceAlpha" operator="erode" radius="1.4" result="miolo" />
          <feComposite in="SourceGraphic" in2="miolo" operator="out" />
        </filter>
      </svg>
      <Preloader onDone={() => setReady(true)} />
      <ScrollManager />
      <Cursor />
      <Nav />
      <main key={pathname} className="page">
        <Suspense fallback={<div className="page-loading" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projetos" element={<Projects />} />
          <Route path="/projetos/:slug" element={<Project />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Post />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </main>
      <Contact />
    </ReadyContext.Provider>
  )
}
