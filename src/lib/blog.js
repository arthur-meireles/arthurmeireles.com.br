// Cada arquivo .md em src/content/blog vira um post. O nome do arquivo é a URL.
const files = import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default', eager: true })

function parse(path, raw) {
  const slug = path.split('/').pop().replace(/\.md$/, '')
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  const meta = {}
  if (match) {
    for (const line of match[1].split(/\r?\n/)) {
      const i = line.indexOf(':')
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
    }
  }
  const body = match ? match[2] : raw
  return {
    slug,
    title: meta.title ?? slug,
    date: meta.date ?? '',
    excerpt: meta.excerpt ?? '',
    tag: meta.tag ?? 'Design',
    minutes: Math.max(1, Math.round(body.split(/\s+/).length / 200)),
    body,
  }
}

export const posts = Object.entries(files)
  .map(([path, raw]) => parse(path, raw))
  .sort((a, b) => b.date.localeCompare(a.date))

export const getPost = (slug) => posts.find((p) => p.slug === slug)

// O conversor de Markdown é baixado só quando um artigo é aberto.
export async function renderPost(post) {
  const { marked } = await import('marked')
  return marked.parse(post.body)
}

export const formatDate = (iso) =>
  iso ? new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : ''
