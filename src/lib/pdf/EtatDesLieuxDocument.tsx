import { Page, Text, View } from '@react-pdf/renderer'
import type { EtatPiece, WizardData } from '@/types'
import { styles } from './styles'
import { formatCivilite, formatDateLongue } from './format'

const ETAT_LABELS: Record<string, string> = {
  bon: 'Bon état',
  usage: 'Usage normal',
  degrade: 'Dégradé',
  '': '—',
}

type CleElement =
  | 'plafond'
  | 'murs'
  | 'sol'
  | 'fenetres'
  | 'volets'
  | 'porte'
  | 'elec'
  | 'chauffage'
  | 'luminaire'

const ELEMENTS: { cle: CleElement; label: string }[] = [
  { cle: 'plafond', label: 'Plafond' },
  { cle: 'murs', label: 'Murs / peinture' },
  { cle: 'sol', label: 'Sol' },
  { cle: 'fenetres', label: 'Fenêtres' },
  { cle: 'volets', label: 'Volets / stores' },
  { cle: 'porte', label: 'Porte(s)' },
  { cle: 'elec', label: 'Interrupteurs / prises' },
  { cle: 'chauffage', label: 'Radiateur / chauffage' },
  { cle: 'luminaire', label: 'Luminaire' },
]

function TableauPiece({ piece }: { piece: EtatPiece }) {
  return (
    <View style={styles.table}>
      <Text style={styles.h3}>{piece.nomPiece}</Text>
      <View style={styles.ligneEnTete}>
        <Text style={[styles.celluleEnTete, { width: '35%' }]}>Élément</Text>
        <Text style={[styles.celluleEnTete, { width: '20%' }]}>État</Text>
        <Text style={[styles.celluleEnTete, { width: '45%' }]}>Observations</Text>
      </View>
      {ELEMENTS.map(({ cle, label }) => (
        <View key={cle} style={styles.ligne}>
          <Text style={[styles.cellule, { width: '35%' }]}>{label}</Text>
          <Text style={[styles.cellule, { width: '20%' }]}>{ETAT_LABELS[piece[cle].etat]}</Text>
          <Text style={[styles.cellule, { width: '45%' }]}>{piece[cle].obs || '—'}</Text>
        </View>
      ))}
      {piece.obsGenerales && (
        <Text style={{ ...styles.petit, marginTop: 4 }}>
          Observations générales : {piece.obsGenerales}
        </Text>
      )}
    </View>
  )
}

