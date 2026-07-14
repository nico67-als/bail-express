import type {
  CategoriePiece,
  EtatElement,
  EtatMeuble,
  EtatPiece,
  InventairePiece,
} from '@/types'

export type { CategoriePiece }

export interface PieceGeneree {
  nom: string
  categorie: CategoriePiece
}

export interface MeubleReference {
  label: string
  /** Exigé par le décret n° 2015-981 (liste des meubles d'une location meublée). */
  obligatoire: boolean
}

/**
 * Meubles proposés par défaut selon le type de pièce.
 *
 * Le décret impose ses 11 éléments à l'échelle du logement, pas de la pièce : chaque
 * élément n'est donc marqué `obligatoire` que sur la pièce où il est attendu (la literie
 * dans les chambres, les plaques de cuisson dans la cuisine), et reste facultatif ailleurs.
 */
export const MEUBLES_PAR_CATEGORIE: Record<CategoriePiece, MeubleReference[]> = {
  entree: [
    { label: 'Luminaires', obligatoire: false },
    { label: 'Étagères de rangement', obligatoire: false },
  ],
  sejour: [
    { label: 'Table et sièges', obligatoire: true },
    { label: 'Étagères de rangement', obligatoire: true },
    { label: 'Luminaires', obligatoire: true },
    { label: 'Canapé ou assise', obligatoire: false },
    { label: 'Dispositif d’occultation des fenêtres', obligatoire: false },
  ],
  chambre: [
    { label: 'Literie avec couette ou couverture', obligatoire: true },
    { label: 'Dispositif d’occultation des fenêtres', obligatoire: true },
    { label: 'Armoire ou penderie', obligatoire: false },
    { label: 'Table de chevet', obligatoire: false },
    { label: 'Étagères de rangement', obligatoire: false },
    { label: 'Luminaires', obligatoire: false },
  ],
  cuisine: [
    { label: 'Plaques de cuisson', obligatoire: true },
    { label: 'Four ou four à micro-ondes', obligatoire: true },
    { label: 'Réfrigérateur', obligatoire: true },
    { label: 'Congélateur ou compartiment à -6 °C minimum', obligatoire: true },
    { label: 'Vaisselle nécessaire à la prise des repas', obligatoire: true },
    { label: 'Ustensiles de cuisine', obligatoire: true },
    { label: 'Matériel d’entretien ménager', obligatoire: true },
    { label: 'Table et sièges', obligatoire: false },
    { label: 'Étagères de rangement', obligatoire: false },
    { label: 'Luminaires', obligatoire: false },
    { label: 'Hotte aspirante', obligatoire: false },
  ],
  salle_de_bain: [
    { label: 'Luminaires', obligatoire: false },
    { label: 'Étagères de rangement', obligatoire: false },
    { label: 'Miroir', obligatoire: false },
  ],
  wc: [],
  autre: [
    { label: 'Luminaires', obligatoire: false },
    { label: 'Étagères de rangement', obligatoire: false },
  ],
}

function nombre(valeur: number | ''): number {
  return typeof valeur === 'number' && Number.isFinite(valeur) ? valeur : 0
}

/**
 * Déduit la liste des pièces du logement à partir de l'étape 4.
 *
 * En France le nombre de pièces ne compte que les pièces principales (séjour + chambres) :
 * cuisine, salle de bain et WC n'y figurent pas mais doivent apparaître à l'état des lieux.
 * Un T1 (0 chambre) est un studio : sa pièce unique n'est pas un « séjour ».
 */
export function genererPieces(
  nbPieces: number | '',
  nbChambres: number | ''
): PieceGeneree[] {
  const chambres = Math.max(0, Math.trunc(nombre(nbChambres)))
  const principales = Math.max(1, Math.trunc(nombre(nbPieces)))
  const autres = Math.max(0, principales - chambres - 1)

  const pieces: PieceGeneree[] = []

  if (principales > 1) {
    pieces.push({ nom: 'Entrée', categorie: 'entree' })
  }

  pieces.push(
    chambres === 0
      ? { nom: 'Pièce principale', categorie: 'sejour' }
      : { nom: 'Séjour', categorie: 'sejour' }
  )

  for (let i = 1; i <= chambres; i++) {
    pieces.push({
      nom: chambres === 1 ? 'Chambre' : `Chambre ${i}`,
      categorie: 'chambre',
    })
  }

  for (let i = 1; i <= autres; i++) {
    pieces.push({
      nom: autres === 1 ? 'Autre pièce' : `Autre pièce ${i}`,
      categorie: 'autre',
    })
  }

  pieces.push({ nom: 'Cuisine', categorie: 'cuisine' })
  pieces.push({ nom: 'Salle de bain', categorie: 'salle_de_bain' })
  pieces.push({ nom: 'WC', categorie: 'wc' })

  return pieces
}

function elementVide() {
  return { etat: '' as EtatElement, obs: '' }
}

function etatPieceVide(nom: string): EtatPiece {
  return {
    nomPiece: nom,
    plafond: elementVide(),
    murs: elementVide(),
    sol: elementVide(),
    fenetres: elementVide(),
    volets: elementVide(),
    porte: elementVide(),
    elec: elementVide(),
    chauffage: elementVide(),
    luminaire: elementVide(),
    obsGenerales: '',
  }
}

/**
 * Recale l'état des lieux (étape 7) sur les pièces déclarées à l'étape 4, en conservant
 * ce qui a déjà été saisi pour les pièces qui subsistent. Sans ça, revenir à l'étape 4
 * pour corriger le nombre de chambres effacerait tout le travail de l'étape 7.
 */
export function synchroniserEtatDesLieux(
  generees: PieceGeneree[],
  existantes: EtatPiece[]
): EtatPiece[] {
  const parNom = new Map(existantes.map((piece) => [piece.nomPiece, piece]))
  return generees.map(({ nom }) => parNom.get(nom) ?? etatPieceVide(nom))
}

/** Même principe pour l'inventaire des meubles (étape 6, meublé uniquement). */
export function synchroniserInventaire(
  generees: PieceGeneree[],
  existantes: InventairePiece[]
): InventairePiece[] {
  const parNom = new Map(existantes.map((piece) => [piece.nom, piece]))

  return generees.map(({ nom, categorie }) => {
    const existante = parNom.get(nom)
    const meubles: Record<string, EtatMeuble> = {}

    for (const { label } of MEUBLES_PAR_CATEGORIE[categorie]) {
      meubles[label] = existante?.meubles[label] ?? {
        present: false,
        etat: '',
        observations: '',
      }
    }

    // Les meubles ajoutés à la main par le bailleur ne figurent dans aucune liste par défaut.
    for (const [label, meuble] of Object.entries(existante?.meubles ?? {})) {
      if (!(label in meubles)) {
        meubles[label] = meuble
      }
    }

    return { nom, categorie, meubles }
  })
}

/**
 * Meubles du décret laissés décochés — à afficher en garde-fou avant le paiement :
 * un meublé qui ne les fournit pas tous peut être requalifié en location vide.
 *
 * Le caractère obligatoire se lit sur le couple (catégorie de pièce, meuble), jamais sur
 * le seul libellé : « Luminaires » est exigé au séjour mais facultatif dans l'entrée.
 */
export function meublesObligatoiresManquants(pieces: InventairePiece[]): string[] {
  const manquants: string[] = []

  for (const piece of pieces) {
    for (const { label, obligatoire } of MEUBLES_PAR_CATEGORIE[piece.categorie]) {
      if (obligatoire && !piece.meubles[label]?.present) {
        manquants.push(`${piece.nom} — ${label}`)
      }
    }
  }

  return manquants
}
