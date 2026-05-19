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
          <Clock className="w-3 h-3" />{readTime}
        </span>
      </div>
      <h3 className="text-white font-semibold mb-3 group-hover:text-blue-300 transition-colors line-clamp-2" style={{ fontFamily: 'var(--font-outfit)' }}>
        {title}
      </h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">{excerpt}</p>
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
        <div className="flex items-center gap-1 text-slate-500 text-xs">
          <Tag className="w-3 h-3" />{tag}
        </div>
        <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium group/btn transition-colors">
          Ler mais <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.article>
  )
}
