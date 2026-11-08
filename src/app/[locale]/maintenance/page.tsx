import { PageInterconnect } from "@/components/PageInterconnect";
import React from "react";
import type { Metadata } from "next";
import { Locale, dictionary } from "@/lib/dictionary";
import { SectionHeader } from "@/components/SectionHeader";
import { TechBadge } from "@/components/TechBadge";
import { MaintenanceDashboard } from "@/components/MaintenanceDashboard";
import { Wrench, CheckCircle } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = (locale === "fa" ? "fa" : "en") as Locale;
  const dict = dictionary[currentLocale];
  return {
    title: dict.nav.maintenance,
    description: dict.maintenance.subtitle,
  };
}

export default async function MaintenancePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = (locale === "fa" ? "fa" : "en") as Locale;
  const dict = dictionary[currentLocale];
  const isFa = currentLocale === "fa";

  const tiers = [
    {
      titleEn: "VERTEX Sentinel™ 24/7 Remote IoT",
      titleFa: "پایش ۲۴ ساعته اینترنت اشیاء سنتینل",
      descEn: "Continuous algorithmic telemetry streaming vibration data, temperature spikes, and door lock timing directly to our central monitoring center.",
      descFa: "جریان پیوسته داده‌های تلمتری، دمای یاتاقان موتور و زمان‌بندی قفل درب‌ها مستقیماً به مرکز کنترل ورتکس.",
      highlight: "Sub-second anomaly alert",
    },
    {
      titleEn: "Precision Preventive Maintenance (PPM)",
      titleFa: "برنامه نگهداری و تعمیرات پیشگیرانه دوره‌ای",
      descEn: "Monthly hands-on laser alignment audits, guide shoe lubrication verification, and emergency brake torque recalibration by certified engineers.",
      descFa: "بازرسی‌های ماهیانه هم‌راستایی لیزری ریل‌ها، شارژ گریس روان‌کاری و آزمون گشتاور ترمزهای اضطراری توسط تکنسین‌های ارشد.",
      highlight: "EN 13015 compliant",
    },
    {
      titleEn: "Rapid Emergency Response Protocol",
      titleFa: "پروتکل واکنش سریع اضطراری ۲۴/۷",
      descEn: "Guaranteed on-site arrival within 25 minutes for passenger entanglements, supported by mobile parts logistics fleets.",
      descFa: "حضور میدانی تیم مهندسی نجات در کمتر از ۲۵ دقیقه در کلیه کلان‌شهرهای زیر پوشش با ناوگان مجهز پشتیبانی.",
      highlight: "< 25 min dispatch window",
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-20 bg-vertex-bg">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <TechBadge variant="blueprint">{dict.maintenance.badge}</TechBadge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-vertex-primary font-mono tracking-tight">
          {dict.maintenance.title}
        </h1>
        <p className="text-base sm:text-lg text-vertex-secondary font-normal leading-relaxed">
          {dict.maintenance.subtitle}
        </p>
      </div>

      {/* Embedded Maintenance Dashboard */}
      <MaintenanceDashboard locale={currentLocale} />

      {/* Service Tiers */}
      <div className="space-y-8">
        <SectionHeader
          badge={isFa ? "سطوح خدمات پشتیبانی" : "SERVICE ARCHITECTURE"}
          title={isFa ? "پایداری حداکثری و حذف زمان توقف" : "Zero-Unscheduled-Downtime Guarantee"}
          subtitle={
            isFa
              ? "پروتکل‌های چندلایه نگهداری متناسب با کاربری‌های فرودگاهی، برج‌های نمادین و مجتمع‌های مسکونی لوکس."
              : "Multi-tiered predictive servicing tailored for transit hubs, mission-critical hospitals, and landmark towers."
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white border border-vertex-border hover:border-vertex-blueprint transition-all shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-vertex-elevated border border-vertex-border flex items-center justify-center text-vertex-blueprint mb-4">
                  <Wrench className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black font-mono text-vertex-primary">
                  {isFa ? tier.titleFa : tier.titleEn}
                </h2>
                <p className="text-sm text-vertex-secondary font-normal mt-3 leading-relaxed">
                  {isFa ? tier.descFa : tier.descEn}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-vertex-border flex items-center justify-between text-xs font-mono">
                <span className="text-vertex-blueprint font-black">{tier.highlight}</span>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <PageInterconnect locale={currentLocale} />
    </div>
  );
}
