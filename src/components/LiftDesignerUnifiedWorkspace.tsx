"use client";

import React, { useState } from "react";
import { 
  Compass, 
  Layers, 
  Box, 
  FileSpreadsheet, 
  Calculator, 
  Columns2, 
  Maximize2, 
  ShieldCheck, 
  Download, 
  Printer, 
  Settings2,
  Cpu,
  Zap,
  Activity,
  PhoneCall
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Locale } from "@/lib/dictionary";
import { LiftDesignerCADStudio } from "./LiftDesignerCADStudio";
import { ThreeCADShaftViewer } from "./ThreeCADShaftViewer";
import { ElevatorMaterialBOMTable } from "./ElevatorMaterialBOMTable";
import { TractionCalculator } from "./TractionCalculator";
import { ProjectMaterialEstimator } from "./ProjectMaterialEstimator";

export interface LiftDesignerUnifiedWorkspaceProps {
  locale: Locale | string;
}

export type WorkspaceTab = "estimator" | "3d" | "dwg" | "bom" | "calculations" | "split";

export function LiftDesignerUnifiedWorkspace({ locale }: LiftDesignerUnifiedWorkspaceProps) {
  const currentLocale: Locale = locale === "fa" ? "fa" : "en";
  const isFa = currentLocale === "fa";

  // Active Tab
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("estimator");

  // Synchronized Global Parameters
  const [capacity, setCapacity] = useState<number>(630); // 8 passengers
  const [speed, setSpeed] = useState<number>(1.0); // m/s
  const [suspension, setSuspension] = useState<"1:1" | "2:1" | "4:1" | "cantilever">("2:1");
  const [cwtPosition, setCwtPosition] = useState<"rear" | "right" | "left">("rear");

  const tabs = [
    {
      id: "estimator" as WorkspaceTab,
      labelFa: "محاسبات پروژه و پیش‌فاکتور ایران",
      labelEn: "Project Estimator & Quotation",
      icon: FileSpreadsheet,
      badge: isFa ? "مشخصات کارفرما و متریال" : "Project RFQ"
    },
    {
      id: "3d" as WorkspaceTab,
      labelFa: "شبیه‌ساز ۳D چاه و طراحی کابین",
      labelEn: "3D BIM & Cabin Design",
      icon: Box,
      badge: isFa ? "حرکت، کابین و بکسل" : "Kinematics & Cabin"
    },
    {
      id: "dwg" as WorkspaceTab,
      labelFa: "نقشه‌کشی دوبعدی (CAD DWG)",
      labelEn: "2D CAD Studio (DWG)",
      icon: Compass,
      badge: isFa ? "پلان و مقطع اتوکد" : "Plan & Section"
    },
    {
      id: "bom" as WorkspaceTab,
      labelFa: "جدول صورت متریال (BOM)",
      labelEn: "Material BOM Schedule",
      icon: Layers,
      badge: isFa ? "دیتابیس لیفت‌دیزاینر" : "DigiPara Database"
    },
    {
      id: "calculations" as WorkspaceTab,
      labelFa: "محاسبات استاندارد ۶۳۰۳ و کشش",
      labelEn: "ISIRI 6303 Calculations",
      icon: Calculator,
      badge: isFa ? "توان، گشتاور و اصطکاک" : "Traction Engine"
    },
    {
      id: "split" as WorkspaceTab,
      labelFa: "نمای دوتایی همزمان (2D + 3D)",
      labelEn: "Split View (CAD + 3D)",
      icon: Columns2,
      badge: isFa ? "نظارت همزمان" : "Dual View"
    }
  ];

  return (
    <div className="space-y-6 font-vazir">
      {/* ==============================================================
          CAD WORKSTATION RIBBON BAR (DigiPara LiftDesigner 2020 Style)
      ============================================================== */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Top Header: Title, Standard & Developer Attribution */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 shadow-inner">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-black text-white font-mono tracking-tight">
                  {isFa ? "میز کار مهندسی جامع لیفت‌دیزاینر (DigiPara LiftDesigner Suite)" : "VERTEX DigiPara LiftDesigner™ CAD Suite"}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  ISIRI 6303-1 / EN 81-20
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isFa 
                  ? "مجموعه یکپارچه طراحی پارامتریک آسانسور: نقشه‌کشی اتوکد، مدل سه‌بعدی سینماتیک، جدول صورت متریال و محاسبات مهندسی" 
                  : "Integrated parametric elevator engineering: 2D AutoCAD DWG, 3D BIM kinematics, full BOM material schedule, and EN 81 calculations."}
              </p>
            </div>
          </div>

          {/* Developer Attribution Card */}
          <div className="flex items-center gap-2 p-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
            <span className="text-slate-400">{isFa ? "طراح و برنامه‌نویس:" : "Dev:"}</span>
            <span className="font-bold text-white">{isFa ? "سید سجاد طباطبایی" : "S. S. Tabatabaei"}</span>
            <span className="text-slate-600">|</span>
            <a 
              href="tel:09013356283" 
              className="text-sky-400 font-bold hover:underline flex items-center gap-1"
              dir="ltr"
            >
              <PhoneCall className="w-3 h-3 text-sky-400" />
              <span>09013356283</span>
            </a>
          </div>
        </div>

        {/* CAD Ribbon Mode Switcher Tabs */}
        <div className="px-3 py-2 sm:px-4 bg-slate-900/90 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap",
                  isActive
                    ? "bg-sky-600 text-white shadow-lg shadow-sky-600/30 border border-sky-400/40"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400")} />
                <span>{isFa ? tab.labelFa : tab.labelEn}</span>
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-md",
                  isActive ? "bg-sky-700/80 text-sky-100" : "bg-slate-800 text-slate-400"
                )}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==============================================================
          ACTIVE WORKSPACE TAB CONTENT (Focused, Clean & Uncluttered)
      ============================================================== */}
      <div className="transition-all duration-300">
        {/* TAB 0: PROJECT MATERIAL ESTIMATOR & IRANIAN RFQ */}
        {activeTab === "estimator" && (
          <div className="space-y-4">
            <ProjectMaterialEstimator locale={currentLocale} />
          </div>
        )}

        {/* TAB 1: 3D BIM & CABIN DESIGN */}
        {activeTab === "3d" && (
          <div className="space-y-4">
            <ThreeCADShaftViewer locale={currentLocale} />
          </div>
        )}

        {/* TAB 2: 2D CAD STUDIO */}
        {activeTab === "dwg" && (
          <div className="space-y-4">
            <LiftDesignerCADStudio locale={currentLocale} />
          </div>
        )}

        {/* TAB 3: MATERIAL BOM & SIZING SCHEDULE */}
        {activeTab === "bom" && (
          <div className="space-y-4">
            <ElevatorMaterialBOMTable
              locale={currentLocale}
              initialCapacity={capacity}
              initialSpeed={speed}
              initialSuspension={suspension}
              initialCwtPosition={cwtPosition}
              onParamsChange={(p) => {
                setCapacity(p.capacity);
                setSpeed(p.speed);
                setSuspension(p.suspension);
                setCwtPosition(p.cwtPosition);
              }}
            />
          </div>
        )}

        {/* TAB 4: ISIRI 6303 TRACTION & KINEMATICS CALCULATOR */}
        {activeTab === "calculations" && (
          <div className="space-y-4">
            <TractionCalculator locale={currentLocale} />
          </div>
        )}

        {/* TAB 5: SPLIT VIEW (2D CAD + 3D VIEWER SIDE-BY-SIDE) */}
        {activeTab === "split" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-sky-600" />
                  {isFa ? "پلان و مقطع اتوکد (2D DWG)" : "2D AutoCAD DWG"}
                </span>
                <span className="text-[10px] font-mono text-slate-400">AutoCAD DXF Engine</span>
              </div>
              <LiftDesignerCADStudio locale={currentLocale} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Box className="w-4 h-4 text-emerald-600" />
                  {isFa ? "شبیه‌ساز سه‌بعدی و سینماتیک چاه (3D BIM)" : "3D Hoistway Kinematics"}
                </span>
                <span className="text-[10px] font-mono text-slate-400">Three.js WebGL Engine</span>
              </div>
              <ThreeCADShaftViewer locale={currentLocale} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
