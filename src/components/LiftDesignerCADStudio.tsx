"use client";

import React, { useState } from "react";
import { Locale } from "@/lib/dictionary";
import { 
  Cpu, 
  Layers, 
  Ruler, 
  Sliders, 
  FileCode, 
  Check, 
  ShieldCheck, 
  Eye, 
  RotateCcw, 
  Maximize2,
  Box,
  Compass,
  Download,
  Activity,
  Zap,
  Wrench
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LiftDesignerCADStudioProps {
  locale: Locale;
}

export function LiftDesignerCADStudio({ locale }: LiftDesignerCADStudioProps) {
  const isFa = locale === "fa";

  const [activeTab, setActiveTab] = useState<"plan" | "section" | "components">("plan");
  const [activeComponent, setActiveComponent] = useState<"motor" | "governor" | "parachute" | "rails" | "buffer" | "sheave">("motor");
  const [capacity, setCapacity] = useState<number>(800); // kg
  const [speed, setSpeed] = useState<number>(1.6); // m/s
  const [cadTheme, setCadTheme] = useState<"autocad" | "digipara">("autocad");
  const [copiedDxf, setCopiedDxf] = useState<boolean>(false);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showBeams, setShowBeams] = useState<boolean>(true);
  const [showRefuge, setShowRefuge] = useState<boolean>(true);

  // Shaft Dimensions based on ISIRI 6303 / EN 81-20
  const cadSpecs = {
    450: { sw: 1600, sd: 1600, cw: 1000, cd: 1250, op: 800, oh: 3800, pd: 1400, bg: 950, rails: "T75 / T50", ropes: "4 × Ø10mm" },
    630: { sw: 1800, sd: 1800, cw: 1100, cd: 1400, op: 900, oh: 4000, pd: 1500, bg: 1050, rails: "T89 / T70", ropes: "5 × Ø10mm" },
    800: { sw: 1950, sd: 1950, cw: 1350, cd: 1400, op: 900, oh: 4200, pd: 1550, bg: 1250, rails: "T89 / T70", ropes: "5 × Ø10mm" },
    1000: { sw: 2100, sd: 2100, cw: 1400, cd: 1600, op: 1000, oh: 4400, pd: 1650, bg: 1350, rails: "T125 / T75", ropes: "6 × Ø10mm" },
    1275: { sw: 2300, sd: 2300, cw: 1600, cd: 1800, op: 1100, oh: 4600, pd: 1800, bg: 1500, rails: "T125 / T89", ropes: "6 × Ø12mm" },
    1600: { sw: 2500, sd: 2700, cw: 1400, cd: 2400, op: 1300, oh: 4800, pd: 2000, bg: 1400, rails: "T127 / T89", ropes: "7 × Ø12mm" },
  }[capacity as 450 | 630 | 800 | 1000 | 1275 | 1600] || {
    sw: 1950, sd: 1950, cw: 1350, cd: 1400, op: 900, oh: 4200, pd: 1550, bg: 1250, rails: "T89 / T70", ropes: "5 × Ø10mm"
  };

  const copyDxf = () => {
    const dxfText = `0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1027\n0\nENDSEC\n0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n0\nLAYER\n2\nSHAFT_ISIRI_6303\n70\n0\n62\n4\n0\nENDTAB\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n0\nLWPOLYLINE\n8\nSHAFT_WALL\n90\n4\n70\n1\n10\n0.0\n20\n0.0\n10\n${cadSpecs.sw}\n20\n0.0\n10\n${cadSpecs.sw}\n20\n${cadSpecs.sd}\n10\n0.0\n20\n${cadSpecs.sd}\n0\nENDSEC\n0\nEOF`;
    navigator.clipboard.writeText(dxfText);
    setCopiedDxf(true);
    setTimeout(() => setCopiedDxf(false), 2500);
  };

  const isDark = cadTheme === "autocad";

  return (
    <div className="rounded-2xl border border-vertex-border bg-white shadow-card overflow-hidden">
      {/* Studio Header Bar */}
      <div className="bg-slate-950 text-white p-5 sm:p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-vertex-blueprint flex items-center justify-center text-white shadow-sm">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold font-mono text-white">
                VERTEX LIFTDESIGNER™ & AUTOCAD STUDIO
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                ISIRI 6303-1 / EN 81-20
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isFa 
                ? "نقشه‌های مهندسی چاه، آهن‌کشی، ریل‌های T-Section، موتور گیرلس، گاورنر و پاراشوت به سبک DigiPara" 
                : "Professional DigiPara LiftDesigner & AutoCAD hoistway blueprints with structural tolerances"}
            </p>
          </div>
        </div>

        {/* View Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Theme Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setCadTheme("autocad")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-bold transition-all",
                cadTheme === "autocad" ? "bg-slate-800 text-sky-400 shadow-sm" : "text-slate-400 hover:text-white"
              )}
            >
              AutoCAD Dark
            </button>
            <button
              onClick={() => setCadTheme("digipara")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-bold transition-all",
                cadTheme === "digipara" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-white"
              )}
            >
              DigiPara Print
            </button>
          </div>

          {/* DXF Export Button */}
          <button
            onClick={copyDxf}
            className="px-3.5 py-1.5 rounded-xl bg-vertex-blueprint text-white text-xs font-bold hover:bg-vertex-blueprintDark transition-all flex items-center gap-1.5 shadow-sm"
          >
            {copiedDxf ? <Check className="w-3.5 h-3.5" /> : <FileCode className="w-3.5 h-3.5" />}
            <span>{copiedDxf ? (isFa ? "کپی شد!" : "Copied!") : (isFa ? "خروجی DXF / CAD" : "Export DXF")}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Navigation Tabs */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <button
            onClick={() => setActiveTab("plan")}
            className={cn(
              "px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2",
              activeTab === "plan"
                ? "bg-sky-500/20 text-sky-300 border border-sky-400/40"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            )}
          >
            <Layers className="w-4 h-4 text-sky-400" />
            <span>{isFa ? "۱. پلان آهن‌کشی و سازه چاه (Plan DWG)" : "1. Hoistway & Rail Plan DWG"}</span>
          </button>
          <button
            onClick={() => setActiveTab("section")}
            className={cn(
              "px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2",
              activeTab === "section"
                ? "bg-sky-500/20 text-sky-300 border border-sky-400/40"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            )}
          >
            <Ruler className="w-4 h-4 text-sky-400" />
            <span>{isFa ? "۲. برش مقطع طولی چاه و موتورخانه (Section DWG)" : "2. Hoistway Elevation Section"}</span>
          </button>
          <button
            onClick={() => setActiveTab("components")}
            className={cn(
              "px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2",
              activeTab === "components"
                ? "bg-sky-500/20 text-sky-300 border border-sky-400/40"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            )}
          >
            <Wrench className="w-4 h-4 text-sky-400" />
            <span>{isFa ? "۳. آناتومی قطعات (موتور، گاورنر، پاراشوت)" : "3. Subsystems CAD Anatomy"}</span>
          </button>
        </div>

        {/* Capacity Selector */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <span className="text-slate-400 text-[11px]">{isFa ? "ظرفیت:" : "Load:"}</span>
          <select
            value={capacity}
            onChange={(e) => setCapacity(parseInt(e.target.value))}
            className="bg-slate-800 text-white border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono font-bold"
          >
            {[450, 630, 800, 1000, 1275, 1600].map(c => (
              <option key={c} value={c}>{c} kg ({Math.round(c / 75)} {isFa ? "نفره" : "pers"})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Drawing Viewport */}
      <div className={cn(
        "p-6 sm:p-8 min-h-[560px] relative transition-colors duration-200",
        isDark ? "bg-[#09111b] text-slate-200" : "bg-[#f8fafc] text-slate-800"
      )}>
        {/* Layer Controls & Crosshair bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-dashed border-slate-500/30 text-xs font-mono">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showDimensions}
                onChange={(e) => setShowDimensions(e.target.checked)}
                className="accent-sky-500 rounded"
              />
              <span className={isDark ? "text-slate-300" : "text-slate-700"}>
                {isFa ? "خطوط اندازه‌گذاری (Dimensions)" : "Dimensions"}
              </span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showBeams}
                onChange={(e) => setShowBeams(e.target.checked)}
                className="accent-sky-500 rounded"
              />
              <span className={isDark ? "text-slate-300" : "text-slate-700"}>
                {isFa ? "آهن‌کشی و براکت‌ها (Ties/Brackets)" : "Beams & Ties"}
              </span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showRefuge}
                onChange={(e) => setShowRefuge(e.target.checked)}
                className="accent-sky-500 rounded"
              />
              <span className={isDark ? "text-slate-300" : "text-slate-700"}>
                {isFa ? "جان‌پناه ۶۳۰۳ (Refuge Space)" : "Safety Refuge"}
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>SCALE: 1:20 / 1:50</span>
            <span>|</span>
            <span className="text-emerald-400 font-bold">ISIRI 6303-1 VERIFIED</span>
          </div>
        </div>

        {/* ==============================================================
            TAB 1: PLAN VIEW (نمای پلان آهن‌کشی و چاه)
        ============================================================== */}
        {activeTab === "plan" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <svg 
                viewBox="0 0 800 620" 
                className="w-full max-w-3xl h-auto drop-shadow-md select-none font-mono"
              >
                {/* Background CAD Grid */}
                <defs>
                  <pattern id="cadGridSmall" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"} strokeWidth="0.8" />
                  </pattern>
                  <pattern id="cadGridBig" width="100" height="100" patternUnits="userSpaceOnUse">
                    <rect width="100" height="100" fill="url(#cadGridSmall)" />
                    <path d="M 100 0 L 0 0 0 100" fill="none" stroke={isDark ? "rgba(2,132,199,0.12)" : "rgba(2,132,199,0.1)"} strokeWidth="1.2" />
                  </pattern>
                </defs>
                <rect width="800" height="620" fill="url(#cadGridBig)" />

                {/* Outer Concrete Wall / Shaft Outline */}
                <rect 
                  x="120" y="60" width="560" height="500" 
                  fill={isDark ? "rgba(15,23,42,0.6)" : "rgba(241,245,249,0.8)"}
                  stroke={isDark ? "#38bdf8" : "#0284c7"} 
                  strokeWidth="3"
                />

                {/* Steel Column Corners (آهن‌کشی نبشی ۴ گوشه L80x80) */}
                {showBeams && (
                  <g fill={isDark ? "#fbbf24" : "#d97706"}>
                    {/* Top-Left */}
                    <path d="M 120 60 L 140 60 L 140 68 L 128 68 L 128 80 L 120 80 Z" />
                    {/* Top-Right */}
                    <path d="M 680 60 L 660 60 L 660 68 L 672 68 L 672 80 L 680 80 Z" />
                    {/* Bottom-Left */}
                    <path d="M 120 560 L 140 560 L 140 552 L 128 552 L 128 540 L 120 540 Z" />
                    {/* Bottom-Right */}
                    <path d="M 680 560 L 660 560 L 660 552 L 672 552 L 672 540 L 680 540 Z" />
                  </g>
                )}

                {/* Intermediate Steel Ring Beams (کلاف‌کشی ناودانی UNP 14) */}
                {showBeams && (
                  <g stroke={isDark ? "rgba(251,191,36,0.5)" : "rgba(217,119,6,0.6)"} strokeWidth="1.5" strokeDasharray="4,4">
                    <line x1="120" y1="310" x2="680" y2="310" />
                    <line x1="400" y1="60" x2="400" y2="560" />
                  </g>
                )}

                {/* Car Guide Rails (ریل‌های راهنمای کابین T89 / T125 در دو طرف) */}
                {/* Left Rail */}
                <g transform="translate(145, 310)">
                  <path d="M 0 -25 L 8 -25 L 8 -5 L 30 -5 L 30 5 L 8 5 L 8 25 L 0 25 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
                  {showBeams && (
                    <line x1="-25" y1="0" x2="0" y2="0" stroke="#f59e0b" strokeWidth="3" />
                  )}
                  <text x="5" y="-30" fontSize="10" fill={isDark ? "#7dd3fc" : "#0369a1"} textAnchor="middle">CAR RAIL T89</text>
                </g>

                {/* Right Rail */}
                <g transform="translate(655, 310)">
                  <path d="M 0 -25 L -8 -25 L -8 -5 L -30 -5 L -30 5 L -8 5 L -8 25 L 0 25 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
                  {showBeams && (
                    <line x1="25" y1="0" x2="0" y2="0" stroke="#f59e0b" strokeWidth="3" />
                  )}
                  <text x="-5" y="-30" fontSize="10" fill={isDark ? "#7dd3fc" : "#0369a1"} textAnchor="middle">CAR RAIL T89</text>
                </g>

                {/* Counterweight Frame & Rails at Rear (کادر وزنه تعادل و ریل‌های T70 در پشت) */}
                <g transform="translate(400, 100)">
                  {/* CWT Frame Box */}
                  <rect x="-140" y="-18" width="280" height="36" fill={isDark ? "rgba(30,41,59,0.9)" : "#e2e8f0"} stroke="#f97316" strokeWidth="2" rx="3" />
                  {/* CWT Weights filler */}
                  <line x1="-120" y1="0" x2="120" y2="0" stroke="#f97316" strokeWidth="1.5" strokeDasharray="3,3" />
                  <text x="0" y="4" fontSize="11" fill={isDark ? "#fdba74" : "#c2410c"} textAnchor="middle" fontWeight="bold">COUNTERWEIGHT {cadSpecs.bg}kg</text>
                  
                  {/* CWT Rails */}
                  <rect x="-152" y="-10" width="12" height="20" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
                  <rect x="140" y="-10" width="12" height="20" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
                  <text x="-146" y="-15" fontSize="9" fill={isDark ? "#94a3b8" : "#64748b"} textAnchor="middle">CWT RAIL</text>
                  <text x="146" y="-15" fontSize="9" fill={isDark ? "#94a3b8" : "#64748b"} textAnchor="middle">CWT RAIL</text>
                </g>

                {/* Elevator Car Body (کابین آسانسور) */}
                <rect 
                  x="210" y="160" width="380" height="340" 
                  fill={isDark ? "rgba(2,132,199,0.12)" : "rgba(2,132,199,0.06)"} 
                  stroke={isDark ? "#f8fafc" : "#0f172a"} 
                  strokeWidth="2.5" 
                  rx="4"
                />

                {/* Car Sling / Yoke Lines (یوک و ستون‌های کابین) */}
                <line x1="210" y1="310" x2="590" y2="310" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5,3" />
                <rect x="195" y="302" width="15" height="16" fill="#38bdf8" rx="2" />
                <rect x="590" y="302" width="15" height="16" fill="#38bdf8" rx="2" />

                {/* Safety Refuge Area inside Car Top (جان‌پناه طبق ۶۳۰۳) */}
                {showRefuge && (
                  <rect 
                    x="240" y="220" width="120" height="100" 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="2" 
                    strokeDasharray="4,4"
                  />
                )}
                {showRefuge && (
                  <text x="300" y="275" fontSize="10" fill="#10b981" textAnchor="middle" fontWeight="bold">REFUGE CUBE</text>
                )}

                {/* Entrance Door Opening (درب تلسکوپی / سانترال ورودی چاه) */}
                <g transform="translate(400, 500)">
                  {/* Clear Opening Gap */}
                  <rect x="-120" y="-8" width="240" height="16" fill={isDark ? "#09111b" : "#ffffff"} stroke="#3b82f6" strokeWidth="2" />
                  {/* Sliding Leaves */}
                  <line x1="-115" y1="0" x2="-10" y2="0" stroke="#3b82f6" strokeWidth="4" />
                  <line x1="10" y1="0" x2="115" y2="0" stroke="#3b82f6" strokeWidth="4" />
                  <text x="0" y="-14" fontSize="11" fill="#3b82f6" textAnchor="middle" fontWeight="bold">CLEAR OPENING OP = {cadSpecs.op} mm</text>
                </g>

                {/* Dimension Callouts (خطوط اندازه‌گذاری استاندارد اتوکد) */}
                {showDimensions && (
                  <g stroke={isDark ? "#38bdf8" : "#0284c7"} strokeWidth="1.2" fill={isDark ? "#38bdf8" : "#0284c7"}>
                    {/* Width SW Top */}
                    <line x1="120" y1="35" x2="680" y2="35" />
                    <line x1="120" y1="25" x2="120" y2="45" />
                    <line x1="680" y1="25" x2="680" y2="45" />
                    <text x="400" y="30" fontSize="11" textAnchor="middle" fontWeight="bold">SHAFT WIDTH (SW) = {cadSpecs.sw} mm</text>

                    {/* Depth SD Right */}
                    <line x1="715" y1="60" x2="715" y2="560" />
                    <line x1="705" y1="60" x2="725" y2="60" />
                    <line x1="705" y1="560" x2="725" y2="560" />
                    <text x="735" y="315" fontSize="11" textAnchor="middle" transform="rotate(90, 735, 315)" fontWeight="bold">SHAFT DEPTH (SD) = {cadSpecs.sd} mm</text>

                    {/* Cabin Width CW */}
                    <line x1="210" y1="135" x2="590" y2="135" strokeDasharray="3,3" />
                    <text x="400" y="130" fontSize="10" textAnchor="middle">CAR WIDTH (CW) = {cadSpecs.cw} mm</text>

                    {/* Cabin Depth CD Left */}
                    <line x1="85" y1="160" x2="85" y2="500" />
                    <line x1="75" y1="160" x2="95" y2="160" />
                    <line x1="75" y1="500" x2="95" y2="500" />
                    <text x="70" y="330" fontSize="10" textAnchor="middle" transform="rotate(-90, 70, 330)">CAR DEPTH (CD) = {cadSpecs.cd} mm</text>
                  </g>
                )}
              </svg>
            </div>

            {/* Technical Plan Callouts Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className={cn("p-3 rounded-xl border", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
                <span className="text-slate-400 block">{isFa ? "ابعاد چاه مفید (SW×SD):" : "Clear Hoistway:"}</span>
                <span className="text-sm font-bold text-sky-400 mt-1 block">{cadSpecs.sw} × {cadSpecs.sd} mm</span>
              </div>
              <div className={cn("p-3 rounded-xl border", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
                <span className="text-slate-400 block">{isFa ? "ابعاد مفید کابین (CW×CD):" : "Car Platform:"}</span>
                <span className="text-sm font-bold text-emerald-400 mt-1 block">{cadSpecs.cw} × {cadSpecs.cd} mm</span>
              </div>
              <div className={cn("p-3 rounded-xl border", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
                <span className="text-slate-400 block">{isFa ? "مقاطع ریل (کابین/وزنه):" : "Guide Rails Profile:"}</span>
                <span className="text-sm font-bold text-amber-400 mt-1 block">{cadSpecs.rails}</span>
              </div>
              <div className={cn("p-3 rounded-xl border", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
                <span className="text-slate-400 block">{isFa ? "سیم‌بکسل‌های تعلیق:" : "Suspension Ropes:"}</span>
                <span className="text-sm font-bold text-purple-400 mt-1 block">{cadSpecs.ropes}</span>
              </div>
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB 2: SECTION VIEW (برش مقطع طولی چاه و موتورخانه)
        ============================================================== */}
        {activeTab === "section" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <svg 
                viewBox="0 0 850 640" 
                className="w-full max-w-3xl h-auto drop-shadow-md select-none font-mono"
              >
                {/* Background CAD Grid */}
                <rect width="850" height="640" fill={isDark ? "#09111b" : "#f8fafc"} />

                {/* Hoistway Walls (دیوارهای بتنی چاه) */}
                <rect x="220" y="40" width="410" height="560" fill="none" stroke={isDark ? "#38bdf8" : "#0284c7"} strokeWidth="2.5" />
                <line x1="160" y1="40" x2="690" y2="40" stroke={isDark ? "#475569" : "#94a3b8"} strokeWidth="4" />
                <line x1="160" y1="600" x2="690" y2="600" stroke={isDark ? "#475569" : "#94a3b8"} strokeWidth="4" />

                {/* Machine Room Bedplate & Gearless PMSM Motor (موتورخانه / موتور گیرلس بالا) */}
                <g transform="translate(425, 80)">
                  {/* Steel Bedplate with Anti-Vibration Pads */}
                  <rect x="-140" y="-8" width="280" height="16" fill={isDark ? "#1e293b" : "#cbd5e1"} stroke="#64748b" strokeWidth="1.5" />
                  <rect x="-120" y="8" width="25" height="10" fill="#10b981" />
                  <rect x="95" y="8" width="25" height="10" fill="#10b981" />
                  
                  {/* PMSM Gearless Motor Body */}
                  <circle cx="-30" cy="-35" r="40" fill={isDark ? "#0f172a" : "#1e293b"} stroke="#38bdf8" strokeWidth="2.5" />
                  {/* Traction Sheave with Grooves */}
                  <circle cx="-30" cy="-35" r="30" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="4,2" />
                  {/* Double Disk Brake Caliper */}
                  <rect x="-45" y="-85" width="30" height="15" fill="#ef4444" rx="2" />
                  <text x="-30" y="-90" fontSize="9" fill="#ef4444" textAnchor="middle" fontWeight="bold">DISK BRAKE</text>

                  {/* Deflector / Diverter Sheave (فلکه هرزگرد) */}
                  <circle cx="100" cy="-15" r="22" fill={isDark ? "#0f172a" : "#cbd5e1"} stroke="#f97316" strokeWidth="2" />
                  <text x="-30" y="-32" fontSize="10" fill="#ffffff" textAnchor="middle" fontWeight="bold">PMSM</text>
                  <text x="100" y="-12" fontSize="9" fill={isDark ? "#ffffff" : "#0f172a"} textAnchor="middle">DEFLECTOR</text>
                </g>

                {/* Overspeed Governor at Top (گاورنر سرعت بالای چاه) */}
                <g transform="translate(260, 65)">
                  <circle cx="0" cy="0" r="18" fill="none" stroke="#eab308" strokeWidth="2" />
                  <circle cx="0" cy="0" r="4" fill="#eab308" />
                  <text x="0" y="-22" fontSize="9" fill="#eab308" textAnchor="middle" fontWeight="bold">GOVERNOR EN 81</text>
                  {/* Governor Rope down to pit */}
                  <line x1="-18" y1="0" x2="-18" y2="480" stroke="#eab308" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="18" y1="0" x2="18" y2="480" stroke="#eab308" strokeWidth="1" strokeDasharray="3,3" />
                </g>

                {/* Suspension Wire Ropes (سیم‌بکسل‌های کششی) */}
                <line x1="395" y1="45" x2="395" y2="240" stroke="#f97316" strokeWidth="2.5" />
                <line x1="525" y1="65" x2="525" y2="340" stroke="#f97316" strokeWidth="2.5" />

                {/* Elevator Car & Sling (کابین، یوک و پاراشوت در تراز میانی) */}
                <g transform="translate(395, 240)">
                  {/* Car Sling Upper Beam */}
                  <rect x="-95" y="0" width="190" height="12" fill="#38bdf8" />
                  {/* Upright Beams */}
                  <rect x="-95" y="12" width="10" height="170" fill="#38bdf8" />
                  <rect x="85" y="12" width="10" height="170" fill="#38bdf8" />
                  {/* Lower Safety Plank & Progressive Safety Gear (پاراشوت زیر کابین) */}
                  <rect x="-105" y="182" width="210" height="18" fill="#ef4444" rx="2" />
                  <text x="0" y="195" fontSize="10" fill="#ffffff" textAnchor="middle" fontWeight="bold">SAFETY GEAR (پاراشوت ۶۳۰۳)</text>

                  {/* Cabin Enclosure Body */}
                  <rect x="-85" y="12" width="170" height="170" fill={isDark ? "rgba(2,132,199,0.15)" : "#ffffff"} stroke={isDark ? "#f8fafc" : "#0f172a"} strokeWidth="2" />
                  <text x="0" y="100" fontSize="12" fill={isDark ? "#ffffff" : "#0f172a"} textAnchor="middle" fontWeight="bold">CAR {capacity} KG</text>

                  {/* Car Top Refuge Space (فضای جان‌پناه سقف کابین) */}
                  {showRefuge && (
                    <rect x="-40" y="-55" width="80" height="55" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,3" />
                  )}
                  {showRefuge && (
                    <text x="0" y="-25" fontSize="9" fill="#10b981" textAnchor="middle" fontWeight="bold">REFUGE CUBE</text>
                  )}
                </g>

                {/* Counterweight Frame in Background (وزنه تعادل در سمت راست) */}
                <g transform="translate(525, 340)">
                  <rect x="-35" y="0" width="70" height="150" fill={isDark ? "#1e293b" : "#e2e8f0"} stroke="#f97316" strokeWidth="2" rx="2" />
                  <text x="0" y="75" fontSize="9" fill={isDark ? "#fdba74" : "#c2410c"} textAnchor="middle" fontWeight="bold">CWT FRAME</text>
                </g>

                {/* Pit Buffers & Governor Tension Pulley (چاهک، ضربه‌گیرها و فلکه ته‌چاهی گاورنر) */}
                <g transform="translate(425, 540)">
                  {/* Pit Floor */}
                  <line x1="-205" y1="60" x2="205" y2="60" stroke="#64748b" strokeWidth="3" />

                  {/* Car Hydraulic Buffers */}
                  <rect x="-70" y="20" width="25" height="40" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
                  <rect x="-10" y="20" width="25" height="40" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
                  <text x="-25" y="12" fontSize="9" fill="#eab308" textAnchor="middle">CAR BUFFERS</text>

                  {/* CWT Buffer */}
                  <rect x="85" y="20" width="25" height="40" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
                  <text x="97" y="12" fontSize="9" fill="#eab308" textAnchor="middle">CWT BUF</text>

                  {/* Pit Refuge Space (جان‌پناه کف چاهک طبق استاندارد ۶۳۰۳) */}
                  {showRefuge && (
                    <rect x="-180" y="0" width="60" height="60" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,3" />
                  )}
                  {showRefuge && (
                    <text x="-150" y="35" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="bold">PIT REFUGE</text>
                  )}
                </g>

                {/* Section Dimensions (بالاسری OH و عمق چاهک PD) */}
                {showDimensions && (
                  <g stroke={isDark ? "#38bdf8" : "#0284c7"} strokeWidth="1.2" fill={isDark ? "#38bdf8" : "#0284c7"}>
                    {/* Overhead OH Top */}
                    <line x1="655" y1="40" x2="655" y2="240" />
                    <line x1="645" y1="40" x2="665" y2="40" />
                    <line x1="645" y1="240" x2="665" y2="240" />
                    <text x="675" y="140" fontSize="10" textAnchor="middle" transform="rotate(90, 675, 140)" fontWeight="bold">OVERHEAD (OH) = {cadSpecs.oh} mm</text>

                    {/* Pit Depth PD Bottom */}
                    <line x1="655" y1="480" x2="655" y2="600" />
                    <line x1="645" y1="480" x2="665" y2="480" />
                    <line x1="645" y1="600" x2="665" y2="600" />
                    <text x="675" y="540" fontSize="10" textAnchor="middle" transform="rotate(90, 675, 540)" fontWeight="bold">PIT DEPTH (PD) = {cadSpecs.pd} mm</text>
                  </g>
                )}
              </svg>
            </div>

            {/* Elevation Specs Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className={cn("p-3 rounded-xl border", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
                <span className="text-slate-400 block">{isFa ? "حداقل ارتفاع بالاسری (Overhead):" : "Minimum Overhead Clearance:"}</span>
                <span className="text-sm font-bold text-sky-400 mt-1 block">{cadSpecs.oh} mm</span>
                <span className="text-[10px] text-slate-500">{isFa ? "الزام استاندارد ۶۳۰۳ در سرعت نامی" : "ISIRI 6303 Code Requirement"}</span>
              </div>
              <div className={cn("p-3 rounded-xl border", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
                <span className="text-slate-400 block">{isFa ? "حداقل عمق چاهک (Pit Depth):" : "Minimum Pit Depth (PD):"}</span>
                <span className="text-sm font-bold text-amber-400 mt-1 block">{cadSpecs.pd} mm</span>
                <span className="text-[10px] text-slate-500">{isFa ? "فضای ضربه‌گیرها و جان‌پناه کف" : "Buffer stroke & technician crawlway"}</span>
              </div>
              <div className={cn("p-3 rounded-xl border", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
                <span className="text-slate-400 block">{isFa ? "استاندارد ایمنی ترمز پاراشوت:" : "Safety Gear Deceleration:"}</span>
                <span className="text-sm font-bold text-emerald-400 mt-1 block">0.2g – 1.0g</span>
                <span className="text-[10px] text-slate-500">{isFa ? "ترمز تدریجی مجاز ISIRI 6303-1" : "Progressive clamping per EN 81-20"}</span>
              </div>
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB 3: MECHANICAL SUBSYSTEMS CAD (آناتومی تفکیکی قطعات)
        ============================================================== */}
        {activeTab === "components" && (
          <div className="space-y-6">
            {/* Component Selector Pills */}
            <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-700/40">
              {[
                { id: "motor", labelFa: "موتور گیرلس سنکرون (PMSM)", labelEn: "PMSM Gearless Motor" },
                { id: "governor", labelFa: "گاورنر سرعت و فلکه پاندولی", labelEn: "Overspeed Governor" },
                { id: "parachute", labelFa: "ترمز ایمنی پاراشوت تدریجی", labelEn: "Progressive Safety Gear" },
                { id: "rails", labelFa: "مقاطع ریل ISO 7465 (T89/T125)", labelEn: "T-Section Guide Rails" },
                { id: "sheave", labelFa: "فلکه اصلی و هرزگرد (شیار V)", labelEn: "Traction & Deflector Sheaves" },
                { id: "buffer", labelFa: "ضربه‌گیر هیدرولیک چاهک", labelEn: "Hydraulic Oil Buffer" },
              ].map(comp => (
                <button
                  key={comp.id}
                  onClick={() => setActiveComponent(comp.id as any)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all",
                    activeComponent === comp.id
                      ? "bg-sky-500 text-white shadow-sm"
                      : isDark ? "bg-slate-800 text-slate-300 hover:text-white" : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                  )}
                >
                  {isFa ? comp.labelFa : comp.labelEn}
                </button>
              ))}
            </div>

            {/* Component Blueprint Details */}
            <div className={cn(
              "p-6 rounded-2xl border",
              isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            )}>
              {activeComponent === "motor" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-sky-400 font-mono">
                      {isFa ? "موتور محرکه سنکرون آهنربای دائم بدون گیربکس (PMSM Gearless)" : "PMSM Permanent Magnet Synchronous Gearless Machine"}
                    </h4>
                    <span className="text-xs font-mono text-emerald-400 font-bold">ISIRI 6303 / EN 81-20</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isFa 
                      ? "موتورهای نسل نوین ورتکس بدون نیاز به روغن‌کاری واسط گیربکس، با راندمان مکانیکی ۹۴٪، لرزه‌گیرهای آکوستیک و ترمز دوبل دیسکی با سیستم تحریک مستقل فنر فشرده (Fail-Safe Spring Applied)." 
                      : "Direct drive synchronous motor with 94% efficiency, zero gearoil maintenance, and dual redundant disc brakes."}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-2">
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "تراز مصرف انرژی:" : "Energy Class:"}</span>
                      <span className="text-emerald-400 font-bold text-sm">ISO 25745 A+++</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "سیستم ترمز اضطراری:" : "Emergency Brake:"}</span>
                      <span className="text-white font-bold text-sm">Dual Caliper Disc</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "کلاس عایق‌بندی:" : "Insulation Class:"}</span>
                      <span className="text-sky-400 font-bold text-sm">Class F (155°C)</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "درجه حفاظت صنعتی:" : "Protection Rating:"}</span>
                      <span className="text-amber-400 font-bold text-sm">IP41 / IP54</span>
                    </div>
                  </div>
                </div>
              )}

              {activeComponent === "governor" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-amber-400 font-mono">
                      {isFa ? "گاورنر سرعت مجاز پاندولی دوجهته (Bi-Directional Overspeed Governor)" : "Bi-Directional Overspeed Governor System"}
                    </h4>
                    <span className="text-xs font-mono text-emerald-400 font-bold">بند ۹-۹ استاندارد ۶۳۰۳</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isFa 
                      ? "کنترل سرعت کابین در دو جهت بالا و پایین؛ در صورت تجاوز سرعت از ۱۱۵٪ سرعت نامی، ابتدا کنتاکت برقی مدار ایمنی را قطع کرده و در صورت ادامه افزایش سرعت، فک مکانیکی سیم‌بکسل گاورنر را قفل و پاراشوت را درگیر می‌نماید." 
                      : "Triggers electrical safety circuit at 115% rated speed and mechanically clamps governor rope to activate car safety gear."}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-2">
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "سرعت تحریک الکتریکی:" : "Electrical Trip:"}</span>
                      <span className="text-amber-400 font-bold text-sm">1.15 × V_rated</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "قطر سیم‌بکسل گاورنر:" : "Rope Diameter:"}</span>
                      <span className="text-white font-bold text-sm">Ø6.5 mm / Ø8 mm</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "قطر فلکه گاورنر:" : "Sheave Diameter:"}</span>
                      <span className="text-sky-400 font-bold text-sm">D = 200 – 300 mm</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "وزنه کشش ته‌چاهی:" : "Tension Weight:"}</span>
                      <span className="text-emerald-400 font-bold text-sm">Cast Iron 25 kg</span>
                    </div>
                  </div>
                </div>
              )}

              {activeComponent === "parachute" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-red-400 font-mono">
                      {isFa ? "ترمز ایمنی پاراشوت تدریجی (Progressive Safety Gear)" : "Progressive Safety Gear Brake Assembly"}
                    </h4>
                    <span className="text-xs font-mono text-emerald-400 font-bold">بند ۹-۸ استاندارد ۶۳۰۳</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isFa 
                      ? "نصب شده در زیر تیر ایمنی (Safety Plank) یوک کابین. مجهز به لنت‌های گوه‌ای و رولری فولادی آلیاژی سخت‌کاری‌شده که با گرفتن تیغه ریل، کابین را با شتاب شتاب منفی کنترل‌شده بین 0.2g تا 1.0g متوقف می‌سازد." 
                      : "Mounted on lower car sling plank with alloy steel wedges stopping the fully loaded car smoothly between 0.2g and 1.0g."}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-2">
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "نوع ترمز:" : "Braking Type:"}</span>
                      <span className="text-red-400 font-bold text-sm">Progressive (تدریجی)</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "بیشینه جرم کل (P+Q):" : "Max Total Mass:"}</span>
                      <span className="text-white font-bold text-sm">Up to 4,500 kg</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "ضخامت تیغه ریل:" : "Blade Thickness:"}</span>
                      <span className="text-sky-400 font-bold text-sm">9 mm / 16 mm</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "میکروسوئیچ ایمنی:" : "Safety Switch:"}</span>
                      <span className="text-emerald-400 font-bold text-sm">IP67 Bimodal Contact</span>
                    </div>
                  </div>
                </div>
              )}

              {activeComponent === "rails" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-sky-400 font-mono">
                      {isFa ? "ریل‌های راهنمای نورد سرد و ماشین‌کاری شده (ISO 7465)" : "Machined & Cold-Drawn Guide Rails (ISO 7465)"}
                    </h4>
                    <span className="text-xs font-mono text-emerald-400 font-bold">استاندارد ملی ISIRI 6303</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isFa 
                      ? "مقاطع فولادی T شکل با استاندارد بین‌المللی ISO 7465 و استاندارد ملی ایران. مقاطع T70/A و T89/B و T125/B با اتصال فاق و زبانه (Tongue & Groove) و صفحات اتصال ماهیچه‌ای (Fishplates) با پیچ‌های گرید ۸.۸." 
                      : "Precision cold-drawn and machined T-section rails (T70, T89, T125) with tongue-and-groove joints and reinforced fishplates."}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-2">
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "عرض بال ریل T89:" : "T89 Base Width:"}</span>
                      <span className="text-sky-400 font-bold text-sm">b = 89 mm</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "ارتفاع جان ریل T89:" : "T89 Height:"}</span>
                      <span className="text-white font-bold text-sm">h = 62 mm</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "ضخامت تیغه k:" : "Blade Width k:"}</span>
                      <span className="text-amber-400 font-bold text-sm">k = 16 mm</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "فاصله استاندارد براکت‌ها:" : "Bracket Span:"}</span>
                      <span className="text-emerald-400 font-bold text-sm">≤ 2500 mm</span>
                    </div>
                  </div>
                </div>
              )}

              {activeComponent === "sheave" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-purple-400 font-mono">
                      {isFa ? "فلکه کشش اصلی و هرزگرد چدنی (Traction & Deflector Sheaves)" : "Traction & Deflector Sheave Engineering"}
                    </h4>
                    <span className="text-xs font-mono text-emerald-400 font-bold">استاندارد ۶۳۰۳ / EN 81-50</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isFa 
                      ? "ساخته‌شده از چدن نشکن گرافیت کروی (Ductile Iron GGG-50 / GGG-70) با شیارهای سخت‌کاری‌شده تا سختی ۴۸ تا ۵۲ راکول C، نسبت قطر فلکه به قطر سیم‌بکسل D/d ≥ 40 طبق الزام صریح استاندارد ملی ۶۳۰۳." 
                      : "Ductile cast iron sheaves with hardened V-grooves and undercuts ensuring D/d ≥ 40 ratio per ISIRI 6303 regulations."}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-2">
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "نسبت قطر فلکه به بکسل:" : "D/d Ratio:"}</span>
                      <span className="text-emerald-400 font-bold text-sm">D/d ≥ 40 (الزامی)</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "پروفیل شیار فلکه:" : "Groove Profile:"}</span>
                      <span className="text-white font-bold text-sm">V-Groove with Undercut</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "سختی شیارها:" : "Surface Hardness:"}</span>
                      <span className="text-purple-400 font-bold text-sm">50 – 54 HRC</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "متریال ریخته‌گری:" : "Material Cast:"}</span>
                      <span className="text-sky-400 font-bold text-sm">Ductile GGG-70</span>
                    </div>
                  </div>
                </div>
              )}

              {activeComponent === "buffer" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-amber-400 font-mono">
                      {isFa ? "ضربه‌گیرهای هیدرولیک اتلاف انرژی کف چاهک (Hydraulic Oil Buffers)" : "Hydraulic Dissipation Energy Oil Buffers"}
                    </h4>
                    <span className="text-xs font-mono text-emerald-400 font-bold">بند ۱۰-۳ استاندارد ۶۳۰۳</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isFa 
                      ? "مستقر در کف چاهک در زیر کابین و وزنه تعادل. برای سرعت‌های بیش از ۱ متر بر ثانیه، ضربه‌گیر هیدرولیکی الزامی بوده و کورس مفید آن باید حداقل Sb = 0.0674 × v² متر باشد با کنتاکت الکتریکی تایید بازگشت پیستون." 
                      : "Energy dissipation hydraulic oil buffers required for speeds exceeding 1.0 m/s with return switch compliance."}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-2">
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "کورس مفید ضربه‌گیر:" : "Stroke (Sb):"}</span>
                      <span className="text-amber-400 font-bold text-sm">Sb = v² / (2g × 0.8)</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "روغن هیدرولیک بافر:" : "Hydraulic Fluid:"}</span>
                      <span className="text-white font-bold text-sm">ISO VG 46 Anti-Wear</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "شتاب منفی برخورد:" : "Max Deceleration:"}</span>
                      <span className="text-emerald-400 font-bold text-sm">Average ≤ 1.0 g</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "کنتاکت نظارت بر پیستون:" : "Safety Switch:"}</span>
                      <span className="text-sky-400 font-bold text-sm">Normally Closed Contact</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
