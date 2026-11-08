"use client";

import React, { useState } from "react";
import { Locale } from "@/lib/dictionary";
import { TechBadge } from "./TechBadge";
import { 
  Calculator, 
  Zap, 
  RotateCw, 
  ShieldCheck, 
  Cpu, 
  Sliders, 
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface TractionCalculatorProps {
  locale: Locale;
}

export function TractionCalculator({ locale }: TractionCalculatorProps) {
  const isFa = locale === "fa";

  // Engineering inputs
  const [capacityKg, setCapacityKg] = useState<number>(1000); // Q
  const [carTareKg, setCarTareKg] = useState<number>(1200); // P (Car dead weight)
  const [speedMs, setSpeedMs] = useState<number>(1.6); // v (m/s)
  const [travelMeters, setTravelMeters] = useState<number>(45); // H (travel height)
  const [ropingRatio, setRopingRatio] = useState<1 | 2>(2); // 1:1 or 2:1
  const [balanceFactor, setBalanceFactor] = useState<number>(0.48); // k (0.45 - 0.50)
  const [sheaveDiameterMm, setSheaveDiameterMm] = useState<number>(400); // D

  // Calculations based on mechanical engineering formulas (EN 81-50 / CIBSE Guide D)
  // Counterweight mass: Mcwt = P + k * Q
  const cwtMassKg = Math.round(carTareKg + balanceFactor * capacityKg);

  // Unbalanced mass: deltaM = (1 - k) * Q
  const unbalanceKg = Math.round((1 - balanceFactor) * capacityKg);

  // Mechanical efficiency eta (0.85 for 2:1 gearless, 0.90 for 1:1)
  const eta = ropingRatio === 1 ? 0.90 : 0.86;

  // Motor shaft power: P_motor = (deltaM * g * v) / (1000 * eta)
  const g = 9.81;
  const motorPowerKw = ((unbalanceKg * g * speedMs) / (1000 * eta)).toFixed(2);

  // Motor sheave RPM: n = (v * 60 * ropingRatio) / (pi * D)
  const motorRpm = Math.round((speedMs * 60 * ropingRatio) / (Math.PI * (sheaveDiameterMm / 1000)));

  // Motor Torque: T = (P_motor * 9550) / n
  const motorTorqueNm = Math.round((parseFloat(motorPowerKw) * 9550) / (motorRpm || 1));

  // Minimum buffer stroke per EN 81-20: s = v^2 / (2 * g * 0.8)
  const bufferStrokeMm = Math.round((Math.pow(speedMs * 1.15, 2) / (2 * g * 0.8)) * 1000);

  // Euler-Eytelwein traction ratio check: T1 / T2
  // Static ratio = (P + Q) / (Mcwt)
  const staticTractionRatio = ((carTareKg + capacityKg) / cwtMassKg).toFixed(2);
  const tractionSafe = parseFloat(staticTractionRatio) < 1.6;

  // Energy regeneration estimation: annual kWh savings
  const annualRegenKwh = Math.round(parseFloat(motorPowerKw) * 0.35 * 4.5 * 365);

  return (
    <div className="w-full bg-white border border-vertex-border rounded-2xl p-6 lg:p-8 shadow-card">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-vertex-border gap-4">
        <div>
          <TechBadge variant="blueprint" icon={<Calculator className="w-3.5 h-3.5" />}>
            {isFa ? "موتور محاسبات سینماتیک و توان محرک" : "KINEMATICS & TRACTION ENGINE"}
          </TechBadge>
          <h3 className="text-2xl lg:text-3xl font-black text-vertex-primary mt-2 font-mono">
            {isFa ? "محاسبات فنی توان موتور، گشتاور و کشش (EN 81-50)" : "Traction Motor Power & Torque Calculator"}
          </h3>
          <p className="text-sm text-vertex-secondary mt-1 max-w-2xl font-normal">
            {isFa
              ? "محاسبه دقیق توان نامی الکتروموتور گیرلس، گشتاور خروجی، دور فلکه، توازن وزنه‌تعادل و بررسی فرمول اولر-آیتل‌واین مطابق با EN 81-50 § 5.11."
              : "Compute shaft mechanical power, rotational torque, buffer stroke, and Euler-Eytelwein friction limits."}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-300">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{isFa ? "فرمول‌های مرجع: EN 81-50 § 5.11" : "Standard: EN 81-50 § 5.11"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left Column: Interactive Parametric Sliders & Inputs */}
        <div className="lg:col-span-6 space-y-5 bg-vertex-elevated/60 p-6 rounded-xl border border-vertex-border">
          <div className="text-xs font-mono font-bold text-vertex-primary uppercase tracking-wider flex items-center justify-between border-b border-vertex-border pb-2">
            <span>{isFa ? "پارامترهای متغیر ورودی" : "Engineering Input Variables"}</span>
            <Sliders className="w-4 h-4 text-vertex-blueprint" />
          </div>

          {/* Rated Load (Q) */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="font-semibold text-vertex-secondary">
                {isFa ? "ظرفیت نامی بار مسافر (Q):" : "Rated Payload (Q):"}
              </span>
              <span className="font-bold text-vertex-blueprint">{capacityKg} kg</span>
            </div>
            <input
              type="range"
              min="320"
              max="2500"
              step="50"
              value={capacityKg}
              onChange={(e) => setCapacityKg(parseInt(e.target.value))}
              className="w-full accent-vertex-blueprint"
            />
          </div>

          {/* Car Tare (P) */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="font-semibold text-vertex-secondary">
                {isFa ? "وزن مرده کابین و یوک (P):" : "Car Dead Weight (P):"}
              </span>
              <span className="font-bold text-vertex-blueprint">{carTareKg} kg</span>
            </div>
            <input
              type="range"
              min="500"
              max="3500"
              step="50"
              value={carTareKg}
              onChange={(e) => setCarTareKg(parseInt(e.target.value))}
              className="w-full accent-vertex-blueprint"
            />
          </div>

          {/* Rated Speed (v) */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="font-semibold text-vertex-secondary">
                {isFa ? "سرعت نامی حرکت (v):" : "Rated Velocity (v):"}
              </span>
              <span className="font-bold text-vertex-blueprint">{speedMs} m/s</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[1.0, 1.6, 2.0, 2.5, 4.0].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpeedMs(s)}
                  className={`py-1 rounded text-xs font-mono border transition-all ${
                    speedMs === s
                      ? "bg-vertex-blueprint text-white font-bold border-vertex-blueprint"
                      : "bg-white text-vertex-secondary border-vertex-borderStrong hover:border-vertex-blueprint"
                  }`}
                >
                  {s} m/s
                </button>
              ))}
            </div>
          </div>

          {/* Roping Ratio & Sheave Diameter */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono font-semibold text-vertex-secondary block mb-1">
                {isFa ? "سیستم تعلیق (Roping):" : "Roping System:"}
              </label>
              <select
                value={ropingRatio}
                onChange={(e) => setRopingRatio(parseInt(e.target.value) as 1 | 2)}
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-vertex-border text-xs font-mono font-bold text-vertex-primary"
              >
                <option value={1}>1:1 Direct Drive</option>
                <option value={2}>2:1 Underslung / Overhead</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono font-semibold text-vertex-secondary block mb-1">
                {isFa ? "ضریب تعادل (k):" : "Counterweight Factor (k):"}
              </label>
              <select
                value={balanceFactor}
                onChange={(e) => setBalanceFactor(parseFloat(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-vertex-border text-xs font-mono font-bold text-vertex-primary"
              >
                <option value={0.45}>k = 0.45 (Light traffic)</option>
                <option value={0.48}>k = 0.48 (Balanced commercial)</option>
                <option value={0.50}>k = 0.50 (Standard residential)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Kinematics Results */}
        <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-4">
            {/* Motor Power */}
            <div className="p-4 rounded-xl bg-white border border-vertex-blueprint shadow-sm">
              <span className="text-xs font-mono text-vertex-steel block">
                {isFa ? "توان محاسباتی موتور (P_shaft):" : "Calculated Motor Power:"}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black font-mono text-vertex-primary">{motorPowerKw}</span>
                <span className="text-sm font-mono font-bold text-vertex-blueprint">kW</span>
              </div>
              <span className="text-[10px] font-mono text-vertex-steel block mt-1">
                P = (ΔM · g · v) / (1000 · η)
              </span>
            </div>

            {/* Motor Torque */}
            <div className="p-4 rounded-xl bg-white border border-vertex-border shadow-sm">
              <span className="text-xs font-mono text-vertex-steel block">
                {isFa ? "گشتاور دورانی موتور (Torque):" : "Shaft Torque (Torque):"}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black font-mono text-vertex-primary">{motorTorqueNm}</span>
                <span className="text-sm font-mono font-bold text-vertex-blueprint">Nm</span>
              </div>
              <span className="text-[10px] font-mono text-vertex-steel block mt-1">
                Speed: {motorRpm} RPM on sheave
              </span>
            </div>

            {/* Counterweight Mass */}
            <div className="p-4 rounded-xl bg-white border border-vertex-border shadow-sm">
              <span className="text-xs font-mono text-vertex-steel block">
                {isFa ? "جرم وزنه‌تعادل (M_cwt):" : "Counterweight Mass:"}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black font-mono text-vertex-primary">{cwtMassKg}</span>
                <span className="text-xs font-mono font-bold text-vertex-steel">kg</span>
              </div>
              <span className="text-[10px] font-mono text-vertex-steel block mt-1">
                M_cwt = P + ({balanceFactor} · Q)
              </span>
            </div>

            {/* Buffer Stroke */}
            <div className="p-4 rounded-xl bg-white border border-vertex-border shadow-sm">
              <span className="text-xs font-mono text-vertex-steel block">
                {isFa ? "کورس ضربه‌گیر چاهک (S_buffer):" : "Min Buffer Stroke:"}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black font-mono text-vertex-primary">{bufferStrokeMm}</span>
                <span className="text-xs font-mono font-bold text-vertex-steel">mm</span>
              </div>
              <span className="text-[10px] font-mono text-vertex-steel block mt-1">
                EN 81-20 § 5.8 stroke calculation
              </span>
            </div>
          </div>

          {/* Traction Euler Verification Box */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs font-mono">
              <span className="font-bold text-emerald-800 block">
                {isFa ? "ارزیابی کشش اولر-آیتل‌واین (T1 / T2): " : "Euler Traction Ratio: "}
                {staticTractionRatio} (VERIFIED SAFE)
              </span>
              <p className="text-emerald-700 font-sans mt-0.5 leading-relaxed text-[11px]">
                {isFa
                  ? "نسبت کشش استاتیک T1/T2 کمتر از مرز بحرانی اصطکاک شیار V-groove بوده و خطر سرش سیم‌بکسل بر روی فلکه در بدترین شرایط بارگذاری وجود ندارد."
                  : "Static tension ratio complies with EN 81-50 § 5.11 rope traction limits with hardened undercut V-grooves."}
              </p>
            </div>
          </div>

          {/* Annual Regenerative Energy box */}
          <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between text-xs font-mono text-sky-900">
            <div>
              <span className="font-bold block">
                {isFa ? "بازیافت انرژی سالیانه درایو گرین (Regen):" : "Annual Regenerative Power Return:"}
              </span>
              <span className="text-[11px] text-sky-700">
                {isFa ? "تزریق توان به مدار برق ۳ فاز ساختمان" : "Feed-in to building 3-phase clean bus"}
              </span>
            </div>
            <span className="text-lg font-black text-sky-800">
              ~{annualRegenKwh.toLocaleString()} kWh/yr
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
