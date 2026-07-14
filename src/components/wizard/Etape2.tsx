'use client'

import Input from '@/components/ui/Input'
import RadioGroup from '@/components/ui/RadioGroup'
import { useWizardStore } from '@/store/wizard-store'
import type { BailleurMoral, BailleurPhysique, TypeBailleur } from '@/types'

const BAILLEUR_PHYSIQUE_VIDE: BailleurPhysique = {
  type: 'physique',
  civilite: '',
  nom: '',
  prenom: '',
  dateNaissance: '',
  lieuNaissance: '',
  nationalite: 'Française',
  adresse: '',
}

const BAILLEUR_MORAL_VIDE: BailleurMoral = {
  type: 'morale',
  raisonSociale: '',
  formeJuridique: '',
  siret: '',
  representant: '',
  qualite: '',
  adresseSiege: '',
}

export default function Etape2() {
  const etape2 = useWizardStore((state) => state.data.etape2)
  const updateData = useWizardStore((state) => state.updateData)
  const { bailleur } = etape2

  const setType = (type: TypeBailleur) => {
    updateData({
      etape2: {
        ...etape2,
        bailleur: type === 'physique' ? BAILLEUR_PHYSIQUE_VIDE : BAILLEUR_MORAL_VIDE,
      },
    })
  }

  // Deux fonctions plutôt qu'une seule typée en intersection : Bailleur est une union
  // discriminée par `type`, donc Partial<BailleurPhysique & BailleurMoral> forcerait
  // chaque champ à `never`. Chacune n'est appelée que dans la branche correspondante.
  const majPhysique = (updates: Partial<BailleurPhysique>) => {
    if (bailleur.type !== 'physique') return
    updateData({ etape2: { ...etape2, bailleur: { ...bailleur, ...updates } } })
  }

  const majMoral = (updates: Partial<BailleurMoral>) => {
    if (bailleur.type !== 'morale') return
    updateData({ etape2: { ...etape2, bailleur: { ...bailleur, ...updates } } })
  }

  return (
    <>
      <RadioGroup
        label="Vous louez en tant que"
        required
        direction="ligne"
        options={[
          { value: 'physique' as TypeBailleur, label: 'Particulier' },
          { value: 'morale' as TypeBailleur, label: 'Société (SCI, etc.)' },
        ]}
        value={bailleur.type}
        onChange={setType}
      />

      {bailleur.type === 'physique' ? (
        <>
          <RadioGroup
            label="Civilité"
            required
            direction="ligne"
            options={[
              { value: 'M' as const, label: 'Monsieur' },
              { value: 'Mme' as const, label: 'Madame' },
            ]}
            value={bailleur.civilite}
            onChange={(civilite) => majPhysique({ civilite })}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Nom"
              required
              value={bailleur.nom}
              onChange={(e) => majPhysique({ nom: e.target.value })}
            />
            <Input
              label="Prénom"
              required
              value={bailleur.prenom}
              onChange={(e) => majPhysique({ prenom: e.target.value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Date de naissance"
              type="date"
              required
              value={bailleur.dateNaissance}
              onChange={(e) => majPhysique({ dateNaissance: e.target.value })}
            />
            <Input
              label="Lieu de naissance"
              required
              value={bailleur.lieuNaissance}
              onChange={(e) => majPhysique({ lieuNaissance: e.target.value })}
            />
          </div>

          <Input
            label="Nationalité"
            required
            value={bailleur.nationalite}
            onChange={(e) => majPhysique({ nationalite: e.target.value })}
          />

          <Input
            label="Adresse"
            required
            value={bailleur.adresse}
            onChange={(e) => majPhysique({ adresse: e.target.value })}
          />
        </>
      ) : (
        <>
          <Input
            label="Raison sociale"
            required
            value={bailleur.raisonSociale}
            onChange={(e) => majMoral({ raisonSociale: e.target.value })}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Forme juridique"
              placeholder="SCI, SARL…"
              required
              value={bailleur.formeJuridique}
              onChange={(e) => majMoral({ formeJuridique: e.target.value })}
            />
            <Input
              label="SIRET"
              required
              inputMode="numeric"
              maxLength={14}
              value={bailleur.siret}
              onChange={(e) => majMoral({ siret: e.target.value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Représentant légal"
              required
              value={bailleur.representant}
              onChange={(e) => majMoral({ representant: e.target.value })}
            />
            <Input
              label="Qualité du représentant"
              placeholder="Gérant, président…"
              required
              value={bailleur.qualite}
              onChange={(e) => majMoral({ qualite: e.target.value })}
            />
          </div>

          <Input
            label="Adresse du siège social"
            required
            value={bailleur.adresseSiege}
            onChange={(e) => majMoral({ adresseSiege: e.target.value })}
          />
        </>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Email"
          type="email"
          required
          value={etape2.email}
          onChange={(e) => updateData({ etape2: { ...etape2, email: e.target.value } })}
          hint="Vos documents seront envoyés à cette adresse."
        />
        <Input
          label="Téléphone"
          type="tel"
          required
          value={etape2.telephone}
          onChange={(e) =>
            updateData({ etape2: { ...etape2, telephone: e.target.value } })
          }
        />
      </div>
    </>
  )
}
