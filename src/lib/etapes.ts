import type { EtapeNum, TypeBail } from '@/types'

export interface EtapeDef {
  numero: EtapeNum
  titre: string
  /** Libellé court, pour le fil de progression. */
  courte: string
  sousTitre?: string
}

export const ETAPES: EtapeDef[] = [
  {
    numero: 1,
    titre: 'Type de bail',
    courte: 'Bail',
    sousTitre: 'Le type de location détermine les documents et les règles applicables.',
  },
  {
    numero: 2,
    titre: 'Vous, le bailleur',
    courte: 'Bailleur',
    sousTitre: 'Ces informations figureront en tête du bail.',
  },
  {
    numero: 3,
    titre: 'Le ou les locataires',
    courte: 'Locataires',
    sousTitre: 'Ajoutez chaque personne signataire du bail.',
  },
  {
    numero: 4,
    titre: 'Le logement',
    courte: 'Logement',
    sousTitre:
      'Le nombre de pièces déclaré ici génère les sections de l’état des lieux et de l’inventaire.',
  },
  {
    numero: 5,
    titre: 'Conditions financières',
    courte: 'Loyer',
    sousTitre: 'Loyer, charges, dépôt de garantie et révision.',
  },
  {
    numero: 6,
    titre: 'Inventaire des meubles',
    courte: 'Inventaire',
    sousTitre: 'Obligatoire en location meublée : le mobilier fourni, pièce par pièce.',
  },
  {
    numero: 7,
    titre: 'État des lieux d’entrée',
    courte: 'État des lieux',
    sousTitre: 'Compteurs, clés, puis l’état de chaque pièce.',
  },
  {
    numero: 8,
    titre: 'Récapitulatif',
    courte: 'Récapitulatif',
    sousTitre: 'Vérifiez vos informations avant de générer vos documents.',
  },
]

/**
 * L'inventaire (étape 6) n'existe qu'en meublé : en location vide il est purement
 * et simplement retiré du parcours, y compris du fil de progression.
 */
export function etapesVisibles(typeBail: TypeBail | ''): EtapeDef[] {
  return ETAPES.filter((etape) => etape.numero !== 6 || typeBail === 'meuble')
}

export function etapeDef(numero: EtapeNum): EtapeDef {
  return ETAPES[numero - 1]
}

/** Étape suivante dans le parcours, en sautant les étapes masquées. Null si on est à la fin. */
export function etapeSuivante(
  courante: EtapeNum,
  typeBail: TypeBail | ''
): EtapeNum | null {
  const visibles = etapesVisibles(typeBail)
  const index = visibles.findIndex((etape) => etape.numero === courante)
  return visibles[index + 1]?.numero ?? null
}

/** Étape précédente dans le parcours. Null si on est au début. */
export function etapePrecedente(
  courante: EtapeNum,
  typeBail: TypeBail | ''
): EtapeNum | null {
  const visibles = etapesVisibles(typeBail)
  const index = visibles.findIndex((etape) => etape.numero === courante)
  return index <= 0 ? null : visibles[index - 1].numero
}
