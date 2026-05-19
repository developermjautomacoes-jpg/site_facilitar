'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { FileSearch, MapPin } from 'lucide-react'
import { COMPANY } from '@/utils/constants'

export function HeroSection() {

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-slate-50">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(37,99,235,1) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Decorative blobs */}
      <div className="absolute top-32 right-8 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-70 pointer-events-none" />

      {/* Two-column layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 w-full">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-center">

          {/* Left: Text */}
          <div>
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
              className="text-4xl sm:text-5xl xl:text-6xl font-bold leading-tight mb-6 text-slate-900"
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
              className="text-lg text-slate-600 mb-10 leading-relaxed"
            >
              A Facilitar Serviços Contábeis oferece soluções fiscais, tributárias e empresariais
              com tecnologia, segurança e atendimento humanizado.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <a
                href="#contato"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold text-lg transition-all duration-300 shadow-lg shadow-blue-600/25 hover:-translate-y-0.5"
              >
                <FileSearch className="w-5 h-5" />
                Fale com um Especialista
              </a>
            </motion.div>

          </div>

          {/* Right: Professional photo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="hidden lg:flex justify-center items-center relative"
          >
            {/* Decorative rotated background card */}
            <div className="absolute inset-4 rounded-3xl bg-gradient-to-br from-blue-100 to-blue-200/60 transform rotate-3 shadow-sm" />

            {/* Photo */}
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/15 ring-1 ring-blue-100">
              <Image
                src="/img/team-office1.jpg"
                alt="Thais de Sousa Barbosa — CEO Facilitar Serviços Contábeis"
                fill
                className="object-cover object-top"
                priority
                quality={90}
              />
              {/* Name tag at bottom of photo */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent px-5 py-5">
                <p className="text-white font-semibold text-sm">Thais de Sousa Barbosa</p>
                <p className="text-blue-300 text-xs">CEO — Facilitar Serviços Contábeis</p>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  )
}
