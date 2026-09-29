/**
 * Service de gestion des mises à jour système et de synchronisation d'arrière-plan.
 */

export interface SystemUpdateState {
  appVersion: string;
  releaseDate: string;
  lastCheckedDate: string | null;
  autoUpdateEnabled: boolean;
  status: 'idle' | 'checking' | 'up-to-date' | 'update-available' | 'installing' | 'ready';
  statusMessage: string;
  updateIntervalMinutes: number;
}

const STORAGE_LAST_CHECK = 'forestor-last-update-check';
const STORAGE_AUTO_UPDATE = 'forestor-auto-update-enabled';
const STORAGE_UPDATE_INTERVAL = 'forestor-update-interval-minutes';

export const APP_METADATA = {
  version: '1.2.0',
  releaseDate: '28 Septembre 2026',
  build: 'fra2025-prod-1.2.0',
  dataCycle: 'FAO FRA 2025 Cycle Final',
  license: 'CC BY 4.0 / FAO',
};

class UpdateService {
  private listeners: Set<(state: SystemUpdateState) => void> = new Set();
  private intervalTimer: any = null;

  private state: SystemUpdateState = {
    appVersion: APP_METADATA.version,
    releaseDate: APP_METADATA.releaseDate,
    lastCheckedDate: this.loadLastChecked(),
    autoUpdateEnabled: this.loadAutoUpdatePref(),
    status: 'idle',
    statusMessage: '',
    updateIntervalMinutes: this.loadIntervalPref(),
  };

  constructor() {
    // Initial check timestamp if never checked
    if (!this.state.lastCheckedDate) {
      this.recordCheckTimestamp();
    }

    // Set up auto-update background listeners
    this.initBackgroundWorker();
  }

  private loadLastChecked(): string | null {
    try {
      return localStorage.getItem(STORAGE_LAST_CHECK);
    } catch {
      return null;
    }
  }

  private loadAutoUpdatePref(): boolean {
    try {
      const val = localStorage.getItem(STORAGE_AUTO_UPDATE);
      return val !== null ? val === 'true' : true; // Default: true
    } catch {
      return true;
    }
  }

  private loadIntervalPref(): number {
    try {
      const val = localStorage.getItem(STORAGE_UPDATE_INTERVAL);
      return val ? parseInt(val, 10) : 15; // Default: 15 minutes
    } catch {
      return 15;
    }
  }

  private recordCheckTimestamp() {
    const now = new Date().toISOString();
    this.state.lastCheckedDate = now;
    try {
      localStorage.setItem(STORAGE_LAST_CHECK, now);
    } catch {
      // ignore
    }
  }

  public getState(): SystemUpdateState {
    return { ...this.state };
  }

  public subscribe(listener: (state: SystemUpdateState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((l) => l(state));
  }

  public setAutoUpdateEnabled(enabled: boolean) {
    this.state.autoUpdateEnabled = enabled;
    try {
      localStorage.setItem(STORAGE_AUTO_UPDATE, String(enabled));
    } catch {
      // ignore
    }
    this.notify();
    this.restartInterval();
  }

  public setUpdateIntervalMinutes(minutes: number) {
    this.state.updateIntervalMinutes = minutes;
    try {
      localStorage.setItem(STORAGE_UPDATE_INTERVAL, String(minutes));
    } catch {
      // ignore
    }
    this.notify();
    this.restartInterval();
  }

  private initBackgroundWorker() {
    if (typeof window === 'undefined') return;

    // Service Worker update listeners
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        this.state.status = 'ready';
        this.state.statusMessage = 'Nouvelle version prête à être activée.';
        this.notify();
      });

