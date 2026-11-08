import React from "react";
import type { Metadata } from "next";
import NextLink from "next/link";
import { Locale, dictionary } from "@/lib/dictionary";
import { SectionHeader } from "@/components/SectionHeader";
import { TechBadge } from "@/components/TechBadge";
import { EscalatorExplorer } from "@/components/EscalatorExplorer";
import { Check, ArrowUpRight, ShieldCheck } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = (locale === "fa" ? "fa" : "en") as Locale;
  const dict = dictionary[currentLocale];
  return {
    title: dict.nav.escalators,
    description: dict.escalators.subtitle,
  };
}

export default async function EscalatorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = (locale === "fa" ? "fa" : "en") as Locale;
  const dict = dictionary[currentLocale];
  const isFa = currentLocale === "fa";

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-20 bg-vertex-bg">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <TechBadge variant="blueprint">{dict.escalators.badge}</TechBadge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-vertex-primary font-mono tracking-tight">
          {dict.escalators.title}
        </h1>
        <p className="text-base sm:text-lg text-vertex-secondary font-normal leading-relaxed">
          {dict.escalators.subtitle}
        </p>
      </div>

      {/* Systems Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {dict.escalators.systems.map((sys) => (
          <div
            key={sys.id}
            className="rounded-2xl bg-white border border-vertex-border p-8 hover:border-vertex-blueprint transition-all shadow-card flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-vertex-border">
                <span className="text-xs font-mono font-bold text-vertex-blueprint uppercase tracking-wider">
                  {sys.id.toUpperCase()}
                </span>
                <span className="text-xs font-mono font-bold text-vertex-primary bg-slate-100 px-3 py-1 rounded border border-slate-200">
                  {sys.speed}
                </span>
              </div>

              <h2 className="text-2xl font-black font-mono text-vertex-primary mt-4">
                {sys.name}
              </h2>
              <p className="text-sm text-vertex-secondary font-normal mt-2 leading-relaxed">
                {sys.desc}
              </p>

              {/* Technical Badges */}
              <div className="grid grid-cols-2 gap-3 mt-6 text-xs font-mono">
                <div className="p-3 rounded-lg bg-vertex-elevated border border-vertex-border">
                  <span className="text-vertex-steel text-[10px] block font-semibold">
                    {isFa ? "زاویه شیب:" : "Inclination:"}
                  </span>
                  <span className="text-vertex-primary font-black">{sys.inclination}</span>
                </div>
                <div className="p-3 rounded-lg bg-vertex-elevated border border-vertex-border">
                  <span className="text-vertex-steel text-[10px] block font-semibold">
                    {"rise" in sys
                      ? isFa ? "حداکثر ارتفاع:" : "Max Rise:"
                      : isFa ? "حداکثر طول:" : "Max Length:"}
                  </span>
                  <span className="text-vertex-primary font-black">
                    {"rise" in sys ? sys.rise : sys.span}
                  </span>
                </div>
              </div>

              {/* Features list */}
              <ul className="mt-6 space-y-2">
                {sys.features.map((feat, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-xs font-mono text-vertex-secondary"
                  >
                    <Check className="w-4 h-4 text-vertex-blueprint shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-vertex-border">
              <NextLink
                href={`/${currentLocale}/contact`}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white border border-vertex-blueprint text-vertex-blueprint font-mono text-xs font-bold hover:bg-vertex-blueprint hover:text-white transition-all shadow-sm"
              >
                <span>{isFa ? "درخواست کاتالوگ و نقشه CAD" : "Request CAD & Specifications"}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </NextLink>
            </div>
          </div>
        ))}
      </div>

      {/* Embedded Escalator Explorer */}
      <div className="pt-4">
        <EscalatorExplorer locale={currentLocale} />
      </div>

      {/* Safety & Standards Callout */}
      <div className="rounded-2xl bg-white border border-vertex-border p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-card">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-vertex-blueprint">
            <ShieldCheck className="w-4 h-4" />
            <span>EN 115-1:2017 SAFETY COMPLIANCE</span>
          </div>
          <h3 className="text-2xl font-black font-mono text-vertex-primary">
            {isFa ? "استاندارد حداکثری ایمنی جابجایی پیوسته مسافر" : "Zero-Harm Safety Interlock Architecture"}
          </h3>
          <p className="text-sm text-vertex-secondary font-normal leading-relaxed">
            {isFa
              ? "کلیه پله‌برقی‌های ورتکس مجهز به بیش از ۳۲ سنسور ایمنی مستقل از جمله حسگر انحراف شانه، سنسور شکستگی زنجیر استپ، سنسور سرعت چرخش هندریل و کلیدهای توقف اضطراری دوطرفه می‌باشند."
              : "Every VERTEX escalator integrates over 32 independent safety monitoring switches including comb plate deflector sensors, step sag detectors, broken step chain interlocks, and synchronized handrail speed sensors."}
          </p>
        </div>
        <NextLink
          href={`/${currentLocale}/contact`}
          className="shrink-0 px-6 py-3 rounded-xl bg-vertex-primary text-white font-bold text-xs uppercase tracking-wider hover:bg-vertex-blueprint transition-all shadow-sm"
        >
          {isFa ? "مشاوره ترافیک مسافری" : "Consult Transit Engineers"}
        </NextLink>
      </div>
    </div>
  );
}
