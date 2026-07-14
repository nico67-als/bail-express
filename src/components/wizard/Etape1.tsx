'use client'

import RadioGroup from '@/components/ui/RadioGroup'
import { useWizardStore } from '@/store/wizard-store'
import type { TypeBail, UsageBail } from '@/types'

const TYPES_BAIL = [
  {
    value: 'meuble' as TypeBail,
    label: 'Location meublée',
    description:
      'Bail d’1 an (9 mois pour un étudiant), dépôt de garantie jusqu’à 2 mois. Inventaire du mobilier obligatoire.',
  },
  {
    value: 'vide' as TypeBail,
    label: 'Location vide',
    description:
      'Bail de 3 ans, dépôt de garantie limité à 1 mois. Pas d’inventaire à fournir.',
  },
]

export default function Etape1() {
  const etape1 = useWizardStore((state) => state.data.etape1)
  const updateData = useWizardStore((state) => state.updateData)

  // Le bail étudiant de 9 mois n'existe qu'en meublé : en location vide, la seule
  // option est la résidence principale, et un usage « étudiant » déjà coché est effacé.
  const usages = [
    {
      value: 'residence_principale' as UsageBail,
      label: 'Résidence principale',
      description: 'Le logement est la résidence principale du locataire.',
    },
    ...(etape1.typeBail === 'meuble'
      ? [
          {
            value: 'etudiant' as UsageBail,
            label: 'Bail étudiant',
            description: 'Durée réduite à 9 mois, non reconductible tacitement.',
          },
        ]
      : []),
  ]

  const setTypeBail = (typeBail: TypeBail) => {
    const usage =
      typeBail === 'vide' && etape1.usage === 'etudiant' ? '' : etape1.usage

    updateData({ etape1: { ...etape1, typeBail, usage } })
  }

  return (
    <>
      <RadioGroup
        label="Quel type de location mettez-vous en place ?"
        required
        options={TYPES_BAIL}
        value={etape1.typeBail}
        onChange={setTypeBail}
      />

      <RadioGroup
        label="Quel est l’usage du logement ?"
        required
        options={usages}
        value={etape1.usage}
        onChange={(usage) => updateData({ etape1: { ...etape1, usage } })}
        hint={
          etape1.typeBail === ''
            ? 'Choisissez d’abord le type de location.'
            : undefined
        }
      />
    </>
  )
}
