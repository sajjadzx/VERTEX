"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { Locale } from "@/lib/dictionary";

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = () => {
    const targetLocale: Locale = currentLocale === "en" ? "fa" : "en";
    let newPath = `/${targetLocale}`;
    
    if (pathname) {
      const segments = pathname.split("/").filter(Boolean);
      if (segments.length > 0 && (segments[0] === "en" || segments[0] === "fa")) {
        segments[0] = targetLocale;
        newPath = `/${segments.join("/")}`;
      } else {
        newPath = `/${targetLocale}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
      }
    }
    
    router.push(newPath);
  };

  return (
    <button
      onClick={toggleLanguage}
      type="button"
      aria-label="Switch Language / تغییر زبان"
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-semibold rounded-lg border border-vertex-borderStrong bg-vertex-surface hover:border-vertex-blueprint hover:text-vertex-blueprint transition-all text-vertex-secondary shadow-sm"
    >
      <Globe className="w-3.5 h-3.5 text-vertex-blueprint" />
      <span className="uppercase">{currentLocale === "en" ? "فارسی (FA)" : "English (EN)"}</span>
    </button>
  );
}
