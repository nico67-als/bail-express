import { PERIODES_CONSTRUCTION, type Bail } from "./schema";

// Texte du bail généré à partir des contrats types (contrats-types/).
// Les phrases fixes reprennent le texte officiel mot pour mot ; les crochets
// du contrat type sont remplacés par les valeurs du bail ; les rubriques
// « le cas échéant » sont omises quand elles ne s'appliquent pas.
// Exceptions rédigées à partir de la description entre crochets du contrat type,
// à faire valider par un juriste : clause de solidarité (VII) et second
// paragraphe de la clause résolutoire (VIII).

export type Section = { titre: string; lignes: string[] };
export type DocumentBail = { titre: string; sousTitre: string; sections: Section[] };

const euros = (n: number) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

const date = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

// Retire les lignes vides produites par les rubriques « le cas échéant ».
const lignes = (...l: (string | false | undefined)[]) => l.filter((x): x is string => Boolean(x));

const coordonnees = (p: { telephone?: string; email?: string }) =>
  [p.telephone && `tél. ${p.telephone}`, p.email].filter(Boolean).join(", ");

export function dureeBail(b: Bail): string {
  if (b.meuble) return b.etudiant ? "neuf mois" : "un an";
  const societeNonFamiliale = b.bailleurs.some((x) => x.qualite === "personne-morale" && !x.sciFamiliale);
  return societeNonFamiliale ? "six ans" : "trois ans";
}

function parties(b: Bail): Section {
  const bailleurs = b.bailleurs.map((x) => {
    const qualite =
      x.qualite === "personne-physique"
        ? "personne physique"
        : x.sciFamiliale
          ? "personne morale, société civile constituée exclusivement entre parents et alliés jusqu'au quatrième degré inclus"
          : "personne morale";
    return `- ${[x.nom, x.adresse, qualite, coordonnees(x)].filter(Boolean).join(" / ")}`;
  });
  const locataires = b.locataires.map((x) => `- ${[x.nom, coordonnees(x)].filter(Boolean).join(", ")}`);

  return {
    titre: "I. Désignation des parties",
    lignes: [
      "Le présent contrat est conclu entre les soussignés :",
      ...bailleurs,
      `désigné${b.bailleurs.length > 1 ? "s" : ""} ci-après le bailleur ;`,
      ...locataires,
      `désigné${b.locataires.length > 1 ? "s" : ""} ci-après le locataire.`,
      "Il a été convenu ce qui suit :",
    ],
  };
}

function objet(b: Bail): Section {
  const l = b.logement;
  return {
    titre: "II. Objet du contrat",
    lignes: lignes(
      "Le présent contrat a pour objet la location d'un logement ainsi déterminé :",
      "A. Consistance du logement",
      `- localisation du logement : ${l.adresse} ;`,
      `- identifiant fiscal du logement : ${l.identifiantFiscal} ;`,
      `- type d'habitat : immeuble ${l.typeHabitat} ;`,
      `- régime juridique de l'immeuble : ${l.regime} ;`,
      `- période de construction : ${PERIODES_CONSTRUCTION[l.periodeConstruction]} ;`,
      `- surface habitable : ${l.surface.toLocaleString("fr-FR")} m2 ;`,
      `- nombre de pièces principales : ${l.piecesPrincipales} ;`,
      l.autresParties && `- autres parties du logement : ${l.autresParties} ;`,
      l.equipements && `- éléments d'équipements du logement : ${l.equipements} ;`,
      `- modalité de production de chauffage : ${l.chauffage}${l.repartitionChauffage ? ` (${l.repartitionChauffage})` : ""} ;`,
      `- modalité de production d'eau chaude sanitaire : ${l.eauChaude}${l.repartitionEauChaude ? ` (${l.repartitionEauChaude})` : ""}.`,
      "- rappel : un logement décent doit respecter les critères minimaux de performance suivants :",
      "a) En France métropolitaine :",
      `i) A compter du 1er janvier 2025, le niveau de performance minimal ${b.meuble ? "" : "du logement "}correspond à la classe F du DPE ;`,
      `ii) A compter du 1er janvier 2028, le niveau de performance minimal ${b.meuble ? "" : "du logement "}correspond à la classe E du DPE ;`,
      `iii) A compter du 1er janvier 2034, le niveau de performance minimal ${b.meuble ? "" : "du logement "}correspond à la classe D du DPE.`,
      "b) En Guadeloupe, en Martinique, en Guyane, à La Réunion et à Mayotte :",
      "i) A compter du 1er janvier 2028, le niveau de performance minimal du logement correspond à la classe F du DPE ;",
      "ii) A compter du 1er janvier 2031, le niveau de performance minimal du logement correspond à la classe E du DPE.",
      "La consommation d'énergie finale et le niveau de performance du logement sont déterminés selon la méthode du diagnostic de performance énergétique mentionné à l'article L. 126-26 du code de la construction et de l'habitation.",
      `- niveau de performance du logement : classe ${l.classeDpe}.`,
      `B. Destination des locaux : ${l.destination === "habitation" ? "usage d'habitation" : "usage mixte professionnel et d'habitation"}`,
      l.servitudeResidencePrincipale &&
        "Servitude de résidence principale : le logement objet du présent contrat est soumis à l'obligation prévue à l'article L. 151-14-1 du code de l'urbanisme ; il est à usage exclusif de résidence principale, au sens de l'article 2 de la loi du 6 juillet 1989 susmentionnée.",
      l.locauxPrivatifs && `C. Désignation des locaux et équipements accessoires de l'immeuble à usage privatif du locataire : ${l.locauxPrivatifs}`,
      l.partiesCommunes && `D. Enumération des locaux, parties, équipements et accessoires de l'immeuble à usage commun : ${l.partiesCommunes}`,
      l.equipementsTic && `E. Equipement d'accès aux technologies de l'information et de la communication : ${l.equipementsTic}`,
    ),
  };
}

