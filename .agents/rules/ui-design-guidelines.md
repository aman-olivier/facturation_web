---
name: "WebFacturation UI Design Guidelines"
description: "Directives de design et d'animation pour l'application SaaS WebFacturation (B2B Afrique Francophone)."
---

# WebFacturation UI & Design Guidelines

Tu interviens sur WebFacturation, un SaaS destiné aux entrepreneurs d'Afrique francophone. Les mots d'ordre pour ce projet sont **modernité, clarté, et un effet "Wahou"**.

Chaque nouvelle page ou composant que tu crées ou modifies DOIT impérativement respecter les règles de design suivantes. Le non-respect de ces règles cassera l'homogénéité du projet.

## 1. Animations & États au Survol (Hover)

Les éléments interactifs (comme les cartes de statistiques, les boutons complexes, etc.) ne doivent jamais être excessivement colorés au repos pour ne pas "agresser" l'œil. L'interface doit être neutre au repos et "s'allumer" au survol.

- **Look par défaut (Repos)** : Fond blanc (`bg-white`), bordures légères (`border-gray-200`), texte neutre (`text-gray-500` / `text-gray-900`).
- **Survol (Hover)** : Élévation et couleur subtile.
  - Utilise `group` sur le conteneur.
  - Ajoute les classes de transition : `transition-all duration-300 hover:-translate-y-1 hover:shadow-md`.
  - Colore légèrement la bordure et le fond : `hover:border-[couleur]-300 hover:bg-[couleur]-50/50`.
  - Anime le texte avec `group-hover:text-[couleur]-600`.
  - *Exemple* : `<div className="group border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-rose-300 hover:bg-rose-50/50">...</div>`

## 2. Badges de Statut (Haute Définition)

Les badges (Brouillon, Envoyée, Payée, En retard) doivent être nets, vifs et très lisibles.
- Ne pas utiliser de couleurs pastel plates sans bordures (qui donnent un effet flou ou délavé).
- **Règle absolue** : Utilise TOUJOURS un anneau intérieur (`ring-inset`) pour définir les contours.
- *Exemple Succès* : `bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20`
- *Exemple Erreur* : `bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20`
- *Exemple Warning* : `bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/20`
- *Exemple Neutre* : `bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-500/20`

## 3. Tableaux (Tables)

Les bordures des tableaux doivent être douces et subtiles pour un rendu "aérien" et premium.
- Utilise `border-gray-100` pour toutes les bordures internes (au lieu du `border-gray-200` par défaut).
- Au survol d'une ligne, ajoute un léger fond `hover:bg-gray-50/50`.

## 4. Layout et Responsivité

- L'interface utilise une barre latérale sur grand écran (Desktop) et une barre de navigation supérieure avec menu hamburger sur mobile.
- Les conteneurs de page principaux doivent toujours avoir un padding adapté : `p-4 md:p-6 max-w-6xl mx-auto space-y-8`.
- Évite les cartes ou sections trop hautes. Ajuste le padding (`p-4` au lieu de `p-6`) et l'espacement vertical (`space-y-1` au lieu de `space-y-2`) si le contenu a l'air trop "large" verticalement.
- Pense systématiquement Mobile-First pour les grilles : `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`.

## 5. Couleurs de la Marque

- Couleur principale (Primaire) : Bleu vif (ex: `blue-600`).
- Arrière-plan de la page : Très léger gris ou blanc (`bg-gray-50/40` ou équivalent).
- Les ombres doivent rester très douces (`shadow-sm` par défaut, `shadow-md` au survol).
