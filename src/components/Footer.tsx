"use client";

import React from "react";
import NextLink from "next/link";
import { Locale, dictionary } from "@/lib/dictionary";
import { cn } from "@/lib/utils";
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
  Compass,
  DoorClosed
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
    { code: "استاندارد ملی ۶۳۰۳", labelFa: "مقررات ایمنی ساخت و نصب آسانسور", labelEn: "ISIRI 6303-1 / 6303-2 Safety Code" },
    { code: "EN 81-20 / 50", labelFa: "استاندارد ایمنی بالابرهای مسافری", labelEn: "Passenger Lift Safety Norms" },
    { code: "مبحث ۱۵ مقررات ملی", labelFa: "طراحی و اجرای آسانسورهای ایران", labelEn: "Iranian National Building Code Art. 15" },
    { code: "EN 115-1:2017", labelFa: "استاندارد ایمنی پله‌برقی و پیاده‌رو", labelEn: "Escalator & Autowalk Standard" },
  ];

  return (
    <footer className={cn("bg-white border-t border-vertex-border text-vertex-secondary relative overflow-hidden", isFa ? "font-vazir" : "font-sans")}>
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
                ? "طراحی، مهندسی و اجرای پیشرفته‌ترین سیستم‌های ترابری عمودی، آسانسورهای پرسرعت برج‌ها، بالابرهای بدون موتورخانه (MRL) و پله‌برقی‌های سنگین شهری منطبق با استاندارد ملی ایران شماره ۶۳۰۳، EN 81-20 و مبحث ۱۵."
                : "Advanced vertical mobility solutions, high-speed elevators, gearless MRL systems, and heavy-duty transit escalators engineered for architectural excellence and ISIRI 6303 / EN 81 compliance."}
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
                  <span>{isFa ? "آسانسورهای بدون موتورخانه MRL" : "MRL Gearless Lifts"}</span>
                </NextLink>
              </li>
              <li>
                <NextLink href={`/${locale}/elevators`} className="hover:text-vertex-blueprint transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-vertex-steel group-hover:bg-vertex-blueprint group-hover:scale-125 transition-all" />
                  <span>{isFa ? "راهنمای درب‌های رایج ایران" : "Iranian Elevator Doors"}</span>
                  <span className="text-[9px] font-mono px-1 rounded bg-emerald-100 text-emerald-800 font-bold">۶۳۰۳</span>
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
              <span>{isFa ? "استودیوی مهندسی CAD" : "CAD & Engineering"}</span>
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <NextLink href={`/${locale}/engineering`} className="hover:text-vertex-blueprint transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-vertex-steel group-hover:bg-vertex-blueprint group-hover:scale-125 transition-all" />
                  <span>{isFa ? "نقشه‌های لیفت‌دیزاینر چاه" : "LiftDesigner CAD Studio"}</span>
                  <span className="text-[9px] font-mono px-1 rounded bg-sky-100 text-vertex-blueprint font-bold">DWG</span>
                </NextLink>
              </li>
              <li>
                <NextLink href={`/${locale}/engineering`} className="hover:text-vertex-blueprint transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-vertex-steel group-hover:bg-vertex-blueprint group-hover:scale-125 transition-all" />
                  <span>{isFa ? "مدل ۳ بعدی Three.js چاه" : "3D WebGL Shaft Model"}</span>
                  <span className="text-[9px] font-mono px-1 rounded bg-purple-100 text-purple-800 font-bold">3D</span>
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
                <NextLink href={`/${locale}/projects`} className="hover:text-vertex-blueprint transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-vertex-steel group-hover:bg-vertex-blueprint group-hover:scale-125 transition-all" />
                  <span>{isFa ? "نقشه تعاملی پروژه‌ها (Leaflet)" : "Project GIS Map"}</span>
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

        {/* Creator / Developer Attribution Banner */}
        <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-5 border border-slate-700/80 shadow-lg">
          <div className="flex items-center gap-4 text-right">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 shadow-inner shrink-0">
              <Cpu className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">
                  {isFa ? "طرح و برنامه‌نویس:" : "Architect & Developer:"}
                </span>
                <span className="text-base font-bold text-white tracking-wide">
                  {isFa ? "سید سجاد طباطبایی" : "Seyed Sajjad Tabatabaei"}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                  {isFa ? "طراح و توسعه‌دهنده سیستم" : "Lead Engineer"}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {isFa 
                  ? "طراحی و برنامه‌نویسی تخصصی استودیوی آنلاین لیفت‌دیزاینر، موتور سه‌بعدی محاسبات چاه و سامانه‌های ترابری عمودی VERTEX"
                  : "Lead System Architect of VERTEX CAD Studio, 3D WebGL Kinematics Engine & Vertical Mobility"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:09013356283"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg group"
            >
              <Phone className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
              <span className="font-mono font-black text-sm tracking-widest" dir="ltr">09013356283</span>
              <span className="text-xs text-slate-900 font-normal">({isFa ? "تماس مستقیم" : "Call"})</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar: Copyright, System Status & Back to Top */}
        <div className="mt-8 pt-6 border-t border-vertex-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-vertex-steel">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-700 font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>{isFa ? "سامانه‌ها فعال منطبق با استاندارد ۶۳۰۳" : "ISIRI 6303 Fully Certified"}</span>
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="font-mono">
              © {new Date().getFullYear()} VERTEX Technologies | {isFa ? "طرح و برنامه‌نویس: سید سجاد طباطبایی (۰۹۰۱۳۳۵۶۲۸۳)" : "Designed & Developed by Seyed Sajjad Tabatabaei (+98 901 335 6283)"}
            </span>
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
