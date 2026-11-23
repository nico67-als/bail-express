import { z } from "zod";

// Champs d'un bail de résidence principale, d'après les contrats types
// du décret n° 2015-587 (version du 1er octobre 2026), voir contrats-types/.
// Le même schéma sert à l'extraction par l'IA, au formulaire de vérification
// et à la génération du bail.
//
// Hors V1 (bail entre particuliers, nouveau locataire) : mandataire et honoraires,
// durée réduite pour événement précis, complément de loyer, contribution pour le
// partage des économies de charges, assurance pour le compte des colocataires,
// réévaluation d'un loyer sous-évalué, majoration ou diminution de loyer pour travaux.

const texte = z.string().trim().min(1);
const montant = z.number().positive();

export const PERIODES_CONSTRUCTION = {
  "avant-1949": "avant 1949",
  "1949-1974": "de 1949 à 1974",
  "1975-1989": "de 1975 à 1989",
  "1989-2005": "de 1989 à 2005",
  "depuis-2005": "depuis 2005",
} as const;

const partie = z.object({
  nom: texte.describe("Nom et prénom, ou dénomination pour une société"),
  telephone: texte.optional(),
  email: z.email().optional(),
});

const bailleur = partie.extend({
  qualite: z.enum(["personne-physique", "personne-morale"]),
  adresse: texte.describe("Domicile ou siège social"),
  sciFamiliale: z
    .boolean()
    .optional()
    .describe("Personne morale : société civile constituée exclusivement entre parents et alliés jusqu'au 4e degré"),
});

export const schemaBail = z
  .object({
    meuble: z.boolean(),
    etudiant: z.boolean().default(false).describe("Meublé loué à un étudiant pour 9 mois"),

    bailleurs: z.array(bailleur).min(1),
    locataires: z.array(partie).min(1),

    logement: z.object({
      adresse: texte.describe("Adresse, bâtiment, étage, porte"),
      identifiantFiscal: texte.describe("Numéro identifiant fiscal du logement"),
      typeHabitat: z.enum(["collectif", "individuel"]),
      regime: z.enum(["monopropriété", "copropriété"]),
      periodeConstruction: z.enum(Object.keys(PERIODES_CONSTRUCTION) as [keyof typeof PERIODES_CONSTRUCTION]),
      surface: montant.describe("Surface habitable en m²"),
      piecesPrincipales: z.int().positive(),
      autresParties: texte.optional().describe("Grenier, terrasse, balcon, jardin…"),
      equipements: texte.optional().describe("Cuisine équipée, installations sanitaires…"),
      chauffage: z.enum(["individuel", "collectif"]),
      repartitionChauffage: texte.optional().describe("Si chauffage collectif"),
      eauChaude: z.enum(["individuelle", "collective"]),
      repartitionEauChaude: texte.optional().describe("Si eau chaude collective"),
      classeDpe: z.enum(["A", "B", "C", "D", "E", "F", "G"]),
      destination: z.enum(["habitation", "mixte"]),
      servitudeResidencePrincipale: z.boolean().default(false),
      locauxPrivatifs: texte.optional().describe("Cave, parking, garage…"),
      partiesCommunes: texte.optional().describe("Local vélo, ascenseur, espaces verts…"),
      equipementsTic: texte.optional().describe("Réception TV, raccordement internet…"),
    }),

    dateEffet: z.iso.date(),

    loyer: z.object({
      mensuel: montant,
      evolutionEncadree: z.boolean().optional().describe("Zone tendue : décret d'évolution des loyers à la relocation"),
      loyerReference: z
        .object({ reference: montant, majore: montant })
        .optional()
        .describe("Zone d'encadrement : loyers de référence en €/m²"),
      dernierLocataire: z
        .object({ montant: montant, dateVersement: z.iso.date(), dateDerniereRevision: z.iso.date() })
        .optional()
        .describe("Obligatoire si le précédent locataire est parti moins de 18 mois avant la signature"),
      dateRevision: texte.optional(),
      trimestreIrl: texte.optional(),
    }),

    charges: z.object({
      modalite: z.enum(["provisions", "periodique", "forfait"]),
      montant: montant.optional(),
      revisionForfait: texte.optional(),
    }),

    paiement: z.object({
      periodicite: texte.default("mensuelle"),
      terme: z.enum(["à échoir", "à terme échu"]),
      date: texte.describe("Ex. : le 5 de chaque mois"),
      lieu: texte.optional(),
    }),

    depensesEnergie: z.object({
      montant: texte.describe("Montant ou fourchette inscrit au DPE"),
      anneeReference: z.int(),
    }),

    travaux: texte.optional().describe("Travaux d'amélioration ou de décence depuis le dernier bail"),
    depotGarantie: montant.optional(),
    solidarite: z.boolean().default(true),
    autresConditions: texte.optional(),

    annexes: z.object({
      amiante: z.boolean().default(true),
      electriciteGaz: z.boolean().default(true),
      etatDesRisques: z.boolean().default(true),
      autorisationPrealable: z.boolean().default(false),
    }),

    signature: z.object({ date: z.iso.date(), lieu: texte }),
  })
  .superRefine((b, ctx) => {
    const erreur = (message: string, path: (string | number)[]) => ctx.addIssue({ code: "custom", message, path });

    if (b.etudiant && !b.meuble) erreur("Le bail étudiant de 9 mois n'existe qu'en meublé", ["etudiant"]);
    if (b.charges.modalite === "forfait" && !b.meuble && b.locataires.length < 2)
      erreur("Le forfait de charges n'est possible en location vide qu'en colocation", ["charges", "modalite"]);
    if (b.charges.modalite !== "periodique" && b.charges.montant === undefined)
      erreur("Montant des provisions ou du forfait manquant", ["charges", "montant"]);

    const reference = b.loyer.loyerReference;
    if (reference && b.loyer.mensuel / b.logement.surface > reference.majore)
      erreur("Loyer au-dessus du loyer de référence majoré (le complément de loyer n'est pas encore pris en charge)", [
        "loyer",
        "mensuel",
      ]);

    const plafond = b.loyer.mensuel * (b.meuble ? 2 : 1);
    if (b.depotGarantie !== undefined && b.depotGarantie > plafond)
      erreur(`Dépôt de garantie limité à ${b.meuble ? "deux mois" : "un mois"} de loyer hors charges`, ["depotGarantie"]);
  });

export type Bail = z.infer<typeof schemaBail>;
