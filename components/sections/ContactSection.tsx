'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, Loader2, MapPin, Phone, Mail } from 'lucide-react'
import { contactSchema, type ContactFormData } from '@/lib/validations'
import { Toast } from '@/components/ui/Toast'
import { formatPhone } from '@/utils/formatters'
import { COMPANY } from '@/utils/constants'

export function ContactSection() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { website: '' },
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (json.success) {
        setToast({ message: 'Mensagem enviada! Retornaremos em breve.', type: 'success' })
        reset()
      } else {
        setToast({ message: json.message ?? 'Erro ao enviar. Tente novamente.', type: 'error' })
      }
    } catch {
      setToast({ message: 'Erro de conexão. Tente novamente.', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-xl bg-white/5 border ${hasError ? 'border-red-500/50' : 'border-white/10'} text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all duration-200 text-sm`

  const contactInfo = [
    { icon: MapPin, label: 'Endereço', value: COMPANY.address.full },
    { icon: Phone, label: 'Telefone', value: COMPANY.phone },
    { icon: Mail, label: 'E-mail', value: COMPANY.email },
  ]

  return (
    <section id="contato" className="section-padding bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-sm font-medium mb-4">
            Fale Conosco
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
            Vamos Conversar sobre <span className="text-gradient">Seu Negócio</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Preencha o formulário e nossa equipe entrará em contato em até 1 dia útil.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Honeypot */}
              <input type="text" {...register('website')} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <input {...register('nome')} placeholder="Nome *" className={inputClass(!!errors.nome)} />
                  {errors.nome && <p className="text-red-400 text-xs mt-1">{errors.nome.message}</p>}
                </div>
                <div>
                  <input {...register('empresa')} placeholder="Empresa" className={inputClass(!!errors.empresa)} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <input {...register('email')} type="email" placeholder="E-mail *" className={inputClass(!!errors.email)} />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <input
                    {...register('whatsapp')}
                    placeholder="WhatsApp *"
                    className={inputClass(!!errors.whatsapp)}
                    onChange={(e) => setValue('whatsapp', formatPhone(e.target.value))}
                  />
                  {errors.whatsapp && <p className="text-red-400 text-xs mt-1">{errors.whatsapp.message}</p>}
                </div>
              </div>

              <div>
                <input {...register('assunto')} placeholder="Assunto *" className={inputClass(!!errors.assunto)} />
                {errors.assunto && <p className="text-red-400 text-xs mt-1">{errors.assunto.message}</p>}
              </div>

              <div>
                <textarea
                  {...register('mensagem')}
                  placeholder="Mensagem *"
                  rows={5}
                  className={`${inputClass(!!errors.mensagem)} resize-none`}
                />
                {errors.mensagem && <p className="text-red-400 text-xs mt-1">{errors.mensagem.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-600/25"
              >
                {isLoading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Enviando...</>
                ) : (
                  <><Send className="w-5 h-5" /> Enviar Mensagem</>
                )}
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="space-y-4">
              {contactInfo.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4 p-4 rounded-xl glass">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs mb-1">{label}</p>
                    <p className="text-white text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/10 h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3741.572895!2d-40.29565!3d-20.127800!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zRmFjaWxpdGFyIFNlcnZpw6dvcyBDb250w6FiZWlz!5e0!3m2!1spt-BR!2sbr!4v1621234567890!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Facilitar Serviços Contábeis — Serra/ES"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </section>
  )
}
