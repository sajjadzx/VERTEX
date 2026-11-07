import React from "react";
import type { Metadata } from "next";
import NextLink from "next/link";
import { Locale, dictionary } from "@/lib/dictionary";
import { SectionHeader } from "@/components/SectionHeader";
import { TechBadge } from "@/components/TechBadge";
import { ElevatorAnatomy } from "@/components/ElevatorAnatomy";
import { Cpu, Zap, Activity, ShieldCheck, ArrowUpRight, Gauge, Layers } from "lucide-react";

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
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <TechBadge variant="cyan">{dict.engineering.badge}</TechBadge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-vertex-ice font-mono tracking-tight">
          {dict.engineering.title}
        </h1>
        <p className="text-base sm:text-lg text-vertex-steel font-light leading-relaxed">
          {dict.engineering.subtitle}
        </p>
      </div>

      {/* 4 Engineering Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {pillars.map((pillar, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-vertex-surface border border-vertex-border p-8 hover:border-vertex-cyan/50 transition-all shadow-card flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-vertex-border">
                <span className="text-xs font-mono font-bold text-vertex-cyan uppercase tracking-wider">
                  PILLAR 0{idx + 1}
                </span>
                <span className="w-2 h-2 rounded-full bg-vertex-cyan shadow-cyan" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold font-mono text-vertex-ice mt-4">
                {pillar.title}
              </h2>
              <p className="text-sm text-vertex-steel font-light mt-3 leading-relaxed">
                {pillar.desc}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-vertex-border/60 flex items-center justify-between text-xs font-mono text-vertex-steel">
              <span className="text-emerald-400 font-bold">100% PROVEN STANDARD</span>
              <span className="text-vertex-cyan font-mono">EN 81-20/50</span>
            </div>
          </div>
        ))}
      </div>

      {/* Embedded Anatomy Component */}
      <div className="pt-4">
        <ElevatorAnatomy locale={currentLocale} />
      </div>

      {/* Kinematics Benchmarks / Charts Section */}
      <div className="rounded-2xl bg-vertex-surface/60 border border-vertex-border p-8 lg:p-12 space-y-8">
        <SectionHeader
          align="left"
          badge={isFa ? "تحلیل آکوستیک و ارتعاشات" : "VIBRATION & ACOUSTICS"}
          title={isFa ? "آزمون شتاب‌سنجی و آسایش سفر مسافر" : "Ride Comfort & Dynamic Vibration Isolation"}
          subtitle={
            isFa
              ? "انطباق با استانداردهای سختگیرانه ارتعاشات عمودی و جانبی بر اساس ISO 18738."
              : "Rigorous ISO 18738 compliance for peak-to-peak horizontal and vertical car vibrations."
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-mono">
          <div className="p-5 rounded-xl bg-vertex-deep border border-vertex-border">
            <span className="text-vertex-steel text-[11px] block">
              {isFa ? "بیشینه شتاب جانبی (X/Y Peak-to-Peak)" : "Lateral Vibration Peak-to-Peak"}
            </span>
            <span className="text-2xl font-bold text-vertex-cyan mt-2 block">
              &lt; 0.12 m/s²
            </span>
            <span className="text-vertex-steel/80 text-[10px] mt-1 block">
              ISO 18738 Class A benchmark
            </span>
          </div>

          <div className="p-5 rounded-xl bg-vertex-deep border border-vertex-border">
            <span className="text-vertex-steel text-[11px] block">
              {isFa ? "شتاب کاهنده ترمز ایمنی" : "Controlled Deceleration Rate"}
            </span>
            <span className="text-2xl font-bold text-vertex-ice mt-2 block">
              0.2g – 1.0g
            </span>
            <span className="text-vertex-steel/80 text-[10px] mt-1 block">
              EN 81-20 § 5.6.3 strictly enforced
            </span>
          </div>

          <div className="p-5 rounded-xl bg-vertex-deep border border-vertex-border">
            <span className="text-vertex-steel text-[11px] block">
              {isFa ? "آکوستیک صوتی در سرعت بیشینه" : "In-Cabin Sound Pressure"}
            </span>
            <span className="text-2xl font-bold text-emerald-400 mt-2 block">
              &lt; 42 dBA
            </span>
            <span className="text-vertex-steel/80 text-[10px] mt-1 block">
              Acoustic aerodynamic shroud
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
