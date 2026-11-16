// Objeto 3D decorativo (gerado no Magnific) que flutua com parallax no scroll.
// As imagens têm fundo preto e usam mix-blend-mode: screen, então só funcionam em seções escuras.
// A animação é ligada por floatOnScroll() em lib/motion.js.
export default function Float({ name, className = '', speed = 1 }) {
  return (
    <img
      className={`float float--${name} ${className}`}
      src={`/img/obj-${name}.webp`}
      alt=""
      aria-hidden="true"
      width="900"
      height="900"
      loading="lazy"
      decoding="async"
      data-float={speed}
    />
  )
}
