import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap, ScrollTrigger, scrollToTarget, useGSAP } from '../lib/motion.js'
import { tick } from '../lib/haptics.js'

// Arquivo de projetos no celular: uma roda de opções curva, girada pelo scroll da página.
// A seção fica presa enquanto a pessoa rola; cada passo de rolagem encaixa no próximo projeto,
// dá um "tec" (vibração) e troca a miniatura em destaque. Tocar no item ativo abre o projeto.
const STEP = 64 // px de rolagem por projeto
const ITEM = 52 // distância vertical entre itens na roda
const RADIUS = 260 // raio do arco lateral

export default function ArchiveWheel({ projects }) {
  const root = useRef(null)
  const items = useRef([])
  const stRef = useRef(null)
  const [active, setActive] = useState(0)
  // Miniaturas só entram no DOM quando o item já esteve perto do centro (não baixa as 15 de uma vez).
  const [seen, setSeen] = useState(() => new Set([0, 1]))
  const navigate = useNavigate()
  const n = projects.length

  useGSAP(
    () => {
      let current = 0

      // Posiciona cada item no arco conforme a distância (d) até o centro.
      const render = (pos) => {
        items.current.forEach((el, i) => {
          if (!el) return
          const d = i - pos
          const ad = Math.abs(d)
          const y = d * ITEM
          const x = RADIUS - Math.sqrt(Math.max(0, RADIUS * RADIUS - y * y)) // curva para o lado
          el.style.transform = `translate3d(${x}px, ${y}px, 0) rotateX(${(-d * 17).toFixed(2)}deg) scale(${Math.max(0.55, 1 - ad * 0.13).toFixed(3)})`
          el.style.opacity = ad > 4.5 ? '0' : Math.max(0, 1 - ad * 0.24).toFixed(3)
          el.style.filter = ad < 0.15 ? 'none' : `blur(${Math.min(4, ad * 1.25).toFixed(2)}px)`
        })
      }

      const select = (idx) => {
        if (idx === current) return
        current = idx
        setActive(idx)
        setSeen((prev) => {
          if (prev.has(idx - 1) && prev.has(idx) && prev.has(idx + 1)) return prev
          const next = new Set(prev)
          ;[idx - 1, idx, idx + 1].forEach((k) => k >= 0 && k < n && next.add(k))
          return next
        })
        tick()
      }

      render(0)
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: () => `+=${(n - 1) * STEP}`,
        pin: true,
        // Encaixa sempre num projeto, como as posições de um relógio.
        snap: { snapTo: 1 / (n - 1), duration: { min: 0.12, max: 0.3 }, delay: 0.05, ease: 'power2.out' },
        onUpdate: (self) => {
          const pos = self.progress * (n - 1)
          render(pos)
          select(Math.round(pos))
        },
      })
      stRef.current = st
      return () => {
        stRef.current = null
      }
    },
    { scope: root }
  )

  // Toque num item: se já é o ativo, abre o projeto; senão, gira a roda até ele.
  const onItem = (e, i, slug) => {
    e.preventDefault()
    const st = stRef.current
    if (i === active || !st) {
      navigate(`/projetos/${slug}`)
      return
    }
    scrollToTarget(st.start + (i / (n - 1)) * (st.end - st.start))
  }

  const p = projects[active]

  return (
    <div className="awheel" ref={root}>
      <header className="awheel__head">
        <h2 className="h2">Arquivo completo</h2>
        <p className="mono">
          {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
        </p>
      </header>

      <Link to={`/projetos/${p.slug}`} className="awheel__thumb" aria-label={`Abrir ${p.title}`}>
        {projects.map((proj, i) =>
          seen.has(i) ? (
            <img key={proj.slug} src={proj.thumbSm} alt="" className={i === active ? 'is-on' : ''} decoding="async" />
          ) : null
        )}
        <span className="awheel__meta mono">
          <span>{p.type}</span>
          <span>{p.year} ↗</span>
        </span>
      </Link>

      <div className="awheel__wheel">
        <span className="awheel__marker" aria-hidden="true" />
        <ul>
          {projects.map((proj, i) => (
            <li key={proj.slug} ref={(el) => (items.current[i] = el)}>
              <a
                href={`/projetos/${proj.slug}`}
                className={i === active ? 'is-active' : ''}
                aria-current={i === active ? 'true' : undefined}
                onClick={(e) => onItem(e, i, proj.slug)}
              >
                {proj.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className="awheel__hint mono">Role para girar · toque para abrir</p>
    </div>
  )
}
