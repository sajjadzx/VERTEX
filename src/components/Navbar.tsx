"use client";

import React, { useState, useEffect } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  ArrowUpRight, 
  Compass, 
  Grid, 
  Layers, 
  ChevronDown,
  Building2,
  Wrench,
  Palette,
  Cpu,
  Briefcase,
  Activity,
  Info,
  PhoneCall
} from "lucide-react";
import { Locale, dictionary } from "@/lib/dictionary";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/utils";

interface NavbarProps {
  locale: Locale;
}

export function Navbar({ locale }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHubOpen, setIsHubOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const dict = dictionary[locale];
  const isFa = locale === "fa";

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

  const hubModules = [
    { href: `/${locale}`, label: isFa ? "صفحه اصلی (پورتال مهندسی)" : "Home (Engineering Portal)", icon: Building2, desc: isFa ? "دروازه ورود و چشم‌انداز ترابری عمودی" : "Core vision & technology overview" },
    { href: `/${locale}/elevators`, label: isFa ? "سیستم‌های آسانسور" : "Elevator Solutions", icon: Layers, desc: isFa ? "بالابرهای کششی، پرسرعت و MRL" : "Traction, gearless & panoramic lifts" },
    { href: `/${locale}/escalators`, label: isFa ? "پله‌برقی و پیاده‌رو متحرک" : "Escalators & Moving Walks", icon: Wrench, desc: isFa ? "ترابری سنگین شهری و تجاری" : "Heavy-duty transit systems" },
    { href: `/${locale}/configurator`, label: isFa ? "کانفیگوراتور کابین" : "Cabin Configurator", icon: Palette, desc: isFa ? "شخصی‌سازی متریال‌های لوکس و روشنایی" : "Live architectural material studio" },
    { href: `/${locale}/engineering`, label: isFa ? "فناوری و نقشه‌های CAD" : "CAD Blueprints & Kinematics", icon: Cpu, desc: isFa ? "دیمانسیون چاه، محاسبات توان و کشش" : "Shaft dimensioner & traction calculations" },
    { href: `/${locale}/projects`, label: isFa ? "پروژه‌ها و نمونه‌کارها" : "Projects & Portfolio", icon: Briefcase, desc: isFa ? "برج‌های شاخص، مترو و مراکز درمانی" : "High-profile vertical mobility cases" },
    { href: `/${locale}/maintenance`, label: isFa ? "پایش و نگهداری هوشمند" : "Maintenance & Telemetry", icon: Activity, desc: isFa ? "سنسورهای IoT، آنالیز لرزش و سلامت" : "Simulated sensor diagnostics" },
    { href: `/${locale}/about`, label: isFa ? "درباره ورتکس" : "About VERTEX", icon: Info, desc: isFa ? "استانداردها، خط‌مشی و متدولوژی" : "Engineering ethos & manufacturing" },
    { href: `/${locale}/contact`, label: isFa ? "مشاوره و استعلام فنی" : "Consultation & Contact", icon: PhoneCall, desc: isFa ? "ویزارد ترافیک CIBSE و ثبت درخواست" : "CIBSE Guide D sizing & consultation" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-vertex-border shadow-card py-2.5"
          : "bg-white/85 backdrop-blur-sm border-b border-vertex-border/60 py-3.5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2">
          {/* Logo */}
          <NextLink
            href={`/${locale}`}
            className="flex items-center gap-2.5 group shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-vertex-primary border border-vertex-borderStrong flex items-center justify-center overflow-hidden group-hover:bg-vertex-blueprint transition-colors shadow-sm">
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="w-3.5 sm:w-4 h-0.5 bg-white rounded-full transition-transform group-hover:-translate-y-0.5" />
                <span className="w-4 sm:w-5 h-0.5 bg-vertex-cyan rounded-full" />
                <span className="w-2.5 sm:w-3 h-0.5 bg-white rounded-full transition-transform group-hover:translate-y-0.5" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-widest text-vertex-primary font-mono flex items-center gap-1">
                VERTEX
                <span className="w-1.5 h-1.5 rounded-full bg-vertex-blueprint inline-block" />
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-wider text-vertex-steel font-mono uppercase font-semibold">
                {isFa ? "مهندسی بالابرهای ساختمانی" : "Precision Lift Engineering"}
              </span>
            </div>
          </NextLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navLinks.slice(0, 7).map((link) => {
              const isActive =
                link.href === `/${locale}`
                  ? pathname === `/${locale}` || pathname === `/${locale}/`
                  : pathname?.startsWith(link.href);

              return (
                <NextLink
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-2.5 xl:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors relative whitespace-nowrap",
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

            {/* All Pages Hub Button */}
            <button
              onClick={() => setIsHubOpen(!isHubOpen)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all",
                isHubOpen 
                  ? "bg-vertex-blueprint text-white border-vertex-blueprint shadow-sm"
                  : "bg-vertex-elevated text-vertex-primary hover:text-vertex-blueprint border-vertex-border hover:border-vertex-blueprint/40"
              )}
              title={isFa ? "مشاهده شبکه پیوسته تمام صفحات" : "Explore All Interconnected Pages"}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{isFa ? "همه صفحات (۹)" : "All Pages (9)"}</span>
              <ChevronDown className={cn("w-3 h-3 transition-transform", isHubOpen && "rotate-180")} />
            </button>
          </nav>

          {/* Right Action & Language Switcher */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            <LanguageSwitcher currentLocale={locale} />
            <NextLink
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-vertex-primary text-white hover:bg-vertex-blueprint transition-all shadow-sm whitespace-nowrap"
            >
              <span>{dict.nav.requestConsultation}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </NextLink>
          </div>

          {/* Mobile Buttons */}
          <div className="flex lg:hidden items-center gap-1.5">
            <button
              onClick={() => setIsHubOpen(!isHubOpen)}
              className="p-2 rounded-lg bg-vertex-blueprint/10 text-vertex-blueprint border border-vertex-blueprint/20 text-xs font-bold flex items-center gap-1"
              title={isFa ? "همه صفحات" : "All Pages"}
            >
              <Compass className="w-4 h-4" />
              <span className="text-[11px] font-mono">9</span>
            </button>
            <LanguageSwitcher currentLocale={locale} />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-vertex-elevated border border-vertex-border text-vertex-primary hover:text-vertex-blueprint"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Universal All Pages Hub Modal / Dropdown */}
      {isHubOpen && (
        <div className="fixed inset-x-0 top-[65px] bg-white/98 backdrop-blur-md border-b border-vertex-border shadow-float px-4 sm:px-6 lg:px-8 py-8 animate-in slide-in-from-top-3 max-h-[85vh] overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-vertex-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-vertex-blueprint text-white flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-vertex-primary">
                    {isFa ? "مرکز دسترسی یکپارچه به تمامی بخش‌های ورتکس" : "Master Navigation Portal (All 9 Modules)"}
                  </h3>
                  <p className="text-xs text-vertex-secondary">
                    {isFa ? "از هر کجای وب‌سایت با یک کلیک به تمام صفحات و ابزارهای مهندسی دسترسی دارید." : "Instant single-click access to every page, CAD tool, and engineering module."}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsHubOpen(false)}
                className="p-1.5 rounded-lg hover:bg-vertex-elevated text-vertex-secondary hover:text-vertex-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {hubModules.map((item) => {
                const Icon = item.icon;
                const isCurrent = pathname === item.href || (item.href !== `/${locale}` && pathname?.startsWith(item.href));

                return (
                  <NextLink
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsHubOpen(false)}
                    className={cn(
                      "p-3.5 rounded-xl border transition-all flex items-start gap-3 group",
                      isCurrent
                        ? "bg-vertex-blueprint/5 border-vertex-blueprint text-vertex-blueprint shadow-sm"
                        : "bg-white hover:bg-vertex-elevated border-vertex-border hover:border-vertex-blueprint/40"
                    )}
                  >
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                      isCurrent ? "bg-vertex-blueprint text-white" : "bg-vertex-elevated text-vertex-blueprint group-hover:bg-vertex-blueprint group-hover:text-white"
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-vertex-primary group-hover:text-vertex-blueprint transition-colors flex items-center gap-1.5">
                        <span>{item.label}</span>
                        {isCurrent && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-vertex-blueprint text-white">
                            {isFa ? "فعلی" : "Active"}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-vertex-secondary mt-0.5 leading-snug line-clamp-1">
                        {item.desc}
                      </p>
                    </div>
                  </NextLink>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-vertex-border px-4 pt-4 pb-6 mt-2 space-y-1.5 shadow-float animate-in slide-in-from-top-2 max-h-[80vh] overflow-y-auto">
          <div className="pb-2 border-b border-vertex-border mb-2 text-xs font-mono font-bold text-vertex-steel">
            {isFa ? "فهرست صفحات وب‌سایت" : "Website Navigation Directory"}
          </div>
          {navLinks.map((link) => {
            const isActive =
              link.href === `/${locale}`
                ? pathname === `/${locale}` || pathname === `/${locale}/`
                : pathname?.startsWith(link.href);
            return (
              <NextLink
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-lg text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-vertex-blueprint/10 text-vertex-blueprint font-bold"
                    : "text-vertex-secondary hover:bg-vertex-elevated hover:text-vertex-primary"
                )}
              >
                {link.label}
              </NextLink>
            );
          })}
          <div className="pt-3 border-t border-vertex-border mt-3">
            <NextLink
              href={`/${locale}/contact`}
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg bg-vertex-primary text-white hover:bg-vertex-blueprint transition-all"
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
