"use client";

import React, { useState } from "react";
import { Locale, dictionary } from "@/lib/dictionary";
import { TechBadge } from "./TechBadge";
import { 
  Building, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Calculator, 
  ShieldAlert, 
  Send,
  Zap,
  Layers,
  Sparkles
} from "lucide-react";

interface ConsultationWizardProps {
  locale: Locale;
}

export function ConsultationWizard({ locale }: ConsultationWizardProps) {
  const isFa = locale === "fa";
  const dict = dictionary[locale];

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    buildingType: "commercial",
    floors: 24,
    height: 96,
    traffic: "medium",
    shaftWidth: 2200,
    shaftDepth: 2400,
    name: "",
    company: "",
    email: "",
    phone: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Preliminary calculation engine
  const calculatePreliminarySpecs = () => {
    const floors = Number(formData.floors) || 10;
    const height = Number(formData.height) || floors * 3.5;
    
    // Rule of thumb for speed: travel time across full height roughly 30-35s
    let speed = 1.6;
    if (height > 150) speed = 6.0;
    else if (height > 100) speed = 4.0;
    else if (height > 60) speed = 2.5;
    else if (height > 30) speed = 1.75;
    else speed = 1.0;

    let capacity = 1000; // kg (~13 persons)
    let minShaft = "2100 x 2200 mm";
    let driveType = height > 90 ? "High-Rise Overhead PMSM Traction" : "Machine Room-Less (MRL) PMSM";
    
    if (formData.buildingType === "hospital") {
      capacity = 1600; // Stretcher elevator bed rating (21 persons)
      minShaft = "2400 x 2800 mm";
    } else if (formData.buildingType === "residential") {
      capacity = 800; // 10 persons
    } else if (formData.buildingType === "commercial") {
      capacity = 1275; // 17 persons
    }

    return {
      recommendedSpeed: `${speed.toFixed(1)} m/s`,
      recommendedCapacity: `${capacity} kg (${Math.round(capacity / 75)} Passengers)`,
      recommendedDrive: driveType,
      recommendedShaft: minShaft,
      handlingCapacityRate: formData.traffic === "high" ? "14% - 17% (5-min peak)" : "11% - 13% (Standard)",
    };
  };

  const prelim = calculatePreliminarySpecs();

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 3));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="w-full bg-vertex-surface/80 border border-vertex-border rounded-2xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="pb-6 border-b border-vertex-border">
        <TechBadge variant="cyan">
          {isFa ? "مشاوره و تخمین هوشمند مهندسی" : "SMART CONSULTATION WIZARD"}
        </TechBadge>
        <h3 className="text-2xl lg:text-3xl font-extrabold text-vertex-ice mt-2 font-mono">
          {isFa ? "ویزارد برآورد اولیه پارامترهای آسانسور" : "Preliminary Lift Sizing Wizard"}
        </h3>
        <p className="text-sm text-vertex-steel mt-1 max-w-2xl font-light">
          {isFa
            ? "با تکمیل مشخصات کاربری و ابعاد ساختمان، برآورد اولیه‌ای از سرعت، ظرفیت و چیدمان بهینه سامانه جابجایی عمودی دریافت کنید."
            : "Input preliminary building parameters to receive baseline speed, capacity, and drive configurations."}
        </p>

        {/* Step Indicator */}
        <div className="flex items-center gap-3 mt-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full text-xs font-mono font-bold flex items-center justify-center transition-all ${
                  step === s
                    ? "bg-vertex-cyan text-vertex-deep shadow-cyan"
                    : step > s
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500"
                    : "bg-vertex-deep text-vertex-steel border border-vertex-border"
                }`}
              >
                {step > s ? <Check className="w-3.5 h-3.5" /> : s}
              </span>
              <span className="text-xs font-mono text-vertex-steel hidden sm:inline">
                {s === 1
                  ? isFa ? "مشخصات سازه" : "Building Data"
                  : s === 2
                  ? isFa ? "ابعاد چاه و ترافیک" : "Shaft & Flow"
                  : isFa ? "اطلاعات متقاضی" : "Contact & Report"}
              </span>
              {s < 3 && <div className="w-8 h-[1px] bg-vertex-border" />}
            </div>
          ))}
        </div>
      </div>

      {!isSubmitted ? (
        <div className="mt-8">
          {/* STEP 1: Building Archetype & Height */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-mono uppercase text-vertex-ice font-semibold block mb-2">
                  {isFa ? "کاربری اصلی ساختمان" : "Primary Building Archetype"}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { id: "commercial", labelEn: "Commercial Office", labelFa: "اداری و مالی" },
                    { id: "residential", labelEn: "Luxury Residential", labelFa: "مسکونی لوکس" },
                    { id: "hospital", labelEn: "Hospital / Healthcare", labelFa: "بیمارستانی و درمانی" },
                    { id: "transit", labelEn: "Transit Hub / Airport", labelFa: "فرودگاه و پایانه" },
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, buildingType: type.id })}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        formData.buildingType === type.id
                          ? "border-vertex-cyan bg-vertex-cyan/15 text-vertex-ice shadow-glow"
                          : "border-vertex-border bg-vertex-deep/60 text-vertex-steel hover:border-vertex-steel/40"
                      }`}
                    >
                      <div className="text-xs font-mono font-bold">
                        {isFa ? type.labelFa : type.labelEn}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-vertex-ice font-semibold block mb-2">
                    {isFa ? "تعداد طبقات و توقف‌ها" : "Number of Floors / Stops"}
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="120"
                    value={formData.floors}
                    onChange={(e) =>
                      setFormData({ ...formData, floors: parseInt(e.target.value) || 2 })
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-vertex-deep border border-vertex-border text-vertex-ice font-mono text-sm focus:border-vertex-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-vertex-ice font-semibold block mb-2">
                    {isFa ? "ارتفاع کل تقریبی (متر)" : "Estimated Total Travel Height (m)"}
                  </label>
                  <input
                    type="number"
                    min="6"
                    max="600"
                    value={formData.height}
                    onChange={(e) =>
                      setFormData({ ...formData, height: parseInt(e.target.value) || 10 })
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-vertex-deep border border-vertex-border text-vertex-ice font-mono text-sm focus:border-vertex-cyan focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Shaft Dimensions & Traffic Flow */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-mono uppercase text-vertex-ice font-semibold block mb-2">
                  {isFa ? "شدت ترافیک و حجم تردد در ساعات اوج" : "Expected Peak Passenger Flow"}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "low", labelEn: "Standard (Residential)", labelFa: "معمولی (مسکونی)" },
                    { id: "medium", labelEn: "Moderate (Mixed-Use)", labelFa: "متوسط (کاربری ترکیبی)" },
                    { id: "high", labelEn: "High (Commercial/HQ)", labelFa: "فوق متراکم (برج اداری)" },
                  ].map((traffic) => (
                    <button
                      key={traffic.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, traffic: traffic.id })}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        formData.traffic === traffic.id
                          ? "border-vertex-cyan bg-vertex-cyan/15 text-vertex-ice shadow-glow"
                          : "border-vertex-border bg-vertex-deep/60 text-vertex-steel hover:border-vertex-steel/40"
                      }`}
                    >
                      <span className="text-xs font-mono font-medium">
                        {isFa ? traffic.labelFa : traffic.labelEn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-vertex-ice font-semibold block mb-2">
                    {isFa ? "عرض مفید چاهک (میلی‌متر)" : "Available Shaft Width (mm)"}
                  </label>
                  <input
                    type="number"
                    step="50"
                    value={formData.shaftWidth}
                    onChange={(e) =>
                      setFormData({ ...formData, shaftWidth: parseInt(e.target.value) || 1500 })
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-vertex-deep border border-vertex-border text-vertex-ice font-mono text-sm focus:border-vertex-cyan focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-vertex-ice font-semibold block mb-2">
                    {isFa ? "عمق مفید چاهک (میلی‌متر)" : "Available Shaft Depth (mm)"}
                  </label>
                  <input
                    type="number"
                    step="50"
                    value={formData.shaftDepth}
                    onChange={(e) =>
                      setFormData({ ...formData, shaftDepth: parseInt(e.target.value) || 1500 })
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-vertex-deep border border-vertex-border text-vertex-ice font-mono text-sm focus:border-vertex-cyan focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Contact & Live Preliminary Calculation Report */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Mandatory Preliminary Disclaimer */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-vertex-steel leading-relaxed">
                  <strong className="text-amber-300 font-mono">
                    {isFa ? "سلب مسئولیت مهندسی رسمی: " : "ENGINEERING ADVISORY NOTICE: "}
                  </strong>
                  {isFa
                    ? "نتایج زیر تخمین اولیه و غیررسمی بوده و صرفاً جهت راهنمایی کانسپت معماری است. ابعاد دقیق سازه، بارهای استاتیک و محاسبات رسمی استاندارد EN 81-20 نیازمند تحلیل نقشه توسط مهندسان ورتکس می‌باشد."
                    : "The calculations below are non-certified preliminary sizing estimates intended for concept architectural feasibility. Formal lift traffic analysis and EN 81-20 structural shaft sign-off require professional engineering review."}
                </p>
              </div>

              {/* Calculated Preliminary Results Grid */}
              <div className="p-5 rounded-xl bg-vertex-deep border border-vertex-cyan/30 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-vertex-cyan font-bold border-b border-vertex-border pb-2">
                  <span className="flex items-center gap-1.5">
                    <Calculator className="w-4 h-4" />
                    {isFa ? "برآورد اولیه مشخصات بالابر" : "Preliminary Engineering Dossier"}
                  </span>
                  <span>PRELIMINARY V1.0</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="p-3 rounded bg-vertex-surface/70 border border-vertex-border">
                    <span className="text-vertex-steel text-[10px] block">
                      {isFa ? "سرعت نامی پیشنهادی" : "Recommended Velocity"}
                    </span>
                    <span className="text-lg font-bold text-vertex-ice mt-1 block">
                      {prelim.recommendedSpeed}
                    </span>
                  </div>
                  <div className="p-3 rounded bg-vertex-surface/70 border border-vertex-border">
                    <span className="text-vertex-steel text-[10px] block">
                      {isFa ? "ظرفیت نامی کابین" : "Recommended Capacity"}
                    </span>
                    <span className="text-lg font-bold text-vertex-ice mt-1 block">
                      {prelim.recommendedCapacity}
                    </span>
                  </div>
                  <div className="p-3 rounded bg-vertex-surface/70 border border-vertex-border">
                    <span className="text-vertex-steel text-[10px] block">
                      {isFa ? "معماری محرک" : "Drive Architecture"}
                    </span>
                    <span className="text-xs font-bold text-vertex-cyan mt-1 block">
                      {prelim.recommendedDrive}
                    </span>
                  </div>
                  <div className="p-3 rounded bg-vertex-surface/70 border border-vertex-border">
                    <span className="text-vertex-steel text-[10px] block">
                      {isFa ? "نرخ جابجایی ترافیک" : "Peak 5-Min Capacity"}
                    </span>
                    <span className="text-xs font-bold text-vertex-ice mt-1 block">
                      {prelim.handlingCapacityRate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information Form */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase text-vertex-ice font-semibold block mb-1">
                      {isFa ? "نام و نام خانوادگی / شرکت" : "Full Name & Organization *"}
                    </label>
                    <input
                      required
                      type="text"
                      placeholder={isFa ? "مهندس رضایی / شرکت توسعه عمران" : "Alex Mercer / Foster & Partners"}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-vertex-deep border border-vertex-border text-vertex-ice text-xs focus:border-vertex-cyan focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase text-vertex-ice font-semibold block mb-1">
                      {isFa ? "ایمیل رسمی" : "Corporate Email *"}
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="engineering@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-vertex-deep border border-vertex-border text-vertex-ice text-xs focus:border-vertex-cyan focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-vertex-cyan text-vertex-deep font-bold text-xs uppercase tracking-wider hover:bg-vertex-cyanHover transition-all shadow-cyan"
                  >
                    <span>{isFa ? "ثبت و ارسال پرونده مشاوره" : "Submit Consultation Request"}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Navigation Controls between steps */}
          <div className="flex items-center justify-between pt-6 border-t border-vertex-border mt-8">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all ${
                step === 1
                  ? "opacity-30 cursor-not-allowed text-vertex-steel"
                  : "text-vertex-ice hover:bg-vertex-deep border border-vertex-border"
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isFa ? "مرحله قبل" : "Previous"}</span>
            </button>

            {step < 3 && (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-mono font-bold bg-vertex-cyan text-vertex-deep hover:bg-vertex-cyanHover transition-all shadow-cyan"
              >
                <span>{isFa ? "مرحله بعد" : "Next Step"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Submission Success Screen */
        <div className="mt-8 p-8 rounded-xl bg-vertex-deep/90 border border-emerald-500/40 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/50">
            <Check className="w-6 h-6" />
          </div>
          <h4 className="text-xl font-bold font-mono text-vertex-ice">
            {isFa ? "درخواست مشاوره مهندسی با موفقیت ثبت گردید" : "Consultation Dossier Successfully Received"}
          </h4>
          <p className="text-xs sm:text-sm text-vertex-steel max-w-xl mx-auto leading-relaxed font-light">
            {dict.contact.form.success}
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setStep(1);
              }}
              className="px-4 py-2 text-xs font-mono rounded bg-vertex-surface border border-vertex-border text-vertex-cyan hover:bg-vertex-border transition-colors"
            >
              {isFa ? "محاسبه مجدد برای پروژه‌ای دیگر" : "Start Another Preliminary Calculation"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
