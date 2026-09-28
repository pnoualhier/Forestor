# Guide de Contribution — Forestor

Bienvenue sur le projet Forestor !

## 1. Principes de contribution

1. **Priorité absolue à la neutralité et à la rigueur des données.** Aucun ajout d'indicateur ne doit déroger aux définitions officielles de la FAO.
2. **Ne jamais inventer d'endpoint API ni de valeur par défaut.** Tout nouvel indicateur doit pointer vers une variable vérifiée dans l'OpenAPI Swagger du FRA 2025.
3. **Respect strict de l'accessibilité et de l'internationalisation (FR/EN).** Chaque nouveau libellé doit être présent dans `src/i18n/fr.ts` et `src/i18n/en.ts`.

## 2. Commandes de développement

```bash
# Installation des dépendances
npm install

# Lancement du serveur de développement (port 3000)
npm run dev

# Exécution des tests unitaires et d'intégrité
npm run test

# Validation des types TypeScript
npm run lint

# Compilation pour la production
npm run build

# Prévisualisation du bundle de production
npm run preview
```
