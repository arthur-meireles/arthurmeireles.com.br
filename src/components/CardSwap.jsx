import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap, reducedMotion } from '../lib/motion.js'
import { tick } from '../lib/haptics.js'

// Pilha de cartas em 3D (celular): as capas ficam escalonadas na diagonal e, a cada intervalo
// ou quando a pessoa joga a carta com o dedo, a da frente cai e volta para o fundo da pilha.
// Tocar na carta da frente abre o projeto.
const INTERVAL = 4200
const VISIBLE = 4 // cartas visíveis na pilha; as demais esperam escondidas atrás

export default function CardSwap({ projects, onActive }) {
  const root = useRef(null)
  const cards = useRef([])
  const navigate = useNavigate()
  const navRef = useRef(navigate)
  const activeRef = useRef(onActive)
  navRef.current = navigate
  activeRef.current = onActive

  useEffect(() => {
    const el = root.current
    const els = cards.current.filter(Boolean)
    const n = els.length
    const still = reducedMotion()
    let order = els.map((_, i) => i) // order[0] = carta da frente
    let busy = false
    let timer = 0
    let visible = false

    // Posição de cada lugar da pilha: sobe e vai para a direita, afastando em profundidade.
    const slot = (i) => {
      const k = Math.min(i, VISIBLE)
      const w = el.clientWidth
      return {
        x: k * w * 0.075,
        y: -k * w * 0.085,
        z: -k * 70,
        zIndex: n - i,
        opacity: i < VISIBLE ? 1 : 0,
      }
    }
    const place = () => order.forEach((idx, i) => gsap.set(els[idx], { ...slot(i), skewY: 6, xPercent: -50, yPercent: -50, transformOrigin: 'center center', force3D: true }))
    place()
    activeRef.current?.(order[0])

    const swap = (dir = 1) => {
      if (busy || n < 2) return
      busy = true
      const [front, ...rest] = order
      const frontEl = els[front]
      tick()
      if (still) {
        order = [...rest, front]
        place()
        activeRef.current?.(order[0])
        busy = false
        return
      }
      const tl = gsap.timeline({
        onComplete: () => {
          busy = false
        },
      })
      // 1) A carta da frente cai para fora (para baixo e um pouco para o lado do gesto).
      tl.to(frontEl, { y: '+=' + el.clientHeight * 0.9, x: '+=' + dir * 40, rotation: dir * 6, duration: 0.7, ease: 'power2.in' })
      // 2) As outras avançam um lugar, com um leve atraso entre elas.
      tl.addLabel('promote', '-=0.35')
      rest.forEach((idx, i) => {
        const s = slot(i)
        tl.set(els[idx], { zIndex: s.zIndex }, 'promote')
        tl.to(els[idx], { x: s.x, y: s.y, z: s.z, opacity: s.opacity, duration: 0.9, ease: 'elastic.out(0.6, 0.85)' }, `promote+=${i * 0.12}`)
      })
      tl.call(() => activeRef.current?.(rest[0]), [], 'promote')
      // 3) A que caiu volta pelo fundo da pilha.
      const back = slot(n - 1)
      tl.addLabel('return', `promote+=${0.2 + rest.length * 0.05}`)
      tl.set(frontEl, { zIndex: back.zIndex, rotation: 0 }, 'return')
      tl.to(frontEl, { x: back.x, y: back.y, z: back.z, opacity: back.opacity, duration: 0.9, ease: 'elastic.out(0.6, 0.85)' }, 'return')
      order = [...rest, front]
    }

    const restart = () => {
      clearInterval(timer)
      if (!still && visible) timer = setInterval(() => !document.hidden && swap(1), INTERVAL)
    }

    // Gestos: jogar a carta (deslizar) troca na hora; um toque curto abre o projeto da frente.
    let start = null
    const down = (e) => {
      start = { x: e.clientX, y: e.clientY, t: performance.now() }
    }
    const up = (e) => {
      if (!start) return
      const dx = e.clientX - start.x
      const dy = e.clientY - start.y
      const dist = Math.hypot(dx, dy)
      start = null
      if (dist > 36) {
        swap(Math.sign(dx) || 1)
        restart()
      } else if (dist < 8 && e.target.closest('.cswap__card') === els[order[0]]) {
        navRef.current(`/projetos/${projects[order[0]].slug}`)
      }
    }
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', () => (start = null))

    // Só troca sozinha enquanto a pilha está na tela.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      restart()
    })
    io.observe(el)
    const ro = new ResizeObserver(place)
    ro.observe(el)

    return () => {
      clearInterval(timer)
      io.disconnect()
      ro.disconnect()
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointerup', up)
      gsap.killTweensOf(els)
    }
  }, [projects])

  return (
    <div className="cswap" ref={root}>
      {projects.map((p, i) => (
        <article key={p.slug} className="cswap__card" ref={(node) => (cards.current[i] = node)} data-cursor="Ver projeto">
          <header className="cswap__bar">
            <span className="mono">{String(i + 1).padStart(2, '0')}</span>
            <strong>{p.title}</strong>
            <span className="cswap__dot" aria-hidden="true" />
          </header>
          <img src={p.thumbSm} alt={`Tela do projeto ${p.title}`} width="640" height="501" loading="lazy" decoding="async" draggable="false" />
        </article>
      ))}
      <p className="cswap__hint mono">Deslize a carta · toque para abrir</p>
    </div>
  )
}
