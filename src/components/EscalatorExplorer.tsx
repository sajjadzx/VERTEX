"use client";

import React, { useState } from "react";
import { Locale } from "@/lib/dictionary";
import { ESCALATOR_COMPONENTS, EscalatorComponent } from "@/lib/constants";
import { TechBadge } from "./TechBadge";
import { ShieldCheck, Activity, CheckCircle, Sparkles } from "lucide-react";

interface EscalatorExplorerProps {
  locale: Locale;
}

export function EscalatorExplorer({ locale }: EscalatorExplorerProps) {
  const isFa = locale === "fa";
  const [selectedComp, setSelectedComp] = useState<EscalatorComponent>(
    ESCALATOR_COMPONENTS[0]
  );

  return (
    <div className="w-full bg-white border border-vertex-border rounded-2xl p-6 lg:p-8 shadow-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-vertex-border gap-4">
        <div>
          <TechBadge variant="blueprint">
            {isFa ? "کاوشگر سازه و ایمنی پله‌برقی" : "ESCALATOR ARCHITECTURE"}
          </TechBadge>
          <h3 className="text-2xl lg:text-3xl font-black text-vertex-primary mt-2 font-mono">
            {isFa ? "مهندسی خرپا، پله‌ها و سنسورهای پله‌برقی (EN 115)" : "Escalator Cutaway & Subsystems"}
          </h3>
          <p className="text-sm text-vertex-secondary mt-1 max-w-xl font-normal">
            {isFa
              ? "اجزای اصلی سازه خرپای فولادی، پله‌های آلومینیومی، سیستم محرک و شانه ایمنی را با کلیک روی هر بخش بررسی فرمایید."
              : "Explore the structural truss, aluminum step chain, planetary drive, and comb safety sensors."}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-vertex-blueprint bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-200">
          <Activity className="w-3.5 h-3.5 text-vertex-blueprint" />
          <span>{isFa ? "استاندارد مرجع: EN 115-1:2017" : "Standard: EN 115-1:2017"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-start">
        {/* Left Column: Interactive Visual Escalator Section Cutaway */}
        <div className="lg:col-span-7 bg-vertex-elevated/70 border border-vertex-borderStrong rounded-xl p-6 relative overflow-hidden flex flex-col justify-between bg-cad-paper">
          {/* SVG Cutaway Representation */}
          <div className="relative w-full aspect-[16/9] min-h-[260px] flex items-center justify-center p-2 select-none">
            <svg
              viewBox="0 0 600 320"
              className="w-full h-full drop-shadow-sm select-none"
            >
              {/* Truss Framework */}
              <polygon
                points="40,240 180,240 440,70 560,70 560,110 440,110 200,280 40,280"
                fill="#FFFFFF"
                stroke={selectedComp.id === "truss" ? "#0284C7" : "#0F172A"}
                strokeWidth={selectedComp.id === "truss" ? "3" : "2"}
                className="cursor-pointer transition-all hover:stroke-vertex-blueprint"
                onClick={() =>
                  setSelectedComp(
                    ESCALATOR_COMPONENTS.find((c) => c.id === "truss")!
                  )
                }
              />

              {/* Truss Internal Lattice Grid lines */}
              <g stroke="#94A3B8" strokeWidth="1">
                <line x1="80" y1="240" x2="100" y2="280" />
                <line x1="120" y1="240" x2="140" y2="280" />
                <line x1="160" y1="240" x2="180" y2="280" />
                <line x1="220" y1="230" x2="250" y2="250" />
                <line x1="280" y1="190" x2="310" y2="210" />
                <line x1="340" y1="150" x2="370" y2="170" />
                <line x1="400" y1="110" x2="430" y2="130" />
                <line x1="460" y1="70" x2="480" y2="110" />
                <line x1="500" y1="70" x2="520" y2="110" />
              </g>

              {/* Drive System Gear in Upper Machine Space */}
              <g
                className="cursor-pointer"
                onClick={() =>
                  setSelectedComp(
                    ESCALATOR_COMPONENTS.find((c) => c.id === "drive-system")!
                  )
                }
              >
                <circle
                  cx="500"
                  cy="90"
                  r="24"
                  fill="#F1F5F9"
                  stroke={selectedComp.id === "drive-system" ? "#0284C7" : "#0F172A"}
                  strokeWidth={selectedComp.id === "drive-system" ? "3" : "2"}
                />
                <circle cx="500" cy="90" r="10" fill="#0284C7" />
              </g>

              {/* Handrail */}
              <path
                d="M 50,210 L 170,210 L 430,40 L 550,40"
                fill="none"
                stroke={selectedComp.id === "handrail" ? "#0284C7" : "#0F172A"}
                strokeWidth={selectedComp.id === "handrail" ? "6" : "4"}
                strokeLinecap="round"
                className="cursor-pointer transition-all hover:stroke-vertex-blueprint"
                onClick={() =>
                  setSelectedComp(
                    ESCALATOR_COMPONENTS.find((c) => c.id === "handrail")!
                  )
                }
              />

              {/* Glass Balustrade fill */}
              <polygon
                points="50,210 170,210 430,40 550,40 550,70 430,70 170,240 50,240"
                fill="#E0F2FE"
                fillOpacity="0.5"
                stroke="#0284C7"
                strokeOpacity="0.4"
              />

              {/* Steps */}
              <g
                className="cursor-pointer"
                onClick={() =>
                  setSelectedComp(
                    ESCALATOR_COMPONENTS.find((c) => c.id === "steps")!
                  )
                }
              >
                <path
                  d="M 80,240 L 100,240 L 100,230 L 120,230 L 120,220 L 140,220 L 140,210 L 160,210 L 160,200 L 200,180 L 220,170 L 240,160 L 260,150 L 280,140 L 300,130 L 320,120 L 340,110 L 360,100 L 380,90 L 400,80 L 420,70 L 450,70"
                  fill="none"
                  stroke={selectedComp.id === "steps" ? "#0284C7" : "#475569"}
                  strokeWidth={selectedComp.id === "steps" ? "4" : "2.5"}
                />
              </g>

              {/* Comb Plates */}
              <g
                className="cursor-pointer"
                onClick={() =>
                  setSelectedComp(
                    ESCALATOR_COMPONENTS.find((c) => c.id === "comb-plate")!
                  )
                }
              >
                <rect x="70" y="238" width="18" height="6" fill="#D97706" rx="1" />
                <rect x="445" y="68" width="18" height="6" fill="#D97706" rx="1" />
              </g>

              {/* Landing Plates */}
              <g
                className="cursor-pointer"
                onClick={() =>
                  setSelectedComp(
                    ESCALATOR_COMPONENTS.find((c) => c.id === "landing-plates")!
                  )
                }
              >
                <rect x="40" y="240" width="30" height="4" fill="#0F172A" />
                <rect x="465" y="70" width="50" height="4" fill="#0F172A" />
              </g>
            </svg>
          </div>

          {/* Interactive Component Pills */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-vertex-border">
            {ESCALATOR_COMPONENTS.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedComp(item)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                  selectedComp.id === item.id
                    ? "bg-vertex-blueprint text-white border-vertex-blueprint font-bold shadow-sm"
                    : "bg-white text-vertex-secondary border-vertex-borderStrong hover:border-vertex-blueprint"
                }`}
              >
                {isFa ? item.nameFa : item.nameEn}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Technical Details Box */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-vertex-border rounded-xl p-6 shadow-sm relative">
            <div className="flex items-center justify-between pb-3 border-b border-vertex-border">
              <span className="text-xs font-mono font-bold uppercase text-vertex-blueprint">
                {selectedComp.safetyNorm}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                EN 115 PASS
              </span>
            </div>

            <h4 className="text-xl font-black text-vertex-primary mt-3 font-mono">
              {isFa ? selectedComp.nameFa : selectedComp.nameEn}
            </h4>

            <div className="mt-4 space-y-1.5">
              <h5 className="text-xs font-mono uppercase text-vertex-steel font-bold">
                {isFa ? "شرح مکانیکی و کارکرد" : "Engineering Function"}
              </h5>
              <p className="text-sm text-vertex-secondary leading-relaxed font-normal">
                {isFa ? selectedComp.functionFa : selectedComp.functionEn}
              </p>
            </div>

            <div className="mt-5 p-3.5 rounded-lg bg-vertex-elevated border border-vertex-border">
              <span className="text-xs font-mono text-vertex-blueprint font-bold block mb-1">
                {isFa ? "ویژگی متمایز صنعتی" : "Distinctive Engineering Feature"}
              </span>
              <p className="text-xs font-mono text-vertex-primary font-medium">
                {selectedComp.highlight}
              </p>
            </div>
          </div>

          {/* Energy regeneration note */}
          <div className="p-4 rounded-xl bg-vertex-elevated border border-vertex-border text-xs text-vertex-secondary space-y-1.5">
            <div className="flex items-center gap-2 text-vertex-primary font-bold font-mono">
              <Sparkles className="w-4 h-4 text-vertex-blueprint" />
              <span>
                {isFa ? "فناوری ذخیره انرژی Eco-Crawl" : "Eco-Crawl™ Intelligent Idling"}
              </span>
            </div>
            <p className="leading-relaxed text-[11px]">
              {isFa
                ? "هنگامی که هیچ مسافری به مدت ۳۰ ثانیه روی پله‌برقی تردد نکند، رادارهای تشخیص هوشمند سرعت را به ۰.۱ متر بر ثانیه کاهش داده و مصرف انرژی را تا ۶۰٪ به حداقل می‌رسانند."
                : "When passenger flow ceases for over 30 seconds, dual Doppler radars decelerate the drive to 0.1 m/s, curtailing standby power consumption by up to 60% without mechanical wear."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
