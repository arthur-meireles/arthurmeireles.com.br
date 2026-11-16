import { useEffect, useRef } from 'react'
import { Lines } from './Split.jsx'
import Float from './Float.jsx'
import { floatOnScroll, gsap, MOTION_OK, revealOnScroll, useGSAP, useReady } from '../lib/motion.js'

// Cabeçalho das páginas internas: título grande que sobe linha a linha.
// Também liga os data-reveal da página inteira (scope = <main>).
export default function PageHead({ eyebrow, lines, children, title }) {
  const root = useRef(null)
  const ready = useReady()

  useEffect(() => {
    if (title) document.title = `${title} — Arthur Meireles`
    return () => {
      document.title = 'Arthur Meireles — UX/UI & Product Designer'
    }
  }, [title])

  useGSAP(
    () => {
      if (!ready) return
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from(root.current.querySelectorAll('.line__inner'), {
          yPercent: 110,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.1,
        })
        gsap.from(root.current.querySelectorAll('.pagehead__fade'), {
          autoAlpha: 0,
          y: 20,
          duration: 1,
          ease: 'expo.out',
          delay: 0.3,
          stagger: 0.08,
        })
        revealOnScroll(root.current.closest('main'))
        floatOnScroll(root.current)
      })
    },
    { scope: root, dependencies: [ready] }
  )

  return (
    <header className="pagehead wrap" ref={root}>
      <Float name="pen" speed={0.5} />
      <p className="eyebrow mono pagehead__fade">{eyebrow}</p>
      <h1 className="display"><Lines lines={lines} /></h1>
      {children && <div className="pagehead__fade pagehead__extra">{children}</div>}
    </header>
  )
}
