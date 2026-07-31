'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import WizardLayout from '@/components/wizard/WizardLayout'
import Etape1 from '@/components/wizard/Etape1'
import Etape2 from '@/components/wizard/Etape2'
import Etape3 from '@/components/wizard/Etape3'
import Etape4 from '@/components/wizard/Etape4'
import Etape5 from '@/components/wizard/Etape5'
import Etape6 from '@/components/wizard/Etape6'
import Etape7 from '@/components/wizard/Etape7'
import Etape8 from '@/components/wizard/Etape8'
import { useWizardStore } from '@/store/wizard-store'
import { etapeSuivante, etapeValide } from '@/lib/etapes'

/**
 * Le store est persisté dans le localStorage : il est déjà réhydraté au premier rendu
 * client, alors que le HTML rendu côté serveur part d'un formulaire vide. On attend donc
 * la fin de l'hydratation avant d'afficher le wizard, sans quoi React signale une erreur
 * d'hydratation et repart d'un état vide — les saisies en cours seraient perdues.
 */
/**
 * Raccourci de test (`?dev=1`) : évite de retaper les 7 étapes à chaque tentative de
 * paiement. Génère un dossier meublé valide puis saute directement au récapitulatif.
 */
function remplirDonneesTest() {
  const { updateData, syncPieces, setEtape } = useWizardStore.getState()

  updateData({
    etape1: { typeBail: 'meuble', usage: 'residence_principale' },
    etape2: {
      bailleur: {
        type: 'physique',
        civilite: 'M',
        nom: 'Dupont',
        prenom: 'Jean',
        dateNaissance: '1980-05-12',
        lieuNaissance: 'Paris',
        nationalite: 'Française',
        adresse: '10 rue de la Paix, 75002 Paris',
      },
      email: 'nicolas.grasser06@gmail.com',
      telephone: '0612345678',
    },
    etape3: {
      locataires: [
        {
          civilite: 'Mme',
          nom: 'Martin',
          prenom: 'Claire',
          dateNaissance: '1990-03-20',
          lieuNaissance: 'Lyon',
          nationalite: 'Française',
          adresseActuelle: '5 avenue Victor Hugo, 69000 Lyon',
          email: 'locataire-test@example.com',
        },
      ],
    },
    etape4: {
      adresse: '20 rue du Test, 75010 Paris',
      complement: '',
      typeLogement: 'Appartement',
      etage: '3e étage',
      surface: 45,
      nbPieces: 3,
      nbChambres: 1,
      periodeConstruction: 'apres_1989',
      regimeJuridique: 'copropriete',
      chauffage: 'Individuel électrique',
      eauChaude: 'Individuel électrique',
      cave: false,
      caveNum: '',
      parking: false,
      parkingNum: '',
      jardin: false,
      dpeClasse: 'C',
      gesClasse: 'C',
      presencePlomb: null,
      presenceAmiante: null,
    },
    etape5: {
      dateEntree: '2026-09-01',
      loyerHC: 800,
      typeCharges: 'provision',
      montantCharges: 80,
      datePaiement: '1',
      modePaiement: 'Virement bancaire',
      depotGarantie: 1600,
      revisionIRL: true,
      trimestreIRL: 'T1',
      zoneTendue: false,
      loyerReferenceMajore: '',
      complementLoyer: '',
      motifComplement: '',
    },
  })

  // Les pièces de l'inventaire (étape 6) et de l'état des lieux (étape 7) dépendent du
  // nombre de pièces/chambres qu'on vient de fixer : on les régénère avant de les remplir.
  syncPieces()

  const { data } = useWizardStore.getState()

  updateData({
    etape6: {
      pieces: data.etape6.pieces.map((piece) => ({
        ...piece,
        meubles: Object.fromEntries(
          Object.entries(piece.meubles).map(([label, meuble]) => [
            label,
            { ...meuble, present: true, etat: 'bon' as const },
          ])
        ),
      })),
    },
    etape7: {
      ...data.etape7,
      dateEdl: '2026-09-01',
      nbCles: 2,
      compteurElecIndex: '12345',
      compteurEauFroideIndex: '6789',
      pieces: data.etape7.pieces.map((piece) => ({
        ...piece,
        plafond: { etat: 'bon' as const, obs: '' },
        murs: { etat: 'bon' as const, obs: '' },
        sol: { etat: 'bon' as const, obs: '' },
        fenetres: { etat: 'bon' as const, obs: '' },
        volets: { etat: 'bon' as const, obs: '' },
        porte: { etat: 'bon' as const, obs: '' },
        elec: { etat: 'bon' as const, obs: '' },
        chauffage: { etat: 'bon' as const, obs: '' },
        luminaire: { etat: 'bon' as const, obs: '' },
      })),
    },
  })

  setEtape(8)
}

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

  const [paiementEnCours, setPaiementEnCours] = useState(false)
  const [erreurPaiement, setErreurPaiement] = useState<string | null>(null)
  const [modeDev, setModeDev] = useState(false)

  useEffect(() => {
    setModeDev(new URLSearchParams(window.location.search).get('dev') === '1')
  }, [])

  if (!monte) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-24 text-center text-gray-400">
          Chargement…
        </div>
      </div>
    )
  }

  const derniereEtape = etapeCourante === 8

  const procederAuPaiement = async () => {
    setPaiementEnCours(true)
    setErreurPaiement(null)

    try {
      const reponse = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const resultat = await reponse.json()

      if (!reponse.ok) {
        setErreurPaiement(resultat.erreur ?? 'Une erreur est survenue.')
        setPaiementEnCours(false)
        return
      }

      // La redirection quitte la page : pas besoin de repasser paiementEnCours à false.
      window.location.href = resultat.url
    } catch {
      setErreurPaiement('Impossible de contacter le serveur de paiement.')
      setPaiementEnCours(false)
    }
  }

  const allerSuivant = () => {
    if (derniereEtape) {
      procederAuPaiement()
      return
    }

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
    8: <Etape8 />,
  }

  const contenu = ETAPES_RENDUES[etapeCourante] ?? (
    <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
      Cette étape n’est pas encore développée.
    </p>
  )

  const bloque = derniereEtape ? paiementEnCours : !etapeValide(etapeCourante, data)

  return (
    <WizardLayout
      onSuivant={allerSuivant}
      suivantDisabled={bloque}
      suivantLabel={derniereEtape ? (paiementEnCours ? 'Redirection…' : 'Procéder au paiement') : 'Continuer'}
    >
      {erreurPaiement && (
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{erreurPaiement}</p>
      )}
      {modeDev && (
        <button
          type="button"
          onClick={remplirDonneesTest}
          className="mb-4 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50"
        >
          🧪 Remplir avec des données de test
        </button>
      )}
      {contenu}
    </WizardLayout>
  )
}
