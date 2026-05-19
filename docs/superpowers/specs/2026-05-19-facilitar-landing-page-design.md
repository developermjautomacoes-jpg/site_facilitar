# Facilitar Serviços Contábeis — Landing Page Design Spec

**Date:** 2026-05-19  
**Status:** Approved

---

## 1. Overview

Landing page institucional premium para **FACILITAR SERVIÇOS CONTÁBEIS LTDA** (Serra/ES).  
Objetivo: captar leads, transmitir credibilidade e converter visitantes em clientes.

---

## 2. Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 15 (App Router) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS v3 |
| Animações | Framer Motion |
| Ícones | Lucide React |
| Formulário | react-hook-form + zod |
| E-mail | Nodemailer (SMTP) |
| Banco | better-sqlite3 (SQLite) |
| Servidor | VPS Hostinger — Ubuntu |
| Proxy | Nginx |
| Processo | PM2 |
| SSL | Let's Encrypt (Certbot) |

---

## 3. Identidade Visual

| Token | Valor |
|-------|-------|
| Azul escuro | `#0F172A` |
| Azul médio | `#2563EB` |
| Branco | `#FFFFFF` |
| Preto | `#000000` |
| Fonte principal | Inter (next/font/google) |
| Fonte destaque | Poppins ou Outfit |

---

## 4. Imagens disponíveis

| Arquivo | Uso |
|---------|-----|
| `hero-bg3.jpg` | Background do Hero (fachada iluminada do escritório) |
| `logo_com_fundo.png` | Navbar (logo horizontal) |
| `logo.jpg` | Seção Sobre / Rodapé (logo vertical) |
| `em_construcao1.jpg` | Não utilizada na produção |

---

## 5. Estrutura de Pastas

```
site-facilitar/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/
│       └── contact/
│           └── route.ts
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── DifferentialsSection.tsx
│   │   ├── BlogSection.tsx
│   │   └── ContactSection.tsx
│   └── ui/
│       ├── ServiceCard.tsx
│       ├── BlogCard.tsx
│       ├── AnimatedCounter.tsx
│       ├── Toast.tsx
│       └── WhatsAppButton.tsx
├── lib/
│   ├── email.ts
│   ├── db.ts
│   ├── validations.ts
│   ├── sanitize.ts
│   └── rateLimit.ts
├── hooks/
│   ├── useAnimatedCounter.ts
│   └── useScrollAnimation.ts
├── utils/
│   ├── constants.ts
│   └── formatters.ts
├── public/
│   └── img/
│       ├── hero-bg3.jpg
│       ├── logo.jpg
│       └── logo_com_fundo.png
├── .env.example
├── .env.local         (não commitado)
├── README.md
├── SECURITY.md
└── INSTALL.md
```

---

## 6. Seções (ordem de renderização)

### 6.1 Navbar
- Fixa no topo com `position: sticky`
- Fundo transparente → glassmorphism ao rolar
- Logo: `logo_com_fundo.png` (horizontal, canto esquerdo)
- Links âncora: Home · Especialidades · Sobre · Conteúdos · Fale Conosco
- Botões canto direito: **Área do Cliente** (`#`) · **Facilito EAD** (`#`)
  - Visual glassmorphism, hover animado, ícones Lucide
- Menu hambúrguer no mobile

### 6.2 Hero
- Background: `hero-bg3.jpg` + overlay gradiente `#0F172A/85%`
- Título: "Contabilidade Inteligente para Empresas que Querem Crescer"
- Subtítulo: "A Facilitar Serviços Contábeis oferece soluções fiscais, tributárias e empresariais com tecnologia, segurança e atendimento humanizado."
- Botões: **Falar com Especialista** (azul sólido) · **Solicitar Diagnóstico Gratuito** (outline branco)
- Animações: entrada com Framer Motion (fade + slide up)
- Badge animado: "Serra/ES · (27) 3068-8502"

### 6.3 Especialidades
- 10 cards em grid responsivo (2 cols mobile, 3 desktop)
- Glassmorphism leve + sombra suave + hover scale
- Cada card: ícone Lucide + título + descrição curta
- Serviços:
  1. Contabilidade Empresarial
  2. Consultoria Tributária
  3. Planejamento Tributário
  4. Departamento Fiscal
  5. Departamento Pessoal
  6. BPO Financeiro
  7. Abertura de Empresas
  8. Regularização Fiscal
  9. Apoio Administrativo
  10. Serviços Empresariais Especializados

### 6.4 Sobre
- Texto institucional completo
- `logo.jpg` posicionado ao lado ou centralizado
- Contadores animados: **7+ Anos** · **200+ Clientes** · **Serra/ES** · **10 Especialidades**
- Fundada em: 21/08/2018

