import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WizardData, EtapeNum } from '@/types'

interface WizardStore {
  etapeCourante: EtapeNum
  data: WizardData
  setEtape: (etape: EtapeNum) => void
  updateData: (updates: Partial<WizardData>) => void
  reset: () => void
}

const initialData: WizardData = {
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
    dpéClasse: '',
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

export const useWizardStore = create<WizardStore>()(
  persist(
    (set) => ({
      etapeCourante: 1,
      data: initialData,
      setEtape: (etape) => set({ etapeCourante: etape }),
      updateData: (updates) =>
        set((state) => ({ data: { ...state.data, ...updates } })),
      reset: () => set({ etapeCourante: 1, data: initialData }),
    }),
    {
      name: 'bail-express-wizard',
    }
  )
)
