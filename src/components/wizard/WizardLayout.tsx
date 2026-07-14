'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Stepper from '@/components/ui/Stepper'
import { useWizardStore } from '@/store/wizard-store'
import { etapeDef, etapePrecedente, etapesVisibles } from '@/lib/etapes'

export interface WizardLayoutProps {
  children: ReactNode
  /** Bloque le passage à l'étape suivante tant que la saisie est incomplète. */
  suivantDisabled?: boolean
  suivantLabel?: string
  onSuivant: () => void
}

export default function WizardLayout({
  children,
  suivantDisabled,
  suivantLabel = 'Continuer',
  onSuivant,
}: WizardLayoutProps) {
  const etapeCourante = useWizardStore((state) => state.etapeCourante)
  const typeBail = useWizardStore((state) => state.data.etape1.typeBail)
  const setEtape = useWizardStore((state) => state.setEtape)

  const etapes = etapesVisibles(typeBail)
  const definition = etapeDef(etapeCourante)
  const precedente = etapePrecedente(etapeCourante, typeBail)

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <header className="mx-auto max-w-3xl px-4 py-6">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          Bail Express
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-24">
        <div className="mb-8">
          <Stepper etapes={etapes} courante={etapeCourante} onNaviguer={setEtape} />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">{definition.titre}</h1>
          {definition.sousTitre && (
            <p className="mt-2 text-gray-500">{definition.sousTitre}</p>
          )}

          <div className="mt-8 flex flex-col gap-6">{children}</div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          {precedente ? (
            <Button variant="outline" onClick={() => setEtape(precedente)}>
              ← Retour
            </Button>
          ) : (
            <span />
          )}

          <Button onClick={onSuivant} disabled={suivantDisabled}>
            {suivantLabel}
          </Button>
        </div>
      </main>
    </div>
  )
}
