import React from "react";
import type { Metadata } from "next";
import NextLink from "next/link";
import { Locale, dictionary } from "@/lib/dictionary";
import { SectionHeader } from "@/components/SectionHeader";
import { TechBadge } from "@/components/TechBadge";
import { ElevatorAnatomy } from "@/components/ElevatorAnatomy";
import { LiftDesignerUnifiedWorkspace } from "@/components/LiftDesignerUnifiedWorkspace";
import { PageInterconnect } from "@/components/PageInterconnect";
import { Cpu, Zap, Activity, ShieldCheck, ArrowUpRight, Gauge, Layers, Box, CheckCircle2 } from "lucide-react";

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

        {/* Standard ISIRI 6303 Pill */}
        <div className="inline-flex items-center gap-2 p-2 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-900">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            {isFa 
              ? "پوشش جامع استانداردهای ملی ایران شماره ۶۳۰۳-۱ و ۶۳۰۳-۲، مبحث ۱۵ مقررات ملی و استانداردهای اروپایی EN 81-20/50" 
              : "Full conformity to ISIRI 6303-1 / 6303-2, Iranian National Building Code Art. 15, and EN 81-20/50."}
          </span>
        </div>
      </div>

      {/* Unified DigiPara LiftDesigner Engineering Workstation */}
      <div className="pt-2">
        <LiftDesignerUnifiedWorkspace locale={currentLocale} />
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
              <span className="text-emerald-700 font-bold">ISIRI 6303 / EN 81</span>
              <span className="text-vertex-blueprint font-mono">100% COMPLIANT</span>
            </div>
          </div>
        ))}
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
              ? "انطباق با استانداردهای سختگیرانه ارتعاشات عمودی و جانبی بر اساس ISO 18738 و استاندارد ۶۳۰۳."
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
            <span className="text-vertex-secondary text-[10px] mt-1 block">بند ۹-۸ استاندارد ملی ۶۳۰۳</span>
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
