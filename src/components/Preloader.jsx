import { useRef, useState } from 'react'
import { gsap, reducedMotion, useGSAP } from '../lib/motion.js'

// Tela de entrada: o nome é "montado" enquanto o contador sobe, depois a cortina abre.
export default function Preloader({ onDone }) {
  const root = useRef(null)
  const [gone, setGone] = useState(false)

  useGSAP(
    () => {
      const finish = () => {
        setGone(true)
        onDone()
      }
      if (reducedMotion()) return finish()

      const count = { v: 0 }
      const num = root.current.querySelector('.preloader__count')
      document.documentElement.classList.add('is-locked')

      gsap
        .timeline({
          defaults: { ease: 'expo.inOut' },
          onComplete: () => {
            document.documentElement.classList.remove('is-locked')
            setGone(true)
          },
        })
        .from('.preloader__name span', { yPercent: 110, duration: 0.9, stagger: 0.035, ease: 'expo.out' })
        .to(count, {
          v: 100,
          duration: 1.3,
          ease: 'power2.inOut',
          onUpdate: () => (num.textContent = String(Math.round(count.v)).padStart(3, '0')),
        }, 0)
        .to('.preloader__bar i', { scaleX: 1, duration: 1.3, ease: 'power2.inOut' }, 0)
        .to('.preloader__name span', { yPercent: -110, duration: 0.6, stagger: 0.02, ease: 'expo.in' }, 1.35)
        .add(onDone, 1.75)
        .to(root.current, { yPercent: -100, duration: 0.9 }, 1.75)
    },
    { scope: root }
  )

  if (gone) return null
  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="preloader__name">
        {'Arthur Meireles'.split('').map((c, i) => (
          <span key={i}>{c === ' ' ? ' ' : c}</span>
        ))}
      </div>
      <div className="preloader__foot">
        <span className="mono">Portfólio — UX/UI & Product Design</span>
        <span className="preloader__bar"><i /></span>
        <span className="mono preloader__count">000</span>
      </div>
    </div>
  )
}
