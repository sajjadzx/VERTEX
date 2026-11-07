"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import { Locale, dictionary } from "@/lib/dictionary";
import { SHOWCASE_PROJECTS, ProjectItem } from "@/lib/constants";
import { TechBadge } from "@/components/TechBadge";
import { ShieldAlert, ArrowUpRight, Building2, MapPin } from "lucide-react";

export default function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const currentLocale = (locale === "fa" ? "fa" : "en") as Locale;
  const dict = dictionary[currentLocale];
  const isFa = currentLocale === "fa";

  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredProjects = SHOWCASE_PROJECTS.filter((p) => {
    if (activeCategory === "all") return true;
    return p.category === activeCategory;
  });

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <TechBadge variant="cyan">{dict.projects.badge}</TechBadge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-vertex-ice font-mono tracking-tight">
          {dict.projects.title}
        </h1>
        <p className="text-base sm:text-lg text-vertex-steel font-light leading-relaxed">
          {dict.projects.subtitle}
        </p>

        {/* Notice of showcase */}
        <div className="p-3.5 rounded-xl bg-vertex-surface/60 border border-vertex-border flex items-start gap-2.5 text-xs text-vertex-steel max-w-2xl mx-auto text-left">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {dict.projects.disclaimer}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[
          { id: "all", label: dict.projects.all },
          { id: "commercial", label: dict.projects.commercial },
          { id: "transit", label: dict.projects.transit },
          { id: "hospitality", label: dict.projects.hospitality },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
              activeCategory === tab.id
                ? "bg-vertex-cyan text-vertex-deep font-bold shadow-cyan"
                : "bg-vertex-surface/80 text-vertex-steel border border-vertex-border hover:border-vertex-cyan/40 hover:text-vertex-ice"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            className="group rounded-2xl bg-vertex-surface border border-vertex-border overflow-hidden hover:border-vertex-cyan/50 transition-all duration-300 shadow-card flex flex-col justify-between"
          >
            <div className="relative w-full aspect-[16/11] bg-vertex-deep overflow-hidden">
              <Image
                src={p.image}
                alt={isFa ? p.titleFa : p.titleEn}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-100"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-vertex-deep/90 border border-vertex-border text-[11px] font-mono font-bold text-vertex-cyan">
                {p.speed}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-vertex-steel font-mono">
                  <MapPin className="w-3.5 h-3.5 text-vertex-cyan shrink-0" />
                  <span>{isFa ? p.locationFa : p.locationEn}</span>
                </div>

                <h3 className="text-xl font-bold font-mono text-vertex-ice mt-2 group-hover:text-vertex-cyan transition-colors">
                  {isFa ? p.titleFa : p.titleEn}
                </h3>

                <p className="text-xs text-vertex-steel/90 mt-2 font-light">
                  {p.units}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-vertex-border/60 grid grid-cols-2 gap-4 text-xs font-mono text-vertex-steel">
                <div>
                  <span className="text-[10px] text-vertex-steel/70 block">
                    {isFa ? "طبقات سازه:" : "Building Levels:"}
                  </span>
                  <span className="text-vertex-ice font-bold">{p.floors} Levels</span>
                </div>
                <div>
                  <span className="text-[10px] text-vertex-steel/70 block">
                    {isFa ? "ارتفاع کل:" : "Total Height:"}
                  </span>
                  <span className="text-vertex-cyan font-bold">{p.height}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
