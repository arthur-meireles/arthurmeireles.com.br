// Gera miniaturas e o manifesto de dimensões das imagens de projeto.
// Uso: npm run images
// Rode sempre que adicionar ou trocar imagens em public/work/<slug>/.
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const workDir = path.join(root, 'public', 'work')
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
    const { width, height } = await sharp(path.join(dir, f)).metadata()
    manifest[slug].push({ src: `/work/${slug}/${f}`, w: width, h: height })
  }

  // Miniatura: usa cover.* (a capa do Behance) se existir, mantendo a proporção dela;
  // senão recorta o topo da imagem mais alta (a tela completa) em 4:3.
  const custom = fs.readdirSync(dir).find((f) => /^cover.(png|jpe?g|webp)$/i.test(f))
  const thumb = path.join(dir, 'thumb.webp')
  if (custom) {
    await sharp(path.join(dir, custom)).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 84 }).toFile(thumb)
  } else {
    const tallest = manifest[slug].reduce((a, b) => (b.h > a.h ? b : a))
    await sharp(path.join(root, 'public', tallest.src))
      .resize({ width: 1200, height: 900, fit: 'cover', position: 'top' })
      .webp({ quality: 80 })
      .toFile(thumb)
  }
  console.log(slug, files.length, 'imagens')
}

fs.writeFileSync(
  path.join(root, 'src', 'content', 'work-manifest.json'),
  JSON.stringify(manifest, null, 2)
)
console.log('manifesto atualizado')
