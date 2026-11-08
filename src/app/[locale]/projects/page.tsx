"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import { Locale, dictionary } from "@/lib/dictionary";
import { SHOWCASE_PROJECTS, ProjectItem } from "@/lib/constants";
import { TechBadge } from "@/components/TechBadge";
import { ProjectWorldMap } from "@/components/ProjectWorldMap";
import { PageInterconnect } from "@/components/PageInterconnect";
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
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-16 bg-vertex-bg">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <TechBadge variant="blueprint">{dict.projects.badge}</TechBadge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-vertex-primary font-mono tracking-tight">
          {dict.projects.title}
        </h1>
        <p className="text-base sm:text-lg text-vertex-secondary font-normal leading-relaxed">
          {dict.projects.subtitle}
        </p>

        {/* Notice of showcase */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900 max-w-2xl mx-auto text-left">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {dict.projects.disclaimer}
          </p>
        </div>
      </div>

      {/* Leaflet GIS Interactive Project Map */}
      <div className="pt-2">
        <ProjectWorldMap locale={currentLocale} />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
        {[
          { id: "all", label: dict.projects.all },
          { id: "commercial", label: dict.projects.commercial },
          { id: "transit", label: dict.projects.transit },
          { id: "hospitality", label: dict.projects.hospitality },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeCategory === tab.id
                ? "bg-vertex-blueprint text-white shadow-sm"
                : "bg-white text-vertex-secondary border border-vertex-borderStrong hover:border-vertex-blueprint"
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
            className="group rounded-2xl bg-white border border-vertex-border overflow-hidden hover:border-vertex-blueprint transition-all duration-300 shadow-card flex flex-col justify-between"
          >
            <div>
              <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden">
                <Image
                  src={p.image}
                  alt={isFa ? p.titleFa : p.titleEn}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-white/95 backdrop-blur-sm border border-vertex-border text-xs font-mono font-bold text-vertex-blueprint shadow-sm">
                  {p.speed}
                </div>
                <div className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded bg-slate-900/80 backdrop-blur-sm text-[10px] font-mono text-white">
                  {p.category.toUpperCase()}
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-vertex-steel font-medium">
                  <MapPin className="w-3.5 h-3.5 text-vertex-blueprint" />
                  <span>{isFa ? p.locationFa : p.locationEn}</span>
                </div>

                <h3 className="text-xl font-black font-mono text-vertex-primary leading-tight">
                  {isFa ? p.titleFa : p.titleEn}
                </h3>

                <div className="pt-2 text-xs font-mono text-vertex-steel">
                  <span className="font-semibold text-vertex-primary">{isFa ? "واحدهای بالابر: " : "Units: "}</span>
                  {p.units}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-vertex-border/60 mt-4 flex items-center justify-between text-xs font-mono text-vertex-steel font-bold">
              <span>{p.floors} {isFa ? "طبقه" : "Floors"}</span>
              <span className="text-vertex-blueprint">{p.height}</span>
            </div>
          </div>
        ))}
      </div>

      <PageInterconnect locale={currentLocale} />
    </div>
  );
}
