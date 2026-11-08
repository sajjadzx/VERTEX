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
  Wrench,
  Settings,
  Sparkles,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LiftDesignerCADStudioProps {
  locale: Locale;
}

export function LiftDesignerCADStudio({ locale }: LiftDesignerCADStudioProps) {
  const isFa = locale === "fa";

  // Navigation & Mode States
  const [activeTab, setActiveTab] = useState<"plan" | "section" | "components">("plan");
  const [activeComponent, setActiveComponent] = useState<"ziehl_motor" | "wittur_motor" | "governor" | "door_cam" | "shoe" | "parachute" | "rails" | "buffer">("ziehl_motor");
  const [cadTheme, setCadTheme] = useState<"autocad" | "ziehl" | "digipara">("autocad");
  const [isCustomDimensions, setIsCustomDimensions] = useState<boolean>(true);
  const [copiedDxf, setCopiedDxf] = useState<boolean>(false);
  const [downloadedDxf, setDownloadedDxf] = useState<boolean>(false);

  // Layer Toggles
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showBeams, setShowBeams] = useState<boolean>(true);
  const [showRefuge, setShowRefuge] = useState<boolean>(true);
  const [showCwt, setShowCwt] = useState<boolean>(true);

  // Dynamic Sizing & Parametric Variables (in mm, kg, m/s)
  const [capacity, setCapacity] = useState<number>(1000); // 450, 630, 800, 1000, 1275, 1600, 2000
  const [speed, setSpeed] = useState<number>(2.0); // m/s (1.0 to 4.0)
  const [sw, setSw] = useState<number>(2100); // Shaft Width mm (1400 to 3200)
  const [sd, setSd] = useState<number>(2100); // Shaft Depth mm (1400 to 3400)
  const [cw, setCw] = useState<number>(1400); // Car Width mm (900 to 2400)
  const [cd, setCd] = useState<number>(1600); // Car Depth mm (900 to 2400)
  const [ch, setCh] = useState<number>(2300); // Car Height mm (2100 to 2800)
  const [op, setOp] = useState<number>(1000); // Clear Opening mm (700 to 1600)
  const [doorType, setDoorType] = useState<"2P-TEL" | "2P-CEN" | "3P-TEL" | "4P-CEN" | "HINGED">("2P-TEL");
  const [sheaveDia, setSheaveDia] = useState<number>(400); // mm (320, 400, 480, 520) - 400 matches Ziehl-Abegg SM200.40C
  const [suspension, setSuspension] = useState<"1:1" | "2:1">("2:1");
  const [railType, setRailType] = useState<"T70" | "T89" | "T125" | "T127">("T125");

  // Presets lookup table
  const standardPresets = {
    450: { sw: 1600, sd: 1600, cw: 1000, cd: 1250, op: 800, ch: 2200, rails: "T89" as const, sheave: 320 },
    630: { sw: 1800, sd: 1800, cw: 1100, cd: 1400, op: 900, ch: 2250, rails: "T89" as const, sheave: 400 },
    800: { sw: 1950, sd: 1950, cw: 1350, cd: 1400, op: 900, ch: 2300, rails: "T89" as const, sheave: 400 },
    1000: { sw: 2100, sd: 2100, cw: 1400, cd: 1600, op: 1000, ch: 2300, rails: "T125" as const, sheave: 400 },
    1275: { sw: 2300, sd: 2300, cw: 1600, cd: 1800, op: 1100, ch: 2400, rails: "T125" as const, sheave: 480 },
    1600: { sw: 2500, sd: 2700, cw: 1400, cd: 2400, op: 1300, ch: 2400, rails: "T127" as const, sheave: 480 },
    2000: { sw: 2800, sd: 3000, cw: 1800, cd: 2500, op: 1500, ch: 2500, rails: "T127" as const, sheave: 520 },
  };

  const applyPreset = (cap: keyof typeof standardPresets) => {
    setCapacity(cap);
    const p = standardPresets[cap];
    setSw(p.sw);
    setSd(p.sd);
    setCw(p.cw);
    setCd(p.cd);
    setOp(p.op);
    setCh(p.ch);
    setRailType(p.rails);
    setSheaveDia(p.sheave);
  };

  // ISIRI 6303-1 / EN 81-20 Calculations
  // Buffer stroke Sb = 0.0674 * v^2 (m) -> mm
  const bufferStroke = Math.round(0.0674 * speed * speed * 1000);
  // Pit minimum depth: 1400 mm + buffer stroke
  const minPitDepth = 1400 + bufferStroke;
  // Headroom minimum height: Car height + 1000 mm + 0.035 * v^2
  const minHeadroom = ch + 1000 + Math.round(0.035 * speed * speed * 1000);
  // Car Area in m2
  const carArea = ((cw * cd) / 1000000).toFixed(2);
  // Persons per ISIRI 6303 Table 1.1
  const persons = Math.floor(capacity / 75);

  // Minimum Hoistway Width based on selected door type (مبحث ۱۵)
  const minShaftWidthForDoor = Math.round(
    doorType === "2P-TEL" ? 1.5 * op + 250 :
    doorType === "2P-CEN" ? 2.0 * op + 200 :
    doorType === "3P-TEL" ? 1.35 * op + 250 :
    doorType === "4P-CEN" ? 1.6 * op + 300 :
    op + 220
  );

  // Distance between guide rails (DBG) mm
  const dbg = cw + 140;

  // CAD Theme Colors
  const themeStyles = {
    autocad: {
      bg: "#09111b",
      grid: "rgba(2,132,199,0.12)",
      gridSub: "rgba(255,255,255,0.03)",
      wallStroke: "#38bdf8",
      wallFill: "rgba(15,23,42,0.75)",
      beam: "#f59e0b",
      railCar: "#00f0ff",
      railCwt: "#10b981",
      sling: "#e2e8f0",
      dim: "#facc15",
      text: "#94a3b8",
      highlight: "#38bdf8",
      motorBg: "#0f172a",
      motorStroke: "#38bdf8",
    },
    ziehl: {
      bg: "#001b33", // Titanium Royal Blue
      grid: "rgba(0,163,224,0.15)",
      gridSub: "rgba(255,255,255,0.04)",
      wallStroke: "#00a3e0",
      wallFill: "rgba(0,35,70,0.85)",
      beam: "#d4af37", // Bronze Gold
      railCar: "#38bdf8",
      railCwt: "#34d399",
      sling: "#f8fafc",
      dim: "#fbbf24",
      text: "#cbd5e1",
      highlight: "#00a3e0",
      motorBg: "#002b49",
      motorStroke: "#00a3e0",
    },
    digipara: {
      bg: "#ffffff", // Architectural Paper White
      grid: "rgba(15,23,42,0.08)",
      gridSub: "rgba(0,0,0,0.02)",
      wallStroke: "#0f172a",
      wallFill: "rgba(241,245,249,0.9)",
      beam: "#475569",
      railCar: "#1e293b",
      railCwt: "#047857",
      sling: "#334155",
      dim: "#dc2626", // Engineering Red Dimensions
      text: "#334155",
      highlight: "#0284c7",
      motorBg: "#f1f5f9",
      motorStroke: "#0f172a",
    }
  }[cadTheme];

  const isDark = cadTheme !== "digipara";

  // SVG Plan Coordinate Scaling Logic
  // Map parametric dimensions (SW 1400-3200, SD 1400-3400) to SVG ViewBox (800 x 640)
  const svgCenterX = 400;
  const svgCenterY = 320;
  // Scaling factor: 520px / 2800mm approx 0.185 px per mm
  const scale = 0.18;

  const shaftWpx = Math.max(260, Math.min(580, sw * scale));
  const shaftDpx = Math.max(260, Math.min(520, sd * scale));
  const shaftLeft = svgCenterX - shaftWpx / 2;
  const shaftTop = svgCenterY - shaftDpx / 2;

  const carWpx = Math.max(160, Math.min(shaftWpx - 40, cw * scale));
  const carDpx = Math.max(160, Math.min(shaftDpx - 60, cd * scale));
  const carLeft = svgCenterX - carWpx / 2;
  // Offset car toward front (bottom) leaving space for counterweight at top (rear)
  const carTop = shaftTop + 70 + (shaftDpx - 70 - carDpx) * 0.45;

  const opWpx = Math.max(120, Math.min(carWpx - 20, op * scale));
  const doorLeft = svgCenterX - opWpx / 2;

  // Counterweight dimensions
  const cwtWpx = carWpx * 0.75;
  const cwtDpx = 22;
  const cwtLeft = svgCenterX - cwtWpx / 2;
  const cwtTop = shaftTop + 20;

  // Generate Real Dynamic DXF ASCII String
  const generateDxfString = () => {
    return `0
SECTION
2
HEADER
9
$ACADVER
1
AC1027
9
$INSUNITS
70
4
0
ENDSEC
0
SECTION
2
TABLES
0
TABLE
2
LAYER
0
LAYER
2
0
70
0
62
7
0
LAYER
2
SHAFT_OUTLINE
70
0
62
4
0
LAYER
2
CAR_SLING
70
0
62
7
0
LAYER
2
CWT_FRAME
70
0
62
3
0
LAYER
2
RAILS_ISO7465
70
0
62
1
0
LAYER
2
DOOR_OPENING
70
0
62
5
0
LAYER
2
DIMENSIONS
70
0
62
2
0
ENDTAB
0
ENDSEC
0
SECTION
2
ENTITIES
0
LWPOLYLINE
8
SHAFT_OUTLINE
90
4
70
1
10
0.0
20
0.0
10
${sw}.0
20
0.0
10
${sw}.0
20
${sd}.0
10
0.0
20
${sd}.0
0
LWPOLYLINE
8
CAR_SLING
90
4
70
1
10
${(sw - cw) / 2}.0
20
${(sd - cd) / 2 + 100}.0
10
${(sw + cw) / 2}.0
20
${(sd - cd) / 2 + 100}.0
10
${(sw + cw) / 2}.0
20
${(sd + cd) / 2 + 100}.0
10
${(sw - cw) / 2}.0
20
${(sd + cd) / 2 + 100}.0
0
LINE
8
DOOR_OPENING
10
${(sw - op) / 2}.0
20
0.0
11
${(sw + op) / 2}.0
20
0.0
0
ENDSEC
0
EOF`;
  };

  const handleCopyDxf = () => {
    navigator.clipboard.writeText(generateDxfString());
    setCopiedDxf(true);
    setTimeout(() => setCopiedDxf(false), 2500);
  };

  const handleDownloadDxf = () => {
    const dxf = generateDxfString();
    const blob = new Blob([dxf], { type: "application/dxf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `VERTEX_LIFTDESIGNER_${sw}x${sd}_${capacity}KG.dxf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadedDxf(true);
    setTimeout(() => setDownloadedDxf(false), 2500);
  };

  return (
    <div className="rounded-2xl border border-vertex-border bg-white shadow-card overflow-hidden">
      {/* ==============================================================
          STUDIO HEADER: BRANDING, THEME SELECTOR & EXPORTS
      ============================================================== */}
      <div className="bg-slate-950 text-white p-5 sm:p-6 border-b border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-vertex-blueprint flex items-center justify-center text-white shadow-md">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold font-mono text-white tracking-wide">
                VERTEX LIFTDESIGNER™ & AUTOCAD PARAMETRIC STUDIO
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                ISIRI 6303-1 / ISO 7465 / STEP-AP214
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isFa 
                ? "مهندسی دقیق و ابعادی چاه با قابلیت تغییر سایز زنده و استایل‌های صنعتی برگرفته از فایل‌های STEP" 
                : "Real-time parametric sizing, ISO 7465 T-rails, and authentic CAD models from STEP archives"}
            </p>
          </div>
        </div>

        {/* Action Controls & Theme Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Theme Mode Switcher */}
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
              onClick={() => setCadTheme("ziehl")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-bold transition-all",
                cadTheme === "ziehl" ? "bg-sky-900/60 text-sky-200 border border-sky-500/40 shadow-sm" : "text-slate-400 hover:text-white"
              )}
            >
              Ziehl Titanium
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

          {/* DXF Export & Download Buttons */}
          <button
            onClick={handleDownloadDxf}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-mono font-bold hover:bg-emerald-500 transition-all flex items-center gap-1.5 shadow-sm"
            title="Download AutoCAD DXF ASCII File"
          >
            {downloadedDxf ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            <span>{downloadedDxf ? (isFa ? "دانلود شد" : "Downloaded") : (isFa ? "دانلود فایل DXF" : "Download DXF")}</span>
          </button>

          <button
            onClick={handleCopyDxf}
            className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-mono font-bold hover:bg-slate-700 hover:text-white transition-all flex items-center gap-1.5 border border-slate-700"
            title="Copy DXF text to clipboard"
          >
            {copiedDxf ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileCode className="w-3.5 h-3.5" />}
            <span>{copiedDxf ? (isFa ? "کپی شد" : "Copied") : (isFa ? "کپی کد" : "Copy DXF")}</span>
          </button>
        </div>
      </div>

      {/* ==============================================================
          STUDIO TABS NAVIGATION
      ============================================================== */}
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
            <span>{isFa ? "۳. آناتومی قطعات بر اساس فایلهای STEP (CAD Parts)" : "3. STEP CAD Subsystems Anatomy"}</span>
          </button>
        </div>

        {/* Sizing Mode Switcher */}
        <div className="flex items-center gap-2 pl-2">
          <button
            onClick={() => setIsCustomDimensions(!isCustomDimensions)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 border",
              isCustomDimensions 
                ? "bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-sm"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:text-white"
            )}
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>{isFa ? (isCustomDimensions ? "پنل تغییر ابعاد فعال" : "تغییر دستی سایز") : "Parametric Controls"}</span>
          </button>
        </div>
      </div>

      {/* ==============================================================
          PARAMETRIC SIZING CONTROL PANEL (قابلیت تغییر سایز و اندازه زنده)
      ============================================================== */}
      {isCustomDimensions && (
        <div className="p-4 sm:p-5 bg-slate-900/90 border-b border-slate-800 text-xs font-mono space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
            <div className="flex items-center gap-2 text-white font-bold">
              <Sliders className="w-4 h-4 text-sky-400" />
              <span>{isFa ? "تنظیمات تغییر سایز، ابعاد چاه و مشخصات مهندسی (Live Parametric Controls)" : "Live Parametric Sizing & Structural Dimensions"}</span>
            </div>

            {/* Capacity Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 text-[11px] mr-1">{isFa ? "پیکربندی استاندارد:" : "Presets:"}</span>
              {[450, 630, 800, 1000, 1275, 1600, 2000].map(cap => (
                <button
                  key={cap}
                  onClick={() => applyPreset(cap as any)}
                  className={cn(
                    "px-2 py-1 rounded text-[11px] font-bold transition-all",
                    capacity === cap 
                      ? "bg-sky-500 text-white shadow-sm" 
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  )}
                >
                  {cap} kg
                </button>
              ))}
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Shaft Width SW */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-[11px] font-semibold">{isFa ? "عرض چاه (SW):" : "Shaft Width (SW):"}</span>
                <span className="text-sky-400 font-bold">{sw} mm</span>
              </div>
              <input 
                type="range" min="1400" max="3200" step="50" 
                value={sw} 
                onChange={(e) => setSw(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1400 mm</span>
                <span>3200 mm</span>
              </div>
            </div>

            {/* Shaft Depth SD */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-[11px] font-semibold">{isFa ? "عمق چاه (SD):" : "Shaft Depth (SD):"}</span>
                <span className="text-sky-400 font-bold">{sd} mm</span>
              </div>
              <input 
                type="range" min="1400" max="3400" step="50" 
                value={sd} 
                onChange={(e) => setSd(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1400 mm</span>
                <span>3400 mm</span>
              </div>
            </div>

            {/* Car Width CW */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-[11px] font-semibold">{isFa ? "عرض کابین (CW):" : "Car Width (CW):"}</span>
                <span className="text-emerald-400 font-bold">{cw} mm</span>
              </div>
              <input 
                type="range" min="900" max="2400" step="50" 
                value={cw} 
                onChange={(e) => setCw(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>900 mm</span>
                <span>2400 mm</span>
              </div>
            </div>

            {/* Car Depth CD */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-[11px] font-semibold">{isFa ? "عمق کابین (CD):" : "Car Depth (CD):"}</span>
                <span className="text-emerald-400 font-bold">{cd} mm</span>
              </div>
              <input 
                type="range" min="900" max="2400" step="50" 
                value={cd} 
                onChange={(e) => setCd(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>900 mm</span>
                <span>2400 mm</span>
              </div>
            </div>

            {/* Door Clear Opening OP */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-[11px] font-semibold">{isFa ? "عرض ورودی درب (OP):" : "Clear Opening (OP):"}</span>
                <span className="text-amber-400 font-bold">{op} mm</span>
              </div>
              <input 
                type="range" min="700" max="1600" step="50" 
                value={op} 
                onChange={(e) => setOp(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>700 mm</span>
                <span>1600 mm</span>
              </div>
            </div>

            {/* Door Type Selector */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-300 block">{isFa ? "نوع مکانیزم درب:" : "Door Mechanism:"}</span>
              <select
                value={doorType}
                onChange={(e) => setDoorType(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-1.5 text-xs font-mono outline-none focus:border-sky-500"
              >
                <option value="2P-TEL">{isFa ? "۲ لنگه تلسکوپی (T2)" : "2-Panel Telescopic"}</option>
                <option value="2P-CEN">{isFa ? "۲ لنگه سانترال (C2)" : "2-Panel Central"}</option>
                <option value="3P-TEL">{isFa ? "۳ لنگه تلسکوپی (T3)" : "3-Panel Telescopic"}</option>
                <option value="4P-CEN">{isFa ? "۴ لنگه سانترال بیمارستانی" : "4-Panel Hospital Central"}</option>
                <option value="HINGED">{isFa ? "لولایی + اتوبوسی (نیمه‌اتومات)" : "Hinged + Bus Semi-Auto"}</option>
              </select>
              <span className="text-[10px] text-slate-400 block truncate">
                {isFa ? `حداقل چاه مبحث ۱۵: ${minShaftWidthForDoor} mm` : `NBC Min: ${minShaftWidthForDoor} mm`}
              </span>
            </div>

            {/* Rated Speed (v) */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-300 block">{isFa ? "سرعت نامی (v):" : "Rated Speed (v):"}</span>
              <div className="grid grid-cols-4 gap-1">
                {[1.0, 1.6, 2.0, 2.5].map(s => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={cn(
                      "py-1 rounded text-center font-bold text-[11px] transition-all",
                      speed === s ? "bg-sky-500 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
                    )}
                  >
                    {s} m/s
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-400 block truncate">
                {isFa ? `کورس بافر Sb: ${bufferStroke} mm` : `Buffer Stroke: ${bufferStroke} mm`}
              </span>
            </div>

            {/* Traction Sheave Diameter */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-300 block">{isFa ? "فلکه کششی (D):" : "Traction Sheave (D):"}</span>
              <div className="grid grid-cols-4 gap-1">
                {[320, 400, 480, 520].map(dia => (
                  <button
                    key={dia}
                    onClick={() => setSheaveDia(dia)}
                    className={cn(
                      "py-1 rounded text-center font-bold text-[11px] transition-all",
                      sheaveDia === dia 
                        ? dia === 400 ? "bg-amber-500 text-slate-950" : "bg-sky-500 text-white" 
                        : "bg-slate-900 text-slate-400 hover:text-white"
                    )}
                  >
                    Ø{dia}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-amber-400/90 block truncate">
                {sheaveDia === 400 ? (isFa ? "مطابق Ziehl-Abegg SM200" : "Ziehl-Abegg SM200") : "D/d ≥ 40 Standard"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          STUDIO MAIN CANVAS AREA
      ============================================================== */}
      <div className={cn("p-4 sm:p-6 transition-colors duration-300", isDark ? "bg-slate-950" : "bg-slate-100")}>
        
        {/* Layer Visibility Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 text-[11px] mr-1">{isFa ? "لایه‌های CAD:" : "CAD Layers:"}</span>
            <button
              onClick={() => setShowDimensions(!showDimensions)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border",
                showDimensions 
                  ? "bg-sky-500/20 text-sky-300 border-sky-400/30" 
                  : isDark ? "bg-slate-900 text-slate-400 border-slate-800" : "bg-white text-slate-500 border-slate-300"
              )}
            >
              <Eye className="w-3 h-3" />
              <span>{isFa ? "خطوط اندازه‌گذاری" : "Dimensions"}</span>
            </button>
            <button
              onClick={() => setShowBeams(!showBeams)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border",
                showBeams 
                  ? "bg-amber-500/20 text-amber-300 border-amber-400/30" 
                  : isDark ? "bg-slate-900 text-slate-400 border-slate-800" : "bg-white text-slate-500 border-slate-300"
              )}
            >
              <Eye className="w-3 h-3" />
              <span>{isFa ? "آهن‌کشی و کلاف‌ها" : "Steel Beams"}</span>
            </button>
            <button
              onClick={() => setShowRefuge(!showRefuge)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border",
                showRefuge 
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30" 
                  : isDark ? "bg-slate-900 text-slate-400 border-slate-800" : "bg-white text-slate-500 border-slate-300"
              )}
            >
              <Eye className="w-3 h-3" />
              <span>{isFa ? "جان‌پناه ۶۳۰۳" : "Refuge Cubes"}</span>
            </button>
            <button
              onClick={() => setShowCwt(!showCwt)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border",
                showCwt 
                  ? "bg-purple-500/20 text-purple-300 border-purple-400/30" 
                  : isDark ? "bg-slate-900 text-slate-400 border-slate-800" : "bg-white text-slate-500 border-slate-300"
              )}
            >
              <Eye className="w-3 h-3" />
              <span>{isFa ? "کادر وزنه تعادل" : "Counterweight"}</span>
            </button>
          </div>

          {/* Scale Indicator */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="font-mono">SCALE 1:20</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-emerald-400 font-bold">LIVE PARAMETRIC</span>
          </div>
        </div>

        {/* ==============================================================
            TAB 1: PLAN VIEW (پلان افقی آهن‌کشی و چاه)
        ============================================================== */}
        {activeTab === "plan" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <svg 
                viewBox="0 0 800 640" 
                className="w-full max-w-3xl h-auto drop-shadow-md select-none font-mono"
              >
                {/* Background CAD Grid */}
                <defs>
                  <pattern id="cadGridSmall" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke={themeStyles.gridSub} strokeWidth="0.8" />
                  </pattern>
                  <pattern id="cadGridBig" width="100" height="100" patternUnits="userSpaceOnUse">
                    <rect width="100" height="100" fill="url(#cadGridSmall)" />
                    <path d="M 100 0 L 0 0 0 100" fill="none" stroke={themeStyles.grid} strokeWidth="1.2" />
                  </pattern>
                </defs>
                <rect width="800" height="640" fill={themeStyles.bg} />
                <rect width="800" height="640" fill="url(#cadGridBig)" />

                {/* Outer Concrete Wall / Shaft Outline (Scaled dynamically) */}
                <rect 
                  x={shaftLeft} y={shaftTop} width={shaftWpx} height={shaftDpx} 
                  fill={themeStyles.wallFill}
                  stroke={themeStyles.wallStroke} 
                  strokeWidth="3"
                />

                {/* Steel Column Corners (آهن‌کشی نبشی ۴ گوشه L80x80) */}
                {showBeams && (
                  <g fill={themeStyles.beam}>
                    {/* Top-Left Corner Angle */}
                    <path d={`M ${shaftLeft} ${shaftTop} L ${shaftLeft + 18} ${shaftTop} L ${shaftLeft + 18} ${shaftTop + 6} L ${shaftLeft + 6} ${shaftTop + 6} L ${shaftLeft + 6} ${shaftTop + 18} L ${shaftLeft} ${shaftTop + 18} Z`} />
                    {/* Top-Right Corner Angle */}
                    <path d={`M ${shaftLeft + shaftWpx} ${shaftTop} L ${shaftLeft + shaftWpx - 18} ${shaftTop} L ${shaftLeft + shaftWpx - 18} ${shaftTop + 6} L ${shaftLeft + shaftWpx - 6} ${shaftTop + 6} L ${shaftLeft + shaftWpx - 6} ${shaftTop + 18} L ${shaftLeft + shaftWpx} ${shaftTop + 18} Z`} />
                    {/* Bottom-Left Corner Angle */}
                    <path d={`M ${shaftLeft} ${shaftTop + shaftDpx} L ${shaftLeft + 18} ${shaftTop + shaftDpx} L ${shaftLeft + 18} ${shaftTop + shaftDpx - 6} L ${shaftLeft + 6} ${shaftTop + shaftDpx - 6} L ${shaftLeft + 6} ${shaftTop + shaftDpx - 18} L ${shaftLeft} ${shaftTop + shaftDpx - 18} Z`} />
                    {/* Bottom-Right Corner Angle */}
                    <path d={`M ${shaftLeft + shaftWpx} ${shaftTop + shaftDpx} L ${shaftLeft + shaftWpx - 18} ${shaftTop + shaftDpx} L ${shaftLeft + shaftWpx - 18} ${shaftTop + shaftDpx - 6} L ${shaftLeft + shaftWpx - 6} ${shaftTop + shaftDpx - 6} L ${shaftLeft + shaftWpx - 6} ${shaftTop + shaftDpx - 18} L ${shaftLeft + shaftWpx} ${shaftTop + shaftDpx - 18} Z`} />
                  </g>
                )}

                {/* Intermediate Steel Ring Beams (کلاف‌کشی ناودانی UNP 14) */}
                {showBeams && (
                  <g stroke={themeStyles.beam} strokeWidth="1.2" strokeDasharray="4,4">
                    <line x1={shaftLeft} y1={svgCenterY} x2={shaftLeft + shaftWpx} y2={svgCenterY} />
                    <line x1={svgCenterX} y1={shaftTop} x2={svgCenterX} y2={shaftTop + shaftDpx} />
                  </g>
                )}

                {/* Counterweight Frame (کادر وزنه تعادل پشت کابین) */}
                {showCwt && (
                  <g transform={`translate(${cwtLeft}, ${cwtTop})`}>
                    <rect x="0" y="0" width={cwtWpx} height={cwtDpx} fill={isDark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.2)"} stroke={themeStyles.railCwt} strokeWidth="2" rx="2" />
                    {/* CWT Cast Iron Filler Blocks */}
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <line 
                        key={idx} 
                        x1={(cwtWpx / 7) * (idx + 1)} y1="0" 
                        x2={(cwtWpx / 7) * (idx + 1)} y2={cwtDpx} 
                        stroke={themeStyles.railCwt} strokeWidth="1" strokeDasharray="2,2" 
                      />
                    ))}
                    {/* CWT Guide Rails T70 at both ends */}
                    <rect x="-8" y="4" width="8" height="14" fill={themeStyles.railCwt} />
                    <rect x={cwtWpx} y="4" width="8" height="14" fill={themeStyles.railCwt} />
                    <text x={cwtWpx / 2} y="15" fontSize="9" fill={themeStyles.railCwt} textAnchor="middle" fontWeight="bold">
                      CWT FRAME (50% BALANCE)
                    </text>
                  </g>
                )}

                {/* Car Guide Rails (ریل‌های راهنمای کابین T89 / T125 در دو طرف چپ و راست) */}
                {/* Left Rail */}
                <g transform={`translate(${shaftLeft + 18}, ${svgCenterY})`}>
                  <path d="M 0 -22 L 7 -22 L 7 -5 L 26 -5 L 26 5 L 7 5 L 7 22 L 0 22 Z" fill={themeStyles.railCar} stroke={themeStyles.wallStroke} strokeWidth="1.5" />
                  {showBeams && (
                    <line x1="-18" y1="0" x2="0" y2="0" stroke={themeStyles.beam} strokeWidth="3" />
                  )}
                  <text x="5" y="-26" fontSize="9" fill={themeStyles.railCar} textAnchor="middle">RAIL {railType}</text>
                </g>

                {/* Right Rail */}
                <g transform={`translate(${shaftLeft + shaftWpx - 18}, ${svgCenterY})`}>
                  <path d="M 0 -22 L -7 -22 L -7 -5 L -26 -5 L -26 5 L -7 5 L -7 22 L 0 22 Z" fill={themeStyles.railCar} stroke={themeStyles.wallStroke} strokeWidth="1.5" />
                  {showBeams && (
                    <line x1="18" y1="0" x2="0" y2="0" stroke={themeStyles.beam} strokeWidth="3" />
                  )}
                  <text x="-5" y="-26" fontSize="9" fill={themeStyles.railCar} textAnchor="middle">RAIL {railType}</text>
                </g>

                {/* Car Enclosure & Sling Platform (کابین و یوک فولادی) */}
                <g>
                  {/* Outer Car Sling (یوک کابین) */}
                  <rect 
                    x={carLeft - 10} y={carTop - 8} 
                    width={carWpx + 20} height={carDpx + 16} 
                    fill="none" 
                    stroke={themeStyles.sling} 
                    strokeWidth="2.5" 
                    rx="4"
                  />

                  {/* Inner Car Walls (دیواره‌های کابین) */}
                  <rect 
                    x={carLeft} y={carTop} 
                    width={carWpx} height={carDpx} 
                    fill={isDark ? "rgba(30,41,59,0.85)" : "rgba(255,255,255,0.95)"} 
                    stroke={themeStyles.wallStroke} 
                    strokeWidth="2" 
                  />

                  {/* Guide Shoes on Sling Sides (کفشک‌های لغزشی برگرفته از مدل STEP) */}
                  <rect x={carLeft - 16} y={svgCenterY - 12} width="16" height="24" fill={themeStyles.beam} rx="2" />
                  <rect x={carLeft + carWpx} y={svgCenterY - 12} width="16" height="24" fill={themeStyles.beam} rx="2" />

                  {/* Retiring Cam Door Unlock Solenoid CL-04 (کمان بازکننده درب لولایی) */}
                  {doorType === "HINGED" && (
                    <g transform={`translate(${carLeft + 15}, ${carTop + carDpx - 10})`}>
                      <rect x="0" y="0" width="45" height="8" fill="#f97316" rx="1" />
                      <text x="22" y="-3" fontSize="8" fill="#f97316" textAnchor="middle">CL-04 CAM</text>
                    </g>
                  )}

                  {/* ISIRI 6303 Technician Safety Refuge Area (مکعب جان‌پناه تکنسین روی سقف) */}
                  {showRefuge && (
                    <g transform={`translate(${svgCenterX - 35}, ${carTop + 25})`}>
                      <rect x="0" y="0" width="70" height="50" fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,3" />
                      <text x="35" y="24" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="bold">REFUGE CUBE</text>
                      <text x="35" y="38" fontSize="7" fill="#10b981" textAnchor="middle">500×600×800mm</text>
                    </g>
                  )}

                  {/* Center of Gravity Mark (مرکز ثقل) */}
                  <g transform={`translate(${svgCenterX}, ${carTop + carDpx / 2})`}>
                    <circle cx="0" cy="0" r="10" fill="none" stroke="#ef4444" strokeWidth="1.2" />
                    <line x1="-14" y1="0" x2="14" y2="0" stroke="#ef4444" strokeWidth="1.2" />
                    <line x1="0" y1="-14" x2="0" y2="14" stroke="#ef4444" strokeWidth="1.2" />
                    <text x="16" y="4" fontSize="8" fill="#ef4444" fontWeight="bold">CG</text>
                  </g>

                  {/* Car Interior Specs Text */}
                  <text x={svgCenterX} y={carTop + carDpx - 30} fontSize="11" fill={themeStyles.highlight} textAnchor="middle" fontWeight="bold">
                    CAR PLATFORM: {cw} × {cd} mm ({capacity} kg / {persons} P)
                  </text>
                </g>

                {/* Landing & Car Doors (درب‌های طبقه و کابین بر مبنای عرض بازشو) */}
                <g transform={`translate(${svgCenterX}, ${shaftTop + shaftDpx})`}>
                  {/* Landing Door Outer Track */}
                  <rect x={-opWpx / 2} y="-6" width={opWpx} height="6" fill="#3b82f6" />
                  {/* Car Door Inner Track */}
                  <rect x={-opWpx / 2} y="-16" width={opWpx} height="6" fill="#60a5fa" />
                  {/* Door Panels Schematic */}
                  <line x1={-opWpx / 2} y1="-11" x2="0" y2="-11" stroke="#ffffff" strokeWidth="2" />
                  <line x1="0" y1="-11" x2={opWpx / 2} y2="-11" stroke="#ffffff" strokeWidth="2" />
                  
                  <text x="0" y="-22" fontSize="10" fill="#3b82f6" textAnchor="middle" fontWeight="bold">
                    DOOR OP = {op} mm ({doorType})
                  </text>
                </g>

                {/* Parametric Dimension Lines (خطوط اندازه‌گذاری زنده استاندارد اتوکد) */}
                {showDimensions && (
                  <g stroke={themeStyles.dim} strokeWidth="1.2" fill={themeStyles.dim}>
                    {/* Shaft Width SW Top */}
                    <line x1={shaftLeft} y1={shaftTop - 25} x2={shaftLeft + shaftWpx} y2={shaftTop - 25} />
                    <line x1={shaftLeft} y1={shaftTop - 32} x2={shaftLeft} y2={shaftTop - 18} />
                    <line x1={shaftLeft + shaftWpx} y1={shaftTop - 32} x2={shaftLeft + shaftWpx} y2={shaftTop - 18} />
                    <text x={svgCenterX} y={shaftTop - 30} fontSize="11" textAnchor="middle" fontWeight="bold">
                      SHAFT WIDTH (SW) = {sw} mm
                    </text>

                    {/* Shaft Depth SD Right */}
                    <line x1={shaftLeft + shaftWpx + 25} y1={shaftTop} x2={shaftLeft + shaftWpx + 25} y2={shaftTop + shaftDpx} />
                    <line x1={shaftLeft + shaftWpx + 18} y1={shaftTop} x2={shaftLeft + shaftWpx + 32} y2={shaftTop} />
                    <line x1={shaftLeft + shaftWpx + 18} y1={shaftTop + shaftDpx} x2={shaftLeft + shaftWpx + 32} y2={shaftTop + shaftDpx} />
                    <text 
                      x={shaftLeft + shaftWpx + 45} y={svgCenterY} 
                      fontSize="11" textAnchor="middle" 
                      transform={`rotate(90, ${shaftLeft + shaftWpx + 45}, ${svgCenterY})`} 
                      fontWeight="bold"
                    >
                      SHAFT DEPTH (SD) = {sd} mm
                    </text>

                    {/* Distance Between Guide Rails (DBG) */}
                    <line x1={shaftLeft + 18} y1={svgCenterY + 45} x2={shaftLeft + shaftWpx - 18} y2={svgCenterY + 45} strokeDasharray="3,3" />
                    <text x={svgCenterX} y={svgCenterY + 40} fontSize="9" textAnchor="middle">
                      DBG (DISTANCE BETWEEN RAILS) = {dbg} mm
                    </text>

                    {/* Car Depth CD Dimension Left */}
                    <line x1={carLeft - 35} y1={carTop} x2={carLeft - 35} y2={carTop + carDpx} />
                    <line x1={carLeft - 42} y1={carTop} x2={carLeft - 28} y2={carTop} />
                    <line x1={carLeft - 42} y1={carTop + carDpx} x2={carLeft - 28} y2={carTop + carDpx} />
                    <text 
                      x={carLeft - 50} y={carTop + carDpx / 2} 
                      fontSize="10" textAnchor="middle" 
                      transform={`rotate(-90, ${carLeft - 50}, ${carTop + carDpx / 2})`}
                    >
                      CAR DEPTH = {cd} mm
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Live Parametric Specifications Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className={cn("p-3 rounded-xl border", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
                <span className="text-slate-400 block text-[11px]">{isFa ? "ابعاد مفید چاه (SW × SD):" : "Clear Hoistway:"}</span>
                <span className="text-sm font-bold text-sky-400 mt-1 block">{sw} × {sd} mm</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">{isFa ? "مبحث ۱۵ مقررات ملی" : "Conforms to NBC 15"}</span>
              </div>
              <div className={cn("p-3 rounded-xl border", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
                <span className="text-slate-400 block text-[11px]">{isFa ? "مساحت و ظرفیت مسافر:" : "Car Area & Capacity:"}</span>
                <span className="text-sm font-bold text-emerald-400 mt-1 block">{carArea} m² ({persons} P / {capacity} kg)</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">ISIRI 6303 Table 1.1</span>
              </div>
              <div className={cn("p-3 rounded-xl border", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
                <span className="text-slate-400 block text-[11px]">{isFa ? "پروفیل ریل راهنما (ISO 7465):" : "Guide Rails Profile:"}</span>
                <span className="text-sm font-bold text-amber-400 mt-1 block">{railType}/B / T70-CWT</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">DBG = {dbg} mm</span>
              </div>
              <div className={cn("p-3 rounded-xl border", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
                <span className="text-slate-400 block text-[11px]">{isFa ? "عرض بازشوی خالص درب (OP):" : "Clear Opening Width:"}</span>
                <span className="text-sm font-bold text-purple-400 mt-1 block">{op} mm ({doorType})</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">{isFa ? `حداقل عرض چاه: ${minShaftWidthForDoor}mm` : `Min SW: ${minShaftWidthForDoor}mm`}</span>
              </div>
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB 2: SECTION ELEVATION VIEW (برش مقطع طولی چاه و موتورخانه)
        ============================================================== */}
        {activeTab === "section" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <svg 
                viewBox="0 0 850 660" 
                className="w-full max-w-3xl h-auto drop-shadow-md select-none font-mono"
              >
                {/* Background CAD Grid */}
                <rect width="850" height="660" fill={themeStyles.bg} />
                <rect width="850" height="660" fill="url(#cadGridBig)" />

                {/* Hoistway Concrete Walls */}
                <rect x="220" y="40" width="410" height="570" fill="none" stroke={themeStyles.wallStroke} strokeWidth="2.5" />
                <line x1="160" y1="40" x2="690" y2="40" stroke="#64748b" strokeWidth="4" />
                <line x1="160" y1="610" x2="690" y2="610" stroke="#64748b" strokeWidth="4" />

                {/* Machine Room & Gearless PMSM Motor (Ziehl-Abegg SM200.40C / Wittur WSG) */}
                <g transform="translate(425, 80)">
                  {/* Steel Bedplate with Anti-Vibration Isolation Pads */}
                  <rect x="-140" y="-8" width="280" height="16" fill={isDark ? "#1e293b" : "#cbd5e1"} stroke="#64748b" strokeWidth="1.5" />
                  <rect x="-120" y="8" width="25" height="10" fill="#10b981" />
                  <rect x="95" y="8" width="25" height="10" fill="#10b981" />
                  
                  {/* PMSM Gearless Motor Housing */}
                  <circle cx="-30" cy="-35" r="42" fill={themeStyles.motorBg} stroke={themeStyles.motorStroke} strokeWidth="2.5" />
                  {/* Traction Sheave with Hardened V-Grooves (Scaled to Sheave Diameter) */}
                  <circle cx="-30" cy="-35" r={sheaveDia * 0.08} fill="none" stroke="#f97316" strokeWidth="2.5" strokeDasharray="4,2" />
                  
                  {/* Dual Independent Electromagnetic Disc Brakes (MFB) */}
                  <rect x="-48" y="-88" width="36" height="16" fill="#ef4444" rx="2" />
                  <text x="-30" y="-92" fontSize="9" fill="#ef4444" textAnchor="middle" fontWeight="bold">DUAL MFB BRAKE</text>

                  {/* Manual Brake Release Lever (MHL) */}
                  <line x1="-30" y1="-80" x2="-10" y2="-105" stroke="#f59e0b" strokeWidth="2.5" />
                  <circle cx="-10" cy="-105" r="3" fill="#f59e0b" />

                  {/* Deflector / Diverter Sheave */}
                  <circle cx="105" cy="-15" r="24" fill={themeStyles.motorBg} stroke="#f97316" strokeWidth="2" />
                  
                  <text x="-30" y="-32" fontSize="9" fill="#ffffff" textAnchor="middle" fontWeight="bold">
                    ZIEHL SM200
                  </text>
                  <text x="105" y="-12" fontSize="8" fill={isDark ? "#ffffff" : "#0f172a"} textAnchor="middle">
                    DEFLECTOR Ø{sheaveDia}
                  </text>
                </g>

                {/* Overspeed Governor System at Overhead (گاورنر سرعت دوطرفه ۳۰۸mm) */}
                <g transform="translate(260, 65)">
                  <circle cx="0" cy="0" r="18" fill="none" stroke="#eab308" strokeWidth="2" />
                  <circle cx="0" cy="0" r="4" fill="#eab308" />
                  <text x="0" y="-24" fontSize="9" fill="#eab308" textAnchor="middle" fontWeight="bold">GOVERNOR 308mm</text>
                  <line x1="-18" y1="0" x2="-18" y2="490" stroke="#eab308" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="18" y1="0" x2="18" y2="490" stroke="#eab308" strokeWidth="1" strokeDasharray="3,3" />
                </g>

                {/* Suspension Steel Wire Ropes */}
                <g stroke="#cbd5e1" strokeWidth="2">
                  <line x1="365" y1="45" x2="365" y2="240" />
                  <line x1="530" y1="65" x2="530" y2="350" />
                </g>

                {/* Car Sling & Cabin in Shaft Elevation */}
                <g transform="translate(290, 240)">
                  {/* Car Sling Upper Crosshead (تیرک افقی بالای یوک) */}
                  <rect x="-10" y="0" width="170" height="16" fill={themeStyles.sling} stroke="#64748b" strokeWidth="1.5" />
                  {/* Car Sling Vertical Uprights */}
                  <rect x="-10" y="16" width="12" height="150" fill={themeStyles.sling} stroke="#64748b" strokeWidth="1.5" />
                  <rect x="148" y="16" width="12" height="150" fill={themeStyles.sling} stroke="#64748b" strokeWidth="1.5" />
                  {/* Car Sling Lower Safety Plank */}
                  <rect x="-10" y="166" width="170" height="16" fill={themeStyles.sling} stroke="#64748b" strokeWidth="1.5" />

                  {/* Enclosed Cabin Box */}
                  <rect x="5" y="16" width="140" height="150" fill={isDark ? "rgba(30,41,59,0.9)" : "rgba(255,255,255,0.95)"} stroke={themeStyles.wallStroke} strokeWidth="2" />
                  
                  {/* Progressive Safety Gear Blocks at Bottom (پاراشوت تدریجی) */}
                  <rect x="-14" y="166" width="16" height="22" fill="#ef4444" rx="2" />
                  <rect x="148" y="166" width="16" height="22" fill="#ef4444" rx="2" />
                  <text x="75" y="196" fontSize="8" fill="#ef4444" textAnchor="middle" fontWeight="bold">
                    SAFETY GEAR (ISIRI 6303 Art. 9.8)
                  </text>

                  {/* Technician Refuge Cube on Car Roof */}
                  {showRefuge && (
                    <g transform="translate(35, -35)">
                      <rect x="0" y="0" width="70" height="35" fill="rgba(16,185,129,0.25)" stroke="#10b981" strokeWidth="1.2" strokeDasharray="3,2" />
                      <text x="35" y="21" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="bold">REFUGE CUBE</text>
                    </g>
                  )}

                  <text x="75" y="85" fontSize="10" fill={themeStyles.highlight} textAnchor="middle" fontWeight="bold">
                    CAR {capacity} KG
                  </text>
                  <text x="75" y="105" fontSize="9" fill={themeStyles.text} textAnchor="middle">
                    CH = {ch} mm
                  </text>
                </g>

                {/* Counterweight in Section View */}
                {showCwt && (
                  <g transform="translate(510, 350)">
                    <rect x="0" y="0" width="40" height="140" fill={isDark ? "#1e293b" : "#cbd5e1"} stroke={themeStyles.railCwt} strokeWidth="2" rx="2" />
                    {Array.from({ length: 5 }).map((_, i) => (
                      <line key={i} x1="0" y1={25 * (i + 1)} x2="40" y2={25 * (i + 1)} stroke={themeStyles.railCwt} strokeWidth="1" strokeDasharray="2,2" />
                    ))}
                    <text x="20" y="75" fontSize="9" fill={themeStyles.railCwt} textAnchor="middle" transform="rotate(90, 20, 75)" fontWeight="bold">
                      CWT
                    </text>
                  </g>
                )}

                {/* Pit & Hydraulic Oil Buffers (ضربه‌گیرهای هیدرولیک کف چاهک) */}
                <g transform="translate(425, 560)">
                  {/* Car Oil Buffer */}
                  <g transform="translate(-75, 0)">
                    <rect x="-12" y="0" width="24" height="50" fill="#f59e0b" rx="2" />
                    <rect x="-8" y="-15" width="16" height="15" fill="#94a3b8" />
                    <rect x="-16" y="-18" width="32" height="4" fill="#10b981" rx="1" />
                    <text x="0" y="32" fontSize="7" fill="#000000" textAnchor="middle" fontWeight="bold">BUFFER</text>
                  </g>

                  {/* Counterweight Oil Buffer */}
                  <g transform="translate(105, 0)">
                    <rect x="-12" y="0" width="24" height="50" fill="#f59e0b" rx="2" />
                    <rect x="-8" y="-15" width="16" height="15" fill="#94a3b8" />
                    <rect x="-16" y="-18" width="32" height="4" fill="#10b981" rx="1" />
                  </g>

                  {/* Governor Tension Weight in Pit */}
                  <g transform="translate(-165, 10)">
                    <circle cx="0" cy="15" r="14" fill="#eab308" />
                    <rect x="-8" y="28" width="16" height="18" fill="#475569" />
                    <text x="0" y="40" fontSize="7" fill="#ffffff" textAnchor="middle">25kg</text>
                  </g>
                </g>

                {/* Elevation Dimension Lines (ارتفاع بالاسری و عمق چاهک) */}
                {showDimensions && (
                  <g stroke={themeStyles.dim} strokeWidth="1.2" fill={themeStyles.dim}>
                    {/* Headroom Dimension Top Right */}
                    <line x1="655" y1="40" x2="655" y2="240" />
                    <line x1="645" y1="40" x2="665" y2="40" />
                    <line x1="645" y1="240" x2="665" y2="240" />
                    <text 
                      x="680" y="140" 
                      fontSize="10" textAnchor="middle" 
                      transform="rotate(90, 680, 140)" 
                      fontWeight="bold"
                    >
                      HEADROOM (K) ≥ {minHeadroom} mm
                    </text>

                    {/* Pit Depth Dimension Bottom Right */}
                    <line x1="655" y1="460" x2="655" y2="610" />
                    <line x1="645" y1="460" x2="665" y2="460" />
                    <line x1="645" y1="610" x2="665" y2="610" />
                    <text 
                      x="680" y="535" 
                      fontSize="10" textAnchor="middle" 
                      transform="rotate(90, 680, 535)" 
                      fontWeight="bold"
                    >
                      PIT DEPTH (S1) ≥ {minPitDepth} mm
                    </text>

                    {/* Buffer Stroke Callout */}
                    <text x="350" y="545" fontSize="9" fill="#f59e0b" textAnchor="middle">
                      BUFFER STROKE Sb = {bufferStroke} mm (v = {speed} m/s)
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Section View Specifications Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className={cn("p-3 rounded-xl border", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
                <span className="text-slate-400 block text-[11px]">{isFa ? "حداقل ارتفاع بالاسری (K):" : "Min Headroom (K):"}</span>
                <span className="text-sm font-bold text-sky-400 mt-1 block">≥ {minHeadroom} mm</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">{isFa ? "بند ۵-۷ استاندارد ۶۳۰۳" : "ISIRI 6303 Art. 5.7"}</span>
              </div>
              <div className={cn("p-3 rounded-xl border", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
                <span className="text-slate-400 block text-[11px]">{isFa ? "حداقل عمق چاهک (S1):" : "Min Pit Depth (S1):"}</span>
                <span className="text-sm font-bold text-amber-400 mt-1 block">≥ {minPitDepth} mm</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">{isFa ? "بند ۵-۷-۳ استاندارد ۶۳۰۳" : "ISIRI 6303 Art. 5.7.3"}</span>
              </div>
              <div className={cn("p-3 rounded-xl border", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
                <span className="text-slate-400 block text-[11px]">{isFa ? "کورس مفید ضربه‌گیر (Sb):" : "Buffer Stroke (Sb):"}</span>
                <span className="text-sm font-bold text-emerald-400 mt-1 block">{bufferStroke} mm</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Sb = 0.0674 × v²</span>
              </div>
              <div className={cn("p-3 rounded-xl border", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
                <span className="text-slate-400 block text-[11px]">{isFa ? "قطر فلکه کششی (D):" : "Traction Sheave (D):"}</span>
                <span className="text-sm font-bold text-purple-400 mt-1 block">Ø{sheaveDia} mm (V-Groove)</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">D/d = {(sheaveDia / 10).toFixed(0)} ≥ 40</span>
              </div>
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB 3: STEP ARCHIVE MECHANICAL SUBSYSTEMS (آناتومی تفکیکی قطعات CAD)
        ============================================================== */}
        {activeTab === "components" && (
          <div className="space-y-6">
            {/* Component Selector Pills */}
            <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-700/40">
              {[
                { id: "ziehl_motor", labelFa: "موتور Ziehl-Abegg ZAtop SM200", labelEn: "Ziehl-Abegg ZAtop SM200.40C" },
                { id: "wittur_motor", labelFa: "موتور Wittur WSG-S2.3 (پارت جعبه‌تقسیم)", labelEn: "Wittur WSG-S2.3 Gearless" },
                { id: "governor", labelFa: "گاورنر دوطرفه سرعت (Governor 308mm)", labelEn: "Bi-Directional Governor" },
                { id: "door_cam", labelFa: "کمان بازکننده درب CL-04 (پمپ لولایی)", labelEn: "CL-04 Door Retiring Cam" },
                { id: "shoe", labelFa: "کفشک چدنی صلب ریل (Guide Shoe)", labelEn: "Cast Iron Guide Shoe" },
                { id: "parachute", labelFa: "ترمز ایمنی پاراشوت تدریجی", labelEn: "Progressive Safety Gear" },
                { id: "rails", labelFa: "مقاطع ریل ISO 7465 (T89/T125)", labelEn: "ISO 7465 T-Rails" },
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

            {/* Component Detail View */}
            <div className={cn(
              "p-6 rounded-2xl border",
              isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            )}>
              {/* Ziehl-Abegg SM200.40C */}
              {activeComponent === "ziehl_motor" && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-lg font-bold text-sky-400 font-mono">
                        ZIEHL-ABEGG ZAtop SM200.40C (Permanent Magnet Synchronous Machine)
                      </h4>
                      <span className="text-xs text-slate-400 font-mono">
                        {isFa ? "استخراج‌شده مستقیم از مدل سه‌بعدی ZIEHL-ABEGG_STEP_ZAtop_SM200.40C...stp (12.18 MB)" : "Direct extraction from official STEP CAD archive"}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30">
                      EN 81-20 / ISIRI 6303-1
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isFa 
                      ? "موتور سنکرون مغناطیس دائم بدون گیربکس پرچمدار صنعت آسانسور ساخت کمپانی زیلابگ آلمان. مجهز به فلکه کششی آلیاژی قطر ۴۰۰ میلی‌متر، ترمز دوبل الکترومغناطیسی MFB با سیستم نظارت میکروسوئیچی جهت الزامات ایمنی حرکت ناخواسته کابین (UCM)، اهرم مکانیکی بازکننده دستی ترمز (MHL) برای نجات اضطراری و درجه حفاظت صنعتی IP21." 
                      : "Flagship German PMSM gearless machine with Ø400mm traction sheave, dual MFB redundant disc brakes, manual release lever (MHL), and EnDat absolute encoder."}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-2">
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "قطر فلکه کششی:" : "Sheave Diameter:"}</span>
                      <span className="text-amber-400 font-bold text-sm">Ø400 mm (V-Groove)</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "ابعاد پاکت CAD:" : "BBox Dimensions:"}</span>
                      <span className="text-sky-400 font-bold text-sm">1466 × 1072 × 1235 mm</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "ترمز ایمنی دوبل:" : "Safety Brake:"}</span>
                      <span className="text-emerald-400 font-bold text-sm">MFB Dual Circuit</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "بیشینه ظرفیت نامی:" : "Max Rated Load:"}</span>
                      <span className="text-purple-400 font-bold text-sm">Up to 1,600 kg</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Wittur WSG-S2.3 */}
              {activeComponent === "wittur_motor" && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-lg font-bold text-sky-400 font-mono">
                        WITTUR WSG-S2.3 Gearless PMSM Machine
                      </h4>
                      <span className="text-xs text-slate-400 font-mono">
                        {isFa ? "استخراج‌شده از wittur WSG-S2.3.STEP (شامل پارت ایرانی jabe taqsim)" : "Compact MRL gearless machine with Persian terminal box labeling"}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30">
                      MRL COMPACT
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isFa 
                      ? "موتور بدون موتورخانه (MRL) ویتور آلمان با ابعاد پاکت ۴۱۵ در ۵۰۰ در ۱۱۳۹ میلی‌متر. این مدل دارای ترمز کالیپری دوطرفه، فلکه یکپارچه و ساختار بدنه آلومینیوم-چدن سبک‌سازی شده برای نصب مستقیم روی ریل راهنما در بالاسری چاه است." 
                      : "Ultra-compact MRL synchronous machine with 415mm width envelope, integrated brake calipers, and direct guide-rail mounting capability."}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-2">
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "عرض بدنه کامپکت:" : "Width Envelope:"}</span>
                      <span className="text-sky-400 font-bold text-sm">415 mm</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "ترمز دیسکی:" : "Brake System:"}</span>
                      <span className="text-white font-bold text-sm">Dual Caliper Disc</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "سیستم نصب:" : "Mounting:"}</span>
                      <span className="text-emerald-400 font-bold text-sm">Guide-Rail Direct MRL</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "راندمان انرژی:" : "Efficiency:"}</span>
                      <span className="text-amber-400 font-bold text-sm">η ≥ 92%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Governor Assembly */}
              {activeComponent === "governor" && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-lg font-bold text-amber-400 font-mono">
                      {isFa ? "گاورنر سرعت دوطرفه پاندولی (Governor assem.STEP - 7.92 MB)" : "Bi-Directional Overspeed Governor Assembly"}
                    </h4>
                    <span className="text-xs font-mono text-emerald-400 font-bold">بند ۹-۹ استاندارد ۶۳۰۳</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isFa 
                      ? "سیستم گاورنر سرعت غیرمجاز مدل‌سازی شده در ابعاد ۳۰۸ در ۳۸۱ در ۳۸۵ میلی‌متر. مجهز به دو وزنه گریز از مرکز دوار متصل به فنر کالیبراسیون دقیق که در سرعت ۱.۱۵ برابر سرعت نامی، سوئیچ ایمنی الکتریکی را قطع کرده و فک مکانیکی نگه‌دارنده سیم‌بکسل را جهت تحریک پاراشوت قفل می‌کند." 
                      : "Precision centrifugal governor with 308x381x385 mm bounding envelope, dual flyweights, calibration spring, test pulley, and safety circuit trip switch."}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-2">
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "ابعاد دقیق پاکت:" : "CAD Envelope:"}</span>
                      <span className="text-amber-400 font-bold text-sm">308 × 381 × 385 mm</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "سرعت تحریک الکتریکی:" : "Trip Speed:"}</span>
                      <span className="text-sky-400 font-bold text-sm">1.15 × v_rated</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "قطر سیم‌بکسل گاورنر:" : "Rope Diameter:"}</span>
                      <span className="text-white font-bold text-sm">Ø6.5 mm / Ø8 mm</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "وزنه کشش چاهک:" : "Tension Weight:"}</span>
                      <span className="text-emerald-400 font-bold text-sm">25 kg Cast Iron</span>
                    </div>
                  </div>
                </div>
              )}

              {/* CL-04 Door Retiring Cam */}
              {activeComponent === "door_cam" && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-lg font-bold text-orange-400 font-mono">
                      {isFa ? "کمان برقی / پمپ مکانیکی بازکننده قفل درب (CL-04 KİLİT AÇMA POMPASI)" : "CL-04 Door Retiring Cam / Solenoid Actuator"}
                    </h4>
                    <span className="text-xs font-mono text-emerald-400 font-bold">بند ۷-۷ استاندارد ۶۳۰۳</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isFa 
                      ? "پمپ قفل‌بازکن درب لولایی استخراج شده از مدل CL-04 با ابعاد دقیق ۶۰۰ در ۲۸۲ در ۷۴ میلی‌متر. این قطعه حیاتی در آسانسورهای نیمه‌اتوماتیک ایران الزامی است؛ در زمان حرکت کابین، مگنت کمان جمع است و به محض همسطح شدن با طبقه مقصد، بوبین با فرمان تابلو تحریک شده و لبه متحرک کمان قفل درب طبقه را باز می‌نماید." 
                      : "Electro-mechanical retiring cam mechanism (600x282x74 mm) essential for Iranian semi-automatic hinged landing doors, ensuring door locks remain secure during travel."}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-2">
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "طول کلی کمان:" : "Overall Length:"}</span>
                      <span className="text-orange-400 font-bold text-sm">600 mm</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "ولتاژ تحریک بوبین:" : "Coil Voltage:"}</span>
                      <span className="text-sky-400 font-bold text-sm">70 – 110 VDC</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "کورس حرکتی لبه:" : "Retracting Stroke:"}</span>
                      <span className="text-white font-bold text-sm">35 – 50 mm</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "سازگاری استاندارد:" : "Standard Conformity:"}</span>
                      <span className="text-emerald-400 font-bold text-sm">ISIRI 6303 Art. 7.7</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Guide Shoe */}
              {activeComponent === "shoe" && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-lg font-bold text-sky-400 font-mono">
                      {isFa ? "کفشک چدنی صلب ریل راهنما (Shoe used in ascensore.STEP)" : "Heavy-Duty Cast Iron Sliding Guide Shoe"}
                    </h4>
                    <span className="text-xs font-mono text-emerald-400 font-bold">ISO 7465 / ISIRI 6303</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isFa 
                      ? "کفشک ریل لغزشی صلب استخراج شده از مدل با ابعاد ۱۶۶ در ۲۰۳ در ۲۹۹ میلی‌متر. ساخته شده از بدنه چدن داکتیل نشکن، لنت تعویض‌پذیر پلی‌اتیلن مهندسی با مقاومت سایش بالا، نمد روغندان خودکار و پیچ‌های فولادی سایز M16 برای رگلاژ دقیق فاصله شاقول ریل‌ها (DBG)." 
                      : "Ductile cast iron sliding shoe (166x203x299 mm) with replaceable low-friction polyamide liner, automatic oil lubricator, and M16 precision backlash adjustment bolts."}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-2">
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "ابعاد پاکت مهندسی:" : "CAD Envelope:"}</span>
                      <span className="text-sky-400 font-bold text-sm">166 × 203 × 299 mm</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "متریال لنت کشویی:" : "Liner Material:"}</span>
                      <span className="text-emerald-400 font-bold text-sm">Polyamide PA6.6</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "پیچ‌های رگلاژ:" : "Adjustment Screws:"}</span>
                      <span className="text-white font-bold text-sm">ISO 4034 M16 Class 8.8</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "سازگاری با تیپ ریل:" : "Rail Compatibility:"}</span>
                      <span className="text-amber-400 font-bold text-sm">T89, T125, T127</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Progressive Safety Gear */}
              {activeComponent === "parachute" && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-lg font-bold text-red-400 font-mono">
                      {isFa ? "ترمز ایمنی پاراشوت تدریجی گوه‌ای (Progressive Safety Gear)" : "Progressive Safety Gear Assembly"}
                    </h4>
                    <span className="text-xs font-mono text-emerald-400 font-bold">بند ۹-۸ استاندارد ۶۳۰۳</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isFa 
                      ? "نصب شده در زیر تیر ایمنی یوک کابین (Safety Plank). مجهز به لنت‌های گوه‌ای فولاد فورج سخت‌کاری‌شده که با درگیر شدن بر روی تیغه ریل، کابین را با شتاب شتاب منفی کنترل‌شده بین 0.2g تا 1.0g متوقف می‌سازد." 
                      : "Mounted on lower car sling plank with forged alloy steel wedges stopping the fully loaded car smoothly between 0.2g and 1.0g."}
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

              {/* ISO 7465 Guide Rails */}
              {activeComponent === "rails" && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-lg font-bold text-sky-400 font-mono">
                      {isFa ? "ریل‌های راهنمای نورد سرد و ماشین‌کاری شده (ISO 7465 T-Rails)" : "Machined & Cold-Drawn Guide Rails (ISO 7465)"}
                    </h4>
                    <span className="text-xs font-mono text-emerald-400 font-bold">استاندارد ملی ISIRI 6303</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isFa 
                      ? "مقاطع فولادی T شکل مطابق استاندارد بین‌المللی ISO 7465 و استاندارد ملی ایران. مقاطع T70/A برای وزنه تعادل و T89/B و T125/B برای کابین با اتصال فاق و زبانه (Tongue & Groove) و صفحات اتصال ماهیچه‌ای تقویت‌شده." 
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
                      <span className="text-slate-400 block text-[10px]">{isFa ? "فاصله مجاز براکت‌ها:" : "Bracket Span:"}</span>
                      <span className="text-emerald-400 font-bold text-sm">≤ 2500 mm</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Hydraulic Oil Buffer */}
              {activeComponent === "buffer" && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-lg font-bold text-amber-400 font-mono">
                      {isFa ? "ضربه‌گیرهای هیدرولیک اتلاف انرژی کف چاهک (Hydraulic Oil Buffers)" : "Hydraulic Dissipation Energy Oil Buffers"}
                    </h4>
                    <span className="text-xs font-mono text-emerald-400 font-bold">بند ۱۰-۳ استاندارد ۶۳۰۳</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isFa 
                      ? "مستقر در کف چاهک در زیر کابین و وزنه تعادل. برای سرعت‌های بیش از ۱ متر بر ثانیه، ضربه‌گیر هیدرولیکی الزامی بوده و کورس مفید آن حداقل Sb = 0.0674 × v² متر با سوئیچ الکتریکی نظارت بر بازگشت پیستون است." 
                      : "Energy dissipation hydraulic oil buffers required for speeds exceeding 1.0 m/s with return switch compliance."}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-2">
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "کورس مفید ضربه‌گیر:" : "Stroke (Sb):"}</span>
                      <span className="text-amber-400 font-bold text-sm">{bufferStroke} mm (v = {speed}m/s)</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "روغن هیدرولیک بافر:" : "Hydraulic Fluid:"}</span>
                      <span className="text-white font-bold text-sm">ISO VG 46 Anti-Wear</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isFa ? "شتاب کاهنده متوسط:" : "Max Deceleration:"}</span>
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
