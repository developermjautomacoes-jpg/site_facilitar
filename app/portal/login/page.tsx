'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, EyeOff, Lock, Mail, ArrowLeft, ShieldCheck } from 'lucide-react'

export default function PortalLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Placeholder: aguardando integração com sistema de gestão externo
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(37,99,235,1) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Back to site link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Voltar ao site
        </Link>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative w-48 h-14" style={{ mixBlendMode: 'screen' }}>
              <Image
                src="/img/logo_com_fundo.png"
                alt="Facilitar Serviços Contábeis"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {!submitted ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-white text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>
                  Área do Cliente
                </h1>
                <p className="text-slate-400 text-sm">
                  Acesse com as credenciais fornecidas pela Facilitar
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="seu@email.com.br"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:bg-white/8 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:bg-white/8 transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Forgot password */}
                <div className="text-right">
                  <button type="button" className="text-blue-400 hover:text-blue-300 text-xs transition-colors">
                    Esqueceu a senha? Entre em contato com a Facilitar
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-600/25"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Entrando...
                    </>
                  ) : (
                    'Entrar no Portal'
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Placeholder — portal em desenvolvimento */
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-white text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-outfit)' }}>
                Portal em Desenvolvimento
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                O portal do cliente está sendo desenvolvido e em breve estará disponível com acesso completo aos seus documentos e informações.
              </p>
              <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4 mb-6">
                <p className="text-blue-300 text-xs leading-relaxed">
                  Em caso de necessidade, entre em contato diretamente com a Facilitar pelo WhatsApp ou e-mail.
                </p>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="text-slate-400 hover:text-white text-sm transition-colors"
              >
                ← Voltar ao login
              </button>
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-slate-600 text-xs mt-6">
          Acesso restrito a clientes da Facilitar Serviços Contábeis
        </p>
      </div>
    </div>
  )
}
