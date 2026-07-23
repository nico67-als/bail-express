import { Page, Text, View } from '@react-pdf/renderer'
import type { WizardData } from '@/types'
import { styles } from './styles'
import { formatDateLongue } from './format'
import { meublesObligatoiresManquants } from '@/lib/pieces'

const ETAT_LABELS: Record<string, string> = {
  bon: 'Bon état',
  usage: 'Usage normal',
  degrade: 'Dégradé',
  '': '—',
}

export default function InventaireDocument({ data }: { data: WizardData }) {
  const { etape4, etape6, etape7 } = data
  const manquants = meublesObligatoiresManquants(etape6.pieces)

  return (
    <Page size="A4" style={styles.page} wrap>
      <Text style={styles.titre}>INVENTAIRE ET ÉTAT DÉTAILLÉ DES MEUBLES</Text>
      <Text style={styles.sousTitre}>
        Décret n°2015-981 du 31 juillet 2015 — Liste des éléments d&apos;ameublement
      </Text>

      <View style={styles.filet} />

      <Text style={styles.ligneListe}>
        Adresse du logement : {etape4.adresse}
        {etape4.complement ? `, ${etape4.complement}` : ''}
      </Text>
      <Text style={styles.ligneListe}>Date : {formatDateLongue(etape7.dateEdl)}</Text>

      {manquants.length > 0 && (
        <View style={styles.encadre}>
          <Text style={styles.gras}>Attention — meubles obligatoires non fournis :</Text>
          {manquants.map((item) => (
            <Text key={item} style={styles.petit}>
              — {item}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.filet} />

      {etape6.pieces.map((piece, indexPiece) => {
        const meubles = Object.entries(piece.meubles)

        return (
          <View key={indexPiece} style={styles.table}>
            <Text style={styles.h2}>{piece.nom}</Text>
            <View style={styles.ligneEnTete}>
              <Text style={[styles.celluleEnTete, { width: '35%' }]}>Meuble / équipement</Text>
              <Text style={[styles.celluleEnTete, { width: '15%' }]}>Présent</Text>
              <Text style={[styles.celluleEnTete, { width: '20%' }]}>État</Text>
              <Text style={[styles.celluleEnTete, { width: '30%' }]}>Observations</Text>
            </View>
            {meubles.map(([label, meuble]) => (
              <View key={label} style={styles.ligne}>
                <Text style={[styles.cellule, { width: '35%' }]}>{label}</Text>
                <Text style={[styles.cellule, { width: '15%' }]}>
                  {meuble.present ? 'Oui' : 'Non'}
                </Text>
                <Text style={[styles.cellule, { width: '20%' }]}>
                  {meuble.present ? ETAT_LABELS[meuble.etat] : '—'}
                </Text>
                <Text style={[styles.cellule, { width: '30%' }]}>
                  {meuble.observations || '—'}
                </Text>
              </View>
            ))}
          </View>
        )
      })}

      <Text style={styles.piedDePage}>
        Document généré par Bail Express — À valider par un juriste avant production.
      </Text>
    </Page>
  )
}
