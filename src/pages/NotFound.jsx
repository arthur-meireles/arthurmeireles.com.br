import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="notfound wrap">
      <p className="eyebrow mono">Erro 404</p>
      <h1 className="display">Frame não<br /><em className="serif">encontrado.</em></h1>
      <Link to="/" className="btn">Voltar ao início <span>→</span></Link>
    </section>
  )
}
