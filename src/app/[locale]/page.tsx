import React from "react";
import NextLink from "next/link";
import Image from "next/image";
import { Locale, dictionary } from "@/lib/dictionary";
import { SectionHeader } from "@/components/SectionHeader";
import { TechBadge } from "@/components/TechBadge";
import { PageInterconnect } from "@/components/PageInterconnect";
import { SHOWCASE_PROJECTS } from "@/lib/constants";
import { 
  ArrowUpRight, 
  ChevronRight, 
  Zap, 
  Building2, 
  Activity, 
  Sliders, 
  Compass, 
  Calculator,
  ShieldCheck,
  Cpu,
  Layers,
  Wrench,
  DoorClosed,
  Award
} from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = (locale === "fa" ? "fa" : "en") as Locale;
  const dict = dictionary[currentLocale];
  const isFa = currentLocale === "fa";

  return (
    <div className="flex flex-col w-full bg-vertex-bg">
      {/* ========================================================
          HERO SECTION (Cinematic, Editorial, Spacious & Prestige)
      ======================================================== */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-vertex-bg">
        {/* Subtle Architectural CAD Grid Background */}
        <div className="absolute inset-0 bg-cad-paper opacity-60 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-vertex-bg to-transparent pointer-events-none" />

        <div className="relative max-w-6xl mx-auto text-center space-y-8 z-10">
          {/* Official Standards Badge Pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 px-4 rounded-full bg-white border border-vertex-border shadow-sm text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isFa ? "منطبق با استاندارد ملی ایران ۶۳۰۳" : "ISIRI 6303 Certified"}</span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-vertex-blueprint font-bold">EN 81-20/50</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 font-semibold">{isFa ? "مبحث ۱۵ مقررات ملی" : "Article 15 INBC"}</span>
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-vertex-primary tracking-tight font-mono leading-none">
              {dict.home.heroHeadline}
            </h1>
            <p className="text-lg sm:text-2xl text-vertex-secondary max-w-3xl mx-auto font-normal leading-relaxed">
              {dict.home.heroSubheadline}
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <NextLink
              href={`/${currentLocale}/engineering`}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-bold rounded-xl bg-vertex-primary text-white hover:bg-vertex-blueprint transition-all shadow-md group"
            >
              <Cpu className="w-4 h-4 text-sky-400 group-hover:text-white transition-colors" />
              <span>{isFa ? "استودیوی نقشه‌ها و مهندسی چاه" : "Explore LiftDesigner CAD Studio"}</span>
              <ArrowUpRight className="w-4 h-4" />
            </NextLink>

            <NextLink
              href={`/${currentLocale}/elevators`}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-bold rounded-xl bg-white text-vertex-primary border border-vertex-borderStrong hover:border-vertex-blueprint hover:bg-slate-50 transition-all shadow-sm"
            >
              <DoorClosed className="w-4 h-4 text-vertex-blueprint" />
              <span>{isFa ? "کاتالوگ آسانسورها و انواع درب‌ها" : "Elevators & Door Systems"}</span>
            </NextLink>
          </div>

          {/* 4 Core Verification Pillars */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-center font-mono">
            <div className="p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-vertex-border shadow-sm">
              <span className="text-2xl sm:text-3xl font-black text-vertex-blueprint block">10.0 m/s</span>
              <span className="text-[11px] text-vertex-steel uppercase mt-1 block font-bold">
                {isFa ? "بیشینه سرعت بالابر" : "Max Rated Speed"}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-vertex-border shadow-sm">
              <span className="text-2xl sm:text-3xl font-black text-emerald-700 block">ISIRI 6303</span>
              <span className="text-[11px] text-vertex-steel uppercase mt-1 block font-bold">
                {isFa ? "تاییدیه استاندارد ملی" : "National Code"}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-vertex-border shadow-sm">
              <span className="text-2xl sm:text-3xl font-black text-vertex-primary block">MRL PMSM</span>
              <span className="text-[11px] text-vertex-steel uppercase mt-1 block font-bold">
                {isFa ? "موتورهای بدون گیربکس" : "Gearless Architecture"}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-vertex-border shadow-sm">
              <span className="text-2xl sm:text-3xl font-black text-sky-600 block">EN 115-1</span>
              <span className="text-[11px] text-vertex-steel uppercase mt-1 block font-bold">
                {isFa ? "پله‌برقی‌های سنگین شهری" : "Heavy Transit Systems"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CORE SOLUTIONS (Structured, Elegant & Uncluttered)
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <SectionHeader
          badge={isFa ? "سامانه‌های جامع ترابری" : "VERTICAL SOLUTIONS"}
          title={isFa ? "راهکارهای مهندسی بالابر و پله‌برقی VERTEX" : "Engineered Mobility Solutions"}
          subtitle={
            isFa
              ? "طراحی و تأمین پیشرفته‌ترین آسانسورهای مسافری، بدون موتورخانه، بالابرهای بیمارستانی و پله‌برقی‌های ترافیک سنگین."
              : "State-of-the-art vertical transportation systems engineered to international and national safety codes."
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Card 1: Elevators */}
          <div className="rounded-2xl bg-white border border-vertex-border p-8 hover:border-vertex-blueprint transition-all duration-300 shadow-card flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-vertex-blueprint flex items-center justify-center mb-6 group-hover:bg-vertex-blueprint group-hover:text-white transition-all shadow-sm">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black font-mono text-vertex-primary">
                {isFa ? "آسانسورهای کششی و MRL" : "Traction & MRL Elevators"}
              </h3>
              <p className="mt-3 text-sm text-vertex-secondary font-normal leading-relaxed">
                {isFa
                  ? "سامانه‌های بالابر پرسرعت گیرلس و بدون موتورخانه (MRL) با اشغال حداقل فضای سازه‌ای و انطباق با استاندارد ۶۳۰۳."
                  : "High-speed and machine-room-less traction systems engineered for quiet, energy-efficient high-rise operations."}
              </p>
              <div className="mt-6 space-y-2 text-xs font-mono text-vertex-secondary">
                <div className="flex justify-between py-1.5 border-b border-vertex-border">
                  <span className="font-semibold">{isFa ? "ظرفیت نامی:" : "Rated Load:"}</span>
                  <span className="text-vertex-blueprint font-bold">450 kg – 2,500 kg</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-vertex-border">
                  <span className="font-semibold">{isFa ? "سرعت نامی:" : "Max Speed:"}</span>
                  <span className="text-emerald-700 font-bold">1.0 m/s – 10.0 m/s</span>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-vertex-border">
              <NextLink
                href={`/${currentLocale}/elevators`}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-vertex-blueprint hover:text-vertex-blueprintDark"
              >
                <span>{isFa ? "مشاهده مشخصات و مدل‌ها" : "View Elevator Systems"}</span>
                <ChevronRight className="w-4 h-4" />
              </NextLink>
            </div>
          </div>

          {/* Card 2: Escalators */}
          <div className="rounded-2xl bg-white border border-vertex-border p-8 hover:border-vertex-blueprint transition-all duration-300 shadow-card flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-vertex-blueprint flex items-center justify-center mb-6 group-hover:bg-vertex-blueprint group-hover:text-white transition-all shadow-sm">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black font-mono text-vertex-primary">
                {isFa ? "پله‌برقی و پیاده‌رو متحرک" : "Escalators & Moving Walks"}
              </h3>
              <p className="mt-3 text-sm text-vertex-secondary font-normal leading-relaxed">
                {isFa
                  ? "پله‌برقی‌های سنگین ترافیک شهری با زاویه ۳۰ و ۳۵ درجه برای مراکز خرید، ایستگاه‌های مترو و پایانه‌های فرودگاهی."
                  : "Continuous heavy-transit escalators and autowalks built for 24/7 reliability per EN 115-1 standards."}
              </p>
              <div className="mt-6 space-y-2 text-xs font-mono text-vertex-secondary">
                <div className="flex justify-between py-1.5 border-b border-vertex-border">
                  <span className="font-semibold">{isFa ? "زاویه شیب:" : "Inclination:"}</span>
                  <span className="text-vertex-blueprint font-bold">30° / 35° (0° – 12°)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-vertex-border">
                  <span className="font-semibold">{isFa ? "استاندارد:" : "Standard:"}</span>
                  <span className="text-emerald-700 font-bold">EN 115-1:2017</span>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-vertex-border">
              <NextLink
                href={`/${currentLocale}/escalators`}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-vertex-blueprint hover:text-vertex-blueprintDark"
              >
                <span>{isFa ? "بررسی سامانه‌های پله‌برقی" : "Explore Escalators"}</span>
                <ChevronRight className="w-4 h-4" />
              </NextLink>
            </div>
          </div>

          {/* Card 3: Doors & Compliance */}
          <div className="rounded-2xl bg-white border border-vertex-border p-8 hover:border-vertex-blueprint transition-all duration-300 shadow-card flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-vertex-blueprint flex items-center justify-center mb-6 group-hover:bg-vertex-blueprint group-hover:text-white transition-all shadow-sm">
                <DoorClosed className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black font-mono text-vertex-primary">
                {isFa ? "درب‌های استاندارد ایران و ۶۳۰۳" : "ISIRI 6303 Certified Doors"}
              </h3>
              <p className="mt-3 text-sm text-vertex-secondary font-normal leading-relaxed">
                {isFa
                  ? "بررسی کامل انواع درب‌های تلسکوپی، سانترال، لولایی و بیمارستانی منطبق با مقررات ملی ساختمان و سازمان ملی استاندارد."
                  : "Complete engineering reference for telescopic, center-opening, and manual hinged doors in Iranian construction."}
              </p>
              <div className="mt-6 space-y-2 text-xs font-mono text-vertex-secondary">
                <div className="flex justify-between py-1.5 border-b border-vertex-border">
                  <span className="font-semibold">{isFa ? "انواع مکانیزم:" : "Door Types:"}</span>
                  <span className="text-vertex-blueprint font-bold">Telescopic / Central / Hinged</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-vertex-border">
                  <span className="font-semibold">{isFa ? "کد ایمنی:" : "Safety Code:"}</span>
                  <span className="text-emerald-700 font-bold">ISIRI 6303-1 Art. 7.7</span>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-vertex-border">
              <NextLink
                href={`/${currentLocale}/elevators`}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-vertex-blueprint hover:text-vertex-blueprintDark"
              >
                <span>{isFa ? "راهنمای تخصصی درب‌های ایران" : "Explore Door Systems"}</span>
                <ChevronRight className="w-4 h-4" />
              </NextLink>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          ENGINEERING CAD TEASER (Prestige Callout to Studio)
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-vertex-border">
        <div className="rounded-3xl bg-slate-950 text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-float">
          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 bg-cad-dense opacity-20 pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-400/30 text-xs font-mono font-bold">
              <Cpu className="w-3.5 h-3.5" />
              <span>DIGIPARA LIFTDESIGNER™ & THREE.JS CAD STUDIO</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono leading-tight">
              {isFa 
                ? "استودیوی محاسبات چاه، آهن‌کشی و نقشه‌های فنی آسانسور" 
                : "Professional Hoistway CAD Studio & Engineering Kinematics"}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              {isFa
                ? "بررسی پلان تیرریزی آهن‌کشی، مقاطع ریل‌های T-Section بر اساس ISO 7465، نقشه موتورخانه و محاسبات پاراشوت و گاورنر منطبق بر استاندارد ملی ایران ۶۳۰۳ و EN 81-20."
                : "Explore parametric shaft layouts, ISO 7465 guide rail calculations, motor traction power, and safety gear tolerances in our interactive studio."}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <NextLink
                href={`/${currentLocale}/engineering`}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-mono font-bold rounded-xl bg-vertex-blueprint text-white hover:bg-sky-400 transition-all shadow-md"
              >
                <span>{isFa ? "ورود به استودیوی نقشه‌های CAD و محاسبات" : "Open Engineering CAD Studio"}</span>
                <ArrowUpRight className="w-4 h-4" />
              </NextLink>

              <NextLink
                href={`/${currentLocale}/configurator`}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-mono font-bold rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition-all border border-slate-700"
              >
                <span>{isFa ? "کانفیگوراتور داخلی کابین" : "Cabin Configurator"}</span>
                <ChevronRight className="w-4 h-4" />
              </NextLink>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SELECTED PROJECTS PREVIEW (Clean 3-Card Grid)
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-vertex-border">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <TechBadge variant="blueprint">{dict.projects.badge}</TechBadge>
            <h2 className="text-3xl sm:text-4xl font-black text-vertex-primary font-mono mt-3">
              {dict.home.projectsTitle}
            </h2>
            <p className="text-sm text-vertex-secondary font-normal mt-1">
              {dict.home.projectsSubtitle}
            </p>
          </div>
          <NextLink
            href={`/${currentLocale}/projects`}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-vertex-blueprint hover:underline"
          >
            <span>{isFa ? "مشاهده تمام پروژه‌ها و نقشه جهانی" : "View All Projects & GIS Map"}</span>
            <ArrowUpRight className="w-4 h-4" />
          </NextLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SHOWCASE_PROJECTS.slice(0, 3).map((p) => (
            <div
              key={p.id}
              className="group rounded-2xl bg-white border border-vertex-border overflow-hidden hover:border-vertex-blueprint transition-all duration-300 shadow-card flex flex-col justify-between"
            >
              <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden">
                <Image
                  src={p.image}
                  alt={isFa ? p.titleFa : p.titleEn}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-white/95 backdrop-blur-sm border border-vertex-border text-[11px] font-mono font-bold text-vertex-blueprint shadow-sm">
                  {p.speed}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-vertex-steel font-bold">
                    {isFa ? p.locationFa : p.locationEn}
                  </span>
                  <h3 className="text-base font-black font-mono text-vertex-primary mt-1">
                    {isFa ? p.titleFa : p.titleEn}
                  </h3>
                  <p className="text-xs text-vertex-secondary mt-1 font-normal">
                    {p.units}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-vertex-border flex items-center justify-between text-xs font-mono text-vertex-steel font-bold">
                  <span>{p.floors} {isFa ? "طبقه" : "Floors"}</span>
                  <span className="text-vertex-blueprint">{p.height}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          FINAL CTA & CONSULTATION
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-vertex-border">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-vertex-border shadow-card flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>{isFa ? "مشاوره رایگان مهندسی و انطباق با استاندارد ۶۳۰۳" : "Engineering Consultation & Code Compliance"}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-mono text-vertex-primary">
              {dict.home.ctaTitle}
            </h3>
            <p className="text-xs sm:text-sm text-vertex-secondary font-normal leading-relaxed">
              {dict.home.ctaSubtitle}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <NextLink
              href={`/${currentLocale}/contact`}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold rounded-xl bg-vertex-primary text-white hover:bg-vertex-blueprint transition-all shadow-sm"
            >
              <span>{dict.nav.requestConsultation}</span>
              <ArrowUpRight className="w-4 h-4" />
            </NextLink>
          </div>
        </div>
      </section>

      <PageInterconnect locale={currentLocale} />
    </div>
  );
}
