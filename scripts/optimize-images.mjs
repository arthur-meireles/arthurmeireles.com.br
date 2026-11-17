// Gera miniaturas, comprime imagens pesadas e atualiza o manifesto de dimensões dos projetos.
// Uso: npm run images
// Rode sempre que adicionar ou trocar imagens em public/work/<slug>/ ou capas em covers/.
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const workDir = path.join(root, 'public', 'work')
// Capas originais (do Behance) ficam fora de public/ para não irem no deploy; só as miniaturas vão.
const coversDir = path.join(root, 'covers')
const MAX_BYTES = 700_000 // imagens de projeto acima disso são recomprimidas
const manifest = {}

for (const slug of fs.readdirSync(workDir).sort()) {
  const dir = path.join(workDir, slug)
  if (!fs.statSync(dir).isDirectory()) continue
  const files = fs
    .readdirSync(dir)
    .filter((f) => /^\d+\.(webp|png|jpe?g)$/i.test(f))
    .sort()
  if (!files.length) continue

  manifest[slug] = []
  for (const f of files) {
    const file = path.join(dir, f)
    const { width, height } = await sharp(file).metadata()

    // Recomprime telas muito pesadas (páginas inteiras exportadas do Figma/Behance).
    if (f.endsWith('.webp') && fs.statSync(file).size > MAX_BYTES) {
      const before = fs.statSync(file).size
      // WebP aceita no máximo 16383 px de altura; telas mais altas ficam como estão.
      const buf = height <= 16383 ? await sharp(file, { limitInputPixels: false }).webp({ quality: 74, effort: 6, smartSubsample: true }).toBuffer() : null
      if (buf && buf.length < before * 0.9) {
        fs.writeFileSync(file, buf)
        console.log(`  ${slug}/${f}: ${(before / 1e6).toFixed(2)} MB -> ${(buf.length / 1e6).toFixed(2)} MB`)
      }
    }
    manifest[slug].push({ src: `/work/${slug}/${f}`, w: width, h: height })
  }

  // Miniaturas: a capa do Behance (covers/<slug>.*) em dois tamanhos, mantendo a proporção.
  // Sem capa, recorta o topo da imagem mais alta (a tela completa) em 4:3.
  const cover = fs.existsSync(coversDir) && fs.readdirSync(coversDir).find((f) => f.replace(/\.(png|jpe?g|webp)$/i, '') === slug)
  const source = cover
    ? sharp(path.join(coversDir, cover))
    : sharp(path.join(root, 'public', manifest[slug].reduce((a, b) => (b.h > a.h ? b : a)).src)).resize({
        width: 1200,
        height: 900,
        fit: 'cover',
        position: 'top',
      })
  const base = await source.toBuffer()
  await sharp(base).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(dir, 'thumb.webp'))
  await sharp(base).resize({ width: 640, withoutEnlargement: true }).webp({ quality: 78 }).toFile(path.join(dir, 'thumb-sm.webp'))
  console.log(slug, files.length, 'imagens')
}

fs.writeFileSync(path.join(root, 'src', 'content', 'work-manifest.json'), JSON.stringify(manifest, null, 2))
console.log('manifesto atualizado')
