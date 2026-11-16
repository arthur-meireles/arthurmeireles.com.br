// Quebra texto em spans para animar por letra ou por palavra.
export function Chars({ text }) {
  return text.split('').map((c, i) => (
    <span className="char" key={i}>{c === ' ' ? ' ' : c}</span>
  ))
}

export function Words({ text, accent = [] }) {
  return text.split(' ').map((w, i) => (
    <span className={`word ${accent.includes(w) ? 'serif' : ''}`} key={i}>{w} </span>
  ))
}

// Título com cada linha mascarada (anima com .line__inner subindo).
export function Lines({ lines }) {
  return lines.map((l, i) => (
    <span className="line" key={i}>
      <span className="line__inner">{l}</span>
    </span>
  ))
}
