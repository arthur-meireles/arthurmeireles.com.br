// Dados pessoais e textos gerais do site. Edite aqui.
export const site = {
  name: 'Arthur Meireles',
  role: 'UX/UI & Product Designer',
  location: 'Vila Velha, ES — Brasil',
  tagline: 'Desenho interfaces que viram resultado.',
  available: true,
  email: 'contato@arthurmeireles.cc',
  whatsapp: { label: '(61) 98238-9962', href: 'https://wa.me/5561982389962' },
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/o-arthur-meireles/' },
    { label: 'Behance', href: 'https://www.behance.net/uxarthur' },
  ],
}

export const manifesto =
  'Muito além de telas bonitas. Uso o design de forma estratégica para encantar seus usuários, reduzir o tempo e o custo do desenvolvimento — e fazer o negócio crescer.'

// Palavras do manifesto que ganham destaque em itálico serifado.
export const manifestoAccent = ['estratégica', 'encantar', 'crescer.']

export const numbers = [
  { value: 6, prefix: '+', suffix: '', label: 'anos projetando produtos digitais' },
  { value: 120, prefix: '+', suffix: '', label: 'projetos entregues, de landing pages a sistemas complexos' },
  { value: 62, prefix: '+', suffix: '', label: 'empresas venderam mais com design estratégico' },
  { value: 100, prefix: '$', suffix: '', label: 'de retorno possível para cada $1 investido em UX' },
]

// Logos originais do Figma, em uma cor só. Para adicionar: salve um .webp transparente em public/img/logos.
export const clients = [
  { name: 'Greenbelt', logo: '/img/logos/greenbelt.webp', w: 582, h: 160 },
  { name: 'Moicanos Barber & Tech', logo: '/img/logos/moicanos.webp', w: 292, h: 160 },
  { name: 'Globalsys', logo: '/img/logos/globalsys.webp', w: 869, h: 160 },
  { name: 'Dr. Fernando Freitas', logo: '/img/logos/dr-fernando-freitas.webp', w: 1132, h: 160 },
  { name: 'KS', logo: '/img/logos/ks.webp', w: 180, h: 160 },
  { name: 'Global Marketplace', logo: '/img/logos/global-marketplace.webp', w: 506, h: 160 },
  { name: 'Próxima', logo: '/img/logos/proxima.webp', w: 759, h: 160 },
  { name: 'Heupe', logo: '/img/logos/heupe.webp', w: 561, h: 160 },
  { name: 'Dr. Ícaro Alves Alcântara', logo: '/img/logos/dr-icaro.webp', w: 310, h: 106 },
]

export const process = [
  {
    key: 'descobrir',
    title: 'Descobrir',
    text: 'Pesquisa com usuários, entrevistas e leitura do negócio. Antes de abrir o Figma, entendo quem usa, o que dói e o que a empresa precisa ganhar.',
    outputs: ['Pesquisa com usuários', 'Análise heurística', 'Benchmark'],
  },
  {
    key: 'definir',
    title: 'Definir',
    text: 'Personas, jornadas e arquitetura da informação. O problema vira um fluxo claro, e o fluxo vira prioridade para o time.',
    outputs: ['Personas e jornadas', 'Arquitetura da informação', 'Fluxos'],
  },
  {
    key: 'prototipar',
    title: 'Prototipar',
    text: 'Wireframes e protótipos navegáveis para errar cedo e barato. A ideia é testada antes de virar código.',
    outputs: ['Wireframes', 'Protótipo interativo', 'Teste de usabilidade'],
  },
  {
    key: 'entregar',
    title: 'Entregar',
    text: 'Interface em alta fidelidade, styleguide ou design system e handoff organizado para o desenvolvimento.',
    outputs: ['UI em alta fidelidade', 'Design system', 'Handoff para devs'],
  },
]

export const services = [
  {
    title: 'Design de interfaces',
    text: 'Criação do layout de páginas, sistemas ou e-commerce, web e mobile. Sempre focando nas melhores práticas e nos detalhes.',
  },
  {
    title: 'Consultoria',
    text: 'Você escolhe o nível de envolvimento no seu projeto. Desde uma reunião estratégica sobre a experiência dos seus usuários até testes e relatórios de usabilidade, com dezenas de sugestões de melhoria.',
  },
  {
    title: 'Treinamento',
    text: 'Encante usuários e clientes. Eleve o nível da sua equipe de desenvolvedores e designers e entregue produtos com alto valor agregado.',
  },
]

export const benefits = [
  'Maior retorno e crescimento do seu negócio',
  'Interfaces exclusivas para seus projetos',
  'Experiência do usuário de alto padrão',
  'Validação de ideias de negócio',
]

export const about = {
  title: 'Prazer, Arthur.',
  paragraphs: [
    'Sou bacharel em Sistemas de Informação e minha paixão por criar produtos vem da época da faculdade. Comecei levantando requisitos em Brasília e descobri que o que eu gostava mesmo era de resolver o problema de quem usa.',
    'Desde então participei de mais de 120 projetos digitais: sites, landing pages, sistemas complexos e aplicativos para todo tipo de nicho. Essa bagagem de negócio é o que aplico hoje para o sucesso dos meus clientes.',
  ],
  tools: ['Figma', 'Adobe XD', 'Sketch', 'Design Thinking', 'Métodos ágeis'],
}

export const experience = [
  { period: '2021 — hoje', role: 'Designer de produtos', company: 'GB Agritech' },
  { period: '2021 — 2022', role: 'UX/UI Designer Pleno', company: 'Globalsys' },
  { period: '2021', role: 'UX/UI Designer Júnior', company: 'Mapicom' },
  { period: '2021', role: 'UX/UI Designer (freelance)', company: 'Prime Gestora' },
  { period: '2018 — 2020', role: 'Analista de Requisitos', company: 'Basis Tecnologia' },
]

// Fotos penduradas no varal da seção Sobre, na ordem em que aparecem.
export const moments = [
  { src: '/img/momento-1.webp', alt: 'Arthur com a família no cinema' },
  { src: '/img/momento-2.webp', alt: 'Cerveja na mão com churrasco ao fundo' },
  { src: '/img/momento-3.webp', alt: 'Arthur ao ar livre, de óculos escuros' },
  { src: '/img/momento-5.webp', alt: 'Garrafa de vinho na mão' },
  { src: '/img/momento-4.webp', alt: 'Arthur com a família em frente a um espelho' },
]

export const testimonials = [
  {
    quote: 'Já trabalhei com muitos profissionais da área, mas com certeza o Arthur está em primeiro lugar quando penso em alguém pra UX hoje. Meu próximo job tem um nome certo.',
    name: 'Clécio Rocha',
    company: 'Lyzandra Jóias',
  },
  {
    quote: 'Foi um prazer trabalhar com você e ver como se envolveu com tudo. Sua dedicação, ideias, profissionalismo e conhecimento foram fundamentais pra tornar nosso sonho realidade.',
    name: 'Adão Firmino',
    company: 'GCen Agronegócios',
  },
  {
    quote: 'Poesia em forma de site! O cara é o Messi dos sites hahaha',
    name: 'Gustavo R.',
    company: 'Gus Dev',
  },
]
