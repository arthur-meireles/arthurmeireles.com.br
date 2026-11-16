import { useState } from 'react'
import { site } from '../content/site.js'

// Formulário sem servidor: monta a mensagem e abre o WhatsApp já preenchido.
// Não há custo nem dado guardado em lugar nenhum; o envio acontece no próprio WhatsApp.
const TYPES = ['Site ou landing page', 'E-commerce', 'Sistema ou app', 'Consultoria de UX']

export default function WhatsAppForm() {
  const [name, setName] = useState('')
  const [type, setType] = useState(TYPES[0])
  const [message, setMessage] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const lines = [
      `Olá, Arthur! Aqui é ${name.trim()}.`,
      `Tenho interesse em: ${type}.`,
      message.trim() && `Sobre o projeto: ${message.trim()}`,
    ].filter(Boolean)
    const url = `${site.whatsapp.href}?text=${encodeURIComponent(lines.join('\n'))}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <form className="waform" onSubmit={submit}>
      <div className="waform__field">
        <label className="mono" htmlFor="wa-name">Seu nome</label>
        <input id="wa-name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" placeholder="Como posso te chamar?" />
      </div>

      <fieldset className="waform__field">
        <legend className="mono">O que você precisa</legend>
        <div className="waform__chips">
          {TYPES.map((t) => (
            <label key={t} className={`chip ${t === type ? 'is-on' : ''}`}>
              <input type="radio" name="wa-type" value={t} checked={t === type} onChange={() => setType(t)} />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="waform__field">
        <label className="mono" htmlFor="wa-msg">Conte um pouco (opcional)</label>
        <textarea id="wa-msg" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Prazo, objetivo, o que já existe hoje..." />
      </div>

      <button type="submit" className="btn waform__send" data-magnetic>
        Enviar pelo WhatsApp <span>↗</span>
      </button>
      <p className="waform__note mono">Abre o WhatsApp com a mensagem pronta. Você revisa antes de enviar.</p>
    </form>
  )
}
