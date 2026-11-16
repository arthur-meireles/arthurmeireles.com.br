import { useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/motion.js'

// Cursor "multiplayer" do Figma: segue o mouse e mostra um rótulo
// quando passa sobre elementos com data-cursor="Texto".
export default function Cursor() {
  const el = useRef(null)
  const label = useRef(null)

  useEffect(() => {
    if (reducedMotion() || !window.matchMedia('(pointer: fine)').matches) return
    const node = el.current
    node.style.display = 'block'
    const x = gsap.quickTo(node, 'x', { duration: 0.35, ease: 'power3' })
    const y = gsap.quickTo(node, 'y', { duration: 0.35, ease: 'power3' })

    // Elementos com data-magnetic são puxados de leve na direção do cursor.
    let pulled = null
    const release = () => {
      if (pulled) gsap.to(pulled, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' })
      pulled = null
    }

    const move = (e) => {
      x(e.clientX)
      y(e.clientY)
      const magnet = e.target.closest?.('[data-magnetic]')
      if (magnet !== pulled) release()
      if (magnet) {
        pulled = magnet
        const r = magnet.getBoundingClientRect()
        gsap.to(magnet, {
          x: (e.clientX - (r.left + r.width / 2)) * 0.28,
          y: (e.clientY - (r.top + r.height / 2)) * 0.28,
          duration: 0.4,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      }
      const target = e.target.closest?.('[data-cursor]')
      const text = target?.dataset.cursor
      if (text) label.current.textContent = text
      node.classList.toggle('is-active', Boolean(text))
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      release()
    }
  }, [])

  return (
    <div className="cursor" ref={el} aria-hidden="true">
      <span className="cursor__label mono" ref={label}>Ver</span>
    </div>
  )
}
