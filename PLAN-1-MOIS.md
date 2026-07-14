# Bail Express — Plan sur 1 mois

> Objectif : passer d'un projet à ~15–20 % (fondations posées, wizard non commencé) à un MVP **en ligne et vendable**, puis lancer l'acquisition.

---

## État des lieux au démarrage

| Epic | État | Détail |
|---|---|---|
| 1 — Légal / templates | ✅ ~80 % | 4 templates Markdown rédigés, disclaimer à intégrer aux PDFs |
| 2 — Setup technique | ✅ 100 % | Types, store Zustand, clients Stripe/Resend, `.env.local` rempli |
| 3 — Wizard | ❌ 0 % | Aucun composant créé — le gros morceau |
| 4 — Génération PDF | 🟡 5 % | `@react-pdf/renderer` installé, aucun template codé |
| 5 — Paiement / livraison | 🟡 5 % | Client Stripe initialisé, pas de checkout ni webhook |
| 6 — Landing page | 🟡 en cours | `page.tsx` / `layout.tsx` réécrits, à commiter |

**Premier réflexe :** commiter le travail en cours (landing + react-pdf).

**Contexte marché :** les recherches « bail meublé / état des lieux » piquent pendant la saison de rotation étudiante — chaque semaine gagnée sur la mise en ligne, c'est du trafic de pointe capté.

---

## Semaine 1 — Le wizard complet

Exécuter le TODO existant (voir `TODO.md`) :

- [ ] Commiter le travail en cours (landing + dépendance react-pdf)
- [ ] Composants UI de base : Button, Input, Select, RadioGroup, Stepper, WizardLayout
- [ ] Les 8 étapes du wizard avec logique conditionnelle (meublé/vide, pièces dynamiques)
- [ ] Persistance des données dans le store Zustand (déjà en place, à brancher)
- [ ] Côté perso (~30 min) : acheter le domaine + créer le projet Vercel

**Jalon : je peux remplir le questionnaire en entier, de l'étape 1 au récapitulatif.**

---

## Semaine 2 — Les PDFs

Le cœur de la valeur produit — la semaine la plus dense.

- [ ] Porter les 4 templates Markdown en composants `@react-pdf/renderer` :
  - Bail meublé / bail vide (80 % de structure commune → factoriser)
  - État des lieux d'entrée (pièces dynamiques)
  - Inventaire des meubles + grille de vétusté
- [ ] Intégrer le disclaimer juridique dans chaque document
- [ ] Brancher `/api/generate-pdf` sur les données du wizard
- [ ] Générer un jeu complet de PDFs depuis une saisie réelle

**Jalon : je peux imprimer mon bail.**

---

## Semaine 3 — Paiement, livraison, mise en ligne

- [ ] Stripe Checkout (`/api/create-checkout-session`) avec les 2 packs
- [ ] Webhook Stripe → génération PDFs → upload Vercel Blob
- [ ] Email Resend avec lien de téléchargement
- [ ] Page `/success`
- [ ] Déploiement Vercel + domaine pointé
- [ ] Produits Stripe en mode live + test avec une vraie carte

**Jalon : quelqu'un peut m'acheter un pack. C'est la ligne d'arrivée MVP.**

---

## Semaine 4 — Acquisition

Le produit existe, on le fait connaître. Cible SEO : le **meublé** (faible concurrence, forte intention).

- [ ] Finaliser la landing (SEO on-page, titres orientés meublé)
- [ ] 3–4 pages produit d'appel avec version gratuite téléchargeable :
  - Grille de vétusté PDF gratuite
  - Modèle état des lieux meublé vierge
  - Modèle inventaire location meublée
  - (mots-clés à difficulté SEO 14–19, ~3 000 recherches/mois cumulées)
- [ ] Test Google Ads petit budget (150–200 €) sur « contrat location meublé » / « état des lieux meublé » → mesurer la conversion
- [ ] Premiers posts utiles dans 2–3 groupes Facebook de bailleurs (répondre aux questions, pas de pub)

**Jalon : premières données de conversion réelles.**

---

## Risques identifiés

1. **La semaine PDF qui déborde** — 4 documents avec sections dynamiques, c'est le poste le plus incertain. Plan B : lancer avec le Pack Vide seul (2 documents), le meublé suit une semaine après.
2. **Le perfectionnisme sur le wizard** — validation, animations et cas limites peuvent manger la semaine 1. Version brute d'abord, peaufinage avec les retours des premiers acheteurs.

---

## Après ce mois (rappel hors scope MVP)

- État des lieux de sortie, quittances, espace propriétaire
- Inventaire par photo (IA vision) — V2, premier vrai différenciant défendable
- Plan éditorial SEO complet sur la longue traîne meublé
