# Facilitar Landing Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, production-ready landing page for Facilitar Serviços Contábeis with Next.js 15, Tailwind CSS, Framer Motion, contact form with Nodemailer + SQLite, and full security/SEO for deploy em VPS Hostinger via PM2 + Nginx.

**Architecture:** Next.js 15 App Router with TypeScript. Contact form POSTs to `/api/contact` which validates with Zod, sanitizes inputs, enforces rate limiting, sends email via Nodemailer, and saves leads to SQLite (local/VPS only).

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v3, Framer Motion 11, Lucide React, react-hook-form, Zod, Nodemailer, better-sqlite3, Vitest + React Testing Library

**Project root:** `C:\Users\Facilitar\Desktop\Programas\FACILITAR\site-facilitar\`

---

## File Map

| File | Responsibility |
|------|---------------|
| `app/layout.tsx` | Root layout, fonts, global metadata, JSON-LD |
| `app/page.tsx` | Assembles all sections |
| `app/globals.css` | Tailwind directives + custom animations |
| `app/api/contact/route.ts` | Contact form endpoint |
| `app/sitemap.ts` | Sitemap XML |
| `app/robots.ts` | Robots.txt |
| `components/layout/Navbar.tsx` | Fixed navbar with glassmorphism |
| `components/layout/Footer.tsx` | Footer with company info |
| `components/sections/HeroSection.tsx` | Hero with hero-bg3.jpg |
| `components/sections/ServicesSection.tsx` | 10 service cards |
| `components/sections/AboutSection.tsx` | Company story + counters |
| `components/sections/DifferentialsSection.tsx` | 8 differentials |
| `components/sections/BlogSection.tsx` | 6 blog cards |
| `components/sections/ContactSection.tsx` | Form + Maps |
| `components/ui/WhatsAppButton.tsx` | Floating WhatsApp FAB |
| `components/ui/ServiceCard.tsx` | Glassmorphism service card |
| `components/ui/BlogCard.tsx` | Blog article card |
| `components/ui/AnimatedCounter.tsx` | Animated number counter |
| `components/ui/Toast.tsx` | Success/error notifications |
| `lib/validations.ts` | Zod schemas |
| `lib/email.ts` | Nodemailer setup |
| `lib/db.ts` | SQLite connection + queries |
| `lib/sanitize.ts` | Input sanitization |
| `lib/rateLimit.ts` | IP-based rate limiting |
| `utils/constants.ts` | Company data, nav links, services |
| `utils/formatters.ts` | Phone mask, date format |
| `hooks/useAnimatedCounter.ts` | Counter animation hook |
| `hooks/useScrollAnimation.ts` | Scroll-triggered animations |
| `next.config.js` | Security headers, image domains |
| `.env.example` | Environment variable template |
| `README.md` | Project docs |
| `SECURITY.md` | Security policies |
| `INSTALL.md` | VPS deploy guide |
| `__tests__/validations.test.ts` | Zod schema unit tests |
| `__tests__/sanitize.test.ts` | Sanitize unit tests |
| `__tests__/contact-route.test.ts` | API route integration tests |

---

## Task 1: Initialize Next.js 15 project

**Files:**
- Create: `package.json`, project scaffold

- [ ] **Step 1: Scaffold project in site-facilitar/**

Run inside `C:\Users\Facilitar\Desktop\Programas\FACILITAR\site-facilitar\`:

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=no --import-alias="@/*" --use-npm
```

When prompted:
- Would you like to use Turbopack? → **No** (stability for production)

- [ ] **Step 2: Install all required dependencies**

```bash
npm install framer-motion lucide-react react-hook-form @hookform/resolvers zod nodemailer better-sqlite3 sanitize-html
npm install -D @types/nodemailer @types/better-sqlite3 @types/sanitize-html vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 3: Add vitest config to package.json**

Add to `package.json` scripts and vitest config:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "vitest": {
    "environment": "jsdom",
    "globals": true,
    "setupFiles": ["./vitest.setup.ts"]
  }
}
```

- [ ] **Step 4: Create vitest.setup.ts**

```typescript
// vitest.setup.ts
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Create vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

- [ ] **Step 6: Commit**

```bash
git init
git add .
git commit -m "feat: initialize Next.js 15 project with dependencies"
```

---

## Task 2: Copy public assets

**Files:**
- Create: `public/img/hero-bg3.jpg`, `public/img/logo.jpg`, `public/img/logo_com_fundo.png`

- [ ] **Step 1: Create public/img directory and copy images**

```bash
mkdir -p public/img
cp img/hero-bg3.jpg public/img/
cp img/logo.jpg public/img/
cp img/logo_com_fundo.png public/img/
```

- [ ] **Step 2: Verify files exist**

```bash
ls public/img/
```

Expected: `hero-bg3.jpg  logo.jpg  logo_com_fundo.png`

- [ ] **Step 3: Commit**

```bash
git add public/img/
git commit -m "feat: add company images to public assets"
```

---

## Task 3: Configure next.config.js and environment

**Files:**
- Modify: `next.config.js` (or `next.config.ts`)
- Create: `.env.example`, `.env.local`, `.gitignore` update

- [ ] **Step 1: Write next.config.js with security headers and image config**

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    localPatterns: [{ pathname: '/img/**' }],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self'",
              "frame-src https://www.google.com https://maps.google.com",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

- [ ] **Step 2: Create .env.example**

```bash
# .env.example

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app

# Contact Emails
CONTACT_EMAIL=contato@facilitar.net.br
CONTACT_EMAIL_CC=monique@facilitar.net.br

# Site
NEXT_PUBLIC_SITE_URL=https://facilitar.net.br
NEXT_PUBLIC_WHATSAPP=5527999858502

