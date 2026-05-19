'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight, FileSearch, Phone, MapPin } from 'lucide-react'
import { COMPANY } from '@/utils/constants'
import { buildWhatsAppLink } from '@/utils/formatters'

export function HeroSection() {
  const whatsappLink = buildWhatsAppLink(COMPANY.whatsapp, COMPANY.whatsappMessage)

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-blue-50/40 to-slate-100">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(37,99,235,1) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Right side image */}
      <div className="absolute right-0 top-0 bottom-0 w-[45%] hidden lg:block z-0">
        <Image
          src="/img/hero-bg3.jpg"
          alt="Facilitar Serviços Contábeis — Escritório Serra/ES"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Fade from left so text area stays white */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent" />
      </div>

      {/* Decorative blue blob */}
      <div className="absolute top-20 right-[45%] w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-blue-50 rounded-full blur-2xl opacity-80 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        <div className="max-w-2xl">
          {/* Location badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-slate-600 text-sm mb-8"
          >
            <MapPin className="w-4 h-4 text-blue-600" />
            Serra / Espírito Santo
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-slate-900"
            style={{ fontFamily: 'var(--font-outfit)' }}
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
            className="text-lg text-slate-600 mb-10 max-w-xl leading-relaxed"
          >
            A Facilitar Serviços Contábeis oferece soluções fiscais, tributárias e empresariais
            com tecnologia, segurança e atendimento humanizado.
          </motion.p>

          {/* CTAs */}
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
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold text-lg transition-all duration-300 shadow-lg shadow-blue-600/25 hover:-translate-y-0.5"
            >
              <Phone className="w-5 h-5" />
              Falar com Especialista
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contato"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 font-semibold text-lg transition-all duration-300 hover:bg-blue-50"
            >
              <FileSearch className="w-5 h-5" />
              Solicitar Diagnóstico Gratuito
            </a>
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center gap-4 text-slate-500 text-sm"
          >
            <a href={`tel:${COMPANY.phone}`} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <Phone className="w-4 h-4 text-blue-600" />
              {COMPANY.phone}
            </a>
            <span className="text-slate-300 hidden sm:block">·</span>
            <a href={`mailto:${COMPANY.email}`} className="hover:text-blue-600 transition-colors">
              {COMPANY.email}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
