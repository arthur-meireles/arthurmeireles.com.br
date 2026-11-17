// Chuva de luz: riscos luminosos caem do alto e abrem em leque, como se viessem na direção de
// quem olha. Cada risco tem a ponta brilhante e um rastro que some. Só desenha num contexto 2D
// que o chamador fornece (a cena do rodapé), então serve também de textura para o vidro.
const ACCENT = [13, 153, 255]
const LIGHT = [239, 236, 230]

export function createLightfall() {
  let W = 0
  let H = 0
  let streaks = []

  const spawn = (s = {}, anywhere = false) => {
    s.x0 = Math.random() // origem (0–1) no topo
    s.fan = 0.35 + Math.random() * 0.9 // quanto abre para os lados
    s.speed = 0.16 + Math.random() * 0.28 // fração da altura por segundo
    s.len = 0.1 + Math.random() * 0.22 // tamanho do rastro
    s.t = anywhere ? Math.random() * 1.2 : -Math.random() * 0.4
    s.w = 0.6 + Math.random() * 1.3
    s.blue = Math.random() < 0.16
    s.alpha = 0.35 + Math.random() * 0.65
    return s
  }

  // Trajetória: desce e abre para fora de forma acelerada (curva).
  const pos = (s, t) => {
    const cx = s.x0 - 0.5
    return [(0.5 + cx * (0.55 + s.fan * t * t)) * W, (-0.05 + t * 1.1) * H]
  }

  return {
    resize(w, h) {
      W = w
      H = h
      const count = Math.round(Math.min(110, Math.max(30, w / 13)))
      streaks = Array.from({ length: count }, () => spawn({}, true))
    },
    step(ctx, dt) {
      ctx.lineCap = 'round'
      for (const s of streaks) {
        s.t += s.speed * dt * (0.6 + s.t * 0.9) // acelera conforme "se aproxima"
        if (s.t - s.len > 1.05) spawn(s)
        if (s.t < 0) continue
        const [r, g, b] = s.blue ? ACCENT : LIGHT
        const SEG = 10
        let [px, py] = pos(s, Math.max(0, s.t - s.len))
        for (let i = 1; i <= SEG; i++) {
          const k = i / SEG
          const [x, y] = pos(s, Math.max(0, s.t - s.len * (1 - k)))
          ctx.strokeStyle = `rgba(${r},${g},${b},${(s.alpha * k * k * 0.75).toFixed(3)})`
          ctx.lineWidth = s.w * (0.4 + k * 0.8)
          ctx.beginPath()
          ctx.moveTo(px, py)
          ctx.lineTo(x, y)
          ctx.stroke()
          px = x
          py = y
        }
        ctx.fillStyle = `rgba(255,255,255,${s.alpha.toFixed(3)})`
        ctx.shadowColor = `rgba(${r},${g},${b},0.9)`
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(px, py, s.w * 1.1, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }
    },
  }
}
