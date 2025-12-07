"use client";

import { SearchProvider } from "../context/search-context";
import { LanguageProvider } from "../context/language-context";

export function Providers({ children }) {
  return (
    <LanguageProvider>
      <SearchProvider>{children}</SearchProvider>
    </LanguageProvider>
  );
}
