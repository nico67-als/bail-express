import { randomUUID } from 'crypto'
import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { stripe, PRIX } from '@/lib/stripe'
import { premiereEtapeInvalide } from '@/lib/etapes'
import type { WizardData } from '@/types'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const data = (await request.json()) as WizardData

  const etapeIncomplete = premiereEtapeInvalide(data)
  if (etapeIncomplete) {
    return NextResponse.json(
      { erreur: `Étape ${etapeIncomplete} incomplète : impossible de procéder au paiement.` },
      { status: 400 }
    )
  }

  const { typeBail } = data.etape1
  if (typeBail === '') {
    return NextResponse.json({ erreur: 'Type de bail manquant.' }, { status: 400 })
  }

  // Le webhook (déclenché après paiement, potentiellement sans navigateur ouvert) n'a pas
  // accès au localStorage du client : les données du wizard sont donc stockées à part le
  // temps du paiement, en accès privé puisqu'elles contiennent des données personnelles.
  const { url: wizardDataUrl } = await put(
    `wizard-payloads/${randomUUID()}.json`,
    JSON.stringify(data),
    { access: 'private', contentType: 'application/json' }
  )

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: PRIX[typeBail], quantity: 1 }],
    customer_email: data.etape2.email,
    success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/wizard`,
    metadata: { wizardDataUrl, typeBail },
  })

  if (!session.url) {
    return NextResponse.json(
      { erreur: 'Impossible de créer la session de paiement.' },
      { status: 502 }
    )
  }

  return NextResponse.json({ url: session.url })
}
