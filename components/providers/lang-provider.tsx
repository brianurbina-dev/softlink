"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import es from "@/locales/es.json";
import en from "@/locales/en.json";

type Lang = "es" | "en";
type Translations = typeof es;

const DICTS = { es, en } as const;

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  const setLang = useCallback((l: Lang) => setLangState(l), []);

  return (
    <LangContext.Provider value={{ lang, setLang, t: DICTS[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
