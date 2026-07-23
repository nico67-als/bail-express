'use client'

import type { ReactNode } from 'react'
import type { EtapeNum, EtatPiece } from '@/types'
import { useWizardStore } from '@/store/wizard-store'
import { diagnosticAmianteRequis, diagnosticPlombRequis } from '@/lib/diagnostics'

const TYPE_BAIL_LABELS: Record<string, string> = {
  meuble: 'Location meublée',
  vide: 'Location vide',
}

const USAGE_LABELS: Record<string, string> = {
  residence_principale: 'Résidence principale',
  etudiant: 'Bail étudiant',
}

const PERIODE_LABELS: Record<string, string> = {
  avant_1949: 'Avant 1949',
  '1949_1974': 'De 1949 à 1974',
  '1975_1989': 'De 1975 à 1989',
  apres_1989: 'Après 1989',
}

const ETAT_LABELS: Record<string, string> = {
  bon: 'bon état',
  usage: 'signes d’usage',
  degrade: 'dégradé',
}

type CleElementEdl =
  | 'plafond'
  | 'murs'
  | 'sol'
  | 'fenetres'
  | 'volets'
  | 'porte'
  | 'elec'
  | 'chauffage'
  | 'luminaire'

const ELEMENTS_EDL: { cle: CleElementEdl; label: string }[] = [
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

function formatDate(iso: string): string {
  if (!iso) return '—'
  const [annee, mois, jour] = iso.split('-')
  return `${jour}/${mois}/${annee}`
}

function formatEuros(valeur: number | ''): string {
  return valeur === '' ? '—' : `${valeur} €`
}

function resumeEtatPiece(piece: EtatPiece): string {
  const renseignes = ELEMENTS_EDL.filter(({ cle }) => piece[cle].etat)
  if (renseignes.length === 0) return 'Non renseigné'
  return renseignes
    .map(({ cle, label }) => `${label} : ${ETAT_LABELS[piece[cle].etat] ?? '—'}`)
    .join(' · ')
}

function Section({
  titre,
  etape,
  onModifier,
  children,
}: {
  titre: string
  etape: EtapeNum
  onModifier: (etape: EtapeNum) => void
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">{titre}</h2>
        <button
          type="button"
          onClick={() => onModifier(etape)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          Modifier
        </button>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}

function Ligne({ label, valeur }: { label: string; valeur: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-medium text-gray-900">{valeur}</span>
    </div>
  )
}

export default function Etape8() {
  const data = useWizardStore((state) => state.data)
  const setEtape = useWizardStore((state) => state.setEtape)
  const { etape1, etape2, etape3, etape4, etape5, etape6, etape7 } = data
  const { bailleur } = etape2

  return (
    <>
      <Section titre="Type de location" etape={1} onModifier={setEtape}>
        <Ligne label="Type de bail" valeur={TYPE_BAIL_LABELS[etape1.typeBail] ?? '—'} />
        <Ligne label="Usage" valeur={USAGE_LABELS[etape1.usage] ?? '—'} />
      </Section>

      <Section titre="Bailleur" etape={2} onModifier={setEtape}>
        {bailleur.type === 'physique' ? (
          <>
            <Ligne
              label="Identité"
              valeur={`${bailleur.civilite} ${bailleur.prenom} ${bailleur.nom}`}
            />
            <Ligne
              label="Naissance"
              valeur={`${formatDate(bailleur.dateNaissance)} à ${bailleur.lieuNaissance}`}
            />
            <Ligne label="Nationalité" valeur={bailleur.nationalite} />
            <Ligne label="Adresse" valeur={bailleur.adresse} />
          </>
        ) : (
          <>
            <Ligne
              label="Société"
              valeur={`${bailleur.raisonSociale} (${bailleur.formeJuridique})`}
            />
            <Ligne label="SIRET" valeur={bailleur.siret} />
            <Ligne
              label="Représentant"
              valeur={`${bailleur.representant} — ${bailleur.qualite}`}
            />
            <Ligne label="Siège social" valeur={bailleur.adresseSiege} />
          </>
        )}
        <Ligne label="Email" valeur={etape2.email} />
        <Ligne label="Téléphone" valeur={etape2.telephone} />
      </Section>

      <Section
        titre={etape3.locataires.length > 1 ? 'Locataires' : 'Locataire'}
        etape={3}
        onModifier={setEtape}
      >
        {etape3.locataires.map((locataire, index) => (
          <div
            key={index}
            className={
              index > 0
                ? 'flex flex-col gap-2 border-t border-gray-100 pt-3'
                : 'flex flex-col gap-2'
            }
          >
            <Ligne
              label="Identité"
              valeur={`${locataire.civilite} ${locataire.prenom} ${locataire.nom}`}
            />
            <Ligne
              label="Naissance"
              valeur={`${formatDate(locataire.dateNaissance)} à ${locataire.lieuNaissance}`}
            />
            <Ligne label="Nationalité" valeur={locataire.nationalite} />
            <Ligne label="Adresse actuelle" valeur={locataire.adresseActuelle} />
            <Ligne label="Email" valeur={locataire.email} />
          </div>
        ))}
      </Section>

      <Section titre="Logement" etape={4} onModifier={setEtape}>
        <Ligne
          label="Adresse"
          valeur={
            etape4.complement ? `${etape4.adresse} — ${etape4.complement}` : etape4.adresse
          }
        />
        <Ligne
          label="Type"
          valeur={etape4.etage ? `${etape4.typeLogement} — ${etape4.etage}` : etape4.typeLogement}
        />
        <Ligne label="Surface" valeur={`${etape4.surface} m²`} />
        <Ligne
          label="Pièces"
          valeur={`${etape4.nbPieces} (dont ${etape4.nbChambres} chambre${
            Number(etape4.nbChambres) > 1 ? 's' : ''
          })`}
        />
        <Ligne
          label="Construction"
          valeur={PERIODE_LABELS[etape4.periodeConstruction] ?? '—'}
        />
        <Ligne
          label="Régime juridique"
          valeur={etape4.regimeJuridique === 'copropriete' ? 'Copropriété' : 'Monopropriété'}
        />
        <Ligne label="Chauffage" valeur={etape4.chauffage} />
        <Ligne label="Eau chaude" valeur={etape4.eauChaude} />
        <Ligne
          label="Annexes"
          valeur={
            [
              etape4.cave && `Cave${etape4.caveNum ? ` n°${etape4.caveNum}` : ''}`,
              etape4.parking && `Parking${etape4.parkingNum ? ` n°${etape4.parkingNum}` : ''}`,
              etape4.jardin && 'Jardin',
            ]
              .filter(Boolean)
              .join(', ') || 'Aucune'
          }
        />
        <Ligne label="DPE / GES" valeur={`${etape4.dpeClasse} / ${etape4.gesClasse}`} />
        {diagnosticPlombRequis(etape4.periodeConstruction) && (
          <Ligne
            label="Plomb (CREP)"
            valeur={etape4.presencePlomb ? 'Présence constatée' : 'Absence constatée'}
          />
        )}
        {diagnosticAmianteRequis(etape4.periodeConstruction) && (
          <Ligne
            label="Amiante (DTA)"
            valeur={etape4.presenceAmiante ? 'Présence constatée' : 'Absence constatée'}
          />
        )}
      </Section>

      <Section titre="Conditions financières" etape={5} onModifier={setEtape}>
        <Ligne label="Entrée dans les lieux" valeur={formatDate(etape5.dateEntree)} />
        <Ligne label="Loyer hors charges" valeur={formatEuros(etape5.loyerHC)} />
        <Ligne
          label="Charges"
          valeur={`${formatEuros(etape5.montantCharges)} (${
            etape5.typeCharges === 'forfait' ? 'forfait' : 'provision avec régularisation'
          })`}
        />
        <Ligne label="Date de paiement" valeur={etape5.datePaiement} />
        <Ligne label="Mode de paiement" valeur={etape5.modePaiement} />
        <Ligne label="Dépôt de garantie" valeur={formatEuros(etape5.depotGarantie)} />
        <Ligne
          label="Révision IRL"
          valeur={etape5.revisionIRL ? `Oui — ${etape5.trimestreIRL}` : 'Non'}
        />
        {etape5.zoneTendue && (
          <>
            <Ligne
              label="Zone tendue"
              valeur={`Loyer de référence majoré : ${formatEuros(etape5.loyerReferenceMajore)}`}
            />
            {etape5.complementLoyer !== '' && etape5.complementLoyer > 0 && (
              <Ligne
                label="Complément de loyer"
                valeur={`${formatEuros(etape5.complementLoyer)} — ${etape5.motifComplement}`}
              />
            )}
          </>
        )}
      </Section>

      {etape1.typeBail === 'meuble' && (
        <Section titre="Inventaire des meubles" etape={6} onModifier={setEtape}>
          {etape6.pieces.map((piece, index) => {
            const presents = Object.entries(piece.meubles).filter(([, m]) => m.present)
            return (
              <Ligne
                key={index}
                label={piece.nom}
                valeur={
                  presents.length > 0
                    ? presents
                        .map(([label, m]) => `${label} (${ETAT_LABELS[m.etat] ?? '—'})`)
                        .join(', ')
                    : 'Aucun meuble déclaré'
                }
              />
            )
          })}
        </Section>
      )}

      <Section titre="État des lieux d'entrée" etape={7} onModifier={setEtape}>
        <Ligne label="Date" valeur={formatDate(etape7.dateEdl)} />
        <Ligne
          label="Clés / badges"
          valeur={`${etape7.nbCles} clé(s)${
            etape7.nbBadges !== '' ? `, ${etape7.nbBadges} badge(s)` : ''
          }`}
        />
        <Ligne
          label="Compteurs"
          valeur={
            [
              etape7.compteurElecIndex && `Élec. ${etape7.compteurElecIndex}`,
              etape7.compteurGazIndex && `Gaz ${etape7.compteurGazIndex}`,
              etape7.compteurEauFroideIndex && `Eau froide ${etape7.compteurEauFroideIndex}`,
              etape7.compteurEauChaudeIndex && `Eau chaude ${etape7.compteurEauChaudeIndex}`,
            ]
              .filter(Boolean)
              .join(' · ') || 'Non renseignés'
          }
        />
        {etape7.pieces.map((piece, index) => (
          <Ligne key={index} label={piece.nomPiece} valeur={resumeEtatPiece(piece)} />
        ))}
      </Section>

      <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
        La génération des documents et le paiement seront disponibles prochainement. Vos
        données restent enregistrées dans ce navigateur.
      </div>
    </>
  )
}
