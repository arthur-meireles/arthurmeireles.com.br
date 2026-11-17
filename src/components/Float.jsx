// Objeto 3D decorativo (gerado no Magnific). Duas camadas de movimento:
// - o invólucro (data-float) faz o parallax do scroll, ligado por floatOnScroll() em lib/motion.js;
// - a imagem por dentro flutua sozinha, em loop leve.
// As imagens têm transparência real (obj-*-a.webp), então podem atravessar seções claras e escuras.
export default function Float({ name, className = '', speed = 1 }) {
  return (
    <span className={`float float--${name} ${className}`} data-float={speed} aria-hidden="true">
      <img src={`/img/obj-${name}-a.webp`} alt="" width="900" height="900" loading="lazy" decoding="async" />
    </span>
  )
}
