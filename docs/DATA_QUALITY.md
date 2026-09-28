# Charte de Qualité et Intégrité des Données — Forestor

## Règle d'or : null ≠ 0

Dans les sciences forestières et les inventaires statistiques internationaux :
- Une valeur `0` signifie que le phénomène a été mesuré et est égal à zéro (par exemple, 0 hectare de forêt de plantation).
- Une valeur `null` ou absente signifie que la donnée **n'a pas été mesurée, n'est pas applicable, ou n'a pas été communiquée par l'État membre**.

### Cas d'école : Forêts Primaires en Europe
La France, l'Allemagne ou le Royaume-Uni renvoient `primaryForest: null` dans le FRA 2025. Cela ne signifie pas que ces pays n'ont pas de vieux boisements, mais qu'ils n'appliquent pas la catégorie d'inventaire de forêt primaire vierge non perturbée.
**Convertir ce `null` en `0` serait une erreur scientifique majeure.**

---

## Vérifications implémentées dans le code

1. **Pas de valeur par défaut numérique :**
   ```typescript
   // INTERDIT :
   const area = node.raw || 0;

   // OBLIGATOIRE DANS FORESTOR :
   const area = node.raw !== null && node.raw !== undefined ? Number(node.raw) : null;
   ```

2. **Graphiques temporels sans interpolation trompeuse :**
   Lorsqu'une année intermédiaire manque dans une série chronologique, la courbe SVG s'interrompt pour laisser un vide visuel plutôt que de tracer une fausse ligne droite reliant deux points distants.

3. **Cartes choroplèthes avec motif distinct pour l'absence de donnée :**
   Les pays sans données disponibles reçoivent une teinte grise hachurée (`MISSING_COLOR`), nettement séparée de la palette chromatique verte représentant les valeurs quantifiées.
