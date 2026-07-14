import type { PeriodeConstruction } from '@/types'

// Le CREP (diagnostic plomb) n'est obligatoire que pour un permis de construire
// antérieur au 1er janvier 1949. Le diagnostic amiante (DTA) l'est pour un permis
// antérieur au 1er juillet 1997 ; en l'absence d'une borne à 1997 dans nos tranches,
// on assimile « après 1989 » à « après 1997 » — approximation à recouper avec la
// validation juridique différée (voir CLAUDE.md).
export function diagnosticPlombRequis(periode: PeriodeConstruction): boolean {
  return periode === 'avant_1949'
}

export function diagnosticAmianteRequis(periode: PeriodeConstruction): boolean {
  return periode === 'avant_1949' || periode === '1949_1974' || periode === '1975_1989'
}
