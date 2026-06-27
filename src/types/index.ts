// ============================================================
// Types du wizard Bail Express
// ============================================================

export type TypeBail = 'meuble' | 'vide'
export type UsageBail = 'residence_principale' | 'etudiant'
export type TypeBailleur = 'physique' | 'morale'
export type TypeCharges = 'forfait' | 'provision'
export type EtatElement = 'bon' | 'usage' | 'degrade' | ''

// --- Étape 1 ---
export interface Etape1 {
  typeBail: TypeBail | ''
  usage: UsageBail | ''
}

// --- Étape 2 : Bailleur ---
export interface BailleurPhysique {
  type: 'physique'
  civilite: 'M' | 'Mme' | ''
  nom: string
  prenom: string
  dateNaissance: string
  lieuNaissance: string
  nationalite: string
  adresse: string
}

export interface BailleurMoral {
  type: 'morale'
  raisonSociale: string
  formeJuridique: string
  siret: string
  representant: string
  qualite: string
  adresseSiege: string
}

export type Bailleur = BailleurPhysique | BailleurMoral

export interface Etape2 {
  bailleur: Bailleur
  email: string
  telephone: string
}

// --- Étape 3 : Locataire(s) ---
export interface Locataire {
  civilite: 'M' | 'Mme' | ''
  nom: string
  prenom: string
  dateNaissance: string
  lieuNaissance: string
  nationalite: string
  adresseActuelle: string
  email: string
}

export interface Etape3 {
  locataires: Locataire[]
}

// --- Étape 4 : Logement ---
export type PeriodeConstruction = 'avant_1949' | '1949_1974' | '1975_1989' | 'apres_1989' | ''
export type RegimeJuridique = 'copropriete' | 'monopropriete' | ''
export type ClasseDPE = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | ''

export interface Etape4 {
  adresse: string
  complement: string
  typeLogement: string
  etage: string
  surface: number | ''
  nbPieces: number | ''
  nbChambres: number | ''
  periodeConstruction: PeriodeConstruction
  regimeJuridique: RegimeJuridique
  chauffage: string
  eauChaude: string
  cave: boolean
  caveNum: string
  parking: boolean
  parkingNum: string
  jardin: boolean
  dpéClasse: ClasseDPE
  gesClasse: ClasseDPE
  presencePlomb: boolean | null
  presenceAmiante: boolean | null
}

// --- Étape 5 : Conditions financières ---
export interface Etape5 {
  dateEntree: string
  loyerHC: number | ''
  typeCharges: TypeCharges | ''
  montantCharges: number | ''
  datePaiement: string
  modePaiement: string
  depotGarantie: number | ''
  revisionIRL: boolean
  trimestreIRL: string
  zoneTendue: boolean
  loyerReferenceMajore: number | ''
  complementLoyer: number | ''
  motifComplement: string
}

// --- Étape 6 : Inventaire des meubles (meublé uniquement) ---
export interface EtatMeuble {
  present: boolean
  etat: EtatElement
  observations: string
}

export interface InventairePiece {
  nom: string
  meubles: Record<string, EtatMeuble>
}

export interface Etape6 {
  pieces: InventairePiece[]
}

// --- Étape 7 : État des lieux ---
export interface EtatPiece {
  nomPiece: string
  plafond: { etat: EtatElement; obs: string }
  murs: { etat: EtatElement; obs: string }
  sol: { etat: EtatElement; obs: string }
  fenetres: { etat: EtatElement; obs: string }
  volets: { etat: EtatElement; obs: string }
  porte: { etat: EtatElement; obs: string }
  elec: { etat: EtatElement; obs: string }
  chauffage: { etat: EtatElement; obs: string }
  luminaire: { etat: EtatElement; obs: string }
  obsGenerales: string
}

export interface Etape7 {
  dateEdl: string
  nbCles: number | ''
  nbBadges: number | ''
  compteurElecIndex: string
  compteurElecRef: string
  compteurGazIndex: string
  compteurGazRef: string
  compteurEauFroideIndex: string
  compteurEauFroideRef: string
  compteurEauChaudeIndex: string
  compteurEauChaudeRef: string
  pieces: EtatPiece[]
  obsGenerales: string
  reservesLocataire: string
}

// --- État global du wizard ---
export interface WizardData {
  etape1: Etape1
  etape2: Etape2
  etape3: Etape3
  etape4: Etape4
  etape5: Etape5
  etape6: Etape6
  etape7: Etape7
}

export type EtapeNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
