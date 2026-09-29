import { describe, it, expect, beforeEach, vi } from 'vitest';
import { updateService, APP_METADATA } from '../services/updateService';

// Mock localStorage for node test environment
const mockStorage: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => mockStorage[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    mockStorage[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete mockStorage[key];
  }),
  clear: vi.fn(() => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  }),
};

// @ts-ignore
global.localStorage = localStorageMock;

describe('updateService', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('provides official app metadata with release date and version', () => {
    const state = updateService.getState();
    expect(state.appVersion).toBe('1.2.0');
    expect(state.releaseDate).toBe('28 Septembre 2026');
    expect(APP_METADATA.version).toBe('1.2.0');
  });

  it('allows toggling background auto-update and persists choice', () => {
    updateService.setAutoUpdateEnabled(false);
    expect(updateService.getState().autoUpdateEnabled).toBe(false);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('forestor-auto-update-enabled', 'false');

    updateService.setAutoUpdateEnabled(true);
    expect(updateService.getState().autoUpdateEnabled).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('forestor-auto-update-enabled', 'true');
  });

  it('allows setting update check interval', () => {
    updateService.setUpdateIntervalMinutes(30);
    expect(updateService.getState().updateIntervalMinutes).toBe(30);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('forestor-update-interval-minutes', '30');
  });

  it('checks for updates and records timestamp', async () => {
    await updateService.checkForUpdates(true);
    const postCheck = updateService.getState().lastCheckedDate;
    expect(postCheck).toBeDefined();
    expect(typeof postCheck).toBe('string');
  });
});
