import { z } from 'zod'

export const contactSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  empresa: z.string().max(100).optional(),
  email: z.string().email('E-mail inválido'),
  whatsapp: z.string().min(10, 'WhatsApp inválido').max(20),
  assunto: z.string().min(3, 'Assunto muito curto').max(100),
  mensagem: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres').max(2000),
  website: z.string().max(0, 'Campo inválido'),
})

export type ContactFormData = z.infer<typeof contactSchema>