function duree(b: Bail): Section {
  const reconduction = b.meuble
    ? [
        "A l'exception des locations consenties à un étudiant pour une durée de neuf mois, les contrats de location de logements meublés sont reconduits tacitement à leur terme pour une durée d'un an et dans les mêmes conditions. Le locataire peut mettre fin au bail à tout moment, après avoir donné congé. Le bailleur peut, quant à lui, mettre fin au bail à son échéance et après avoir donné congé, soit pour reprendre le logement en vue de l'occuper lui-même ou une personne de sa famille, soit pour le vendre, soit pour un motif sérieux et légitime.",
        "Les contrats de locations meublées consenties à un étudiant pour une durée de neuf mois ne sont pas reconduits tacitement à leur terme et le locataire peut mettre fin au bail à tout moment, après avoir donné congé. Le bailleur peut, quant à lui, mettre fin au bail à son échéance et après avoir donné congé.",
      ]
    : [
        `En l'absence de proposition de renouvellement du contrat, celui-ci est, à son terme, reconduit tacitement pour ${dureeBail(b) === "six ans" ? "6" : "3"} ans et dans les mêmes conditions. Le locataire peut mettre fin au bail à tout moment, après avoir donné congé. Le bailleur, quant à lui, peut mettre fin au bail à son échéance et après avoir donné congé, soit pour reprendre le logement en vue de l'occuper lui-même ou une personne de sa famille, soit pour le vendre, soit pour un motif sérieux et légitime.`,
      ];

  return {
    titre: "III. Date de prise d'effet et durée du contrat",
    lignes: [
      "La durée du contrat et sa date de prise d'effet sont ainsi définies :",
      `A. Date de prise d'effet du contrat : ${date(b.dateEffet)}`,
      `B. Durée du contrat : ${dureeBail(b)}`,
      ...reconduction,
    ],
  };
}

export function premiereEcheance(b: Bail): number {
  return b.loyer.mensuel + (b.charges.montant ?? 0);
}

