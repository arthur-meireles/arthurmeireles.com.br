import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { site } from '../content/site.js'
import { reducedMotion, scrollToTarget, ScrollTrigger } from '../lib/motion.js'

const links = [
  { to: '/projetos', label: 'Projetos' },
  { to: '/#sobre', label: 'Sobre' },
  { to: '/blog', label: 'Blog' },
  { to: '#contato', label: 'Contato' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname, hash } = useLocation()

  useEffect(() => setOpen(false), [pathname, hash])

  // Some ao rolar para baixo e volta ao rolar para cima, para a tela ficar livre na leitura.
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    if (reducedMotion()) return
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => setHidden(self.direction === 1 && self.scroll() > 300),
    })
    return () => st.kill()
  }, [])

  return (
    <header className={`nav ${open ? 'is-open' : ''} ${hidden ? 'is-hidden' : ''}`}>
      <Link to="/" className="nav__brand" aria-label="Arthur Meireles — início">
        Arthur Meireles<sup>®</sup>
      </Link>

      <nav className="nav__links" aria-label="Principal">
        {links.map((l) =>
          l.to.includes('#') ? (
            <Link
              key={l.label}
              to={l.to}
              onClick={() => {
                // Mesmo hash clicado de novo não muda a rota; rola manualmente.
                const id = l.to.slice(l.to.indexOf('#'))
                if (document.querySelector(id)) scrollToTarget(id)
              }}
            >
              {l.label}
            </Link>
          ) : (
            <NavLink key={l.label} to={l.to}>{l.label}</NavLink>
          )
        )}
      </nav>

      {site.available && (
        <a className="nav__status mono" data-magnetic href={site.whatsapp.href} target="_blank" rel="noreferrer">
          <i /> Disponível para projetos
        </a>
      )}

      <button className="nav__toggle mono" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? 'Fechar' : 'Menu'}
      </button>
    </header>
  )
}
