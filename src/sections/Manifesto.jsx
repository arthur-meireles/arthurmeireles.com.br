import { useRef } from 'react'
import { Words } from '../components/Split.jsx'
import Float from '../components/Float.jsx'
import { floatOnScroll, gsap, MOTION_OK, useGSAP } from '../lib/motion.js'
import { clients, manifesto, manifestoAccent, numbers } from '../content/site.js'

export default function Manifesto() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        floatOnScroll(root.current)
        // As palavras "acendem" conforme o scroll passa pelo parágrafo.
        gsap.fromTo(
          '.manifesto__text .word',
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: { trigger: '.manifesto__text', start: 'top 80%', end: 'bottom 45%', scrub: true },
          }
        )

        gsap.utils.toArray('.stat').forEach((stat) => {
          const num = stat.querySelector('.stat__num')
          const target = Number(num.dataset.value)
          const obj = { v: 0 }
          gsap.to(obj, {
            v: target,
            duration: 1.8,
            ease: 'power3.out',
            onUpdate: () => (num.textContent = Math.round(obj.v)),
            scrollTrigger: { trigger: stat, start: 'top 85%', once: true },
          })
          gsap.from(stat, {
            y: 40,
            autoAlpha: 0,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: { trigger: stat, start: 'top 90%', once: true },
          })
        })

        gsap.to('.marquee__track', {
          xPercent: -50,
          ease: 'none',
          scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: 0.5 },
        })
      })
    },
    { scope: root }
  )

  return (
    <section className="manifesto" ref={root}>
      <Float name="cursor" />
      <div className="wrap">
        <p className="eyebrow mono">(01) Manifesto</p>
        <p className="manifesto__text">
          <Words text={manifesto} accent={manifestoAccent} />
        </p>

        <ul className="stats">
          {numbers.map((n) => (
            <li className="stat" key={n.label}>
              <p className="stat__value">
                <span>{n.prefix}</span>
                <span className="stat__num" data-value={n.value}>{n.value}</span>
              </p>
              <p className="stat__label">{n.label}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="marquee" aria-label="Clientes e empresas com quem trabalhei">
        <div className="marquee__track">
          {[...clients, ...clients].map((c, i) => (
            <span key={i} aria-hidden={i >= clients.length}>
              <img src={c.logo} alt={i < clients.length ? c.name : ''} width={c.w} height={c.h} loading="lazy" decoding="async" />
              <i>✦</i>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
