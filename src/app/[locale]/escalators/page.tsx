import React from "react";
import type { Metadata } from "next";
import NextLink from "next/link";
import { Locale, dictionary } from "@/lib/dictionary";
import { SectionHeader } from "@/components/SectionHeader";
import { TechBadge } from "@/components/TechBadge";
import { EscalatorExplorer } from "@/components/EscalatorExplorer";
import { Check, ArrowUpRight, Activity, ShieldCheck, Zap } from "lucide-react";

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
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <TechBadge variant="cyan">{dict.escalators.badge}</TechBadge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-vertex-ice font-mono tracking-tight">
          {dict.escalators.title}
        </h1>
        <p className="text-base sm:text-lg text-vertex-steel font-light leading-relaxed">
          {dict.escalators.subtitle}
        </p>
      </div>

      {/* Systems Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {dict.escalators.systems.map((sys) => (
          <div
            key={sys.id}
            className="rounded-2xl bg-vertex-surface border border-vertex-border p-8 hover:border-vertex-cyan/50 transition-all shadow-card flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-vertex-border">
                <span className="text-xs font-mono font-bold text-vertex-cyan uppercase tracking-wider">
                  {sys.id.toUpperCase()}
                </span>
                <span className="text-xs font-mono text-vertex-ice bg-vertex-deep px-3 py-1 rounded border border-vertex-border">
                  {sys.speed}
                </span>
              </div>

              <h2 className="text-2xl font-bold font-mono text-vertex-ice mt-4">
                {sys.name}
              </h2>
              <p className="text-sm text-vertex-steel font-light mt-2 leading-relaxed">
                {sys.desc}
              </p>

              {/* Technical Badges */}
              <div className="grid grid-cols-2 gap-3 mt-6 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-vertex-deep border border-vertex-border">
                  <span className="text-vertex-steel text-[10px] block">
                    {isFa ? "زاویه شیب:" : "Inclination:"}
                  </span>
                  <span className="text-vertex-ice font-bold">{sys.inclination}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-vertex-deep border border-vertex-border">
                  <span className="text-vertex-steel text-[10px] block">
                    {"rise" in sys
                      ? isFa ? "حداکثر ارتفاع:" : "Max Rise:"
                      : isFa ? "حداکثر طول:" : "Max Length:"}
                  </span>
                  <span className="text-vertex-ice font-bold">
                    {"rise" in sys ? sys.rise : sys.span}
                  </span>
                </div>
              </div>

              {/* Features list */}
              <ul className="mt-6 space-y-2">
                {sys.features.map((feat, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-xs font-mono text-vertex-steel"
                  >
                    <Check className="w-4 h-4 text-vertex-cyan shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-vertex-border">
              <NextLink
                href={`/${currentLocale}/contact`}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-vertex-deep border border-vertex-cyan/40 text-vertex-cyan font-mono text-xs font-semibold hover:bg-vertex-cyan hover:text-vertex-deep transition-all shadow-glow"
              >
                <span>{isFa ? "درخواست کاتالوگ و نقشه CAD" : "Request CAD & Specifications"}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </NextLink>
            </div>
          </div>
        ))}
      </div>

      {/* Embedded Escalator Explorer */}
      <div className="pt-8">
        <EscalatorExplorer locale={currentLocale} />
      </div>

      {/* Safety & Standards Callout */}
      <div className="rounded-2xl bg-vertex-surface/60 border border-vertex-border p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-vertex-cyan">
            <ShieldCheck className="w-4 h-4" />
            <span>EN 115-1:2017 SAFETY COMPLIANCE</span>
          </div>
          <h3 className="text-2xl font-bold font-mono text-vertex-ice">
            {isFa ? "استاندارد حداکثری ایمنی جابجایی پیوسته" : "Zero-Harm Safety Interlock Architecture"}
          </h3>
          <p className="text-sm text-vertex-steel font-light leading-relaxed">
            {isFa
              ? "کلیه پله‌برقی‌های ورتکس مجهز به بیش از ۳۲ سنسور ایمنی مستقل از جمله حسگر انحراف شانه، سنسور شکستگی زنجیر استپ، سنسور سرعت چرخش هندریل و کلیدهای توقف اضطراری دوطرفه می‌باشند."
              : "Every VERTEX escalator integrates over 32 independent safety monitoring switches including comb plate deflector sensors, step sag detectors, broken step chain interlocks, and synchronized handrail speed sensors."}
          </p>
        </div>
        <NextLink
          href={`/${currentLocale}/contact`}
          className="shrink-0 px-6 py-3 rounded-xl bg-vertex-cyan text-vertex-deep font-bold text-xs uppercase tracking-wider hover:bg-vertex-cyanHover transition-all shadow-cyan"
        >
          {isFa ? "مشاوره ترافیک مسافری" : "Consult Transit Engineers"}
        </NextLink>
      </div>
    </div>
  );
}
