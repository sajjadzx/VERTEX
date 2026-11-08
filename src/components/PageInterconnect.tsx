"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { 
  Building2, 
  Layers, 
  Wrench, 
  Palette, 
  Cpu, 
  Briefcase, 
  Activity, 
  Info, 
  PhoneCall, 
  ArrowLeft, 
  ArrowRight,
  Compass,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { Locale } from "@/lib/dictionary";
import { cn } from "@/lib/utils";

interface PageInterconnectProps {
  locale: Locale;
}

export function PageInterconnect({ locale }: PageInterconnectProps) {
  const pathname = usePathname();
  const isFa = locale === "fa";

  const allPages = [
    {
      href: `/${locale}`,
      pathId: "",
      titleFa: "صفحه اصلی (پورتال مهندسی)",
      titleEn: "Home (Engineering Portal)",
      descFa: "معرفی توانمندی‌ها، فناوری‌های بالابر و دروازه ورود به سیستم‌های ورتکس",
      descEn: "Core capabilities, vertical transit vision & architecture showcase",
      icon: Building2,
      badgeFa: "پورتال مرکزی",
      badgeEn: "Portal",
    },
    {
      href: `/${locale}/elevators`,
      pathId: "elevators",
      titleFa: "سیستم‌های آسانسور",
      titleEn: "Elevator Solutions",
      descFa: "آسانسورهای کششی پرسرعت، MRL بدون موتورخانه و بالابرهای سنگین پانورامیک",
      descEn: "High-speed traction, gearless MRL and panoramic architectural lifts",
      icon: Layers,
      badgeFa: "EN 81-20/50",
      badgeEn: "EN 81-20/50",
    },
    {
      href: `/${locale}/escalators`,
      pathId: "escalators",
      titleFa: "پله‌برقی و پیاده‌رو متحرک",
      titleEn: "Escalator Systems",
      descFa: "سیستم‌های ترابری پیوسته شهری، تجاری و فرودگاهی با گام ۳۰ و ۳۵ درجه",
      descEn: "Commercial & heavy-duty transit escalators, trusses and autowalks",
      icon: Wrench,
      badgeFa: "EN 115-1",
      badgeEn: "EN 115-1",
    },
    {
      href: `/${locale}/configurator`,
      pathId: "configurator",
      titleFa: "کانفیگوراتور داخلی کابین",
      titleEn: "Cabin Configurator",
      descFa: "طراحی بلادرنگ سنگ‌های طبیعی، متریال‌های تیتانیوم، چوب و روشنایی سقف",
      descEn: "Real-time interior styling with natural stone, oak slats & LED ceilings",
      icon: Palette,
      badgeFa: "شخصی‌سازی زنده",
      badgeEn: "Interactive",
    },
    {
      href: `/${locale}/engineering`,
      pathId: "engineering",
      titleFa: "فناوری و نقشه‌های CAD",
      titleEn: "Engineering & CAD Blueprints",
      descFa: "ابزار اندازه‌گذاری زنده چاه (پلان و مقطع)، محاسبات کششی و اصطکاک اویلر",
      descEn: "Interactive 2D shaft dimensioning, kinematics & traction calculations",
      icon: Cpu,
      badgeFa: "مبحث ۱۵ مقررات",
      badgeEn: "Calculations",
    },
    {
      href: `/${locale}/projects`,
      pathId: "projects",
      titleFa: "پروژه‌ها و نمونه‌کارها",
      titleEn: "Projects & Portfolio",
      descFa: "برج‌های تجاری، مراکز درمانی، ایستگاه‌های مترو و پاویون‌های بین‌المللی",
      descEn: "Flagship commercial towers, metro hubs and bespoke hospitality lifts",
      icon: Briefcase,
      badgeFa: "اجرا شده",
      badgeEn: "Portfolio",
    },
    {
      href: `/${locale}/maintenance`,
      pathId: "maintenance",
      titleFa: "پایش و نگهداری هوشمند",
      titleEn: "Maintenance & Telemetry",
      descFa: "داشبورد شبیه‌ساز اینترنت اشیاء، سلامت سنسورها، آنالیز ارتعاشات و سوابق سرویس",
      descEn: "Simulated IoT telemetry, health index, vibration analysis & service logs",
      icon: Activity,
      badgeFa: "پایش ۲۴/۷",
      badgeEn: "Telemetry",
    },
    {
      href: `/${locale}/about`,
      pathId: "about",
      titleFa: "درباره ورتکس",
      titleEn: "About VERTEX",
      descFa: "تاریخچه، استانداردسازی صنعتی، فرایند مهندسی و ارزش‌های سازمانی",
      descEn: "Heritage, manufacturing precision, sustainability and engineering norms",
      icon: Info,
      badgeFa: "پیشینه فنی",
      badgeEn: "Corporate",
    },
    {
      href: `/${locale}/contact`,
      pathId: "contact",
      titleFa: "مشاوره و استعلام فنی",
      titleEn: "Consultation & Contact",
      descFa: "ویزارد پیش‌محاسبه ترافیک آسانسور مطابق CIBSE Guide D و ثبت سفارش",
      descEn: "Preliminary lift sizing wizard based on CIBSE Guide D and inquiries",
      icon: PhoneCall,
      badgeFa: "استعلام قیمت",
      badgeEn: "Consultation",
    },
  ];

  // Determine current page index
  const normalizedPath = pathname?.replace(/\/$/, "") || `/${locale}`;
  const currentIndex = allPages.findIndex((p) => {
    if (p.pathId === "") {
      return normalizedPath === `/${locale}`;
    }
    return normalizedPath === `/${locale}/${p.pathId}` || normalizedPath.startsWith(`/${locale}/${p.pathId}/`);
  });

  const prevIndex = currentIndex > 0 ? currentIndex - 1 : allPages.length - 1;
  const nextIndex = currentIndex < allPages.length - 1 ? currentIndex + 1 : 0;

  const prevPage = allPages[prevIndex];
  const nextPage = allPages[nextIndex];

  return (
    <section className="mt-20 border-t border-vertex-border bg-gradient-to-b from-vertex-elevated/60 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Previous & Next Breadcrumb Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl bg-white border border-vertex-border shadow-card">
          <NextLink
            href={prevPage.href}
            className="w-full sm:w-auto flex items-center gap-3 p-3 rounded-xl hover:bg-vertex-elevated transition-colors text-vertex-primary group border border-transparent hover:border-vertex-border"
          >
            {isFa ? <ArrowRight className="w-5 h-5 text-vertex-blueprint shrink-0 transition-transform group-hover:translate-x-1" /> : <ArrowLeft className="w-5 h-5 text-vertex-blueprint shrink-0 transition-transform group-hover:-translate-x-1" />}
            <div>
              <span className="text-[11px] font-mono text-vertex-steel block">
                {isFa ? "بخش قبلی" : "Previous Section"}
              </span>
              <span className="text-sm font-bold text-vertex-primary group-hover:text-vertex-blueprint transition-colors">
                {isFa ? prevPage.titleFa : prevPage.titleEn}
              </span>
            </div>
          </NextLink>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-vertex-elevated border border-vertex-border text-xs font-mono text-vertex-steel">
            <Compass className="w-3.5 h-3.5 text-vertex-blueprint" />
            <span>{isFa ? `صفحه ${currentIndex + 1} از ۹` : `Page ${currentIndex + 1} of 9`}</span>
          </div>

          <NextLink
            href={nextPage.href}
            className="w-full sm:w-auto flex items-center justify-end gap-3 p-3 rounded-xl hover:bg-vertex-elevated transition-colors text-vertex-primary group border border-transparent hover:border-vertex-border text-right"
          >
            <div className={isFa ? "text-right" : "text-left"}>
              <span className="text-[11px] font-mono text-vertex-steel block">
                {isFa ? "بخش بعدی" : "Next Section"}
              </span>
              <span className="text-sm font-bold text-vertex-primary group-hover:text-vertex-blueprint transition-colors">
                {isFa ? nextPage.titleFa : nextPage.titleEn}
              </span>
            </div>
            {isFa ? <ArrowLeft className="w-5 h-5 text-vertex-blueprint shrink-0 transition-transform group-hover:-translate-x-1" /> : <ArrowRight className="w-5 h-5 text-vertex-blueprint shrink-0 transition-transform group-hover:translate-x-1" />}
          </NextLink>
        </div>

        {/* Master Interconnected Hub Grid (All 9 pages accessible together) */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vertex-blueprint/10 text-vertex-blueprint border border-vertex-blueprint/20 text-xs font-mono font-semibold mb-2">
                <Compass className="w-3.5 h-3.5" />
                <span>{isFa ? "شبکه یکپارچه ناوبری VERTEX" : "VERTEX Interconnected Network"}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-vertex-primary">
                {isFa ? "دسترسی مستقیم و متقابل به تمام صفحات وب‌سایت" : "All 9 Connected Platform Modules"}
              </h2>
              <p className="text-sm text-vertex-secondary mt-1">
                {isFa 
                  ? "تمامی بخش‌های فنی، کاتالوگ‌ها، ابزارهای محاسباتی و فرم‌های مشاوره به یکدیگر پیوسته‌اند." 
                  : "Freely navigate between engineering tools, blueprints, portfolios, and configurators."}
              </p>
            </div>
            <div className="text-xs font-mono text-vertex-steel shrink-0">
              {isFa ? "۹ بخش یکپارچه مهندسی" : "9 Interlinked Hubs"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allPages.map((page, idx) => {
              const Icon = page.icon;
              const isCurrent = idx === currentIndex;

              return (
                <NextLink
                  key={page.href}
                  href={page.href}
                  className={cn(
                    "group relative p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between",
                    isCurrent
                      ? "bg-white border-vertex-blueprint ring-2 ring-vertex-blueprint/20 shadow-md"
                      : "bg-white hover:bg-vertex-elevated/80 border-vertex-border hover:border-vertex-blueprint/60 hover:shadow-card"
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                        isCurrent
                          ? "bg-vertex-blueprint text-white shadow-sm"
                          : "bg-vertex-elevated text-vertex-blueprint group-hover:bg-vertex-blueprint group-hover:text-white"
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={cn(
                        "text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border",
                        isCurrent 
                          ? "bg-vertex-blueprint/15 text-vertex-blueprint border-vertex-blueprint/30"
                          : "bg-vertex-elevated text-vertex-steel border-vertex-border"
                      )}>
                        {isCurrent ? (isFa ? "صفحه فعلی" : "Active") : (isFa ? page.badgeFa : page.badgeEn)}
                      </span>
                    </div>

                    <h3 className={cn(
                      "text-base font-bold transition-colors",
                      isCurrent ? "text-vertex-blueprint" : "text-vertex-primary group-hover:text-vertex-blueprint"
                    )}>
                      {isFa ? page.titleFa : page.titleEn}
                    </h3>
                    <p className="text-xs text-vertex-secondary mt-1.5 leading-relaxed line-clamp-2">
                      {isFa ? page.descFa : page.descEn}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-vertex-border/70 flex items-center justify-between text-xs font-mono text-vertex-steel group-hover:text-vertex-blueprint">
                    <span className="text-[11px]">
                      {isCurrent ? (isFa ? "هم‌اکنون در این صفحه هستید" : "Current location") : (isFa ? "مشاهده و ورود به صفحه" : "Explore module")}
                    </span>
                    {isFa ? (
                      <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    ) : (
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    )}
                  </div>
                </NextLink>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
