import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY manquante dans les variables d\'environnement')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'noreply@bail-express.fr'
export const REPLY_TO_EMAIL = process.env.RESEND_REPLY_TO_EMAIL ?? 'contact@bail-express.fr'
