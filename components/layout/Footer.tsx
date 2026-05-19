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
    <footer className="bg-slate-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2">
            <div className="relative w-48 h-14 mb-4" style={{ mixBlendMode: 'screen' }}>
              <Image src="/img/logo_com_fundo.png" alt="Facilitar Serviços Contábeis" fill className="object-contain" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              Contabilidade estratégica para empresas que querem crescer. Atendimento humanizado, tecnologia e segurança em Serra/ES.
            </p>
            <div className="flex gap-3">
              {[
                { href: '#', label: 'Instagram', abbr: 'IG' },
                { href: '#', label: 'Facebook', abbr: 'FB' },
                { href: '#', label: 'LinkedIn', abbr: 'IN' },
              ].map(({ href, label, abbr }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors text-xs font-bold">
                  {abbr}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm" style={{ fontFamily: 'var(--font-outfit)' }}>Links Rápidos</h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors">{link.label}</a>
                </li>
              ))}
              <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Termos de Uso</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm" style={{ fontFamily: 'var(--font-outfit)' }}>Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-slate-400 text-sm leading-relaxed">{COMPANY.address.full}</p>
              </li>
              <li>
                <a href={`tel:${COMPANY.phone}`} className="flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-colors">
                  <Phone className="w-4 h-4 text-blue-400" />{COMPANY.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-colors">
                  <Mail className="w-4 h-4 text-blue-400" />{COMPANY.email}
                </a>
              </li>
              <li>
                <a href={waLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-colors">
                  <span className="text-green-400"><WhatsAppIcon /></span>
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">{COMPANY.fullName} · CNPJ {COMPANY.cnpj}</p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <p className="text-slate-600 text-xs">© {year} Todos os direitos reservados</p>
            <span className="text-slate-700 hidden sm:block">·</span>
            <p className="text-slate-500 text-xs">
              Desenvolvido por{' '}
              <span className="text-blue-400 font-medium">NEEKO Automações</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
