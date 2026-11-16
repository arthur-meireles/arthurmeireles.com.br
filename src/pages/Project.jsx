import { Link, useParams } from 'react-router-dom'
import PageHead from '../components/PageHead.jsx'
import NotFound from './NotFound.jsx'
import { getProject, projects } from '../content/projects.js'

export default function Project() {
  const { slug } = useParams()
  const project = getProject(slug)
  if (!project) return <NotFound />

  const next = projects[(projects.indexOf(project) + 1) % projects.length]
  const words = project.title.split(' — ')

  return (
    <article className="project">
      <PageHead eyebrow={`Projeto ${project.index} — ${project.type}`} lines={words} title={project.title}>
        <div className="project__intro">
          <p className="lead">{project.summary}</p>
          <dl className="meta">
            <div><dt className="mono">Cliente</dt><dd>{project.client}</dd></div>
            <div><dt className="mono">Ano</dt><dd>{project.year}</dd></div>
            <div><dt className="mono">Papel</dt><dd>{project.role}</dd></div>
            {project.behance && (
              <div>
                <dt className="mono">Link</dt>
                <dd><a href={project.behance} target="_blank" rel="noreferrer">Ver no Behance ↗</a></dd>
              </div>
            )}
          </dl>
        </div>
      </PageHead>

      <div className="project__images">
        {project.images.map((img, i) => (
          <figure key={img.src} data-reveal={i > 0 ? '' : undefined}>
            <img
              src={img.src}
              width={img.w}
              height={img.h}
              alt={`${project.title} — imagem ${i + 1}`}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </figure>
        ))}
      </div>

      <Link to={`/projetos/${next.slug}`} className="nextproject" data-cursor="Próximo">
        <span className="mono">Próximo projeto</span>
        <strong className="display">{next.title} <em className="serif">→</em></strong>
        <img src={next.thumb} alt="" loading="lazy" />
      </Link>
    </article>
  )
}
