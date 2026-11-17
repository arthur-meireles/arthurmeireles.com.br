import { useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/motion.js'

// Retrato do hero com 2 poses x 2 versões (preto e branco / colorida).
// - Parado: preto e branco, alternando de pose a cada alguns segundos.
// - Hover (ou toque): a pose atual "glitcha" para a versão colorida.
// Cada pose compartilha a mesma moldura entre as versões P&B e colorida, então o glitch fica alinhado.
const POSES = ['a', 'b']
const src = (pose, version) => `/img/arthur-${pose}-${version}.webp`
const CYCLE_MS = 6000

const rand = gsap.utils.random
const SPLIT = 'drop-shadow(7px 0 0 rgba(13,153,255,.85)) drop-shadow(-7px 0 0 rgba(255,40,90,.7))'

export default function GlitchPortrait({ className = '' }) {
  const root = useRef(null)
  const state = useRef({ pose: 0, color: false, tl: null })

  useEffect(() => {
    const el = root.current
    const img = (pose, color) => el.querySelector(`[data-key="${POSES[pose]}-${color ? 'cor' : 'pb'}"]`)
    const still = reducedMotion()

    // Troca da imagem `from` para `to` com fatias deslocadas e separação de canais.
    const swap = (from, to) => {
      if (from === to) return
      state.current.tl?.progress(1)
      if (still) {
        gsap.set(from, { autoAlpha: 0 })
        gsap.set(to, { autoAlpha: 1 })
        return
      }
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(from, { autoAlpha: 0, clearProps: 'clipPath,x,filter' })
          gsap.set(to, { clearProps: 'clipPath,x,filter' })
        },
      })
      const steps = 7
      for (let i = 0; i < steps; i++) {
        const top = rand(0, 80)
        const band = rand(6, 26)
        const fade = 1 - i / steps // o deslocamento diminui até assentar
        tl.set(to, { autoAlpha: 1, x: rand(-22, 22) * fade, filter: i % 2 ? SPLIT : 'none' }, i * 0.055)
        tl.set(
          from,
          {
            autoAlpha: i < steps - 1 ? 1 : 0,
            x: rand(-36, 36),
            clipPath: `inset(${top}% 0 ${Math.max(0, 100 - top - band)}% 0)`,
            filter: SPLIT,
          },
          i * 0.055
        )
      }
      tl.set(to, { x: 0, filter: 'none' }, steps * 0.055)
      state.current.tl = tl
    }

    const go = (pose, color) => {
      const s = state.current
      const from = img(s.pose, s.color)
      s.pose = pose
      s.color = color
      swap(from, img(pose, color))
    }

    const enter = () => go(state.current.pose, true)
    const leave = () => go(state.current.pose, false)
    const tap = (e) => {
      if (e.pointerType === 'mouse') return
      go(state.current.pose, !state.current.color)
    }
    el.addEventListener('pointerenter', enter)
    el.addEventListener('pointerleave', leave)
    el.addEventListener('pointerup', tap)

    // Alterna a pose sozinha enquanto o hero está no topo e ninguém está em cima da foto.
    const timer = setInterval(() => {
      if (still || document.hidden || window.scrollY > 40 || state.current.color) return
      go((state.current.pose + 1) % POSES.length, false)
    }, CYCLE_MS)

    return () => {
      clearInterval(timer)
      state.current.tl?.kill()
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointerleave', leave)
      el.removeEventListener('pointerup', tap)
    }
  }, [])

  return (
    <div className={`glitch ${className}`} ref={root} data-cursor="Em cores">
      {POSES.flatMap((pose, p) =>
        ['pb', 'cor'].map((version) => (
          <img
            key={`${pose}-${version}`}
            data-key={`${pose}-${version}`}
            src={src(pose, version)}
            alt={p === 0 && version === 'pb' ? 'Arthur Meireles, de braços cruzados, sorrindo' : ''}
            aria-hidden={p === 0 && version === 'pb' ? undefined : 'true'}
            width="1600"
            height="1805"
            decoding="async"
            style={p === 0 && version === 'pb' ? undefined : { visibility: 'hidden', opacity: 0 }}
          />
        ))
      )}
    </div>
  )
}
