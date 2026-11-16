import { useRef } from 'react'
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from '../lib/motion.js'

// Varal de polaroids: um cordão com barriga, pregadores e fotos penduradas.
// Cada foto balança sozinha, reage à velocidade do scroll e dá um tranco no hover.
const TILT = [-3, 2, -1.5, 2.5, -2]

export default function Clothesline({ photos }) {
  const root = useRef(null)
  const n = photos.length

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const pegs = gsap.utils.toArray('.peg', root.current)
        const cards = gsap.utils.toArray('.polaroid', root.current)
        const base = (i) => TILT[i % TILT.length]

        // Balanço contínuo, cada foto no seu ritmo.
        const sway = (peg, i) =>
          gsap.to(peg, {
            rotation: base(i) + (i % 2 ? 1.8 : -1.8),
            duration: 2.4 + (i % 3) * 0.5,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          })

        // Entrada: o cordão é esticado e as fotos caem e assentam uma a uma.
        gsap.set(pegs, { autoAlpha: 0, y: -70, rotation: (i) => (i % 2 ? 22 : -22) })
        gsap.set('.varal__rope', { clipPath: 'inset(-20px 100% -20px 0)' })
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: 'top 78%', once: true } })
          .to('.varal__rope', { clipPath: 'inset(-20px 0% -20px 0)', duration: 1.1, ease: 'power2.inOut' })
          .to(
            pegs,
            {
              autoAlpha: 1,
              y: 0,
              rotation: base,
              duration: 1.6,
              ease: 'elastic.out(1, 0.38)',
              stagger: 0.13,
              // Com stagger, este callback roda uma vez por foto: é quando ela começa a balançar sozinha.
              onComplete() {
                const el = this.targets()[0]
                sway(el, pegs.indexOf(el))
              },
            },
            0.45
          )

        // O scroll empurra as fotos; ao parar, elas voltam balançando.
        const clamp = gsap.utils.clamp(-14, 14)
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) =>
            gsap.to(cards, { rotation: clamp(self.getVelocity() / -160), duration: 0.5, ease: 'power2.out', overwrite: 'auto' }),
        })
        const settle = () => {
          if (st.isActive) gsap.to(cards, { rotation: 0, duration: 2, ease: 'elastic.out(1.1, 0.3)', stagger: 0.04, overwrite: 'auto' })
        }
        ScrollTrigger.addEventListener('scrollEnd', settle)

        // Hover: um tranquinho, como quem encosta na foto.
        const nudges = cards.map((card, i) => {
          const nudge = () =>
            gsap.fromTo(card, { rotation: i % 2 ? -9 : 9 }, { rotation: 0, duration: 1.8, ease: 'elastic.out(1.2, 0.28)', overwrite: 'auto' })
          card.addEventListener('pointerenter', nudge)
          return () => card.removeEventListener('pointerenter', nudge)
        })

        return () => {
          ScrollTrigger.removeEventListener('scrollEnd', settle)
          nudges.forEach((off) => off())
        }
      })
    },
    { scope: root }
  )

  return (
    <section className="varal" ref={root} aria-label="Fora do Figma">
      <p className="mono varal__label wrap">Fora do Figma ↓</p>
      <div className="varal__strip">
        <div className="varal__inner">
          <svg className="varal__rope" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,0 Q50,100 100,0" vectorEffect="non-scaling-stroke" />
          </svg>
          <ul className="varal__photos">
            {photos.map((p, i) => {
              const t = (i + 0.5) / n // posição ao longo do cordão
              return (
                // --drop acompanha a barriga do cordão: 4·t·(1−t) vale 1 no meio e 0 nas pontas.
                <li key={p.src} style={{ '--drop': (4 * t * (1 - t)).toFixed(3) }}>
                  <div className="peg">
                    <span className="pin" aria-hidden="true" />
                    <figure className="polaroid">
                      <img src={p.src} alt={p.alt} loading="lazy" decoding="async" />
                    </figure>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