function conditionsFinancieres(b: Bail): Section {
  const { loyer, charges, paiement } = b;
  const zoneTendue = loyer.evolutionEncadree !== undefined || loyer.loyerReference !== undefined;
  const modalitesCharges = {
    provisions: "provisions sur charges avec régularisation annuelle",
    periodique: "paiement périodique des charges sans provision",
    forfait: "récupération des charges par le bailleur sous la forme d'un forfait",
  }[charges.modalite];
  // Le contrat type meublé n'a pas de rubrique « contribution pour le partage
  // des économies de charges » : les lettres des rubriques suivantes diffèrent.
  const lettrePaiement = b.meuble ? "D" : "E";
  const lettreEnergie = b.meuble ? "F" : "G";

  return {
    titre: "IV. Conditions financières",
    lignes: lignes(
      "Les parties conviennent des conditions financières suivantes :",
      "A. Loyer",
      "1° Fixation du loyer initial :",
      `a) Montant du loyer mensuel : ${euros(loyer.mensuel)} ;`,
      zoneTendue && "b) Modalités particulières de fixation initiale du loyer applicables dans certaines zones tendues :",
      loyer.evolutionEncadree !== undefined &&
        `- le loyer du logement objet du présent contrat est soumis au décret fixant annuellement le montant maximum d'évolution des loyers à la relocation : ${loyer.evolutionEncadree ? "Oui" : "Non"} ;`,
      zoneTendue &&
        `- le loyer du logement objet du présent contrat est soumis au loyer de référence majoré fixé par arrêté préfectoral : ${loyer.loyerReference ? "Oui" : "Non"} ;`,
      loyer.loyerReference &&
        `- montant du loyer de référence : ${euros(loyer.loyerReference.reference)}/m2 / Montant du loyer de référence majoré : ${euros(loyer.loyerReference.majore)}/m2 ;`,
      loyer.dernierLocataire &&
        `c) Informations relatives au loyer du dernier locataire : ${euros(loyer.dernierLocataire.montant)}, versé le ${date(loyer.dernierLocataire.dateVersement)}, dernière révision le ${date(loyer.dernierLocataire.dateDerniereRevision)}.`,
      (loyer.dateRevision || loyer.trimestreIrl) && "2° Modalités de révision :",
      loyer.dateRevision && `a) Date de révision : ${loyer.dateRevision}.`,
      loyer.trimestreIrl && `b) Date ou trimestre de référence de l'IRL : ${loyer.trimestreIrl}.`,
      "B. Charges récupérables",
      `1. Modalité de règlement des charges récupérables : ${modalitesCharges}.`,
      charges.montant !== undefined &&
        `2. Montant des provisions sur charges ou du forfait de charges : ${euros(charges.montant)}.`,
      charges.revisionForfait && `3. Modalités de révision du forfait de charges : ${charges.revisionForfait}.`,
      `${lettrePaiement}. Modalités de paiement`,
      `- périodicité du paiement : ${paiement.periodicite} ;`,
      `- paiement ${paiement.terme} ;`,
      `- date ou période de paiement : ${paiement.date} ;`,
      paiement.lieu && `- lieu de paiement : ${paiement.lieu} ;`,
      `- montant total dû à la première échéance de paiement pour une période complète de location : ${euros(premiereEcheance(b))} (loyer : ${euros(loyer.mensuel)}${charges.montant !== undefined ? `, charges : ${euros(charges.montant)}` : ""}).`,
      `${lettreEnergie}. Dépenses énergétiques (pour information)`,
      `Montant estimé des dépenses annuelles d'énergie pour un usage standard de l'ensemble des usages énumérés dans le diagnostic de performance énergétique (chauffage, refroidissement, production d'eau chaude sanitaire, éclairage et auxiliaires de chauffage, de refroidissement, d'eau chaude sanitaire et de ventilation) mentionné à l'article L. 126-26 du code de la construction et de l'habitation : ${b.depensesEnergie.montant} (estimation réalisée à partir des prix énergétiques de référence de l'année : ${b.depensesEnergie.anneeReference}).`,
    ),
  };
}

