import { useRef } from 'react'
import Float from '../components/Float.jsx'
import Clothesline from '../components/Clothesline.jsx'
import { floatOnScroll, gsap, MOTION_OK, revealOnScroll, useGSAP } from '../lib/motion.js'
import { about, experience, moments, site, testimonials } from '../content/site.js'

export default function About() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        revealOnScroll(root.current)
        floatOnScroll(root.current)

        // A foto abre como uma janela e desliza por dentro da moldura.
        gsap.fromTo(
          '.about__photo',
          { clipPath: 'inset(18% 14% 18% 14%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'none',
            scrollTrigger: { trigger: '.about__photo', start: 'top 90%', end: 'top 25%', scrub: true },
          }
        )

        gsap.utils.toArray('.quote').forEach((q) => {
          gsap.from(q.querySelectorAll('.line__inner'), {
            yPercent: 105,
            duration: 1.1,
            ease: 'expo.out',
            stagger: 0.08,
            scrollTrigger: { trigger: q, start: 'top 82%', once: true },
          })
        })
      })
    },
    { scope: root }
  )

  return (
    <section className="about" id="sobre" ref={root}>
      <div className="wrap about__grid">
        <div className="about__copy">
          <p className="eyebrow mono" data-reveal>(05) Sobre mim</p>
          <h2 className="display" data-reveal>
            Prazer,<br /><em className="serif">Arthur.</em>
          </h2>
          {about.paragraphs.map((p) => <p key={p.slice(0, 20)} className="lead" data-reveal>{p}</p>)}

          <ul className="tags" data-reveal>
            {about.tools.map((t) => <li className="mono" key={t}>{t}</li>)}
          </ul>

          <ul className="xp">
            {experience.map((e) => (
              <li key={e.company + e.period} data-reveal>
                <span className="mono">{e.period}</span>
                <strong>{e.role}</strong>
                <span>{e.company}</span>
              </li>
            ))}
          </ul>
        </div>

        <figure className="about__figure">
          <div className="about__photo">
            <img src="/img/arthur-retrato.webp" alt="Retrato em preto e branco de Arthur ajustando os óculos" width="768" height="1376" loading="lazy" />
          </div>
          <figcaption className="mono">{site.location}</figcaption>
        </figure>
      </div>

      <Clothesline photos={moments} />

      <div className="quotes wrap">
        <Float name="frame" speed={0.7} />
        <p className="eyebrow mono" data-reveal>(06) O que dizem sobre meu trabalho</p>
        {testimonials.map((t, i) => (
          <blockquote className={`quote ${i === 0 ? 'quote--big' : ''}`} key={t.name}>
            <p>
              <span className="line"><span className="line__inner">“{t.quote}”</span></span>
            </p>
            <footer data-reveal>
              <strong>{t.name}</strong>
              <span className="mono">{t.company}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  )
}
