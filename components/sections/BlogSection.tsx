'use client'
import { motion } from 'framer-motion'
import { BlogCard } from '@/components/ui/BlogCard'
import { BLOG_POSTS } from '@/utils/constants'

export function BlogSection() {
  return (
    <section id="conteudos" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-sm font-medium mb-4">
            Conteúdos
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
            Fique por Dentro do <span className="text-gradient">Universo Contábil</span>
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
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
