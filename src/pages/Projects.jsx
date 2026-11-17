import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead.jsx'
import { projects } from '../content/projects.js'

export default function Projects() {
  return (
    <>
      <PageHead eyebrow={`Arquivo — ${projects.length} projetos`} lines={['Todos os', 'projetos.']} title="Projetos">
        <p className="lead">Sites, landing pages, e-commerces e sistemas. Clique para ver cada trabalho completo.</p>
      </PageHead>

      <section className="wrap projgrid">
        {projects.map((p) => (
          <Link to={`/projetos/${p.slug}`} className="projcard" key={p.slug} data-reveal data-cursor="Ver projeto">
            <div className="projcard__media">
              <img src={p.thumb} srcSet={p.thumbSet} sizes="(min-width: 900px) 46vw, 92vw" alt={`Tela do projeto ${p.title}`} width="1200" height="939" loading="lazy" decoding="async" />
            </div>
            <div className="projcard__info">
              <h2>{p.title}</h2>
              <span className="mono">{p.year}</span>
              <p>{p.type}</p>
            </div>
          </Link>
        ))}
      </section>
    </>
  )
}
