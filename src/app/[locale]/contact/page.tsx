"use client";

import React, { useState, use } from "react";
import { Locale, dictionary } from "@/lib/dictionary";
import { TechBadge } from "@/components/TechBadge";
import { ConsultationWizard } from "@/components/ConsultationWizard";
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Check, 
  Sliders, 
  FileText 
} from "lucide-react";

export default function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const currentLocale = (locale === "fa" ? "fa" : "en") as Locale;
  const dict = dictionary[currentLocale];
  const isFa = currentLocale === "fa";

  const [activeTab, setActiveTab] = useState<"wizard" | "form">("wizard");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: dict.contact.form.types[0],
    message: "",
  });

  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const offices = [
    {
      cityEn: "Zurich HQ & Testing Center",
      cityFa: "دفتر مرکزی و برج تست زوریخ",
      addressEn: "Mobility Avenue 404, 8005 Zürich, Switzerland",
      addressFa: "سوئیس، زوریخ، بلوار ترابری عمودی ۴۰۴",
      phone: "+41 44 829 00 10",
      email: "zurich@vertex-mobility.internal",
    },
    {
      cityEn: "Dubai Regional Hub",
      cityFa: "دفتر خاورمیانه دبی",
      addressEn: "DIFC Gate Precinct 4, Level 12, Dubai, UAE",
      addressFa: "امارات، دبی، مرکز مالی بین‌المللی DIFC، برج ۴",
      phone: "+971 4 310 9900",
      email: "dubai@vertex-mobility.internal",
    },
    {
      cityEn: "Tehran Engineering Branch",
      cityFa: "دفتر مهندسی و پشتیبانی تهران",
      addressEn: "Valiasr Tech Corridor, Innovation Tower 7, Tehran",
      addressFa: "ایران، تهران، کریدور فناوری ولیعصر، برج نوآوری ۷",
      phone: "+98 21 8890 0010",
      email: "tehran@vertex-mobility.internal",
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-20 bg-vertex-bg">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <TechBadge variant="blueprint">{dict.contact.badge}</TechBadge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-vertex-primary font-mono tracking-tight">
          {dict.contact.title}
        </h1>
        <p className="text-base sm:text-lg text-vertex-secondary font-normal leading-relaxed">
          {dict.contact.subtitle}
        </p>

        {/* Tab switcher */}
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setActiveTab("wizard")}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeTab === "wizard"
                ? "bg-vertex-blueprint text-white shadow-sm"
                : "bg-white text-vertex-secondary border border-vertex-borderStrong hover:border-vertex-blueprint"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{dict.contact.wizardTab}</span>
          </button>
          <button
            onClick={() => setActiveTab("form")}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeTab === "form"
                ? "bg-vertex-blueprint text-white shadow-sm"
                : "bg-white text-vertex-secondary border border-vertex-borderStrong hover:border-vertex-blueprint"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{dict.contact.formTab}</span>
          </button>
        </div>
      </div>

      {/* Main Tab Area */}
      {activeTab === "wizard" ? (
        <ConsultationWizard locale={currentLocale} />
      ) : (
        /* Direct Contact Form */
        <div className="max-w-3xl mx-auto w-full bg-white border border-vertex-border rounded-2xl p-6 lg:p-8 shadow-card">
          {!formSubmitted ? (
            <form onSubmit={handleDirectSubmit} className="space-y-6">
              <h3 className="text-xl font-black font-mono text-vertex-primary border-b border-vertex-border pb-4">
                {dict.contact.form.title}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-vertex-primary font-bold block mb-1">
                    {dict.contact.form.name} *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-vertex-primary text-xs focus:border-vertex-blueprint focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-vertex-primary font-bold block mb-1">
                    {dict.contact.form.email} *
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-vertex-primary text-xs focus:border-vertex-blueprint focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-vertex-primary font-bold block mb-1">
                    {dict.contact.form.phone}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-vertex-primary text-xs focus:border-vertex-blueprint focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-vertex-primary font-bold block mb-1">
                    {dict.contact.form.projectType}
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-vertex-primary text-xs focus:border-vertex-blueprint focus:outline-none"
                  >
                    {dict.contact.form.types.map((t, idx) => (
                      <option key={idx} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-vertex-primary font-bold block mb-1">
                  {dict.contact.form.message} *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={
                    isFa
                      ? "لطفاً تعداد طبقات، نوع کاربری، ابعاد تقریبی چاه و سرعت مورد انتظار را ذکر فرمایید..."
                      : "Describe your project parameters, floor count, shaft dimensions, and traffic demands..."
                  }
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-vertex-primary text-xs focus:border-vertex-blueprint focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-vertex-primary text-white font-bold text-xs uppercase tracking-wider hover:bg-vertex-blueprint transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>{dict.contact.form.submit}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-300">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold font-mono text-emerald-950">
                {isFa ? "پرونده فنی با موفقیت ثبت شد" : "Technical Dossier Transmitted"}
              </h4>
              <p className="text-xs sm:text-sm text-emerald-800 font-normal max-w-lg mx-auto">
                {dict.contact.form.success}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Global Offices */}
      <div className="space-y-8">
        <h3 className="text-2xl font-black font-mono text-vertex-primary text-center">
          {isFa ? "دفاتر و مراکز فنی بین‌المللی" : "International Engineering Hubs"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offices.map((office, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-vertex-border hover:border-vertex-blueprint transition-all shadow-card space-y-4 text-xs font-mono"
            >
              <div className="flex items-center gap-2 text-vertex-blueprint font-black text-sm">
                <Building2 className="w-4 h-4 shrink-0" />
                <span>{isFa ? office.cityFa : office.cityEn}</span>
              </div>
              <div className="space-y-2 text-vertex-secondary font-sans font-medium">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-vertex-blueprint shrink-0 mt-0.5" />
                  <span>{isFa ? office.addressFa : office.addressEn}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <Phone className="w-3.5 h-3.5 text-vertex-blueprint shrink-0" />
                  <span dir="ltr">{office.phone}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <Mail className="w-3.5 h-3.5 text-vertex-blueprint shrink-0" />
                  <span>{office.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
