import { createElement } from 'react'
import { NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import DossierDocument from '@/lib/pdf/DossierDocument'
import { etapeValide } from '@/lib/etapes'
import type { EtapeNum, WizardData } from '@/types'

export const runtime = 'nodejs'

const ETAPES_A_VERIFIER: EtapeNum[] = [1, 2, 3, 4, 5, 6, 7]

export async function POST(request: Request) {
  const data = (await request.json()) as WizardData

  const etapeIncomplete = ETAPES_A_VERIFIER.find((etape) => !etapeValide(etape, data))
  if (etapeIncomplete) {
    return NextResponse.json(
      { erreur: `Étape ${etapeIncomplete} incomplète : impossible de générer les documents.` },
      { status: 400 }
    )
  }

  // DossierDocument est un composant wrapper : son type d'élément React ne correspond
  // pas exactement à ReactElement<DocumentProps> attendu par renderToBuffer (qui n'est
  // pas exporté publiquement par @react-pdf/renderer pour être importé ici).
  const document = createElement(DossierDocument, { data }) as unknown as Parameters<
    typeof renderToBuffer
  >[0]
  const buffer = await renderToBuffer(document)

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="bail-express-dossier.pdf"',
    },
  })
}
