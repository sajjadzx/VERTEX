"use client";

import React, { useState } from "react";
import { Locale, dictionary } from "@/lib/dictionary";
import { TechBadge } from "./TechBadge";
import { 
  Sparkles, 
  Check, 
  Copy, 
  Layers, 
  Sun, 
  Grid, 
  Maximize2,
  Sliders,
  ChevronRight,
  ShieldAlert
} from "lucide-react";

interface InteractiveConfiguratorProps {
  locale: Locale;
}

export function InteractiveConfigurator({ locale }: InteractiveConfiguratorProps) {
  const dict = dictionary[locale];
  const isFa = locale === "fa";

  // Wall finishes
  const wallFinishes = [
    {
      id: "titanium",
      nameEn: "Brushed Smoked Titanium",
      nameFa: "تیتانیوم دودی خش‌دار",
      color: "#2C3539",
      accent: "#4A5568",
      reflection: "subtle",
      pattern: "linear",
    },
    {
      id: "obsidian",
      nameEn: "Obsidian Mirror Glass",
      nameFa: "شیشه سکوریت آینه‌ای مشکی",
      color: "#0F141C",
      accent: "#1A202C",
      reflection: "high",
      pattern: "gloss",
    },
    {
      id: "rosegold",
      nameEn: "Champagne Bronze Stainless",
      nameFa: "استیل برنز شامپاینی لوکس",
      color: "#6B4A38",
      accent: "#9C6B52",
      reflection: "warm",
      pattern: "brushed",
    },
    {
      id: "carbon",
      nameEn: "Matte Carbon Composite",
      nameFa: "کامپوزیت کربن بافت‌دار مات",
      color: "#181E24",
      accent: "#263238",
      reflection: "matte",
      pattern: "weave",
    },
  ];

  // Floor finishes
  const floorFinishes = [
    {
      id: "calacatta",
      nameEn: "Calacatta White Italian Marble",
      nameFa: "سنگ مرمر کالاکاتا سفید",
      color: "#E2E8F0",
      accent: "#CBD5E1",
      weight: "+160 kg/m²",
    },
    {
      id: "marquina",
      nameEn: "Nero Marquina Black Granite",
      nameFa: "گرانیت سیاه مارکینا با رگه‌های سفید",
      color: "#111827",
      accent: "#1F2937",
      weight: "+190 kg/m²",
    },
    {
      id: "diamond",
      nameEn: "Industrial Diamond Steel Plate",
      nameFa: "ورق آجدار استیل ضدلغزش",
      color: "#374151",
      accent: "#4B5563",
      weight: "+85 kg/m²",
    },
    {
      id: "terrazzo",
      nameEn: "Modern Quartz Terrazzo",
      nameFa: "سنگ مهندسی کوارتز ترازوی مدرن",
      color: "#334155",
      accent: "#475569",
      weight: "+140 kg/m²",
    },
  ];

  // Ceiling styles
  const ceilingStyles = [
    {
      id: "linear-led",
      nameEn: "Linear Recessed LED Louvers",
      nameFa: "سقف نوری خطی توکار لوور",
      type: "linear",
    },
    {
      id: "starfield",
      nameEn: "Acoustic Optical Starfield",
      nameFa: "سقف کهکشانی فیبر نوری آکوستیک",
      type: "dots",
    },
    {
      id: "perimeter-cove",
      nameEn: "Concealed Perimeter Halo Cove",
      nameFa: "نور مخفی محیطی هالو",
      type: "cove",
    },
  ];

  // Lighting Temp
  const lightingTemps = [
    { id: "4000k", nameEn: "4000K Neutral White", nameFa: "نور طبیعی ۴۰۰۰ کلوین", hex: "#FFFFFF" },
    { id: "3000k", nameEn: "3000K Warm Architectural", nameFa: "نور گرم معماری ۳۰۰۰ کلوین", hex: "#FFE8BA" },
    { id: "5000k", nameEn: "5000K High-Tech Cyan", nameFa: "نور سرد تکنولوژیک ۵۰۰۰ کلوین", hex: "#D6FBFF" },
  ];

  // COP Style
  const copStyles = [
    { id: "touch-glass", nameEn: "Flush Glass Smart Touch Screen", nameFa: "پنل تمام لمسی شیشه‌ای فلاش" },
    { id: "push-button", nameEn: "Tactile Micro-Travel Brushed Buttons", nameFa: "شستی‌های مکانیکی برجسته با خط بریل" },
    { id: "pillar-oled", nameEn: "Curved Titanium OLED Column", nameFa: "ستون تیتانیوم خمیده با نمایشگر OLED" },
  ];

  const [selectedWall, setSelectedWall] = useState(wallFinishes[0]);
  const [selectedFloor, setSelectedFloor] = useState(floorFinishes[0]);
  const [selectedCeiling, setSelectedCeiling] = useState(ceilingStyles[0]);
  const [selectedLighting, setSelectedLighting] = useState(lightingTemps[0]);
  const [selectedCop, setSelectedCop] = useState(copStyles[0]);
  const [currentFloorDisplay, setCurrentFloorDisplay] = useState(42);
  const [copied, setCopied] = useState(false);

  const handleCopySpec = () => {
    const spec = `VERTEX ELEVATOR CABIN SPECIFICATION:
- Wall Finish: ${selectedWall.nameEn}
- Floor Material: ${selectedFloor.nameEn}
- Ceiling Architecture: ${selectedCeiling.nameEn}
- Lighting CCT: ${selectedLighting.nameEn}
- Car Operating Panel: ${selectedCop.nameEn}
- Compliance: EN 81-20/50 Class A Fire Rated
Generated via VERTEX Studio Configurator.`;
    navigator.clipboard?.writeText(spec);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full bg-vertex-surface/80 border border-vertex-border rounded-2xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-vertex-border gap-4">
        <div>
          <TechBadge variant="cyan">{dict.configurator.badge}</TechBadge>
          <h3 className="text-2xl lg:text-3xl font-extrabold text-vertex-ice mt-2 font-mono">
            {dict.configurator.title}
          </h3>
          <p className="text-sm text-vertex-steel mt-1 max-w-2xl font-light">
            {dict.configurator.subtitle}
          </p>
        </div>
        <button
          onClick={handleCopySpec}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold rounded-lg bg-vertex-deep border border-vertex-cyan/40 text-vertex-cyan hover:bg-vertex-cyan hover:text-vertex-deep transition-all shadow-glow"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? dict.configurator.copied : dict.configurator.ctaQuote}</span>
        </button>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Left: Live Visual Cabin Preview */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-vertex-border bg-vertex-deep flex flex-col justify-between p-6 shadow-inner">
            {/* Ambient Lighting Gradient based on Selected Color */}
            <div
              className="absolute inset-0 pointer-events-none transition-colors duration-500 opacity-20"
              style={{
                background: `radial-gradient(circle at 50% 15%, ${selectedLighting.hex} 0%, transparent 75%)`,
              }}
            />

            {/* Ceiling Structure */}
            <div className="relative z-10 w-full h-14 rounded-lg bg-vertex-navy/90 border border-vertex-steel/30 p-2 flex items-center justify-around shadow-lg">
              {selectedCeiling.type === "linear" && (
                <div className="flex items-center justify-around w-full gap-4 px-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-2 flex-1 rounded-full shadow-[0_0_12px_currentColor] transition-all"
                      style={{ backgroundColor: selectedLighting.hex, color: selectedLighting.hex }}
                    />
                  ))}
                </div>
              )}
              {selectedCeiling.type === "dots" && (
                <div className="grid grid-cols-8 gap-3 w-full px-6 place-items-center">
                  {[...Array(16)].map((_, i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full shadow-glow transition-all"
                      style={{ backgroundColor: selectedLighting.hex }}
                    />
                  ))}
                </div>
              )}
              {selectedCeiling.type === "cove" && (
                <div
                  className="w-full h-full rounded border transition-all flex items-center justify-center font-mono text-[10px] tracking-widest text-vertex-ice/70"
                  style={{
                    borderColor: selectedLighting.hex,
                    boxShadow: `inset 0 0 15px ${selectedLighting.hex}`,
                  }}
                >
                  CONCEALED AMBIENT HALO COVE
                </div>
              )}
            </div>

            {/* Cabin Walls Perspective View */}
            <div className="relative z-10 my-4 flex-1 flex rounded-lg border border-vertex-border/60 overflow-hidden shadow-2xl">
              {/* Left Wall Perspective */}
              <div
                className="w-1/4 h-full border-r border-vertex-border/80 transition-all duration-300 relative flex flex-col justify-center items-center"
                style={{ backgroundColor: selectedWall.color }}
              >
                {/* Horizontal Brushed / Pattern lines */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                <div className="w-full h-0.5 bg-vertex-steel/40 shadow-sm my-6" />
                <span className="text-[10px] font-mono text-vertex-ice/60 rotate-90">
                  {isFa ? "دیواره جانبی" : "SIDE PANEL"}
                </span>
              </div>

              {/* Back Wall (Center Main) */}
              <div
                className="flex-1 h-full relative transition-all duration-300 p-4 flex flex-col justify-between"
                style={{ backgroundColor: selectedWall.color }}
              >
                {/* Wall reflections */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/10" />

                {/* Handrail */}
                <div className="relative z-10 w-full mt-auto mb-10 h-3 bg-gradient-to-r from-vertex-steel via-vertex-ice to-vertex-steel rounded shadow-md border-y border-white/40 flex items-center justify-between px-4">
                  <span className="w-1.5 h-6 bg-vertex-border rounded -mt-2" />
                  <span className="text-[9px] font-mono text-vertex-deep font-bold tracking-wider">
                    VERTEX RAIL
                  </span>
                  <span className="w-1.5 h-6 bg-vertex-border rounded -mt-2" />
                </div>
              </div>

              {/* Right Wall with COP (Car Operating Panel) */}
              <div
                className="w-1/3 h-full border-l border-vertex-border/80 transition-all duration-300 relative p-3 flex flex-col items-center justify-center"
                style={{ backgroundColor: selectedWall.color }}
              >
                <div className="absolute inset-0 bg-gradient-to-l from-black/40 to-transparent" />
                
                {/* Car Operating Panel (COP) Render */}
                <div className="relative z-10 w-16 sm:w-20 bg-vertex-deep/95 border border-vertex-cyan/50 rounded-lg p-2 flex flex-col items-center shadow-cyan">
                  {/* Digital Floor Indicator Display */}
                  <div className="w-full py-1 bg-black rounded border border-vertex-cyan/40 text-center font-mono text-xs font-black text-vertex-cyan flex items-center justify-center gap-1">
                    <span className="text-[9px] animate-pulse">▲</span>
                    <span>{currentFloorDisplay}</span>
                  </div>

                  {/* COP style display */}
                  <div className="mt-3 space-y-1.5 w-full">
                    {selectedCop.id === "touch-glass" ? (
                      <div className="w-full space-y-1">
                        <div className="w-full h-1 bg-vertex-cyan/60 rounded" />
                        <div className="w-full h-8 bg-vertex-surface/60 border border-vertex-border rounded text-[8px] font-mono text-center flex items-center justify-center text-vertex-ice">
                          TOUCH UI
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-1 place-items-center">
                        {[40, 41, 42, 43].map((fl) => (
                          <button
                            key={fl}
                            onClick={() => setCurrentFloorDisplay(fl)}
                            className={`w-6 h-6 rounded-full text-[9px] font-mono font-bold flex items-center justify-center border transition-all ${
                              currentFloorDisplay === fl
                                ? "bg-vertex-cyan text-vertex-deep border-vertex-cyan"
                                : "bg-vertex-surface text-vertex-ice border-vertex-steel/40 hover:border-vertex-cyan"
                            }`}
                          >
                            {fl}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Floor Perspective */}
            <div
              className="relative z-10 w-full h-14 rounded-lg border border-vertex-steel/40 transition-all duration-300 p-2 flex items-center justify-center shadow-lg"
              style={{ backgroundColor: selectedFloor.color }}
            >
              <div className="w-full h-full border border-white/20 rounded flex items-center justify-center">
                <span className="text-xs font-mono font-bold tracking-widest text-vertex-ice/90 drop-shadow">
                  {isFa ? selectedFloor.nameFa : selectedFloor.nameEn}
                </span>
              </div>
            </div>

            {/* Live Indicator Badges */}
            <div className="mt-3 flex items-center justify-between text-xs font-mono text-vertex-steel">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-vertex-cyan shadow-cyan animate-pulse" />
                {isFa ? "شبیه‌سازی زنده کابین" : "Real-Time Viewport"}
              </span>
              <span>{isFa ? "استاندارد: EN 81-20" : "Norm: EN 81-20 Compliant"}</span>
            </div>
          </div>

          {/* Preliminary disclaimer banner */}
          <div className="mt-3 p-3 rounded-lg bg-vertex-deep/60 border border-vertex-border flex items-start gap-2.5 text-xs text-vertex-steel">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {dict.configurator.disclaimer}
            </p>
          </div>
        </div>

        {/* Right: Controls & Selectors */}
        <div className="lg:col-span-5 space-y-6">
          {/* Wall selector */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-vertex-ice font-semibold flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-vertex-cyan" />
                {dict.configurator.wallFinish}
              </span>
              <span className="text-vertex-cyan text-[11px]">
                {isFa ? selectedWall.nameFa : selectedWall.nameEn}
              </span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {wallFinishes.map((wall) => (
                <button
                  key={wall.id}
                  onClick={() => setSelectedWall(wall)}
                  className={`p-2.5 rounded-lg border text-left transition-all flex items-center gap-2.5 ${
                    selectedWall.id === wall.id
                      ? "border-vertex-cyan bg-vertex-cyan/15 text-vertex-ice shadow-glow"
                      : "border-vertex-border bg-vertex-deep/60 text-vertex-steel hover:border-vertex-steel/40"
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-white/30 shrink-0"
                    style={{ backgroundColor: wall.color }}
                  />
                  <span className="text-xs font-medium truncate">
                    {isFa ? wall.nameFa : wall.nameEn}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Floor selector */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-vertex-ice font-semibold flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5">
                <Grid className="w-3.5 h-3.5 text-vertex-cyan" />
                {dict.configurator.floorFinish}
              </span>
              <span className="text-vertex-cyan text-[11px]">
                {isFa ? selectedFloor.nameFa : selectedFloor.nameEn}
              </span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {floorFinishes.map((floor) => (
                <button
                  key={floor.id}
                  onClick={() => setSelectedFloor(floor)}
                  className={`p-2.5 rounded-lg border text-left transition-all flex items-center gap-2.5 ${
                    selectedFloor.id === floor.id
                      ? "border-vertex-cyan bg-vertex-cyan/15 text-vertex-ice shadow-glow"
                      : "border-vertex-border bg-vertex-deep/60 text-vertex-steel hover:border-vertex-steel/40"
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded border border-white/30 shrink-0"
                    style={{ backgroundColor: floor.color }}
                  />
                  <div className="flex flex-col truncate">
                    <span className="text-xs font-medium truncate">
                      {isFa ? floor.nameFa : floor.nameEn}
                    </span>
                    <span className="text-[10px] text-vertex-steel/70 font-mono">
                      {floor.weight}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Ceiling selector */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-vertex-ice font-semibold flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-vertex-cyan" />
                {dict.configurator.ceilingStyle}
              </span>
            </label>
            <div className="space-y-2">
              {ceilingStyles.map((ceil) => (
                <button
                  key={ceil.id}
                  onClick={() => setSelectedCeiling(ceil)}
                  className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between ${
                    selectedCeiling.id === ceil.id
                      ? "border-vertex-cyan bg-vertex-cyan/15 text-vertex-ice"
                      : "border-vertex-border bg-vertex-deep/60 text-vertex-steel hover:border-vertex-steel/40"
                  }`}
                >
                  <span className="text-xs font-medium">
                    {isFa ? ceil.nameFa : ceil.nameEn}
                  </span>
                  {selectedCeiling.id === ceil.id && (
                    <Check className="w-4 h-4 text-vertex-cyan" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Lighting Temp */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-vertex-ice font-semibold flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-vertex-cyan" />
                {dict.configurator.lightingColor}
              </span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {lightingTemps.map((temp) => (
                <button
                  key={temp.id}
                  onClick={() => setSelectedLighting(temp)}
                  className={`p-2 rounded-lg border text-center transition-all flex flex-col items-center gap-1 ${
                    selectedLighting.id === temp.id
                      ? "border-vertex-cyan bg-vertex-cyan/15 text-vertex-ice"
                      : "border-vertex-border bg-vertex-deep/60 text-vertex-steel hover:border-vertex-steel/40"
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: temp.hex }}
                  />
                  <span className="text-[11px] font-mono font-medium">
                    {temp.id.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* COP style */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-vertex-ice font-semibold flex items-center justify-between mb-2">
              <span>{dict.configurator.copStyle}</span>
            </label>
            <div className="space-y-2">
              {copStyles.map((cop) => (
                <button
                  key={cop.id}
                  onClick={() => setSelectedCop(cop)}
                  className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between ${
                    selectedCop.id === cop.id
                      ? "border-vertex-cyan bg-vertex-cyan/15 text-vertex-ice"
                      : "border-vertex-border bg-vertex-deep/60 text-vertex-steel hover:border-vertex-steel/40"
                  }`}
                >
                  <span className="text-xs font-medium">
                    {isFa ? cop.nameFa : cop.nameEn}
                  </span>
                  {selectedCop.id === cop.id && (
                    <Check className="w-4 h-4 text-vertex-cyan" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
