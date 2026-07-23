import { Document } from '@react-pdf/renderer'
import type { WizardData } from '@/types'
import BailDocument from './BailDocument'
import EtatDesLieuxDocument from './EtatDesLieuxDocument'
import InventaireDocument from './InventaireDocument'
import GrilleVetusteDocument from './GrilleVetusteDocument'

/**
 * Assemble tous les documents du pack en un seul PDF téléchargeable : le bail, l'état des
 * lieux, et — en location meublée uniquement — l'inventaire des meubles et la grille de
 * vétusté (cf. tableau des documents générés dans CLAUDE.md).
 */
export default function DossierDocument({ data }: { data: WizardData }) {
  const meuble = data.etape1.typeBail === 'meuble'

  return (
    <Document title="Bail Express — Dossier de location">
      <BailDocument data={data} />
      <EtatDesLieuxDocument data={data} />
      {meuble && <InventaireDocument data={data} />}
      {meuble && <GrilleVetusteDocument data={data} />}
    </Document>
  )
}