# CSRF (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
CSRF_SECRET=troque-por-string-aleatoria-de-32-chars
```

- [ ] **Step 3: Create .env.local (dev only — never commit)**

```bash
# .env.local
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contato@facilitar.net.br
SMTP_PASS=TROCAR_PELA_SENHA_DE_APP
CONTACT_EMAIL=contato@facilitar.net.br
CONTACT_EMAIL_CC=monique@facilitar.net.br
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP=5527999858502
CSRF_SECRET=dev-csrf-secret-trocar-em-producao
```

- [ ] **Step 4: Ensure .gitignore has .env.local**

Verify `.gitignore` contains:
```
.env.local
.env*.local
leads.db
```

- [ ] **Step 5: Commit**

```bash
git add next.config.js .env.example .gitignore
git commit -m "feat: configure security headers and environment variables"
```

---

## Task 4: Create constants and utils

**Files:**
- Create: `utils/constants.ts`
- Create: `utils/formatters.ts`

- [ ] **Step 1: Write utils/constants.ts**

```typescript
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
    id: 'contabilidade',
    title: 'Contabilidade Empresarial',
    description: 'Escrituração contábil, demonstrações financeiras e relatórios gerenciais para apoiar decisões estratégicas.',
    icon: 'BookOpen',
  },
  {
    id: 'consultoria-tributaria',
    title: 'Consultoria Tributária',
    description: 'Análise e orientação tributária personalizada para reduzir riscos e otimizar a carga fiscal da sua empresa.',
    icon: 'Scale',
  },
  {
    id: 'planejamento',
    title: 'Planejamento Tributário',
    description: 'Estratégias legais para minimizar tributos com segurança jurídica e máxima eficiência fiscal.',
    icon: 'TrendingDown',
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
    id: 'bpo',
    title: 'BPO Financeiro',
    description: 'Terceirização do financeiro com controle de fluxo de caixa, contas a pagar/receber e relatórios.',
    icon: 'BarChart3',
  },
  {
    id: 'abertura',
    title: 'Abertura de Empresas',
    description: 'Registro e legalização de empresas com agilidade, escolha do regime tributário ideal e suporte completo.',
    icon: 'Building2',
  },
  {
    id: 'regularizacao',
    title: 'Regularização Fiscal',
    description: 'Resolução de pendências fiscais, parcelamentos e recuperação de créditos tributários.',
    icon: 'ShieldCheck',
  },
  {
    id: 'administrativo',
    title: 'Apoio Administrativo',
    description: 'Suporte em processos administrativos, emissão de certidões, alvarás e obrigações municipais.',
    icon: 'ClipboardList',
  },
  {
    id: 'especializados',
    title: 'Serviços Especializados',
    description: 'Soluções personalizadas para demandas específicas do seu segmento empresarial.',
    icon: 'Sparkles',
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
```

- [ ] **Step 2: Write utils/formatters.ts**

```typescript
// utils/formatters.ts

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }
  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
}

export function buildWhatsAppLink(number: string, message: string): string {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${number}?text=${encoded}`
}
```

- [ ] **Step 3: Commit**

```bash
git add utils/
git commit -m "feat: add company constants and utility formatters"
```

---

## Task 5: Create Zod validations + tests

**Files:**
- Create: `lib/validations.ts`
- Create: `__tests__/validations.test.ts`

- [ ] **Step 1: Write __tests__/validations.test.ts (failing first)**

```typescript
// __tests__/validations.test.ts
import { describe, it, expect } from 'vitest'
import { contactSchema } from '@/lib/validations'

describe('contactSchema', () => {
  const valid = {
    nome: 'João Silva',
    empresa: 'Empresa Teste',
    email: 'joao@empresa.com',
    whatsapp: '(27) 99999-9999',
    assunto: 'Orçamento',
    mensagem: 'Gostaria de um orçamento para abertura de empresa.',
    website: '',
  }

  it('accepts valid input', () => {
    const result = contactSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('rejects empty nome', () => {
    const result = contactSchema.safeParse({ ...valid, nome: '' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = contactSchema.safeParse({ ...valid, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('rejects mensagem too short', () => {
    const result = contactSchema.safeParse({ ...valid, mensagem: 'curto' })
    expect(result.success).toBe(false)
  })

  it('rejects honeypot filled', () => {
    const result = contactSchema.safeParse({ ...valid, website: 'http://bot.com' })
    expect(result.success).toBe(false)
  })

  it('accepts empresa as optional', () => {
    const { empresa, ...noEmpresa } = valid
    const result = contactSchema.safeParse({ ...noEmpresa, website: '' })
    expect(result.success).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm test -- __tests__/validations.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/validations'`

- [ ] **Step 3: Write lib/validations.ts**

```typescript
// lib/validations.ts
import { z } from 'zod'

export const contactSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  empresa: z.string().max(100).optional(),
  email: z.string().email('E-mail inválido'),
  whatsapp: z.string().min(10, 'WhatsApp inválido').max(20),
  assunto: z.string().min(3, 'Assunto muito curto').max(100),
  mensagem: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres').max(2000),
  website: z.string().max(0, 'Campo inválido'),
})

export type ContactFormData = z.infer<typeof contactSchema>
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
npm test -- __tests__/validations.test.ts
```

Expected: 6 tests PASS

- [ ] **Step 5: Commit**

```bash
git add lib/validations.ts __tests__/validations.test.ts
git commit -m "feat: add Zod contact form validation schema with tests"
```

---

## Task 6: Create sanitize and rate limit libs + tests

**Files:**
- Create: `lib/sanitize.ts`
- Create: `lib/rateLimit.ts`
- Create: `__tests__/sanitize.test.ts`

- [ ] **Step 1: Write __tests__/sanitize.test.ts (failing first)**

```typescript
// __tests__/sanitize.test.ts
import { describe, it, expect } from 'vitest'
import { sanitizeField, sanitizeContactData } from '@/lib/sanitize'

describe('sanitizeField', () => {
  it('strips HTML tags', () => {
    expect(sanitizeField('<script>alert(1)</script>Olá')).toBe('Olá')
  })

  it('preserves plain text', () => {
    expect(sanitizeField('João Silva')).toBe('João Silva')
  })

  it('strips XSS attempts', () => {
    expect(sanitizeField('<img src=x onerror=alert(1)>texto')).toBe('texto')
  })
})

describe('sanitizeContactData', () => {
  it('sanitizes all fields', () => {
    const input = {
      nome: '<b>João</b>',
      email: 'joao@test.com',
      whatsapp: '(27) 99999-9999',
      assunto: '<em>Orçamento</em>',
      mensagem: '<script>xss</script>Mensagem normal',
      website: '',
    }
    const result = sanitizeContactData(input)
    expect(result.nome).toBe('João')
    expect(result.assunto).toBe('Orçamento')
    expect(result.mensagem).toBe('Mensagem normal')
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm test -- __tests__/sanitize.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/sanitize'`

- [ ] **Step 3: Write lib/sanitize.ts**

```typescript
// lib/sanitize.ts
import sanitizeHtml from 'sanitize-html'

export function sanitizeField(value: string): string {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim()
}

export function sanitizeContactData(data: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(data)) {
    result[key] = typeof value === 'string' ? sanitizeField(value) : value
  }
  return result
}
```

- [ ] **Step 4: Write lib/rateLimit.ts**

```typescript
// lib/rateLimit.ts

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

export function checkRateLimit(ip: string, limit = 10, windowMs = 60_000): boolean {
  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) return false

  entry.count++
  return true
}
```

- [ ] **Step 5: Run sanitize tests to confirm they pass**

```bash
npm test -- __tests__/sanitize.test.ts
```

Expected: 5 tests PASS

- [ ] **Step 6: Commit**

```bash
git add lib/sanitize.ts lib/rateLimit.ts __tests__/sanitize.test.ts
git commit -m "feat: add input sanitization and rate limiting"
```

---

## Task 7: Create SQLite db lib

**Files:**
- Create: `lib/db.ts`

- [ ] **Step 1: Write lib/db.ts**

```typescript
// lib/db.ts
import Database from 'better-sqlite3'
import path from 'path'

let db: Database.Database | null = null

function getDb(): Database.Database | null {
  // SQLite only works in Node.js runtime (VPS), not on Vercel serverless
  if (typeof window !== 'undefined') return null

  try {
    if (!db) {
      const dbPath = path.join(process.cwd(), 'leads.db')
      db = new Database(dbPath)
      db.exec(`
        CREATE TABLE IF NOT EXISTS leads (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          empresa TEXT,
          email TEXT NOT NULL,
          whatsapp TEXT,
          assunto TEXT,
          mensagem TEXT,
          ip TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)
    }
    return db
  } catch {
    return null
  }
}

