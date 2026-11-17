import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Chars } from '../components/Split.jsx'
import GlitchPortrait from '../components/GlitchPortrait.jsx'
import { gsap, MOTION_OK, useGSAP, useReady } from '../lib/motion.js'
import { projects } from '../content/projects.js'
import { site } from '../content/site.js'

// 8 pranchetas que aparecem ao redor do hero quando a "câmera" afasta.
const slots = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]
const boardSlugs = ['moicanos', 'gb-agritech', 'protein', 'wyre', 'off-the-grid-erp', 'dr-fernando', 'greenbelt', 'fivem-360']
const boards = boardSlugs.map((slug, i) => ({ ...projects.find((p) => p.slug === slug), col: slots[i][0], row: slots[i][1] }))

const ZOOM = 0.4

export default function Hero() {
  const root = useRef(null)
  const ready = useReady()

  // Entrada: o hero é "desenhado" — wireframe, seleção, preenchimento, foto.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.set('.hero__solid .hero__line', { clipPath: 'inset(0 100% 0 0)' })
        gsap.set('.hero__stroke .char', { autoAlpha: 0, yPercent: 30 })
        gsap.set('.hero__photo', { clipPath: 'inset(100% 0 0 0)' })
        gsap.set('.hero__select', { autoAlpha: 0, scale: 0.2, transformOrigin: '0 0' })
        gsap.set('.hero__pointer', { autoAlpha: 0, xPercent: -300, yPercent: 400 })
        gsap.set('.hero__meta > *', { autoAlpha: 0, y: 20 })
        gsap.set('.hero__placeholder', { autoAlpha: 0 })
        if (!ready) return

        gsap
          .timeline({ defaults: { ease: 'expo.out' } })
          .to('.hero__placeholder', { autoAlpha: 1, duration: 0.5 })
          .to('.hero__pointer', { autoAlpha: 1, xPercent: 0, yPercent: 0, duration: 0.9 }, 0)
          .to('.hero__select', { autoAlpha: 1, scale: 1, duration: 0.8 }, 0.25)
          .to('.hero__stroke .char', { autoAlpha: 1, yPercent: 0, duration: 0.7, stagger: 0.035 }, 0.35)
          .to('.hero__pointer', { scale: 0.8, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.inOut' }, 1.15)
          .to('.hero__solid .hero__line', { clipPath: 'inset(0 0% 0 0)', duration: 1.1, stagger: 0.12, ease: 'expo.inOut' }, 1.25)
          .to('.hero__photo', { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'expo.inOut' }, 1.35)
          .to('.hero__placeholder', { autoAlpha: 0, duration: 0.4 }, 2.1)
          .to('.hero__meta > *', { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, 1.9)
          .to('.hero__select', { autoAlpha: 0, duration: 0.4 }, 2.5)
          .to('.hero__pointer', { xPercent: 260, yPercent: 180, duration: 1.2, ease: 'power3.inOut' }, 2.4)
      })
    },
    { scope: root, dependencies: [ready] }
  )

  // Scroll: a câmera afasta e o hero vira um frame no canvas, cercado de projetos.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: root.current, start: 'top top', end: '+=170%', pin: true, scrub: 0.6 },
          })
          .to('.hero__frameWrap', { scale: ZOOM, duration: 1, ease: 'power2.inOut' }, 0)
          .fromTo('.hero__boards', { scale: 1 / ZOOM }, { scale: 1, duration: 1, ease: 'power2.inOut' }, 0)
          .to('.hero__frame', { borderRadius: 28, duration: 0.4 }, 0)
          .to('.hero__meta, .hero__pointer', { autoAlpha: 0, duration: 0.25 }, 0)
          .fromTo('.hero__frameLabel', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.35)
          .fromTo('.hero__caption', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.8)
          .to({}, { duration: 0.25 })
      })
    },
    { scope: root }
  )

  return (
    <section className="hero" ref={root}>
      {/* Filtro do contorno do nome: letra cheia menos a mesma letra "encolhida" = só a borda. */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="text-outline" x="-2%" y="-10%" width="104%" height="120%" colorInterpolationFilters="sRGB">
          <feMorphology in="SourceAlpha" operator="erode" radius="1.4" result="miolo" />
          <feComposite in="SourceGraphic" in2="miolo" operator="out" />
        </filter>
      </svg>
      <div className="hero__boards" aria-hidden="true">
        {boards.map((b) => (
          <Link
            key={b.slug}
            to={`/projetos/${b.slug}`}
            className="hero__board"
            style={{ '--col': b.col, '--row': b.row }}
            tabIndex={-1}
            data-cursor="Ver projeto"
          >
            <span className="mono">{b.title}</span>
            <img src={b.thumbSm} alt="" loading="lazy" fetchPriority="low" decoding="async" />
          </Link>
        ))}
      </div>

      <div className="hero__frameWrap">
        <span className="hero__frameLabel">Hero — Arthur Meireles</span>
        <div className="hero__frame">
          <div className="hero__grid" />

          <h1 className="hero__name hero__solid" aria-label={site.name}>
            <span className="hero__line" aria-hidden="true">ARTHUR</span>
            <span className="hero__line" aria-hidden="true">MEIRELES</span>
          </h1>

          <div className="hero__portrait">
            <div className="hero__placeholder" />
            <GlitchPortrait className="hero__photo" />
          </div>

          <div className="hero__name hero__stroke" aria-hidden="true">
            <span className="hero__line"><Chars text="ARTHUR" /></span>
            <span className="hero__line"><Chars text="MEIRELES" /></span>
            <div className="hero__select">
              <i /><i /><i /><i />
              <b className="mono">Nome — Fill</b>
            </div>
          </div>

          <div className="hero__pointer">
            <svg viewBox="0 0 20 20" width="20" height="20"><path d="M2 2l5.5 15 2.4-6.2L16 8.5z" fill="currentColor" stroke="#fff" strokeWidth="1.2" /></svg>
            <span className="mono">Arthur</span>
          </div>

          <div className="hero__meta">
            <p className="mono">{site.role}<br />{site.location}</p>
            <p className="hero__tagline">
              Desenho interfaces que viram <em className="serif">resultado.</em>
            </p>
            <p className="mono hero__scroll">Role para afastar ↓</p>
          </div>
        </div>
      </div>

      <p className="hero__caption">
        <span className="mono">Canvas — 2018 → hoje</span>
        +120 projetos começaram assim: <em className="serif">um frame vazio.</em>
      </p>
    </section>
  )
}