export default function EtatDesLieuxDocument({ data }: { data: WizardData }) {
  const { etape2, etape3, etape4, etape7 } = data
  const { bailleur } = etape2

  return (
    <Page size="A4" style={styles.page} wrap>
      <Text style={styles.titre}>ÉTAT DES LIEUX D&apos;ENTRÉE</Text>
      <Text style={styles.sousTitre}>Logement loué à usage de résidence principale</Text>
      <Text style={styles.sousTitre}>Décret n°2016-382 du 30 mars 2016</Text>

      <View style={styles.filet} />

      <Text style={styles.ligneListe}>Date : {formatDateLongue(etape7.dateEdl)}</Text>
      <Text style={styles.ligneListe}>
        Adresse du logement : {etape4.adresse}
        {etape4.complement ? `, ${etape4.complement}` : ''}
      </Text>

      <Text style={styles.h3}>Parties présentes</Text>
      <Text style={styles.ligneListe}>
        Le Bailleur (ou son mandataire) :{' '}
        {bailleur.type === 'physique'
          ? `${formatCivilite(bailleur.civilite)} ${bailleur.nom} ${bailleur.prenom}`
          : `${bailleur.raisonSociale}, représentée par ${bailleur.representant}`}
      </Text>
      {etape3.locataires.map((locataire, index) => (
        <Text key={index} style={styles.ligneListe}>
          Le Locataire : {formatCivilite(locataire.civilite)} {locataire.nom} {locataire.prenom}
        </Text>
      ))}

      <View style={styles.filet} />

      <Text style={styles.h2}>RELEVÉ DES COMPTEURS</Text>
      <View style={styles.ligneEnTete}>
        <Text style={[styles.celluleEnTete, { width: '40%' }]}>Compteur</Text>
        <Text style={[styles.celluleEnTete, { width: '30%' }]}>Référence</Text>
        <Text style={[styles.celluleEnTete, { width: '30%' }]}>Index relevé</Text>
      </View>
      <View style={styles.ligne}>
        <Text style={[styles.cellule, { width: '40%' }]}>Électricité (kWh)</Text>
        <Text style={[styles.cellule, { width: '30%' }]}>{etape7.compteurElecRef || '—'}</Text>
        <Text style={[styles.cellule, { width: '30%' }]}>{etape7.compteurElecIndex || '—'}</Text>
      </View>
      {etape7.compteurGazIndex && (
        <View style={styles.ligne}>
          <Text style={[styles.cellule, { width: '40%' }]}>Gaz (m³)</Text>
          <Text style={[styles.cellule, { width: '30%' }]}>{etape7.compteurGazRef || '—'}</Text>
          <Text style={[styles.cellule, { width: '30%' }]}>{etape7.compteurGazIndex}</Text>
        </View>
      )}
      {etape7.compteurEauFroideIndex && (
        <View style={styles.ligne}>
          <Text style={[styles.cellule, { width: '40%' }]}>Eau froide (m³)</Text>
          <Text style={[styles.cellule, { width: '30%' }]}>
            {etape7.compteurEauFroideRef || '—'}
          </Text>
          <Text style={[styles.cellule, { width: '30%' }]}>{etape7.compteurEauFroideIndex}</Text>
        </View>
      )}
      {etape7.compteurEauChaudeIndex && (
        <View style={styles.ligne}>
          <Text style={[styles.cellule, { width: '40%' }]}>Eau chaude (m³)</Text>
          <Text style={[styles.cellule, { width: '30%' }]}>
            {etape7.compteurEauChaudeRef || '—'}
          </Text>
          <Text style={[styles.cellule, { width: '30%' }]}>{etape7.compteurEauChaudeIndex}</Text>
        </View>
      )}

      <Text style={styles.h2}>REMISE DES CLÉS ET ACCÈS</Text>
      <View style={styles.ligneEnTete}>
        <Text style={[styles.celluleEnTete, { width: '60%' }]}>Type</Text>
        <Text style={[styles.celluleEnTete, { width: '40%' }]}>Quantité</Text>
      </View>
      <View style={styles.ligne}>
        <Text style={[styles.cellule, { width: '60%' }]}>Clé(s) du logement</Text>
        <Text style={[styles.cellule, { width: '40%' }]}>{etape7.nbCles}</Text>
      </View>
      <View style={styles.ligne}>
        <Text style={[styles.cellule, { width: '60%' }]}>Badge(s) / télécommande(s)</Text>
        <Text style={[styles.cellule, { width: '40%' }]}>{etape7.nbBadges || 0}</Text>
      </View>

      <View style={styles.filet} />

      <Text style={styles.h2}>ÉTAT DES LIEUX PAR PIÈCE</Text>
      <Text style={styles.petit}>Échelle d&apos;état : Bon état / Usage normal / Dégradé</Text>
      {etape7.pieces.map((piece, index) => (
        <TableauPiece key={index} piece={piece} />
      ))}

      <View style={styles.filet} />

      <Text style={styles.h2}>OBSERVATIONS GÉNÉRALES DU LOGEMENT</Text>
      <Text style={styles.paragraphe}>{etape7.obsGenerales || 'Néant.'}</Text>

      <Text style={styles.h2}>RÉSERVES ÉMISES PAR LE LOCATAIRE</Text>
      <Text style={styles.petit}>
        Le locataire dispose de 10 jours après la signature pour compléter par courrier
        recommandé.
      </Text>
      <Text style={styles.paragraphe}>{etape7.reservesLocataire || 'Néant.'}</Text>

      <View style={styles.filet} />

      <Text style={styles.paragraphe}>
        L&apos;état des lieux a été établi contradictoirement et remis à chaque partie.
      </Text>
      <Text style={styles.paragraphe}>
        Fait à ......................................, le {formatDateLongue(etape7.dateEdl)}.
      </Text>

      <View style={styles.signatures}>
        <View style={styles.blocSignature}>
          <Text style={styles.gras}>Le Bailleur (ou mandataire)</Text>
        </View>
        <View style={styles.blocSignature}>
          <Text style={styles.gras}>Le(s) Locataire(s)</Text>
          {etape3.locataires.map((locataire, index) => (
            <Text key={index} style={{ marginTop: 6 }}>
              {locataire.nom} {locataire.prenom} :
            </Text>
          ))}
        </View>
      </View>

      <Text style={styles.piedDePage}>
        Document généré par Bail Express — À valider par un juriste avant production.
      </Text>
    </Page>
  )
}