export interface LeadData {
  nome: string
  empresa?: string
  email: string
  whatsapp: string
  assunto: string
  mensagem: string
  ip?: string
}

export function saveLead(data: LeadData): void {
  const database = getDb()
  if (!database) return

  const stmt = database.prepare(`
    INSERT INTO leads (nome, empresa, email, whatsapp, assunto, mensagem, ip)
    VALUES (@nome, @empresa, @email, @whatsapp, @assunto, @mensagem, @ip)
  `)
  stmt.run(data)
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/db.ts
git commit -m "feat: add SQLite lead persistence"
```

---

## Task 8: Create email lib

**Files:**
- Create: `lib/email.ts`

- [ ] **Step 1: Write lib/email.ts**

```typescript
// lib/email.ts
import nodemailer from 'nodemailer'
import type { LeadData } from './db'

function createTransporter() {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function sendContactEmail(data: LeadData): Promise<void> {
  const transporter = createTransporter()

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0F172A; padding: 24px; border-radius: 8px 8px 0 0;">
        <h2 style="color: #ffffff; margin: 0;">Novo Lead — Facilitar Serviços Contábeis</h2>
      </div>
      <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: bold; color: #475569; width: 120px;">Nome:</td><td style="padding: 8px 0;">${data.nome}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #475569;">Empresa:</td><td style="padding: 8px 0;">${data.empresa ?? '—'}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #475569;">E-mail:</td><td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #475569;">WhatsApp:</td><td style="padding: 8px 0;">${data.whatsapp}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #475569;">Assunto:</td><td style="padding: 8px 0;">${data.assunto}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #475569; vertical-align: top;">Mensagem:</td><td style="padding: 8px 0; white-space: pre-wrap;">${data.mensagem}</td></tr>
        </table>
      </div>
      <div style="background: #e2e8f0; padding: 16px; border-radius: 0 0 8px 8px; font-size: 12px; color: #64748b;">
        Enviado via site facilitar.net.br em ${new Date().toLocaleString('pt-BR')}
      </div>
    </div>
  `

  await transporter.sendMail({
    from: `"Site Facilitar" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_EMAIL ?? 'contato@facilitar.net.br',
    cc: process.env.CONTACT_EMAIL_CC,
    subject: '📩 Novo Lead recebido pelo site — Facilitar',
    html,
    replyTo: data.email,
  })
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/email.ts
git commit -m "feat: add Nodemailer email sender"
```

---

## Task 9: Create /api/contact route + tests

**Files:**
- Create: `app/api/contact/route.ts`
- Create: `__tests__/contact-route.test.ts`

- [ ] **Step 1: Write app/api/contact/route.ts**

```typescript
// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { contactSchema } from '@/lib/validations'
import { sanitizeContactData } from '@/lib/sanitize'
import { checkRateLimit } from '@/lib/rateLimit'
import { saveLead } from '@/lib/db'
import { sendContactEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'

  // Rate limiting
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, message: 'Muitas tentativas. Tente novamente em alguns minutos.' },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, message: 'Dados inválidos.' }, { status: 400 })
  }

  // Validate
  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: 'Dados inválidos.', errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    )
  }

  // Sanitize
  const safe = sanitizeContactData(parsed.data as Record<string, string>)

  const lead = {
    nome: safe.nome,
    empresa: safe.empresa,
    email: safe.email,
    whatsapp: safe.whatsapp,
    assunto: safe.assunto,
    mensagem: safe.mensagem,
    ip,
  }

  // Save to DB (best-effort — don't fail if SQLite unavailable)
  try { saveLead(lead) } catch { /* silently skip on serverless */ }

  // Send email
  try {
    await sendContactEmail(lead)
  } catch (err) {
    console.error('Email send error:', err)
    return NextResponse.json(
      { success: false, message: 'Erro ao enviar mensagem. Tente novamente ou ligue para (27) 3068-8502.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, message: 'Mensagem enviada com sucesso!' })
}
```

- [ ] **Step 2: Write __tests__/contact-route.test.ts**

```typescript
// __tests__/contact-route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/email', () => ({ sendContactEmail: vi.fn().mockResolvedValue(undefined) }))
vi.mock('@/lib/db', () => ({ saveLead: vi.fn() }))
vi.mock('@/lib/rateLimit', () => ({ checkRateLimit: vi.fn().mockReturnValue(true) }))

import { POST } from '@/app/api/contact/route'
import { NextRequest } from 'next/server'

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const validBody = {
  nome: 'João Silva',
  empresa: 'Empresa Teste',
  email: 'joao@empresa.com',
  whatsapp: '(27) 99999-9999',
  assunto: 'Orçamento',
  mensagem: 'Gostaria de um orçamento completo.',
  website: '',
}

describe('POST /api/contact', () => {
  it('returns 200 for valid data', async () => {
    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('returns 422 for invalid email', async () => {
    const res = await POST(makeRequest({ ...validBody, email: 'bad' }))
    expect(res.status).toBe(422)
  })

  it('returns 422 when honeypot filled', async () => {
    const res = await POST(makeRequest({ ...validBody, website: 'http://bot.com' }))
    expect(res.status).toBe(422)
  })

  it('returns 429 when rate limited', async () => {
    const { checkRateLimit } = await import('@/lib/rateLimit')
    vi.mocked(checkRateLimit).mockReturnValueOnce(false)
    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(429)
  })
})
```

- [ ] **Step 3: Run tests**

```bash
npm test -- __tests__/contact-route.test.ts
```

Expected: 4 tests PASS

- [ ] **Step 4: Commit**

```bash
git add app/api/ __tests__/contact-route.test.ts
git commit -m "feat: add contact API route with validation, rate limiting and email"
```

---

## Task 10: Configure globals.css and app/layout.tsx

**Files:**
- Modify: `app/globals.css`
- Create/Modify: `app/layout.tsx`

- [ ] **Step 1: Write app/globals.css**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --navy: #0F172A;
    --blue: #2563EB;
    --blue-light: #3B82F6;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-[#0F172A] text-white antialiased;
  }

  ::selection {
    @apply bg-blue-600 text-white;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    @apply bg-slate-900;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-blue-600 rounded-full;
  }
}

@layer utilities {
  .glass {
    @apply bg-white/5 backdrop-blur-md border border-white/10;
  }

  .glass-hover {
    @apply hover:bg-white/10 hover:border-white/20 transition-all duration-300;
  }

  .text-gradient {
    @apply bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent;
  }

  .section-padding {
    @apply py-20 px-4 sm:px-6 lg:px-8;
  }
}
```

- [ ] **Step 2: Write app/layout.tsx**

```typescript
// app/layout.tsx
import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { COMPANY } from '@/utils/constants'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://facilitar.net.br'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Facilitar Serviços Contábeis | Contabilidade em Serra/ES',
    template: '%s | Facilitar Serviços Contábeis',
  },
  description:
    'Escritório de contabilidade em Serra/ES especializado em contabilidade empresarial, planejamento tributário, BPO financeiro e abertura de empresas. Atendimento humanizado e tecnológico.',
  keywords: [
    'contabilidade Serra ES',
    'escritório contábil Serra',
    'contabilidade empresarial Espírito Santo',
    'planejamento tributário Serra',
    'BPO financeiro ES',
    'abertura de empresas Serra ES',
    'contabilidade Colina de Laranjeiras',
    'Facilitar Serviços Contábeis',
  ],
  authors: [{ name: 'Facilitar Serviços Contábeis' }],
  creator: 'Facilitar Serviços Contábeis',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: siteUrl,
    siteName: 'Facilitar Serviços Contábeis',
    title: 'Facilitar Serviços Contábeis | Contabilidade em Serra/ES',
    description: 'Soluções contábeis, fiscais e tributárias com tecnologia e atendimento humanizado em Serra/ES.',
    images: [{ url: '/img/hero-bg3.jpg', width: 1200, height: 630, alt: 'Facilitar Serviços Contábeis' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Facilitar Serviços Contábeis',
    description: 'Contabilidade estratégica para empresas que querem crescer. Serra/ES.',
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AccountingService',
  name: COMPANY.name,
  legalName: COMPANY.fullName,
  url: siteUrl,
  telephone: COMPANY.phone,
  email: COMPANY.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Av. Eldes Scherrer Souza, 2162',
    addressLocality: 'Serra',
    addressRegion: 'ES',
    postalCode: '29167-080',
    addressCountry: 'BR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -20.1281,
    longitude: -40.2928,
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
  ],
  sameAs: [],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: configure layout, fonts, SEO metadata and JSON-LD"
```

---

## Task 11: Create UI primitives — AnimatedCounter, Toast, hooks

**Files:**
- Create: `hooks/useAnimatedCounter.ts`
- Create: `hooks/useScrollAnimation.ts`
- Create: `components/ui/AnimatedCounter.tsx`
- Create: `components/ui/Toast.tsx`

- [ ] **Step 1: Write hooks/useAnimatedCounter.ts**

```typescript
// hooks/useAnimatedCounter.ts
'use client'
import { useState, useEffect, useRef } from 'react'

export function useAnimatedCounter(target: number, duration = 2000, startOnMount = false) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(startOnMount)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!hasStarted) return
    let startTime: number
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [hasStarted, target, duration])

  useEffect(() => {
    if (startOnMount) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHasStarted(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [startOnMount])

  return { count, ref }
}
```

- [ ] **Step 2: Write hooks/useScrollAnimation.ts**

```typescript
// hooks/useScrollAnimation.ts
'use client'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export function useScrollAnimation(threshold = 0.1) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: threshold })
  return { ref, isInView }
}
```

- [ ] **Step 3: Write components/ui/AnimatedCounter.tsx**

```typescript
// components/ui/AnimatedCounter.tsx
'use client'
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter'

interface Props {
  value: number
  suffix?: string
  label: string
}

export function AnimatedCounter({ value, suffix = '', label }: Props) {
  const { count, ref } = useAnimatedCounter(value)
  return (
    <div className="text-center" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className="text-4xl font-bold text-blue-400 font-outfit">
        {count}{suffix}
      </div>
      <div className="text-slate-400 text-sm mt-1">{label}</div>
    </div>
  )
}
```

- [ ] **Step 4: Write components/ui/Toast.tsx**

```typescript
// components/ui/Toast.tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, X } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl max-w-sm ${
          type === 'success'
            ? 'bg-green-900/90 border border-green-500/30 text-green-100'
            : 'bg-red-900/90 border border-red-500/30 text-red-100'
        } backdrop-blur-md`}
      >
        {type === 'success' ? <CheckCircle className="w-5 h-5 text-green-400 shrink-0" /> : <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
        <span className="text-sm">{message}</span>
        <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add hooks/ components/ui/AnimatedCounter.tsx components/ui/Toast.tsx
git commit -m "feat: add animated counter, toast and scroll animation hooks"
```

---

## Task 12: Create Navbar

**Files:**
- Create: `components/layout/Navbar.tsx`

- [ ] **Step 1: Write components/layout/Navbar.tsx**

```typescript
// components/layout/Navbar.tsx
'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, BookOpen, Phone } from 'lucide-react'
import { NAV_LINKS } from '@/utils/constants'
import { buildWhatsAppLink } from '@/utils/formatters'
import { COMPANY } from '@/utils/constants'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="relative w-40 h-12">
              <Image
                src="/img/logo_com_fundo.png"
                alt="Facilitar Serviços Contábeis"
                fill
                className="object-contain"
                priority
              />
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="#"
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass glass-hover text-slate-300 hover:text-white text-sm font-medium transition-all duration-300"
            >
              <User className="w-4 h-4" />
              Área do Cliente
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass glass-hover text-slate-300 hover:text-white text-sm font-medium transition-all duration-300"
            >
              <BookOpen className="w-4 h-4" />
              Facilito EAD
            </a>
            <a
              href={buildWhatsAppLink(COMPANY.whatsapp, COMPANY.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-blue-600/25"
            >
              <Phone className="w-4 h-4" />
              Fale Conosco
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-900/98 backdrop-blur-md border-t border-white/5"
          >
            <div className="px-4 py-6 space-y-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-slate-300 hover:text-white py-2 text-sm font-medium"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 space-y-3 border-t border-white/10">
                <a href="#" className="flex items-center gap-2 text-slate-300 hover:text-white text-sm py-2">
                  <User className="w-4 h-4" /> Área do Cliente
                </a>
                <a href="#" className="flex items-center gap-2 text-slate-300 hover:text-white text-sm py-2">
                  <BookOpen className="w-4 h-4" /> Facilito EAD
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/layout/Navbar.tsx
git commit -m "feat: add responsive glassmorphism navbar"
```

---

## Task 13: Create HeroSection

**Files:**
- Create: `components/sections/HeroSection.tsx`

- [ ] **Step 1: Write components/sections/HeroSection.tsx**

```typescript
// components/sections/HeroSection.tsx
'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight, FileSearch, Phone, MapPin } from 'lucide-react'
import { COMPANY } from '@/utils/constants'
import { buildWhatsAppLink } from '@/utils/formatters'

export function HeroSection() {
  const whatsappLink = buildWhatsAppLink(COMPANY.whatsapp, COMPANY.whatsappMessage)

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/img/hero-bg3.jpg"
          alt="Facilitar Serviços Contábeis"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-slate-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
      </div>

      {/* Animated grid pattern */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(37,99,235,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="max-w-3xl">
          {/* Location badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-slate-300 text-sm mb-8"
          >
            <MapPin className="w-4 h-4 text-blue-400" />
            Serra / Espírito Santo
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold font-outfit leading-tight mb-6"
          >
            Contabilidade{' '}
            <span className="text-gradient">Inteligente</span>{' '}
            para Empresas que Querem Crescer
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-slate-300 mb-10 max-w-2xl leading-relaxed"
          >
            A Facilitar Serviços Contábeis oferece soluções fiscais, tributárias e empresariais
            com tecnologia, segurança e atendimento humanizado.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-semibold text-lg transition-all duration-300 shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              <Phone className="w-5 h-5" />
              Falar com Especialista
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contato"
              className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/20 hover:border-white/40 text-white font-semibold text-lg transition-all duration-300 hover:bg-white/5"
            >
              <FileSearch className="w-5 h-5" />
              Solicitar Diagnóstico Gratuito
            </a>
          </motion.div>

          {/* Phone number */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-12 flex items-center gap-2 text-slate-400 text-sm"
          >
            <Phone className="w-4 h-4 text-blue-400" />
            <a href={`tel:${COMPANY.phone}`} className="hover:text-white transition-colors">
              {COMPANY.phone}
            </a>
            <span className="text-slate-600">·</span>
            <a href={`mailto:${COMPANY.email}`} className="hover:text-white transition-colors">
              {COMPANY.email}
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent z-10" />
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/HeroSection.tsx
git commit -m "feat: add hero section with animated entrance and hero-bg3 image"
```

---

## Task 14: Create ServicesSection

**Files:**
- Create: `components/ui/ServiceCard.tsx`
- Create: `components/sections/ServicesSection.tsx`

- [ ] **Step 1: Write components/ui/ServiceCard.tsx**

```typescript
// components/ui/ServiceCard.tsx
'use client'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import type { LucideProps } from 'lucide-react'

interface ServiceCardProps {
  title: string
  description: string
  icon: string
  index: number
}

export function ServiceCard({ title, description, icon, index }: ServiceCardProps) {
  const Icon = (Icons as unknown as Record<string, React.ComponentType<LucideProps>>)[icon] ?? Icons.Building2

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      whileHover={{ y: -4 }}
      className="group relative p-6 rounded-2xl glass glass-hover cursor-default"
    >
      {/* Blue glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/5 group-hover:to-blue-400/5 transition-all duration-500" />

      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:bg-blue-600/30 transition-colors duration-300">
          <Icon className="w-6 h-6 text-blue-400" />
        </div>
        <h3 className="text-white font-semibold font-outfit mb-2">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 2: Write components/sections/ServicesSection.tsx**

```typescript
// components/sections/ServicesSection.tsx
'use client'
import { motion } from 'framer-motion'
import { ServiceCard } from '@/components/ui/ServiceCard'
import { SERVICES } from '@/utils/constants'

export function ServicesSection() {
  return (
    <section id="especialidades" className="section-padding bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-sm font-medium mb-4">
            Nossas Especialidades
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-outfit text-white mb-4">
            Soluções Contábeis{' '}
            <span className="text-gradient">Completas</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Da abertura ao crescimento da sua empresa, oferecemos serviços especializados
            para cada fase do negócio com precisão e segurança.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.id} {...service} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/ui/ServiceCard.tsx components/sections/ServicesSection.tsx
git commit -m "feat: add services section with 10 glassmorphism cards"
```

---

## Task 15: Create AboutSection

**Files:**
- Create: `components/sections/AboutSection.tsx`

- [ ] **Step 1: Write components/sections/AboutSection.tsx**

```typescript
// components/sections/AboutSection.tsx
'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { STATS, COMPANY } from '@/utils/constants'
import { CheckCircle2 } from 'lucide-react'

const VALUES = [
  'Ética e transparência em tudo que fazemos',
  'Tecnologia e automação a favor do cliente',
  'Atendimento consultivo e humanizado',
  'Atualização constante com a legislação',
  'Comprometimento com resultados reais',
]

export function AboutSection() {
  return (
    <section id="sobre" className="section-padding bg-[#0F172A] relative overflow-hidden">
      {/* Decorative blur */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-sm font-medium mb-4">
              Sobre a Facilitar
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-outfit text-white mb-6">
              Simplificamos a{' '}
              <span className="text-gradient">Contabilidade</span>{' '}
              para você focar no que importa
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              A Facilitar Serviços Contábeis nasceu com o propósito de transformar a relação
              entre empresas e contabilidade, oferecendo atendimento próximo, estratégico e
              altamente tecnológico.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              Localizada em Serra/ES, a empresa atua oferecendo soluções contábeis, fiscais
              e administrativas para empresas de diversos segmentos, sempre focando em
              segurança, agilidade e crescimento sustentável. Nosso compromisso é simplificar
              processos, gerar inteligência tributária e proporcionar tranquilidade para que
              nossos clientes possam focar no crescimento dos seus negócios.
            </p>

            <ul className="space-y-3">
              {VALUES.map((value) => (
                <li key={value} className="flex items-start gap-3 text-slate-300 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  {value}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right — Logo + Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-10"
          >
            {/* Logo */}
            <div className="flex justify-center">
              <div className="relative w-64 h-40">
                <Image
                  src="/img/logo.jpg"
                  alt="Facilitar Serviços Contábeis"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-6">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="p-6 rounded-2xl glass text-center"
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} label={stat.label} />
                </div>
              ))}
            </div>

            <p className="text-center text-slate-500 text-xs">
              Fundada em {COMPANY.founded} · CNPJ {COMPANY.cnpj}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/AboutSection.tsx
git commit -m "feat: add about section with animated stats and company story"
```

---

## Task 16: Create DifferentialsSection

**Files:**
- Create: `components/sections/DifferentialsSection.tsx`

- [ ] **Step 1: Write components/sections/DifferentialsSection.tsx**

```typescript
// components/sections/DifferentialsSection.tsx
'use client'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import { DIFFERENTIALS } from '@/utils/constants'

export function DifferentialsSection() {
  return (
    <section className="section-padding bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-sm font-medium mb-4">
            Por que escolher a Facilitar
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-outfit text-white mb-4">
            Nossos <span className="text-gradient">Diferenciais</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Veja o que nos torna a escolha certa para a contabilidade da sua empresa.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DIFFERENTIALS.map((item, i) => {
            const Icon = (Icons as unknown as Record<string, React.ComponentType<LucideProps>>)[item.icon] ?? Icons.Star
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-6 rounded-2xl glass glass-hover group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-600/30 transition-colors">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold text-sm font-outfit mb-2">{item.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{item.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/DifferentialsSection.tsx
git commit -m "feat: add differentials section with 8 animated cards"
```

---

## Task 17: Create BlogSection

**Files:**
- Create: `components/ui/BlogCard.tsx`
- Create: `components/sections/BlogSection.tsx`

- [ ] **Step 1: Write components/ui/BlogCard.tsx**

```typescript
// components/ui/BlogCard.tsx
'use client'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Tag } from 'lucide-react'

interface BlogCardProps {
  title: string
  excerpt: string
  category: string
  tag: string
  date: string
  readTime: string
  index: number
}

export function BlogCard({ title, excerpt, category, tag, date, readTime, index }: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group p-6 rounded-2xl glass glass-hover flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-medium">
          {category}
        </span>
        <span className="flex items-center gap-1 text-slate-500 text-xs">
          <Clock className="w-3 h-3" />
          {readTime}
        </span>
      </div>

      <h3 className="text-white font-semibold font-outfit mb-3 group-hover:text-blue-300 transition-colors line-clamp-2">
        {title}
      </h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">{excerpt}</p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
        <div className="flex items-center gap-1 text-slate-500 text-xs">
          <Tag className="w-3 h-3" />
          {tag}
        </div>
        <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium group/btn transition-colors">
          Ler mais
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.article>
  )
}
```

- [ ] **Step 2: Write components/sections/BlogSection.tsx**

```typescript
// components/sections/BlogSection.tsx
'use client'
import { motion } from 'framer-motion'
import { BlogCard } from '@/components/ui/BlogCard'
import { BLOG_POSTS } from '@/utils/constants'

export function BlogSection() {
  return (
    <section id="conteudos" className="section-padding bg-[#0F172A]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-sm font-medium mb-4">
            Conteúdos
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-outfit text-white mb-4">
            Fique por Dentro do{' '}
            <span className="text-gradient">Universo Contábil</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Artigos, guias e atualizações sobre contabilidade, tributação e gestão empresarial.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post, i) => (
            <BlogCard key={post.id} {...post} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/ui/BlogCard.tsx components/sections/BlogSection.tsx
git commit -m "feat: add blog/content section with 6 article cards"
```

---

## Task 18: Create ContactSection

**Files:**
- Create: `components/sections/ContactSection.tsx`

- [ ] **Step 1: Write components/sections/ContactSection.tsx**

```typescript
// components/sections/ContactSection.tsx
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, Loader2, MapPin, Phone, Mail } from 'lucide-react'
import { contactSchema, type ContactFormData } from '@/lib/validations'
import { Toast } from '@/components/ui/Toast'
import { formatPhone } from '@/utils/formatters'
import { COMPANY } from '@/utils/constants'

export function ContactSection() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { website: '' },
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (json.success) {
        setToast({ message: 'Mensagem enviada! Retornaremos em breve.', type: 'success' })
        reset()
      } else {
        setToast({ message: json.message ?? 'Erro ao enviar. Tente novamente.', type: 'error' })
      }
    } catch {
      setToast({ message: 'Erro de conexão. Tente novamente.', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-xl bg-white/5 border ${hasError ? 'border-red-500/50' : 'border-white/10'} text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all duration-200 text-sm`

  return (
    <section id="contato" className="section-padding bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-sm font-medium mb-4">
            Fale Conosco
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-outfit text-white mb-4">
            Vamos Conversar sobre{' '}
            <span className="text-gradient">Seu Negócio</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Preencha o formulário e nossa equipe entrará em contato em até 1 dia útil.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Honeypot — hidden from real users */}
              <input type="text" {...register('website')} className="hidden" tabIndex={-1} autoComplete="off" />

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <input {...register('nome')} placeholder="Nome *" className={inputClass(!!errors.nome)} />
                  {errors.nome && <p className="text-red-400 text-xs mt-1">{errors.nome.message}</p>}
                </div>
                <div>
                  <input {...register('empresa')} placeholder="Empresa" className={inputClass(!!errors.empresa)} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <input {...register('email')} type="email" placeholder="E-mail *" className={inputClass(!!errors.email)} />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <input
                    {...register('whatsapp')}
                    placeholder="WhatsApp *"
                    className={inputClass(!!errors.whatsapp)}
                    onChange={(e) => setValue('whatsapp', formatPhone(e.target.value))}
                  />
                  {errors.whatsapp && <p className="text-red-400 text-xs mt-1">{errors.whatsapp.message}</p>}
                </div>
              </div>

              <div>
                <input {...register('assunto')} placeholder="Assunto *" className={inputClass(!!errors.assunto)} />
                {errors.assunto && <p className="text-red-400 text-xs mt-1">{errors.assunto.message}</p>}
              </div>

              <div>
                <textarea
                  {...register('mensagem')}
                  placeholder="Mensagem *"
                  rows={5}
                  className={`${inputClass(!!errors.mensagem)} resize-none`}
                />
                {errors.mensagem && <p className="text-red-400 text-xs mt-1">{errors.mensagem.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-600/25"
              >
                {isLoading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Enviando...</>
                ) : (
                  <><Send className="w-5 h-5" /> Enviar Mensagem</>
                )}
              </button>
            </form>
          </motion.div>

          {/* Info + Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="space-y-4">
              {[
                { icon: MapPin, label: 'Endereço', value: COMPANY.address.full },
                { icon: Phone, label: 'Telefone', value: COMPANY.phone },
                { icon: Mail, label: 'E-mail', value: COMPANY.email },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4 p-4 rounded-xl glass">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs mb-1">{label}</p>
                    <p className="text-white text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Google Maps embed */}
            <div className="rounded-2xl overflow-hidden border border-white/10 h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3741.5!2d-40.2928!3d-20.1281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDA3JzQxLjIiUyA0MMKwMTcnMzQuMSJX!5e0!3m2!1spt-BR!2sbr!4v1621234567890!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Facilitar Serviços Contábeis"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/ContactSection.tsx
git commit -m "feat: add contact section with form, validation and Google Maps"
```

---

## Task 19: Create Footer

**Files:**
- Create: `components/layout/Footer.tsx`

- [ ] **Step 1: Write components/layout/Footer.tsx**

```typescript
// components/layout/Footer.tsx
import Image from 'next/image'
import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin } from 'lucide-react'
import { COMPANY, NAV_LINKS } from '@/utils/constants'
import { buildWhatsAppLink } from '@/utils/formatters'

export function Footer() {
  const year = new Date().getFullYear()
  const waLink = buildWhatsAppLink(COMPANY.whatsapp, COMPANY.whatsappMessage)

  return (
    <footer className="bg-slate-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="relative w-48 h-14 mb-4">
              <Image src="/img/logo_com_fundo.png" alt="Facilitar Serviços Contábeis" fill className="object-contain" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              Contabilidade estratégica para empresas que querem crescer. Atendimento humanizado,
              tecnologia e segurança em Serra/ES.
            </p>
            <div className="flex gap-3">
              {[
                { href: '#', Icon: Instagram, label: 'Instagram' },
                { href: '#', Icon: Facebook, label: 'Facebook' },
                { href: '#', Icon: Linkedin, label: 'LinkedIn' },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg glass glass-hover flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold font-outfit mb-4 text-sm">Links Rápidos</h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
              <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Termos de Uso</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold font-outfit mb-4 text-sm">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-slate-400 text-sm leading-relaxed">{COMPANY.address.full}</p>
              </li>
              <li>
                <a href={`tel:${COMPANY.phone}`} className="flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-colors">
                  <Phone className="w-4 h-4 text-blue-400" />
                  {COMPANY.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-colors">
                  <Mail className="w-4 h-4 text-blue-400" />
                  {COMPANY.email}
                </a>
              </li>
              <li>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-colors">
                  <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">
            © {year} {COMPANY.fullName} · CNPJ {COMPANY.cnpj}
          </p>
          <p className="text-slate-600 text-xs">
            Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/layout/Footer.tsx
git commit -m "feat: add footer with company info, links and social media"
```

---

## Task 20: Create WhatsApp FAB

**Files:**
- Create: `components/ui/WhatsAppButton.tsx`

- [ ] **Step 1: Write components/ui/WhatsAppButton.tsx**

```typescript
// components/ui/WhatsAppButton.tsx
'use client'
import { motion } from 'framer-motion'
import { COMPANY } from '@/utils/constants'
import { buildWhatsAppLink } from '@/utils/formatters'

export function WhatsAppButton() {
  const href = buildWhatsAppLink(COMPANY.whatsapp, COMPANY.whatsappMessage)

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: 'spring', stiffness: 200 }}
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3"
    >
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3 }}
        className="glass px-4 py-2 rounded-full text-white text-sm whitespace-nowrap shadow-lg"
      >
        Fale com um Especialista
      </motion.div>

      {/* Button */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir WhatsApp"
        className="relative w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center shadow-xl shadow-green-500/30 transition-colors"
      >
        {/* Pulse rings */}
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
        <span className="absolute inset-[-4px] rounded-full border-2 border-green-500/30 animate-pulse" />

        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </motion.div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/WhatsAppButton.tsx
git commit -m "feat: add floating WhatsApp button with pulse animation"
```

---

## Task 21: Assemble app/page.tsx

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Write app/page.tsx**

```typescript
// app/page.tsx
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { DifferentialsSection } from '@/components/sections/DifferentialsSection'
import { BlogSection } from '@/components/sections/BlogSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <DifferentialsSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: assemble full landing page with all sections"
```

---

## Task 22: Add sitemap and robots

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

- [ ] **Step 1: Write app/sitemap.ts**

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://facilitar.net.br'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${siteUrl}/#especialidades`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/#sobre`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.7 },
    { url: `${siteUrl}/#conteudos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${siteUrl}/#contato`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.9 },
  ]
}
```

- [ ] **Step 2: Write app/robots.ts**

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://facilitar.net.br'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add app/sitemap.ts app/robots.ts
git commit -m "feat: add sitemap and robots.txt for SEO"
```

---

## Task 23: Create documentation files

**Files:**
- Create: `README.md`, `SECURITY.md`, `INSTALL.md`

- [ ] **Step 1: Write README.md**

```markdown
# Facilitar Serviços Contábeis — Site Institucional

Landing page profissional built with Next.js 15, TypeScript, Tailwind CSS e Framer Motion.

## Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + Framer Motion + Lucide Icons
- Nodemailer (SMTP email)
- better-sqlite3 (lead storage — VPS only)

## Instalação

\`\`\`bash
npm install
cp .env.example .env.local
# edite .env.local com suas credenciais
npm run dev
\`\`\`

## Variáveis de Ambiente

Veja `.env.example` para a lista completa.

| Variável | Descrição |
|----------|-----------|
| SMTP_HOST | Servidor SMTP (ex: smtp.gmail.com) |
| SMTP_PORT | Porta SMTP (587) |
| SMTP_USER | E-mail remetente |
| SMTP_PASS | Senha de app SMTP |
| CONTACT_EMAIL | E-mail que recebe os leads |
| CONTACT_EMAIL_CC | CC dos leads |
| NEXT_PUBLIC_WHATSAPP | Número WhatsApp (sem +) |
| NEXT_PUBLIC_SITE_URL | URL pública do site |

## Scripts

\`\`\`bash
npm run dev      # desenvolvimento
npm run build    # build produção
npm run start    # servidor produção
npm test         # rodar testes
\`\`\`

## Testes

\`\`\`bash
npm test
\`\`\`

## Deploy VPS

Ver `INSTALL.md` para instruções completas de deploy no VPS Hostinger.

## Arquitetura

\`\`\`
app/
  layout.tsx      — SEO global, fonts, JSON-LD
  page.tsx        — Monta todas as seções
  api/contact/    — API de formulário de contato
components/
  layout/         — Navbar, Footer
  sections/       — Hero, Serviços, Sobre, etc.
  ui/             — Componentes reutilizáveis
lib/              — Email, DB, validações, sanitização
utils/            — Constantes da empresa, formatadores
\`\`\`
```

- [ ] **Step 2: Write SECURITY.md**

```markdown
# Security Policy — Facilitar Serviços Contábeis

## Proteções Implementadas

| Proteção | Descrição |
|----------|-----------|
| Security Headers | X-Frame-Options, HSTS, CSP, X-Content-Type via next.config.js |
| Rate Limiting | 10 req/min por IP na API /api/contact |
| Honeypot | Campo oculto `website` para detectar bots |
| Sanitização | sanitize-html em todos os inputs antes de salvar/enviar |
| Validação | Zod no client e no server-side |
| Variáveis sensíveis | Somente em .env.local (nunca commitado) |
| XSS | CSP headers + sanitização de outputs |

## Boas Práticas

- Nunca commitar `.env.local` ou `leads.db`
- Trocar `CSRF_SECRET` em produção por valor aleatório forte
- Usar senha de app (não a senha principal) para Gmail SMTP
- Manter dependências atualizadas: `npm audit` regularmente
- No VPS: usar Nginx com rate limiting adicional

## Reporte de Vulnerabilidades

Encontrou uma vulnerabilidade? Envie e-mail para contato@facilitar.net.br.
```

- [ ] **Step 3: Write INSTALL.md**

```markdown
# Guia de Instalação — VPS Hostinger

## 1. Preparar o VPS (Ubuntu 22.04)

\`\`\`bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Instalar Nginx
sudo apt install -y nginx

# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx
\`\`\`

## 2. Deploy do projeto

\`\`\`bash
# Clonar repositório
git clone <seu-repo> /var/www/facilitar
cd /var/www/facilitar

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
nano .env.local  # editar com suas credenciais reais

# Build de produção
npm run build

# Iniciar com PM2
pm2 start npm --name "facilitar-site" -- start
pm2 save
pm2 startup
\`\`\`

## 3. Configurar Nginx

\`\`\`bash
sudo nano /etc/nginx/sites-available/facilitar
\`\`\`

Conteúdo do arquivo:

\`\`\`nginx
server {
    listen 80;
    server_name facilitar.net.br www.facilitar.net.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

\`\`\`bash
sudo ln -s /etc/nginx/sites-available/facilitar /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
\`\`\`

## 4. SSL com Let's Encrypt

\`\`\`bash
sudo certbot --nginx -d facilitar.net.br -d www.facilitar.net.br
\`\`\`

## 5. Atualizar o site

\`\`\`bash
cd /var/www/facilitar
git pull
npm install
npm run build
pm2 restart facilitar-site
\`\`\`

## 6. Configurar Gmail SMTP

1. Acesse myaccount.google.com → Segurança → Verificação em duas etapas → Ative
2. Vá em Senhas de app → Gere uma senha de 16 caracteres
3. Use essa senha em `SMTP_PASS` no `.env.local`
\`\`\`

- [ ] **Step 4: Commit**

```bash
git add README.md SECURITY.md INSTALL.md
git commit -m "docs: add README, SECURITY and INSTALL guides"
```

---

## Task 24: Run full build and test

**Files:** No new files

- [ ] **Step 1: Run all tests**

```bash
npm test
```

Expected: All tests PASS (validations, sanitize, contact-route)

- [ ] **Step 2: Run TypeScript type check**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Run production build**

```bash
npm run build
```

Expected: Build completes with no errors

- [ ] **Step 4: Start dev server and verify visually**

```bash
npm run dev
```

Open `http://localhost:3000` — verify:
- Navbar renders with logo
- Hero shows hero-bg3.jpg background
- All 6 sections render
- WhatsApp FAB appears
- Footer shows company info

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "chore: verify full build and tests pass"
```

---

## Spec Coverage Check

| Spec Requirement | Task |
|-----------------|------|
| Next.js 15 + TypeScript + Tailwind + Framer Motion | Task 1 |
| Security headers (Helmet equivalent) | Task 3 |
| Nodemailer email | Task 8 |
| SQLite leads | Task 7 |
| Rate limiting | Task 6 |
| Honeypot + sanitization | Task 6, 9 |
| Navbar com Área do Cliente + Facilito EAD | Task 12 |
| Hero com hero-bg3.jpg + CTAs animados | Task 13 |
| 10 cards de especialidades glassmorphism | Task 14 |
| Sobre + contadores animados | Task 15 |
| 8 diferenciais | Task 16 |
| Blog com 6 artigos | Task 17 |
| Formulário completo + máscara + loading + toast | Task 18 |
| Google Maps embed | Task 18 |
| Footer completo + CNPJ + redes sociais | Task 19 |
| WhatsApp FAB com pulse | Task 20 |
| SEO metadata + OpenGraph + JSON-LD | Task 10 |
| Sitemap + robots.txt | Task 22 |
| README + SECURITY + INSTALL | Task 23 |
| VPS Hostinger deploy guide | Task 23 |
| Responsivo (mobile/tablet/desktop) | Tailwind responsive classes em todos os componentes |
| Zod validation tests | Task 5 |
| Sanitize tests | Task 6 |
| API route tests | Task 9 |
