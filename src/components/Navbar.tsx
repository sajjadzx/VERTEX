"use client";

import React, { useState, useEffect } from "react";
import Link from "next/navigation";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, Cpu } from "lucide-react";
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
      setScrolled(window.scrollY > 20);
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
          ? "bg-vertex-deep/90 backdrop-blur-md border-b border-vertex-border/80 shadow-card py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NextLink
            href={`/${locale}`}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-10 h-10 rounded-lg bg-vertex-surface border border-vertex-border flex items-center justify-center overflow-hidden group-hover:border-vertex-cyan/60 transition-colors shadow-glow">
              <div className="absolute inset-0 bg-gradient-to-tr from-vertex-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="w-4 h-0.5 bg-vertex-cyan rounded-full transition-transform group-hover:-translate-y-0.5" />
                <span className="w-5 h-0.5 bg-vertex-ice rounded-full" />
                <span className="w-3 h-0.5 bg-vertex-cyan rounded-full transition-transform group-hover:translate-y-0.5" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-widest text-vertex-ice font-mono flex items-center gap-1">
                VERTEX
                <span className="w-1.5 h-1.5 rounded-full bg-vertex-cyan shadow-cyan inline-block" />
              </span>
              <span className="text-[10px] tracking-wider text-vertex-steel font-sans uppercase">
                {locale === "fa" ? "فناوری آسانسور و پله‌برقی" : "Mobility Engineering"}
              </span>
            </div>
          </NextLink>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1.5 2xl:gap-3">
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
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors relative",
                    isActive
                      ? "text-vertex-cyan bg-vertex-cyan/10 font-semibold"
                      : "text-vertex-steel hover:text-vertex-ice hover:bg-vertex-surface/60"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-2 h-[2px] bg-vertex-cyan rounded-full shadow-cyan" />
                  )}
                </NextLink>
              );
            })}
          </nav>

          {/* Right Action & Switcher */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher currentLocale={locale} />
            <NextLink
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-vertex-cyan text-vertex-deep hover:bg-vertex-cyanHover transition-all shadow-cyan hover:shadow-cyanLg"
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
              className="p-2 rounded-lg bg-vertex-surface border border-vertex-border text-vertex-ice hover:text-vertex-cyan"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-vertex-deep/98 border-b border-vertex-border px-4 pt-4 pb-6 mt-3 space-y-2 backdrop-blur-xl animate-in slide-in-from-top-2">
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
                  "block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-vertex-cyan/15 text-vertex-cyan font-bold"
                    : "text-vertex-steel hover:bg-vertex-surface hover:text-vertex-ice"
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
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-vertex-cyan text-vertex-deep font-bold text-sm shadow-cyan"
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
