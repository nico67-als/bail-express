import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY manquante dans les variables d\'environnement')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
})

export const PRIX = {
  meuble: process.env.STRIPE_PRICE_ID_MEUBLE!,
  vide: process.env.STRIPE_PRICE_ID_VIDE!,
} as const
