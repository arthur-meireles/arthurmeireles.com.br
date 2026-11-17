import { useEffect, useRef } from 'react'
import { createLightfall } from '../lib/lightfall.js'
import { reducedMotion } from '../lib/motion.js'

// Chuva de luz ocupando o elemento pai inteiro (o rodapé). Só anima enquanto está na tela.
export default function Lightfall({ className = '', alpha = 1 }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const el = canvas.parentElement
    const ctx = canvas.getContext('2d')
    const lf = createLightfall()
    const still = reducedMotion()
    const mobile = window.matchMedia('(max-width: 899px)').matches
    let W = 0
    let H = 0
    let s = 1
    let visible = false
    let raf = 0
    let last = 0

    const resize = () => {
      W = el.clientWidth
      H = el.clientHeight
      if (!W || !H) return
      s = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2)
      canvas.width = Math.round(W * s)
      canvas.height = Math.round(H * s)
      lf.resize(W, H)
      if (still) paint(0)
    }
    const paint = (dt) => {
      ctx.setTransform(s, 0, 0, s, 0, 0)
      ctx.clearRect(0, 0, W, H)
      ctx.globalAlpha = alpha
      lf.step(ctx, dt)
      ctx.globalAlpha = 1
    }
    const loop = (now) => {
      raf = 0
      if (!visible) return
      paint(Math.min(0.05, (now - last) / 1000 || 0))
      last = now
      raf = requestAnimationFrame(loop)
    }
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !raf && !still) {
        last = performance.now()
        raf = requestAnimationFrame(loop)
      }
    })
    io.observe(el)
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    resize()
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
    }
  }, [alpha])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
