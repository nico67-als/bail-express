'use client'

import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import { useWizardStore } from '@/store/wizard-store'
import type { EtatElement, EtatPiece, Etape7 as Etape7Data } from '@/types'

const ETATS = [
  { value: 'bon', label: 'Bon état' },
  { value: 'usage', label: 'Signes d’usage' },
  { value: 'degrade', label: 'Dégradé' },
]

type CleElement =
  | 'plafond'
  | 'murs'
  | 'sol'
  | 'fenetres'
  | 'volets'
  | 'porte'
  | 'elec'
  | 'chauffage'
  | 'luminaire'

const ELEMENTS: { cle: CleElement; label: string }[] = [
  { cle: 'plafond', label: 'Plafond' },
  { cle: 'murs', label: 'Murs' },
  { cle: 'sol', label: 'Sol' },
  { cle: 'fenetres', label: 'Fenêtres' },
  { cle: 'volets', label: 'Volets' },
  { cle: 'porte', label: 'Porte' },
  { cle: 'elec', label: 'Installation électrique' },
  { cle: 'chauffage', label: 'Chauffage' },
  { cle: 'luminaire', label: 'Luminaires' },
]

function parseNombre(valeur: string): number | '' {
  if (valeur === '') return ''
  const n = Number(valeur)
  return Number.isFinite(n) ? n : ''
}

export default function Etape7() {
  const etape7 = useWizardStore((state) => state.data.etape7)
  const updateData = useWizardStore((state) => state.updateData)

  const maj = (updates: Partial<Etape7Data>) =>
    updateData({ etape7: { ...etape7, ...updates } })

  const majPiece = (index: number, updates: Partial<EtatPiece>) => {
    maj({
      pieces: etape7.pieces.map((piece, i) =>
        i === index ? { ...piece, ...updates } : piece
      ),
    })
  }

  const majElement = (
    index: number,
    cle: CleElement,
    updates: Partial<{ etat: EtatElement; obs: string }>
  ) => {
    const piece = etape7.pieces[index]
    majPiece(index, { [cle]: { ...piece[cle], ...updates } })
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <Input
          label="Date de l'état des lieux"
          type="date"
          required
          value={etape7.dateEdl}
          onChange={(e) => maj({ dateEdl: e.target.value })}
        />
        <Input
          label="Nombre de clés remises"
          type="number"
          min={0}
          required
          value={etape7.nbCles}
          onChange={(e) => maj({ nbCles: parseNombre(e.target.value) })}
        />
        <Input
          label="Nombre de badges / télécommandes"
          type="number"
          min={0}
          value={etape7.nbBadges}
          onChange={(e) => maj({ nbBadges: parseNombre(e.target.value) })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Compteur électrique — index"
            value={etape7.compteurElecIndex}
            onChange={(e) => maj({ compteurElecIndex: e.target.value })}
          />
          <Input
            label="Compteur électrique — référence"
            value={etape7.compteurElecRef}
            onChange={(e) => maj({ compteurElecRef: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Compteur gaz — index"
            value={etape7.compteurGazIndex}
            onChange={(e) => maj({ compteurGazIndex: e.target.value })}
          />
          <Input
            label="Compteur gaz — référence"
            value={etape7.compteurGazRef}
            onChange={(e) => maj({ compteurGazRef: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Compteur eau froide — index"
            value={etape7.compteurEauFroideIndex}
            onChange={(e) => maj({ compteurEauFroideIndex: e.target.value })}
          />
          <Input
            label="Compteur eau froide — référence"
            value={etape7.compteurEauFroideRef}
            onChange={(e) => maj({ compteurEauFroideRef: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Compteur eau chaude — index"
            value={etape7.compteurEauChaudeIndex}
            onChange={(e) => maj({ compteurEauChaudeIndex: e.target.value })}
          />
          <Input
            label="Compteur eau chaude — référence"
            value={etape7.compteurEauChaudeRef}
            onChange={(e) => maj({ compteurEauChaudeRef: e.target.value })}
          />
        </div>
      </div>

      {etape7.pieces.map((piece, index) => (
        <div
          key={`${index}-${piece.nomPiece}`}
          className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4"
        >
          <h2 className="font-semibold text-gray-900">{piece.nomPiece}</h2>

          <div className="flex flex-col gap-3">
            {ELEMENTS.map(({ cle, label }) => (
              <div key={cle} className="grid gap-3 sm:grid-cols-2">
                <Select
                  label={label}
                  required
                  options={ETATS}
                  value={piece[cle].etat}
                  onChange={(e) =>
                    majElement(index, cle, { etat: e.target.value as EtatElement })
                  }
                />
                <Input
                  label="Observations"
                  value={piece[cle].obs}
                  onChange={(e) => majElement(index, cle, { obs: e.target.value })}
                />
              </div>
            ))}
          </div>

          <Textarea
            label="Observations générales sur la pièce"
            value={piece.obsGenerales}
            onChange={(e) => majPiece(index, { obsGenerales: e.target.value })}
          />
        </div>
      ))}

      <Textarea
        label="Observations générales sur le logement"
        value={etape7.obsGenerales}
        onChange={(e) => maj({ obsGenerales: e.target.value })}
      />
      <Textarea
        label="Réserves du locataire"
        hint="À remplir si le locataire signale un désaccord sur l’état constaté."
        value={etape7.reservesLocataire}
        onChange={(e) => maj({ reservesLocataire: e.target.value })}
      />
    </>
  )
}
