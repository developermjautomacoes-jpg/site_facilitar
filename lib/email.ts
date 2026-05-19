import nodemailer from 'nodemailer'
import type { LeadData } from './db'

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function sendContactEmail(data: LeadData): Promise<void> {
  const transporter = createTransporter()

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0F172A; padding: 24px; border-radius: 8px 8px 0 0;">
        <h2 style="color: #ffffff; margin: 0;">Novo Lead — Facilitar Serviços Contábeis</h2>
      </div>
      <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: bold; color: #475569; width: 120px;">Nome:</td><td style="padding: 8px 0;">${data.nome}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #475569;">Empresa:</td><td style="padding: 8px 0;">${data.empresa ?? '—'}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #475569;">E-mail:</td><td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #475569;">WhatsApp:</td><td style="padding: 8px 0;">${data.whatsapp}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #475569;">Assunto:</td><td style="padding: 8px 0;">${data.assunto}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #475569; vertical-align: top;">Mensagem:</td><td style="padding: 8px 0; white-space: pre-wrap;">${data.mensagem}</td></tr>
        </table>
      </div>
      <div style="background: #e2e8f0; padding: 16px; border-radius: 0 0 8px 8px; font-size: 12px; color: #64748b;">
        Enviado via site facilitar.net.br em ${new Date().toLocaleString('pt-BR')}
      </div>
    </div>
  `

  await transporter.sendMail({
    from: `"Site Facilitar" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_EMAIL ?? 'contato@facilitar.net.br',
    cc: process.env.CONTACT_EMAIL_CC,
    subject: '📩 Novo Lead recebido pelo site — Facilitar',
    html,
    replyTo: data.email,
  })
}
