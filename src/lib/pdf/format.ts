const MOIS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
]

/** "2026-09-01" -> "1er septembre 2026" (format habituel des actes juridiques français). */
export function formatDateLongue(iso: string): string {
  if (!iso) return '...................'
  const [annee, mois, jour] = iso.split('-').map(Number)
  const quantieme = jour === 1 ? '1er' : String(jour)
  return `${quantieme} ${MOIS[mois - 1]} ${annee}`
}

/** "2026-09-01" -> "01/09/2026" */
export function formatDateCourte(iso: string): string {
  if (!iso) return '__/__/____'
  const [annee, mois, jour] = iso.split('-')
  return `${jour}/${mois}/${annee}`
}

export function ajouterMois(iso: string, mois: number): string {
  const [annee, m, jour] = iso.split('-').map(Number)
  const date = new Date(Date.UTC(annee, m - 1 + mois, jour))
  return date.toISOString().slice(0, 10)
}

export function formatEuros(valeur: number | ''): string {
  return valeur === '' ? '.....' : `${valeur} €`
}

const TRIMESTRES: Record<string, string> = {
  T1: '1er trimestre',
  T2: '2e trimestre',
  T3: '3e trimestre',
  T4: '4e trimestre',
}

export function formatTrimestre(trimestre: string): string {
  return TRIMESTRES[trimestre] ?? trimestre
}

/** "M" -> "M." (Monsieur abrégé prend un point ; "Mme" reste inchangé). */
export function formatCivilite(civilite: string): string {
  return civilite === 'M' ? 'M.' : civilite
}
