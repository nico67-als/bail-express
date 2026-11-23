import { describe, expect, it } from "vitest";
import { dureeBail, genererBail } from "./modele";
import { schemaBail } from "./schema";

const base = {
  meuble: true,
  bailleurs: [{ qualite: "personne-physique", nom: "Jean Martin", adresse: "3 rue des Lilas, 67000 Strasbourg" }],
  locataires: [{ nom: "Léa Dubois", email: "lea@example.com" }],
  logement: {
    adresse: "12 rue du Dôme, 67000 Strasbourg, 2e étage, porte gauche",
    identifiantFiscal: "670000000001",
    typeHabitat: "collectif",
    regime: "copropriété",
    periodeConstruction: "avant-1949",
    surface: 42.5,
    piecesPrincipales: 2,
    chauffage: "individuel",
    eauChaude: "individuelle",
    classeDpe: "D",
    destination: "habitation",
  },
  dateEffet: "2027-01-01",
  loyer: { mensuel: 750 },
  charges: { modalite: "provisions", montant: 50 },
  paiement: { terme: "à échoir", date: "le 5 de chaque mois" },
  depensesEnergie: { montant: "entre 900 € et 1 250 €", anneeReference: 2023 },
  depotGarantie: 1500,
  annexes: {},
  signature: { date: "2026-12-20", lieu: "Strasbourg" },
};

const texte = (b: unknown) =>
  genererBail(schemaBail.parse(b))
    .sections.flatMap((s) => [s.titre, ...s.lignes])
    .join("\n")
    .replace(/[  ]/g, " "); // espaces insécables du format monétaire fr-FR

describe("schéma du bail", () => {
  it("accepte un bail meublé complet", () => {
    expect(schemaBail.safeParse(base).success).toBe(true);
  });

  it("refuse un dépôt de garantie au-delà du plafond légal", () => {
    expect(schemaBail.safeParse({ ...base, meuble: false }).success).toBe(false);
  });

  it("refuse un loyer au-dessus du loyer de référence majoré", () => {
    const loyer = { mensuel: 750, loyerReference: { reference: 14, majore: 16.8 } }; // 17,65 €/m²
    expect(schemaBail.safeParse({ ...base, loyer }).success).toBe(false);
  });

  it("refuse le bail étudiant en location vide", () => {
    expect(schemaBail.safeParse({ ...base, meuble: false, etudiant: true, depotGarantie: 750 }).success).toBe(false);
  });
});

describe("durée du bail", () => {
  it("dépend du type de location et du bailleur", () => {
    const vide = { ...base, meuble: false, depotGarantie: 750 };
    const sci = { qualite: "personne-morale", nom: "SCI Martin", adresse: "Strasbourg" };
    expect(dureeBail(schemaBail.parse(base))).toBe("un an");
    expect(dureeBail(schemaBail.parse({ ...base, etudiant: true }))).toBe("neuf mois");
    expect(dureeBail(schemaBail.parse(vide))).toBe("trois ans");
    expect(dureeBail(schemaBail.parse({ ...vide, bailleurs: [sci] }))).toBe("six ans");
    expect(dureeBail(schemaBail.parse({ ...vide, bailleurs: [{ ...sci, sciFamiliale: true }] }))).toBe("trois ans");
  });
});

describe("texte du bail", () => {
  it("reprend les valeurs et les annexes propres au meublé", () => {
    const t = texte(base);
    expect(t).toContain("identifiant fiscal du logement : 670000000001");
    expect(t).toContain("Montant du loyer mensuel : 750,00 €");
    expect(t).toContain("première échéance de paiement pour une période complète de location : 800,00 €");
    expect(t).toContain("constat de risque d'exposition au plomb");
    expect(t).toContain("un inventaire et un état détaillé du mobilier");
    expect(t).not.toContain("Clause de solidarité");
  });

  it("omet les rubriques « le cas échéant » non renseignées", () => {
    const t = texte({ ...base, logement: { ...base.logement, periodeConstruction: "depuis-2005", regime: "monopropriété" } });
    expect(t).not.toContain("plomb");
    expect(t).not.toContain("règlement concernant la destination de l'immeuble");
    expect(t).not.toContain("zones tendues");
    expect(t).not.toContain("dernier locataire");
  });

  it("ajoute la solidarité en colocation", () => {
    const doc = genererBail(schemaBail.parse({ ...base, locataires: [{ nom: "Léa Dubois" }, { nom: "Tom Petit" }] }));
    expect(doc.titre).toBe("CONTRAT DE COLOCATION DE LOGEMENT MEUBLÉ");
    expect(doc.sections.map((s) => s.titre)).toContain("VII. Clause de solidarité");
  });
});
