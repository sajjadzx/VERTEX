"use client";

import React, { useState } from "react";
import { Locale } from "@/lib/dictionary";
import { ELEVATOR_ANATOMY_DATA, AnatomyComponent } from "@/lib/constants";
import { TechBadge } from "./TechBadge";
import { ShieldCheck, Info, Cpu, Layers } from "lucide-react";

interface ElevatorAnatomyProps {
  locale: Locale;
}

export function ElevatorAnatomy({ locale }: ElevatorAnatomyProps) {
  const isFa = locale === "fa";
  const [activeComponent, setActiveComponent] = useState<AnatomyComponent>(
    ELEVATOR_ANATOMY_DATA[0]
  );
  const [activeTab, setActiveTab] = useState<"traction" | "mrl">("traction");

  return (
    <div className="w-full bg-vertex-surface/80 border border-vertex-border rounded-2xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl">
      {/* Component Title & Architecture Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-vertex-border gap-4">
        <div>
          <TechBadge variant="cyan">
            {isFa ? "کالبدشکافی فنی آسانسور" : "INTERACTIVE KINEMATICS"}
          </TechBadge>
          <h3 className="text-2xl lg:text-3xl font-extrabold text-vertex-ice mt-2 font-mono">
            {isFa ? "آناتومی مهندسی آسانسور کششی" : "Elevator Anatomy & Safety Systems"}
          </h3>
          <p className="text-sm text-vertex-steel mt-1 max-w-xl font-light">
            {isFa
              ? "روی هر یک از قطعات فنی کلیک کنید تا عملکرد، استاندارد EN 81-20 و مشخصات مهندسی آن را مشاهده کنید."
              : "Select any mechanical or safety component to inspect its engineering function and EN 81-20 compliance."}
          </p>
        </div>

        {/* Traction vs MRL Mode */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-vertex-deep border border-vertex-border self-start">
          <button
            onClick={() => setActiveTab("traction")}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-all ${
              activeTab === "traction"
                ? "bg-vertex-cyan text-vertex-deep shadow-cyan font-bold"
                : "text-vertex-steel hover:text-vertex-ice"
            }`}
          >
            {isFa ? "موتورخانه در بالا (Traction)" : "Overhead Traction"}
          </button>
          <button
            onClick={() => setActiveTab("mrl")}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-all ${
              activeTab === "mrl"
                ? "bg-vertex-cyan text-vertex-deep shadow-cyan font-bold"
                : "text-vertex-steel hover:text-vertex-ice"
            }`}
          >
            {isFa ? "بدون موتورخانه (MRL)" : "Machine Room-Less (MRL)"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
        {/* Left Column: Interactive Technical Schematic Diagram */}
        <div className="lg:col-span-6 bg-vertex-deep border border-vertex-border rounded-xl p-4 sm:p-6 relative overflow-hidden flex flex-col items-center justify-center">
          {/* Shaft Grid Background */}
          <div className="absolute inset-0 bg-tech-grid opacity-30" />

          {/* Schematic SVG */}
          <div className="relative w-full max-w-sm aspect-[1/2] rounded-lg border-x-2 border-dashed border-vertex-steel/30 px-4 py-6 flex flex-col justify-between">
            {/* Overhead / Machine Room */}
            <div className="w-full h-16 rounded border border-vertex-cyan/40 bg-vertex-navy/90 p-2 flex flex-col items-center justify-center relative shadow-glow">
              <span className="text-[10px] font-mono text-vertex-cyan tracking-widest uppercase">
                {activeTab === "traction" ? "Machine Room" : "Hoistway Overhead (MRL)"}
              </span>
              <div className="w-12 h-6 border-2 border-vertex-cyan rounded-full flex items-center justify-center mt-1">
                <span className="w-2 h-2 rounded-full bg-vertex-cyan animate-pulse" />
              </div>
            </div>

            {/* Hoistway Mid Section */}
            <div className="relative flex-1 w-full my-4 flex items-center justify-between px-2">
              {/* Left: Guide Rails */}
              <div className="w-1.5 h-full bg-gradient-to-b from-vertex-steel via-vertex-cyan/40 to-vertex-steel rounded" />

              {/* Center: Car Sling & Cab */}
              <div
                onClick={() =>
                  setActiveComponent(
                    ELEVATOR_ANATOMY_DATA.find((c) => c.id === "cabin")!
                  )
                }
                className={`w-28 sm:w-32 h-36 rounded-lg border cursor-pointer transition-all duration-300 p-2 flex flex-col justify-between ${
                  activeComponent.id === "cabin"
                    ? "border-vertex-cyan bg-vertex-cyan/20 shadow-cyan scale-105"
                    : "border-vertex-border bg-vertex-surface/80 hover:border-vertex-steel"
                }`}
              >
                <div className="flex justify-between items-center text-[9px] font-mono text-vertex-ice/70">
                  <span>CAR SLING</span>
                  <span className="text-vertex-cyan">EN 81-20</span>
                </div>
                <div className="w-full h-16 border border-vertex-steel/40 rounded bg-vertex-deep/60 flex items-center justify-center">
                  <span className="text-[10px] font-mono text-vertex-ice">
                    {isFa ? "کابین مسافری" : "CABIN INTERIOR"}
                  </span>
                </div>
                {/* Under car safety gear */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveComponent(
                      ELEVATOR_ANATOMY_DATA.find((c) => c.id === "safety-gear")!
                    );
                  }}
                  className={`w-full py-0.5 rounded text-center text-[8px] font-mono uppercase font-bold cursor-pointer ${
                    activeComponent.id === "safety-gear"
                      ? "bg-vertex-cyan text-vertex-deep"
                      : "bg-red-500/20 text-red-300 hover:bg-red-500/40"
                  }`}
                >
                  SAFETY GEAR (PARACHUTE)
                </div>
              </div>

              {/* Ropes (Center-Right) */}
              <div className="w-0.5 h-full bg-vertex-cyan/40 border-r border-dashed border-vertex-cyan/60" />

              {/* Right: Counterweight */}
              <div
                onClick={() =>
                  setActiveComponent(
                    ELEVATOR_ANATOMY_DATA.find((c) => c.id === "counterweight")!
                  )
                }
                className={`w-12 h-28 rounded border cursor-pointer transition-all duration-300 p-1 flex flex-col justify-around ${
                  activeComponent.id === "counterweight"
                    ? "border-vertex-cyan bg-vertex-cyan/20 shadow-cyan scale-105"
                    : "border-vertex-border bg-vertex-surface/80 hover:border-vertex-steel"
                }`}
              >
                {[1, 2, 3, 4, 5].map((b) => (
                  <div key={b} className="w-full h-2.5 bg-vertex-steel/30 rounded-sm" />
                ))}
              </div>

              {/* Right Guide Rails */}
              <div className="w-1.5 h-full bg-gradient-to-b from-vertex-steel via-vertex-cyan/40 to-vertex-steel rounded" />
            </div>

            {/* Hoistway Pit & Buffers */}
            <div
              onClick={() =>
                setActiveComponent(
                  ELEVATOR_ANATOMY_DATA.find((c) => c.id === "pit-buffers")!
                )
              }
              className={`w-full h-14 rounded border cursor-pointer p-2 flex items-center justify-around transition-all ${
                activeComponent.id === "pit-buffers"
                  ? "border-vertex-cyan bg-vertex-cyan/20 shadow-cyan"
                  : "border-vertex-border bg-vertex-navy/90 hover:border-vertex-steel"
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="w-4 h-6 border border-vertex-cyan bg-vertex-surface rounded-t" />
                <span className="text-[8px] font-mono text-vertex-steel">CAR BUFFER</span>
              </div>
              <span className="text-[9px] font-mono text-vertex-steel uppercase">
                {isFa ? "چاهک آسانسور (Pit)" : "Hoistway Pit Level"}
              </span>
              <div className="flex flex-col items-center">
                <div className="w-4 h-6 border border-vertex-cyan bg-vertex-surface rounded-t" />
                <span className="text-[8px] font-mono text-vertex-steel">CWT BUFFER</span>
              </div>
            </div>
          </div>

          {/* Quick Hotspot Buttons under Schematic */}
          <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
            {ELEVATOR_ANATOMY_DATA.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveComponent(item)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono border transition-all ${
                  activeComponent.id === item.id
                    ? "bg-vertex-cyan text-vertex-deep border-vertex-cyan font-bold"
                    : "bg-vertex-surface text-vertex-steel border-vertex-border hover:border-vertex-cyan/40"
                }`}
              >
                {isFa ? item.nameFa.split(" ")[0] : item.nameEn.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Deep Technical Inspector Card */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-vertex-deep/90 border border-vertex-border rounded-xl p-6 shadow-xl relative overflow-hidden">
            {/* Top Cyan Accent */}
            <div className="absolute top-0 inset-x-0 h-1 bg-vertex-cyan shadow-cyan" />

            <div className="flex items-center justify-between pb-4 border-b border-vertex-border">
              <span className="text-xs font-mono uppercase text-vertex-cyan tracking-widest flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                {activeComponent.category.toUpperCase()} SUBSYSTEM
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-vertex-surface border border-vertex-border text-vertex-ice">
                {activeComponent.normReference}
              </span>
            </div>

            <h4 className="text-xl lg:text-2xl font-bold text-vertex-ice mt-4 font-mono">
              {isFa ? activeComponent.nameFa : activeComponent.nameEn}
            </h4>

            {/* Description / Function */}
            <div className="mt-4 space-y-2">
              <h5 className="text-xs font-mono uppercase text-vertex-steel tracking-wider font-semibold">
                {isFa ? "عملکرد مکانیکی و مهندسی" : "Kinematic & Engineering Function"}
              </h5>
              <p className="text-sm text-vertex-steel/90 leading-relaxed font-light">
                {isFa ? activeComponent.functionFa : activeComponent.functionEn}
              </p>
            </div>

            {/* Technical Specifications */}
            <div className="mt-6 p-4 rounded-lg bg-vertex-surface/70 border border-vertex-border space-y-2">
              <h5 className="text-xs font-mono uppercase text-vertex-cyan tracking-wider font-semibold flex items-center gap-2">
                <Info className="w-3.5 h-3.5" />
                {isFa ? "پارامترهای فنی و تلرانس‌ها" : "Technical Tolerances & Parameters"}
              </h5>
              <p className="text-xs sm:text-sm font-mono text-vertex-ice leading-relaxed">
                {isFa ? activeComponent.specsFa : activeComponent.specsEn}
              </p>
            </div>

            {/* Safety Norm Verification */}
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-vertex-border text-xs text-vertex-steel">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  {isFa
                    ? "انطباق با دایرکتیو بالابرهای اتحادیه اروپا"
                    : "Complies with EU Lift Directive 2014/33/EU"}
                </span>
              </div>
              <span className="font-mono text-vertex-cyan">100% PASS</span>
            </div>
          </div>

          {/* Architecture comparison box */}
          <div className="p-4 rounded-xl bg-vertex-surface/40 border border-vertex-border text-xs text-vertex-steel space-y-2">
            <span className="font-mono text-vertex-ice font-bold uppercase tracking-wider block">
              {isFa ? "تفاوت ساختار Traction و MRL" : "Traction vs. MRL Comparison"}
            </span>
            <p className="leading-relaxed">
              {isFa
                ? "سیستم‌های کششی معمولی نیازمند اتاق موتورخانه در بالای چاهک هستند و برای سرعت‌های بیش از ۲.۵ تا ۱۲.۵ متر بر ثانیه ایده‌آلند. در مقابل، آسانسورهای بدون موتورخانه (MRL) با جاسازی موتور درون چاه، فضای مفید معماری را افزایش داده و برای ساختمان‌های با ارتفاع تا ۹۰ متر بالاترین بازدهی را دارند."
                : "Conventional overhead traction utilizes a dedicated penthouse machine room and supports velocities up to 12.5 m/s. Machine Room-Less (MRL) mounts a compact gearless motor directly inside the hoistway head, reclaiming building leasable square footage for travels up to 90 m."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
