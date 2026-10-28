# Publicação — VPS Hostinger com Easypanel

O servidor já tem o Easypanel, que cuida de proxy, HTTPS e containers.
**Não instale Nginx, PM2 ou Certbot na VPS** — eles disputam as portas 80/443 com o Easypanel.

## 1. Criar o app no Easypanel

1. Projeto novo (ex.: `facilitar`) → **+ Service → App** (ex.: `site`).
2. **Source:** GitHub → repositório `developermjautomacoes-jpg/site_facilitar`, branch `main`.
3. **Build:** `Dockerfile` (arquivo na raiz do repositório).
4. **Environment** — copie do `.env.example` e preencha:
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (senha de app do Gmail)
   - `CONTACT_EMAIL`, `CONTACT_EMAIL_CC`
   - `NEXT_PUBLIC_SITE_URL=https://facilitar.net.br`, `NEXT_PUBLIC_WHATSAPP`
   - `SESSION_SECRET` e `CSRF_SECRET` (strings aleatórias longas, diferentes entre si)
5. **Mounts → Volume:** nome `storage`, caminho de montagem `/app/storage`.
6. **Domains:** `facilitar.net.br` e `www.facilitar.net.br`, porta **3000**, HTTPS ligado.
7. **Deploy.**

## 2. Levar os dados atuais para o servidor

Os dados do portal não vão para o GitHub. Copie para dentro do volume (`/app/storage`):

- conteúdo da pasta `data/` (users.json, leads.json, notifications.json, ead_*.json) → `/app/storage/`
- conteúdo de `public/uploads/` (pasta `ead/`) → `/app/storage/uploads/`

## 3. DNS (Registro.br)

- `A` @ → IP da VPS
- `A` www → IP da VPS (ou `CNAME` www → facilitar.net.br)
- Não alterar os registros da Microsoft (MX, autodiscover, TXT/SPF).

## 4. Atualizar o site

Faça `git push` na branch `main` e clique em **Deploy** no Easypanel
(ou ative o auto-deploy do GitHub no app).

## Gmail SMTP

1. myaccount.google.com → Segurança → Verificação em duas etapas → Ativar
2. Senhas de app → Gerar senha de 16 caracteres
3. Usar essa senha em `SMTP_PASS`
