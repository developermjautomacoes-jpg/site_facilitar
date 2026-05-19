// utils/constants.ts

export const COMPANY = {
  name: 'Facilitar Serviços Contábeis',
  fullName: 'FACILITAR SERVICOS CONTABEIS LTDA',
  cnpj: '31.294.741/0001-56',
  founded: '21/08/2018',
  phone: '(27) 3068-8502',
  email: 'contato@facilitar.net.br',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? '5527999858502',
  whatsappMessage: 'Olá! Vim através do site da Facilitar Serviços Contábeis e gostaria de falar com um especialista.',
  address: {
    street: 'Av. Eldes Scherrer Souza, 2162',
    complement: 'Cond. Complexo Montserrat, Sala 301 e 303',
    neighborhood: 'Colina de Laranjeiras',
    city: 'Serra',
    state: 'ES',
    cep: '29167-080',
    full: 'Av. Eldes Scherrer Souza, 2162 — Cond. Complexo Montserrat, Sala 301 e 303, Colina de Laranjeiras, Serra/ES — CEP 29167-080',
  },
}

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Especialidades', href: '#especialidades' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Conteúdos', href: '#conteudos' },
  { label: 'Fale Conosco', href: '#contato' },
]

export const SERVICES = [
  {
    id: 'legalizacao',
    title: 'Departamento de Legalização',
    description: 'Abertura, alteração e encerramento de empresas, registros e alvarás com agilidade e segurança jurídica.',
    icon: 'Building2',
  },
  {
    id: 'contabil',
    title: 'Departamento Contábil',
    description: 'Escrituração contábil, demonstrações financeiras e relatórios gerenciais para apoiar decisões estratégicas.',
    icon: 'BookOpen',
  },
  {
    id: 'fiscal',
    title: 'Departamento Fiscal',
    description: 'Apuração de impostos, entrega de obrigações acessórias e conformidade com as exigências do Fisco.',
    icon: 'FileText',
  },
  {
    id: 'pessoal',
    title: 'Departamento Pessoal',
    description: 'Folha de pagamento, admissões, demissões, eSocial e gestão completa de colaboradores.',
    icon: 'Users',
  },
  {
    id: 'compete',
    title: 'Compete',
    description: 'Assessoria completa no programa de incentivo fiscal Compete para empresas do Espírito Santo.',
    icon: 'TrendingDown',
  },
  {
    id: 'contribuinte-substituto',
    title: 'Contribuinte Substituto',
    description: 'Gestão e regularização do regime de substituição tributária com eficiência e segurança.',
    icon: 'Scale',
  },
  {
    id: 'invest-es',
    title: 'Invest-ES',
    description: 'Orientação e habilitação para o programa de incentivo ao investimento do Espírito Santo.',
    icon: 'BarChart3',
  },
  {
    id: 'fundap',
    title: 'Fundap',
    description: 'Suporte no acesso ao Fundo para o Desenvolvimento das Atividades Portuárias e benefícios fiscais.',
    icon: 'ShieldCheck',
  },
]

export const DIFFERENTIALS = [
  { title: 'Atendimento Humanizado', description: 'Equipe dedicada que entende as necessidades do seu negócio.', icon: 'Heart' },
  { title: 'Especialistas Tributários', description: 'Profissionais certificados e atualizados com a legislação vigente.', icon: 'GraduationCap' },
  { title: 'Tecnologia e Automação', description: 'Sistemas modernos para agilidade, segurança e precisão nos processos.', icon: 'Cpu' },
  { title: 'Segurança de Dados', description: 'Proteção total das informações da sua empresa com criptografia.', icon: 'Lock' },
  { title: 'Atendimento Ágil', description: 'Respostas rápidas e soluções eficientes para não travar seu negócio.', icon: 'Zap' },
  { title: 'Gestão Estratégica', description: 'Visão além dos números — orientamos decisões para crescimento sustentável.', icon: 'Target' },
  { title: 'Suporte Consultivo', description: 'Consultoria contínua, não apenas obrigações — somos parceiros do seu sucesso.', icon: 'MessageSquare' },
  { title: 'Processos Inteligentes', description: 'Fluxos otimizados que reduzem custos e eliminam retrabalho.', icon: 'Workflow' },
]

export const STATS = [
  { value: 7, suffix: '+', label: 'Anos de Experiência' },
  { value: 200, suffix: '+', label: 'Clientes Ativos' },
  { value: 10, suffix: '', label: 'Especialidades' },
  { value: 100, suffix: '%', label: 'Dedicação Total' },
]

export const BLOG_POSTS = [
  {
    id: 1,
    title: 'Reforma Tributária 2025: O que muda para sua empresa',
    excerpt: 'Entenda como as novas regras da reforma tributária impactam MEIs, Simples Nacional e empresas de lucro presumido.',
    category: 'Tributário',
    tag: 'Reforma Tributária',
    date: '15 Mai 2025',
    readTime: '5 min',
  },
  {
    id: 2,
    title: 'Simples Nacional: limites, alíquotas e vantagens em 2025',
    excerpt: 'Tudo sobre o regime simplificado: quem pode aderir, como calcular os impostos e quando vale a pena migrar.',
    category: 'Regime Tributário',
    tag: 'Simples Nacional',
    date: '08 Mai 2025',
    readTime: '7 min',
  },
  {
    id: 3,
    title: 'Lucro Presumido vs Lucro Real: qual escolher?',
    excerpt: 'Comparativo completo entre os dois regimes para empresas com faturamento acima do Simples Nacional.',
    category: 'Planejamento',
    tag: 'Lucro Presumido',
    date: '01 Mai 2025',
    readTime: '6 min',
  },
  {
    id: 4,
    title: 'MEI 2025: obrigações, limites e como se manter regular',
    excerpt: 'Guia completo para Microempreendedores Individuais: DAS, DASN-SIMEI, notas fiscais e muito mais.',
    category: 'MEI',
    tag: 'MEI',
    date: '22 Abr 2025',
    readTime: '4 min',
  },
  {
    id: 5,
    title: 'Obrigações Acessórias: calendário fiscal 2025',
    excerpt: 'Não perca prazos: SPED, ECF, DEFIS, DIRF, RAIS e todas as obrigações do calendário contábil anual.',
    category: 'Fiscal',
    tag: 'Obrigações',
    date: '10 Abr 2025',
    readTime: '8 min',
  },
  {
    id: 6,
    title: 'Planejamento fiscal para fechar o ano no azul',
    excerpt: 'Estratégias legais de planejamento tributário que você pode aplicar agora para reduzir impostos e aumentar lucro.',
    category: 'Planejamento',
    tag: 'Planejamento Fiscal',
    date: '03 Abr 2025',
    readTime: '5 min',
  },
]
