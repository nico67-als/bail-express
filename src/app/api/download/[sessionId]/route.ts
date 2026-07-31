import { NextResponse } from 'next/server'
import { get } from '@vercel/blob'
import { stripe } from '@/lib/stripe'

export const runtime = 'nodejs'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params

  let session
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId)
  } catch {
    return NextResponse.json({ erreur: 'Session de paiement introuvable.' }, { status: 404 })
  }

  if (session.payment_status !== 'paid') {
    return NextResponse.json({ erreur: 'Paiement non confirmé.' }, { status: 403 })
  }

  const blob = await get(`dossiers/${sessionId}.pdf`, { access: 'private' })
  if (!blob || blob.statusCode !== 200) {
    return NextResponse.json({ erreur: 'Document introuvable.' }, { status: 404 })
  }

  return new NextResponse(blob.stream, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="bail-express-dossier.pdf"',
      'Cache-Control': 'private, no-store',
    },
  })
}
