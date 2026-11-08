"use client";

import React from "react";
import NextLink from "next/link";
import { Locale, dictionary } from "@/lib/dictionary";
import { 
  ShieldCheck, 
  Award, 
  Wrench, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUp, 
  Layers, 
  Cpu, 
  Palette, 
  Activity, 
  ExternalLink,
  Clock,
  FileCode,
  Compass
} from "lucide-react";

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const dict = dictionary[locale];
  const isFa = locale === "fa";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const certifications = [
    { code: "EN 81-20 / 50", labelFa: "استاندارد ایمنی بالابرهای مسافری", labelEn: "Passenger Lift Safety Norms" },
    { code: "EN 115-1:2017", labelFa: "استاندارد ایمنی پله‌برقی و پیاده‌رو", labelEn: "Escalator & Autowalk Standard" },
    { code: "مبحث ۱۵ مقررات ملی", labelFa: "طراحی و اجرای آسانسورهای ایران", labelEn: "Iranian National Building Code" },
    { code: "ISO 25745 Class A+++", labelFa: "بالاترین تراز بهره‌وری انرژی", labelEn: "Top Energy Efficiency Benchmark" },
  ];

  return (
    <footer className="bg-white border-t border-vertex-border text-vertex-secondary font-sans relative overflow-hidden">
      {/* Top Accent Line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-vertex-blueprint to-transparent opacity-75" />

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Col 1: Brand & Certifications */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-vertex-primary flex items-center justify-center text-white shadow-sm">
                <span className="w-4 h-0.5 bg-vertex-cyan rounded-full" />
              </div>
              <span className="text-xl font-mono font-black text-vertex-primary tracking-widest flex items-center gap-1">
                VERTEX
                <span className="w-1.5 h-1.5 rounded-full bg-vertex-blueprint inline-block" />
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-vertex-secondary leading-relaxed font-normal max-w-sm">
              {isFa 
                ? "طراحی، مهندسی و اجرای پیشرفته‌ترین سیستم‌های ترابری عمودی، آسانسورهای پرسرعت برج‌ها، بالابرهای بدون موتورخانه (MRL) و پله‌برقی‌های سنگین شهری منطبق با استانداردهای EN و مبحث ۱۵."
                : "Advanced vertical mobility solutions, high-speed elevators, gearless MRL systems, and heavy-duty transit escalators engineered for architectural excellence."}
            </p>

            {/* Certifications Grid */}
            <div className="pt-2 grid grid-cols-2 gap-2 max-w-sm">
              {certifications.map((cert) => (
                <div key={cert.code} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono">
                  <span className="font-bold text-vertex-primary block text-[10px] text-vertex-blueprint">{cert.code}</span>
                  <span className="text-vertex-steel text-[10px] leading-tight block mt-0.5 line-clamp-1">
                    {isFa ? cert.labelFa : cert.labelEn}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Col 2: Lift Solutions Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-vertex-primary font-bold flex items-center gap-2">
              <Layers className="w-4 h-4 text-vertex-blueprint" />
              <span>{isFa ? "راهکارهای ترابری" : "Lift Solutions"}</span>
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <NextLink href={`/${locale}/elevators`} className="hover:text-vertex-blueprint transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-vertex-steel group-hover:bg-vertex-blueprint group-hover:scale-125 transition-all" />
                  <span>{isFa ? "آسانسورهای کششی پرسرعت" : "Traction High-Speed"}</span>
                </NextLink>
              </li>
              <li>
                <NextLink href={`/${locale}/elevators`} className="hover:text-vertex-blueprint transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-vertex-steel group-hover:bg-vertex-blueprint group-hover:scale-125 transition-all" />
                  <span>{isFa ? "آسانسورهای بدون موتورخانه" : "MRL Gearless Lifts"}</span>
                </NextLink>
              </li>
              <li>
                <NextLink href={`/${locale}/elevators`} className="hover:text-vertex-blueprint transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-vertex-steel group-hover:bg-vertex-blueprint group-hover:scale-125 transition-all" />
                  <span>{isFa ? "بالابرهای بیمارستانی تخت‌بر" : "Stretcher Bed Lifts"}</span>
                </NextLink>
              </li>
              <li>
                <NextLink href={`/${locale}/escalators`} className="hover:text-vertex-blueprint transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-vertex-steel group-hover:bg-vertex-blueprint group-hover:scale-125 transition-all" />
                  <span>{isFa ? "پله‌برقی‌های سنگین شهری" : "Heavy Transit Escalators"}</span>
                </NextLink>
              </li>
              <li>
                <NextLink href={`/${locale}/escalators`} className="hover:text-vertex-blueprint transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-vertex-steel group-hover:bg-vertex-blueprint group-hover:scale-125 transition-all" />
                  <span>{isFa ? "پیاده‌روهای متحرک فرودگاهی" : "Moving Walkways"}</span>
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Col 3: Engineering & CAD Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-vertex-primary font-bold flex items-center gap-2">
              <Cpu className="w-4 h-4 text-vertex-blueprint" />
              <span>{isFa ? "ابزارهای مهندسی CAD" : "CAD & Engineering"}</span>
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <NextLink href={`/${locale}/engineering`} className="hover:text-vertex-blueprint transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-vertex-steel group-hover:bg-vertex-blueprint group-hover:scale-125 transition-all" />
                  <span>{isFa ? "مدل ۳ بعدی و نقشه‌های چاه" : "3D CAD Shaft Studio"}</span>
                  <span className="text-[9px] font-mono px-1 rounded bg-sky-100 text-vertex-blueprint font-bold">3D</span>
                </NextLink>
              </li>
              <li>
                <NextLink href={`/${locale}/engineering`} className="hover:text-vertex-blueprint transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-vertex-steel group-hover:bg-vertex-blueprint group-hover:scale-125 transition-all" />
                  <span>{isFa ? "محاسبات توان موتور و اصطکاک" : "Kinematics Calculator"}</span>
                </NextLink>
              </li>
              <li>
                <NextLink href={`/${locale}/configurator`} className="hover:text-vertex-blueprint transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-vertex-steel group-hover:bg-vertex-blueprint group-hover:scale-125 transition-all" />
                  <span>{isFa ? "کانفیگوراتور متریال کابین" : "Cabin Configurator"}</span>
                </NextLink>
              </li>
              <li>
                <NextLink href={`/${locale}/maintenance`} className="hover:text-vertex-blueprint transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-vertex-steel group-hover:bg-vertex-blueprint group-hover:scale-125 transition-all" />
                  <span>{isFa ? "داشبورد پایش تلمتری IoT" : "Telemetry Dashboard"}</span>
                </NextLink>
              </li>
              <li>
                <NextLink href={`/${locale}/contact`} className="hover:text-vertex-blueprint transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-vertex-steel group-hover:bg-vertex-blueprint group-hover:scale-125 transition-all" />
                  <span>{isFa ? "ویزارد ترافیک CIBSE" : "Traffic Sizing Wizard"}</span>
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Col 4: Operations & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-vertex-primary font-bold flex items-center gap-2">
              <Phone className="w-4 h-4 text-vertex-blueprint" />
              <span>{isFa ? "ارتباط مهندسی" : "Engineering Desk"}</span>
            </h4>
            <div className="space-y-2 text-xs text-vertex-secondary">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-vertex-blueprint shrink-0 mt-0.5" />
                <span className="leading-snug">{dict.footer.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-vertex-blueprint shrink-0" />
                <span dir="ltr" className="font-mono font-bold text-vertex-primary">{dict.footer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-vertex-blueprint shrink-0" />
                <span className="font-mono">{dict.footer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 font-mono text-[11px] font-bold">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>{isFa ? "پشتیبانی اضطراری ۲۴/۷" : "24/7 Emergency Response"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, System Status & Back to Top */}
        <div className="mt-12 pt-6 border-t border-vertex-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-vertex-steel">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-700 font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>{isFa ? "سیستم‌های پایش فعال (100% Operational)" : "All Systems Operational"}</span>
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="font-mono">© {new Date().getFullYear()} VERTEX Technologies.</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-vertex-blueprint hover:text-white transition-all text-vertex-primary font-bold text-xs"
          >
            <span>{isFa ? "بازگشت به بالای صفحه" : "Back to top"}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
