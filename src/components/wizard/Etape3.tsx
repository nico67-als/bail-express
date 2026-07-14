'use client'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import RadioGroup from '@/components/ui/RadioGroup'
import { useWizardStore } from '@/store/wizard-store'
import type { Locataire } from '@/types'

const LOCATAIRE_VIDE: Locataire = {
  civilite: '',
  nom: '',
  prenom: '',
  dateNaissance: '',
  lieuNaissance: '',
  nationalite: 'Française',
  adresseActuelle: '',
  email: '',
}

export default function Etape3() {
  const locataires = useWizardStore((state) => state.data.etape3.locataires)
  const updateData = useWizardStore((state) => state.updateData)

  const setLocataires = (locataires: Locataire[]) => {
    updateData({ etape3: { locataires } })
  }

  const majLocataire = (index: number, updates: Partial<Locataire>) => {
    setLocataires(
      locataires.map((locataire, i) =>
        i === index ? { ...locataire, ...updates } : locataire
      )
    )
  }

  const ajouter = () => setLocataires([...locataires, { ...LOCATAIRE_VIDE }])

  const retirer = (index: number) =>
    setLocataires(locataires.filter((_, i) => i !== index))

  return (
    <>
      {locataires.map((locataire, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">
              Locataire {index + 1}
            </h2>
            {locataires.length > 1 && (
              <button
                type="button"
                onClick={() => retirer(index)}
                className="text-sm font-medium text-red-600 hover:text-red-700"
              >
                Retirer
              </button>
            )}
          </div>

          <RadioGroup
            label="Civilité"
            required
            direction="ligne"
            options={[
              { value: 'M' as const, label: 'Monsieur' },
              { value: 'Mme' as const, label: 'Madame' },
            ]}
            value={locataire.civilite}
            onChange={(civilite) => majLocataire(index, { civilite })}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Nom"
              required
              value={locataire.nom}
              onChange={(e) => majLocataire(index, { nom: e.target.value })}
            />
            <Input
              label="Prénom"
              required
              value={locataire.prenom}
              onChange={(e) => majLocataire(index, { prenom: e.target.value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Date de naissance"
              type="date"
              required
              value={locataire.dateNaissance}
              onChange={(e) =>
                majLocataire(index, { dateNaissance: e.target.value })
              }
            />
            <Input
              label="Lieu de naissance"
              required
              value={locataire.lieuNaissance}
              onChange={(e) =>
                majLocataire(index, { lieuNaissance: e.target.value })
              }
            />
          </div>

          <Input
            label="Nationalité"
            required
            value={locataire.nationalite}
            onChange={(e) => majLocataire(index, { nationalite: e.target.value })}
          />

          <Input
            label="Adresse actuelle"
            required
            value={locataire.adresseActuelle}
            onChange={(e) =>
              majLocataire(index, { adresseActuelle: e.target.value })
            }
          />

          <Input
            label="Email"
            type="email"
            required
            value={locataire.email}
            onChange={(e) => majLocataire(index, { email: e.target.value })}
          />
        </div>
      ))}

      <Button variant="outline" onClick={ajouter} className="self-start">
        + Ajouter un locataire
      </Button>
    </>
  )
}
