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
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
            Soluções Contábeis <span className="text-gradient">Completas</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Da abertura ao crescimento da sua empresa, oferecemos serviços especializados para cada fase do negócio.
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
