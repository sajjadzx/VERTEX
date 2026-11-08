import React from "react";
import type { Metadata } from "next";
import NextLink from "next/link";
import { Locale, dictionary } from "@/lib/dictionary";
import { SectionHeader } from "@/components/SectionHeader";
import { TechBadge } from "@/components/TechBadge";
import { ElevatorAnatomy } from "@/components/ElevatorAnatomy";
import { IranElevatorDoors } from "@/components/IranElevatorDoors";
import { PageInterconnect } from "@/components/PageInterconnect";
import { Check, ArrowUpRight, Sliders, Ruler, ShieldCheck, DoorClosed } from "lucide-react";

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
      typeFa: "بدون موتورخانه لوکس شهری (MRL)",
      speed: "1.0 – 3.0 m/s",
      capacity: "630 – 1,600 kg",
      maxRise: "120 m",
      drive: "Permanent Magnet Gearless",
      noise: "< 45 dBA",
    },
    {
      model: "VERTEX Aero Transit",
      typeEn: "High-Capacity Double-Deck",
      typeFa: "دوکابینه ترابری پرتردد فرودگاهی",
      speed: "4.0 – 7.0 m/s",
      capacity: "2 × 1,800 kg",
      maxRise: "300 m",
      drive: "Permanent Magnet Synchronous",
      noise: "< 48 dBA",
    },
    {
      model: "VERTEX MediCare 1600",
      typeEn: "Hospital Stretcher & Medical",
      typeFa: "تخت‌بر بیمارستانی و مراکز جراحی",
      speed: "1.6 – 2.5 m/s",
      capacity: "1,600 – 2,000 kg",
      maxRise: "80 m",
      drive: "Gearless Variable Frequency",
      noise: "< 40 dBA",
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-20 bg-vertex-bg">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <TechBadge variant="blueprint">{dict.elevators.badge}</TechBadge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-vertex-primary font-mono tracking-tight">
          {dict.elevators.title}
        </h1>
        <p className="text-base sm:text-lg text-vertex-secondary font-normal leading-relaxed">
          {dict.elevators.subtitle}
        </p>

        {/* Standard 6303 Pill */}
        <div className="inline-flex items-center gap-2 p-2 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-900">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            {isFa 
              ? "انطباق ۱۰۰٪ با مقررات ایمنی استاندارد ملی ایران شماره ۶۳۰۳-۱ و ۶۳۰۳-۲ و مبحث ۱۵ مقررات ملی" 
              : "Full conformity to ISIRI 6303-1 / 6303-2 and EN 81-20/50 safety regulations."}
          </span>
        </div>
      </div>

      {/* Solutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {dict.elevators.categories.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-white border border-vertex-border p-8 hover:border-vertex-blueprint transition-all duration-300 shadow-card flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-vertex-border">
                <span className="text-xs font-mono font-bold text-vertex-blueprint uppercase tracking-wider">
                  SERIES 0{idx + 1}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-vertex-blueprint" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-black font-mono text-vertex-primary mt-4">
                {item.name}
              </h2>

              <p className="text-sm text-vertex-secondary font-normal mt-3 leading-relaxed">
                {item.desc}
              </p>

              <div className="mt-8 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-vertex-steel font-bold block">
                  {isFa ? "مشخصات فنی و استانداردها" : "Engineered Specifications"}
                </span>
                <ul className="space-y-2">
                  {item.specs.map((spec, sIdx) => (
                    <li
                      key={sIdx}
                      className="flex items-center gap-2 text-xs font-mono text-vertex-primary font-medium"
                    >
                      <Check className="w-3.5 h-3.5 text-vertex-blueprint shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-vertex-border flex items-center justify-between">
              <span className="text-xs font-mono text-vertex-steel">
                {isFa ? "تأییدیه ISIRI 6303" : "ISIRI 6303 Certified"}
              </span>
              <NextLink
                href={`/${currentLocale}/contact`}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-vertex-blueprint hover:underline"
              >
                <span>{isFa ? "استعلام مشخصات فنی" : "Request Spec Sheet"}</span>
                <ArrowUpRight className="w-4 h-4" />
              </NextLink>
            </div>
          </div>
        ))}
      </div>

      {/* Technical Comparison Matrix */}
      <div className="rounded-2xl bg-white border border-vertex-border p-6 sm:p-8 shadow-card space-y-6">
        <SectionHeader
          align="left"
          badge={isFa ? "جدول ماتریس مهندسی" : "ENGINEERING MATRIX"}
          title={isFa ? "مقایسه مشخصات فنی مدل‌های آسانسور VERTEX" : "Elevator Engineering Comparison"}
          subtitle={
            isFa
              ? "پارامترهای سرعت، ظرفیت باربری، ارتفاع مسیر و نوع درایو بر اساس استانداردهای EN 81-20 و استاندارد ملی ۶۳۰۳."
              : "Rated parameters and drive subsystems benchmarked against international vertical transportation standards."
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-vertex-borderStrong text-vertex-steel uppercase tracking-wider bg-slate-50">
                <th className="py-4 px-4">{isFa ? "مدل سیستم" : "System Model"}</th>
                <th className="py-4 px-4">{isFa ? "سرعت نامی" : "Rated Speed"}</th>
                <th className="py-4 px-4">{isFa ? "ظرفیت باربری" : "Capacity"}</th>
                <th className="py-4 px-4">{isFa ? "حداکثر ارتفاع" : "Max Rise"}</th>
                <th className="py-4 px-4">{isFa ? "نوع موتور و درایو" : "Drive Subsystem"}</th>
                <th className="py-4 px-4">{isFa ? "تراز صوتی داخل کابین" : "Internal Acoustic"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vertex-border">
              {matrixData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-bold text-vertex-primary">{row.model}</div>
                    <div className="text-[11px] text-vertex-secondary font-sans font-medium">
                      {isFa ? row.typeFa : row.typeEn}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-vertex-blueprint font-black">{row.speed}</td>
                  <td className="py-4 px-4 text-vertex-primary font-bold">{row.capacity}</td>
                  <td className="py-4 px-4 text-vertex-secondary">{row.maxRise}</td>
                  <td className="py-4 px-4 text-vertex-secondary">{row.drive}</td>
                  <td className="py-4 px-4 text-emerald-700 font-bold">{row.noise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Iranian Elevator Doors Engineering Reference */}
      <div className="pt-4">
        <IranElevatorDoors locale={currentLocale} />
      </div>

      {/* Embedded Elevator Anatomy Component */}
      <div className="pt-4">
        <ElevatorAnatomy locale={currentLocale} />
      </div>

      <PageInterconnect locale={currentLocale} />
    </div>
  );
}
