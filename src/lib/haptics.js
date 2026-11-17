// "Tec" tátil curtinho para cada item da roda.
// - Android (Chrome, Samsung): Vibration API. O navegador só libera depois do primeiro toque na página.
// - iPhone: o Safari não tem Vibration API. A partir do iOS 18, alternar um <input type="checkbox" switch>
//   gera o tique do sistema; usamos um switch escondido. Em versões antigas simplesmente não vibra.
let iosSwitch = null

function iosTick() {
  if (!iosSwitch) {
    const label = document.createElement('label')
    label.setAttribute('aria-hidden', 'true')
    label.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none'
    const input = document.createElement('input')
    input.type = 'checkbox'
    input.setAttribute('switch', '')
    input.tabIndex = -1
    label.appendChild(input)
    document.body.appendChild(label)
    iosSwitch = label
  }
  iosSwitch.click()
}

const isIOS = () => /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

export function tick() {
  try {
    if (typeof navigator.vibrate === 'function') navigator.vibrate(7)
    else if (isIOS()) iosTick()
  } catch {
    /* sem suporte: segue sem vibrar */
  }
}
