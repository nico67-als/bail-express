import { createElement } from 'react'
import { NextResponse } from 'next/server'
import { get, put } from '@vercel/blob'
import { renderToBuffer } from '@react-pdf/renderer'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { resend, FROM_EMAIL } from '@/lib/resend'
import DossierDocument from '@/lib/pdf/DossierDocument'
import type { WizardData } from '@/types'

export const runtime = 'nodejs'

async function streamVersBuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
  const morceaux: Uint8Array[] = []
  const lecteur = stream.getReader()

  for (;;) {
    const { done, value } = await lecteur.read()
    if (done) break
    if (value) morceaux.push(value)
  }

  return Buffer.concat(morceaux)
}

async function traiterPaiementReussi(session: Stripe.Checkout.Session) {
  const wizardDataUrl = session.metadata?.wizardDataUrl
  if (!wizardDataUrl) {
    throw new Error(`Session ${session.id} sans wizardDataUrl dans ses métadonnées`)
  }

  const blob = await get(wizardDataUrl, { access: 'private' })
  if (!blob || blob.statusCode !== 200) {
    throw new Error(`Données du wizard introuvables pour la session ${session.id}`)
  }

  const contenu = await streamVersBuffer(blob.stream)
  const data = JSON.parse(contenu.toString('utf-8')) as WizardData

  // DossierDocument est un composant wrapper : son type d'élément React ne correspond pas
  // exactement à ReactElement<DocumentProps> attendu par renderToBuffer (voir la même
  // remarque dans /api/generate-pdf).
  const document = createElement(DossierDocument, { data }) as unknown as Parameters<
    typeof renderToBuffer
  >[0]
  const pdf = await renderToBuffer(document)

  await put(`dossiers/${session.id}.pdf`, pdf, {
    access: 'private',
    contentType: 'application/pdf',
  })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const lienTelechargement = `${appUrl}/api/download/${session.id}`

  await resend.emails.send({
    from: FROM_EMAIL,
    to: data.etape2.email,
    subject: 'Vos documents de location — Bail Express',
    text: [
      'Bonjour,',
      '',
      'Merci pour votre commande. Vos documents sont prêts, vous les trouverez en pièce jointe et via ce lien de téléchargement :',
      lienTelechargement,
      '',
      "Avant de faire signer le bail, pensez à joindre les diagnostics obligatoires (DPE, ERP, et selon l'ancienneté du logement : CREP, amiante, électricité, gaz) que vous avez fait réaliser par un diagnostiqueur certifié.",
      '',
      "Ces documents n'ont pas fait l'objet d'une validation juridique et sont fournis à titre indicatif.",
      '',
      "L'équipe Bail Express",
    ].join('\n'),
    attachments: [{ filename: 'bail-express-dossier.pdf', content: pdf }],
  })
}

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature')
  const corps = await request.text()

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ erreur: 'Signature manquante.' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(corps, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ erreur: 'Signature invalide.' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    await traiterPaiementReussi(event.data.object)
  }

  return NextResponse.json({ recu: true })
}
