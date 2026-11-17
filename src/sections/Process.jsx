import { useRef, useState } from 'react'
import { DESKTOP, gsap, MOTION_OK, ScrollTrigger, useGSAP } from '../lib/motion.js'
import { process } from '../content/site.js'
import { tick } from '../lib/haptics.js'

const notes = [
  { t: 'Quem usa?', c: 'y', x: 8, y: 10, r: -6 },
  { t: 'Qual a dor nº 1?', c: 'p', x: 52, y: 6, r: 4 },
  { t: 'Meta do negócio', c: 'b', x: 28, y: 40, r: -2 },
  { t: 'Entrevistas', c: 'y', x: 64, y: 48, r: 7 },
  { t: 'Concorrentes', c: 'p', x: 6, y: 66, r: 3 },
]

// Fluxo do "Definir": app de agendamento com login, cadastro, recuperação de senha e pagamento.
// Coordenadas num quadro de 560 × 360; as linhas se desenham quando a etapa entra.
const W = 100
const H = 30
const D = 44 // meia largura do losango
const DH = 26
const FLOW_NODES = [
  { k: 'pill', x: 60, y: 45, t: 'Abrir app' },
  { k: 'dec', x: 170, y: 45, t: 'Tem conta?' },
  { k: 'box', x: 285, y: 45, t: 'Login' },
  { k: 'dec', x: 400, y: 45, t: 'Senha ok?' },
  { k: 'box', x: 505, y: 45, t: 'Home' },
  { k: 'box', x: 170, y: 130, t: 'Cadastro' },
  { k: 'box', x: 400, y: 130, t: 'Recuperar senha' },
  { k: 'box', x: 505, y: 130, t: 'Escolher serviço' },
  { k: 'box', x: 170, y: 215, t: 'Verificar e-mail' },
  { k: 'box', x: 285, y: 215, t: 'Outro cartão' },
  { k: 'dec', x: 400, y: 215, t: 'Aprovado?' },
  { k: 'box', x: 505, y: 215, t: 'Agendar horário' },
  { k: 'box', x: 400, y: 300, t: 'Recibo por e-mail' },
  { k: 'end', x: 505, y: 300, t: 'Agendado' },
]
const FLOW_LINES = [
  { d: 'M100 45H126' },
  { d: 'M214 45H235', l: 'sim', lx: 224, ly: 38 },
  { d: 'M335 45H356' },
  { d: 'M444 45H455', l: 'sim', lx: 450, ly: 36 },
  { d: 'M170 71V115', l: 'não', lx: 178, ly: 96 },
  { d: 'M400 71V115', l: 'não', lx: 408, ly: 96 },
  { d: 'M350 130H285V60', l: 'via e-mail', lx: 291, ly: 124, a: 'start' },
  { d: 'M170 145V200' },
  { d: 'M220 215H226V47', l: 'conta criada', lx: 236, ly: 125, r: true },
  { d: 'M505 60V115' },
  { d: 'M505 145V200' },
  { d: 'M455 215H444' },
  { d: 'M356 215H335', l: 'não', lx: 345, ly: 208 },
  { d: 'M285 200V178H400V189', l: 'tentar de novo', lx: 342, ly: 172 },
  { d: 'M400 241V285', l: 'sim', lx: 408, ly: 266 },
  { d: 'M450 300H465' },
]

function Flow() {
  return (
    <svg viewBox="0 0 560 360" fill="none" preserveAspectRatio="xMidYMid meet" aria-label="Fluxo de um app de agendamento: login, cadastro, recuperação de senha e pagamento">
      <defs>
        <marker id="flow-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0L8 4L0 8z" fill="currentColor" />
        </marker>
      </defs>
      <g stroke="currentColor" strokeWidth="1.3">
        {FLOW_LINES.map((ln, i) => (
          <path key={i} className="flow__line" d={ln.d} pathLength="1" markerEnd="url(#flow-arrow)" style={{ '--i': i }} />
        ))}
      </g>
      <g fontSize="9" fontFamily="JetBrains Mono Variable, monospace" fill="#5f5d58">
        {FLOW_LINES.filter((ln) => ln.l).map((ln) => (
          <text key={ln.l + ln.lx} className="flow__label" x={ln.lx} y={ln.ly} textAnchor={ln.a || 'middle'} transform={ln.r ? `rotate(-90 ${ln.lx} ${ln.ly})` : undefined}>{ln.l}</text>
        ))}
      </g>
      {FLOW_NODES.map((n, i) => (
        <g key={n.t} className="flow__node" style={{ '--i': i }}>
          {n.k === 'dec' ? (
            <path d={`M${n.x} ${n.y - DH}L${n.x + D} ${n.y}L${n.x} ${n.y + DH}L${n.x - D} ${n.y}z`} fill="#fff" stroke="currentColor" strokeWidth="1.5" />
          ) : (
            <rect x={n.x - (n.k === 'pill' ? 40 : W / 2)} y={n.y - H / 2} width={n.k === 'pill' ? 80 : W} height={H} rx={n.k === 'box' ? 5 : H / 2} fill={n.k === 'end' ? 'var(--accent)' : '#fff'} stroke={n.k === 'end' ? 'none' : 'currentColor'} strokeWidth="1.5" />
          )}
          <text x={n.x} y={n.y + 3.2} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono Variable, monospace" fill={n.k === 'end' ? '#fff' : 'currentColor'} fontWeight={n.k === 'end' ? 700 : 400}>
            {n.t}
          </text>
        </g>
      ))}
    </svg>
  )
}

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
          <Flow />
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
      // Desktop e celular: a seção fica fixa e a rolagem passa pelas 4 etapas.
      const pin = (end) => {
        ScrollTrigger.create({
          trigger: '.process__pin',
          start: 'top top',
          end,
          pin: true,
          onUpdate: (self) => {
            const next = Math.min(process.length - 1, Math.floor(self.progress * process.length))
            setStep((prev) => {
              if (prev !== next && window.innerWidth < 900) tick()
              return next
            })
          },
        })
        gsap.to('.process__meter i', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.process__pin', start: 'top top', end, scrub: true },
        })
      }
      mm.add(`${MOTION_OK} and ${DESKTOP}`, () => pin('+=300%'))
      mm.add(`${MOTION_OK} and (max-width: 899px)`, () => pin('+=240%'))
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
