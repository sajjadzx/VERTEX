import React from "react";
import type { Metadata } from "next";
import NextLink from "next/link";
import { Locale, dictionary } from "@/lib/dictionary";
import { SectionHeader } from "@/components/SectionHeader";
import { TechBadge } from "@/components/TechBadge";
import { ShieldCheck, Cpu } from "lucide-react";

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
    { code: "EN 81-20/50:2020", title: "Safety rules for the construction and installation of passenger and goods lifts" },
    { code: "EN 115-1:2017", title: "Safety of escalators and moving walks - Construction and installation" },
    { code: "مبحث ۱۵ مقررات ملی", title: "طراحی، ساخت و نظارت بر آسانسورها و پلکان‌برقی‌های ساختمان" },
    { code: "ISO 9001:2015", title: "Quality management systems certification for precision lift mechanisms" },
    { code: "ISO 14001:2015", title: "Environmental management systems and green regenerative drives" },
    { code: "ASME A17.1 / CSA B44", title: "Safety code for elevators and escalators (Americas)" },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-20 bg-vertex-bg">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <TechBadge variant="blueprint">{dict.about.badge}</TechBadge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-vertex-primary font-mono tracking-tight">
          {dict.about.title}
        </h1>
        <p className="text-base sm:text-lg text-vertex-secondary font-normal leading-relaxed">
          {dict.about.subtitle}
        </p>
      </div>

      {/* Philosophy Section */}
      <div className="rounded-2xl bg-white border border-vertex-border p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-card">
        <div className="lg:col-span-7 space-y-4">
          <TechBadge variant="slate">
            {isFa ? "فلسفه مهندسی ما" : "OUR CREED"}
          </TechBadge>
          <h2 className="text-2xl sm:text-3xl font-black font-mono text-vertex-primary">
            {dict.about.missionTitle}
          </h2>
          <p className="text-sm sm:text-base text-vertex-secondary font-normal leading-relaxed">
            {dict.about.missionText}
          </p>
          <div className="pt-4 flex items-center gap-4 text-xs font-mono font-bold text-vertex-blueprint">
            <span>ZURICH HEADQUARTERS</span>
            <span>•</span>
            <span>DUBAI R&D HUB</span>
            <span>•</span>
            <span>TEHRAN ENGINEERING BRANCH</span>
          </div>
        </div>

        <div className="lg:col-span-5 p-6 rounded-xl bg-vertex-elevated border border-vertex-border space-y-3 font-mono text-xs text-vertex-secondary">
          <div className="text-vertex-primary font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-vertex-blueprint" />
            <span>R&D Test Tower Specs</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-vertex-border">
            <span>Tower Height:</span>
            <span className="text-vertex-blueprint font-black">245 Meters</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-vertex-border">
            <span>Test Shafts:</span>
            <span className="text-vertex-primary font-bold">7 High-Velocity Shafts</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-vertex-border">
            <span>Max Test Speed:</span>
            <span className="text-vertex-blueprint font-black">18.0 m/s Simulation</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span>Seismic Shaker:</span>
            <span className="text-emerald-700 font-bold">Zone 4 Calibrated</span>
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
              className="p-8 rounded-2xl bg-white border border-vertex-border hover:border-vertex-blueprint transition-all shadow-card"
            >
              <div className="text-xs font-mono font-bold text-vertex-blueprint uppercase tracking-wider mb-4">
                PRINCIPLE 0{idx + 1}
              </div>
              <h3 className="text-xl font-black font-mono text-vertex-primary">
                {val.title}
              </h3>
              <p className="text-sm text-vertex-secondary font-normal mt-3 leading-relaxed">
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
              className="p-4 rounded-xl bg-white border border-vertex-border flex items-start gap-3 shadow-sm"
            >
              <ShieldCheck className="w-5 h-5 text-vertex-blueprint shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-mono font-bold text-vertex-primary">
                  {s.code}
                </div>
                <div className="text-xs text-vertex-secondary font-normal mt-0.5">
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
