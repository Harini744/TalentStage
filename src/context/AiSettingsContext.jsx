import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AiSettingsContext = createContext(null);
const STORAGE_KEY = 'talentstage_anthropic_key';

function readStoredKey() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

/**
 * Optional user-supplied Anthropic key. Kept in sessionStorage only (cleared when
 * the tab closes). With no key, the AI features use the local simulator.
 */
export function AiSettingsProvider({ children }) {
  const [apiKey, setApiKeyState] = useState(readStoredKey);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const setApiKey = useCallback((key) => {
    setApiKeyState(key);
    try {
      if (key) sessionStorage.setItem(STORAGE_KEY, key);
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable — key just lives in memory */
    }
  }, []);

  const value = useMemo(
    () => ({
      apiKey,
      setApiKey,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    }),
    [apiKey, setApiKey, drawerOpen]
  );

  return <AiSettingsContext.Provider value={value}>{children}</AiSettingsContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAiSettings() {
  const ctx = useContext(AiSettingsContext);
  if (!ctx) throw new Error('useAiSettings must be used inside <AiSettingsProvider>');
  return ctx;
}
