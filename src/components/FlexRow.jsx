import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { reducedMotion } from '../lib/motion.js'

// Fileira infinita de capas que atravessa uma "lente de vidro líquido" nas bordas da tela:
// perto das laterais as cartas esticam e curvam (a borda de cima sobe em arco), com leve aberração
// cromática. Corre sozinha, acelera com o scroll da página e pode ser arrastada.
// WebGL puro, sem biblioteca. Sem WebGL (ou com movimento reduzido) cai numa fileira comum rolável.

const VERT = `
attribute vec2 aPos;
uniform vec2 uView;
uniform vec2 uCenter;
uniform vec2 uSize;
uniform float uBend;
uniform float uShear;
uniform float uStart;
varying vec2 vUv;
varying float vEdge;
void main() {
  vec2 p = aPos;
  float x = uCenter.x + p.x * uSize.x;
  float nx = x / (uView.x * 0.5);
  // 0 no centro da tela, 1 nas bordas: é onde a "lente" age.
  float e = smoothstep(uStart, 1.1, abs(nx));
  e *= e;
  float stretch = 1.0 + uBend * e;
  float y = p.y * uSize.y * stretch + uCenter.y;
  // Comprime um pouco na horizontal perto da borda, como vidro curvo.
  float xs = x - sign(nx) * e * uBend * 0.22 * uSize.x * abs(nx);
  // Inclinação proporcional à velocidade.
  xs += uShear * p.y * uSize.y;
  vUv = vec2(p.x + 0.5, 0.5 - p.y);
  vEdge = e * sign(nx);
  gl_Position = vec4(xs / (uView.x * 0.5), y / (uView.y * 0.5), 0.0, 1.0);
}`

const FRAG = `
// Mesma precisão do shader de vértice (uniformes compartilhados precisam bater).
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uTex;
uniform vec2 uSize;
uniform vec2 uImg;
uniform float uRadius;
uniform float uHover;
uniform float uLoaded;
varying vec2 vUv;
varying float vEdge;
float rbox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
void main() {
  vec2 px = (vUv - 0.5) * uSize;
  float d = rbox(px, uSize * 0.5, uRadius);
  float a = 1.0 - smoothstep(-1.0, 0.5, d);
  // object-fit: cover
  float ra = uSize.x / uSize.y;
  float ri = uImg.x / uImg.y;
  vec2 s = ra > ri ? vec2(1.0, ri / ra) : vec2(ra / ri, 1.0);
  vec2 uv = (vUv - 0.5) * s * (1.0 - 0.06 * uHover) + 0.5;
  // Aberração cromática que cresce perto das bordas.
  float ca = abs(vEdge) * 0.007;
  vec2 off = vec2(ca * sign(vEdge), 0.0);
  vec3 col = vec3(texture2D(uTex, uv + off).r, texture2D(uTex, uv).g, texture2D(uTex, uv - off).b);
  col = mix(vec3(0.08), col, uLoaded);
  // Reflexo leve, como vidro.
  col += abs(vEdge) * 0.05 * (1.0 - vUv.y);
  gl_FragColor = vec4(col * a, a);
}`

function compile(gl, type, src) {
  const sh = gl.createShader(type)
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh))
  return sh
}

function makePlane(gl, sx = 40, sy = 20) {
  const pos = []
  const idx = []
  for (let j = 0; j <= sy; j++) for (let i = 0; i <= sx; i++) pos.push(i / sx - 0.5, 0.5 - j / sy)
  for (let j = 0; j < sy; j++)
    for (let i = 0; i < sx; i++) {
      const a = j * (sx + 1) + i
      const b = a + 1
      const c = a + sx + 1
      const d = c + 1
      idx.push(a, c, b, b, c, d)
    }
  const vbo = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW)
  const ibo = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW)
  return { vbo, ibo, count: idx.length }
}