function annexes(b: Bail): Section {
  const a = b.annexes;
  return {
    titre: "XI. Annexes",
    lignes: lignes(
      "Sont annexées et jointes au contrat de location les pièces suivantes :",
      b.logement.regime === "copropriété" &&
        "- un extrait du règlement concernant la destination de l'immeuble, la jouissance et l'usage des parties privatives et communes, et précisant la quote-part afférente au lot loué dans chacune des catégories de charges ;",
      "- un dossier de diagnostic technique comprenant :",
      "  - un diagnostic de performance énergétique ;",
      b.logement.periodeConstruction === "avant-1949" &&
        "  - un constat de risque d'exposition au plomb pour les immeubles construits avant le 1er janvier 1949 ;",
      a.amiante &&
        "  - une copie d'un état mentionnant l'absence ou la présence de matériaux ou de produits de la construction contenant de l'amiante ;",
      a.electriciteGaz &&
        "  - un état de l'installation intérieure d'électricité et de gaz, dont l'objet est d'évaluer les risques pouvant porter atteinte à la sécurité des personnes ;",
      a.etatDesRisques &&
        "  - un état des risques naturels et technologiques pour les zones couvertes par un plan de prévention des risques technologiques ou par un plan de prévention des risques naturels prévisibles, prescrit ou approuvé, ou dans des zones de sismicité ;",
      "- une notice d'information relative aux droits et obligations des locataires et des bailleurs ;",
      b.meuble ? "- un état des lieux, un inventaire et un état détaillé du mobilier ;" : "- un état des lieux ;",
      a.autorisationPrealable && "- une autorisation préalable de mise en location.",
    ),
  };
}

export function genererBail(b: Bail): DocumentBail {
  const nature = b.meuble ? "MEUBLÉ" : "NU";
  const plusieurs = b.locataires.length > 1;

  const sections: Section[] = [
    parties(b),
    objet(b),
    duree(b),
    conditionsFinancieres(b),
  ];

  if (b.travaux)
    sections.push({
      titre: "V. Travaux",
      lignes: [
        `A. Montant et nature des travaux d'amélioration ou de mise en conformité avec les caractéristiques de décence effectués depuis la fin du dernier contrat de location ou depuis le dernier renouvellement : ${b.travaux}`,
      ],
    });

  if (b.depotGarantie !== undefined)
    sections.push({
      titre: "VI. Garanties",
      lignes: [`Montant du dépôt de garantie de l'exécution des obligations du locataire : ${euros(b.depotGarantie)}.`],
    });

  if (plusieurs && b.solidarite)
    sections.push({
      titre: "VII. Clause de solidarité",
      lignes: [
        "Modalités particulières des obligations en cas de pluralité de locataires : les locataires sont tenus solidairement et indivisiblement de l'ensemble des obligations résultant du présent contrat.",
      ],
    });

  sections.push({
    titre: "VIII. Clause résolutoire",
    lignes: lignes(
      "Le contrat de location est résilié de plein droit pour défaut de paiement du loyer ou des charges aux termes convenus ou pour non versement du dépôt de garantie. La clause de résiliation de plein droit ne produit effet que six semaines après la date d'un commandement de payer demeuré infructueux.",
      "Le contrat de location est également résilié de plein droit pour la non-souscription d'une assurance des risques locatifs, cette clause ne produisant effet qu'un mois après un commandement demeuré infructueux, ainsi que pour le non-respect de l'obligation d'user paisiblement des locaux loués, résultant de troubles de voisinage constatés par une décision de justice passée en force de chose jugée.",
      b.logement.servitudeResidencePrincipale &&
        "Le logement étant soumis à l'obligation prévue à l'article L. 151-14-1 du code de l'urbanisme, le contrat est en outre résilié de plein droit pour le non-respect de l'obligation de l'occuper exclusivement à titre de résidence principale. Cette clause ne peut produire effet qu'à l'expiration d'un délai de mise en demeure fixé par le maire conformément au II de l'article L. 481-4 du code de l'urbanisme.",
    ),
  });

  if (b.autresConditions)
    sections.push({ titre: "X. Autres conditions particulières", lignes: [b.autresConditions] });

  sections.push(annexes(b), {
    titre: "Signatures",
    lignes: [
      `Le ${date(b.signature.date)}, à ${b.signature.lieu},`,
      "Signature du bailleur",
      `Signature du locataire${plusieurs ? " (chacun des colocataires)" : ""}`,
    ],
  });

  return {
    titre: `CONTRAT DE ${plusieurs ? "COLOCATION" : "LOCATION"} DE LOGEMENT ${nature}`,
    sousTitre: `(Soumis au titre Ier${b.meuble ? " bis" : ""} de la loi du 6 juillet 1989 tendant à améliorer les rapports locatifs et portant modification de la loi n° 86-1290 du 23 décembre 1986)`,
    sections,
  };
}
