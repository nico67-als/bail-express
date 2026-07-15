'use client'

import Checkbox from '@/components/ui/Checkbox'
import Input from '@/components/ui/Input'
import RadioGroup from '@/components/ui/RadioGroup'
import Select from '@/components/ui/Select'
import { useWizardStore } from '@/store/wizard-store'
import { depotGarantieMax, forfaitChargesAutorise } from '@/lib/financier'
import type { Etape5 as Etape5Data, TypeCharges } from '@/types'

const TRIMESTRES = [
  { value: 'T1', label: '1er trimestre' },
  { value: 'T2', label: '2e trimestre' },
  { value: 'T3', label: '3e trimestre' },
  { value: 'T4', label: '4e trimestre' },
]

function parseNombre(valeur: string): number | '' {
  if (valeur === '') return ''
  const n = Number(valeur)
  return Number.isFinite(n) ? n : ''
}

export default function Etape5() {
  const typeBail = useWizardStore((state) => state.data.etape1.typeBail)
  const etape5 = useWizardStore((state) => state.data.etape5)
  const updateData = useWizardStore((state) => state.updateData)

  const maj = (updates: Partial<Etape5Data>) => {
    updateData({ etape5: { ...etape5, ...updates } })
  }

  const plafondDG = depotGarantieMax(typeBail, etape5.loyerHC)
  const dgDepasse =
    plafondDG !== null && etape5.depotGarantie !== '' && etape5.depotGarantie > plafondDG

  const optionsCharges: { value: TypeCharges; label: string; description: string }[] = [
    {
      value: 'provision',
      label: 'Provision avec régularisation',
      description: 'Le solde est ajusté chaque année sur justificatifs.',
    },
    ...(forfaitChargesAutorise(typeBail)
      ? [
          {
            value: 'forfait' as const,
            label: 'Forfait',
            description: 'Montant fixe non régularisable — réservé à la location meublée.',
          },
        ]
      : []),
  ]

  const complementRenseigne = etape5.complementLoyer !== '' && etape5.complementLoyer > 0

  return (
    <>
      <Input
        label="Date d'entrée dans les lieux"
        type="date"
        required
        value={etape5.dateEntree}
        onChange={(e) => maj({ dateEntree: e.target.value })}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Loyer mensuel hors charges (€)"
          type="number"
          min={0}
          required
          value={etape5.loyerHC}
          onChange={(e) => maj({ loyerHC: parseNombre(e.target.value) })}
        />
        <Input
          label="Dépôt de garantie (€)"
          type="number"
          min={0}
          required
          value={etape5.depotGarantie}
          onChange={(e) => maj({ depotGarantie: parseNombre(e.target.value) })}
          error={
            dgDepasse
              ? `Plafond légal dépassé : ${
                  typeBail === 'meuble' ? 'deux mois' : 'un mois'
                } de loyer maximum, soit ${plafondDG} €.`
              : undefined
          }
        />
      </div>

      <RadioGroup
        label="Type de charges"
        required
        direction="ligne"
        options={optionsCharges}
        value={etape5.typeCharges}
        onChange={(typeCharges) => maj({ typeCharges })}
      />

      <Input
        label="Montant des charges (€ / mois)"
        type="number"
        min={0}
        required
        value={etape5.montantCharges}
        onChange={(e) => maj({ montantCharges: parseNombre(e.target.value) })}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Date de paiement du loyer"
          placeholder="Ex. le 1er de chaque mois"
          required
          value={etape5.datePaiement}
          onChange={(e) => maj({ datePaiement: e.target.value })}
        />
        <Input
          label="Mode de paiement"
          placeholder="Virement, prélèvement…"
          required
          value={etape5.modePaiement}
          onChange={(e) => maj({ modePaiement: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-4">
        <Checkbox
          label="Le loyer sera révisé annuellement (indexation IRL)"
          checked={etape5.revisionIRL}
          onChange={(revisionIRL) =>
            maj({ revisionIRL, trimestreIRL: revisionIRL ? etape5.trimestreIRL : '' })
          }
        />
        {etape5.revisionIRL && (
          <Select
            label="Trimestre de référence IRL"
            required
            options={TRIMESTRES}
            value={etape5.trimestreIRL}
            onChange={(e) => maj({ trimestreIRL: e.target.value })}
          />
        )}

        <Checkbox
          label="Le logement est situé en zone tendue"
          checked={etape5.zoneTendue}
          onChange={(zoneTendue) =>
            maj(
              zoneTendue
                ? { zoneTendue }
                : {
                    zoneTendue,
                    loyerReferenceMajore: '',
                    complementLoyer: '',
                    motifComplement: '',
                  }
            )
          }
        />
        {etape5.zoneTendue && (
          <>
            <Input
              label="Loyer de référence majoré (€)"
              type="number"
              min={0}
              required
              value={etape5.loyerReferenceMajore}
              onChange={(e) =>
                maj({ loyerReferenceMajore: parseNombre(e.target.value) })
              }
              hint="Indiqué par l'observatoire local des loyers, en zone tendue."
            />
            <Input
              label="Complément de loyer (€)"
              type="number"
              min={0}
              value={etape5.complementLoyer}
              onChange={(e) => maj({ complementLoyer: parseNombre(e.target.value) })}
              hint="Uniquement si le logement présente des caractéristiques exceptionnelles."
            />
            {complementRenseigne && (
              <Input
                label="Motif du complément de loyer"
                required
                value={etape5.motifComplement}
                onChange={(e) => maj({ motifComplement: e.target.value })}
              />
            )}
          </>
        )}
      </div>
    </>
  )
}
