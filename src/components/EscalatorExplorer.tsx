"use client";

import React, { useState } from "react";
import { Locale } from "@/lib/dictionary";
import { ESCALATOR_COMPONENTS, EscalatorComponent } from "@/lib/constants";
import { TechBadge } from "./TechBadge";
import { Shield, Sparkles, Activity, CheckCircle, ArrowRight } from "lucide-react";

interface EscalatorExplorerProps {
  locale: Locale;
}

export function EscalatorExplorer({ locale }: EscalatorExplorerProps) {
  const isFa = locale === "fa";
  const [selectedComp, setSelectedComp] = useState<EscalatorComponent>(
    ESCALATOR_COMPONENTS[0]
  );

  return (
    <div className="w-full bg-vertex-surface/80 border border-vertex-border rounded-2xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-vertex-border gap-4">
        <div>
          <TechBadge variant="cyan">
            {isFa ? "کاوشگر پله‌برقی و پیاده‌رو متحرک" : "ESCALATOR ARCHITECTURE"}
          </TechBadge>
          <h3 className="text-2xl lg:text-3xl font-extrabold text-vertex-ice mt-2 font-mono">
            {isFa ? "مهندسی سازه و ایمنی پله‌برقی (EN 115)" : "Escalator Cutaway & Subsystems"}
          </h3>
          <p className="text-sm text-vertex-steel mt-1 max-w-xl font-light">
            {isFa
              ? "اجزای اصلی سازه خرپا، پله‌های آلومینیومی، سیستم محرک و شانه ایمنی را با کلیک روی هر بخش بررسی کنید."
              : "Explore the structural truss, aluminum step chain, planetary drive, and comb safety sensors."}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-vertex-cyan bg-vertex-deep px-3 py-1.5 rounded-lg border border-vertex-border">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>{isFa ? "استاندارد مرجع: EN 115-1:2017" : "Reference Standard: EN 115-1:2017"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
        {/* Left Column: Interactive Visual Escalator Section Cutaway */}
        <div className="lg:col-span-7 bg-vertex-deep border border-vertex-border rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />

          {/* SVG Cutaway Representation */}
          <div className="relative w-full aspect-[16/9] min-h-[260px] flex items-center justify-center p-2">
            <svg
              viewBox="0 0 600 320"
              className="w-full h-full drop-shadow-xl select-none"
            >
              {/* Truss Framework (Diagonal outline) */}
              <polygon
                points="40,240 180,240 440,70 560,70 560,110 440,110 200,280 40,280"
                fill="#152230"
                stroke={selectedComp.id === "truss" ? "#00C2B8" : "#233547"}
                strokeWidth={selectedComp.id === "truss" ? "3" : "1.5"}
                className="cursor-pointer transition-all hover:stroke-vertex-cyan/70"
                onClick={() =>
                  setSelectedComp(
                    ESCALATOR_COMPONENTS.find((c) => c.id === "truss")!
                  )
                }
              />

              {/* Truss Internal Lattice Grid lines */}
              <g stroke="#3A4D60" strokeWidth="1" opacity="0.6">
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
                  fill="#1C2B3C"
                  stroke={selectedComp.id === "drive-system" ? "#00C2B8" : "#4A5568"}
                  strokeWidth={selectedComp.id === "drive-system" ? "3" : "1.5"}
                />
                <circle cx="500" cy="90" r="10" fill="#00C2B8" opacity="0.8" />
              </g>

              {/* Handrail (Curved path along top) */}
              <path
                d="M 50,210 L 170,210 L 430,40 L 550,40"
                fill="none"
                stroke={selectedComp.id === "handrail" ? "#00C2B8" : "#A9B7C4"}
                strokeWidth={selectedComp.id === "handrail" ? "6" : "4"}
                strokeLinecap="round"
                className="cursor-pointer transition-all hover:stroke-vertex-cyan"
                onClick={() =>
                  setSelectedComp(
                    ESCALATOR_COMPONENTS.find((c) => c.id === "handrail")!
                  )
                }
              />

              {/* Glass Balustrade fill */}
              <polygon
                points="50,210 170,210 430,40 550,40 550,70 430,70 170,240 50,240"
                fill="#00C2B8"
                fillOpacity="0.08"
                stroke="#00C2B8"
                strokeOpacity="0.2"
              />

              {/* Steps (Series of stepped lines) */}
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
                  stroke={selectedComp.id === "steps" ? "#00C2B8" : "#E2E8F0"}
                  strokeWidth={selectedComp.id === "steps" ? "4" : "2"}
                />
              </g>

              {/* Lower Comb Plate */}
              <g
                className="cursor-pointer"
                onClick={() =>
                  setSelectedComp(
                    ESCALATOR_COMPONENTS.find((c) => c.id === "comb-plate")!
                  )
                }
              >
                <rect
                  x="70"
                  y="238"
                  width="18"
                  height="6"
                  fill={selectedComp.id === "comb-plate" ? "#00C2B8" : "#F59E0B"}
                  rx="1"
                />
              </g>

              {/* Upper Comb Plate */}
              <g
                className="cursor-pointer"
                onClick={() =>
                  setSelectedComp(
                    ESCALATOR_COMPONENTS.find((c) => c.id === "comb-plate")!
                  )
                }
              >
                <rect
                  x="445"
                  y="68"
                  width="18"
                  height="6"
                  fill={selectedComp.id === "comb-plate" ? "#00C2B8" : "#F59E0B"}
                  rx="1"
                />
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
                <rect
                  x="40"
                  y="240"
                  width="30"
                  height="4"
                  fill={selectedComp.id === "landing-plates" ? "#00C2B8" : "#A9B7C4"}
                />
                <rect
                  x="465"
                  y="70"
                  width="50"
                  height="4"
                  fill={selectedComp.id === "landing-plates" ? "#00C2B8" : "#A9B7C4"}
                />
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
                    ? "bg-vertex-cyan text-vertex-deep border-vertex-cyan font-bold shadow-cyan"
                    : "bg-vertex-surface/60 text-vertex-steel border-vertex-border hover:border-vertex-cyan/40 hover:text-vertex-ice"
                }`}
              >
                {isFa ? item.nameFa : item.nameEn}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Technical Details Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-vertex-deep/90 border border-vertex-border rounded-xl p-6 shadow-xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-vertex-border">
              <span className="text-xs font-mono uppercase text-vertex-cyan tracking-wider">
                {selectedComp.safetyNorm}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                <CheckCircle className="w-3.5 h-3.5" />
                VERIFIED
              </span>
            </div>

            <h4 className="text-xl font-bold text-vertex-ice mt-3 font-mono">
              {isFa ? selectedComp.nameFa : selectedComp.nameEn}
            </h4>

            <div className="mt-4 space-y-2">
              <h5 className="text-xs font-mono uppercase text-vertex-steel font-semibold">
                {isFa ? "شرح مکانیکی و کارکرد" : "Engineering Function"}
              </h5>
              <p className="text-sm text-vertex-steel/90 leading-relaxed font-light">
                {isFa ? selectedComp.functionFa : selectedComp.functionEn}
              </p>
            </div>

            <div className="mt-5 p-3.5 rounded-lg bg-vertex-surface/70 border border-vertex-border">
              <span className="text-xs font-mono text-vertex-cyan font-semibold block mb-1">
                {isFa ? "ویژگی متمایز صنعتی" : "Distinctive Engineering Feature"}
              </span>
              <p className="text-xs font-mono text-vertex-ice">
                {selectedComp.highlight}
              </p>
            </div>
          </div>

          {/* Energy regeneration note */}
          <div className="p-4 rounded-xl bg-vertex-surface/40 border border-vertex-border text-xs text-vertex-steel space-y-2">
            <div className="flex items-center gap-2 text-vertex-ice font-bold font-mono">
              <Sparkles className="w-4 h-4 text-vertex-cyan" />
              <span>
                {isFa
                  ? "فناوری ذخیره انرژی Eco-Crawl"
                  : "Eco-Crawl™ Intelligent Idling"}
              </span>
            </div>
            <p className="leading-relaxed">
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
