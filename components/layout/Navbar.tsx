'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, BookOpen } from 'lucide-react'
import { NAV_LINKS } from '@/utils/constants'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-100'
          : 'bg-white/70 backdrop-blur-sm border-b border-slate-100/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center">
            <div className="relative w-44 h-12">
              <Image
                src="/img/logo_com_fundo.png"
                alt="Facilitar Serviços Contábeis"
                fill
                className="object-contain"
                priority
              />
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="#"
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass glass-hover text-slate-600 hover:text-slate-900 text-sm font-medium transition-all duration-300"
            >
              <User className="w-4 h-4" />
              Área do Cliente
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass glass-hover text-slate-600 hover:text-slate-900 text-sm font-medium transition-all duration-300"
            >
              <BookOpen className="w-4 h-4" />
              Facilito EAD
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 transition-colors text-slate-600 hover:text-slate-900"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Abrir menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-100 border-b border-slate-100"
          >
            <div className="px-4 py-6 space-y-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-slate-700 hover:text-slate-900 py-2 text-sm font-medium"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 space-y-3 border-t border-slate-100">
                <a href="#" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm py-2">
                  <User className="w-4 h-4" /> Área do Cliente
                </a>
                <a href="#" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm py-2">
                  <BookOpen className="w-4 h-4" /> Facilito EAD
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
