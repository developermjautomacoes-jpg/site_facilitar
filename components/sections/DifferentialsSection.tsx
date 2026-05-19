'use client'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import type { ComponentType } from 'react'
import type { LucideProps } from 'lucide-react'
import { DIFFERENTIALS } from '@/utils/constants'

export function DifferentialsSection() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-sm font-medium mb-4">
            Por que escolher a Facilitar
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
            Nossos <span className="text-gradient">Diferenciais</span>
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            O que nos torna a escolha certa para a contabilidade da sua empresa.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DIFFERENTIALS.map((item, i) => {
            const Icon = (Icons as unknown as Record<string, ComponentType<LucideProps>>)[item.icon] ?? Icons.Star
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-md group transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-slate-900 font-semibold text-sm mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>{item.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{item.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
