# Bail Express — Contexte projet

## Ce que c'est

Site web SaaS qui guide les propriétaires bailleurs via un questionnaire pour générer automatiquement leurs documents de location (bail + état des lieux + inventaire) en PDF prêt à imprimer.

**Modèle :** one-shot, pas d'abonnement. Le proprio paie une seule fois à chaque changement de locataire.
- Pack Meublé : bail + état des lieux + inventaire + grille de vétusté
- Pack Non Meublé : bail + état des lieux

**Stack :** Next.js 16 (App Router, TypeScript), Tailwind CSS, Zustand, Stripe, Resend, Vercel Blob, Vercel (hébergement)

---

## Ce qui est fait

### Epic 1 — Légal & Conception (partiel)
- Templates des 4 documents rédigés dans `D:\Documents\Développement-Web\Idees-programmes\templates\` :
  - `bail-meuble.md` — toutes clauses obligatoires loi ALUR, décret 2015-587
  - `bail-vide.md` — idem, avec différences clés (durée 3 ans, DG 1 mois, forfait charges interdit)
  - `etat-des-lieux.md` — décret 2016-382, pièce par pièce dynamique
  - `annexes-checklist.md` — tous les diagnostics obligatoires selon ancienneté du logement
- Validation juridique : **volontairement reportée** (approche Lean Startup). Mention de disclaimer à ajouter dans les PDFs.

### Epic 2 — Setup technique (complet)
- Projet Next.js 16 initialisé avec TypeScript, Tailwind, App Router, `src/` directory
- Structure de dossiers complète (voir ci-dessous)
- Dépendances installées : `zustand`, `stripe`, `@stripe/stripe-js`, `resend`, `@vercel/blob`
- `src/types/index.ts` — tous les types TypeScript du wizard (WizardData, Etape1..7, Bailleur, Locataire, etc.)
- `src/store/wizard-store.ts` — store Zustand avec persist (localStorage), reset, updateData
- `src/lib/stripe.ts` — client Stripe initialisé
- `src/lib/resend.ts` — client Resend initialisé
- `.env.example` commité, `.env.local` ignoré par Git (à remplir avec les vraies clés)
- Premier commit Git effectué

### Comptes à créer (pas encore fait)
- [ ] Vercel — gratuit, lier au repo GitHub pour déploiement auto
- [ ] Stripe — récupérer clés test + créer 2 produits (Pack Meublé / Pack Vide)
- [ ] Resend — clé API + vérifier le domaine email
- [ ] Nom de domaine — pointé vers Vercel (pas vers l'hébergement WordPress)

---

## Structure du projet

```
src/
├── app/
│   ├── page.tsx               ← landing page (Epic 6)
│   ├── wizard/page.tsx        ← questionnaire multi-étapes (Epic 3) ← PROCHAIN
│   ├── recapitulatif/page.tsx ← récapitulatif + CTA paiement
│   ├── success/page.tsx       ← confirmation après paiement
│   └── api/
│       ├── generate-pdf/      ← génération PDF (Epic 4)
│       ├── create-checkout-session/ ← Stripe (Epic 5)
│       └── webhook/           ← Stripe webhook (Epic 5)
├── components/
│   ├── wizard/                ← composants du formulaire (Epic 3)
│   └── ui/                    ← boutons, inputs, etc.
├── lib/
│   ├── stripe.ts              ✅
│   ├── resend.ts              ✅
│   └── pdf/                   ← logique génération (Epic 4)
├── store/
│   └── wizard-store.ts        ✅ Zustand + persist
└── types/
    └── index.ts               ✅ tous les types
```

---

## Le questionnaire (8 étapes)

| Étape | Contenu | Conditionnel |
|---|---|---|
| 1 | Type de bail (meublé/vide) + usage | — |
| 2 | Informations bailleur (physique ou morale) | — |
| 3 | Locataire(s) — répétition dynamique | — |
| 4 | Logement — dont nb de pièces/chambres | — |
| 5 | Conditions financières | DG max 1 mois si vide, 2 si meublé |
| 6 | Inventaire des meubles pièce par pièce | Meublé uniquement |
| 7 | État des lieux (compteurs, clés, état par pièce) | Pièces générées selon étape 4 |
| 8 | Récapitulatif + paiement Stripe | — |

**Logique clé :** le nombre de pièces/chambres saisi à l'étape 4 génère dynamiquement les sections des étapes 6 et 7.

---

## Documents générés

| Document | Pack Meublé | Pack Vide |
|---|---|---|
| Bail de location | ✅ | ✅ |
| État des lieux d'entrée | ✅ | ✅ |
| Inventaire des meubles | ✅ | ❌ |
| Grille de vétusté | ✅ | ❌ |

---

## Décisions produit actées

- Le proprio déclare le nombre de pièces → le formulaire s'adapte dynamiquement
- PDF livré par email + lien de téléchargement — signature à la charge du proprio
- Deux packs distincts (Meublé / Vide) — prix à fixer
- Validation juridique des templates reportée au post-MVP
- Hébergement : Vercel (gratuit), PAS l'hébergement WordPress existant

## Hors scope MVP
- État des lieux de sortie
- Quittances de loyer
- Espace propriétaire / historique
- Inventaire par photo (IA vision) — prévu en V2

---

## Commandes utiles

```bash
npm run dev       # démarrer en local → http://localhost:3000
npm run build     # build de production
npm run lint      # vérification ESLint
```

---

## Variables d'environnement requises

Voir `.env.example` à la racine. Copier en `.env.local` et remplir :
- `STRIPE_SECRET_KEY` + `STRIPE_PUBLISHABLE_KEY` + `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ID_MEUBLE` + `STRIPE_PRICE_ID_VIDE`
- `RESEND_API_KEY`
- `BLOB_READ_WRITE_TOKEN`
- `NEXT_PUBLIC_APP_URL`
