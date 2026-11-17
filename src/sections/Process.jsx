import { useRef, useState } from 'react'
import { DESKTOP, gsap, MOTION_OK, ScrollTrigger, useGSAP } from '../lib/motion.js'
import { process } from '../content/site.js'

const notes = [
  { t: 'Quem usa?', c: 'y', x: 8, y: 10, r: -6 },
  { t: 'Qual a dor nº 1?', c: 'p', x: 52, y: 6, r: 4 },
  { t: 'Meta do negócio', c: 'b', x: 28, y: 40, r: -2 },
  { t: 'Entrevistas', c: 'y', x: 64, y: 48, r: 7 },
  { t: 'Concorrentes', c: 'p', x: 6, y: 66, r: 3 },
]

// A mesma prancheta evolui em 4 estados: post-its → fluxo → wireframe → interface final.
function Artboard({ step }) {
  return (
    <div className="artboard" data-step={step}>
      <div className="artboard__bar mono">
        <span>Processo / {process[step].title}</span>
        <span>{String(step + 1).padStart(2, '0')} / 04</span>
      </div>

      <div className="artboard__stage">
        <div className="state state--notes">
          {notes.map((n) => (
            <span key={n.t} className={`note note--${n.c}`} style={{ left: `${n.x}%`, top: `${n.y}%`, '--r': `${n.r}deg` }}>
              {n.t}
            </span>
          ))}
        </div>

        <div className="state state--flow">
          <svg viewBox="0 0 400 260" fill="none" aria-hidden="true">
            <path d="M90 60h60M250 60h40v70M290 190h-40M150 190H110" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            <rect x="10" y="38" width="80" height="44" rx="22" stroke="currentColor" strokeWidth="1.5" />
            <rect x="150" y="38" width="100" height="44" rx="6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M290 130l40 30-40 30-40-30z" stroke="currentColor" strokeWidth="1.5" />
            <rect x="150" y="168" width="100" height="44" rx="6" stroke="currentColor" strokeWidth="1.5" />
            <rect x="30" y="168" width="80" height="44" rx="22" fill="var(--accent)" />
            <g fill="currentColor" fontSize="11" fontFamily="JetBrains Mono Variable, monospace" textAnchor="middle">
              <text x="50" y="64">Entrada</text>
              <text x="200" y="64">Cadastro</text>
              <text x="290" y="164">Válido?</text>
              <text x="200" y="194">Pagamento</text>
              <text x="70" y="194" fill="#fff">Sucesso</text>
            </g>
          </svg>
        </div>

        <div className="state state--wire">
          <div className="wire">
            <div className="wire__nav"><i /><i /><i /><i /></div>
            <div className="wire__hero">
              <div><b /><b /><u /><em /></div>
              <div className="wire__img" />
            </div>
            <div className="wire__cards"><i /><i /><i /></div>
          </div>
        </div>

        <div className="state state--final">
          <img src="/work/gb-agritech/thumb-sm.webp" srcSet="/work/gb-agritech/thumb-sm.webp 640w, /work/gb-agritech/thumb.webp 1200w" sizes="(min-width: 900px) 50vw, 92vw" alt="Interface final do projeto GB Agritech" loading="lazy" />
        </div>
      </div>
    </div>
  )
}

export default function Process() {
  const root = useRef(null)
  const [step, setStep] = useState(0)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
        ScrollTrigger.create({
          trigger: '.process__pin',
          start: 'top top',
          end: '+=300%',
          pin: true,
          onUpdate: (self) => setStep(Math.min(process.length - 1, Math.floor(self.progress * process.length))),
        })
        gsap.to('.process__meter i', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.process__pin', start: 'top top', end: '+=300%', scrub: true },
        })
      })
    },
    { scope: root }
  )

  return (
    <section className="process is-light" ref={root}>
      <div className="process__pin">
        <div className="wrap process__grid">
          <div className="process__copy">
            <p className="eyebrow mono">(03) Como eu trabalho</p>
            <h2 className="h2">
              Do frame vazio<br />ao <em className="serif">resultado.</em>
            </h2>

            <span className="process__meter" aria-hidden="true"><i /></span>
            <ol className="steps">
              {process.map((s, i) => (
                <li key={s.key} className={`step ${i === step ? 'is-active' : ''}`}>
                  <button type="button" onClick={() => setStep(i)} aria-current={i === step}>
                    <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                    <strong>{s.title}</strong>
                  </button>
                  <div className="step__body">
                    <div>
                      <p>{s.text}</p>
                      <ul className="tags">
                        {s.outputs.map((o) => <li className="mono" key={o}>{o}</li>)}
                      </ul>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <Artboard step={step} />
        </div>
      </div>
    </section>
  )
}
