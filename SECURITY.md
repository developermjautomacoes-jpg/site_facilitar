# Security Policy — Facilitar Serviços Contábeis

## Proteções Implementadas

| Proteção | Implementação |
|----------|---------------|
| Security Headers | X-Frame-Options DENY, HSTS, CSP, X-Content-Type via next.config.ts |
| Rate Limiting | 10 req/min por IP em /api/contact |
| Honeypot | Campo oculto `website` para detectar bots |
| Sanitização | sanitize-html em todos os campos antes de salvar/enviar |
| Validação | Zod no client e no server-side |
| Variáveis sensíveis | Somente em .env.local (nunca commitado) |

## Boas Práticas

- Nunca commitar `.env.local`
- Usar senha de app (não a senha principal) para Gmail SMTP
- Manter dependências atualizadas: `npm audit` regularmente
- No VPS: configurar Nginx com rate limiting adicional
