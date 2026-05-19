'use client'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Adicione os logos dos clientes aqui
// Para usar imagens reais: substitua o "name" pelo caminho da imagem em public/img/clientes/
const CLIENTS = [
  { id: 1, name: 'Cliente 1' },
  { id: 2, name: 'Cliente 2' },
  { id: 3, name: 'Cliente 3' },
  { id: 4, name: 'Cliente 4' },
  { id: 5, name: 'Cliente 5' },
  { id: 6, name: 'Cliente 6' },
  { id: 7, name: 'Cliente 7' },
  { id: 8, name: 'Cliente 8' },
]

export function ClientsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const CARD_WIDTH = 200 + 24 // card width + gap

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = CARD_WIDTH * 3
    scrollRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' })
  }

  const onScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-sm font-medium mb-4">
            Quem Confia na Facilitar
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
            Nossos <span className="text-gradient">Clientes</span>
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Empresas que crescem com o apoio estratégico da Facilitar Serviços Contábeis.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center transition-all duration-200 ${
              canScrollLeft
                ? 'text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600'
                : 'text-slate-300 cursor-not-allowed'
            }`}
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Scrollable track */}
          <div
            ref={scrollRef}
            onScroll={onScroll}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {CLIENTS.map((client, i) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex-shrink-0 w-48 h-28 rounded-2xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-md transition-all duration-300 flex items-center justify-center p-4"
              >
                {/* Substitua este bloco por <Image> quando tiver as logos */}
                <div className="text-center">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 font-bold text-sm">{client.id}</span>
                  </div>
                  <span className="text-slate-500 text-xs">{client.name}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center transition-all duration-200 ${
              canScrollRight
                ? 'text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600'
                : 'text-slate-300 cursor-not-allowed'
            }`}
            aria-label="Próximo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-1.5 mt-6">
          {Array.from({ length: Math.ceil(CLIENTS.length / 3) }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (!scrollRef.current) return
                scrollRef.current.scrollTo({ left: i * CARD_WIDTH * 3, behavior: 'smooth' })
              }}
              className="w-2 h-2 rounded-full bg-slate-200 hover:bg-blue-400 transition-colors"
              aria-label={`Grupo ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
