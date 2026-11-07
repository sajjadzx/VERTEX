import React from "react";
import type { Metadata } from "next";
import NextLink from "next/link";
import { Locale, dictionary } from "@/lib/dictionary";
import { SectionHeader } from "@/components/SectionHeader";
import { TechBadge } from "@/components/TechBadge";
import { ShieldCheck, Award, Target, Compass, ArrowUpRight, Cpu } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = (locale === "fa" ? "fa" : "en") as Locale;
  const dict = dictionary[currentLocale];
  return {
    title: dict.nav.about,
    description: dict.about.subtitle,
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = (locale === "fa" ? "fa" : "en") as Locale;
  const dict = dictionary[currentLocale];
  const isFa = currentLocale === "fa";

  const standards = [
    { code: "EN 81-20/50:2020", title: "Safety rules for the construction and installation of lifts" },
    { code: "EN 115-1:2017", title: "Safety of escalators and moving walks" },
    { code: "ISO 9001:2015", title: "Quality management systems certification" },
    { code: "ISO 14001:2015", title: "Environmental management systems" },
    { code: "ASME A17.1 / CSA B44", title: "Safety code for elevators and escalators (Americas)" },
    { code: "VDI 4707 Part 1", title: "Energy efficiency classification of lifts: Class A" },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <TechBadge variant="cyan">{dict.about.badge}</TechBadge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-vertex-ice font-mono tracking-tight">
          {dict.about.title}
        </h1>
        <p className="text-base sm:text-lg text-vertex-steel font-light leading-relaxed">
          {dict.about.subtitle}
        </p>
      </div>

      {/* Philosophy Section */}
      <div className="rounded-2xl bg-vertex-surface border border-vertex-border p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-card">
        <div className="lg:col-span-7 space-y-4">
          <TechBadge variant="steel">
            {isFa ? "فلسفه مهندسی ما" : "OUR CREED"}
          </TechBadge>
          <h2 className="text-2xl sm:text-3xl font-bold font-mono text-vertex-ice">
            {dict.about.missionTitle}
          </h2>
          <p className="text-sm sm:text-base text-vertex-steel font-light leading-relaxed">
            {dict.about.missionText}
          </p>
          <div className="pt-4 flex items-center gap-4 text-xs font-mono text-vertex-cyan">
            <span>ZURICH HEADQUARTERS</span>
            <span>•</span>
            <span>DUBAI R&D HUB</span>
            <span>•</span>
            <span>TEHRAN ENGINEERING BRANCH</span>
          </div>
        </div>

        <div className="lg:col-span-5 p-6 rounded-xl bg-vertex-deep border border-vertex-border space-y-3 font-mono text-xs text-vertex-steel">
          <div className="text-vertex-ice font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-vertex-cyan" />
            <span>R&D Test Tower Specs</span>
          </div>
          <div className="flex justify-between py-1 border-b border-vertex-border">
            <span>Tower Height:</span>
            <span className="text-vertex-cyan font-bold">245 Meters</span>
          </div>
          <div className="flex justify-between py-1 border-b border-vertex-border">
            <span>Test Shafts:</span>
            <span className="text-vertex-ice font-bold">7 High-Velocity Shafts</span>
          </div>
          <div className="flex justify-between py-1 border-b border-vertex-border">
            <span>Max Test Speed:</span>
            <span className="text-vertex-cyan font-bold">18.0 m/s Simulation</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Seismic Shaker:</span>
            <span className="text-emerald-400 font-bold">Zone 4 Calibrated</span>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="space-y-8">
        <SectionHeader
          badge={isFa ? "ارزش‌های بنیادین" : "ENGINEERING ETHOS"}
          title={isFa ? "تعهد بی‌قید و شرط به کمال مکانیکی" : "Precision Without Compromise"}
          subtitle={
            isFa
              ? "سه اصل جدایی‌ناپذیر که کلیه سیستم‌های طراحی‌شده توسط ورتکس را هدایت می‌کنند."
              : "Three bedrock principles guiding every component forged in VERTEX facilities."
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dict.about.values.map((val, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-vertex-surface border border-vertex-border hover:border-vertex-cyan/50 transition-all shadow-card"
            >
              <div className="text-xs font-mono font-bold text-vertex-cyan uppercase tracking-wider mb-4">
                PRINCIPLE 0{idx + 1}
              </div>
              <h3 className="text-xl font-bold font-mono text-vertex-ice">
                {val.title}
              </h3>
              <p className="text-sm text-vertex-steel font-light mt-3 leading-relaxed">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Standards & Certifications */}
      <div className="space-y-8">
        <SectionHeader
          badge={isFa ? "استانداردها و تاییده‌ها" : "GLOBAL COMPLIANCE"}
          title={dict.about.standardsTitle}
          subtitle={
            isFa
              ? "تمامی قطعات مکانیکی، الکترونیکی و سازه‌ای ورتکس تحت نظارت سازمان‌های بازرسی بین‌المللی تولید می‌گردند."
              : "Certified by notified bodies across the European Union, Americas, and International Standardization Bodies."
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {standards.map((s, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-vertex-surface/70 border border-vertex-border flex items-start gap-3"
            >
              <ShieldCheck className="w-5 h-5 text-vertex-cyan shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-mono font-bold text-vertex-ice">
                  {s.code}
                </div>
                <div className="text-xs text-vertex-steel font-light mt-0.5">
                  {s.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
