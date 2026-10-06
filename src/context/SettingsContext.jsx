import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingService } from '../api/services/settingService';
import { INITIAL_SETTINGS } from '../api/mockData';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await settingService.getSettings();
      setSettings(data);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateSettings = async (newSettings) => {
    try {
      const updated = await settingService.updateSettings(newSettings);
      setSettings(updated);
      return updated;
    } catch (err) {
      console.error('Failed to update settings:', err);
      throw err;
    }
  };

  const resetAllData = async () => {
    await settingService.resetDatabase();
    await loadSettings();
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        updateSettings,
        resetAllData,
        reloadSettings: loadSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
