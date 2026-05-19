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
}

export function ServiceCard({ title, description, icon, index }: ServiceCardProps) {
  const Icon = (Icons as unknown as Record<string, ComponentType<LucideProps>>)[icon] ?? Icons.Building2

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      whileHover={{ y: -4 }}
      className="group relative p-6 rounded-2xl glass glass-hover cursor-default"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/5 group-hover:to-blue-400/5 transition-all duration-500" />
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:bg-blue-600/30 transition-colors duration-300">
          <Icon className="w-6 h-6 text-blue-400" />
        </div>
        <h3 className="text-white font-semibold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}
