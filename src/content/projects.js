// Lista de projetos. Cada item vira um card na home e uma página em /projetos/<slug>.
// Imagens: public/work/<slug>/01.webp, 02.webp... (rode `npm run images` depois de trocar).
// `featured: true` coloca o projeto na galeria horizontal da home.
import manifest from './work-manifest.json'

const list = [
  {
    slug: 'off-the-grid-erp',
    title: 'Off The Grid',
    type: 'E-commerce & ERP full custom',
    client: 'Off The Grid',
    year: 2026,
    role: 'UX/UI Design, Product Design',
    featured: true,
    summary:
      'Loja virtual e ERP desenhados sob medida, do catálogo ao painel de gestão. Uma única linguagem visual para quem compra e para quem opera.',
    behance: 'https://www.behance.net/gallery/248968593/OFF-The-GRID-E-commerce-ERP-FULL-CUSTOM',
  },
  {
    slug: 'gb-agritech',
    title: 'GB Agritech',
    type: 'Site institucional — Agrotech',
    client: 'GB Agritech',
    year: 2025,
    role: 'UX/UI Design',
    featured: true,
    summary:
      'Institucional para uma empresa de tecnologia do agronegócio. O desafio foi traduzir soluções técnicas em uma narrativa simples para quem está no campo.',
    behance: 'https://www.behance.net/gallery/220765733/GB-Aagritech-Agrotech-Company',
  },
  {
    slug: 'moicanos',
    title: 'Moicanos',
    type: 'Landing page — Startup',
    client: 'Moicanos Barber & Tech',
    year: 2025,
    role: 'UX/UI Design',
    featured: true,
    summary:
      'Página de vendas para uma startup do nicho de barbearias, criada para apresentar o produto e modernizar os agendamentos do setor.',
    behance: 'https://www.behance.net/gallery/220758117/MOICANOS-STARTUP',
  },
  {
    slug: 'wyre',
    title: 'WYRE',
    type: 'Site — Agência digital',
    client: 'WYRE',
    year: 2025,
    role: 'UX/UI Design',
    featured: true,
    summary:
      'Site para uma agência digital que transforma ideias em soluções. Layout direto, com foco em serviços, prova social e conversão.',
    behance: 'https://www.behance.net/gallery/220760161/WYRE-Digital-agency',
  },
  {
    slug: 'dr-fernando',
    title: 'Dr. Fernando Freitas',
    type: 'Site institucional — Saúde',
    client: 'Dr. Fernando Freitas',
    year: 2025,
    role: 'UX/UI Design',
    featured: true,
    summary:
      'Institucional para um cirurgião plástico. Sobriedade e confiança na interface, com caminho curto até o agendamento.',
    behance: 'https://www.behance.net/gallery/220759641/DR-FERNANDO-Institucional-Site',
  },
  {
    slug: 'off-the-grid',
    title: 'Off The Grid — Loja',
    type: 'E-commerce',
    client: 'Off The Grid',
    year: 2025,
    role: 'UX/UI Design',
    summary:
      'Primeira versão do e-commerce da marca, com identidade forte e navegação pensada para destacar o produto.',
    behance: 'https://www.behance.net/gallery/220764321/OFF-THE-GRID-Ecommerce',
  },
  {
    slug: 'duo-forge',
    title: 'DUO Forge',
    type: 'Landing page — Agência digital',
    client: 'DUO Forge',
    year: 2025,
    role: 'UX/UI Design',
    summary:
      'Landing page de agência com a promessa de transformar ideias em experiências. Estrutura de página de vendas, do gancho ao orçamento.',
    behance: 'https://www.behance.net/gallery/220758901/DUO-FORGE-Digital-Agency',
  },
  {
    slug: '6d-contabilidade',
    title: '6D',
    type: 'Site institucional — Contabilidade',
    client: '6D',
    year: 2025,
    role: 'UX/UI Design',
    summary:
      'Institucional para um escritório de contabilidade. Linguagem clara e humana para um assunto que costuma afastar as pessoas.',
    behance: 'https://www.behance.net/gallery/220754935/6D-Institucional-accounting',
  },
  {
    slug: 'protein',
    title: 'Protein',
    type: 'E-commerce — Suplementação',
    client: 'Protein Suplementação',
    year: 2023,
    role: 'UX/UI Design',
    featured: true,
    summary:
      'Loja virtual dinâmica e intuitiva para a Protein, melhorando a experiência de compra dos suplementos e levando a marca para o digital com presença marcante.',
    behance: 'https://www.behance.net/gallery/170465495/DESIGN-LOJA-VIRTUAL-PROTEIN',
  },
  {
    slug: 'gus-dev',
    title: 'Gus Dev',
    type: 'Landing page — Desenvolvedor',
    client: 'Gus Dev',
    year: 2023,
    role: 'UX/UI Design',
    summary:
      'Landing page para expor os serviços e projetos de um desenvolvedor, expressando experiência e criatividade.',
    behance: 'https://www.behance.net/gallery/170464905/DESIGN-LANDING-PAGE-GUSDEV',
  },
  {
    slug: 'global',
    title: 'Global Marketplace',
    type: 'E-commerce — Marketplace',
    client: 'Global',
    year: 2023,
    role: 'UX/UI Design',
    summary:
      'Mega loja virtual em estilo marketplace, segmentada por 14 setores. O desafio era aproveitar bem o espaço e manter o design limpo e escalável.',
    behance: 'https://www.behance.net/gallery/170392685/DESIGN-ECOMMERCE-GLOBAL',
  },
  {
    slug: 'portfolio-2022',
    title: 'Portfólio 2022',
    type: 'Landing page pessoal',
    client: 'Arthur Meireles',
    year: 2022,
    role: 'UX/UI Design',
    summary:
      'A versão anterior deste site: uma landing page pessoal para atrair novos clientes e expor o portfólio.',
    behance: 'https://www.behance.net/gallery/157436553/DESIGN-LANDING-PORTIFOLIO',
  },
  {
    slug: 'greenbelt',
    title: 'Greenbelt',
    type: 'Landing page institucional',
    client: 'Greenbelt',
    year: 2022,
    role: 'UX/UI Design',
    summary:
      'Layout mobile e desktop para o institucional da empresa, com um design clean e minimalista de alto padrão.',
    behance: 'https://www.behance.net/gallery/155387211/DESIGN-LANDING-PAGE-INSTITUCIONAL',
  },
  {
    slug: 'fivem-360',
    title: 'FiveM 360',
    type: 'E-commerce in-game (GTA V RP)',
    client: 'FiveM 360',
    year: 2022,
    role: 'UX/UI Design',
    summary:
      'E-commerce dentro do jogo, com o desafio de ser um produto whitelabel sem abrir mão da estética de alto padrão e da usabilidade.',
    behance: 'https://www.behance.net/gallery/155383623/DESIGN-GTA-RP-STORE',
  },
  {
    slug: 'minha-reserva',
    title: 'Minha Reserva',
    type: 'Estudo de caso — App de finanças',
    client: 'Estudo de caso',
    year: 2021,
    role: 'UX Research, UX/UI Design',
    featured: true,
    summary:
      'Meu primeiro estudo de caso de UX: um aplicativo para ajudar brasileiros a guardar dinheiro, conduzido pelo método Double Diamond, da pesquisa ao protótipo.',
    behance: 'https://www.behance.net/gallery/122391913/UX-Design-Estudo-de-Caso',
  },
]

export const projects = list.map((p, i) => ({
  ...p,
  index: String(i + 1).padStart(2, '0'),
  thumb: `/work/${p.slug}/thumb.webp`,
  thumbSm: `/work/${p.slug}/thumb-sm.webp`,
  // srcset para o navegador escolher 640 ou 1200 px conforme o tamanho na tela.
  thumbSet: `/work/${p.slug}/thumb-sm.webp 640w, /work/${p.slug}/thumb.webp 1200w`,
  images: manifest[p.slug] ?? [],
}))

export const featured = projects.filter((p) => p.featured)
export const getProject = (slug) => projects.find((p) => p.slug === slug)
