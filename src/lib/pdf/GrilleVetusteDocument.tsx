import { Page, Text, View } from '@react-pdf/renderer'
import type { WizardData } from '@/types'
import { styles } from './styles'

/**
 * Grille de vétusté générique (usage courant, non imposée par la loi — contrairement au
 * bail et à l'état des lieux, ce document relève d'un usage contractuel entre les parties).
 * Durées de vie et abattements repris des grilles habituellement utilisées par les
 * professionnels de l'immobilier (référence : grille ANIL). À adapter au cas par cas.
 */
const CATEGORIES: {
  categorie: string
  elements: { nom: string; franchiseAns: number; abattementAnnuel: string; dureeVie: string }[]
}[] = [
  {
    categorie: 'Revêtements muraux et peintures',
    elements: [
      { nom: 'Peinture', franchiseAns: 1, abattementAnnuel: '10 %', dureeVie: '10 ans' },
      { nom: 'Papier peint', franchiseAns: 1, abattementAnnuel: '10 %', dureeVie: '10 ans' },
      { nom: 'Faïence murale', franchiseAns: 3, abattementAnnuel: '5 %', dureeVie: '20 ans' },
    ],
  },
  {
    categorie: 'Sols',
    elements: [
      { nom: 'Moquette / sol souple', franchiseAns: 1, abattementAnnuel: '10 %', dureeVie: '10 ans' },
      { nom: 'Parquet vitrifié', franchiseAns: 2, abattementAnnuel: '5 %', dureeVie: '20 ans' },
      { nom: 'Carrelage', franchiseAns: 5, abattementAnnuel: '3 %', dureeVie: '30 ans' },
    ],
  },
  {
    categorie: 'Équipements sanitaires',
    elements: [
      { nom: 'Robinetterie', franchiseAns: 2, abattementAnnuel: '10 %', dureeVie: '10 ans' },
      { nom: 'Appareils sanitaires (baignoire, lavabo, WC)', franchiseAns: 5, abattementAnnuel: '5 %', dureeVie: '20 ans' },
    ],
  },
  {
    categorie: 'Menuiseries',
    elements: [
      { nom: 'Volets / stores', franchiseAns: 3, abattementAnnuel: '5 %', dureeVie: '20 ans' },
      { nom: 'Portes intérieures', franchiseAns: 5, abattementAnnuel: '5 %', dureeVie: '20 ans' },
    ],
  },
  {
    categorie: 'Mobilier et électroménager (location meublée)',
    elements: [
      { nom: 'Literie', franchiseAns: 1, abattementAnnuel: '10 %', dureeVie: '10 ans' },
      { nom: 'Mobilier en bois', franchiseAns: 2, abattementAnnuel: '10 %', dureeVie: '10 ans' },
      { nom: 'Électroménager (four, réfrigérateur, lave-linge…)', franchiseAns: 1, abattementAnnuel: '10 %', dureeVie: '10 ans' },
    ],
  },
]

export default function GrilleVetusteDocument({ data }: { data: WizardData }) {
  const { etape4 } = data

  return (
    <Page size="A4" style={styles.page} wrap>
      <Text style={styles.titre}>GRILLE DE VÉTUSTÉ</Text>
      <Text style={styles.sousTitre}>Annexée au contrat de location meublée</Text>

      <View style={styles.filet} />

      <Text style={styles.ligneListe}>
        Adresse du logement : {etape4.adresse}
        {etape4.complement ? `, ${etape4.complement}` : ''}
      </Text>

      <Text style={styles.paragraphe}>
        Cette grille sert de référence pour apprécier, lors de l&apos;état des lieux de sortie, la
        part d&apos;usure normale (vétusté) qui reste à la charge du Bailleur, par opposition aux
        dégradations imputables au Locataire. Elle n&apos;est pas imposée par la loi mais relève
        d&apos;un usage contractuel accepté par les deux parties à la signature du bail.
      </Text>

      {CATEGORIES.map(({ categorie, elements }) => (
        <View key={categorie} style={styles.table}>
          <Text style={styles.h2}>{categorie}</Text>
          <View style={styles.ligneEnTete}>
            <Text style={[styles.celluleEnTete, { width: '40%' }]}>Élément</Text>
            <Text style={[styles.celluleEnTete, { width: '20%' }]}>Franchise</Text>
            <Text style={[styles.celluleEnTete, { width: '20%' }]}>Abattement annuel</Text>
            <Text style={[styles.celluleEnTete, { width: '20%' }]}>Durée de vie</Text>
          </View>
          {elements.map(({ nom, franchiseAns, abattementAnnuel, dureeVie }) => (
            <View key={nom} style={styles.ligne}>
              <Text style={[styles.cellule, { width: '40%' }]}>{nom}</Text>
              <Text style={[styles.cellule, { width: '20%' }]}>{franchiseAns} an(s)</Text>
              <Text style={[styles.cellule, { width: '20%' }]}>{abattementAnnuel}</Text>
              <Text style={[styles.cellule, { width: '20%' }]}>{dureeVie}</Text>
            </View>
          ))}
        </View>
      ))}

      <Text style={styles.petit}>
        Franchise : nombre d&apos;années pendant lesquelles aucun abattement n&apos;est appliqué.
        Abattement annuel : pourcentage déduit chaque année suivante du coût de remplacement à neuf.
      </Text>

      <Text style={styles.piedDePage}>
        Document généré par Bail Express — Grille indicative, à adapter et valider par un juriste
        avant production.
      </Text>
    </Page>
  )
}
