import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { createLightfall } from '../lib/lightfall.js'
import { reducedMotion } from '../lib/motion.js'

// Palco do fim do rodapé: o Fluid Glass original (react-bits) com a configuração do demo
// ("Look closer."), trocando o texto pelo nome. Uma única peça de vidro segue o cursor,
// distorce o título e muda de forma a cada clique (torus → lente → blob → cubo → pílula →
// prisma → diamante). Atrás do título passa a chuva de luz, desenhada num canvas vivo.
// Sem WebGL2 avisa o rodapé para mostrar o nome em HTML (modo "fallback").
const FluidGlass = lazy(() => import('./FluidGlass.jsx'))

export default function GlassScene({ onMode }) {
  const host = useRef(null)
  const scene = useMemo(() => document.createElement('canvas'), [])
  const [ok, setOk] = useState(null)
  const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 899px)').matches

  useEffect(() => {
    const good = Boolean(document.createElement('canvas').getContext('webgl2'))
    setOk(good)
    onMode?.(good ? 'scene' : 'fallback')
  }, [onMode])

  // Chuva de luz no canvas que o vidro usa como fundo.
  useEffect(() => {
    if (!ok) return
    const el = host.current
    const still = reducedMotion()
    const ctx = scene.getContext('2d')
    const lf = createLightfall()
    let W = 0
    let H = 0
    let s = 1
    let visible = false
    let raf = 0
    let last = 0

    const resize = () => {
      W = el.clientWidth
      H = el.clientHeight
      if (!W || !H) return
      s = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2)
      scene.width = Math.round(W * s)
      scene.height = Math.round(H * s)
      lf.resize(W, H)
    }
    const loop = (now) => {
      raf = 0
      if (!visible) return
      const dt = Math.min(0.05, (now - last) / 1000 || 0)
      last = now
      ctx.setTransform(s, 0, 0, s, 0, 0)
      ctx.clearRect(0, 0, W, H)
      ctx.globalAlpha = 0.55 // discreta: o título é o protagonista, como na referência
      lf.step(ctx, still ? 0 : dt)
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(loop)
    }
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !raf) {
        last = performance.now()
        raf = requestAnimationFrame(loop)
      }
    })
    io.observe(el)
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    resize()
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
    }
  }, [ok, scene, mobile])

  if (ok === false) return null
  return (
    <div ref={host} className="glassstage">
      {ok && (
        <Suspense fallback={null}>
          {/* Props = DEFAULT_PROPS do demo da react-bits; só texto, fonte, fundo e o modo no celular mudam. */}
          <FluidGlass
            text={mobile ? 'Arthur\nMeireles.' : 'Arthur Meireles.'}
            textColor="#efece6"
            fontFamily='"Inter Tight Variable", "Inter Tight", system-ui, sans-serif'
            fontWeight={700}
            src={scene}
            shape="torus"
            interaction={mobile ? 'drag' : 'follow'}
            size={mobile ? 170 : 260}
            refraction={1}
            dispersion={0.35}
            frost={0}
            color="#ffffff"
            tint={0}
            reflection={1}
            shadow={0.5}
            elevation={0.4}
            smoothness={0.5}
            wobble={0.5}
            spin={0.3}
            idle
            // As 5 formas da referência, em ciclo: depois da lente (o círculo) volta ao torus.
            shapes={["torus", "prism", "diamond", "cube", "lens"]}
            morphOnClick
            intro
          />
        </Suspense>
      )}
    </div>
  )
}
