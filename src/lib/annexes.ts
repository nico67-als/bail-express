import { diagnosticAmianteRequis, diagnosticPlombRequis } from '@/lib/diagnostics'
import type { WizardData } from '@/types'

export function rappelAnnexes(data: WizardData): string {
  const { periodeConstruction } = data.etape4

  const diagnostics = ['le Diagnostic de Performance Énergétique (DPE)', "l'État des Risques et Pollutions (ERP)"]

  if (diagnosticPlombRequis(periodeConstruction)) {
    diagnostics.push("le Constat de Risque d'Exposition au Plomb (CREP), logement construit avant 1949")
  }

  if (diagnosticAmianteRequis(periodeConstruction)) {
    diagnostics.push('le diagnostic amiante, logement dont le permis de construire est antérieur à 1997')
  }

  diagnostics.push(
    "le diagnostic électricité et/ou gaz si l'installation correspondante a plus de 15 ans",
    "l'état des nuisances sonores aériennes (ENSA) si le logement est situé en zone d'exposition au bruit d'un aéroport"
  )

  const liste = diagnostics.map((d) => `- ${d}`).join('\n')

  return [
    "Avant de faire signer le bail, pensez à joindre les diagnostics obligatoires suivants (réalisés par un diagnostiqueur certifié) selon la situation de votre logement :",
    liste,
    "La notice d'information obligatoire est téléchargeable gratuitement sur service-public.fr.",
  ].join('\n')
}
