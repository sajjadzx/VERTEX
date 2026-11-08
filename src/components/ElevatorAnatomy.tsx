"use client";

import React, { useState } from "react";
import { Locale } from "@/lib/dictionary";
import { ELEVATOR_ANATOMY_DATA, AnatomyComponent } from "@/lib/constants";
import { TechBadge } from "./TechBadge";
import { ShieldCheck, Info, Cpu, Layers, CheckCircle2 } from "lucide-react";

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
    <div className="w-full bg-white border border-vertex-border rounded-2xl p-6 lg:p-8 shadow-card">
      {/* Component Title & Architecture Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-vertex-border gap-4">
        <div>
          <TechBadge variant="blueprint">
            {isFa ? "کالبدشکافی مکانیکی و استانداردهای ایمنی" : "INTERACTIVE KINEMATIC SCHEMATIC"}
          </TechBadge>
          <h3 className="text-2xl lg:text-3xl font-black text-vertex-primary mt-2 font-mono">
            {isFa ? "آناتومی سازه و اجزای آسانسور کششی (EN 81-20)" : "Elevator Anatomy & Safety Systems"}
          </h3>
          <p className="text-sm text-vertex-secondary mt-1 max-w-xl font-normal">
            {isFa
              ? "روی هر یک از قطعات فنی کلیک کنید تا عملکرد، استاندارد EN 81-20، محاسبات تلرانس و مشخصات متالورژی آن را بررسی فرمایید."
              : "Select any mechanical or safety component to inspect its engineering function and EN 81-20 compliance."}
          </p>
        </div>

        {/* Traction vs MRL Mode */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-vertex-elevated border border-vertex-borderStrong self-start">
          <button
            onClick={() => setActiveTab("traction")}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
              activeTab === "traction"
                ? "bg-vertex-primary text-white shadow-sm"
                : "text-vertex-secondary hover:text-vertex-primary"
            }`}
          >
            {isFa ? "موتورخانه در بالا (Overhead Traction)" : "Overhead Traction"}
          </button>
          <button
            onClick={() => setActiveTab("mrl")}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
              activeTab === "mrl"
                ? "bg-vertex-primary text-white shadow-sm"
                : "text-vertex-secondary hover:text-vertex-primary"
            }`}
          >
            {isFa ? "بدون موتورخانه (MRL)" : "Machine Room-Less (MRL)"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-start">
        {/* Left Column: Interactive Technical Schematic Diagram */}
        <div className="lg:col-span-6 bg-vertex-elevated/70 border border-vertex-borderStrong rounded-xl p-4 sm:p-6 relative overflow-hidden flex flex-col items-center justify-center bg-cad-paper">
          {/* Schematic Vector Drawing */}
          <div className="relative w-full max-w-sm aspect-[1/2] rounded-lg border-x-2 border-dashed border-vertex-steel/40 px-4 py-6 flex flex-col justify-between bg-white shadow-sm">
            {/* Overhead / Machine Room */}
            <div 
              onClick={() => setActiveComponent(ELEVATOR_ANATOMY_DATA.find((c) => c.id === "traction-machine")!)}
              className={`w-full h-16 rounded border p-2 flex flex-col items-center justify-center relative cursor-pointer transition-all ${
                activeComponent.id === "traction-machine"
                  ? "border-vertex-blueprint bg-sky-50 shadow-sm"
                  : "border-vertex-borderStrong bg-vertex-elevated hover:border-vertex-blueprint"
              }`}
            >
              <span className="text-[10px] font-mono text-vertex-blueprint font-bold tracking-wider uppercase">
                {activeTab === "traction" ? "PENTHOUSE MACHINE ROOM" : "HOISTWAY HEAD (MRL)"}
              </span>
              <div className="w-14 h-7 border-2 border-vertex-blueprint bg-white rounded-full flex items-center justify-center mt-1 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-vertex-blueprint" />
              </div>
            </div>

            {/* Hoistway Mid Section */}
            <div className="relative flex-1 w-full my-4 flex items-center justify-between px-2">
              {/* Left: Guide Rails */}
              <div 
                onClick={() => setActiveComponent(ELEVATOR_ANATOMY_DATA.find((c) => c.id === "guide-rails")!)}
                className={`w-2 h-full rounded cursor-pointer transition-all ${
                  activeComponent.id === "guide-rails" ? "bg-vertex-blueprint" : "bg-slate-300 hover:bg-slate-400"
                }`}
                title="Guide Rails"
              />

              {/* Governor Wire Rope */}
              <div 
                onClick={() => setActiveComponent(ELEVATOR_ANATOMY_DATA.find((c) => c.id === "governor")!)}
                className="w-0.5 h-full bg-amber-400 cursor-pointer"
                title="Overspeed Governor Cable"
              />

              {/* Center: Car Sling & Cab */}
              <div
                onClick={() =>
                  setActiveComponent(
                    ELEVATOR_ANATOMY_DATA.find((c) => c.id === "cabin")!
                  )
                }
                className={`w-28 sm:w-32 h-40 rounded-lg border cursor-pointer transition-all duration-300 p-2 flex flex-col justify-between ${
                  activeComponent.id === "cabin"
                    ? "border-vertex-blueprint bg-sky-50 shadow-blueprint scale-105"
                    : "border-vertex-borderStrong bg-white hover:border-vertex-blueprint"
                }`}
              >
                <div className="flex justify-between items-center text-[9px] font-mono text-vertex-steel">
                  <span className="font-bold">CAR SLING</span>
                  <span className="text-vertex-blueprint font-bold">EN 81-20</span>
                </div>
                <div className="w-full h-20 border border-slate-200 rounded bg-slate-50 flex items-center justify-center text-center p-1">
                  <span className="text-[10px] font-mono text-vertex-primary font-bold">
                    {isFa ? "کابین مسافری صلب" : "PASSENGER CABIN"}
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
                  className={`w-full py-1 rounded text-center text-[8px] font-mono uppercase font-bold cursor-pointer transition-all ${
                    activeComponent.id === "safety-gear"
                      ? "bg-red-600 text-white"
                      : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                  }`}
                >
                  SAFETY GEAR (PARACHUTE)
                </div>
              </div>

              {/* Suspension Ropes (Center-Right) */}
              <div 
                onClick={() => setActiveComponent(ELEVATOR_ANATOMY_DATA.find((c) => c.id === "suspension-ropes")!)}
                className={`w-1 h-full cursor-pointer transition-all ${
                  activeComponent.id === "suspension-ropes" ? "bg-vertex-blueprint" : "bg-slate-400"
                }`}
                title="Suspension Ropes"
              />

              {/* Right: Counterweight */}
              <div
                onClick={() =>
                  setActiveComponent(
                    ELEVATOR_ANATOMY_DATA.find((c) => c.id === "counterweight")!
                  )
                }
                className={`w-14 h-32 rounded border cursor-pointer transition-all duration-300 p-1 flex flex-col justify-around ${
                  activeComponent.id === "counterweight"
                    ? "border-vertex-blueprint bg-sky-50 shadow-blueprint scale-105"
                    : "border-vertex-borderStrong bg-white hover:border-vertex-blueprint"
                }`}
              >
                {[1, 2, 3, 4, 5].map((b) => (
                  <div key={b} className="w-full h-3 bg-slate-200 rounded-sm border border-slate-300" />
                ))}
                <span className="text-[8px] font-mono text-center text-vertex-steel font-bold">CWT</span>
              </div>

              {/* Right Guide Rails */}
              <div className="w-2 h-full bg-slate-300 rounded" />
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
                  ? "border-vertex-blueprint bg-sky-50 shadow-sm"
                  : "border-vertex-borderStrong bg-vertex-elevated hover:border-vertex-blueprint"
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="w-4 h-6 border border-vertex-blueprint bg-white rounded-t" />
                <span className="text-[8px] font-mono text-vertex-steel font-bold">CAR BUFFER</span>
              </div>
              <span className="text-[9px] font-mono text-vertex-primary font-bold uppercase">
                {isFa ? "چاهک آسانسور (Pit)" : "Hoistway Pit"}
              </span>
              <div className="flex flex-col items-center">
                <div className="w-4 h-6 border border-vertex-blueprint bg-white rounded-t" />
                <span className="text-[8px] font-mono text-vertex-steel font-bold">CWT BUFFER</span>
              </div>
            </div>
          </div>

          {/* Hotspot buttons */}
          <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
            {ELEVATOR_ANATOMY_DATA.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveComponent(item)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono border transition-all ${
                  activeComponent.id === item.id
                    ? "bg-vertex-blueprint text-white border-vertex-blueprint font-bold shadow-sm"
                    : "bg-white text-vertex-secondary border-vertex-borderStrong hover:border-vertex-blueprint"
                }`}
              >
                {isFa ? item.nameFa.split(" ")[0] : item.nameEn.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Deep Technical Inspector Card */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white border border-vertex-border rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-vertex-border">
              <span className="text-xs font-mono uppercase text-vertex-blueprint font-bold tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                {activeComponent.category.toUpperCase()} SUBSYSTEM
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-vertex-elevated border border-vertex-borderStrong text-vertex-primary font-bold">
                {activeComponent.normReference}
              </span>
            </div>

            <h4 className="text-xl lg:text-2xl font-black text-vertex-primary mt-4 font-mono">
              {isFa ? activeComponent.nameFa : activeComponent.nameEn}
            </h4>

            {/* Function */}
            <div className="mt-4 space-y-1.5">
              <h5 className="text-xs font-mono uppercase text-vertex-steel font-bold tracking-wider">
                {isFa ? "شرح مکانیکی و کارکرد" : "Kinematic & Engineering Function"}
              </h5>
              <p className="text-sm text-vertex-secondary leading-relaxed font-normal">
                {isFa ? activeComponent.functionFa : activeComponent.functionEn}
              </p>
            </div>

            {/* Specifications */}
            <div className="mt-5 p-4 rounded-lg bg-vertex-elevated border border-vertex-border space-y-1.5">
              <h5 className="text-xs font-mono uppercase text-vertex-blueprint font-bold tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                {isFa ? "پارامترهای فنی و تلرانس‌ها" : "Technical Tolerances & Parameters"}
              </h5>
              <p className="text-xs sm:text-sm font-mono text-vertex-primary leading-relaxed font-medium">
                {isFa ? activeComponent.specsFa : activeComponent.specsEn}
              </p>
            </div>

            {/* Compliance verification */}
            <div className="mt-5 flex items-center justify-between pt-4 border-t border-vertex-border text-xs text-vertex-steel">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  {isFa
                    ? "منطبق بر دایرکتیو اتحادیه اروپا 2014/33/EU"
                    : "Complies with EU Lift Directive 2014/33/EU"}
                </span>
              </div>
              <span className="font-mono font-bold text-emerald-700">100% PASS</span>
            </div>
          </div>

          {/* Comparison box */}
          <div className="p-4 rounded-xl bg-vertex-elevated border border-vertex-border text-xs text-vertex-secondary space-y-1.5">
            <span className="font-mono text-vertex-primary font-bold uppercase tracking-wider block">
              {isFa ? "مقایسه معماری Traction و MRL:" : "Traction vs. MRL Comparison:"}
            </span>
            <p className="leading-relaxed text-[11px]">
              {isFa
                ? "سیستم‌های کششی معمولی نیازمند اتاق موتورخانه در بالای چاهک هستند و برای سرعت‌های بیش از ۲.۵ تا ۱۲.۵ متر بر ثانیه در برج‌ها الزامی‌اند. در مقابل، آسانسورهای بدون موتورخانه (MRL) با نصب موتور در چاهک، متراژ مفید ساختمان را تا ۴۰ متر مربع صرفه‌جویی می‌کنند."
                : "Conventional overhead traction utilizes a dedicated penthouse machine room and supports velocities up to 12.5 m/s. Machine Room-Less (MRL) mounts a compact gearless motor inside the hoistway head, reclaiming building leasable square footage for travels up to 90 m."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
