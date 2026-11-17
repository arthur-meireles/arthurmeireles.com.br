import { useCallback, useEffect, useRef, useState } from 'react'
import ArchiveWheel from '../components/ArchiveWheel.jsx'
import FlexRow from '../components/FlexRow.jsx'
import { Link } from 'react-router-dom'
import { gsap, MOTION_OK, revealOnScroll, useGSAP } from '../lib/motion.js'
import { featured, projects } from '../content/projects.js'

// No celular (e com movimento liberado) o arquivo vira a roda de opções; no desktop fica a lista com hover.
const WHEEL_QUERY = '(max-width: 899px) and (prefers-reduced-motion: no-preference)'
function useWheel() {
  const [on, setOn] = useState(() => typeof window !== 'undefined' && window.matchMedia(WHEEL_QUERY).matches)
  useEffect(() => {
    const mq = window.matchMedia(WHEEL_QUERY)
    const update = () => setOn(mq.matches)
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return on
}

export default function Work() {
  const wheel = useWheel()
  const root = useRef(null)
  const preview = useRef(null)
  const [hovered, setHovered] = useState(null)

  // Projeto que está no centro da fileira, para a legenda.
  const [current, setCurrent] = useState(0)
  const onActive = useCallback((i) => setCurrent(i), [])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        revealOnScroll(root.current)
        const x = gsap.quickTo(preview.current, 'x', { duration: 0.5, ease: 'power3' })
        const y = gsap.quickTo(preview.current, 'y', { duration: 0.5, ease: 'power3' })
        const move = (e) => {
          x(e.clientX)
          y(e.clientY)
        }
        window.addEventListener('pointermove', move, { passive: true })
        return () => window.removeEventListener('pointermove', move)
      })
    },
    { scope: root }
  )

  return (
    <section className="work" id="projetos" ref={root}>
      <header className="work__head wrap">
        <p className="eyebrow mono">(02) Projetos selecionados</p>
        <span className="work__rule" aria-hidden="true" />
        <p className="mono work__count">{String(featured.length).padStart(2, '0')} destaques</p>
      </header>

      <div className="work__intro wrap">
        <h2 className="display" data-reveal>
          Trabalho que <em className="serif">entrega.</em>
        </h2>
        <p data-reveal>De landing pages a ERPs inteiros. Arraste, role ou clique numa capa para ver o projeto completo.</p>
      </div>

      <FlexRow projects={featured} onActive={onActive} />

      <div className="work__caption wrap">
        <p className="mono work__index">
          {String(current + 1).padStart(2, '0')} / {String(featured.length).padStart(2, '0')}
        </p>
        <Link to={`/projetos/${featured[current].slug}`} className="work__now" data-cursor="Ver projeto" key={featured[current].slug}>
          <strong>{featured[current].title}</strong>
          <span className="mono">{featured[current].type} — {featured[current].year}</span>
        </Link>
        <Link to="/projetos" className="btn" data-magnetic>
          Ver todos os {projects.length} <span>→</span>
        </Link>
      </div>

      {wheel ? (
        <div className="archive archive--wheel">
          <ArchiveWheel projects={projects} />
        </div>
      ) : (
      <div className="archive wrap">
        <header className="archive__head">
          <h2 className="h2" data-reveal>Arquivo completo</h2>
          <p className="mono" data-reveal>2021 — 2026</p>
        </header>
        <ul className="archive__list" onPointerLeave={() => setHovered(null)}>
          {projects.map((p) => (
            <li key={p.slug} data-reveal>
              <Link to={`/projetos/${p.slug}`} className="row" onPointerEnter={() => setHovered(p)} onFocus={() => setHovered(p)}>
                <span className="mono row__year">{p.year}</span>
                <span className="row__title">{p.title}</span>
                <span className="row__type">{p.type}</span>
                <span className="row__arrow" aria-hidden="true">↗</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      )}

      <div className={`preview ${hovered ? 'is-on' : ''}`} ref={preview} aria-hidden="true">
        {hovered && <img src={hovered.thumbSm} alt="" key={hovered.slug} />}
      </div>
    </section>
  )
}
