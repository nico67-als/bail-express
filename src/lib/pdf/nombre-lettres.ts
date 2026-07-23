const UNITES = [
  '',
  'un',
  'deux',
  'trois',
  'quatre',
  'cinq',
  'six',
  'sept',
  'huit',
  'neuf',
]

const DIX_A_SEIZE: Record<number, string> = {
  10: 'dix',
  11: 'onze',
  12: 'douze',
  13: 'treize',
  14: 'quatorze',
  15: 'quinze',
  16: 'seize',
}

const NOMS_DIZAINE: Record<number, string> = {
  2: 'vingt',
  3: 'trente',
  4: 'quarante',
  5: 'cinquante',
  6: 'soixante',
  8: 'quatre-vingt',
}

/** Nombre de 0 à 99 en toutes lettres, orthographe traditionnelle (sans tirets généralisés). */
function dizaine(n: number): string {
  if (n < 10) return UNITES[n]
  if (n <= 16) return DIX_A_SEIZE[n]
  if (n < 20) return `dix-${UNITES[n - 10]}`

  const d = Math.floor(n / 10)
  const u = n % 10

  // 70-79 et 90-99 se construisent sur la base de dix à dix-neuf.
  if (d === 7 || d === 9) {
    const base = d === 7 ? 'soixante' : 'quatre-vingt'
    if (u === 0) return `${base}-dix`
    if (u === 1 && d === 7) return `${base}-et-onze`
    return `${base}-${dizaine(10 + u)}`
  }

  // Seul « quatre-vingts » prend un s, et seulement s'il n'est suivi de rien.
  if (d === 8) {
    if (u === 0) return 'quatre-vingts'
    return `quatre-vingt-${UNITES[u]}`
  }

  const base = NOMS_DIZAINE[d]
  if (u === 0) return base
  if (u === 1) return `${base}-et-un`
  return `${base}-${UNITES[u]}`
}

/** Nombre de 0 à 999 en toutes lettres. */
function centaine(n: number): string {
  const c = Math.floor(n / 100)
  const reste = n % 100

  let mots = ''
  if (c > 0) {
    mots = c === 1 ? 'cent' : `${UNITES[c]} cent`
    if (reste === 0 && c > 1) mots += 's'
  }

  const suffixe = dizaine(reste)
  if (suffixe) mots += (mots ? ' ' : '') + suffixe

  return mots
}

/**
 * Convertit un montant en toutes lettres pour les clauses financières du bail
 * (article 1326 du Code civil : les baux mentionnent traditionnellement les montants
 * en chiffres et en lettres). Ne gère que les entiers positifs, largement suffisant pour
 * des loyers et dépôts de garantie.
 */
export function nombreEnLettres(valeur: number): string {
  const n = Math.round(Math.abs(valeur))
  if (n === 0) return 'zéro'

  const millions = Math.floor(n / 1_000_000)
  const milliers = Math.floor((n % 1_000_000) / 1000)
  const reste = n % 1000

  const parties = [
    millions > 0 ? `${millions === 1 ? 'un million' : `${centaine(millions)} millions`}` : '',
    milliers > 0 ? `${milliers === 1 ? 'mille' : `${centaine(milliers)} mille`}` : '',
    centaine(reste),
  ].filter(Boolean)

  return parties.join(' ')
}
