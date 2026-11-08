"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Locale } from "@/lib/dictionary";
import { 
  Building2, 
  MapPin, 
  Compass, 
  Gauge, 
  Layers, 
  Zap, 
  ArrowUpRight,
  Filter,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectWorldMapProps {
  locale: Locale;
}

interface ProjectLocation {
  id: string;
  lat: number;
  lng: number;
  titleFa: string;
  titleEn: string;
  cityFa: string;
  cityEn: string;
  countryFa: string;
  countryEn: string;
  category: "highrise" | "transit" | "hospitality" | "medical";
  height: string;
  floors: string;
  speed: string;
  units: string;
  techFa: string;
  techEn: string;
}

const GLOBAL_PROJECTS: ProjectLocation[] = [
  {
    id: "tehran-tower",
    lat: 35.7448,
    lng: 51.3753,
    titleFa: "برج بین‌المللی میلاد و هاب مالی سپهر",
    titleEn: "Milad Commercial & Sepehr Financial Hub",
    cityFa: "تهران",
    cityEn: "Tehran",
    countryFa: "ایران",
    countryEn: "Iran",
    category: "highrise",
    height: "280m",
    floors: "64 طبقه",
    speed: "7.0 m/s",
    units: "18 دستگاه آسانسور Double-Deck",
    techFa: "سیستم هوشمند توزیع مقصد (Destination Dispatch) + بازیافت توان",
    techEn: "Destination Dispatch Algorithm & Energy Regeneration Matrix",
  },
  {
    id: "dubai-zenith",
    lat: 25.1972,
    lng: 55.2744,
    titleFa: "برج زنیث مارینا (Zenith Skyline Tower)",
    titleEn: "Zenith Skyline Tower",
    cityFa: "دبی",
    cityEn: "Dubai",
    countryFa: "امارات",
    countryEn: "UAE",
    category: "highrise",
    height: "390m",
    floors: "88 طبقه",
    speed: "8.0 m/s",
    units: "24 دستگاه بالابر فوق پرسرعت",
    techFa: "کابین‌های آیرودینامیک با پوشش فیبرکربن و ترمز ایمنی مغناطیسی",
    techEn: "Aerodynamic carbon-shroud cabins & magnetic secondary safety gear",
  },
  {
    id: "frankfurt-financial",
    lat: 50.1109,
    lng: 8.6821,
    titleFa: "مرکز مبادلات بانکی مرکزی اروپا",
    titleEn: "Eurozone Central Banking Hub",
    cityFa: "فرانکفورت",
    cityEn: "Frankfurt",
    countryFa: "آلمان",
    countryEn: "Germany",
    category: "highrise",
    height: "220m",
    floors: "52 طبقه",
    speed: "6.0 m/s",
    units: "14 دستگاه آسانسور بدون موتورخانه MRL",
    techFa: "استاندارد بازدهی انرژی ISO 25745 کلاس A+++",
    techEn: "ISO 25745 Class A+++ Energy Efficiency certified",
  },
  {
    id: "doha-metro",
    lat: 25.2854,
    lng: 51.5310,
    titleFa: "ایستگاه مرکزی مترو و پایانه فرودگاهی",
    titleEn: "Doha Grand Metro & Aerotropolis Station",
    cityFa: "دوحه",
    cityEn: "Doha",
    countryFa: "قطر",
    countryEn: "Qatar",
    category: "transit",
    height: "زیرسطحی 38m",
    floors: "4 تراز ترافیکی",
    speed: "0.75 m/s (پله‌برقی)",
    units: "36 یونیت پله‌برقی سنگین ترانزیت + 12 آسانسور تخت‌بر",
    techFa: "استاندارد EN 115-1 سازه‌های ضدخوردگی گالوانیزه گرم خرپا",
    techEn: "Heavy-duty EN 115-1 hot-dip galvanized outdoor trusses",
  },
  {
    id: "istanbul-bosphorus",
    lat: 41.0082,
    lng: 28.9784,
    titleFa: "مجتمع اقامتی و هتل بین‌المللی بسفر",
    titleEn: "Bosphorus Horizon Luxury Resort & Residences",
    cityFa: "استانبول",
    cityEn: "Istanbul",
    countryFa: "ترکیه",
    countryEn: "Turkey",
    category: "hospitality",
    height: "175m",
    floors: "45 طبقه",
    speed: "4.0 m/s",
    units: "10 دستگاه آسانسور پانورامیک شیشه‌ای منحنی",
    techFa: "تزئینات لوکس سنگ استاتوارو، شیشه ضدحرارت و نورپردازی تطبیقی",
    techEn: "Curved glass panoramic shaft with adaptive Italian marble interiors",
  },
  {
    id: "singapore-biomed",
    lat: 1.3521,
    lng: 103.8198,
    titleFa: "مرکز ملی فناوری‌های زیستی و درمانی",
    titleEn: "National Biomedical & Surgical Research Hospital",
    cityFa: "سنگاپور",
    cityEn: "Singapore",
    countryFa: "سنگاپور",
    countryEn: "Singapore",
    category: "medical",
    height: "110m",
    floors: "28 طبقه",
    speed: "3.0 m/s",
    units: "16 دستگاه آسانسور برانکاردبر 2000kg",
    techFa: "کابین‌های آنتی‌باکتریال با فیلتر هپا، تراز دقیق میلیمتر و ژنراتور اضطراری",
    techEn: "HEPA-filtered antibacterial cabins with sub-millimeter leveling",
  },
];

// Inner Leaflet Map Client Component
function LeafletMapInner({ 
  locale, 
  selectedCategory,
  onSelectProject,
  activeProject
}: { 
  locale: Locale; 
  selectedCategory: string;
  onSelectProject: (p: ProjectLocation) => void;
  activeProject: ProjectLocation | null;
}) {
  const isFa = locale === "fa";
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainerId = "vertex-leaflet-map-container";

  useEffect(() => {
    let mapInstance: any = null;
    let markers: any[] = [];

    // Dynamically import Leaflet
    import("leaflet").then((L) => {
      const container = document.getElementById(mapContainerId);
      if (!container) return;

      // Initialize Map centered on Middle East / Eurasia
      mapInstance = L.map(mapContainerId, {
        center: [32.0, 50.0],
        zoom: 3.5,
        minZoom: 2,
        maxZoom: 14,
        zoomControl: false,
      });

      // Add Zoom Control in convenient corner
      L.control.zoom({ position: isFa ? "topleft" : "topright" }).addTo(mapInstance);

      // Clean Light Architectural Map Tiles (CartoDB Positron)
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(mapInstance);

      // Custom Blueprint SVG Marker Icon
      const createCustomIcon = (isActive: boolean) => {
        return L.divIcon({
          className: "custom-cad-pin",
          html: `
            <div style="
              width: ${isActive ? "38px" : "30px"};
              height: ${isActive ? "38px" : "30px"};
              background-color: ${isActive ? "#0284C7" : "#0F172A"};
              border: 2px solid #FFFFFF;
              border-radius: 50%;
              box-shadow: 0 4px 12px rgba(2, 132, 199, 0.4);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-family: monospace;
              font-size: 11px;
              font-weight: bold;
              transition: all 0.3s ease;
              cursor: pointer;
            ">
              <span style="display:inline-block; transform: scale(${isActive ? 1.1 : 0.9})">VTX</span>
            </div>
          `,
          iconSize: [isActive ? 38 : 30, isActive ? 38 : 30],
          iconAnchor: [isActive ? 19 : 15, isActive ? 19 : 15],
        });
      };

      // Add Markers
      const filtered = selectedCategory === "all" 
        ? GLOBAL_PROJECTS 
        : GLOBAL_PROJECTS.filter(p => p.category === selectedCategory);

      filtered.forEach((p) => {
        const isSelected = activeProject?.id === p.id;
        const marker = L.marker([p.lat, p.lng], {
          icon: createCustomIcon(isSelected),
        }).addTo(mapInstance);

        marker.on("click", () => {
          onSelectProject(p);
          mapInstance.flyTo([p.lat, p.lng], 7, { duration: 1.2 });
        });

        markers.push(marker);
      });

      setMapLoaded(true);
    });

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [selectedCategory, activeProject]);

  return (
    <div id={mapContainerId} className="w-full h-full min-h-[460px] rounded-2xl relative z-10" />
  );
}

export function ProjectWorldMap({ locale }: ProjectWorldMapProps) {
  const isFa = locale === "fa";
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeProject, setActiveProject] = useState<ProjectLocation | null>(GLOBAL_PROJECTS[0]);

  const categories = [
    { id: "all", labelFa: "تمام پروژه‌ها (۶)", labelEn: "All Projects (6)" },
    { id: "highrise", labelFa: "برج‌های مرتفع تجاری", labelEn: "High-Rise Commercial" },
    { id: "transit", labelFa: "ایستگاه‌های مترو و فرودگاه", labelEn: "Transit Hubs" },
    { id: "hospitality", labelFa: "هتل‌های لوکس و اقامتی", labelEn: "Luxury Hospitality" },
    { id: "medical", labelFa: "مراکز درمانی و بیمارستانی", labelEn: "Healthcare & Surgical" },
  ];

  return (
    <div className="rounded-2xl border border-vertex-border bg-white shadow-card overflow-hidden">
      {/* Map Header */}
      <div className="p-5 sm:p-6 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-vertex-blueprint flex items-center justify-center text-white shadow-sm">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold font-mono text-white">
                {isFa ? "اطلس پروژه‌ها و پراکندگی جغرافیایی VERTEX" : "VERTEX Global Engineering Footprint"}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-vertex-blueprint/30 text-sky-300 border border-sky-400/30">
                GIS INTERACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isFa 
                ? "نقشه تعاملی پروژه‌های شاخص اجرا شده بر پایه کتابخانه تخصصی Leaflet و کارتوگرافی دقیق شهری" 
                : "Interactive geographic GIS map of signature elevator installations powered by Leaflet"}
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap",
                selectedCategory === cat.id
                  ? "bg-vertex-blueprint text-white shadow-sm"
                  : "bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
              )}
            >
              {isFa ? cat.labelFa : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map + Project Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[500px]">
        {/* Left Map Viewport */}
        <div className="lg:col-span-2 relative h-[420px] sm:h-[500px] border-b lg:border-b-0 lg:border-r border-vertex-border p-3 bg-slate-100">
          <LeafletMapInner
            locale={locale}
            selectedCategory={selectedCategory}
            onSelectProject={setActiveProject}
            activeProject={activeProject}
          />
        </div>

        {/* Right Project Detail Inspection Card */}
        <div className="p-6 bg-slate-50/70 flex flex-col justify-between space-y-6">
          {activeProject ? (
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-vertex-blueprint font-bold uppercase mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    {isFa 
                      ? `${activeProject.cityFa}، ${activeProject.countryFa}` 
                      : `${activeProject.cityEn}, ${activeProject.countryEn}`}
                  </span>
                </div>
                <h4 className="text-lg font-black text-vertex-primary leading-snug">
                  {isFa ? activeProject.titleFa : activeProject.titleEn}
                </h4>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-white border border-vertex-border shadow-sm">
                  <span className="text-[10px] text-vertex-steel block">{isFa ? "ارتفاع سازه:" : "Height:"}</span>
                  <span className="text-sm font-bold text-vertex-primary mt-0.5 block">{activeProject.height}</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-vertex-border shadow-sm">
                  <span className="text-[10px] text-vertex-steel block">{isFa ? "تعداد طبقات:" : "Floors:"}</span>
                  <span className="text-sm font-bold text-vertex-primary mt-0.5 block">{activeProject.floors}</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-vertex-border shadow-sm">
                  <span className="text-[10px] text-vertex-steel block">{isFa ? "بیشینه سرعت:" : "Rated Speed:"}</span>
                  <span className="text-sm font-black text-vertex-blueprint mt-0.5 block">{activeProject.speed}</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-vertex-border shadow-sm">
                  <span className="text-[10px] text-vertex-steel block">{isFa ? "تعداد بالابرها:" : "Total Units:"}</span>
                  <span className="text-xs font-bold text-vertex-secondary mt-0.5 block line-clamp-1">{activeProject.units}</span>
                </div>
              </div>

              {/* Technology Highlights */}
              <div className="p-4 rounded-xl bg-white border border-vertex-border shadow-sm space-y-2">
                <span className="text-xs font-mono font-bold text-vertex-steel flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-vertex-blueprint" />
                  <span>{isFa ? "ویژگی‌های فنی برجسته:" : "Engineering Highlights:"}</span>
                </span>
                <p className="text-xs text-vertex-secondary leading-relaxed font-normal">
                  {isFa ? activeProject.techFa : activeProject.techEn}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center text-xs text-vertex-steel">
              {isFa ? "برای مشاهده مشخصات، روی نشانگرهای نقشه کلیک کنید." : "Click map pins to inspect project engineering data."}
            </div>
          )}

          <div className="pt-4 border-t border-vertex-border">
            <div className="flex items-center justify-between text-xs font-mono text-vertex-steel">
              <span>{isFa ? "سامانه نقشه‌برداری ژئودتیک VERTEX" : "VERTEX GIS Platform"}</span>
              <span className="text-vertex-blueprint font-bold">WGS 84</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
