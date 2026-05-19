'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { CheckCircle2 } from 'lucide-react'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { STATS, COMPANY } from '@/utils/constants'

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
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-sm font-medium mb-4">
              Sobre a Facilitar
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-outfit)' }}>
              Simplificamos a <span className="text-gradient">Contabilidade</span> para você focar no que importa
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              A Facilitar Serviços Contábeis nasceu com o propósito de transformar a relação entre empresas e
              contabilidade, oferecendo atendimento próximo, estratégico e altamente tecnológico.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              Localizada em Serra/ES, atuamos com soluções contábeis, fiscais e administrativas para empresas
              de diversos segmentos, sempre focando em segurança, agilidade e crescimento sustentável.
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

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-10"
          >
            <div className="flex justify-center">
              <div className="relative w-64 h-40">
                <Image src="/img/logo.jpg" alt="Facilitar Serviços Contábeis" fill className="object-contain" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {STATS.map((stat) => (
                <div key={stat.label} className="p-6 rounded-2xl glass text-center">
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
