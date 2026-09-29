import { useState, useEffect } from 'react';
import { updateService, SystemUpdateState, APP_METADATA } from '../services/updateService';

export function useUpdateManager() {
  const [state, setState] = useState<SystemUpdateState>(() => updateService.getState());

  useEffect(() => {
    const unsubscribe = updateService.subscribe(setState);
    return () => unsubscribe();
  }, []);

  const checkForUpdates = (silent: boolean = false) => {
    return updateService.checkForUpdates(silent);
  };

  const forceUpdate = () => {
    return updateService.forceUpdate();
  };

  const setAutoUpdateEnabled = (enabled: boolean) => {
    updateService.setAutoUpdateEnabled(enabled);
  };

  const setUpdateInterval = (minutes: number) => {
    updateService.setUpdateIntervalMinutes(minutes);
  };

  return {
    ...state,
    metadata: APP_METADATA,
    checkForUpdates,
    forceUpdate,
    setAutoUpdateEnabled,
    setUpdateInterval,
  };
}
