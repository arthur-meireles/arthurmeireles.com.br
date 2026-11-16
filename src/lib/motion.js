import { createContext, useContext } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export { gsap, ScrollTrigger, useGSAP }

// Só anima quando a pessoa não pediu movimento reduzido.
export const MOTION_OK = '(prefers-reduced-motion: no-preference)'
export const DESKTOP = '(min-width: 900px)'
export const reducedMotion = () => !window.matchMedia(MOTION_OK).matches

// `true` quando o preloader terminou e a página pode fazer sua entrada.
export const ReadyContext = createContext(false)
export const useReady = () => useContext(ReadyContext)

let lenis = null
export const getLenis = () => lenis

export function startLenis() {
  if (lenis || reducedMotion()) return () => {}
  lenis = new Lenis({ lerp: 0.1 })
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(tick)
    lenis.destroy()
    lenis = null
  }
}

export function scrollToTarget(target, immediate = false) {
  if (lenis) lenis.scrollTo(target, { immediate, force: true })
  else if (typeof target === 'number') window.scrollTo(0, target)
  else document.querySelector(target)?.scrollIntoView()
}

// Objetos 3D (<Float />): sobem e giram devagar enquanto atravessam a tela.
export function floatOnScroll(scope) {
  gsap.utils.toArray('[data-float]', scope).forEach((el, i) => {
    const speed = Number(el.dataset.float) || 1
    const dir = i % 2 ? -1 : 1
    gsap.fromTo(
      el,
      { y: 140 * speed, rotation: -14 * dir },
      {
        y: -140 * speed,
        rotation: 10 * dir,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
      }
    )
  })
}

// Entrada padrão: qualquer elemento com data-reveal sobe e aparece ao entrar na tela.
export function revealOnScroll(scope) {
  const items = gsap.utils.toArray('[data-reveal]', scope)
  if (!items.length) return
  gsap.set(items, { y: 36, autoAlpha: 0 })
  ScrollTrigger.batch(items, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { y: 0, autoAlpha: 1, duration: 1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
  })
}
