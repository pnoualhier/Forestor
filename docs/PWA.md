# Progressive Web App (PWA) & Fonctionnement Déconnecté

Forestor est une application web progressive (PWA) installable sur ordinateur (Windows, macOS, Linux, ChromeOS) et smartphone/tablette (Android, iOS).

## 1. Caractéristiques PWA

- **Manifest Web App Conforme :**
  - Nom : `Forestor — Global Forest Resources Assessment`
  - Nom court : `Forestor` (≤ 12 caractères)
  - Display : `standalone`
  - Thème couleur : `#064e3b` (vert forêt profond)
  - Fond de démarrage : `#fafaf9`
  - Icônes : 192x192, 512x512, et 512x512 maskable avec marge de sécurité 15% pour Android.
  - Icône Apple Touch : 180x180 PNG pour iOS Safari.
- **Service Worker & Mise en cache :**
  - Configuré via `vite-plugin-pwa` avec Workbox.
  - Precaching de toutes les ressources statiques (HTML, CSS, JS, SVG, topologie mondiale).
  - Mise en cache runtime de la route `/fao-api/` avec stratégie `StaleWhileRevalidate`.

## 2. Bouton d'Installation Intégré

L'application intègre le composant `PWAInstallButton` :
- Sur Chrome/Edge/Android : Détecte l'événement `beforeinstallprompt` et déclenche l'installation native en un clic.
- Sur iOS Safari : Affiche un guide pas-à-pas (« Partager » > « Sur l’écran d’accueil »).
- Se masque automatiquement lorsque l'application s'exécute déjà en mode PWA (`standalone`).
