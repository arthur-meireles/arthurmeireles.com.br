import { useRef } from 'react'
import { Chars } from '../components/Split.jsx'
import Float from '../components/Float.jsx'
import Lightfall from '../components/Lightfall.jsx'
import { floatOnScroll, gsap, MOTION_OK, scrollToTarget, useGSAP } from '../lib/motion.js'
import { site } from '../content/site.js'

// Rodapé + contato. Fica em todas as páginas. A chuva de luz cobre a seção inteira.
export default function Contact() {
  const root = useRef(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        floatOnScroll(root.current)
        gsap.from('.contact__name .char', {
          yPercent: 110,
          stagger: 0.03,
          ease: 'expo.out',
          duration: 1.2,
          scrollTrigger: { trigger: '.contact__name', start: 'top 95%', once: true },
        })
      })
    },
    { scope: root }
  )

  return (
    <footer className="contact" id="contato" ref={root}>
      <Lightfall className="contact__sky" alpha={0.75} />
      <Float name="layers" speed={0.6} />
      <div className="wrap">
        <p className="eyebrow mono">Contato</p>
        <h2 className="display contact__title">
          Vamos criar algo<br />que <em className="serif">funciona?</em>
        </h2>
        <p className="lead contact__lead">Me chama no WhatsApp ou por e-mail e conta o que você precisa. Respondo rápido, prometo.</p>

        <div className="contact__links">
          <a href={site.whatsapp.href} target="_blank" rel="noreferrer" className="biglink" data-cursor="Chamar">
            <span className="mono">WhatsApp</span>
            <strong>{site.whatsapp.label}</strong>
            <i aria-hidden="true">↗</i>
          </a>
          <a href={`mailto:${site.email}`} className="biglink" data-cursor="Escrever">
            <span className="mono">E-mail</span>
            <strong>{site.email}</strong>
            <i aria-hidden="true">↗</i>
          </a>
        </div>

        <div className="contact__foot mono">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <span className="contact__socials">
            {site.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">{s.label} ↗</a>
            ))}
          </span>
          <button type="button" onClick={() => scrollToTarget(0)}>Voltar ao topo ↑</button>
        </div>
      </div>

      <p className="contact__name" aria-hidden="true">
        <Chars text="Arthur Meireles." />
      </p>
    </footer>
  )
}
