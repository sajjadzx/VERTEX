import { PageInterconnect } from "@/components/PageInterconnect";
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
import { ThreeCADShaftViewer } from "@/components/ThreeCADShaftViewer";
import { ProjectWorldMap } from "@/components/ProjectWorldMap";
import { CADBlueprintShaft } from "@/components/CADBlueprintShaft";
import { TractionCalculator } from "@/components/TractionCalculator";
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
  ShieldCheck
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
    <div className="flex flex-col w-full overflow-hidden bg-vertex-bg">
      {/* ========================================================
          HERO SECTION (Bright Architectural Luxury)
      ======================================================== */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 bg-cad-paper bg-radial-light overflow-hidden border-b border-vertex-border">
        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left / Text Info */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <TechBadge variant="blueprint" className="mb-6">
              {dict.home.heroBadge}
            </TechBadge>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-vertex-primary tracking-tight leading-[1.08] font-mono">
              {dict.home.heroHeadline}
              <span className="text-vertex-blueprint block font-sans font-medium text-2xl sm:text-3xl lg:text-4xl mt-3 tracking-normal">
                {dict.brand.sloganSecondary}
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-vertex-secondary font-normal leading-relaxed max-w-2xl">
              {dict.home.heroSubheadline}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <NextLink
                href={`/${currentLocale}/elevators`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-vertex-primary text-white font-bold text-sm hover:bg-vertex-blueprint transition-all shadow-sm"
              >
                <span>{dict.home.heroCtaPrimary}</span>
                <ArrowUpRight className="w-4 h-4" />
              </NextLink>

              <NextLink
                href={`/${currentLocale}/configurator`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-vertex-borderStrong text-vertex-primary font-bold text-sm hover:border-vertex-blueprint hover:bg-vertex-elevated transition-all shadow-sm"
              >
                <Sliders className="w-4 h-4 text-vertex-blueprint" />
                <span>{dict.home.heroCtaSecondary}</span>
              </NextLink>
            </div>

            {/* Metrics Ticker */}
            <div className="mt-14 pt-8 border-t border-vertex-border w-full grid grid-cols-2 sm:grid-cols-4 gap-6">
              {dict.home.metrics.map((m, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-vertex-primary tracking-tight">
                    {m.value}
                  </span>
                  <span className="text-xs font-bold text-vertex-blueprint mt-1 font-mono">
                    {m.label}
                  </span>
                  <span className="text-[11px] text-vertex-steel mt-0.5 font-sans font-medium">
                    {m.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Right / High-Precision Architectural Hoistway Card */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden border border-vertex-borderStrong bg-white shadow-float p-6 flex flex-col justify-between space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-vertex-border">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-vertex-primary">
                  <span className="w-2.5 h-2.5 rounded-full bg-vertex-blueprint animate-pulse" />
                  <span>KINEMATIC SIMULATION</span>
                </div>
                <span className="text-xs font-mono font-bold text-vertex-blueprint">EN 81-20 PASS</span>
              </div>

              {/* Animated Shaft Visualization */}
              <div className="relative w-full h-64 bg-vertex-elevated rounded-xl border border-vertex-border overflow-hidden p-4 flex flex-col justify-between bg-cad-dense">
                <div className="flex justify-between items-center text-[10px] font-mono text-vertex-steel font-bold">
                  <span>HEADROOM: 4,200 mm</span>
                  <span className="text-vertex-blueprint font-bold">VELOCITY: 8.0 m/s</span>
                </div>

                {/* Central Moving Elevator Cab */}
                <div className="w-3/4 mx-auto my-auto p-4 rounded-xl bg-white border-2 border-vertex-blueprint shadow-blueprint flex flex-col justify-between">
                  <div className="flex justify-between items-center text-[10px] font-mono font-bold text-vertex-primary">
                    <span>CABIN TARE: 1,200 kg</span>
                    <span className="text-vertex-blueprint">Q = 1,000 kg</span>
                  </div>
                  <div className="py-3 flex justify-around">
                    <span className="w-1.5 h-10 bg-vertex-blueprint rounded-full" />
                    <span className="w-1.5 h-10 bg-slate-300 rounded-full" />
                    <span className="w-1.5 h-10 bg-vertex-blueprint rounded-full" />
                  </div>
                  <div className="text-[9px] font-mono text-center text-vertex-steel font-bold">
                    ACOUSTIC SHROUD &lt; 42 dBA
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-vertex-steel font-bold">
                  <span>PIT DEPTH: 1,600 mm</span>
                  <span className="text-emerald-700 font-bold">REGEN: +35%</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-sky-50 border border-sky-200 text-xs font-mono text-sky-900 flex justify-between font-bold">
                <span>PMSM DRIVE EFFICIENCY:</span>
                <span className="text-sky-800">94.8% DIRECT</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CAD BLUEPRINT & SHAFT DIMENSIONER (Core Engineering Highlight)
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <SectionHeader
          badge={isFa ? "نقشه‌های ابعادی و سازه‌ای چاه" : "STRUCTURAL HOISTWAY CAD"}
          title={isFa ? "محاسبات ابعادی چاه و کابین طبق مقررات ملی و EN 81-20" : "Precision Shaft & Cabin CAD Engineering"}
          subtitle={
            isFa
              ? "بررسی پلان افقی و مقطع قائم چاه با خطوط اندازه واقعی، ابعاد مفید و فضای جان‌پناه تکنسین."
              : "Interactive plan and vertical cross-sections with live dimension callouts and technician refuge volumes."
          }
        />
        <div className="space-y-8"><ThreeCADShaftViewer locale={currentLocale} /><CADBlueprintShaft locale={currentLocale} /></div>
      </section>

      {/* ========================================================
          TRACTION MOTOR & KINEMATICS CALCULATOR
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-vertex-border bg-slate-50/70">
        <SectionHeader
          badge={isFa ? "موتور محاسبات مکانیک و توان" : "KINEMATIC TORQUE ENGINE"}
          title={isFa ? "محاسبات توان الکتروموتور و آزمون کشش اولر-آیتل‌واین" : "Traction Motor Power & Friction Calculations"}
          subtitle={
            isFa
              ? "محاسبه توان نامی کیلووات، گشتاور نیوتن‌متر، کورس ضربه‌گیر چاهک و مهار سرش سیم‌بکسل بر روی فلکه موتور بر اساس EN 81-50."
              : "Compute shaft mechanical power, rotational torque, buffer stroke, and Euler-Eytelwein traction limits."
          }
        />
        <TractionCalculator locale={currentLocale} />
      </section>

      {/* ========================================================
          SOLUTIONS SHOWCASE (Bright Architectural Cards)
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-vertex-border">
        <SectionHeader
          badge={dict.elevators.badge}
          title={dict.home.solutionsTitle}
          subtitle={dict.home.solutionsSubtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Elevators */}
          <div className="group rounded-2xl bg-white border border-vertex-border hover:border-vertex-blueprint p-8 transition-all duration-300 shadow-card flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-vertex-elevated border border-vertex-border flex items-center justify-center text-vertex-blueprint mb-6 group-hover:bg-vertex-primary group-hover:text-white transition-all shadow-sm">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black font-mono text-vertex-primary">
                {isFa ? "آسانسورهای کششی و MRL" : "Traction & MRL Elevators"}
              </h3>
              <p className="mt-3 text-sm text-vertex-secondary font-normal leading-relaxed">
                {isFa
                  ? "سامانه‌های مسافری فوق پرسرعت تا ۱۲.۵ متر بر ثانیه، کابین‌های پانورامیک شیشه‌ای و بالابرهای بدون موتورخانه با بالاترین راندمان مصرف انرژی."
                  : "High-speed skyscraper traction, luxury panoramic observation cabs, and space-saving MRL platforms."}
              </p>
              <div className="mt-6 space-y-2 text-xs font-mono text-vertex-secondary">
                <div className="flex justify-between py-1.5 border-b border-vertex-border">
                  <span className="font-semibold">{isFa ? "سرعت نامی:" : "Rated Speed:"}</span>
                  <span className="text-vertex-blueprint font-bold">1.0 – 12.5 m/s</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-vertex-border">
                  <span className="font-semibold">{isFa ? "استاندارد مرجع:" : "Standard:"}</span>
                  <span className="text-vertex-primary font-bold">EN 81-20/50</span>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-vertex-border">
              <NextLink
                href={`/${currentLocale}/elevators`}
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-vertex-blueprint hover:text-vertex-blueprintDark"
              >
                <span>{isFa ? "مشاهده تمام مدل‌ها" : "Explore Elevator Range"}</span>
                <ChevronRight className="w-4 h-4" />
              </NextLink>
            </div>
          </div>

          {/* Card 2: Escalators */}
          <div className="group rounded-2xl bg-white border border-vertex-border hover:border-vertex-blueprint p-8 transition-all duration-300 shadow-card flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-vertex-elevated border border-vertex-border flex items-center justify-center text-vertex-blueprint mb-6 group-hover:bg-vertex-primary group-hover:text-white transition-all shadow-sm">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black font-mono text-vertex-primary">
                {isFa ? "پله‌برقی و پیاده‌رو متحرک" : "Escalators & Autowalks"}
              </h3>
              <p className="mt-3 text-sm text-vertex-secondary font-normal leading-relaxed">
                {isFa
                  ? "پله‌برقی‌های سنگین‌کار شهری منطبق بر EN 115 برای پایانه‌های فرودگاهی، ایستگاه‌های مترو و فضاهای تجاری مدرن با صرفه‌جویی انرژی Eco-Crawl."
                  : "Heavy transit public escalators and inclined autowalks engineered for 24/7 continuous urban throughput."}
              </p>
              <div className="mt-6 space-y-2 text-xs font-mono text-vertex-secondary">
                <div className="flex justify-between py-1.5 border-b border-vertex-border">
                  <span className="font-semibold">{isFa ? "زاویه شیب:" : "Inclination:"}</span>
                  <span className="text-vertex-blueprint font-bold">30° / 35° (0° – 12°)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-vertex-border">
                  <span className="font-semibold">{isFa ? "استاندارد:" : "Standard:"}</span>
                  <span className="text-vertex-primary font-bold">EN 115-1:2017</span>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-vertex-border">
              <NextLink
                href={`/${currentLocale}/escalators`}
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-vertex-blueprint hover:text-vertex-blueprintDark"
              >
                <span>{isFa ? "بررسی سامانه‌های پله‌برقی" : "Explore Escalators"}</span>
                <ChevronRight className="w-4 h-4" />
              </NextLink>
            </div>
          </div>

          {/* Card 3: Intelligent Dispatch */}
          <div className="group rounded-2xl bg-white border border-vertex-border hover:border-vertex-blueprint p-8 transition-all duration-300 shadow-card flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-vertex-elevated border border-vertex-border flex items-center justify-center text-vertex-blueprint mb-6 group-hover:bg-vertex-primary group-hover:text-white transition-all shadow-sm">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black font-mono text-vertex-primary">
                {isFa ? "تخصیص هوشمند مقصد (AI)" : "Destination Dispatch AI"}
              </h3>
              <p className="mt-3 text-sm text-vertex-secondary font-normal leading-relaxed">
                {isFa
                  ? "سامانه هوشمند گروهی تخصیص کابین VERTEX Flow™ جهت کاهش زمان انتظار مسافران تا ۴۰ درصد بر اساس CIBSE Guide D."
                  : "Algorithmic group control routing passengers prior to boarding, minimizing waiting times and energy expenditure."}
              </p>
              <div className="mt-6 space-y-2 text-xs font-mono text-vertex-secondary">
                <div className="flex justify-between py-1.5 border-b border-vertex-border">
                  <span className="font-semibold">{isFa ? "بهینه‌سازی ترافیک:" : "Wait Reduction:"}</span>
                  <span className="text-vertex-blueprint font-bold">-40% Latency</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-vertex-border">
                  <span className="font-semibold">{isFa ? "کنترلر:" : "Controller:"}</span>
                  <span className="text-vertex-primary font-bold">VERTEX Flow™ Core</span>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-vertex-border">
              <NextLink
                href={`/${currentLocale}/engineering`}
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-vertex-blueprint hover:text-vertex-blueprintDark"
              >
                <span>{isFa ? "تحلیل فناوری مهندسی" : "View Technology"}</span>
                <ChevronRight className="w-4 h-4" />
              </NextLink>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CABIN ARCHITECTURAL STUDIO (Light Luxury Finishes)
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-vertex-border">
        <SectionHeader
          badge={dict.configurator.badge}
          title={dict.configurator.title}
          subtitle={dict.configurator.subtitle}
        />
        <InteractiveConfigurator locale={currentLocale} />
      </section>

      {/* ========================================================
          ELEVATOR ANATOMY (Technical Drawing)
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-vertex-border bg-slate-50/70">
        <SectionHeader
          badge={isFa ? "کالبدشکافی مکانیکی" : "MECHANICAL ANATOMY"}
          title={isFa ? "شماتیک انفجاری و استانداردهای ایمنی" : "Exploded Technical Elevator Anatomy"}
          subtitle={isFa ? "بررسی مکانیک دقیق قطعات، گاورنر، ترمز پاراشوت و ضربه‌گیرهای هیدرولیک چاهک." : "Inspect each vital subsystem, mechanical tolerances, and EN 81-20 safety functions."}
        />
        <ElevatorAnatomy locale={currentLocale} />
      </section>

      {/* ========================================================
          ESCALATOR EXPLORER
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-vertex-border">
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
            <span>{isFa ? "مشاهده تمام پروژه‌ها" : "View All Projects"}</span>
            <ArrowUpRight className="w-4 h-4" />
          </NextLink>
        </div>

        <div className="mb-10"><ProjectWorldMap locale={currentLocale} /></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SHOWCASE_PROJECTS.slice(0, 3).map((p) => (
            <div
              key={p.id}
              className="group rounded-xl bg-white border border-vertex-border overflow-hidden hover:border-vertex-blueprint transition-all duration-300 shadow-card flex flex-col justify-between"
            >
              <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden">
                <Image
                  src={p.image}
                  alt={isFa ? p.titleFa : p.titleEn}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-white/90 backdrop-blur-sm border border-vertex-border text-[11px] font-mono font-bold text-vertex-blueprint">
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
          MAINTENANCE DASHBOARD PREVIEW
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-vertex-border bg-slate-50/70">
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-vertex-border">
        <SectionHeader
          badge={dict.contact.badge}
          title={dict.home.ctaTitle}
          subtitle={dict.home.ctaSubtitle}
        />
        <ConsultationWizard locale={currentLocale} />
      </section>
      <PageInterconnect locale={currentLocale} />
    </div>
  );
}
