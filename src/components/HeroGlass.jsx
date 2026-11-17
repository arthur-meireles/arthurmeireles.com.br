import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'

// Fluid Glass (react-bits) por cima do hero. O vidro é a única coisa desenhada no canvas
// (modo lensOnly): fora dele a página aparece normalmente. Para o vidro ter o que refratar,
// um canvas "espelho" redesenha o que está atrás dele — fundo, nome e retrato — nas mesmas
// posições do DOM. Muda de forma a cada clique e volta ao torus depois da lente.
const FluidGlass = lazy(() => import('./FluidGlass.jsx'))

export default function HeroGlass({ ready }) {
  const host = useRef(null)
  const mirror = useMemo(() => Object.assign(document.createElement('canvas'), { version: 0 }), [])
  const [on, setOn] = useState(false)
  const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 899px)').matches
  const sizeFor = () => Math.round(Math.min(288, Math.max(120, window.innerWidth * 0.17)))
  const [size, setSize] = useState(sizeFor)
  useEffect(() => {
    const onResize = () => setSize(sizeFor())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Só entra depois da animação de entrada do hero (o nome é "desenhado" até ~2,5 s).
  useEffect(() => {
    if (!ready || !document.createElement('canvas').getContext('webgl2')) return
    const id = setTimeout(() => setOn(true), 2300)
    return () => clearTimeout(id)
  }, [ready])

  useEffect(() => {
    if (!on) return
    const el = host.current
    const frame = el.parentElement // .hero__frame
    const ctx = mirror.getContext('2d')
    let s = 1
    let visible = false
    let raf = 0

    const resize = () => {
      s = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2)
      mirror.width = Math.round(el.clientWidth * s)
      mirror.height = Math.round(el.clientHeight * s)
      signature = '' // canvas redimensionado = apagado; força redesenhar
    }

    // Posição de um elemento dentro do quadro, sem a escala do zoom do scroll.
    const box = (node, base, k) => {
      const r = node.getBoundingClientRect()
      return { x: (r.left - base.left) * k, y: (r.top - base.top) * k, w: r.width * k, h: r.height * k }
    }

    // Só redesenha (e o vidro só reenvia a textura) quando algo muda: tamanho, foto visível
    // (preto e branco/colorida) ou fontes carregadas. O resto do tempo o espelho fica parado.
    let signature = ''
    const tickMirror = () => {
      raf = 0
      if (!visible) return
      const img = [...frame.querySelectorAll('.hero__photo img')].find(
        (i) => i.complete && i.naturalWidth && getComputedStyle(i).visibility !== 'hidden'
      )
      const next = `${el.clientWidth}x${el.clientHeight}|${img?.currentSrc}|${document.fonts?.status}`
      if (next !== signature) {
        signature = next
        draw(img)
        mirror.version = (mirror.version || 0) + 1
      }
      raf = requestAnimationFrame(tickMirror)
    }

    const draw = (img) => {
      const base = frame.getBoundingClientRect()
      const k = frame.clientWidth / Math.max(1, base.width)
      const bg = getComputedStyle(frame)
      ctx.setTransform(s, 0, 0, s, 0, 0)
      ctx.fillStyle = bg.backgroundColor || '#0a0a0b'
      ctx.fillRect(0, 0, el.clientWidth, el.clientHeight)

      // Nome cheio (atrás do retrato).
      const name = frame.querySelector('.hero__solid')
      if (name) {
        const cs = getComputedStyle(name)
        const px = parseFloat(cs.fontSize)
        ctx.font = `${cs.fontWeight} ${px}px ${cs.fontFamily}`
        ctx.fillStyle = cs.color
        ctx.textBaseline = 'alphabetic'
        if ('letterSpacing' in ctx) ctx.letterSpacing = cs.letterSpacing
        const m = ctx.measureText('M')
        const asc = m.fontBoundingBoxAscent ?? px * 0.9
        const desc = m.fontBoundingBoxDescent ?? px * 0.22
        const lh = parseFloat(cs.lineHeight) || px * 0.8
        name.querySelectorAll('.hero__line').forEach((line) => {
          const b = box(line, base, k)
          ctx.fillText(line.textContent, b.x, b.y + (lh - (asc + desc)) / 2 + asc)
        })
      }

      // Retrato: a versão que estiver visível (preto e branco ou colorida).
      const portrait = frame.querySelector('.hero__portrait')
      if (portrait && img) {
        const b = box(portrait, base, k)
        const ratio = img.naturalWidth / img.naturalHeight
        let w = b.w
        let h = w / ratio
        if (h > b.h) {
          h = b.h
          w = h * ratio
        }
        ctx.drawImage(img, b.x + (b.w - w) / 2, b.y + b.h - h, w, h)
      }
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(tickMirror)
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
  }, [on, mirror, mobile])

  return (
    <div ref={host} className="hero__glass" aria-hidden="true">
      {on && (
        <Suspense fallback={null}>
          <FluidGlass
            lensOnly
            text=""
            src={mirror}
            shape="torus"
            interaction={mobile ? 'drag' : 'follow'}
            // Proporcional à largura: ~120 px no celular, ~130–175 no tablet, 288 no desktop grande.
            size={size}
            position={mobile ? [0.7, 0.6] : [0.72, 0.4]}
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
            shapes={['torus', 'prism', 'diamond', 'cube', 'lens']}
            morphOnClick
            onShapeChange={(name) => host.current && (host.current.dataset.shape = name)}
            intro
          />
        </Suspense>
      )}
    </div>
  )
}
