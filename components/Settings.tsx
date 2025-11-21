import React from 'react';
import { AppSettings, Language, Translation } from '../types';

interface SettingsProps {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  t: Translation;
}

export const Settings: React.FC<SettingsProps> = ({ settings, setSettings, t }) => {
  const handleLanguageChange = (lang: Language) => {
    setSettings({ ...settings, language: lang });
  };

  const toggleTheme = () => {
    setSettings({ ...settings, darkMode: !settings.darkMode });
  };

  const toggleMemes = () => {
    setSettings({ ...settings, memesEnabled: !settings.memesEnabled });
  };
  
  const toggleAggressive = () => {
    setSettings({ ...settings, aggressiveMode: !settings.aggressiveMode });
  };

  const toggleAutoMode = () => {
    setSettings({ ...settings, autoMode: !settings.autoMode });
  };

  const handleBaseUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, baseUrl: e.target.value });
  };

  // Map language codes to readable names (native)
  const languageNames: Record<Language, string> = {
    [Language.EN]: "English",
    [Language.RU]: "Русский",
    [Language.ES]: "Español",
    [Language.FR]: "Français",
    [Language.DE]: "Deutsch",
    [Language.ZH]: "中文",
    [Language.AR]: "العربية",
    [Language.PT]: "Português",
    [Language.HI]: "हिन्दी",
  };

  return (
    <div className="max-w-3xl mx-auto p-6 animate-fade-in h-full overflow-y-auto">
      <h2 className="text-3xl font-bold mb-8 text-brand-900 dark:text-brand-100">{t.settings}</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <span>🌍</span> {t.language}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.values(Language).map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`px-4 py-3 rounded-lg font-medium transition-all flex flex-col items-center justify-center ${
                settings.language === lang
                  ? 'bg-brand-500 text-white shadow-lg ring-2 ring-brand-300 ring-offset-2 dark:ring-offset-gray-800'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span className="text-lg">{languageNames[lang]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <span>🎨</span> {t.theme}
        </h3>
        <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">
                {settings.darkMode ? 'Dark Mode' : 'Light Mode'}
            </span>
            <button
            onClick={toggleTheme}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${
                settings.darkMode ? 'bg-brand-600' : 'bg-gray-300'
            }`}
            >
            <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition duration-300 ${
                settings.darkMode ? 'translate-x-7' : 'translate-x-1'
                }`}
            />
            </button>
        </div>
      </div>

       {/* Auto-Persona Mode (New) */}
       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 border border-brand-500/50 dark:border-brand-400/30">
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <span>🔮</span> {t.autoMode}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t.autoModeDesc}</p>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-300">Enable Dynamic Personality</span>
          <button
            onClick={toggleAutoMode}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${
              settings.autoMode ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition duration-300 ${
                settings.autoMode ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Proxy / Base URL Settings for VPN Bypass */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <span>🔓</span> {t.baseUrl}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t.baseUrlDesc}</p>
        <input
            type="text"
            value={settings.baseUrl || ''}
            onChange={handleBaseUrlChange}
            placeholder="https://my-reverse-proxy.com"
            className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <span>🦆</span> {t.memes}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-300">Enable Navalny Memes</span>
          <button
            onClick={toggleMemes}
            disabled={settings.autoMode}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${
              settings.autoMode ? 'opacity-50 cursor-not-allowed bg-gray-200' : settings.memesEnabled ? 'bg-brand-red' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition duration-300 ${
                settings.memesEnabled && !settings.autoMode ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-red-500 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-1 flex items-center gap-2 text-red-600 dark:text-red-400">
          <span>🔥</span> {t.aggressive}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t.aggressiveDesc}</p>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-300 font-medium">Activate Toxicity</span>
          <button
            onClick={toggleAggressive}
            disabled={settings.autoMode}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${
               settings.autoMode ? 'opacity-50 cursor-not-allowed bg-gray-200' : settings.aggressiveMode ? 'bg-red-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition duration-300 ${
                settings.aggressiveMode && !settings.autoMode ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};