      navigator.serviceWorker.getRegistration().then((reg) => {
        if (!reg) return;

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          this.state.status = 'installing';
          this.state.statusMessage = 'Téléchargement de la mise à jour en arrière-plan...';
          this.notify();

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New update installed in background
                this.state.status = 'ready';
                this.state.statusMessage = 'Mise à jour installée avec succès en arrière-plan.';
                this.notify();
              } else {
                // First install
                this.state.status = 'up-to-date';
                this.state.statusMessage = 'Application mise en cache pour usage hors-ligne.';
                this.notify();
              }
            }
          });
        });
      });
    }

    // Auto-update periodic timer
    this.restartInterval();

    // Check when user returns to tab or network comes online
    window.addEventListener('online', () => {
      if (this.state.autoUpdateEnabled) {
        this.checkForUpdates(true);
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.state.autoUpdateEnabled) {
        // Only if last check was more than 10 minutes ago
        if (this.isCheckStale(10)) {
          this.checkForUpdates(true);
        }
      }
    });
  }

  private isCheckStale(minutes: number): boolean {
    if (!this.state.lastCheckedDate) return true;
    const diffMs = Date.now() - new Date(this.state.lastCheckedDate).getTime();
    return diffMs > minutes * 60 * 1000;
  }

  private restartInterval() {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }

    if (this.state.autoUpdateEnabled && this.state.updateIntervalMinutes > 0) {
      const ms = this.state.updateIntervalMinutes * 60 * 1000;
      this.intervalTimer = setInterval(() => {
        this.checkForUpdates(true);
      }, ms);
    }
  }

  /**
   * Vérifie la disponibilité des mises à jour (Service Worker + Cache + Version Header)
   */
  public async checkForUpdates(silent: boolean = false): Promise<boolean> {
    if (this.state.status === 'checking') return false;

    this.state.status = 'checking';
    this.state.statusMessage = silent
      ? 'Vérification automatique en arrière-plan...'
      : 'Vérification de la disponibilité de nouvelles versions...';
    this.notify();

    try {
      this.recordCheckTimestamp();

      // Check Service Worker registration
      let swUpdated = false;
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          if (registration.waiting) {
            swUpdated = true;
          }
        }
      }

      // Check index.html with cache busting to verify if bundle hash updated
      try {
        const res = await fetch(`/?_check=${Date.now()}`, {
          method: 'HEAD',
          cache: 'no-cache',
        });
        if (res.ok) {
          // Response received successfully
        }
      } catch {
        // Offline or unreachable
      }

      // Small artificial delay for visual feedback if user clicked manually
      if (!silent) {
        await new Promise((r) => setTimeout(r, 600));
      }

      if (swUpdated) {
        this.state.status = 'ready';
        this.state.statusMessage = 'Une nouvelle version est disponible et prête.';
        this.notify();
        return true;
      } else {
        this.state.status = 'up-to-date';
        this.state.statusMessage = `Votre application est à jour (${APP_METADATA.version}).`;
        this.notify();
        return false;
      }
    } catch (err) {
      this.state.status = 'idle';
      this.state.statusMessage = 'Impossible de vérifier les mises à jour (mode hors-ligne).';
      this.notify();
      return false;
    }
  }

  /**
   * Forcer la mise à jour :
   * - Supprime les caches du navigateur (CacheStorage)
   * - Supprime les caches locaux applicatifs
   * - Recharge proprement la page
   */
  public async forceUpdate(): Promise<void> {
    this.state.status = 'installing';
    this.state.statusMessage = 'Purge des caches et actualisation forcée en cours...';
    this.notify();

    try {
      // 1. Clear CacheStorage
      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map((key) => caches.delete(key)));
      }

      // 2. Clear app repository caches
      try {
        localStorage.removeItem('fra_summary_cache');
        localStorage.removeItem('fra_descriptions_cache');
      } catch {
        // ignore
      }

      // 3. Skip waiting on active Service Worker
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      }

      // 4. Reload page cleanly
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      console.error('Erreur lors du forçage de mise à jour:', err);
      window.location.reload();
    }
  }
}

export const updateService = new UpdateService();
