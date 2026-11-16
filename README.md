# Arthur Meireles — Portfólio

Site pessoal em Vite + React, com animações de scroll em GSAP (ScrollTrigger) e scroll suave com Lenis.

## Rodar

```bash
npm install
npm run dev
```

`npm run build` gera a pasta `dist/` para publicar. O projeto já inclui `vercel.json` e `public/_redirects` (Netlify) para as rotas internas funcionarem ao recarregar a página.

## Conceito

**"Do frame vazio ao resultado."** O site se comporta como um arquivo do Figma: o hero é desenhado na frente do visitante (wireframe, seleção, preenchimento, foto) e, ao rolar, a câmera afasta e revela que o hero é só um frame num canvas cheio de projetos. O azul de seleção do Figma é a única cor de destaque.

## Mapa da home

| # | Seção | O que conta | Animação |
|---|-------|-------------|----------|
| 0 | Preloader | Nome + contador | Letras sobem, cortina abre |
| 1 | Hero | ARTHUR MEIRELES + retrato | Entrada "desenhada"; no scroll, zoom-out para o canvas com 8 projetos |
| 2 | Manifesto | Proposta de valor, 4 números, clientes | Palavras acendem com o scroll; contadores; letreiro ligado ao scroll |
| 3 | Projetos | 7 destaques + arquivo com os 15 | Galeria horizontal presa; lista com prévia que segue o cursor |
| 4 | Processo | Descobrir, Definir, Prototipar, Entregar | Seção presa; a prancheta evolui de post-its a interface final |
| 5 | Serviços | Interfaces, Consultoria, Treinamento | Linhas desenhadas, entradas em cascata |
| 6 | Sobre | Bio, ferramentas, trajetória, fotos, depoimentos | Foto abre como janela; polaroids caem; citações sobem |
| 7 | Blog | 3 artigos mais recentes | Entradas em cascata |
| 8 | Contato | WhatsApp, e-mail, redes | Nome gigante sobe letra a letra |

Páginas internas: `/projetos`, `/projetos/:slug`, `/blog`, `/blog/:slug`.

## Onde editar

- **Textos, números, contatos, depoimentos, trajetória:** `src/content/site.js`
- **Projetos:** `src/content/projects.js` (título, tipo, ano, resumo, `featured`)
- **Imagens de projeto:** `public/work/<slug>/01.webp, 02.webp...` — depois rode `npm run images` para atualizar miniaturas e dimensões. Para escolher a capa, salve um `cover.png` ou `cover.jpg` na pasta do projeto.
- **Capas dos projetos:** `public/work/<slug>/cover.png` é a capa do Behance e vira a miniatura usada em todo o site. Troque o arquivo e rode `npm run images`.
- **Compartilhamento e SEO:** `npm run og` gera `public/og.jpg` (a imagem que aparece ao colar o link no WhatsApp ou LinkedIn), o `sitemap.xml` e o `robots.txt`. O domínio está em `scripts/make-og.mjs` e nas metatags do `index.html`; hoje é `https://arthurmeireles.cc`.
- **Formulário de contato:** `src/components/WhatsAppForm.jsx`. Não tem servidor: monta a mensagem e abre o WhatsApp. As opções de tipo de projeto ficam na lista `TYPES`.
- **Blog:** um arquivo `.md` por artigo em `src/content/blog/`. O nome do arquivo vira a URL. Cabeçalho: `title`, `date` (AAAA-MM-DD), `tag`, `excerpt`.
- **Cores e tipografia:** variáveis no topo de `src/styles/global.css`
- **Fotos pessoais:** `public/img/`
- **Retrato do hero:** `public/img/arthur-a-*.webp` (braços cruzados) e `arthur-b-*.webp` (ajustando os óculos), cada um em `-pb` e `-cor`. O componente `src/components/GlitchPortrait.jsx` mostra a versão preto e branco, alterna de pose a cada 6 s e, no hover ou toque, faz o glitch para a colorida. As quatro imagens precisam ter o mesmo tamanho, e a preto e branco deve ser derivada da colorida para o efeito ficar alinhado. Para adicionar uma pose, salve o par de arquivos e inclua a letra em `POSES`.
- **Objetos 3D flutuantes:** `public/img/obj-*.webp`, gerados no Magnific (Nano Banana 2.1, 1:1, fundo preto puro). Entram com `<Float name="cursor" />` e só funcionam em seções escuras, porque usam `mix-blend-mode: screen` para sumir com o fundo. Para trocar, gere outra imagem com fundo `#000000` e salve com o mesmo nome.

## Estrutura

```
src/
  content/     dados e artigos
  sections/    seções da home (uma por arquivo)
  pages/       rotas
  components/  nav, cursor, preloader, utilitários de texto
  lib/         motion.js (GSAP, Lenis, helpers) e blog.js
  styles/      global.css e sections.css
```

Quem prefere menos movimento (`prefers-reduced-motion`) recebe o site sem pins nem scroll suave, com todo o conteúdo visível.
