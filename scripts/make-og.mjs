// Gera a imagem de compartilhamento (public/og.jpg, 1200×630) e o sitemap.
// Uso: npm run og   — rode de novo se trocar o retrato do hero, o domínio ou os projetos.
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import opentype from 'opentype.js'

const root = path.resolve(import.meta.dirname, '..')
const SITE_URL = 'https://arthurmeireles.cc' // troque aqui e no index.html se o domínio for outro

// ---------- Imagem ----------
const W = 1200
const H = 630
const FG = '#efece6'
const BG = '#0a0a0b'
const ACCENT = '#0d99ff'

const fontFile = path.join(root, 'node_modules/@fontsource/inter-tight/files/inter-tight-latin-800-normal.woff')
const buf = fs.readFileSync(fontFile)
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength))

// Texto vira curva com a fonte real do site, então não depende de fonte instalada.
// Letra a letra, porque o processamento de recursos OpenType da biblioteca falha com esta fonte.
const em = font.unitsPerEm
function pathData(str, x, y, size, tracking = -45) {
  let cx = x
  let d = ''
  for (const ch of str) {
    const glyph = font.charToGlyph(ch)
    d += glyph.getPath(cx, y, size).toPathData(2)
    cx += ((glyph.advanceWidth + tracking) * size) / em
  }
  return d
}
const width = (str, size, tracking = -45) =>
  [...str].reduce((w, ch) => w + ((font.charToGlyph(ch).advanceWidth + tracking) * size) / em, 0)
const text = (str, x, y, size, fill, tracking = -45) =>
  `<path d="${pathData(str, x, y, size, tracking)}" fill="${fill}"/>`

const size = 214
const line1 = text('ARTHUR', 56, 330, size, FG)
const w2 = width('MEIRELES', size)
const line2 = text('MEIRELES', W - 56 - w2, 330 + size * 0.8, size, FG)

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  ${line1}${line2}
  ${text('UX/UI & PRODUCT DESIGNER', 58, 86, 22, '#8f8d88', 60)}
  ${text('DESIGN QUE VIRA RESULTADO', W - 58 - width('DESIGN QUE VIRA RESULTADO', 22, 60), 86, 22, FG, 60)}
</svg>`

// O contorno das letras por cima do retrato, como no hero do site.
const outline = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <g fill="none" stroke="${FG}" stroke-width="2">
    <path d="${pathData('ARTHUR', 56, 330, size)}"/>
    <path d="${pathData('MEIRELES', W - 56 - w2, 330 + size * 0.8, size)}"/>
  </g>
  <rect x="40" y="150" width="${W - 80}" height="372" fill="none" stroke="${ACCENT}" stroke-width="2"/>
  ${[[40, 150], [W - 40, 150], [40, 522], [W - 40, 522]]
    .map(([x, y]) => `<rect x="${x - 5}" y="${y - 5}" width="10" height="10" fill="#fff" stroke="${ACCENT}" stroke-width="2"/>`)
    .join('')}
</svg>`

const portrait = await sharp(path.join(root, 'public/img/arthur-a-cor.webp')).resize({ height: 610 }).toBuffer()
const pMeta = await sharp(portrait).metadata()

await sharp(Buffer.from(svg))
  .composite([
    { input: portrait, left: Math.round((W - pMeta.width) / 2), top: H - 610 },
    { input: Buffer.from(outline), left: 0, top: 0 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(path.join(root, 'public/og.jpg'))
console.log('public/og.jpg gerado')

// ---------- Sitemap e robots ----------
const projects = [...fs.readFileSync(path.join(root, 'src/content/projects.js'), 'utf8').matchAll(/slug: '([^']+)'/g)].map((m) => m[1])
const posts = fs.readdirSync(path.join(root, 'src/content/blog')).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''))
const urls = ['/', '/projetos', '/blog', ...projects.map((s) => `/projetos/${s}`), ...posts.map((s) => `/blog/${s}`)]

fs.writeFileSync(
  path.join(root, 'public/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${SITE_URL}${u}</loc></url>`)
    .join('\n')}\n</urlset>\n`
)
fs.writeFileSync(path.join(root, 'public/robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)
console.log(`sitemap.xml com ${urls.length} URLs e robots.txt gerados`)
