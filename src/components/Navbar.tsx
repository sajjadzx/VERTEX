"use client";

import React, { useState, useEffect, useRef } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  ArrowUpRight, 
  ChevronDown,
  Building2,
  Wrench,
  Palette,
  Cpu,
  Briefcase,
  Activity,
  Info,
  PhoneCall,
  Layers,
  Compass,
  Gauge,
  Sliders,
  ShieldCheck,
  MapPin
} from "lucide-react";
import { Locale, dictionary } from "@/lib/dictionary";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/utils";

interface NavbarProps {
  locale: Locale;
}

interface DropdownItem {
  titleFa: string;
  titleEn: string;
  descFa: string;
  descEn: string;
  href: string;
  icon: any;
  badge?: string;
}

interface NavCategory {
  id: string;
  titleFa: string;
  titleEn: string;
  items: DropdownItem[];
}

export function Navbar({ locale }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
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

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Define structured dropdown navigation
  const navCategories: NavCategory[] = [
    {
      id: "solutions",
      titleFa: "راهکارها و محصولات",
      titleEn: "Solutions & Products",
      items: [
        {
          titleFa: "آسانسورهای کششی و پرسرعت",
          titleEn: "Traction High-Speed Lifts",
          descFa: "سرعت تا ۱۰ متر بر ثانیه با سیستم تعلیق پیشرفته",
          descEn: "Up to 10 m/s with regenerative drive",
          href: `/${locale}/elevators`,
          icon: Layers,
          badge: "EN 81-20",
        },
        {
          titleFa: "بالابرهای بدون موتورخانه (MRL)",
          titleEn: "MRL Gearless Elevators",
          descFa: "صرفه‌جویی در فضای معماری و موتور سنکرون PMSM",
          descEn: "Architectural space optimization",
          href: `/${locale}/elevators`,
          icon: Building2,
        },
        {
          titleFa: "پله‌برقی‌های سنگین و تجاری",
          titleEn: "Commercial & Transit Escalators",
          descFa: "استاندارد EN 115، گام ۳۰ و ۳۵ درجه با راندمان بالا",
          descEn: "Heavy-duty outdoor and indoor transit",
          href: `/${locale}/escalators`,
          icon: Wrench,
          badge: "EN 115-1",
        },
        {
          titleFa: "پیاده‌روهای متحرک فرودگاهی",
          titleEn: "Moving Walkways & Autowalks",
          descFa: "شیب ۰ تا ۱۲ درجه برای ترابری افقی پرتردد",
          descEn: "Horizontal and inclined passenger transit",
          href: `/${locale}/escalators`,
          icon: Gauge,
        },
      ],
    },
    {
      id: "engineering",
      titleFa: "استودیوی مهندسی و CAD",
      titleEn: "Engineering & CAD",
      items: [
        {
          titleFa: "استودیوی سه‌بعدی و نقشه‌های CAD چاه",
          titleEn: "3D & 2D CAD Shaft Studio",
          descFa: "اندازه‌گذاری زنده پلان و مقطع طبق مبحث ۱۵",
          descEn: "Real-time 2D/3D parametric shaft dimensioning",
          href: `/${locale}/engineering`,
          icon: Cpu,
          badge: "Three.js",
        },
        {
          titleFa: "ماشین‌حساب محاسبات کششی و موتور",
          titleEn: "Traction & Motor Calculator",
          descFa: "محاسبه زنده توان، گشتاور و اصطکاک اویلر-آیتلوین",
          descEn: "Kinematics, Euler-Eytelwein friction checks",
          href: `/${locale}/engineering`,
          icon: Sliders,
        },
        {
          titleFa: "آناتومی قطعات و استاندارد EN 81-20",
          titleEn: "Technical Component Anatomy",
          descFa: "بررسی تفکیکی گاورنر، ترمز ایمنی و سیم‌بکسل‌ها",
          descEn: "Safety gear, overspeed governor & buffers",
          href: `/${locale}/engineering`,
          icon: ShieldCheck,
        },
      ],
    },
    {
      id: "interactive",
      titleFa: "ابزارهای تعاملی",
      titleEn: "Interactive Studio",
      items: [
        {
          titleFa: "کانفیگوراتور داخلی کابین لوکس",
          titleEn: "Luxury Cabin Configurator",
          descFa: "شخصی‌سازی سنگ‌های مرمر ایتالیایی، تیتانیوم و چوب",
          descEn: "Real-time marble, wood & titanium finishes",
          href: `/${locale}/configurator`,
          icon: Palette,
          badge: "Interactive",
        },
        {
          titleFa: "داشبورد پایش هوشمند تلمتری (IoT)",
          titleEn: "Smart Maintenance Dashboard",
          descFa: "سنسورهای ارتعاش، دمای یاتاقان و شاخص سلامت ۲۴/۷",
          descEn: "Simulated sensor vibration & health index",
          href: `/${locale}/maintenance`,
          icon: Activity,
        },
        {
          titleFa: "ویزارد ترافیک CIBSE Guide D",
          titleEn: "Traffic Sizing Wizard",
          descFa: "پیش‌محاسبه تعداد و ظرفیت آسانسورها",
          descEn: "Preliminary lift sizing based on traffic",
          href: `/${locale}/contact`,
          icon: PhoneCall,
        },
      ],
    },
    {
      id: "projects",
      titleFa: "پروژه‌ها و شبکه جهانی",
      titleEn: "Projects & Global Map",
      items: [
        {
          titleFa: "اطلس پروژه‌ها و نقشه جغرافیایی",
          titleEn: "Global Project GIS Map",
          descFa: "نقشه تعاملی پروژه‌های اجرا شده بر پایه Leaflet",
          descEn: "Interactive Leaflet GIS map of installations",
          href: `/${locale}/projects`,
          icon: MapPin,
          badge: "Leaflet",
        },
        {
          titleFa: "رزومه و گالری پروژه‌های شاخص",
          titleEn: "Flagship Towers & Portfolio",
          descFa: "برج‌های تجاری، مراکز درمانی و متروهای بین‌المللی",
          descEn: "Commercial towers, metros and medical centers",
          href: `/${locale}/projects`,
          icon: Briefcase,
        },
      ],
    },
    {
      id: "company",
      titleFa: "درباره و تماس",
      titleEn: "Company & Contact",
      items: [
        {
          titleFa: "درباره شرکت و استانداردها",
          titleEn: "About VERTEX & Quality Norms",
          descFa: "پیشینه مهندسی، زنجیره تولید و گواهینامه‌ها",
          descEn: "Precision manufacturing ethos & heritage",
          href: `/${locale}/about`,
          icon: Info,
        },
        {
          titleFa: "مشاوره فنی و استعلام مهندسی",
          titleEn: "Consultation & Engineering RFQ",
          descFa: "تماس با تیم مهندسی و ارسال نقشه‌های معماری",
          descEn: "Direct contact with lift engineers",
          href: `/${locale}/contact`,
          icon: PhoneCall,
        },
      ],
    },
  ];

  return (
    <header
      ref={navRef}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-vertex-border shadow-sm py-2"
          : "bg-white/90 backdrop-blur-sm border-b border-vertex-border/70 py-3"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <NextLink
            href={`/${locale}`}
            className="flex items-center gap-2.5 group shrink-0"
            onClick={() => setActiveDropdown(null)}
          >
            <div className="w-9 h-9 rounded-xl bg-vertex-primary border border-vertex-borderStrong flex items-center justify-center overflow-hidden group-hover:bg-vertex-blueprint transition-colors shadow-sm">
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="w-3.5 h-0.5 bg-white rounded-full transition-transform group-hover:-translate-y-0.5" />
                <span className="w-4 h-0.5 bg-vertex-cyan rounded-full" />
                <span className="w-2.5 h-0.5 bg-white rounded-full transition-transform group-hover:translate-y-0.5" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-widest text-vertex-primary font-mono flex items-center gap-1">
                VERTEX
                <span className="w-1.5 h-1.5 rounded-full bg-vertex-blueprint inline-block" />
              </span>
              <span className="text-[9px] tracking-wider text-vertex-steel font-mono uppercase font-semibold">
                {isFa ? "فناوری بالابر و ترابری عمودی" : "Vertical Transit Systems"}
              </span>
            </div>
          </NextLink>

          {/* Desktop Compact Dropdown Menu Bar */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* Direct Home link */}
            <NextLink
              href={`/${locale}`}
              className={cn(
                "px-3 py-1.5 text-xs font-bold rounded-lg transition-colors",
                pathname === `/${locale}` || pathname === `/${locale}/`
                  ? "text-vertex-blueprint bg-vertex-blueprint/10"
                  : "text-vertex-secondary hover:text-vertex-primary hover:bg-slate-100/70"
              )}
            >
              {dict.nav.home}
            </NextLink>

            {/* Dropdown Categories */}
            {navCategories.map((cat) => {
              const isOpen = activeDropdown === cat.id;

              return (
                <div
                  key={cat.id}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(cat.id)}
                >
                  <button
                    onClick={() => setActiveDropdown(isOpen ? null : cat.id)}
                    className={cn(
                      "flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                      isOpen
                        ? "text-vertex-blueprint bg-slate-100"
                        : "text-vertex-secondary hover:text-vertex-primary hover:bg-slate-100/70"
                    )}
                  >
                    <span>{isFa ? cat.titleFa : cat.titleEn}</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", isOpen && "rotate-180 text-vertex-blueprint")} />
                  </button>

                  {/* Dropdown Content Card */}
                  {isOpen && (
                    <div
                      onMouseLeave={() => setActiveDropdown(null)}
                      className={cn(
                        "absolute top-full pt-2 z-50 w-80 animate-in fade-in-50 slide-in-from-top-1 duration-150",
                        isFa ? "right-0" : "left-0"
                      )}
                    >
                      <div className="bg-white rounded-2xl border border-vertex-border shadow-float p-3 space-y-1">
                        <div className="px-3 py-1.5 text-[11px] font-mono font-bold text-vertex-steel uppercase border-b border-vertex-border mb-1 flex items-center justify-between">
                          <span>{isFa ? cat.titleFa : cat.titleEn}</span>
                          <span className="text-[10px] text-vertex-blueprint">VERTEX</span>
                        </div>

                        {cat.items.map((item, idx) => {
                          const Icon = item.icon;

                          return (
                            <NextLink
                              key={idx}
                              href={item.href}
                              onClick={() => setActiveDropdown(null)}
                              className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-3 group/item border border-transparent hover:border-slate-200"
                            >
                              <div className="w-8 h-8 rounded-lg bg-vertex-elevated text-vertex-blueprint group-hover/item:bg-vertex-blueprint group-hover/item:text-white flex items-center justify-center shrink-0 transition-colors mt-0.5">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-bold text-vertex-primary group-hover/item:text-vertex-blueprint transition-colors flex items-center justify-between">
                                  <span>{isFa ? item.titleFa : item.titleEn}</span>
                                  {item.badge && (
                                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-vertex-steel border border-slate-200">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-vertex-steel mt-0.5 leading-snug line-clamp-1 font-normal">
                                  {isFa ? item.descFa : item.descEn}
                                </p>
                              </div>
                            </NextLink>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action & Language Switcher */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <LanguageSwitcher currentLocale={locale} />
            <NextLink
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-vertex-primary text-white hover:bg-vertex-blueprint transition-all shadow-sm"
            >
              <span>{dict.nav.requestConsultation}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </NextLink>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageSwitcher currentLocale={locale} />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-vertex-elevated border border-vertex-border text-vertex-primary hover:text-vertex-blueprint"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer with Accordion Subsections */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-vertex-border px-4 pt-3 pb-6 mt-2 space-y-2 shadow-float animate-in slide-in-from-top-2 max-h-[82vh] overflow-y-auto">
          {/* Direct Home link */}
          <NextLink
            href={`/${locale}`}
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-vertex-primary hover:bg-slate-50"
          >
            {dict.nav.home}
          </NextLink>

          {/* Accordion Categories */}
          {navCategories.map((cat) => {
            const isExpanded = expandedMobile === cat.id;

            return (
              <div key={cat.id} className="border border-vertex-border rounded-xl overflow-hidden bg-slate-50/50">
                <button
                  onClick={() => setExpandedMobile(isExpanded ? null : cat.id)}
                  className="w-full flex items-center justify-between p-3 text-xs font-bold text-vertex-primary hover:bg-slate-100 text-right"
                >
                  <span>{isFa ? cat.titleFa : cat.titleEn}</span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180 text-vertex-blueprint")} />
                </button>

                {isExpanded && (
                  <div className="p-2 bg-white space-y-1 border-t border-vertex-border">
                    {cat.items.map((item, idx) => {
                      const Icon = item.icon;

                      return (
                        <NextLink
                          key={idx}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="p-2.5 rounded-lg flex items-center gap-2.5 hover:bg-slate-50 text-xs font-medium text-vertex-secondary"
                        >
                          <Icon className="w-4 h-4 text-vertex-blueprint shrink-0" />
                          <span className="font-bold text-vertex-primary">{isFa ? item.titleFa : item.titleEn}</span>
                        </NextLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-2">
            <NextLink
              href={`/${locale}/contact`}
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-vertex-primary text-white hover:bg-vertex-blueprint transition-all"
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
