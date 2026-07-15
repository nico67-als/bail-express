import type { EtapeNum, TypeBail, WizardData } from '@/types'
import { diagnosticAmianteRequis, diagnosticPlombRequis } from '@/lib/diagnostics'
import { depotGarantieMax, forfaitChargesAutorise } from '@/lib/financier'

export interface EtapeDef {
  numero: EtapeNum
  titre: string
  /** Libellé court, pour le fil de progression. */
  courte: string
  sousTitre?: string
}

export const ETAPES: EtapeDef[] = [
  {
    numero: 1,
    titre: 'Type de bail',
    courte: 'Bail',
    sousTitre: 'Le type de location détermine les documents et les règles applicables.',
  },
  {
    numero: 2,
    titre: 'Vous, le bailleur',
    courte: 'Bailleur',
    sousTitre: 'Ces informations figureront en tête du bail.',
  },
  {
    numero: 3,
    titre: 'Le ou les locataires',
    courte: 'Locataires',
    sousTitre: 'Ajoutez chaque personne signataire du bail.',
  },
  {
    numero: 4,
    titre: 'Le logement',
    courte: 'Logement',
    sousTitre:
      'Le nombre de pièces déclaré ici génère les sections de l’état des lieux et de l’inventaire.',
  },
  {
    numero: 5,
    titre: 'Conditions financières',
    courte: 'Loyer',
    sousTitre: 'Loyer, charges, dépôt de garantie et révision.',
  },
  {
    numero: 6,
    titre: 'Inventaire des meubles',
    courte: 'Inventaire',
    sousTitre: 'Obligatoire en location meublée : le mobilier fourni, pièce par pièce.',
  },
  {
    numero: 7,
    titre: 'État des lieux d’entrée',
    courte: 'État des lieux',
    sousTitre: 'Compteurs, clés, puis l’état de chaque pièce.',
  },
  {
    numero: 8,
    titre: 'Récapitulatif',
    courte: 'Récapitulatif',
    sousTitre: 'Vérifiez vos informations avant de générer vos documents.',
  },
]

/**
 * L'inventaire (étape 6) n'existe qu'en meublé : en location vide il est purement
 * et simplement retiré du parcours, y compris du fil de progression.
 */
export function etapesVisibles(typeBail: TypeBail | ''): EtapeDef[] {
  return ETAPES.filter((etape) => etape.numero !== 6 || typeBail === 'meuble')
}

export function etapeDef(numero: EtapeNum): EtapeDef {
  return ETAPES[numero - 1]
}

/** Étape suivante dans le parcours, en sautant les étapes masquées. Null si on est à la fin. */
export function etapeSuivante(
  courante: EtapeNum,
  typeBail: TypeBail | ''
): EtapeNum | null {
  const visibles = etapesVisibles(typeBail)
  const index = visibles.findIndex((etape) => etape.numero === courante)
  return visibles[index + 1]?.numero ?? null
}

/** Étape précédente dans le parcours. Null si on est au début. */
export function etapePrecedente(
  courante: EtapeNum,
  typeBail: TypeBail | ''
): EtapeNum | null {
  const visibles = etapesVisibles(typeBail)
  const index = visibles.findIndex((etape) => etape.numero === courante)
  return index <= 0 ? null : visibles[index - 1].numero
}

function rempli(valeur: string | number | null | ''): boolean {
  return valeur !== '' && valeur !== null
}

/**
 * Une étape non encore développée (4 à 8 pour l'instant) ne doit jamais bloquer le
 * bouton « Continuer » : il n'y a rien à y valider tant que son formulaire n'existe pas.
 */
