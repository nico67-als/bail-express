import { Page, Text, View } from '@react-pdf/renderer'
import type { WizardData } from '@/types'
import { styles } from './styles'
import {
  ajouterMois,
  formatCivilite,
  formatDateLongue,
  formatEuros,
  formatTrimestre,
} from './format'
import { nombreEnLettres } from './nombre-lettres'

/**
 * Texte de la clause de dépôt de garantie : le montant saisi peut être inférieur au
 * plafond légal (l'étape 5 autorise tout montant <= plafond), donc le ratio mois n'est
 * pas forcément un entier — on l'affiche en décimal plutôt que de mentir sur "1 mois"
 * ou "2 mois" pile.
 */
function ratioMois(depotGarantie: number | '', loyerHC: number | ''): string {
  if (depotGarantie === '' || loyerHC === '' || loyerHC === 0) return '...'
  const ratio = Math.round((depotGarantie / loyerHC) * 100) / 100
  return ratio.toString().replace('.', ',')
}

export default function BailDocument({ data }: { data: WizardData }) {
  const { etape1, etape2, etape3, etape4, etape5 } = data
  const meuble = etape1.typeBail === 'meuble'
  const { bailleur } = etape2
  const locataires = etape3.locataires
  const nbLocataires = locataires.length
  const nbExemplaires = 1 + nbLocataires

  const dureeVide = bailleur.type === 'morale' ? '6 ans' : '3 ans'
  const dateFinEtudiant = etape1.usage === 'etudiant' ? ajouterMois(etape5.dateEntree, 9) : ''

  const loyerHC = etape5.loyerHC === '' ? 0 : etape5.loyerHC
  const montantCharges = etape5.montantCharges === '' ? 0 : etape5.montantCharges
  const loyerTotal = loyerHC + montantCharges
  const loyerReferenceMajoreTotal =
    etape5.zoneTendue && etape5.loyerReferenceMajore !== '' && etape4.surface !== ''
      ? Math.round(etape5.loyerReferenceMajore * etape4.surface * 100) / 100
      : null

  return (
    <Page size="A4" style={styles.page} wrap>
      <Text style={styles.titre}>
        CONTRAT DE LOCATION {meuble ? 'MEUBLÉE' : 'NON MEUBLÉE'}
      </Text>
      <Text style={styles.sousTitre}>À usage de résidence principale</Text>
      <Text style={styles.sousTitre}>
        Loi n°89-462 du 6 juillet 1989 modifiée par la loi ALUR n°2014-366 du 24 mars 2014
      </Text>
      <Text style={styles.sousTitre}>
        Décret n°2015-587 du 29 mai 2015 — Contrat type — Annexe {meuble ? '2' : '1'}
      </Text>

      <View style={styles.filet} />

      {/* Article 1 */}
      <Text style={styles.h2}>ARTICLE 1 — DÉSIGNATION DES PARTIES</Text>
      <Text style={styles.h3}>LE BAILLEUR</Text>
      {bailleur.type === 'physique' ? (
        <Text style={styles.paragraphe}>
          {formatCivilite(bailleur.civilite)} {bailleur.nom} {bailleur.prenom}, né(e) le{' '}
          {formatDateLongue(bailleur.dateNaissance)} à {bailleur.lieuNaissance}, de nationalité{' '}
          {bailleur.nationalite}, demeurant au {bailleur.adresse}.
        </Text>
      ) : (
        <Text style={styles.paragraphe}>
          La société {bailleur.raisonSociale}, {bailleur.formeJuridique}, immatriculée sous le
          numéro SIRET {bailleur.siret}, dont le siège social est situé au{' '}
          {bailleur.adresseSiege}, représentée par {bailleur.representant}, en qualité de{' '}
          {bailleur.qualite}.
        </Text>
      )}
      <Text style={styles.paragraphe}>Ci-après dénommé(e) « le Bailleur ».</Text>

      <Text style={styles.h3}>LE(S) LOCATAIRE(S)</Text>
      {locataires.map((locataire, index) => (
        <Text key={index} style={styles.paragraphe}>
          {formatCivilite(locataire.civilite)} {locataire.nom} {locataire.prenom}, né(e) le{' '}
          {formatDateLongue(locataire.dateNaissance)} à {locataire.lieuNaissance}, de nationalité{' '}
          {locataire.nationalite}, demeurant actuellement au {locataire.adresseActuelle}.
        </Text>
      ))}
      <Text style={styles.paragraphe}>Ci-après dénommé(s) « le Locataire ».</Text>
      {nbLocataires > 1 && (
        <Text style={styles.paragraphe}>
          Les co-titulaires du bail sont solidaires et indivisibles de toutes les obligations
          découlant du présent contrat (voir article 7).
        </Text>
      )}

      <View style={styles.filet} />

      {/* Article 2 */}
      <Text style={styles.h2}>ARTICLE 2 — OBJET DU CONTRAT</Text>
      <Text style={styles.paragraphe}>
        Le Bailleur loue au Locataire, qui accepte, les locaux à usage d&apos;habitation{' '}
        {meuble ? 'meublée' : 'non meublée'} désignés ci-après, à titre de résidence principale.
      </Text>

      <Text style={styles.h3}>Désignation du logement</Text>
      <Text style={styles.ligneListe}>
        Adresse : {etape4.adresse}
        {etape4.complement ? `, ${etape4.complement}` : ''}
      </Text>
      <Text style={styles.ligneListe}>
        Type : {etape4.typeLogement} ({etape4.nbPieces} pièce(s) principale(s))
      </Text>
      <Text style={styles.ligneListe}>Étage : {etape4.etage || '—'}</Text>
      <Text style={styles.ligneListe}>Surface habitable : {etape4.surface} m²</Text>
      <Text style={styles.ligneListe}>
        Régime juridique de l&apos;immeuble :{' '}
        {etape4.regimeJuridique === 'copropriete' ? 'Copropriété' : 'Monopropriété'}
      </Text>

      {(etape4.cave || etape4.parking || etape4.jardin) && (
        <>
          <Text style={styles.h3}>Équipements et annexes inclus dans la location</Text>
          {etape4.cave && (
            <Text style={styles.ligneListe}>
              Cave{etape4.caveNum ? ` n° ${etape4.caveNum}` : ''}
            </Text>
          )}
          {etape4.parking && (
            <Text style={styles.ligneListe}>
              Parking / Garage{etape4.parkingNum ? ` n° ${etape4.parkingNum}` : ''}
            </Text>
          )}
          {etape4.jardin && <Text style={styles.ligneListe}>Jardin / Terrasse</Text>}
        </>
      )}

      <Text style={styles.h3}>Équipements techniques</Text>
      <Text style={styles.ligneListe}>Chauffage : {etape4.chauffage}</Text>
      <Text style={styles.ligneListe}>Eau chaude : {etape4.eauChaude}</Text>

      <Text style={styles.h3}>Performance énergétique (DPE)</Text>
      <Text style={styles.ligneListe}>Classe énergie : {etape4.dpeClasse}</Text>
      <Text style={styles.ligneListe}>Émissions de gaz à effet de serre : {etape4.gesClasse}</Text>

      <View style={styles.filet} />

      {/* Article 3 */}
      <Text style={styles.h2}>ARTICLE 3 — DATE DE PRISE D&apos;EFFET ET DURÉE</Text>
      <Text style={styles.paragraphe}>
        Le présent contrat prend effet le {formatDateLongue(etape5.dateEntree)}.
      </Text>

      {meuble ? (
        etape1.usage === 'etudiant' ? (
          <Text style={styles.paragraphe}>
            La durée du contrat est fixée à 9 mois, conformément à l&apos;article 25-7 de la loi
            du 6 juillet 1989. Le contrat prend fin le {formatDateLongue(dateFinEtudiant)} sans
            reconduction tacite. Le Locataire n&apos;est pas tenu de donner congé.
          </Text>
        ) : (
          <>
            <Text style={styles.paragraphe}>
              La durée du contrat est fixée à 1 an, renouvelable par tacite reconduction pour la
              même durée.
            </Text>
            <Text style={styles.paragraphe}>
              Congé donné par le Locataire : le Locataire peut donner congé à tout moment, avec un
              préavis d&apos;1 mois, par lettre recommandée avec accusé de réception, acte
              d&apos;huissier ou remise en main propre contre récépissé.
            </Text>
            <Text style={styles.paragraphe}>
              Congé donné par le Bailleur : le Bailleur peut donner congé au moins 3 mois avant
              l&apos;échéance du contrat, par lettre recommandée avec accusé de réception ou acte
              d&apos;huissier, uniquement pour reprise du logement, vente, ou motif légitime et
              sérieux.
            </Text>
          </>
        )
      ) : (
        <>
          <Text style={styles.paragraphe}>
            La durée du contrat est fixée à {dureeVide}, renouvelable par tacite reconduction pour
            la même durée.
          </Text>
          <Text style={styles.paragraphe}>
            Congé donné par le Locataire : le Locataire peut donner congé à tout moment avec un
            préavis de {etape5.zoneTendue ? '1 mois (zone tendue)' : '3 mois'}, par lettre
            recommandée avec accusé de réception, acte d&apos;huissier ou remise en main propre
            contre récépissé.
          </Text>
          <Text style={styles.paragraphe}>
            Congé donné par le Bailleur : le Bailleur peut donner congé au moins 6 mois avant
            l&apos;échéance du contrat, uniquement pour reprise du logement, vente, ou motif
            légitime et sérieux.
          </Text>
        </>
      )}

      <View style={styles.filet} />

      {/* Article 4 */}
      <Text style={styles.h2}>ARTICLE 4 — CONDITIONS FINANCIÈRES</Text>
      <Text style={styles.h3}>4.1 Loyer</Text>
      <Text style={styles.paragraphe}>
        Le loyer mensuel est fixé à {formatEuros(etape5.loyerHC)} ({nombreEnLettres(loyerHC)}{' '}
        euros) hors charges.
      </Text>

      {etape5.zoneTendue && (
        <Text style={styles.paragraphe}>
          Le logement est situé en zone soumise à l&apos;encadrement des loyers. Le loyer de
          référence majoré est de {formatEuros(etape5.loyerReferenceMajore)}/m², soit{' '}
          {loyerReferenceMajoreTotal !== null ? formatEuros(loyerReferenceMajoreTotal) : '...'} pour{' '}
          {etape4.surface} m².{' '}
          {etape5.complementLoyer !== '' && etape5.complementLoyer > 0
            ? `Un complément de loyer de ${formatEuros(etape5.complementLoyer)} est appliqué pour le motif suivant : ${etape5.motifComplement}.`
            : ''}
        </Text>
      )}

      <Text style={styles.paragraphe}>
        Le loyer est payable le {etape5.datePaiement} de chaque mois, par {etape5.modePaiement}, à
        terme échu.
      </Text>

      <Text style={styles.h3}>4.2 Révision du loyer</Text>
      <Text style={styles.paragraphe}>
        {etape5.revisionIRL
          ? `Le loyer sera révisé chaque année à la date anniversaire du contrat, en fonction de la variation de l'Indice de Référence des Loyers (IRL) publié par l'INSEE. L'indice de référence retenu est celui du ${formatTrimestre(etape5.trimestreIRL)}, dont la valeur en vigueur à la date de signature sera reportée sur l'avenant de révision.`
          : "Le loyer n'est pas soumis à révision annuelle pendant la durée du présent contrat."}
      </Text>

      <Text style={styles.h3}>4.3 Charges locatives</Text>
      <Text style={styles.paragraphe}>
        {etape5.typeCharges === 'forfait'
          ? `Les charges locatives sont fixées sous forme de forfait mensuel de ${formatEuros(etape5.montantCharges)} (${nombreEnLettres(montantCharges)} euros). Ce forfait n'est pas susceptible de régularisation.`
          : `Les charges locatives récupérables sont versées sous forme de provision mensuelle de ${formatEuros(etape5.montantCharges)} (${nombreEnLettres(montantCharges)} euros), avec régularisation annuelle sur présentation des justificatifs, conformément au décret n°87-713 du 26 août 1987.`}
      </Text>
      <Text style={styles.paragraphe}>
        <Text style={styles.gras}>Loyer total mensuel (loyer + charges) : {formatEuros(loyerTotal)}</Text>
      </Text>

      <Text style={styles.h3}>4.4 Dépôt de garantie</Text>
      <Text style={styles.paragraphe}>
        À la signature du présent contrat, le Locataire verse au Bailleur un dépôt de garantie
        d&apos;un montant de {formatEuros(etape5.depotGarantie)} (
        {etape5.depotGarantie !== '' ? nombreEnLettres(etape5.depotGarantie) : '...'} euros),
        correspondant à {ratioMois(etape5.depotGarantie, etape5.loyerHC)} mois de loyer hors
        charges (maximum {meuble ? '2 mois' : '1 mois'} conformément à l&apos;article 22 de la loi
        du 6 juillet 1989).
      </Text>
      <Text style={styles.paragraphe}>
        Ce dépôt de garantie sera restitué dans un délai maximum d&apos;1 mois après la remise des
        clés si l&apos;état des lieux de sortie est conforme à l&apos;état des lieux d&apos;entrée,
        ou de 2 mois en cas de dégradations imputables au Locataire.
      </Text>

      <View style={styles.filet} />

      {/* Article 5 */}
      <Text style={styles.h2}>ARTICLE 5 — TRAVAUX</Text>
      <Text style={styles.h3}>
        5.1 Travaux réalisés par le Bailleur depuis le dernier contrat de location
      </Text>
      <Text style={styles.paragraphe}>Néant.</Text>
      <Text style={styles.h3}>
        5.2 Travaux réalisés dans le logement depuis l&apos;établissement du dernier DPE
      </Text>
      <Text style={styles.paragraphe}>Néant.</Text>
      <Text style={styles.h3}>5.3 Travaux que le Bailleur s&apos;engage à réaliser</Text>
      <Text style={styles.paragraphe}>Néant.</Text>
      <Text style={styles.paragraphe}>
        Le Bailleur doit entretenir le logement en état de servir à l&apos;usage prévu par le
        contrat et y faire toutes les réparations, autres que locatives, nécessaires au maintien en
        état et à l&apos;entretien normal des locaux loués.
      </Text>

      <View style={styles.filet} />

      {/* Article 6 */}
      <Text style={styles.h2}>ARTICLE 6 — OBLIGATIONS DES PARTIES</Text>
      <Text style={styles.h3}>6.1 Obligations du Bailleur</Text>
      <Text style={styles.ligneListe}>— Délivrer un logement décent et en bon état d&apos;usage et de réparation</Text>
      <Text style={styles.ligneListe}>— Assurer la jouissance paisible du logement</Text>
      <Text style={styles.ligneListe}>— Entretenir les locaux en état de servir à l&apos;usage prévu</Text>
      <Text style={styles.ligneListe}>— Remettre au Locataire les quittances de loyer sur demande, gratuitement</Text>

      <Text style={styles.h3}>6.2 Obligations du Locataire</Text>
      <Text style={styles.ligneListe}>— Payer le loyer et les charges aux termes convenus</Text>
      <Text style={styles.ligneListe}>
        — Utiliser paisiblement les locaux loués conformément à leur destination
      </Text>
      <Text style={styles.ligneListe}>
        — Répondre des dégradations et pertes survenant pendant la durée du contrat
      </Text>
      <Text style={styles.ligneListe}>
        — Prendre à sa charge l&apos;entretien courant et les menues réparations (décret
        n°87-712 du 26 août 1987)
      </Text>
      <Text style={styles.ligneListe}>
        — Ne pas transformer les locaux sans accord écrit du Bailleur
      </Text>
      <Text style={styles.ligneListe}>
        — S&apos;assurer contre les risques locatifs et en justifier chaque année
      </Text>
      <Text style={styles.ligneListe}>— Ne pas sous-louer sans accord écrit du Bailleur</Text>
      <Text style={styles.paragraphe}>
        Assurance : le Locataire doit fournir au Bailleur une attestation d&apos;assurance
        multirisques habitation couvrant les risques locatifs à la remise des clés, puis à chaque
        renouvellement.
      </Text>

      <View style={styles.filet} />

      {/* Article 7 */}
      <Text style={styles.h2}>ARTICLE 7 — CLAUSE DE SOLIDARITÉ</Text>
      <Text style={styles.paragraphe}>
        {nbLocataires > 1
          ? 'Les co-Locataires sont solidaires et indivisibles entre eux et avec leurs cautions éventuelles pour le paiement du loyer, des charges et de toutes sommes dues en vertu du présent contrat.'
          : 'Sans objet.'}
      </Text>

      <View style={styles.filet} />

      {/* Article 8 */}
      <Text style={styles.h2}>ARTICLE 8 — CLAUSE RÉSOLUTOIRE</Text>
      <Text style={styles.paragraphe}>
        Le présent contrat sera résilié de plein droit, après ordonnance de référé, en cas de :
      </Text>
      <Text style={styles.ligneListe}>— Non-paiement du loyer ou des charges à leur terme</Text>
      <Text style={styles.ligneListe}>— Non-versement du dépôt de garantie</Text>
      <Text style={styles.ligneListe}>— Non-souscription d&apos;une assurance locative</Text>
      <Text style={styles.ligneListe}>
        — Troubles de voisinage constatés par décision de justice
      </Text>

      <View style={styles.filet} />

      {/* Article 9 */}
      <Text style={styles.h2}>ARTICLE 9 — HONORAIRES D&apos;AGENCE</Text>
      <Text style={styles.paragraphe}>
        La location est conclue directement entre le Bailleur et le Locataire, sans intermédiaire.
      </Text>

      <View style={styles.filet} />

      {/* Article 10 */}
      <Text style={styles.h2}>ARTICLE 10 — CONDITIONS PARTICULIÈRES</Text>
      <Text style={styles.paragraphe}>Néant.</Text>

      <View style={styles.filet} />

      <Text style={styles.h2}>SIGNATURES</Text>
      <Text style={styles.paragraphe}>
        Fait en {nbExemplaires} exemplaires originaux, à ......................................,
        le ......................................
      </Text>

      <View style={styles.signatures}>
        <View style={styles.blocSignature}>
          <Text style={styles.gras}>Le Bailleur</Text>
          <Text style={styles.petit}>(Signature précédée de la mention « Lu et approuvé »)</Text>
        </View>
        <View style={styles.blocSignature}>
          <Text style={styles.gras}>Le(s) Locataire(s)</Text>
          <Text style={styles.petit}>(Signature précédée de la mention « Lu et approuvé »)</Text>
          {locataires.map((locataire, index) => (
            <Text key={index} style={{ marginTop: 6 }}>
              {locataire.nom} {locataire.prenom} :
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.filet} />

      <Text style={styles.h2}>ANNEXES JOINTES AU PRÉSENT CONTRAT</Text>
      <Text style={styles.ligneListe}>
        — Notice d&apos;information relative aux droits et obligations des locataires et des
        bailleurs
      </Text>
      {meuble && (
        <Text style={styles.ligneListe}>— Inventaire et état détaillé des meubles</Text>
      )}
      <Text style={styles.ligneListe}>— État des lieux d&apos;entrée</Text>
      {meuble && <Text style={styles.ligneListe}>— Grille de vétusté</Text>}
      <Text style={styles.ligneListe}>— Diagnostic de Performance Énergétique (DPE)</Text>
      <Text style={styles.ligneListe}>— État des Risques et Pollutions (ERP)</Text>
      <Text style={styles.ligneListe}>
        — Autres diagnostics obligatoires selon l&apos;ancienneté du logement (CREP, amiante,
        électricité, gaz, bruit — voir annexe fournie séparément)
      </Text>

      <Text style={styles.piedDePage}>
        Document généré par Bail Express — Ce contrat n&apos;a pas fait l&apos;objet d&apos;une
        validation juridique et est fourni à titre indicatif. Faites-le relire avant signature.
      </Text>
    </Page>
  )
}
