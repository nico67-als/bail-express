'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { useWizardStore } from '@/store/wizard-store'
import { MEUBLES_PAR_CATEGORIE, meublesObligatoiresManquants } from '@/lib/pieces'
import type { EtatMeuble, InventairePiece } from '@/types'

const ETATS = [
  { value: 'bon', label: 'Bon état' },
  { value: 'usage', label: 'Signes d’usage' },
  { value: 'degrade', label: 'Dégradé' },
]

export default function Etape6() {
  const pieces = useWizardStore((state) => state.data.etape6.pieces)
  const updateData = useWizardStore((state) => state.updateData)
  const [nouveauMeuble, setNouveauMeuble] = useState<Record<number, string>>({})

  const setPieces = (pieces: InventairePiece[]) => updateData({ etape6: { pieces } })

  const majMeuble = (indexPiece: number, label: string, updates: Partial<EtatMeuble>) => {
    setPieces(
      pieces.map((piece, i) =>
        i !== indexPiece
          ? piece
          : {
              ...piece,
              meubles: {
                ...piece.meubles,
                [label]: { ...piece.meubles[label], ...updates },
              },
            }
      )
    )
  }

  const ajouterMeuble = (indexPiece: number) => {
    const label = (nouveauMeuble[indexPiece] ?? '').trim()
    if (!label || pieces[indexPiece].meubles[label]) return

    setPieces(
      pieces.map((piece, i) =>
        i !== indexPiece
          ? piece
          : {
              ...piece,
              meubles: {
                ...piece.meubles,
                [label]: { present: true, etat: '', observations: '' },
              },
            }
      )
    )
    setNouveauMeuble((etat) => ({ ...etat, [indexPiece]: '' }))
  }

  const retirerMeuble = (indexPiece: number, label: string) => {
    setPieces(
      pieces.map((piece, i) => {
        if (i !== indexPiece) return piece
        const meubles = { ...piece.meubles }
        delete meubles[label]
        return { ...piece, meubles }
      })
    )
  }

  const manquants = meublesObligatoiresManquants(pieces)

  return (
    <>
      {manquants.length > 0 && (
        <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-semibold">
            Meubles obligatoires non fournis (décret n° 2015-981) :
          </p>
          <ul className="mt-1 list-inside list-disc">
            {manquants.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-2">
            Sans ces éléments, le logement risque d’être requalifié en location vide.
          </p>
        </div>
      )}

      {pieces.map((piece, indexPiece) => {
        const labelsConnus = new Set(
          MEUBLES_PAR_CATEGORIE[piece.categorie].map((meuble) => meuble.label)
        )
        const estPersonnalise = (label: string) => !labelsConnus.has(label)

        return (
          <div
            key={`${indexPiece}-${piece.nom}`}
            className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4"
          >
            <h2 className="font-semibold text-gray-900">{piece.nom}</h2>

            <div className="flex flex-col gap-3">
              {Object.entries(piece.meubles).map(([label, meuble]) => (
                <div key={label} className="rounded-lg border border-gray-100 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <Checkbox
                      label={label}
                      checked={meuble.present}
                      onChange={(present) => majMeuble(indexPiece, label, { present })}
                    />
                    {estPersonnalise(label) && (
                      <button
                        type="button"
                        onClick={() => retirerMeuble(indexPiece, label)}
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        Retirer
                      </button>
                    )}
                  </div>

                  {meuble.present && (
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <Select
                        label="État"
                        required
                        options={ETATS}
                        value={meuble.etat}
                        onChange={(e) =>
                          majMeuble(indexPiece, label, {
                            etat: e.target.value as EtatMeuble['etat'],
                          })
                        }
                      />
                      <Input
                        label="Observations"
                        value={meuble.observations}
                        onChange={(e) =>
                          majMeuble(indexPiece, label, { observations: e.target.value })
                        }
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-end gap-3">
              <Input
                label="Ajouter un meuble"
                placeholder="Ex. Lave-linge"
                value={nouveauMeuble[indexPiece] ?? ''}
                onChange={(e) =>
                  setNouveauMeuble((etat) => ({ ...etat, [indexPiece]: e.target.value }))
                }
              />
              <Button variant="outline" onClick={() => ajouterMeuble(indexPiece)}>
                Ajouter
              </Button>
            </div>
          </div>
        )
      })}
    </>
  )
}
