"use client";

import React, { useState, useEffect } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, Compass } from "lucide-react";
import { Locale, dictionary } from "@/lib/dictionary";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/utils";

interface NavbarProps {
  locale: Locale;
}

export function Navbar({ locale }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const dict = dictionary[locale];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/elevators`, label: dict.nav.elevators },
    { href: `/${locale}/escalators`, label: dict.nav.escalators },
    { href: `/${locale}/configurator`, label: dict.nav.configurator },
    { href: `/${locale}/engineering`, label: dict.nav.engineering },
    { href: `/${locale}/projects`, label: dict.nav.projects },
    { href: `/${locale}/maintenance`, label: dict.nav.maintenance },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-vertex-border shadow-card py-2.5"
          : "bg-white/80 backdrop-blur-sm border-b border-vertex-border/60 py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NextLink
            href={`/${locale}`}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-vertex-primary border border-vertex-borderStrong flex items-center justify-center overflow-hidden group-hover:bg-vertex-blueprint transition-colors shadow-sm">
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="w-4 h-0.5 bg-white rounded-full transition-transform group-hover:-translate-y-0.5" />
                <span className="w-5 h-0.5 bg-vertex-cyan rounded-full" />
                <span className="w-3 h-0.5 bg-white rounded-full transition-transform group-hover:translate-y-0.5" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-widest text-vertex-primary font-mono flex items-center gap-1">
                VERTEX
                <span className="w-1.5 h-1.5 rounded-full bg-vertex-blueprint inline-block" />
              </span>
              <span className="text-[10px] tracking-wider text-vertex-steel font-mono uppercase font-semibold">
                {locale === "fa" ? "مهندسی بالابرهای ساختمانی" : "Precision Lift Engineering"}
              </span>
            </div>
          </NextLink>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1.5 2xl:gap-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === `/${locale}`
                  ? pathname === `/${locale}` || pathname === `/${locale}/`
                  : pathname?.startsWith(link.href);

              return (
                <NextLink
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors relative",
                    isActive
                      ? "text-vertex-blueprint bg-vertex-blueprint/10 font-bold"
                      : "text-vertex-secondary hover:text-vertex-primary hover:bg-vertex-elevated"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-2 h-[2px] bg-vertex-blueprint rounded-full" />
                  )}
                </NextLink>
              );
            })}
          </nav>

          {/* Right Action & Language Switcher */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher currentLocale={locale} />
            <NextLink
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-vertex-primary text-white hover:bg-vertex-blueprint transition-all shadow-sm"
            >
              <span>{dict.nav.requestConsultation}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </NextLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageSwitcher currentLocale={locale} />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-vertex-elevated border border-vertex-border text-vertex-primary hover:text-vertex-blueprint"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-vertex-border px-4 pt-4 pb-6 mt-3 space-y-2 shadow-float animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const isActive =
              link.href === `/${locale}`
                ? pathname === `/${locale}`
                : pathname?.startsWith(link.href);
            return (
              <NextLink
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-vertex-blueprint/10 text-vertex-blueprint font-bold"
                    : "text-vertex-secondary hover:bg-vertex-elevated hover:text-vertex-primary"
                )}
              >
                {link.label}
              </NextLink>
            );
          })}
          <div className="pt-4 border-t border-vertex-border">
            <NextLink
              href={`/${locale}/contact`}
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-vertex-primary text-white font-bold text-sm shadow-sm"
            >
              <span>{dict.nav.requestConsultation}</span>
              <ArrowUpRight className="w-4 h-4" />
            </NextLink>
          </div>
        </div>
      )}
    </header>
  );
}
