import React from "react";
import NextLink from "next/link";
import { Locale, dictionary } from "@/lib/dictionary";
import { ShieldCheck, Award, Wrench, Building2, Mail, Phone, MapPin } from "lucide-react";

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const dict = dictionary[locale];
  const isFa = locale === "fa";

  const standards = [
    { code: "EN 81-20 / 50", descEn: "Passenger & Freight Safety Rules", descFa: "استاندارد ایمنی آسانسورهای مسافری و باری" },
    { code: "EN 115-1:2017", descEn: "Escalator & Autowalk Safety", descFa: "استاندارد ایمنی پله‌برقی و پیاده‌رو متحرک" },
    { code: "مبحث ۱۵ مقررات ملی", descEn: "Iranian National Building Code Art. 15", descFa: "آسانسورها و پلکان‌برقی‌های ساختمان" },
    { code: "ISO 8100-32", descEn: "Planning & Selection of Passenger Lifts", descFa: "طراحی ترافیک و گزینش بالابرهای مسافری" },
  ];

  return (
    <footer className="bg-white border-t border-vertex-border text-vertex-secondary font-sans relative overflow-hidden">
      {/* Top Accent Line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-vertex-blueprint to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-vertex-primary flex items-center justify-center text-white">
                <span className="w-4 h-0.5 bg-vertex-cyan rounded-full" />
              </div>
              <span className="text-xl font-mono font-black text-vertex-primary tracking-widest">
                VERTEX
              </span>
            </div>
            <p className="text-xs sm:text-sm text-vertex-secondary leading-relaxed font-normal">
              {dict.footer.tagline}
            </p>
            <div className="pt-2 flex flex-col gap-2 text-xs text-vertex-steel font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-vertex-blueprint shrink-0" />
                <span>{dict.footer.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-vertex-blueprint shrink-0" />
                <span dir="ltr">{dict.footer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-vertex-blueprint shrink-0" />
                <span>{dict.footer.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-mono uppercase tracking-wider text-vertex-primary font-bold mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-vertex-blueprint" />
              {dict.footer.quickLinks}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              <li>
                <NextLink href={`/${locale}`} className="hover:text-vertex-blueprint transition-colors">
                  {dict.nav.home}
                </NextLink>
              </li>
              <li>
                <NextLink href={`/${locale}/elevators`} className="hover:text-vertex-blueprint transition-colors">
                  {dict.nav.elevators}
                </NextLink>
              </li>
              <li>
                <NextLink href={`/${locale}/escalators`} className="hover:text-vertex-blueprint transition-colors">
                  {dict.nav.escalators}
                </NextLink>
              </li>
              <li>
                <NextLink href={`/${locale}/configurator`} className="hover:text-vertex-blueprint transition-colors">
                  {dict.nav.configurator}
                </NextLink>
              </li>
              <li>
                <NextLink href={`/${locale}/engineering`} className="hover:text-vertex-blueprint transition-colors">
                  {dict.nav.engineering}
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Systems & Ops */}
          <div>
            <h3 className="text-sm font-mono uppercase tracking-wider text-vertex-primary font-bold mb-4 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-vertex-blueprint" />
              {dict.footer.systems}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              <li>
                <NextLink href={`/${locale}/projects`} className="hover:text-vertex-blueprint transition-colors">
                  {dict.nav.projects}
                </NextLink>
              </li>
              <li>
                <NextLink href={`/${locale}/maintenance`} className="hover:text-vertex-blueprint transition-colors">
                  {dict.nav.maintenance}
                </NextLink>
              </li>
              <li>
                <NextLink href={`/${locale}/about`} className="hover:text-vertex-blueprint transition-colors">
                  {dict.nav.about}
                </NextLink>
              </li>
              <li>
                <NextLink href={`/${locale}/contact`} className="hover:text-vertex-blueprint transition-colors">
                  {dict.nav.contact}
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Compliance & Standards */}
          <div>
            <h3 className="text-sm font-mono uppercase tracking-wider text-vertex-primary font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-vertex-blueprint" />
              {isFa ? "استانداردها و تاییده‌های مهندسی" : "Technical Compliance"}
            </h3>
            <div className="space-y-2.5">
              {standards.map((std) => (
                <div
                  key={std.code}
                  className="p-2.5 rounded-lg bg-vertex-elevated border border-vertex-border flex items-start gap-2.5"
                >
                  <Award className="w-3.5 h-3.5 text-vertex-blueprint shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-mono font-bold text-vertex-primary">
                      {std.code}
                    </div>
                    <div className="text-[11px] text-vertex-steel font-normal">
                      {isFa ? std.descFa : std.descEn}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Showcase Notice & Copyright */}
        <div className="mt-14 pt-8 border-t border-vertex-border flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-xs text-vertex-steel max-w-2xl font-normal leading-relaxed">
            <span className="text-vertex-blueprint font-mono font-bold mr-1">[SHOWCASE PORTFOLIO]</span>
            {dict.footer.disclaimer}
          </p>
          <div className="text-xs font-mono text-vertex-steel font-medium">
            © {new Date().getFullYear()} VERTEX Technologies. {dict.footer.rights}
          </div>
        </div>
      </div>
    </footer>
  );
}
