import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'
import { COMPANY, NAV_LINKS } from '@/utils/constants'
import { buildWhatsAppLink } from '@/utils/formatters'

const WhatsAppIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

export function Footer() {
  const year = new Date().getFullYear()
  const waLink = buildWhatsAppLink(COMPANY.whatsapp, COMPANY.whatsappMessage)

  return (
    <footer className="bg-slate-950 border-t border-white/5 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Coluna esquerda: logo Facilitar + descricao + redes sociais */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              {/* Logo Principal Aumentada: w-52 h-24 para dar presença */}
              <div className="relative w-52 h-24 mb-6" style={{ mixBlendMode: 'screen' }}>
                <Image 
                  src="/img/logo_facilitar1.png" 
                  alt="Facilitar Serviços Contábeis" 
                  fill 
                  className="object-contain object-left" 
                  priority
                />
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
                Contabilidade estratégica para empresas que querem crescer. 
                Atendimento humanizado, tecnologia e segurança em Serra/ES.
              </p>
              
              {/* Redes Sociais com hover mais vibrante */}
              <div className="flex gap-4 mb-8">
                {[
                  { href: '#', label: 'Instagram', abbr: 'IG' },
                  { href: '#', label: 'Facebook', abbr: 'FB' },
                  { href: '#', label: 'LinkedIn', abbr: 'IN' },
                ].map(({ href, label, abbr }) => (
                  <a key={label} href={href} aria-label={label}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all hover:scale-110 text-xs font-bold tracking-wider">
                    {abbr}
                  </a>
                ))}
              </div>
            </div>

            {/* Crédito NEEKO com logo mais nítida */}
            <div className="flex items-center gap-4 pt-6 border-t border-white/5">
              <span className="text-slate-500 text-xs uppercase tracking-widest">Powered by</span>
              <div className="relative w-32 h-10 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
                <Image
                  src="/img/logo neeko.png"
                  alt="NEEKO Automações Inteligentes"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>
          </div>

          {/* Links Rápidos */}
          <div className="lg:pl-8">
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest" style={{ fontFamily: 'var(--font-outfit)' }}>
              Links Rápidos
            </h3>
            <ul className="space-y-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-slate-400 hover:text-blue-400 text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-all"></span>
                    {link.label}
                  </a>
                </li>
              ))}
              <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Termos de Uso</a></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest" style={{ fontFamily: 'var(--font-outfit)' }}>
              Contato
            </h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3 group">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <p className="text-slate-400 text-sm leading-relaxed">{COMPANY.address.full}</p>
              </li>
              <li>
                <a href={`tel:${COMPANY.phone}`} className="flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-colors group">
                  <Phone className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{COMPANY.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-colors group">
                  <Mail className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="break-all">{COMPANY.email}</span>
                </a>
              </li>
              <li>
                <a href={waLink} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-full text-sm transition-all border border-green-500/20 hover:border-green-500/40">
                  <WhatsAppIcon />
                  <span className="font-semibold">Fale Conosco</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-0,5 pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-500 text-[10px] md:text-xs tracking-wide">
            {COMPANY.fullName.toUpperCase()} <span className="mx-2 text-slate-800">|</span> CNPJ {COMPANY.cnpj}
          </div>
          <p className="text-slate-600 text-xs font-light">
            © {year} Facilitar. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}