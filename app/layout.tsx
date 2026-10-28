import type { Metadata, Viewport } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { COMPANY } from '@/utils/constants'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://facilitar.net.br'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

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
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
  ],
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
