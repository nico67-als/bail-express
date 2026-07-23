# Tâches — 5 prochaines heures

> Objectif : avoir un wizard fonctionnel de bout en bout (sans PDF ni paiement encore).

---

## Heure 1 — Comptes & environnement (à faire toi-même)

- [ ] Créer compte Vercel → lier au repo GitHub → récupérer token si besoin
- [ ] Créer compte Stripe → Dashboard → Clés API → copier `sk_test_...` et `pk_test_...`
- [ ] Dans Stripe : créer 2 produits (Pack Meublé ~29€ / Pack Vide ~25€) → copier les `price_...`
- [ ] Créer compte Resend → créer une clé API → copier `re_...`
- [ ] Remplir `.env.local` avec toutes les clés récupérées
- [ ] Acheter le nom de domaine (OVH ou Namecheap)
- [ ] `npm run dev` → vérifier que le projet tourne sur http://localhost:3000

---

## Heure 2 — Composants UI de base (avec Claude)

- [ ] `src/components/ui/Button.tsx` — bouton primaire / secondaire / outline
- [ ] `src/components/ui/Input.tsx` — champ texte avec label + message d'erreur
- [ ] `src/components/ui/Select.tsx` — liste déroulante
- [ ] `src/components/ui/RadioGroup.tsx` — groupe de boutons radio
- [ ] `src/components/ui/Stepper.tsx` — barre de progression du wizard (étapes 1 à 8)
- [ ] `src/components/wizard/WizardLayout.tsx` — layout avec stepper + boutons Précédent/Suivant

---

## Heure 3 — Étapes 1, 2 et 3 du wizard (avec Claude)

- [ ] `src/app/wizard/page.tsx` — page principale qui orchestre les étapes
- [ ] `src/components/wizard/Etape1.tsx` — type de bail + usage
- [ ] `src/components/wizard/Etape2.tsx` — informations bailleur (physique / morale)
- [ ] `src/components/wizard/Etape3.tsx` — locataire(s) avec ajout dynamique

---

## Heure 4 — Étapes 4 et 5 du wizard (avec Claude)

- [ ] `src/components/wizard/Etape4.tsx` — logement (surface, pièces, DPE, diagnostics)
- [ ] `src/components/wizard/Etape5.tsx` — conditions financières (loyer, charges, DG, IRL)
- [ ] Tester la navigation entre les 5 premières étapes

---

## Heure 5 — Étapes 6 et 7 du wizard (avec Claude)

- [x] `src/components/wizard/Etape6.tsx` — inventaire meubles (pièces dynamiques, meublé seulement)
- [x] `src/components/wizard/Etape7.tsx` — état des lieux (compteurs + pièces dynamiques)
- [x] `src/components/wizard/Etape8.tsx` — récapitulatif de toutes les données saisies
- [x] Test complet du tunnel étape 1 → 8 avec des données réelles

---

## Epic 4 — Génération des PDF (fait)

- [x] Composants `@react-pdf/renderer` des 4 documents (`src/lib/pdf/`)
- [x] Route `/api/generate-pdf` (POST WizardData -> un seul PDF téléchargeable)
- [x] Testé en conditions réelles (bail meublé 9 pages, bail vide 6 pages, validation 400 si étape incomplète)

## Ensuite (Epic 5 — session suivante)

- Checkout Stripe (`/api/create-checkout-session` + webhook) pour débloquer la génération
- Email de livraison du PDF via Resend (avec le rappel des annexes à fournir, cf. `annexes-checklist.md`)
- Brancher le bouton "Continuer" de l'étape 8 sur le vrai paiement
