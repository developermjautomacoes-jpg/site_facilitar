# Facilitar Serviços Contábeis — Site Institucional

Landing page profissional para a Facilitar Serviços Contábeis (Serra/ES).

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + Framer Motion + Lucide Icons
- Nodemailer (SMTP email)
- better-sqlite3 (armazenamento de leads — VPS)

## Instalação

```bash
npm install
cp .env.example .env.local
# edite .env.local com suas credenciais SMTP
npm run dev
```

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| SMTP_HOST | Servidor SMTP (smtp.gmail.com) |
| SMTP_PORT | Porta SMTP (587) |
| SMTP_USER | E-mail remetente |
| SMTP_PASS | Senha de app do Gmail |
| CONTACT_EMAIL | E-mail que recebe os leads |
| CONTACT_EMAIL_CC | CC dos e-mails de lead |
| NEXT_PUBLIC_WHATSAPP | Número WhatsApp sem + (5527999858502) |
| NEXT_PUBLIC_SITE_URL | URL pública do site |

## Scripts

```bash
npm run dev      # desenvolvimento (http://localhost:3000)
npm run build    # build de produção
npm run start    # iniciar em produção
npm test         # rodar testes
```

## Deploy VPS Hostinger

Ver `INSTALL.md` para guia completo com Nginx + PM2 + SSL.
