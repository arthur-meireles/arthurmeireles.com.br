import { useRef } from 'react'
import { gsap, MOTION_OK, revealOnScroll, useGSAP } from '../lib/motion.js'
import { benefits, services } from '../content/site.js'

export default function Services() {
  const root = useRef(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        revealOnScroll(root.current)
        gsap.utils.toArray('.service').forEach((el) => {
          gsap.from(el.querySelector('.service__rule'), {
            scaleX: 0,
            duration: 1.4,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          })
        })
      })
    },
    { scope: root }
  )

  return (
    <section className="services" ref={root}>
      <div className="wrap">
        <header className="services__head">
          <div>
            <p className="eyebrow mono" data-reveal>(04) Serviços</p>
            <h2 className="h2" data-reveal>
              Como posso<br />te <em className="serif">ajudar.</em>
            </h2>
          </div>
          <ul className="checks">
            {benefits.map((b) => (
              <li key={b} data-reveal><i aria-hidden="true">✓</i>{b}</li>
            ))}
          </ul>
        </header>

        <ul className="services__list">
          {services.map((s, i) => (
            <li className="service" key={s.title}>
              <span className="service__rule" />
              <span className="mono" data-reveal>{String(i + 1).padStart(2, '0')}</span>
              <h3 data-reveal>{s.title}</h3>
              <p data-reveal>{s.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
