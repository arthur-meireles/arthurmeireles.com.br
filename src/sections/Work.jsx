import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { DESKTOP, gsap, MOTION_OK, revealOnScroll, ScrollTrigger, useGSAP } from '../lib/motion.js'
import { featured, projects } from '../content/projects.js'

export default function Work() {
  const root = useRef(null)
  const preview = useRef(null)
  const [hovered, setHovered] = useState(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Desktop: a galeria de destaques anda na horizontal enquanto a seção fica presa.
      mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
        const track = root.current.querySelector('.work__track')
        const distance = () => track.scrollWidth - window.innerWidth
        // As capas inclinam de leve com a velocidade do scroll e voltam ao parar.
        const skew = gsap.quickTo('.card__media', 'skewX', { duration: 0.5, ease: 'power3' })
        const clamp = gsap.utils.clamp(-5, 5)
        const settle = () => skew(0)
        ScrollTrigger.addEventListener('scrollEnd', settle)

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.work__pin',
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => skew(clamp(self.getVelocity() / -350)),
          },
        })
        gsap.to('.work__progress i', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.work__pin', start: 'top top', end: () => `+=${distance()}`, scrub: true },
        })
        // Parallax interno de cada imagem, ligado ao movimento horizontal.
        gsap.utils.toArray('.card__media img').forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: 'none',
              scrollTrigger: { trigger: img, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
            }
          )
        })
        return () => ScrollTrigger.removeEventListener('scrollEnd', settle)
      })

      mm.add(MOTION_OK, () => {
        revealOnScroll(root.current)
        const x = gsap.quickTo(preview.current, 'x', { duration: 0.5, ease: 'power3' })
        const y = gsap.quickTo(preview.current, 'y', { duration: 0.5, ease: 'power3' })
        const move = (e) => {
          x(e.clientX)
          y(e.clientY)
        }
        window.addEventListener('pointermove', move, { passive: true })
        return () => window.removeEventListener('pointermove', move)
      })
    },
    { scope: root }
  )

  return (
    <section className="work" id="projetos" ref={root}>
      <div className="work__pin">
        <header className="work__head wrap">
          <p className="eyebrow mono">(02) Projetos selecionados</p>
          <div className="work__progress"><i /></div>
          <p className="mono work__count">{String(featured.length).padStart(2, '0')} destaques</p>
        </header>

        <div className="work__track">
          <div className="work__intro">
            <h2 className="display">
              Trabalho<br />que <em className="serif">entrega.</em>
            </h2>
            <p>De landing pages a ERPs inteiros. Clique em qualquer projeto para ver o trabalho completo.</p>
          </div>

          {featured.map((p, i) => (
            <Link to={`/projetos/${p.slug}`} className="card" key={p.slug} data-cursor="Ver projeto">
              <div className="card__media">
                <img src={p.thumb} alt={`Tela do projeto ${p.title}`} width="1200" height="900" loading="lazy" decoding="async" />
              </div>
              <div className="card__info">
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.title}</h3>
                <span className="mono card__type">{p.type} — {p.year}</span>
              </div>
            </Link>
          ))}

          <Link to="/projetos" className="work__all" data-cursor="Abrir">
            <span className="mono">{projects.length} projetos no arquivo</span>
            <strong className="display">Ver<br />todos <em className="serif">→</em></strong>
          </Link>
        </div>
      </div>

      <div className="archive wrap">
        <header className="archive__head">
          <h2 className="h2" data-reveal>Arquivo completo</h2>
          <p className="mono" data-reveal>2021 — 2026</p>
        </header>
        <ul className="archive__list" onPointerLeave={() => setHovered(null)}>
          {projects.map((p) => (
            <li key={p.slug} data-reveal>
              <Link to={`/projetos/${p.slug}`} className="row" onPointerEnter={() => setHovered(p)} onFocus={() => setHovered(p)}>
                <span className="mono row__year">{p.year}</span>
                <span className="row__title">{p.title}</span>
                <span className="row__type">{p.type}</span>
                <span className="row__arrow" aria-hidden="true">↗</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className={`preview ${hovered ? 'is-on' : ''}`} ref={preview} aria-hidden="true">
        {hovered && <img src={hovered.thumb} alt="" key={hovered.slug} />}
      </div>
    </section>
  )
}
