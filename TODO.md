# Tâches — 5 prochaines heures

> Objectif : avoir un wizard fonctionnel de bout en bout (sans PDF ni paiement encore).

---

## Heure 1 — Comptes & environnement (à faire toi-même)

- [x] Créer compte Vercel → lier au repo GitHub → déployer le site
- [x] Créer compte Stripe → Dashboard → Clés API → copier `sk_test_...` et `pk_test_...`
- [x] Dans Stripe : créer 2 produits (Pack Meublé 29€ / Pack Vide 19€) → copier les `price_...`
- [x] Créer compte Resend → créer une clé API → copier `re_...`
- [x] Vérifier le domaine `bail-express.fr` dans Resend (vérifié)
- [x] Créer un store Vercel Blob → copier `BLOB_READ_WRITE_TOKEN`
- [x] Une fois déployé (ou via `stripe listen` en local) : enregistrer le webhook `/api/webhook` → copier `STRIPE_WEBHOOK_SECRET`
- [x] Acheter le nom de domaine → `bail-express.fr` (Infomaniak)
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

## Epic 5 — Paiement Stripe et livraison email (code fait, à vérifier en conditions réelles)

- [x] `/api/create-checkout-session` : stocke le wizard sur Blob, crée la session Stripe
- [x] `/api/webhook` : régénère le PDF, l'héberge sur Blob (privé), l'envoie par email (Resend)
- [x] `/api/download/[sessionId]` : sert le PDF depuis Blob privé après vérification du paiement Stripe (le store Blob ne peut être créé qu'en privé, pas de lien public possible)
- [x] `/success` : confirme le paiement auprès de Stripe
- [x] Étape 8 branchée sur le vrai checkout
- [x] Envoi depuis `noreply@bail-express.fr` avec `reply-to` vers `contact@bail-express.fr` (boîte créée chez Infomaniak)
- [ ] Ajouter `STRIPE_WEBHOOK_SECRET`, `RESEND_FROM_EMAIL` et `RESEND_REPLY_TO_EMAIL` dans les variables d'environnement Vercel (production) + redéployer
- [ ] Test de bout en bout avec un vrai paiement test Stripe (toutes les clés sont maintenant réelles)

## Ensuite

- Rappel des annexes à fournir dans l'email de livraison (cf. `annexes-checklist.md`) — actuellement un simple rappel générique, pas encore personnalisé selon la période de construction du logement
- Nom de domaine + déploiement Vercel
