import React from "react";
import type { Metadata } from "next";
import NextLink from "next/link";
import { Locale, dictionary } from "@/lib/dictionary";
import { SectionHeader } from "@/components/SectionHeader";
import { TechBadge } from "@/components/TechBadge";
import { ElevatorAnatomy } from "@/components/ElevatorAnatomy";
import { Check, ArrowUpRight, Gauge, Cpu, Sliders, Shield } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = (locale === "fa" ? "fa" : "en") as Locale;
  const dict = dictionary[currentLocale];
  return {
    title: dict.nav.elevators,
    description: dict.elevators.subtitle,
  };
}

export default async function ElevatorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = (locale === "fa" ? "fa" : "en") as Locale;
  const dict = dictionary[currentLocale];
  const isFa = currentLocale === "fa";

  const matrixData = [
    {
      model: "VERTEX Apex V-12",
      typeEn: "Ultra High-Rise Skyscraper",
      typeFa: "برج‌های آسمان‌خراش فوق پرسرعت",
      speed: "Up to 12.5 m/s",
      capacity: "1,600 – 2,500 kg",
      maxRise: "600 m",
      drive: "PMSM Double-Wrap Gearless",
      noise: "< 42 dBA",
    },
    {
      model: "VERTEX Horizon MRL",
      typeEn: "Machine Room-Less Architectural",
      typeFa: "بدون موتورخانه لوکس شهری",
      speed: "1.0 – 2.5 m/s",
      capacity: "450 – 1,600 kg",
      maxRise: "90 m",
      drive: "Compact Overhead PMSM",
      noise: "< 45 dBA",
    },
    {
      model: "VERTEX Vista Crystal",
      typeEn: "Panoramic Glass Luxury Atrium",
      typeFa: "پانوراما شیشه‌ای آتریوم و هتل",
      speed: "1.6 – 4.0 m/s",
      capacity: "800 – 2,000 kg",
      maxRise: "180 m",
      drive: "Underslung Quiet Traction",
      noise: "< 44 dBA",
    },
    {
      model: "VERTEX Titan Heavy",
      typeEn: "Industrial Heavy Freight & Cargo",
      typeFa: "باربری و صنعتی فوق سنگین",
      speed: "0.5 – 1.5 m/s",
      capacity: "2,000 – 10,000 kg",
      maxRise: "60 m",
      drive: "High-Torque 2:1 / 4:1 Traction",
      noise: "< 55 dBA",
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-24">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <TechBadge variant="cyan">{dict.elevators.badge}</TechBadge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-vertex-ice font-mono tracking-tight">
          {dict.elevators.title}
        </h1>
        <p className="text-base sm:text-lg text-vertex-steel font-light leading-relaxed">
          {dict.elevators.subtitle}
        </p>
      </div>

      {/* Solutions Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {dict.elevators.categories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-2xl bg-vertex-surface border border-vertex-border p-8 hover:border-vertex-cyan/50 transition-all shadow-card flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-vertex-border">
                <span className="text-xs font-mono font-bold text-vertex-cyan uppercase tracking-wider">
                  SERIES {cat.id.toUpperCase()}
                </span>
                <span className="text-xs font-mono text-vertex-ice bg-vertex-deep px-3 py-1 rounded border border-vertex-border">
                  {cat.speed}
                </span>
              </div>

              <h2 className="text-2xl font-bold font-mono text-vertex-ice mt-4">
                {cat.name}
              </h2>
              <p className="text-sm text-vertex-steel font-light mt-2 leading-relaxed">
                {cat.desc}
              </p>

              {/* Technical Badges */}
              <div className="grid grid-cols-2 gap-3 mt-6 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-vertex-deep border border-vertex-border">
                  <span className="text-vertex-steel text-[10px] block">
                    {isFa ? "ظرفیت نامی:" : "Rated Capacity:"}
                  </span>
                  <span className="text-vertex-ice font-bold">{cat.capacity}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-vertex-deep border border-vertex-border">
                  <span className="text-vertex-steel text-[10px] block">
                    {isFa ? "حداکثر ارتفاع:" : "Max Travel Height:"}
                  </span>
                  <span className="text-vertex-ice font-bold">{cat.travel}</span>
                </div>
              </div>

              {/* Key Specs checklist */}
              <ul className="mt-6 space-y-2">
                {cat.specs.map((sp, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-xs font-mono text-vertex-steel"
                  >
                    <Check className="w-4 h-4 text-vertex-cyan shrink-0" />
                    <span>{sp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-vertex-border flex items-center justify-between">
              <NextLink
                href={`/${currentLocale}/configurator`}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-vertex-cyan hover:underline"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{isFa ? "شخصی‌سازی کابین" : "Customize Cabin"}</span>
              </NextLink>

              <NextLink
                href={`/${currentLocale}/contact`}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-vertex-ice hover:text-vertex-cyan"
              >
                <span>{isFa ? "استعلام قیمت مهندسی" : "Request Spec Sheet"}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </NextLink>
            </div>
          </div>
        ))}
      </div>

      {/* Engineering Specification Matrix Table */}
      <div className="space-y-6">
        <SectionHeader
          badge={isFa ? "داده‌های متالورژی و سینماتیک" : "KINEMATICS MATRIX"}
          title={dict.elevators.techSpecsTitle}
          subtitle={
            isFa
              ? "مقایسه مشخصات سرعت، ظرفیت، سیستم محرک و سطوح ارتعاش صوتی مدل‌های مختلف ورتکس."
              : "Comparative mechanical engineering parameters across VERTEX elevator architectures."
          }
        />

        <div className="rounded-xl border border-vertex-border bg-vertex-surface/60 overflow-x-auto shadow-xl">
          <table className="w-full text-left text-xs font-mono border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-vertex-border text-vertex-steel uppercase bg-vertex-deep/60">
                <th className="py-4 px-4">{isFa ? "مدل / معماری" : "Model / Architecture"}</th>
                <th className="py-4 px-4">{isFa ? "سرعت نامی" : "Velocity"}</th>
                <th className="py-4 px-4">{isFa ? "ظرفیت باربری" : "Capacity"}</th>
                <th className="py-4 px-4">{isFa ? "حداکثر ارتفاع" : "Max Rise"}</th>
                <th className="py-4 px-4">{isFa ? "نوع موتور و درایو" : "Drive Subsystem"}</th>
                <th className="py-4 px-4">{isFa ? "تراز صوتی داخل کابین" : "Internal Acoustic"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vertex-border/60">
              {matrixData.map((row, idx) => (
                <tr key={idx} className="hover:bg-vertex-deep/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-bold text-vertex-ice">{row.model}</div>
                    <div className="text-[11px] text-vertex-steel font-sans">
                      {isFa ? row.typeFa : row.typeEn}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-vertex-cyan font-bold">{row.speed}</td>
                  <td className="py-4 px-4 text-vertex-ice">{row.capacity}</td>
                  <td className="py-4 px-4 text-vertex-steel">{row.maxRise}</td>
                  <td className="py-4 px-4 text-vertex-steel">{row.drive}</td>
                  <td className="py-4 px-4 text-emerald-400 font-bold">{row.noise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Embedded Elevator Anatomy Component */}
      <div className="pt-8">
        <ElevatorAnatomy locale={currentLocale} />
      </div>
    </div>
  );
}
