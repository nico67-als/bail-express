import Link from 'next/link'
import { stripe } from '@/lib/stripe'

async function paiementConfirme(sessionId: string | undefined): Promise<boolean> {
  if (!sessionId) return false

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return session.payment_status === 'paid'
  } catch {
    return false
  }
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams
  const paye = await paiementConfirme(session_id)

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          Bail Express
        </Link>

        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          {paye ? (
            <>
              <h1 className="text-2xl font-bold text-gray-900">Paiement confirmé</h1>
              <p className="mt-4 text-gray-600">
                Vos documents arrivent par email d&apos;ici quelques minutes, avec un lien de
                téléchargement en pièce jointe.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900">Vérification du paiement…</h1>
              <p className="mt-4 text-gray-600">
                Si vous venez de payer, vos documents arrivent par email d&apos;ici quelques
                minutes. Si le problème persiste, contactez-nous.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
