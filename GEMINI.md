# Documentation Projet : WebFacturation (Ahimou Corp)

Ce fichier `GEMINI.md` sert de point de référence central pour l'architecture, les décisions de design et les consignes futures de ce projet. Il doit être fourni en contexte à toute IA (Gemini ou autre) reprenant le développement de l'application.

## 1. Ce que fait l'application
**WebFacturation** est un tableau de bord SaaS moderne de gestion de factures et de devis destiné aux agences et freelances. Il permet de gérer les clients, de créer des devis professionnels, de les convertir en factures, d'effectuer le suivi des encaissements et de générer des PDF, avec une interface très orientée "Premium" et fluide.

## 2. Fonctionnalités implémentées

- **Dashboard Principal (`/`)** :
  - Métriques d'encaissements et de factures en retard.
  - Liste des factures avec recherche globale (client, date, montant, statut, n° de facture).
  - Filtres dynamiques (Statut) et tris (Date, Montant, Alphabétique).
  - Modification rapide du statut des factures via un menu déroulant ("Brouillon", "Envoyée", "Payée", "En retard").

- **Système de Factures (`/invoices` et `/invoices/new`)** :
  - Formulaire de création de facture dynamique avec lignes d'articles, auto-calcul des totaux et de la TVA (18%).
  - Aperçu en temps réel (split-screen).
  - Persistance locale (`localStorage`) des factures créées.
  - Modale de succès proposant le téléchargement PDF (via l'outil d'impression natif du navigateur) et le retour à la liste.

- **Système de Devis (`/quotes`, `/quotes/new`, `/quotes/[id]`)** :
  - Tableau de bord spécifique de devis avec statuts personnalisés ("En cours de validation", "Annulé par le client", "En construction", "Accepté").
  - Formulaire simple de création de devis (`/quotes/new`) utilisant des menus déroulants pour les clients et produits.
  - Éditeur avancé de devis (`/quotes/[id]`) avec un design complexe (badges spécifiques, fond "jaune léger" pour les brouillons, boutons d'action d'expédition rouge/vert).

- **Paramètres Centralisés (`/settings`)** :
  - Page de gestion du profil de l'entreprise (Nom, Email, RCCM, IBAN, Notes par défaut).
  - Les modifications sont enregistrées en `localStorage` avec notification par "Toast" (bannière de succès).
  - **Répercussion dynamique** : Les informations saisies dans les paramètres modifient automatiquement le contenu des factures créées (Nom de l'émetteur, banque, signature, etc.).

## 3. Technologies utilisées
- **Framework** : Next.js 15 (App Router).
- **Style** : Tailwind CSS v4 (utilisant majoritairement des utilitaires Tailwind sans configuration complexe).
- **Icônes** : `lucide-react`.
- **UI Components** : Composants React personnalisés fortement inspirés de shadcn/ui (situés dans `@/components/ui/`).
- **Base de données actuelle** : Mock via `localStorage` (clé `webfacturation_invoices`, `webfacturation_settings`).

## 4. Structure des Fichiers Principale
```
/app
 ├── page.tsx                  # Dashboard principal
 ├── layout.tsx                # Layout principal (Sidebar et Header globaux)
 ├── /invoices
 │    ├── page.tsx             # Liste des factures
 │    └── /new/page.tsx        # Création d'une nouvelle facture
 ├── /quotes
 │    ├── page.tsx             # Liste des devis
 │    ├── /new/page.tsx        # Formulaire intermédiaire de création de devis
 │    └── /[id]/page.tsx       # Tableau de bord détaillé (Aperçu) d'un devis
 ├── /settings
 │    └── page.tsx             # Gestion des paramètres de l'application
/components
 └── /ui                       # Composants réutilisables (Button, Card, Input, Select, Table, Badge...)
```

## 5. Décisions de Design (Aesthetics)
- **Règle d'or de l'UI** : L'interface doit être époustouflante (Premium/Wow-effect). 
- **Code Couleurs** : Utilisation d'un thème propre, minimaliste. 
  - Boutons principaux en `bg-blue-600`.
  - Fonds de page en `bg-gray-50`.
  - Badges de statuts visuels (vert pour payé/accepté, rouge pour en retard, jaune pour construction).
- **Interactions** : 
  - Bannières de succès temporaires pour les petites actions (sauvegardes de paramètres).
  - Modales sombres avec flou (`backdrop-blur-sm`) pour les actions majeures (Génération de facture terminée).
- **UX** : L'utilisateur ne doit pas ressaisir les informations communes (l'adresse de son entreprise ou ses infos bancaires). Tout est lu depuis le composant `Settings`.

## 6. Instructions Futures pour le Modèle IA
Lors d'une prochaine session ou évolution du projet, l'IA devra :

1. **Règle Globale de Courtoisie** : Le modèle doit toujours dire "Bonjour Aman" au début de chaque nouvelle discussion (Règle `<user_global>`).
2. **Transition Backend (Priorité 1)** :
   - Abandonner le `localStorage`.
   - Mettre en place une vraie base de données (ex: Prisma + PostgreSQL, ou Supabase).
   - Créer les Server Actions / API Routes Next.js pour créer, lire et modifier les factures/devis/paramètres de manière persistante côté serveur.
3. **Harmonisation des Dates** : 
   - Toujours forcer le format de date `DD/MM/YYYY` à l'affichage pour éviter les conflits d'interfaces.
4. **Devis - Prochaine étape** : 
   - Terminer l'intégration de la création de Devis (`/quotes/new`) pour que ses valeurs s'injectent dynamiquement dans l'éditeur complexe (`/quotes/[id]`), à la manière de ce qui a été fait pour les paramètres et les factures.
5. **Authentification** : 
   - Ajouter un système de login (ex: NextAuth.js ou Clerk) pour isoler les données si l'application devient multi-tenant.