### 6.5 Diferenciais
- 8 cards com ícone + título + descrição:
  - Atendimento Humanizado · Especialistas Tributários · Tecnologia e Automação
  - Segurança de Dados · Atendimento Ágil · Gestão Estratégica
  - Suporte Consultivo · Processos Inteligentes
- Animação de entrada escalonada (stagger)

### 6.6 Conteúdos / Blog
- 6 cards de artigos fictícios com categorias e tags
- Temas: Reforma Tributária · Simples Nacional · Lucro Presumido · MEI · Obrigações Acessórias · Planejamento Fiscal
- CTA "Ler mais" em cada card

### 6.7 Contato
- Formulário: Nome · Empresa · Email · WhatsApp (com máscara) · Assunto · Mensagem
- Campo honeypot oculto (`website`)
- Loading state + toast de sucesso/erro
- Google Maps embed: Serra/ES (Av. Eldes Scherrer Souza, 2162)
- Endereço completo + telefone ao lado

### 6.8 Footer
- Logo + CNPJ: 31.294.741/0001-56
- Endereço: Av. Eldes Scherrer Souza, 2162, Cond. Complexo Montserrat, Sala 301 e 303, Colina de Laranjeiras, Serra/ES — CEP 29167-080
- Telefone: (27) 3068-8502 · Email: contato@facilitar.net.br
- Links rápidos · Redes sociais · Política de Privacidade · Termos de Uso
- Copyright

### 6.9 WhatsApp FAB
- Botão flutuante fixo canto inferior direito
- Texto: "Falar com um Especialista"
- Link: `https://wa.me/5527306885 02?text=Olá!+Vim+através+do+site+da+Facilitar+Serviços+Contábeis+e+gostaria+de+falar+com+um+especialista.`
- Animação pulse verde
- Responsivo

---

## 7. API Route — /api/contact

**Validações (Zod):**
- nome: string, min 2, max 100
- empresa: string, opcional, max 100
- email: string email válido
- whatsapp: string, min 10, max 15
- assunto: string, min 3, max 100
- mensagem: string, min 10, max 2000
- website: string, deve estar vazio (honeypot)

**Middleware:**
1. Rate limit: 10 req/min por IP
2. Honeypot check
3. Zod validation
4. sanitize-html em todos os campos

**Ações:**
1. Nodemailer → envia para `contato@facilitar.net.br` com CC `monique@facilitar.net.br`
2. better-sqlite3 → insere registro na tabela `leads`

**Resposta:** `{ success: true/false, message: string }`

---

## 8. Segurança

| Proteção | Implementação |
|----------|---------------|
| Headers HTTP | `next.config.js` (CSP, HSTS, X-Frame-Options, X-Content-Type) |
| Rate Limiting | Middleware customizado por IP (Map em memória) |
| Honeypot | Campo `website` oculto no formulário |
| Sanitização | `sanitize-html` em todos os campos antes de salvar/enviar |
| Validação | Zod no client e no server |
| Secrets | Tudo em `.env.local`, nunca no código |
| XSS | CSP headers + sanitização |
| CSRF | Token em header customizado `X-CSRF-Token` |

---

## 9. SEO

- `metadata` export em `app/layout.tsx`: title, description, keywords, OpenGraph, TwitterCard
- JSON-LD `LocalBusiness` com endereço real (Serra/ES)
- `app/sitemap.ts` — sitemap automático
- `app/robots.ts` — robots.txt
- Keywords locais: "contabilidade Serra ES", "escritório contábil Serra", "contabilidade empresarial ES"

---

## 10. Deploy — VPS Hostinger

```
Ubuntu 22.04
  Node.js 20 LTS
  PM2 (ecosystem.config.js)
  Nginx → proxy_pass http://localhost:3000
  Certbot (Let's Encrypt) → SSL automático
```

INSTALL.md cobrirá:
1. Instalar Node.js 20 + PM2
2. Clonar repositório
3. Configurar `.env.local`
4. `npm run build` + `pm2 start`
5. Configurar Nginx (virtual host)
6. Emitir certificado SSL com Certbot

---

## 11. Dados de Configuração

| Variável | Valor |
|----------|-------|
| `CONTACT_EMAIL` | contato@facilitar.net.br |
| `CONTACT_EMAIL_CC` | monique@facilitar.net.br |
| `WHATSAPP_NUMBER` | 5527306885 02 |
| `COMPANY_NAME` | Facilitar Serviços Contábeis |
| `COMPANY_CNPJ` | 31.294.741/0001-56 |
| `COMPANY_ADDRESS` | Av. Eldes Scherrer Souza, 2162… |
| `NEXT_PUBLIC_SITE_URL` | https://facilitar.net.br |
