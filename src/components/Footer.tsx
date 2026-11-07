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
    { code: "EN 81-20 / 50", descEn: "Passenger & Freight Safety", descFa: "استاندارد ایمنی آسانسورهای مسافری و باری" },
    { code: "EN 115-1:2017", descEn: "Escalator & Autowalk Safety", descFa: "استاندارد ایمنی پله‌برقی و پیاده‌رو متحرک" },
    { code: "ISO 9001:2015", descEn: "Precision Quality Management", descFa: "سیستم مدیریت کیفیت مکانیک دقیق" },
    { code: "2014/33/EU", descEn: "European Lift Directive", descFa: "انطباق با دایرکتیو بالابرهای اتحادیه اروپا" },
  ];

  return (
    <footer className="bg-vertex-deep border-t border-vertex-border text-vertex-steel font-sans relative overflow-hidden">
      {/* Decorative Cyan Accent Line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-vertex-cyan to-transparent opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-vertex-surface border border-vertex-cyan/40 flex items-center justify-center">
                <span className="w-4 h-0.5 bg-vertex-cyan rounded-full" />
              </div>
              <span className="text-xl font-mono font-extrabold text-vertex-ice tracking-widest">
                VERTEX
              </span>
            </div>
            <p className="text-xs sm:text-sm text-vertex-steel/80 leading-relaxed font-light">
              {dict.footer.tagline}
            </p>
            <div className="pt-2 flex flex-col gap-2 text-xs text-vertex-steel">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-vertex-cyan shrink-0" />
                <span>{dict.footer.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-vertex-cyan shrink-0" />
                <span dir="ltr">{dict.footer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-vertex-cyan shrink-0" />
                <span>{dict.footer.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-mono uppercase tracking-wider text-vertex-ice font-semibold mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-vertex-cyan" />
              {dict.footer.quickLinks}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <NextLink href={`/${locale}`} className="hover:text-vertex-cyan transition-colors">
                  {dict.nav.home}
                </NextLink>
              </li>
              <li>
                <NextLink href={`/${locale}/elevators`} className="hover:text-vertex-cyan transition-colors">
                  {dict.nav.elevators}
                </NextLink>
              </li>
              <li>
                <NextLink href={`/${locale}/escalators`} className="hover:text-vertex-cyan transition-colors">
                  {dict.nav.escalators}
                </NextLink>
              </li>
              <li>
                <NextLink href={`/${locale}/configurator`} className="hover:text-vertex-cyan transition-colors">
                  {dict.nav.configurator}
                </NextLink>
              </li>
              <li>
                <NextLink href={`/${locale}/engineering`} className="hover:text-vertex-cyan transition-colors">
                  {dict.nav.engineering}
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Systems & Ops */}
          <div>
            <h3 className="text-sm font-mono uppercase tracking-wider text-vertex-ice font-semibold mb-4 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-vertex-cyan" />
              {dict.footer.systems}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <NextLink href={`/${locale}/projects`} className="hover:text-vertex-cyan transition-colors">
                  {dict.nav.projects}
                </NextLink>
              </li>
              <li>
                <NextLink href={`/${locale}/maintenance`} className="hover:text-vertex-cyan transition-colors">
                  {dict.nav.maintenance}
                </NextLink>
              </li>
              <li>
                <NextLink href={`/${locale}/about`} className="hover:text-vertex-cyan transition-colors">
                  {dict.nav.about}
                </NextLink>
              </li>
              <li>
                <NextLink href={`/${locale}/contact`} className="hover:text-vertex-cyan transition-colors">
                  {dict.nav.contact}
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Compliance & Standards */}
          <div>
            <h3 className="text-sm font-mono uppercase tracking-wider text-vertex-ice font-semibold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-vertex-cyan" />
              {isFa ? "استانداردها و تاییده‌ها" : "Technical Compliance"}
            </h3>
            <div className="space-y-2.5">
              {standards.map((std) => (
                <div
                  key={std.code}
                  className="p-2 rounded bg-vertex-surface/60 border border-vertex-border flex items-start gap-2.5"
                >
                  <Award className="w-3.5 h-3.5 text-vertex-cyan shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-mono font-semibold text-vertex-ice">
                      {std.code}
                    </div>
                    <div className="text-[11px] text-vertex-steel/80">
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
          <p className="text-xs text-vertex-steel/70 max-w-2xl">
            <span className="text-vertex-cyan font-mono font-semibold mr-1">[SHOWCASE DEMO]</span>
            {dict.footer.disclaimer}
          </p>
          <div className="text-xs font-mono text-vertex-steel/60">
            © {new Date().getFullYear()} VERTEX Technologies. {dict.footer.rights}
          </div>
        </div>
      </div>
    </footer>
  );
}
