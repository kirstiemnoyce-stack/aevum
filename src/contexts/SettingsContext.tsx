import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';

export type ThemeColor = 'indigo' | 'violet' | 'emerald' | 'rose' | 'amber';
export type FontSize = 'small' | 'medium' | 'large';
export type AIPersonality = 'warm' | 'direct' | 'playful';

export interface AppSettings {
  themeColor: ThemeColor;
  fontSize: FontSize;
  aiPersonality: AIPersonality;
  language: string;
  notifications: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
  autoSaveConversations: boolean;
  darkMode: boolean;
}

const colorMap: Record<ThemeColor, { primary: string; primaryLight: string; ring: string }> = {
  indigo: { primary: '#6366F1', primaryLight: '#EEF2FF', ring: '#6366F1' },
  violet: { primary: '#A855F7', primaryLight: '#F3E8FF', ring: '#A855F7' },
  emerald: { primary: '#10B981', primaryLight: '#ECFDF5', ring: '#10B981' },
  rose: { primary: '#F43F5E', primaryLight: '#FFF1F2', ring: '#F43F5E' },
  amber: { primary: '#F59E0B', primaryLight: '#FFFBEB', ring: '#F59E0B' },
};

const fontSizeMap: Record<FontSize, string> = {
  small: '13px',
  medium: '16px',
  large: '19px',
};

const defaultSettings: AppSettings = {
  themeColor: 'indigo',
  fontSize: 'medium',
  aiPersonality: 'warm',
  language: 'en-AU',
  notifications: true,
  soundEffects: false,
  hapticFeedback: true,
  autoSaveConversations: true,
  darkMode: false,
};

function loadSettings(): AppSettings {
  try {
    const saved = localStorage.getItem('aevum_settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  resetSettings: () => void;
  getPrimaryColor: () => string;
  getPrimaryLight: () => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  useEffect(() => {
    localStorage.setItem('aevum_settings', JSON.stringify(settings));
    // Apply theme color CSS variable
    const colors = colorMap[settings.themeColor];
    document.documentElement.style.setProperty('--app-primary', colors.primary);
    document.documentElement.style.setProperty('--app-primary-light', colors.primaryLight);
    document.documentElement.style.setProperty('--app-ring', colors.ring);
    // Apply font size
    document.documentElement.style.setProperty('--app-font-size', fontSizeMap[settings.fontSize]);
    // Apply dark mode
    document.documentElement.classList.toggle('dark', settings.darkMode);
    // Update theme-color meta
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', settings.darkMode ? '#0F172A' : '#F8FAFC');
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  const getPrimaryColor = useCallback(() => colorMap[settings.themeColor].primary, [settings.themeColor]);
  const getPrimaryLight = useCallback(() => colorMap[settings.themeColor].primaryLight, [settings.themeColor]);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings, getPrimaryColor, getPrimaryLight }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
