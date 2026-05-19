'use client'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import type { ComponentType } from 'react'
import type { LucideProps } from 'lucide-react'

interface ServiceCardProps {
  title: string
  description: string
  icon: string
  index: number
  accent?: 'blue' | 'emerald'
}

export function ServiceCard({ title, description, icon, index, accent = 'blue' }: ServiceCardProps) {
  const Icon = (Icons as unknown as Record<string, ComponentType<LucideProps>>)[icon] ?? Icons.Building2

  const colors = {
    blue: {
      border: 'hover:border-blue-200',
      iconBg: 'bg-blue-50 border-blue-100 group-hover:bg-blue-100',
      iconText: 'text-blue-600',
    },
    emerald: {
      border: 'hover:border-emerald-200',
      iconBg: 'bg-emerald-50 border-emerald-100 group-hover:bg-emerald-100',
      iconText: 'text-emerald-600',
    },
  }

  const c = colors[accent]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      whileHover={{ y: -4 }}
      className={`group relative p-6 rounded-2xl bg-white border border-slate-200 ${c.border} hover:shadow-md cursor-default transition-all duration-300`}
    >
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 transition-colors duration-300 ${c.iconBg}`}>
          <Icon className={`w-6 h-6 ${c.iconText}`} />
        </div>
        <h3 className="text-slate-900 font-semibold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}
