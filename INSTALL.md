# Guia de Instalação — VPS Hostinger

## 1. Preparar o servidor (Ubuntu 22.04)

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx certbot python3-certbot-nginx
sudo npm install -g pm2
```

## 2. Deploy do projeto

```bash
git clone <seu-repo> /var/www/facilitar
cd /var/www/facilitar
npm install
cp .env.example .env.local
nano .env.local    # editar com credenciais reais
npm run build
pm2 start npm --name "facilitar-site" -- start
pm2 save && pm2 startup
```

## 3. Nginx

```bash
sudo nano /etc/nginx/sites-available/facilitar
```

```nginx
server {
    listen 80;
    server_name facilitar.net.br www.facilitar.net.br;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/facilitar /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d facilitar.net.br -d www.facilitar.net.br
```

## 4. Atualizar o site

```bash
cd /var/www/facilitar && git pull && npm install && npm run build && pm2 restart facilitar-site
```

## 5. Gmail SMTP

1. myaccount.google.com → Segurança → Verificação em duas etapas → Ativar
2. Senhas de app → Gerar senha de 16 caracteres
3. Usar essa senha em `SMTP_PASS` no `.env.local`
