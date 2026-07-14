import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WizardData, EtapeNum } from '@/types'
import {
  genererPieces,
  synchroniserEtatDesLieux,
  synchroniserInventaire,
} from '@/lib/pieces'

interface WizardStore {
  etapeCourante: EtapeNum
  data: WizardData
  setEtape: (etape: EtapeNum) => void
  updateData: (updates: Partial<WizardData>) => void
  syncPieces: () => void
  reset: () => void
}

// Fonction et non constante : chaque wizard doit partir d'objets neufs. Une constante
// partagée serait corrompue durablement par la moindre mutation en place (un `push` sur
// `locataires` à l'étape 3, par exemple), et `reset()` ne remettrait plus rien à zéro.
function createInitialData(): WizardData {
  return {
    etape1: { typeBail: '', usage: '' },
    etape2: {
      bailleur: {
        type: 'physique',
        civilite: '',
        nom: '',
        prenom: '',
        dateNaissance: '',
        lieuNaissance: '',
        nationalite: 'Française',
        adresse: '',
      },
      email: '',
      telephone: '',
    },
    etape3: {
      locataires: [
        {
          civilite: '',
          nom: '',
          prenom: '',
          dateNaissance: '',
          lieuNaissance: '',
          nationalite: 'Française',
          adresseActuelle: '',
          email: '',
        },
      ],
    },
    etape4: {
      adresse: '',
      complement: '',
      typeLogement: '',
      etage: '',
      surface: '',
      nbPieces: '',
      nbChambres: '',
      periodeConstruction: '',
      regimeJuridique: '',
      chauffage: '',
      eauChaude: '',
      cave: false,
      caveNum: '',
      parking: false,
      parkingNum: '',
      jardin: false,
      dpeClasse: '',
      gesClasse: '',
      presencePlomb: null,
      presenceAmiante: null,
    },
    etape5: {
      dateEntree: '',
      loyerHC: '',
      typeCharges: '',
      montantCharges: '',
      datePaiement: '1',
      modePaiement: 'Virement bancaire',
      depotGarantie: '',
      revisionIRL: true,
      trimestreIRL: 'T1',
      zoneTendue: false,
      loyerReferenceMajore: '',
      complementLoyer: '',
      motifComplement: '',
    },
    etape6: { pieces: [] },
    etape7: {
      dateEdl: '',
      nbCles: '',
      nbBadges: '',
      compteurElecIndex: '',
      compteurElecRef: '',
      compteurGazIndex: '',
      compteurGazRef: '',
      compteurEauFroideIndex: '',
      compteurEauFroideRef: '',
      compteurEauChaudeIndex: '',
      compteurEauChaudeRef: '',
      pieces: [],
      obsGenerales: '',
      reservesLocataire: '',
    },
  }
}

export const useWizardStore = create<WizardStore>()(
  persist(
    (set) => ({
      etapeCourante: 1,
      data: createInitialData(),

      setEtape: (etape) => set({ etapeCourante: etape }),

      updateData: (updates) =>
        set((state) => ({ data: { ...state.data, ...updates } })),

      // À appeler en quittant l'étape 4 : les pièces déclarées (nb de pièces / chambres)
      // alimentent l'inventaire de l'étape 6 et l'état des lieux de l'étape 7.
      syncPieces: () =>
        set((state) => {
          const { etape1, etape4, etape6, etape7 } = state.data
          const pieces = genererPieces(etape4.nbPieces, etape4.nbChambres)

          return {
            data: {
              ...state.data,
              etape6: {
                pieces:
                  etape1.typeBail === 'meuble'
                    ? synchroniserInventaire(pieces, etape6.pieces)
                    : [],
              },
              etape7: {
                ...etape7,
                pieces: synchroniserEtatDesLieux(pieces, etape7.pieces),
              },
            },
          }
        }),

      reset: () => set({ etapeCourante: 1, data: createInitialData() }),
    }),
    {
      name: 'bail-express-wizard',
      version: 1,
      // Les saisies persistées en v0 portent l'ancienne clé `dpéClasse` et n'ont pas de
      // pièces synchronisées : on repart d'un formulaire vierge plutôt que d'un état bâtard.
      migrate: (persisted, version) => {
        if (version < 1) {
          return { etapeCourante: 1 as EtapeNum, data: createInitialData() }
        }
        return persisted as { etapeCourante: EtapeNum; data: WizardData }
      },
    }
  )
)
