'use client'

import Image from 'next/image'
import { useState } from 'react'

const WHATSAPP_URL =
  'https://wa.me/5527999858502?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.'

export function ChatButton() {
  const [hovered, setHovered] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2">

      {/* Balão de mensagem */}
      <div
        className={`
          transition-all duration-300 ease-out
          ${hovered
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-2 pointer-events-none'
          }
          bg-slate-900 border border-blue-500/30 text-white text-sm
          rounded-2xl rounded-br-sm px-4 py-2 shadow-xl max-w-[200px] text-center
        `}
      >
        <p className="font-semibold text-blue-400 text-xs mb-0.5">Facilito</p>
        <p className="text-slate-300 text-xs leading-relaxed">
          Olá! Como posso te ajudar? 😊
        </p>
      </div>

      {/* Botão flutuante com avatar do Facilito */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Fale conosco pelo WhatsApp"
        className={`
          relative w-16 h-16 rounded-full shadow-2xl
          ring-2 ring-blue-500/40 hover:ring-blue-400/70
          transition-all duration-300 hover:scale-110 hover:-translate-y-1
          overflow-hidden block
        `}
        style={{
          boxShadow: hovered
            ? '0 0 24px 6px rgba(59,130,246,0.35), 0 8px 24px rgba(0,0,0,0.4)'
            : '0 4px 20px rgba(0,0,0,0.4)',
        }}
      >
        <Image
          src="/img/facilito_1.png"
          alt="Facilito - Assistente Facilitar"
          fill
          className="object-cover"
        />
      </a>
    </div>
  )
}
