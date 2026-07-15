'use client'

import { useSyncExternalStore } from 'react'
import WizardLayout from '@/components/wizard/WizardLayout'
import Etape1 from '@/components/wizard/Etape1'
import Etape2 from '@/components/wizard/Etape2'
import Etape3 from '@/components/wizard/Etape3'
import Etape4 from '@/components/wizard/Etape4'
import Etape5 from '@/components/wizard/Etape5'
import Etape6 from '@/components/wizard/Etape6'
import Etape7 from '@/components/wizard/Etape7'
import { useWizardStore } from '@/store/wizard-store'
import { etapeSuivante, etapeValide } from '@/lib/etapes'

/**
 * Le store est persisté dans le localStorage : il est déjà réhydraté au premier rendu
 * client, alors que le HTML rendu côté serveur part d'un formulaire vide. On attend donc
 * la fin de l'hydratation avant d'afficher le wizard, sans quoi React signale une erreur
 * d'hydratation et repart d'un état vide — les saisies en cours seraient perdues.
 */
function useHydrate(): boolean {
  return useSyncExternalStore(
    (onChange) => useWizardStore.persist.onFinishHydration(onChange),
    () => useWizardStore.persist.hasHydrated(),
    () => false
  )
}

export default function WizardPage() {
  const monte = useHydrate()

  const etapeCourante = useWizardStore((state) => state.etapeCourante)
  const data = useWizardStore((state) => state.data)
  const setEtape = useWizardStore((state) => state.setEtape)
  const syncPieces = useWizardStore((state) => state.syncPieces)

  if (!monte) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-24 text-center text-gray-400">
          Chargement…
        </div>
      </div>
    )
  }

  const allerSuivant = () => {
    // Le type de bail et le nombre de pièces conditionnent les étapes 6 et 7 :
    // on recale les pièces à chaque avancée plutôt que de dépendre d'un seul écran.
    syncPieces()

    const suivante = etapeSuivante(etapeCourante, data.etape1.typeBail)
    if (suivante) setEtape(suivante)
  }

  const ETAPES_RENDUES: Partial<Record<number, React.ReactNode>> = {
    1: <Etape1 />,
    2: <Etape2 />,
    3: <Etape3 />,
    4: <Etape4 />,
    5: <Etape5 />,
    6: <Etape6 />,
    7: <Etape7 />,
  }

  const contenu = ETAPES_RENDUES[etapeCourante] ?? (
    <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
      Cette étape n’est pas encore développée.
    </p>
  )

  const bloque = !etapeValide(etapeCourante, data)

  return (
    <WizardLayout onSuivant={allerSuivant} suivantDisabled={bloque}>
      {contenu}
    </WizardLayout>
  )
}