export function etapeValide(numero: EtapeNum, data: WizardData): boolean {
  switch (numero) {
    case 1:
      return rempli(data.etape1.typeBail) && rempli(data.etape1.usage)

    case 2: {
      const { bailleur } = data.etape2
      const bailleurValide =
        bailleur.type === 'physique'
          ? rempli(bailleur.civilite) &&
            rempli(bailleur.nom) &&
            rempli(bailleur.prenom) &&
            rempli(bailleur.dateNaissance) &&
            rempli(bailleur.lieuNaissance) &&
            rempli(bailleur.nationalite) &&
            rempli(bailleur.adresse)
          : rempli(bailleur.raisonSociale) &&
            rempli(bailleur.formeJuridique) &&
            rempli(bailleur.siret) &&
            rempli(bailleur.representant) &&
            rempli(bailleur.qualite) &&
            rempli(bailleur.adresseSiege)

      return bailleurValide && rempli(data.etape2.email) && rempli(data.etape2.telephone)
    }

    case 3:
      return data.etape3.locataires.every(
        (locataire) =>
          rempli(locataire.civilite) &&
          rempli(locataire.nom) &&
          rempli(locataire.prenom) &&
          rempli(locataire.dateNaissance) &&
          rempli(locataire.lieuNaissance) &&
          rempli(locataire.nationalite) &&
          rempli(locataire.adresseActuelle) &&
          rempli(locataire.email)
      )

    case 4: {
      const logement = data.etape4
      const diagnosticsOk =
        (!diagnosticPlombRequis(logement.periodeConstruction) ||
          logement.presencePlomb !== null) &&
        (!diagnosticAmianteRequis(logement.periodeConstruction) ||
          logement.presenceAmiante !== null)

      return (
        rempli(logement.adresse) &&
        rempli(logement.typeLogement) &&
        rempli(logement.surface) &&
        rempli(logement.nbPieces) &&
        rempli(logement.nbChambres) &&
        rempli(logement.periodeConstruction) &&
        rempli(logement.regimeJuridique) &&
        rempli(logement.chauffage) &&
        rempli(logement.eauChaude) &&
        rempli(logement.dpeClasse) &&
        rempli(logement.gesClasse) &&
        diagnosticsOk
      )
    }

    case 5: {
      const fin = data.etape5
      const plafondDG = depotGarantieMax(data.etape1.typeBail, fin.loyerHC)
      const dgOk =
        plafondDG === null || fin.depotGarantie === '' || fin.depotGarantie <= plafondDG
      const chargesOk =
        fin.typeCharges !== 'forfait' || forfaitChargesAutorise(data.etape1.typeBail)
      const irlOk = !fin.revisionIRL || rempli(fin.trimestreIRL)
      const zoneOk =
        !fin.zoneTendue ||
        (rempli(fin.loyerReferenceMajore) &&
          (fin.complementLoyer === '' ||
            fin.complementLoyer <= 0 ||
            rempli(fin.motifComplement)))

      return (
        rempli(fin.dateEntree) &&
        rempli(fin.loyerHC) &&
        rempli(fin.typeCharges) &&
        rempli(fin.montantCharges) &&
        rempli(fin.datePaiement) &&
        rempli(fin.modePaiement) &&
        rempli(fin.depotGarantie) &&
        dgOk &&
        chargesOk &&
        irlOk &&
        zoneOk
      )
    }

    case 6:
      // Le décret impose la liste des meubles, mais pas de bloquer le formulaire tant que
      // l'utilisateur n'a pas coché chaque case : seul un meuble déclaré présent doit avoir
      // un état renseigné, pour rester exploitable dans le PDF généré.
      return data.etape6.pieces.every((piece) =>
        Object.values(piece.meubles).every((meuble) => !meuble.present || rempli(meuble.etat))
      )

    case 7: {
      const edl = data.etape7
      const elements = [
        'plafond',
        'murs',
        'sol',
        'fenetres',
        'volets',
        'porte',
        'elec',
        'chauffage',
        'luminaire',
      ] as const

      const piecesOk = edl.pieces.every((piece) =>
        elements.every((cle) => rempli(piece[cle].etat))
      )

      return rempli(edl.dateEdl) && rempli(edl.nbCles) && piecesOk
    }

    default:
      return true
  }
}
