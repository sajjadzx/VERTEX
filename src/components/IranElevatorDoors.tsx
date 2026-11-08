"use client";

import React, { useState } from "react";
import { Locale } from "@/lib/dictionary";
import { 
  DoorClosed, 
  DoorOpen, 
  ShieldCheck, 
  Layers, 
  Ruler, 
  CheckCircle2, 
  Info,
  Maximize2,
  Sliders,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IranElevatorDoorsProps {
  locale: Locale;
}

interface DoorSystem {
  id: string;
  nameFa: string;
  nameEn: string;
  typeFa: string;
  typeEn: string;
  marketShareFa: string;
  marketShareEn: string;
  typicalUseFa: string;
  typicalUseEn: string;
  shaftFormulaFa: string;
  shaftFormulaEn: string;
  standardWidths: number[]; // mm
  featuresFa: string[];
  featuresEn: string[];
  specs: {
    clearOpening: string;
    clearHeight: string;
    operatorType: string;
    lockStandard: string;
    safetyCurtain: string;
  };
}

const IRAN_DOOR_SYSTEMS: DoorSystem[] = [
  {
    id: "telescopic-2p",
    nameFa: "درب تمام اتوماتیک تلسکوپی ۲ لنگه (Side Opening)",
    nameEn: "2-Panel Telescopic Automatic Door",
    typeFa: "بازشوی یک‌طرفه تلسکوپی (راست یا چپ بازشو)",
    typeEn: "Unidirectional 2-Panel Telescopic",
    marketShareFa: "بیش از ۵۰٪ پروژه‌های نوساز ساختمانی ایران",
    marketShareEn: "Over 50% of modern residential lifts in Iran",
    typicalUseFa: "ساختمان‌های مسکونی متداول، اداری نرمال و چاه‌هایی با عرض متوسط",
    typicalUseEn: "Standard residential & commercial towers with medium shaft width",
    shaftFormulaFa: "حداقل عرض چاه: SW ≥ 1.5 × OP + 350 mm",
    shaftFormulaEn: "Min Shaft Width: SW ≥ 1.5 x OP + 350 mm",
    standardWidths: [700, 800, 900, 1000, 1100],
    featuresFa: [
      "محبوب‌ترین درب تمام اتوماتیک در بازار ایران (برندهای فرماتور، سلکوم، یاران، حریری)",
      "نیاز به حداقل عرض چاه کمتر نسبت به درب سانترال (ایده‌آل برای چاه‌های با عرض کم)",
      "درایور هوشمند ۳ فاز مجهز به اینورتر VVVF با تنظیم نرم شتاب باز و بسته شدن",
      "انطباق کامل با بند ۷-۷ استاندارد ملی ایران ISIRI 6303-1 و استاندارد EN 81-20",
    ],
    featuresEn: [
      "Most prevalent automatic door in Iranian construction (Fermator, Selcom, Yaran)",
      "Requires less shaft width compared to center-opening doors",
      "Integrated VVVF inverter controller for smooth deceleration and silent motion",
      "Full compliance with ISIRI 6303-1 Art. 7.7 and EN 81-20 regulations",
    ],
    specs: {
      clearOpening: "700 – 1100 mm",
      clearHeight: "2000 – 2100 mm",
      operatorType: "موتور DC براشلس با درایو VVVF",
      lockStandard: "کنتاکت دوشاخه‌ای و زبانه مکانیکی استاندارد ۶۳۰۳",
      safetyCurtain: "فتوسل پرده‌ای چندکاناله (Infrared Light Curtain 94+ beams)",
    },
  },
  {
    id: "central-2p",
    nameFa: "درب تمام اتوماتیک سانترال ۲ لنگه (Center Opening)",
    nameEn: "2-Panel Central Opening Automatic Door",
    typeFa: "بازشوی وسط بازشو (متوازن و متقارن)",
    typeEn: "Symmetric Center-Opening 2-Panel",
    marketShareFa: "۳۰٪ پروژه‌های لوکس مسکونی، تجاری و هتل‌ها",
    marketShareEn: "30% Luxury residential, malls & corporate centers",
    typicalUseFa: "برج‌های تجاری، اداری پرتردد، هتل‌ها و مجتمع‌های مسکونی لوکس",
    typicalUseEn: "High-traffic commercial towers, luxury hotels & premium apartments",
    shaftFormulaFa: "حداقل عرض چاه: SW ≥ 2 × OP + 250 mm",
    shaftFormulaEn: "Min Shaft Width: SW ≥ 2 x OP + 250 mm",
    standardWidths: [800, 900, 1000, 1200, 1400],
    featuresFa: [
      "سرعت دو برابری باز و بسته شدن نسبت به تلسکوپی به دلیل حرکت همزمان دو لنگه",
      "تقارن بصری کامل با معماری لابی و کاهش زمان ورود و خروج مسافران",
      "مکانیسم لنگه‌های سنکرونایز شده با تسمه دندانه‌دار و بازوی انتقال نیرو",
      "مناسب برای کنترل ترافیک سنگین طبقات پرتردد بر اساس استاندارد CIBSE",
    ],
    featuresEn: [
      "Twice faster door cycle time due to simultaneous bi-directional panel travel",
      "Perfect architectural symmetry aligned with cabin interior and lobby design",
      "Synchronized cogged-belt transmission with robust mechanical coupling",
      "Optimized for high passenger transit dispatching according to CIBSE Guide D",
    ],
    specs: {
      clearOpening: "800 – 1400 mm",
      clearHeight: "2000 – 2400 mm",
      operatorType: "موتور سنکرون مغناطیس دائم PMSM با فیدبک انکودر",
      lockStandard: "گواهینامه تاییدیه نوع استاندارد ملی ۶۳۰۳-۱",
      safetyCurtain: "فتوسل پرده‌ای نوری سه بعدی با سنسور تشخیص مانع",
    },
  },
  {
    id: "semi-automatic",
    nameFa: "درب نیمه‌اتوماتیک (لولایی طبقه + اتوبوسی کابین)",
    nameEn: "Semi-Automatic System (Hinged Landing + Bus Cabin)",
    typeFa: "درب طبقه لولایی دستی + درب کابین اتوماتیک کشویی یا اتوبوسی",
    typeEn: "Manual Hinged Landing Door + Automatic Folding Cabin Door",
    marketShareFa: "رایج در ساختمان‌های قدیمی‌تر و مسکونی اقتصادی تا ۵ طبقه",
    marketShareEn: "Prevalent in budget residential buildings up to 5 floors",
    typicalUseFa: "ساختمان‌های مسکونی کم‌واحد، عرض چاه‌های بسیار کم و بازسازی آسانسورها",
    typicalUseEn: "Budget low-rise apartments, narrow hoistways & modernization projects",
    shaftFormulaFa: "حداقل عرض چاه: SW ≥ OP + 200 mm (کمترین عرض مورد نیاز)",
    shaftFormulaEn: "Min Shaft Width: SW ≥ OP + 200 mm (Maximum space saving)",
    standardWidths: [700, 800, 850, 900],
    featuresFa: [
      "بیشترین صرفه‌جویی در عرض چاه (امکان نصب در چاه‌های بسیار باریک ۱۲۰ سانتی‌متر)",
      "مجهز به لولاهای بلبرینگی فولادی، دیکتاتور آرام‌بند هیدرولیک و فنر بازگشت",
      "قفل الکترومکانیکی طبقه مجهز به کنتاکت فرمان ایمنی و زبانه درگیرکننده",
      "امکان اجرا در انواع روکش‌های رنگ الکترواستاتیک، استیل خش‌دار و طرح‌دار",
    ],
    featuresEn: [
      "Maximum hoistway width saving (fits shafts as narrow as 1200 mm)",
      "Heavy-duty ball-bearing hinges with hydraulic door closer dictator and coil spring",
      "Electro-mechanical landing interlock certified under ISIRI 6303 safety code",
      "Available in electrostatic powder coating, brushed stainless steel & patterned finishes",
    ],
    specs: {
      clearOpening: "700 – 900 mm",
      clearHeight: "2000 mm",
      operatorType: "مگنت درب‌بازکن کمان مکانیکی یا الکترونیکی روی کابین",
      lockStandard: "قفل ریزی استاندارد ملی ایران با پلمپ بازرسی",
      safetyCurtain: "سنسور چشمی خطی فتوسل تک‌نقطه‌ای یا پرده‌ای",
    },
  },
  {
    id: "telescopic-3p",
    nameFa: "درب تلسکوپی ۳ لنگه (۳ لته بازشوی یک‌طرفه)",
    nameEn: "3-Panel Telescopic Automatic Door",
    typeFa: "سه لنگه تلسکوپی متوالی یک‌طرفه",
    typeEn: "3-Panel Multi-Leaf Sliding",
    marketShareFa: "پروژه‌های بازسازی و چاه‌های با عرض کم و عمق مناسب",
    marketShareEn: "Modernization & narrow shafts requiring maximum entrance",
    typicalUseFa: "اماکنی که نیاز به ورودی عریض دارند ولی عرض چاه محدود است",
    typicalUseEn: "Narrow hoistways requiring wider entryways for wheelchairs",
    shaftFormulaFa: "حداقل عرض چاه: SW ≥ 1.33 × OP + 280 mm",
    shaftFormulaEn: "Min Shaft Width: SW ≥ 1.33 x OP + 280 mm",
    standardWidths: [800, 900, 1000, 1100, 1200],
    featuresFa: [
      "تأمین دهانه ورودی بازشوی بزرگ‌تر در مقایسه با تلسکوپی ۲ لنگه در همان ابعاد چاه",
      "مناسب برای عبور آسان صندلی چرخدار (ویلچر) طبق مقررات دسترس‌پذیری معلولان",
      "سیستم مکانیکی کشش کابلی سنکرونایزر ۳ مرحله‌ای با قرقره‌های فولادی",
      "پوشش محافظ ضدحریق طبق الزامات مبحث ۳ و مبحث ۱۵ مقررات ملی",
    ],
    featuresEn: [
      "Provides wider entrance clearance in narrow hoistways compared to 2-panel models",
      "Wheelchair and accessibility compliant entrance opening",
      "3-stage mechanical synchronized cable tensioning system with steel pulleys",
      "Fire-rated door assembly conforming to national building safety codes",
    ],
    specs: {
      clearOpening: "800 – 1200 mm",
      clearHeight: "2000 – 2200 mm",
      operatorType: "موتور درایو صنعتی سنگین با انکودر کنترل موقعیت",
      lockStandard: "قفل ۳ مرحله‌ای تاییدیه ISIRI 6303-1",
      safetyCurtain: "پرده نوری فروسرخ هوشمند با محافظ ضدبرخورد فیزیکی",
    },
  },
  {
    id: "central-4p",
    nameFa: "درب سانترال ۴ لنگه (مرکز بازشوی عریض)",
    nameEn: "4-Panel Center Opening Automatic Door",
    typeFa: "چهار لنگه متقارن بازشو از وسط (دو لنگه به چپ، دو لنگه به راست)",
    typeEn: "4-Panel Synchronous Center Opening",
    marketShareFa: "بیمارستان‌ها، مراکز درمانی، باربرهای صنعتی و فروشگاه‌های زنجیره‌ای",
    marketShareEn: "Hospitals, freight lifts & large retail warehouses",
    typicalUseFa: "آسانسورهای تخت‌بر برانکاردبر بیمارستانی، باربرهای خودرویی و صنعتی",
    typicalUseEn: "Hospital bed/stretcher lifts, car elevators & heavy freight haulers",
    shaftFormulaFa: "حداقل عرض چاه: SW ≥ 1.6 × OP + 300 mm",
    shaftFormulaEn: "Min Shaft Width: SW ≥ 1.6 x OP + 300 mm",
    standardWidths: [1200, 1400, 1600, 1800, 2000, 2400],
    featuresFa: [
      "ایده‌آل برای آسانسورهای برانکاردبر بیمارستانی طبق استاندارد وزارت بهداشت و مبحث ۱۵",
      "امکان بازشوی عظیم تا ۲.۴ متر بدون اشغال بیش از حد عرض چاه نسبت به سانترال ۲ لنگه",
      "چهار لنگه فولادی دوجداره با تقویت‌کننده‌های ضدضربه داخلی برای ورود برانکارد و لیفتراک",
      "سیستم ایمنی ضدحریق مقاوم ۲ ساعت (Fire-Rated E120 / EI60) طبق استاندارد EN 81-58",
    ],
    featuresEn: [
      "Mandatory standard for hospital bed lifts per Ministry of Health and Article 15",
      "Massive opening span up to 2.4m with reduced shaft overhang",
      "Double-skin reinforced steel panels built to withstand cart impacts",
      "2-hour fire-rated door assemblies (E120 / EI60) certified under EN 81-58",
    ],
    specs: {
      clearOpening: "1200 – 2400 mm",
      clearHeight: "2100 – 2500 mm",
      operatorType: "موتور گشتاور بالا Direct-Drive یا تسمه‌ای صنعتی",
      lockStandard: "قفل‌های تاییدیه سختگیرانه باربر سنگین ۶۳۰۳",
      safetyCurtain: "فتوسل پرده‌ای نوری دوگانه سه‌بعدی + سنسور التراسونیک",
    },
  },
];

export function IranElevatorDoors({ locale }: IranElevatorDoorsProps) {
  const isFa = locale === "fa";
  const [activeDoorId, setActiveDoorId] = useState<string>("telescopic-2p");
  const [selectedWidth, setSelectedWidth] = useState<number>(800);

  const activeDoor = IRAN_DOOR_SYSTEMS.find(d => d.id === activeDoorId) || IRAN_DOOR_SYSTEMS[0];

  return (
    <div className="rounded-2xl border border-vertex-border bg-white shadow-card overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-vertex-blueprint flex items-center justify-center text-white shadow-sm">
            <DoorClosed className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold font-mono text-white">
                {isFa ? "راهنمای تخصصی انواع درب‌های آسانسور رایج در ایران" : "Iranian Elevator Door Engineering Reference"}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                ISIRI 6303-1 COMPLIANT
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isFa 
                ? "بررسی درب‌های لولایی، تلسکوپی، سانترال و بیمارستانی منطبق با مبحث ۱۵ و استاندارد ملی ایران" 
                : "Comparative technical analysis of hinged, telescopic, and central doors in Iranian practice"}
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400">
          <span>{isFa ? "مرجع:" : "Norm:"}</span> <strong className="text-white">بند ۷-۷ استاندارد ملی ۶۳۰۳</strong>
        </div>
      </div>

      {/* Door Category Selector Buttons */}
      <div className="p-4 bg-slate-50 border-b border-vertex-border overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {IRAN_DOOR_SYSTEMS.map((door) => (
            <button
              key={door.id}
              onClick={() => {
                setActiveDoorId(door.id);
                setSelectedWidth(door.standardWidths[0] || 800);
              }}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
                activeDoorId === door.id
                  ? "bg-vertex-blueprint text-white shadow-sm"
                  : "bg-white text-vertex-secondary hover:text-vertex-primary hover:bg-slate-100 border border-vertex-border"
              )}
            >
              <DoorOpen className="w-3.5 h-3.5" />
              <span>{isFa ? door.nameFa.split("(")[0] : door.nameEn.split("(")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Analysis Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 p-6 sm:p-8 gap-8">
        {/* Left 2 Cols: Technical Details & Visual Diagram */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-vertex-blueprint/10 text-vertex-blueprint text-[11px] font-mono font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isFa ? activeDoor.marketShareFa : activeDoor.marketShareEn}</span>
            </div>
            <h4 className="text-2xl font-black text-vertex-primary">
              {isFa ? activeDoor.nameFa : activeDoor.nameEn}
            </h4>
            <p className="text-sm text-vertex-secondary mt-1">
              {isFa ? activeDoor.typeFa : activeDoor.typeEn}
            </p>
          </div>

          {/* Interactive Opening Mechanism Schematic */}
          <div className="p-6 rounded-2xl bg-cad-paper border border-vertex-border relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-300 text-xs font-mono">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-vertex-blueprint" />
                <span>{isFa ? "شماتیک حرکتی لنگه‌ها و بازشوی مفید (Clear Opening)" : "Kinematic Panel Stroke Schematic"}</span>
              </span>
              <span className="font-bold text-vertex-blueprint">{selectedWidth} mm</span>
            </div>

            {/* Visual Door Animation/Illustration */}
            <div className="py-10 flex flex-col items-center justify-center">
              <div className="w-full max-w-md h-24 rounded-xl bg-slate-200 border-2 border-slate-400 p-2 relative flex items-center justify-between shadow-inner">
                {/* Door Sill and Header Guide */}
                <div className="absolute top-1 inset-x-2 h-1 bg-slate-500 rounded" />
                <div className="absolute bottom-1 inset-x-2 h-1 bg-slate-500 rounded" />

                {/* Left Frame Jam */}
                <div className="w-8 h-full bg-slate-700 rounded text-[9px] font-mono text-white flex items-center justify-center">
                  JAMB
                </div>

                {/* Door Panels Representation based on Type */}
                <div className="flex-1 h-full mx-2 relative flex items-center justify-center">
                  {activeDoor.id === "telescopic-2p" && (
                    <div className="w-full h-full flex items-center justify-end gap-1">
                      <div className="w-1/2 h-full bg-vertex-blueprint text-white rounded font-mono text-[10px] font-bold flex items-center justify-center shadow">
                        FAST LEAF →
                      </div>
                      <div className="w-1/2 h-full bg-slate-600 text-white rounded font-mono text-[10px] font-bold flex items-center justify-center shadow">
                        SLOW LEAF →
                      </div>
                    </div>
                  )}

                  {activeDoor.id === "central-2p" && (
                    <div className="w-full h-full flex items-center justify-between gap-2">
                      <div className="w-1/2 h-full bg-vertex-blueprint text-white rounded font-mono text-[10px] font-bold flex items-center justify-center shadow">
                        ← LEFT PANEL
                      </div>
                      <div className="w-1/2 h-full bg-vertex-blueprint text-white rounded font-mono text-[10px] font-bold flex items-center justify-center shadow">
                        RIGHT PANEL →
                      </div>
                    </div>
                  )}

                  {activeDoor.id === "semi-automatic" && (
                    <div className="w-full h-full flex items-center justify-between">
                      <div className="w-full h-full bg-emerald-700 text-white rounded font-mono text-[10px] font-bold flex items-center justify-center shadow">
                        HINGED MANUAL SWING (90° ROTATION)
                      </div>
                    </div>
                  )}

                  {activeDoor.id === "telescopic-3p" && (
                    <div className="w-full h-full flex items-center justify-end gap-1">
                      <div className="w-1/3 h-full bg-sky-500 text-white rounded font-mono text-[9px] font-bold flex items-center justify-center shadow">
                        P1 →
                      </div>
                      <div className="w-1/3 h-full bg-vertex-blueprint text-white rounded font-mono text-[9px] font-bold flex items-center justify-center shadow">
                        P2 →
                      </div>
                      <div className="w-1/3 h-full bg-slate-700 text-white rounded font-mono text-[9px] font-bold flex items-center justify-center shadow">
                        P3 →
                      </div>
                    </div>
                  )}

                  {activeDoor.id === "central-4p" && (
                    <div className="w-full h-full flex items-center justify-between gap-1">
                      <div className="w-1/4 h-full bg-slate-700 text-white rounded font-mono text-[9px] font-bold flex items-center justify-center shadow">
                        ← L1
                      </div>
                      <div className="w-1/4 h-full bg-vertex-blueprint text-white rounded font-mono text-[9px] font-bold flex items-center justify-center shadow">
                        ← L2
                      </div>
                      <div className="w-1/4 h-full bg-vertex-blueprint text-white rounded font-mono text-[9px] font-bold flex items-center justify-center shadow">
                        R2 →
                      </div>
                      <div className="w-1/4 h-full bg-slate-700 text-white rounded font-mono text-[9px] font-bold flex items-center justify-center shadow">
                        R1 →
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Frame Jam */}
                <div className="w-8 h-full bg-slate-700 rounded text-[9px] font-mono text-white flex items-center justify-center">
                  JAMB
                </div>
              </div>

              {/* Dimension line annotation */}
              <div className="w-full max-w-md mt-3 flex items-center justify-between text-xs font-mono text-vertex-blueprint font-bold">
                <span className="w-2 h-2 rounded-full bg-vertex-blueprint" />
                <span className="px-3 py-1 rounded bg-white border border-vertex-blueprint shadow-sm">
                  {isFa ? `عرض بازشوی مفید: OP = ${selectedWidth} mm` : `Clear Opening OP = ${selectedWidth} mm`}
                </span>
                <span className="w-2 h-2 rounded-full bg-vertex-blueprint" />
              </div>
            </div>

            {/* Standard Width Selector Buttons */}
            <div className="mt-4 pt-3 border-t border-slate-300 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-700">
                {isFa ? "عرض‌های متداول استاندارد در بازار ایران:" : "Standard Commercial Widths in Iran:"}
              </span>
              <div className="flex items-center gap-1.5 font-mono text-xs">
                {activeDoor.standardWidths.map(w => (
                  <button
                    key={w}
                    onClick={() => setSelectedWidth(w)}
                    className={cn(
                      "px-2.5 py-1 rounded-md font-bold transition-all",
                      selectedWidth === w 
                        ? "bg-vertex-blueprint text-white" 
                        : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-300"
                    )}
                  >
                    {w} mm
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Key Advantages Checklist */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-vertex-primary flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isFa ? "ویژگی‌های فنی و مزایای کاربردی:" : "Engineering Highlights & Field Advantages:"}</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(isFa ? activeDoor.featuresFa : activeDoor.featuresEn).map((feat, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-vertex-secondary flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-vertex-blueprint shrink-0 mt-1.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Calculation Formula & Standard Compliance Box */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-vertex-border flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div>
              <span className="text-xs font-mono font-bold text-vertex-steel block uppercase">
                {isFa ? "فرمول ابعادی چاه" : "Hoistway Calculation Formula"}
              </span>
              <h5 className="text-base font-bold text-vertex-primary mt-1">
                {isFa ? "محاسبه حداقل عرض چاه آسانسور" : "Minimum Required Shaft Width"}
              </h5>
            </div>

            {/* Formula Card */}
            <div className="p-4 rounded-xl bg-white border border-vertex-blueprint/30 shadow-sm space-y-2">
              <span className="text-[10px] font-mono text-vertex-steel block">
                {isFa ? "فرمول تجربی طبق مبحث ۱۵ و ISIRI 6303:" : "Formula per Article 15 & ISIRI 6303:"}
              </span>
              <div className="text-sm font-mono font-black text-vertex-blueprint p-2 rounded bg-sky-50 text-center" dir="ltr">
                {isFa ? activeDoor.shaftFormulaFa : activeDoor.shaftFormulaEn}
              </div>
              <p className="text-[11px] text-vertex-secondary leading-snug">
                {isFa 
                  ? "توضیح: SW عرض کل چاه و OP عرض بازشوی مفید لنگه‌های درب بر حسب میلیمتر است."
                  : "Where SW is Shaft Width and OP is Door Clear Opening width in mm."}
              </p>
            </div>

            {/* Specifications Table */}
            <div className="space-y-2 text-xs font-mono">
              <span className="text-xs font-bold text-slate-800 block">
                {isFa ? "مشخصات فنی استاندارد ۶۳۰۳:" : "ISIRI 6303 Engineering Parameters:"}
              </span>
              <div className="space-y-1.5">
                <div className="flex justify-between p-2 rounded-lg bg-white border border-slate-200">
                  <span className="text-slate-500">{isFa ? "ارتفاع مفید ورودی:" : "Clear Height:"}</span>
                  <span className="font-bold text-slate-800">{activeDoor.specs.clearHeight}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-white border border-slate-200">
                  <span className="text-slate-500">{isFa ? "نوع موتور محرکه:" : "Operator Motor:"}</span>
                  <span className="font-bold text-slate-800 text-[11px]">{activeDoor.specs.operatorType}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-white border border-slate-200">
                  <span className="text-slate-500">{isFa ? "استاندارد قفل طبقات:" : "Interlock Standard:"}</span>
                  <span className="font-bold text-emerald-700 text-[11px]">{activeDoor.specs.lockStandard}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-white border border-slate-200">
                  <span className="text-slate-500">{isFa ? "سامانه ایمنی مانع:" : "Door Safety Sensor:"}</span>
                  <span className="font-bold text-slate-800 text-[11px]">{activeDoor.specs.safetyCurtain}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                {isFa 
                  ? "تمامی سیستم‌های درب معرفی‌شده دارای گواهینامه بازرسی کیفیت و ایمنی سازمان ملی استاندارد ایران (ISIRI) هستند." 
                  : "All door configurations are fully certified under ISIRI 6303-1 safety inspections."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
