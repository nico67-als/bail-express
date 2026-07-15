import type { TypeBail } from '@/types'

// Article 22 de la loi du 6 juillet 1989 : le dépôt de garantie est plafonné à un mois
// de loyer hors charges en location vide, deux mois en location meublée.
export function depotGarantieMax(
  typeBail: TypeBail | '',
  loyerHC: number | ''
): number | null {
  if (loyerHC === '' || typeBail === '') return null
  return typeBail === 'meuble' ? loyerHC * 2 : loyerHC
}

// Article 23 : le forfait de charges (montant fixe, non régularisable) n'est autorisé
// qu'en location meublée. En location vide, seule la provision avec régularisation
// annuelle sur justificatifs est permise.
export function forfaitChargesAutorise(typeBail: TypeBail | ''): boolean {
  return typeBail === 'meuble'
}
