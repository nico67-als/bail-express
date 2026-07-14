'use client'

import Checkbox from '@/components/ui/Checkbox'
import Input from '@/components/ui/Input'
import RadioGroup from '@/components/ui/RadioGroup'
import Select from '@/components/ui/Select'
import { useWizardStore } from '@/store/wizard-store'
import { diagnosticAmianteRequis, diagnosticPlombRequis } from '@/lib/diagnostics'
import type { Etape4 as Etape4Data, PeriodeConstruction } from '@/types'

const TYPES_LOGEMENT = [
  { value: 'Appartement', label: 'Appartement' },
  { value: 'Maison', label: 'Maison' },
  { value: 'Studio', label: 'Studio' },
  { value: 'Autre', label: 'Autre' },
]

const PERIODES: { value: PeriodeConstruction; label: string }[] = [
  { value: 'avant_1949', label: 'Avant 1949' },
  { value: '1949_1974', label: 'De 1949 à 1974' },
  { value: '1975_1989', label: 'De 1975 à 1989' },
  { value: 'apres_1989', label: 'Après 1989' },
]

const MODES_CHAUFFAGE = [
  { value: 'Individuel électrique', label: 'Individuel électrique' },
  { value: 'Individuel gaz', label: 'Individuel gaz' },
  { value: 'Individuel autre (bois, fioul, pompe à chaleur)', label: 'Individuel autre (bois, fioul, pompe à chaleur)' },
  { value: 'Collectif', label: 'Collectif' },
]

const MODES_EAU_CHAUDE = [
  { value: 'Individuel électrique', label: 'Individuel électrique' },
  { value: 'Individuel gaz', label: 'Individuel gaz' },
  { value: 'Collectif', label: 'Collectif' },
]

const CLASSES_DPE = ['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((c) => ({
  value: c,
  label: c,
}))

function parseNombre(valeur: string): number | '' {
  if (valeur === '') return ''
  const n = Number(valeur)
  return Number.isFinite(n) ? n : ''
}

function OuiNon({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean | null
  onChange: (v: boolean) => void
}) {
  return (
    <RadioGroup
      label={label}
      required
      direction="ligne"
      options={[
        { value: 'oui' as const, label: 'Oui' },
        { value: 'non' as const, label: 'Non' },
      ]}
      value={value === null ? '' : value ? 'oui' : 'non'}
      onChange={(v) => onChange(v === 'oui')}
    />
  )
}

export default function Etape4() {
  const etape4 = useWizardStore((state) => state.data.etape4)
  const updateData = useWizardStore((state) => state.updateData)

  const maj = (updates: Partial<Etape4Data>) => {
    updateData({ etape4: { ...etape4, ...updates } })
  }

  return (
    <>
      <Input
        label="Adresse du logement"
        required
        value={etape4.adresse}
        onChange={(e) => maj({ adresse: e.target.value })}
      />
      <Input
        label="Complément d'adresse"
        placeholder="Bâtiment, escalier, appartement…"
        value={etape4.complement}
        onChange={(e) => maj({ complement: e.target.value })}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Type de logement"
          required
          options={TYPES_LOGEMENT}
          value={etape4.typeLogement}
          onChange={(e) => maj({ typeLogement: e.target.value })}
        />
        <Input
          label="Étage"
          placeholder="RDC, 3e étage…"
          value={etape4.etage}
          onChange={(e) => maj({ etage: e.target.value })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Input
          label="Surface habitable (m²)"
          type="number"
          min={1}
          required
          value={etape4.surface}
          onChange={(e) => maj({ surface: parseNombre(e.target.value) })}
        />
        <Input
          label="Nombre de pièces"
          type="number"
          min={1}
          required
          value={etape4.nbPieces}
          onChange={(e) => maj({ nbPieces: parseNombre(e.target.value) })}
          hint="Séjour et chambres uniquement (cuisine, salle de bain, WC ne comptent pas)."
        />
        <Input
          label="Dont chambres"
          type="number"
          min={0}
          required
          value={etape4.nbChambres}
          onChange={(e) => maj({ nbChambres: parseNombre(e.target.value) })}
          hint="0 pour un studio."
        />
      </div>

      <Select
        label="Période de construction"
        required
        options={PERIODES}
        value={etape4.periodeConstruction}
        onChange={(e) =>
          maj({ periodeConstruction: e.target.value as PeriodeConstruction })
        }
      />

      <RadioGroup
        label="Régime juridique"
        required
        direction="ligne"
        options={[
          { value: 'copropriete' as const, label: 'Copropriété' },
          { value: 'monopropriete' as const, label: 'Monopropriété' },
        ]}
        value={etape4.regimeJuridique}
        onChange={(regimeJuridique) => maj({ regimeJuridique })}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Mode de chauffage"
          required
          options={MODES_CHAUFFAGE}
          value={etape4.chauffage}
          onChange={(e) => maj({ chauffage: e.target.value })}
        />
        <Select
          label="Production d'eau chaude"
          required
          options={MODES_EAU_CHAUDE}
          value={etape4.eauChaude}
          onChange={(e) => maj({ eauChaude: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-4">
        <Checkbox
          label="Le logement dispose d'une cave"
          checked={etape4.cave}
          onChange={(cave) => maj({ cave, caveNum: cave ? etape4.caveNum : '' })}
        />
        {etape4.cave && (
          <Input
            label="Numéro de la cave"
            value={etape4.caveNum}
            onChange={(e) => maj({ caveNum: e.target.value })}
          />
        )}

        <Checkbox
          label="Le logement dispose d'une place de parking"
          checked={etape4.parking}
          onChange={(parking) =>
            maj({ parking, parkingNum: parking ? etape4.parkingNum : '' })
          }
        />
        {etape4.parking && (
          <Input
            label="Numéro de la place"
            value={etape4.parkingNum}
            onChange={(e) => maj({ parkingNum: e.target.value })}
          />
        )}

        <Checkbox
          label="Le logement dispose d'un jardin"
          checked={etape4.jardin}
          onChange={(jardin) => maj({ jardin })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Classe DPE"
          required
          options={CLASSES_DPE}
          value={etape4.dpeClasse}
          onChange={(e) =>
            maj({ dpeClasse: e.target.value as Etape4Data['dpeClasse'] })
          }
        />
        <Select
          label="Classe GES"
          required
          options={CLASSES_DPE}
          value={etape4.gesClasse}
          onChange={(e) =>
            maj({ gesClasse: e.target.value as Etape4Data['gesClasse'] })
          }
        />
      </div>

      {diagnosticPlombRequis(etape4.periodeConstruction) && (
        <OuiNon
          label="Présence de plomb (constat CREP)"
          value={etape4.presencePlomb}
          onChange={(presencePlomb) => maj({ presencePlomb })}
        />
      )}

      {diagnosticAmianteRequis(etape4.periodeConstruction) && (
        <OuiNon
          label="Présence d'amiante (DTA)"
          value={etape4.presenceAmiante}
          onChange={(presenceAmiante) => maj({ presenceAmiante })}
        />
      )}
    </>
  )
}
