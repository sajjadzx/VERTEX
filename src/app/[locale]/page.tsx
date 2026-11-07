import React from "react";
import NextLink from "next/link";
import Image from "next/image";
import { Locale, dictionary } from "@/lib/dictionary";
import { SectionHeader } from "@/components/SectionHeader";
import { TechBadge } from "@/components/TechBadge";
import { InteractiveConfigurator } from "@/components/InteractiveConfigurator";
import { ElevatorAnatomy } from "@/components/ElevatorAnatomy";
import { EscalatorExplorer } from "@/components/EscalatorExplorer";
import { MaintenanceDashboard } from "@/components/MaintenanceDashboard";
import { ConsultationWizard } from "@/components/ConsultationWizard";
import { SHOWCASE_PROJECTS } from "@/lib/constants";
import { 
  ArrowUpRight, 
  ChevronRight, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Sliders, 
  Building2, 
  ArrowDown, 
  Maximize2 
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
    <div className="flex flex-col w-full overflow-hidden">
      {/* ========================================================
          HERO SECTION
      ======================================================== */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 bg-tech-grid bg-radial-glow overflow-hidden">
        {/* Subtle Architectural Backlight & Grid Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-vertex-deep/80 to-vertex-deep pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left / Text Info */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <TechBadge variant="cyan" className="mb-6">
              {dict.home.heroBadge}
            </TechBadge>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-vertex-ice tracking-tight leading-[1.08] font-mono">
              {dict.home.heroHeadline}
              <span className="text-vertex-cyan block font-sans font-light text-2xl sm:text-3xl lg:text-4xl mt-3 tracking-normal">
                {dict.brand.sloganSecondary}
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-vertex-steel font-light leading-relaxed max-w-2xl">
              {dict.home.heroSubheadline}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <NextLink
                href={`/${currentLocale}/elevators`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-vertex-cyan text-vertex-deep font-bold text-sm hover:bg-vertex-cyanHover transition-all shadow-cyan hover:shadow-cyanLg"
              >
                <span>{dict.home.heroCtaPrimary}</span>
                <ArrowUpRight className="w-4 h-4" />
              </NextLink>

              <NextLink
                href={`/${currentLocale}/configurator`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-vertex-surface border border-vertex-border text-vertex-ice font-semibold text-sm hover:border-vertex-cyan/50 hover:bg-vertex-elevated transition-all"
              >
                <Sliders className="w-4 h-4 text-vertex-cyan" />
                <span>{dict.home.heroCtaSecondary}</span>
              </NextLink>
            </div>

            {/* Metrics Ticker */}
            <div className="mt-14 pt-8 border-t border-vertex-border/80 w-full grid grid-cols-2 sm:grid-cols-4 gap-6">
              {dict.home.metrics.map((m, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-vertex-ice tracking-tight">
                    {m.value}
                  </span>
                  <span className="text-xs font-semibold text-vertex-cyan mt-1">
                    {m.label}
                  </span>
                  <span className="text-[11px] text-vertex-steel/70 mt-0.5">
                    {m.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Right / Architectural Elevator Graphic */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden border border-vertex-border bg-vertex-deep/90 shadow-2xl p-4 flex flex-col justify-between">
              {/* Glass Elevator Shaft Simulation */}
              <div className="absolute inset-0 bg-gradient-to-t from-vertex-deep via-transparent to-vertex-cyan/10 pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between p-3 rounded-lg bg-vertex-surface/80 border border-vertex-border">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-vertex-cyan animate-pulse" />
                  <span className="text-xs font-mono font-bold text-vertex-ice">
                    SHAFT TELEMETRY
                  </span>
                </div>
                <span className="text-xs font-mono text-vertex-cyan">LEVEL 84 ▲</span>
              </div>

              {/* Central Glowing Cab Representation */}
              <div className="relative z-10 w-full my-auto flex flex-col items-center">
                <div className="w-3/4 aspect-[4/5] rounded-xl border-2 border-vertex-cyan/80 bg-gradient-to-b from-vertex-surface/90 to-vertex-deep p-4 shadow-cyan flex flex-col justify-between relative overflow-hidden">
                  <div className="flex justify-between items-center text-[10px] font-mono text-vertex-steel border-b border-vertex-border/60 pb-1">
                    <span>VERTEX V-TRACTION</span>
                    <span className="text-vertex-cyan">10.0 m/s</span>
                  </div>

                  <div className="w-full flex justify-around my-auto">
                    {[1, 2, 3].map((v) => (
                      <div
                        key={v}
                        className="w-1.5 h-20 bg-gradient-to-b from-vertex-cyan to-transparent rounded-full animate-sensor"
                      />
                    ))}
                  </div>

                  <div className="w-full text-center py-1 rounded bg-vertex-deep/80 border border-vertex-border text-[10px] font-mono text-vertex-ice">
                    AERODYNAMIC SOUNDPROOFING &lt; 42 dB
                  </div>
                </div>
              </div>

              <div className="relative z-10 p-3 rounded-lg bg-vertex-surface/60 border border-vertex-border text-[11px] font-mono text-vertex-steel flex justify-between">
                <span>REGENERATIVE ACTIVE</span>
                <span className="text-emerald-400">+35% ENERGY RETURN</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SOLUTIONS SHOWCASE
      ======================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <SectionHeader
          badge={dict.elevators.badge}
          title={dict.home.solutionsTitle}
          subtitle={dict.home.solutionsSubtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Elevators */}
          <div className="group rounded-2xl bg-vertex-surface border border-vertex-border hover:border-vertex-cyan/50 p-8 transition-all duration-300 hover:shadow-cyan flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-vertex-cyan/5 rounded-full blur-2xl group-hover:bg-vertex-cyan/15 transition-all" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-vertex-deep border border-vertex-border flex items-center justify-center text-vertex-cyan mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold font-mono text-vertex-ice">
                {isFa ? "آسانسورهای کششی و MRL" : "Traction & MRL Elevators"}
              </h3>
              <p className="mt-3 text-sm text-vertex-steel font-light leading-relaxed">
                {isFa
                  ? "سامانه‌های مسافری فوق پرسرعت، کابین‌های پانورامیک شیشه‌ای و بالابرهای بدون موتورخانه با بالاترین راندمان مصرف انرژی."
                  : "High-speed skyscraper traction, luxury panoramic observation cabs, and space-saving MRL platforms."}
              </p>
              <div className="mt-6 space-y-2 text-xs font-mono text-vertex-steel">
                <div className="flex justify-between py-1 border-b border-vertex-border/60">
                  <span>{isFa ? "سرعت نامی:" : "Rated Speed:"}</span>
                  <span className="text-vertex-cyan font-bold">1.0 – 12.5 m/s</span>
                </div>
                <div className="flex justify-between py-1 border-b border-vertex-border/60">
                  <span>{isFa ? "استاندارد:" : "Standard:"}</span>
                  <span className="text-vertex-ice">EN 81-20/50</span>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-4">
              <NextLink
                href={`/${currentLocale}/elevators`}
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-vertex-cyan hover:text-vertex-cyanHover"
              >
                <span>{isFa ? "مشاهده تمام مدل‌ها" : "Explore Elevator Range"}</span>
                <ChevronRight className="w-4 h-4" />
              </NextLink>
            </div>
          </div>

          {/* Card 2: Escalators */}
          <div className="group rounded-2xl bg-vertex-surface border border-vertex-border hover:border-vertex-cyan/50 p-8 transition-all duration-300 hover:shadow-cyan flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-vertex-cyan/5 rounded-full blur-2xl group-hover:bg-vertex-cyan/15 transition-all" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-vertex-deep border border-vertex-border flex items-center justify-center text-vertex-cyan mb-6 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold font-mono text-vertex-ice">
                {isFa ? "پله‌برقی و پیاده‌رو متحرک" : "Escalators & Autowalks"}
              </h3>
              <p className="mt-3 text-sm text-vertex-steel font-light leading-relaxed">
                {isFa
                  ? "پله‌برقی‌های سنگین‌کار شهری منطبق بر EN 115 برای پایانه‌های فرودگاهی، ایستگاه‌های مترو و فضاهای تجاری مدرن."
                  : "Heavy transit public escalators and inclined autowalks engineered for 24/7 continuous urban throughput."}
              </p>
              <div className="mt-6 space-y-2 text-xs font-mono text-vertex-steel">
                <div className="flex justify-between py-1 border-b border-vertex-border/60">
                  <span>{isFa ? "زاویه شیب:" : "Inclination:"}</span>
                  <span className="text-vertex-cyan font-bold">30° / 35° (0° – 12°)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-vertex-border/60">
                  <span>{isFa ? "استاندارد:" : "Standard:"}</span>
                  <span className="text-vertex-ice">EN 115-1:2017</span>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-4">
              <NextLink
                href={`/${currentLocale}/escalators`}
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-vertex-cyan hover:text-vertex-cyanHover"
              >
                <span>{isFa ? "بررسی سامانه‌های پله‌برقی" : "Explore Escalators"}</span>
                <ChevronRight className="w-4 h-4" />
              </NextLink>
            </div>
          </div>

          {/* Card 3: Intelligent Dispatch */}
          <div className="group rounded-2xl bg-vertex-surface border border-vertex-border hover:border-vertex-cyan/50 p-8 transition-all duration-300 hover:shadow-cyan flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-vertex-cyan/5 rounded-full blur-2xl group-hover:bg-vertex-cyan/15 transition-all" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-vertex-deep border border-vertex-border flex items-center justify-center text-vertex-cyan mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold font-mono text-vertex-ice">
                {isFa ? "تخصیص هوشمند مقصد" : "Destination Dispatch AI"}
              </h3>
              <p className="mt-3 text-sm text-vertex-steel font-light leading-relaxed">
                {isFa
                  ? "سامانه هوشمند گروهی تخصیص کابین VERTEX Flow™ جهت کاهش زمان انتظار مسافران تا ۴۰ درصد و ارتقای چشمگیر راندمان."
                  : "Algorithmic group control routing passengers prior to boarding, minimizing waiting times and energy expenditure."}
              </p>
              <div className="mt-6 space-y-2 text-xs font-mono text-vertex-steel">
                <div className="flex justify-between py-1 border-b border-vertex-border/60">
                  <span>{isFa ? "بهینه‌سازی ترافیک:" : "Wait Reduction:"}</span>
                  <span className="text-vertex-cyan font-bold">-40% Latency</span>
                </div>
                <div className="flex justify-between py-1 border-b border-vertex-border/60">
                  <span>{isFa ? "کنترلر:" : "Controller:"}</span>
                  <span className="text-vertex-ice">VERTEX Flow™ Core</span>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-4">
              <NextLink
                href={`/${currentLocale}/engineering`}
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-vertex-cyan hover:text-vertex-cyanHover"
              >
                <span>{isFa ? "تحلیل فناوری مهندسی" : "View Technology"}</span>
                <ChevronRight className="w-4 h-4" />
              </NextLink>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          INTERACTIVE SHOWCASE 1: CABIN CONFIGURATOR
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <SectionHeader
          badge={dict.configurator.badge}
          title={dict.configurator.title}
          subtitle={dict.configurator.subtitle}
        />
        <InteractiveConfigurator locale={currentLocale} />
      </section>

      {/* ========================================================
          INTERACTIVE SHOWCASE 2: ELEVATOR ANATOMY
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-tech-grid bg-radial-glow">
        <SectionHeader
          badge={isFa ? "کالبدشکافی مکانیکی" : "MECHANICAL ANATOMY"}
          title={isFa ? "شماتیک انفجاری و استانداردهای ایمنی" : "Exploded Technical Elevator Anatomy"}
          subtitle={isFa ? "بررسی مکانیک دقیق قطعات، گاورنر، ترمز پاراشوت و ضربه‌گیرهای هیدرولیک چاهک." : "Inspect each vital subsystem, mechanical tolerances, and EN 81-20 safety functions."}
        />
        <ElevatorAnatomy locale={currentLocale} />
      </section>

      {/* ========================================================
          INTERACTIVE SHOWCASE 3: ESCALATOR EXPLORER
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <SectionHeader
          badge={dict.escalators.badge}
          title={isFa ? "کاوشگر ساختار پله‌برقی صنعتی" : "Escalator Structural Explorer"}
          subtitle={isFa ? "بررسی برش عرضی خرپای سازه‌ای، پله‌های آلومینیومی و سنسورهای ایمنی شانه." : "Cross-sectional structural analysis of heavy-duty public transit escalator engineering."}
        />
        <EscalatorExplorer locale={currentLocale} />
      </section>

      {/* ========================================================
          SELECTED PROJECTS PREVIEW
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <TechBadge variant="cyan">{dict.projects.badge}</TechBadge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-vertex-ice font-mono mt-3">
              {dict.home.projectsTitle}
            </h2>
            <p className="text-sm text-vertex-steel font-light mt-1">
              {dict.home.projectsSubtitle}
            </p>
          </div>
          <NextLink
            href={`/${currentLocale}/projects`}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-vertex-cyan hover:underline"
          >
            <span>{isFa ? "مشاهده تمام پروژه‌ها" : "View All Projects"}</span>
            <ArrowUpRight className="w-4 h-4" />
          </NextLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SHOWCASE_PROJECTS.slice(0, 3).map((p) => (
            <div
              key={p.id}
              className="group rounded-xl bg-vertex-surface border border-vertex-border overflow-hidden hover:border-vertex-cyan/50 transition-all flex flex-col justify-between"
            >
              <div className="relative w-full aspect-[16/10] bg-vertex-deep overflow-hidden">
                <Image
                  src={p.image}
                  alt={isFa ? p.titleFa : p.titleEn}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-vertex-deep/90 border border-vertex-border text-[10px] font-mono text-vertex-cyan">
                  {p.speed}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-vertex-steel">
                    {isFa ? p.locationFa : p.locationEn}
                  </span>
                  <h3 className="text-base font-bold font-mono text-vertex-ice mt-1">
                    {isFa ? p.titleFa : p.titleEn}
                  </h3>
                  <p className="text-xs text-vertex-steel/80 mt-1 font-light">
                    {p.units}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-vertex-border/60 flex items-center justify-between text-xs font-mono text-vertex-steel">
                  <span>{p.floors} {isFa ? "طبقه" : "Floors"}</span>
                  <span className="text-vertex-cyan">{p.height}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          MAINTENANCE DASHBOARD PREVIEW
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <SectionHeader
          badge={dict.maintenance.badge}
          title={dict.home.maintenanceTitle}
          subtitle={dict.home.maintenanceSubtitle}
        />
        <MaintenanceDashboard locale={currentLocale} />
      </section>

      {/* ========================================================
          FINAL CTA & SMART CONSULTATION WIZARD
      ======================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <SectionHeader
          badge={dict.contact.badge}
          title={dict.home.ctaTitle}
          subtitle={dict.home.ctaSubtitle}
        />
        <ConsultationWizard locale={currentLocale} />
      </section>
    </div>
  );
}
