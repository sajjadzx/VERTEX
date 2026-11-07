"use client";

import React, { useState } from "react";
import { Locale, dictionary } from "@/lib/dictionary";
import { TechBadge } from "./TechBadge";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  RotateCw, 
  Server, 
  Sliders, 
  Thermometer, 
  Wrench,
  ShieldAlert,
  Radio
} from "lucide-react";

interface MaintenanceDashboardProps {
  locale: Locale;
}

export function MaintenanceDashboard({ locale }: MaintenanceDashboardProps) {
  const isFa = locale === "fa";
  const dict = dictionary[locale];

  const [filter, setFilter] = useState<"all" | "elevators" | "escalators">("all");
  const [isSimulating, setIsSimulating] = useState(false);
  const [diagnosticLog, setDiagnosticLog] = useState<string[]>([]);

  const units = [
    {
      id: "ELV-T1-01",
      nameEn: "Lumina Pinnacle Car #01 (High-Rise)",
      nameFa: "آسانسور شماره ۱ برج لومینا (پرسرعت)",
      type: "elevator",
      status: "optimal",
      healthScore: 99.4,
      cycles: 184520,
      vibration: "0.08 m/s² (Normal)",
      motorTemp: "41.2 °C",
      lastService: "2026-10-15",
      nextService: "2026-12-15",
      cableWear: "4.2%",
    },
    {
      id: "ELV-T1-02",
      nameEn: "Lumina Pinnacle Car #02 (High-Rise)",
      nameFa: "آسانسور شماره ۲ برج لومینا (پرسرعت)",
      type: "elevator",
      status: "optimal",
      healthScore: 98.1,
      cycles: 172900,
      vibration: "0.10 m/s² (Normal)",
      motorTemp: "43.8 °C",
      lastService: "2026-10-15",
      nextService: "2026-12-15",
      cableWear: "5.8%",
    },
    {
      id: "ESC-TR-04",
      nameEn: "Terminal 4 Concourse B Heavy Escalator",
      nameFa: "پله‌برقی سنگین‌کار سالن ترانزیت فرودگاه",
      type: "escalator",
      status: "warning",
      healthScore: 92.5,
      cycles: 541000,
      vibration: "0.22 m/s² (Moderate)",
      motorTemp: "54.1 °C",
      lastService: "2026-09-20",
      nextService: "2026-11-20 (Scheduled)",
      cableWear: "N/A (Chain drive)",
    },
    {
      id: "ELV-MRL-08",
      nameEn: "Horizon Plaza MRL Lift #03",
      nameFa: "آسانسور بدون موتورخانه هورایزن ۳",
      type: "elevator",
      status: "optimal",
      healthScore: 97.9,
      cycles: 89400,
      vibration: "0.06 m/s² (Normal)",
      motorTemp: "38.5 °C",
      lastService: "2026-10-02",
      nextService: "2026-12-02",
      cableWear: "2.1%",
    },
  ];

  const filteredUnits = units.filter((u) => {
    if (filter === "elevators") return u.type === "elevator";
    if (filter === "escalators") return u.type === "escalator";
    return true;
  });

  const triggerSyntheticPing = () => {
    setIsSimulating(true);
    const timestamp = new Date().toLocaleTimeString();
    const logMsg = isFa
      ? `[${timestamp}] پینگ شبیه‌سازی دیاگ اینترنت اشیاء: ارتباط با ۴ واحد با موفقیت برقرار شد. بدون خطای بحرانی.`
      : `[${timestamp}] Synthetic IoT Health Ping: 4 units responded. 0 critical telemetry faults.`;
    setDiagnosticLog((prev) => [logMsg, ...prev.slice(0, 4)]);
    setTimeout(() => setIsSimulating(false), 1200);
  };

  return (
    <div className="w-full bg-vertex-surface/80 border border-vertex-border rounded-2xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl">
      {/* Disclaimer Banner */}
      <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider block">
            {isFa ? "شبیه‌ساز آموزشی و نمایشی پورتفولیو (DEMO)" : "SIMULATED TELEMETRY ENVIRONMENT (DEMO)"}
          </span>
          <p className="text-xs text-vertex-steel mt-0.5 leading-relaxed">
            {dict.maintenance.simulatedNotice}
          </p>
        </div>
      </div>

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-vertex-border gap-4">
        <div>
          <TechBadge variant="emerald" icon={<Radio className="w-3.5 h-3.5 animate-pulse" />}>
            {isFa ? "مرکز تلمتری هوشمند ناوگان" : "FLEET IOT TELEMETRY SIMULATOR"}
          </TechBadge>
          <h3 className="text-2xl lg:text-3xl font-extrabold text-vertex-ice mt-2 font-mono">
            {isFa ? "داشبورد شبیه‌ساز نگهداری و عیب‌یابی" : "Predictive Maintenance Center"}
          </h3>
          <p className="text-sm text-vertex-steel mt-1 max-w-xl font-light">
            {isFa
              ? "پایش الگوریتمی سلامت الکتروموتورها، ارتعاش یاتاقان‌ها و چرخه‌های باز و بسته شدن درب‌ها."
              : "Algorithmic health scoring, bearing vibration sensors, and door cycle diagnostics."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* Filters */}
          <div className="flex p-1 rounded-lg bg-vertex-deep border border-vertex-border text-xs font-mono">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded transition-all ${
                filter === "all"
                  ? "bg-vertex-cyan text-vertex-deep font-bold"
                  : "text-vertex-steel hover:text-vertex-ice"
              }`}
            >
              {isFa ? "همه واحدها" : "All Units"}
            </button>
            <button
              onClick={() => setFilter("elevators")}
              className={`px-3 py-1 rounded transition-all ${
                filter === "elevators"
                  ? "bg-vertex-cyan text-vertex-deep font-bold"
                  : "text-vertex-steel hover:text-vertex-ice"
              }`}
            >
              {isFa ? "آسانسورها" : "Elevators"}
            </button>
            <button
              onClick={() => setFilter("escalators")}
              className={`px-3 py-1 rounded transition-all ${
                filter === "escalators"
                  ? "bg-vertex-cyan text-vertex-deep font-bold"
                  : "text-vertex-steel hover:text-vertex-ice"
              }`}
            >
              {isFa ? "پله‌برقی‌ها" : "Escalators"}
            </button>
          </div>

          {/* Synthetic Ping button */}
          <button
            onClick={triggerSyntheticPing}
            disabled={isSimulating}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono font-semibold rounded-lg bg-vertex-deep border border-vertex-cyan/40 text-vertex-cyan hover:bg-vertex-cyan hover:text-vertex-deep transition-all shadow-glow"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin" : ""}`} />
            <span>{isFa ? "پینگ دیاگ سنسورها" : "Trigger Diagnostic"}</span>
          </button>
        </div>
      </div>

      {/* Fleet Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="p-4 rounded-xl bg-vertex-deep/90 border border-vertex-border">
          <div className="flex items-center justify-between text-xs font-mono text-vertex-steel">
            <span>{isFa ? "واحدهای فعال" : "Online Fleet"}</span>
            <Server className="w-3.5 h-3.5 text-vertex-cyan" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-vertex-ice mt-2">
            4 / 4
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1">
            100% Connected
          </div>
        </div>

        <div className="p-4 rounded-xl bg-vertex-deep/90 border border-vertex-border">
          <div className="flex items-center justify-between text-xs font-mono text-vertex-steel">
            <span>{isFa ? "میانگین شاخص سلامت" : "Mean Health Index"}</span>
            <Activity className="w-3.5 h-3.5 text-vertex-cyan" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-vertex-cyan mt-2">
            97.0%
          </div>
          <div className="text-[11px] text-vertex-steel font-mono mt-1">
            Algorithmic score
          </div>
        </div>

        <div className="p-4 rounded-xl bg-vertex-deep/90 border border-vertex-border">
          <div className="flex items-center justify-between text-xs font-mono text-vertex-steel">
            <span>{isFa ? "سرویس‌های آتی" : "Upcoming Service"}</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-amber-400 mt-2">
            1 Unit
          </div>
          <div className="text-[11px] text-vertex-steel font-mono mt-1">
            Within 14 days
          </div>
        </div>

        <div className="p-4 rounded-xl bg-vertex-deep/90 border border-vertex-border">
          <div className="flex items-center justify-between text-xs font-mono text-vertex-steel">
            <span>{isFa ? "مجموع چرخه‌ها" : "Total Cycles"}</span>
            <Wrench className="w-3.5 h-3.5 text-vertex-cyan" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-vertex-ice mt-2">
            987.8K
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1">
            0 Fault lockdowns
          </div>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="border-b border-vertex-border text-vertex-steel uppercase tracking-wider">
              <th className="py-3 px-4">{isFa ? "کد تجهیز / مدل" : "Unit ID & Model"}</th>
              <th className="py-3 px-4">{isFa ? "وضعیت سنسور" : "Status"}</th>
              <th className="py-3 px-4">{isFa ? "شاخص سلامت" : "Health"}</th>
              <th className="py-3 px-4">{isFa ? "دما و لرزش" : "Temp / Vibration"}</th>
              <th className="py-3 px-4">{isFa ? "چرخه‌های کاری" : "Duty Cycles"}</th>
              <th className="py-3 px-4">{isFa ? "سرویس بعدی" : "Next Inspection"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-vertex-border/60">
            {filteredUnits.map((u) => (
              <tr
                key={u.id}
                className="hover:bg-vertex-deep/60 transition-colors text-vertex-ice"
              >
                <td className="py-4 px-4">
                  <div className="font-bold text-vertex-ice">{u.id}</div>
                  <div className="text-[11px] text-vertex-steel font-sans">
                    {isFa ? u.nameFa : u.nameEn}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      u.status === "optimal"
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    {u.status === "optimal" ? "Optimal" : "Check Soon"}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{u.healthScore}%</span>
                    <div className="w-16 h-1.5 bg-vertex-deep rounded-full overflow-hidden">
                      <div
                        className="h-full bg-vertex-cyan rounded-full"
                        style={{ width: `${u.healthScore}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>{u.motorTemp}</div>
                  <div className="text-[10px] text-vertex-steel">{u.vibration}</div>
                </td>
                <td className="py-4 px-4">
                  {u.cycles.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-vertex-steel">
                  {u.nextService}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dynamic Simulated Telemetry Log stream */}
      {diagnosticLog.length > 0 && (
        <div className="mt-6 p-4 rounded-xl bg-vertex-deep border border-vertex-border font-mono text-[11px] text-vertex-cyan space-y-1">
          <div className="text-vertex-steel text-[10px] uppercase tracking-wider mb-1 font-bold">
            {isFa ? "لاگ‌های دریافتی تلمتری شبیه‌سازی شده:" : "Synthetic Telemetry Stream:"}
          </div>
          {diagnosticLog.map((log, idx) => (
            <div key={idx} className="leading-relaxed">
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
