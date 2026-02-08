"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "tambo-api-key";

type ApiKeyContextValue = {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  effectiveApiKey: string | null;
  isConfigured: boolean;
};

const ApiKeyContext = createContext<ApiKeyContextValue | null>(null);

function getStoredKey(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getEffectiveKey(): string | null {
  const envKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;
  if (envKey?.trim()) return envKey;
  return getStoredKey();
}

export function ApiKeyProvider({ children }: { children: React.ReactNode }) {
  const [storedKey, setStoredKey] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setStoredKey(getStoredKey());
    setMounted(true);
  }, []);

  const setApiKey = useCallback((key: string) => {
    const trimmed = key.trim();
    if (trimmed) {
      localStorage.setItem(STORAGE_KEY, trimmed);
      setStoredKey(trimmed);
    }
  }, []);

  const clearApiKey = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setStoredKey(null);
  }, []);

  const effectiveApiKey = mounted
    ? (process.env.NEXT_PUBLIC_TAMBO_API_KEY?.trim() || storedKey) || null
    : null;

  const value: ApiKeyContextValue = {
    apiKey: storedKey,
    setApiKey,
    clearApiKey,
    effectiveApiKey,
    isConfigured: !!effectiveApiKey,
  };

  return (
    <ApiKeyContext.Provider value={value}>{children}</ApiKeyContext.Provider>
  );
}

export function useApiKey(): ApiKeyContextValue {
  const ctx = useContext(ApiKeyContext);
  if (!ctx) {
    throw new Error("useApiKey must be used within ApiKeyProvider");
  }
  return ctx;
}
