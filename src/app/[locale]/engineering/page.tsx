import React from "react";
import type { Metadata } from "next";
import NextLink from "next/link";
import { Locale, dictionary } from "@/lib/dictionary";
import { SectionHeader } from "@/components/SectionHeader";
import { TechBadge } from "@/components/TechBadge";
import { ElevatorAnatomy } from "@/components/ElevatorAnatomy";
import { ThreeCADShaftViewer } from "@/components/ThreeCADShaftViewer";
import { CADBlueprintShaft } from "@/components/CADBlueprintShaft";
import { TractionCalculator } from "@/components/TractionCalculator";
import { PageInterconnect } from "@/components/PageInterconnect";
import { Cpu, Zap, Activity, ShieldCheck, ArrowUpRight, Gauge, Layers, Box } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = (locale === "fa" ? "fa" : "en") as Locale;
  const dict = dictionary[currentLocale];
  return {
    title: dict.nav.engineering,
    description: dict.engineering.subtitle,
  };
}

export default async function EngineeringPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = (locale === "fa" ? "fa" : "en") as Locale;
  const dict = dictionary[currentLocale];
  const isFa = currentLocale === "fa";

  const pillars = dict.engineering.pillars;

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-20 bg-vertex-bg">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <TechBadge variant="blueprint">{dict.engineering.badge}</TechBadge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-vertex-primary font-mono tracking-tight">
          {dict.engineering.title}
        </h1>
        <p className="text-base sm:text-lg text-vertex-secondary font-normal leading-relaxed">
          {dict.engineering.subtitle}
        </p>
      </div>

      {/* 4 Engineering Pillars in Bright Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {pillars.map((pillar, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-white border border-vertex-border p-8 hover:border-vertex-blueprint transition-all shadow-card flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-vertex-border">
                <span className="text-xs font-mono font-bold text-vertex-blueprint uppercase tracking-wider">
                  PILLAR 0{idx + 1}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-vertex-blueprint" />
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-mono text-vertex-primary mt-4">
                {pillar.title}
              </h2>
              <p className="text-sm text-vertex-secondary font-normal mt-3 leading-relaxed">
                {pillar.desc}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-vertex-border flex items-center justify-between text-xs font-mono text-vertex-steel font-bold">
              <span className="text-emerald-700 font-bold">100% PROVEN STANDARD</span>
              <span className="text-vertex-blueprint font-mono">EN 81-20/50</span>
            </div>
          </div>
        ))}
      </div>

      {/* Three.js 3D WebGL CAD Shaft Studio */}
      <div className="pt-4 space-y-4">
        <SectionHeader
          align="left"
          badge={isFa ? "موتور سه‌بعدی محاسبات چاه" : "THREE.JS 3D CAD ENGINE"}
          title={isFa ? "استودیوی سه‌بعدی وکتوری و مدل‌سازی چاه آسانسور" : "Interactive 3D WebGL Parametric Shaft Model"}
          subtitle={
            isFa 
              ? "مدل‌سازی زنده اجزای سازه‌ای چاه: آهن‌کشی، تیرریزی، ریل‌های T-Section، کادر وزنه تعادل، فضاهای جان‌پناه و ضربه‌گیرهای هیدرولیک."
              : "Real-time 3D parametric visualization of shaft steel beams, counterweight sling, refuge safety cubes, and pit buffer kinematics."
          }
        />
        <ThreeCADShaftViewer locale={currentLocale} />
      </div>

      {/* Embedded 2D CAD Blueprint Shaft Component */}
      <div className="pt-4 space-y-4">
        <SectionHeader
          align="left"
          badge={isFa ? "پلان و مقطع معماری" : "2D ARCHITECTURAL BLUEPRINTS"}
          title={isFa ? "دیمانسیون و نقشه‌کشی ۲ بعدی چاه (مبحث ۱۵ ایران)" : "2D Orthographic CAD Blueprint Dimensioner"}
          subtitle={
            isFa 
              ? "برش مقطع و پلان افقی چاه با اندازه‌گذاری‌های استاندارد، فواصل درها و محدوده چاهک."
              : "Plan and section orthographic callouts conforming to ISO 8100-32 and national building codes."
          }
        />
        <CADBlueprintShaft locale={currentLocale} />
      </div>

      {/* Embedded Traction Kinematic Calculator */}
      <div className="pt-4 space-y-4">
        <SectionHeader
          align="left"
          badge={isFa ? "محاسبات فنی درایو و موتور" : "KINEMATICS & ELECTRICAL"}
          title={isFa ? "ماشین‌حساب مهندسی توان، گشتاور و اصطکاک کششی" : "Traction Kinematics & Euler-Eytelwein Engine"}
          subtitle={
            isFa 
              ? "محاسبه زنده توان الکتروموتور گیرلس، گشتاور نامی شفت، جرم وزنه تعادل و کنترل شرایط اصطکاک عدم لغزش."
              : "Live calculation of motor shaft kW power, torque, counterweight mass, and rope traction safety factors."
          }
        />
        <TractionCalculator locale={currentLocale} />
      </div>

      {/* Embedded Anatomy Component */}
      <div className="pt-4">
        <ElevatorAnatomy locale={currentLocale} />
      </div>

      {/* Kinematics Benchmarks / Charts Section */}
      <div className="rounded-2xl bg-white border border-vertex-border p-8 lg:p-12 space-y-8 shadow-card">
        <SectionHeader
          align="left"
          badge={isFa ? "تحلیل آکوستیک و ارتعاشات" : "VIBRATION & ACOUSTICS"}
          title={isFa ? "آزمون شتاب‌سنجی و آسایش سفر مسافر (ISO 18738)" : "Ride Comfort & Dynamic Vibration Isolation"}
          subtitle={
            isFa
              ? "انطباق با استانداردهای سختگیرانه ارتعاشات عمودی و جانبی بر اساس ISO 18738."
              : "Rigorous ISO 18738 compliance for peak-to-peak horizontal and vertical car vibrations."
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-mono">
          <div className="p-5 rounded-xl bg-vertex-elevated border border-vertex-border">
            <span className="text-vertex-steel text-[11px] block font-semibold">
              {isFa ? "بیشینه شتاب جانبی (X/Y Peak-to-Peak)" : "Lateral Vibration Peak"}
            </span>
            <span className="text-2xl font-black text-vertex-blueprint mt-2 block">&lt; 0.12 m/s²</span>
            <span className="text-vertex-secondary text-[10px] mt-1 block">ISO 18738 Class A benchmark</span>
          </div>

          <div className="p-5 rounded-xl bg-vertex-elevated border border-vertex-border">
            <span className="text-vertex-steel text-[11px] block font-semibold">
              {isFa ? "شتاب کاهنده ترمز ایمنی" : "Safety Gear Deceleration"}
            </span>
            <span className="text-2xl font-black text-vertex-primary mt-2 block">0.2g – 1.0g</span>
            <span className="text-vertex-secondary text-[10px] mt-1 block">EN 81-20 § 5.6.3 strictly enforced</span>
          </div>

          <div className="p-5 rounded-xl bg-vertex-elevated border border-vertex-border">
            <span className="text-vertex-steel text-[11px] block font-semibold">
              {isFa ? "آکوستیک صوتی در سرعت بیشینه" : "In-Cabin Max Acoustic"}
            </span>
            <span className="text-2xl font-black text-emerald-700 mt-2 block">&lt; 42 dBA</span>
            <span className="text-vertex-secondary text-[10px] mt-1 block">Acoustic aerodynamic shroud</span>
          </div>
        </div>
      </div>

      <PageInterconnect locale={currentLocale} />
    </div>
  );
}