export default function FlexRow({ projects, onActive }) {
  const wrap = useRef(null)
  const canvas = useRef(null)
  const navigate = useNavigate()
  const [fallback, setFallback] = useState(false)
  // Referências para o efeito do WebGL rodar uma vez só (navigate muda de identidade a cada rota).
  const navRef = useRef(navigate)
  const activeRef = useRef(onActive)
  navRef.current = navigate
  activeRef.current = onActive

  useEffect(() => {
    if (reducedMotion()) { console.warn('[FlexRow] fallback: reduced motion'); return setFallback(true) }
    const cv = canvas.current
    const gl = cv.getContext('webgl', { antialias: true, premultipliedAlpha: true, alpha: true })
    if (!gl) { console.warn('[FlexRow] fallback: sem WebGL'); return setFallback(true) }

    let prog
    try {
      prog = gl.createProgram()
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT))
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG))
      gl.linkProgram(prog)
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog))
    } catch (err) {
      console.warn('[FlexRow] fallback: shader', err)
      return setFallback(true)
    }
    gl.useProgram(prog)
    const plane = makePlane(gl)
    const aPos = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
    const U = {}
    for (const name of ['uView', 'uCenter', 'uSize', 'uBend', 'uShear', 'uStart', 'uTex', 'uImg', 'uRadius', 'uHover', 'uLoaded'])
      U[name] = gl.getUniformLocation(prog, name)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    // Uma textura por projeto, carregada só quando a seção chega perto da tela.
    const mobile = window.matchMedia('(max-width: 899px)').matches
    const cards = projects.map((p) => {
      const tex = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([20, 20, 22, 255]))
      for (const [k, v] of [
        [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE],
        [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE],
        [gl.TEXTURE_MIN_FILTER, gl.LINEAR],
        [gl.TEXTURE_MAG_FILTER, gl.LINEAR],
      ])
        gl.texParameteri(gl.TEXTURE_2D, k, v)
      return { p, tex, img: [4, 3], loaded: 0, loadedTarget: 0, hover: 0 }
    })
    let texturesRequested = false
    const loadTextures = () => {
      if (texturesRequested) return
      texturesRequested = true
      cards.forEach((c) => {
        const im = new Image()
        im.decoding = 'async'
        im.onload = () => {
          gl.bindTexture(gl.TEXTURE_2D, c.tex)
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im)
          c.img = [im.naturalWidth, im.naturalHeight]
          c.loadedTarget = 1
        }
        im.src = mobile ? c.p.thumbSm : c.p.thumb
      })
    }

    // Medidas
    let W = 0
    let H = 0
    let cardW = 0
    let cardH = 0
    let gap = 0
    let pitch = 0
    let copies = 1
    const resize = () => {
      const r = cv.getBoundingClientRect()
      W = r.width
      H = r.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      cv.width = Math.round(W * dpr)
      cv.height = Math.round(H * dpr)
      gl.viewport(0, 0, cv.width, cv.height)
      if (mobile) {
        // No celular a carta do centro fica menor que a tela, para só as vizinhas passarem pela lente.
        cardW = W * 0.64
        cardH = Math.min(cardW / 1.28, H * 0.6)
      } else {
        cardH = H * 0.6
        cardW = Math.min(cardH * 1.28, W * 0.82)
      }
      gap = Math.max(14, W * 0.018)
      pitch = cardW + gap
      // Repete a lista se ela for curta demais para cobrir a tela com folga.
      copies = Math.max(1, Math.ceil((W + pitch * 2) / (pitch * projects.length)))
    }
    resize()

    // Movimento: corre sozinha, recebe o scroll da página e o arrasto.
    let offset = 0
    let vel = 0
    let shear = 0
    let lastY = window.scrollY
    let hovered = -1
    let drag = null
    let active = -1
    const AUTO = mobile ? 26 : 34 // px/s

    const layout = () => {
      const total = pitch * projects.length * copies
      const list = []
      for (let k = 0; k < projects.length * copies; k++) {
        let x = (((k * pitch + offset) % total) + total) % total
        if (x > total / 2) x -= total
        list.push({ x, i: k % projects.length })
      }
      return list
    }

    const hit = (mx, my) => {
      for (const { x, i } of layout()) {
        if (Math.abs(mx - x) < cardW / 2 && Math.abs(my) < cardH / 2) return i
      }
      return -1
    }

    const point = (e) => {
      const r = cv.getBoundingClientRect()
      return [e.clientX - r.left - W / 2, -(e.clientY - r.top - H / 2)]
    }
    const onMove = (e) => {
      const [mx, my] = point(e)
      if (drag) {
        const dx = e.clientX - drag.x
        drag.moved += Math.abs(dx)
        offset += dx
        vel = dx * 60
        drag.x = e.clientX
      }
      hovered = hit(mx, my)
      cv.dataset.cursor = hovered >= 0 ? 'Ver projeto' : 'Arraste'
      cv.style.cursor = drag ? 'grabbing' : 'grab'
    }
    const onDown = (e) => {
      drag = { x: e.clientX, moved: 0 }
      cv.setPointerCapture?.(e.pointerId)
    }
    const onUp = (e) => {
      if (drag && drag.moved < 6) {
        const [mx, my] = point(e)
        const i = hit(mx, my)
        if (i >= 0) navRef.current(`/projetos/${projects[i].slug}`)
      }
      drag = null
    }
    const onLeave = () => {
      hovered = -1
      drag = null
    }
    cv.addEventListener('pointermove', onMove)
    cv.addEventListener('pointerdown', onDown)
    cv.addEventListener('pointerup', onUp)
    cv.addEventListener('pointerleave', onLeave)

    // Só anima enquanto a seção está visível.
    let visible = false
    let raf = 0
    let last = performance.now()
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadTextures()
        visible = entry.intersectionRatio > 0 && entry.isIntersecting
        if (visible && !raf) {
          last = performance.now()
          lastY = window.scrollY
          raf = requestAnimationFrame(frame)
        }
      },
      { rootMargin: '600px 0px' }
    )
    io.observe(wrap.current)
    const ro = new ResizeObserver(resize)
    ro.observe(cv)

    function frame(now) {
      raf = 0
      if (!visible) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      // Scroll da página empurra a fileira (descer = ir para a esquerda).
      const y = window.scrollY
      const dy = y - lastY
      lastY = y
      if (!drag) {
        vel += -dy * 9
        vel *= Math.pow(0.04, dt) // atrito
        const auto = hovered >= 0 ? AUTO * 0.15 : AUTO
        offset += (-auto + vel) * dt
      }
      shear += (Math.max(-0.12, Math.min(0.12, vel / 9000)) - shear) * Math.min(1, dt * 8)

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform2f(U.uView, W, H)
      gl.uniform2f(U.uSize, cardW, cardH)
      gl.uniform1f(U.uBend, mobile ? 0.45 : 0.7)
      gl.uniform1f(U.uStart, mobile ? 0.5 : 0.3)
      gl.uniform1f(U.uShear, shear)
      gl.uniform1f(U.uRadius, Math.max(8, cardW * 0.025))
      gl.uniform1i(U.uTex, 0)
      gl.activeTexture(gl.TEXTURE0)

      let nearest = -1
      let nearestD = Infinity
      for (const { x, i } of layout()) {
        if (Math.abs(x) > W / 2 + cardW) continue
        const c = cards[i]
        c.loaded += (c.loadedTarget - c.loaded) * Math.min(1, dt * 4)
        c.hover += ((hovered === i ? 1 : 0) - c.hover) * Math.min(1, dt * 8)
        gl.bindTexture(gl.TEXTURE_2D, c.tex)
        gl.uniform2f(U.uCenter, x, 0)
        gl.uniform2f(U.uImg, c.img[0], c.img[1])
        gl.uniform1f(U.uHover, c.hover)
        gl.uniform1f(U.uLoaded, c.loaded)
        gl.drawElements(gl.TRIANGLES, plane.count, gl.UNSIGNED_SHORT, 0)
        if (Math.abs(x) < nearestD) {
          nearestD = Math.abs(x)
          nearest = i
        }
      }
      if (nearest !== active) {
        active = nearest
        activeRef.current?.(nearest)
      }
      raf = requestAnimationFrame(frame)
    }

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      cv.removeEventListener('pointermove', onMove)
      cv.removeEventListener('pointerdown', onDown)
      cv.removeEventListener('pointerup', onUp)
      cv.removeEventListener('pointerleave', onLeave)
      cards.forEach((c) => gl.deleteTexture(c.tex))
      gl.deleteBuffer(plane.vbo)
      gl.deleteBuffer(plane.ibo)
      gl.deleteProgram(prog)
    }
  }, [projects])

  if (fallback) {
    return (
      <div className="flexrow flexrow--fallback">
        {projects.map((p) => (
          <Link key={p.slug} to={`/projetos/${p.slug}`} className="flexrow__card">
            <img src={p.thumbSm} srcSet={p.thumbSet} sizes="(min-width: 900px) 40vw, 80vw" alt={`Tela do projeto ${p.title}`} loading="lazy" decoding="async" />
            <span>{p.title}</span>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div className="flexrow" ref={wrap}>
      <canvas ref={canvas} className="flexrow__canvas" data-cursor="Arraste" aria-label="Projetos selecionados em destaque" role="img" />
      {/* Links reais para teclado, leitores de tela e buscadores. */}
      <ul className="sr-only">
        {projects.map((p) => (
          <li key={p.slug}>
            <Link to={`/projetos/${p.slug}`}>{p.title}: {p.type}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
