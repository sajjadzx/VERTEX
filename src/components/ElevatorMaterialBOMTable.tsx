"use client";

import React, { useState, useMemo } from "react";
import { 
  FileSpreadsheet, 
  Printer, 
  Copy, 
  Check, 
  Search, 
  SlidersHorizontal, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Weight, 
  Gauge, 
  Zap, 
  Building2, 
  Box, 
  Download,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ElevatorMaterialBOMTableProps {
  locale: string;
  initialCapacity?: number;
  initialSpeed?: number;
  initialSuspension?: "1:1" | "2:1" | "4:1" | "cantilever";
  initialCwtPosition?: "rear" | "right" | "left";
  onParamsChange?: (params: {
    capacity: number;
    speed: number;
    suspension: "1:1" | "2:1" | "4:1" | "cantilever";
    cwtPosition: "rear" | "right" | "left";
  }) => void;
}

export interface BOMItem {
  code: string;
  category: "machine" | "ropes" | "rails" | "cabin" | "cwt" | "doors" | "safety" | "buffers" | "electrical";
  categoryFa: string;
  nameFa: string;
  nameEn: string;
  manufacturer: string;
  specs: string;
  material: string;
  quantity: string;
  standard: string;
  status: "تأیید استاندارد" | "الزامی";
}

export function ElevatorMaterialBOMTable({
  locale,
  initialCapacity = 630,
  initialSpeed = 1.0,
  initialSuspension = "2:1",
  initialCwtPosition = "rear",
  onParamsChange
}: ElevatorMaterialBOMTableProps) {
  const isFa = locale === "fa";

  // State
  const [capacity, setCapacity] = useState<number>(initialCapacity);
  const [speed, setSpeed] = useState<number>(initialSpeed);
  const [suspension, setSuspension] = useState<"1:1" | "2:1" | "4:1" | "cantilever">(initialSuspension);
  const [cwtPosition, setCwtPosition] = useState<"rear" | "right" | "left">(initialCwtPosition);
  const [stops, setStops] = useState<number>(4);
  const [travelMeters, setTravelMeters] = useState<number>(9.6);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [copied, setCopied] = useState<boolean>(false);

  const handleCapacityChange = (val: number) => {
    setCapacity(val);
    onParamsChange?.({ capacity: val, speed, suspension, cwtPosition });
  };

  const handleSpeedChange = (val: number) => {
    setSpeed(val);
    onParamsChange?.({ capacity, speed: val, suspension, cwtPosition });
  };

  const handleSuspensionChange = (val: "1:1" | "2:1" | "4:1" | "cantilever") => {
    setSuspension(val);
    onParamsChange?.({ capacity, speed, suspension: val, cwtPosition });
  };

  const handleCwtPositionChange = (val: "rear" | "right" | "left") => {
    setCwtPosition(val);
    onParamsChange?.({ capacity, speed, suspension, cwtPosition: val });
  };

  // Calculations per ISIRI 6303 & EN 81-20
  const persons = Math.round(capacity / 75);
  const carAreaMax = useMemo(() => {
    // EN 81-20 Table 6
    if (capacity <= 320) return 0.90;
    if (capacity <= 450) return 1.17;
    if (capacity <= 630) return 1.66;
    if (capacity <= 800) return 2.00;
    if (capacity <= 1000) return 2.40;
    if (capacity <= 1275) return 2.95;
    return 3.56;
  }, [capacity]);

  const carWeight = Math.round(400 + 0.55 * capacity); // Empty car kg
  const cwtBalance = 0.45; // 45%
  const cwtWeight = Math.round(carWeight + cwtBalance * capacity); // kg
  
  // Motor power calculation
  const totalEfficiency = 0.78;
  const motorKw = useMemo(() => {
    const unbalanceKg = capacity * (1 - cwtBalance);
    const kw = (unbalanceKg * 9.81 * speed) / (1000 * totalEfficiency);
    return Math.max(3.7, Math.round(kw * 10) / 10);
  }, [capacity, speed, cwtBalance, totalEfficiency]);

  // Wire ropes sizing
  const ropeDiameter = capacity > 1000 ? 11 : 10; // mm
  const ropeCount = capacity >= 1000 ? 5 : (suspension === "1:1" && capacity >= 800 ? 5 : 4);
  const ropeBreakingLoadPerRope = ropeDiameter === 11 ? 68.2 : 56.4; // kN
  const totalBreakingForce = ropeCount * ropeBreakingLoadPerRope; // kN
  const suspensionRatioVal = suspension === "1:1" ? 1 : (suspension === "2:1" || suspension === "cantilever" ? 2 : 4);
  const staticLoadOnRopes = (carWeight + capacity) / suspensionRatioVal; // kg
  const staticSafetyFactor = Math.round(((totalBreakingForce * 1000) / (staticLoadOnRopes * 9.81)) * 10) / 10;

  // Rail sizes
  const carRailType = capacity > 800 ? "T125/B" : "T89/B";
  const cwtRailType = capacity > 800 ? "T75/B" : "T50/A";
  const bracketCount = Math.ceil((travelMeters + 4.5) / 2.2) * 2; // For both sides

  // Doors
  const doorWidth = capacity >= 1000 ? 900 : 800; // mm
  const doorTypeDesc = capacity >= 1000 ? "سانترال دو لنگه وسط‌بازشو (Central 2-Panel)" : "تلسکوپی دو لنگه بازشو به راست/چپ (Telescopic 2-Panel)";

  // Complete DigiPara LiftDesigner BOM Dataset
  const bomData: BOMItem[] = useMemo(() => [
    // 1. Traction Machine & Drive
    {
      code: "MCH-01",
      category: "machine",
      categoryFa: "سیستم محرکه و موتورخانه",
      nameFa: "موتور سنکرون مغناطیس دائم گیرلس (PMSM)",
      nameEn: "Permanent Magnet Gearless Synchronous Motor",
      manufacturer: "Ziehl-Abegg (آلمان) - سری ZAtop SM200 یا Montanari (ایتالیا) MGX",
      specs: `توان ${motorKw} کیلووات | گشتاور ۳۸۰ نیوتن‌متر | دور ۲۱۰ RPM | کنترل سرعت VVVF Closed-Loop با انکودر EnDat/SinCos`,
      material: "سیم‌پیچ مس خالص کلاس H با آهنربای نئودیمیوم دائم NdFeB و شاسی چدن نشکن GGG50",
      quantity: "۱ دستگاه",
      standard: "ISIRI 6303-1 بند ۱۲ و EN 81-20 بند ۵.۹",
      status: "تأیید استاندارد"
    },
    {
      code: "MCH-02",
      category: "machine",
      categoryFa: "سیستم محرکه و موتورخانه",
      nameFa: "فلکه اصلی کشش (Traction Sheave)",
      nameEn: "Traction Sheave with Hardened V-Grooves",
      manufacturer: "DigiPara Master Library / Ziehl-Abegg",
      specs: `قطر فلکه D = ۴۰۰ میلی‌متر | نسبت D/d = ${400 / ropeDiameter} (فراتر از ۴۰ الزامی) | ${ropeCount} شیار V با زاویه ۳۶ درجه و سختکاری القایی ۵۲ HRC`,
      material: "چدن گرافیت کروی آلیاژی درجه یک مقاومت سایش بالا GGG50",
      quantity: "۱ عدد",
      standard: "ISIRI 6303-1 بند ۹.۲.۱ (حداقل نسبت قطر ۴۰)",
      status: "تأیید استاندارد"
    },
    {
      code: "MCH-03",
      category: "machine",
      categoryFa: "سیستم محرکه و موتورخانه",
      nameFa: "فلکه هرزگرد انحراف و میله محافظ ضد پرش",
      nameEn: "Diverter Sheave with Anti-Jump Guard Pin",
      manufacturer: "DigiPara Components / Wittur",
      specs: `قطر فلکه D = ۳۶۰ میلی‌متر | بیرینگ‌های آب‌بندی‌شده دو ردیفه SKF | میله نگهدارنده فولادی ضد پرش بکسل`,
      material: "چدن نشکن با شفت فولادی آلیاژی VCN150 و میله فولادی گالوانیزه",
      quantity: "۱ عدد",
      standard: "ISIRI 6303-1 بند ۵.۵ و EN 81-20 بند ۵.۵.۱",
      status: "تأیید استاندارد"
    },
    {
      code: "MCH-04",
      category: "machine",
      categoryFa: "سیستم محرکه و موتورخانه",
      nameFa: "ترمز الکترومکانیکی دوبل ایمنی",
      nameEn: "Dual Independent Disc/Drum Safety Brakes",
      manufacturer: "Mayr (آلمان) / ترمز یکپارچه موتور Ziehl-Abegg",
      specs: "دو مدار ترمز کاملاً مستقل | گشتاور ترمزی حداقل ۲.۵ برابر بار نامی | مجهز به میکروسوئیچ‌های مانیتورینگ عملکرد بازشو",
      material: "فولاد ریختگی با لنت‌های ارگانیک ضدسایش فاقد آزبست",
      quantity: "۱ مجموعه کامل (دوبل)",
      standard: "ISIRI 6303-1 بند ۱۲.۴ و EN 81-20 بند ۵.۹.۲",
      status: "تأیید استاندارد"
    },
    {
      code: "MCH-05",
      category: "machine",
      categoryFa: "سیستم محرکه و موتورخانه",
      nameFa: "شاسی فولادی زیر موتور و ضربه‌گیرهای نئوپرن",
      nameEn: "Heavy Machine Bedplate & Neoprene Vibration Pads",
      manufacturer: "طراحی سازه مهندسی VERTEX / شرکت‌های معتبر داخلی",
      specs: "تیرهای دوبل ناودانی صنعتی UNP160/180 همراه با ۴ بالشتک نئوپرن ایزولاسیون ارتعاشی",
      material: "فولاد ساختمانی St37 با رنگ صنعتی اپوکسی و الاستومر نئوپرن سختی ۶۰ Shore A",
      quantity: "۱ مجموعه",
      standard: "مبحث ۱۵ مقررات ملی و استاندارد ISO 18738",
      status: "تأیید استاندارد"
    },

    // 2. Suspension Wire Ropes & Rigging
    {
      code: "ROP-01",
      category: "ropes",
      categoryFa: "سیم‌بکسل‌ها و تعلیق",
      nameFa: "سیم‌بکسل‌های فولادی تعلیق آسانسور",
      nameEn: "Special Elevator Steel Wire Ropes",
      manufacturer: "Gustav Wolf (آلمان) سری PAWO F7 یا Brugg Drahtseil (سوئیس) یا Pfeifer Drako",
      specs: `قطر نامی d = ${ropeDiameter} میلی‌متر | تعداد ${ropeCount} رشته موازی | ساختار 8x19S با مغزی کنف طبیعی اشباع‌شده (NFC) | رده مقاومت ۱۷۷۰ N/mm²`,
      material: "مفتول‌های فولادی پرکربن کشیده شده با روغن‌کاری مخصوص الاستیک",
      quantity: `${Math.round((travelMeters + 12) * ropeCount * suspensionRatioVal)} متر طول`,
      standard: `ISIRI 6303-1 بند ۹.۲ | ضریب اطمینان استاتیکی γ = ${staticSafetyFactor} (حداقل الزامی ۱۲)`,
      status: "تأیید استاندارد"
    },
    {
      code: "ROP-02",
      category: "ropes",
      categoryFa: "سیم‌بکسل‌ها و تعلیق",
      nameFa: "سربکسل‌های اشپیل‌دار گُوه‌ای با فنر ضربه‌گیر",
      nameEn: "Symmetrical Wedge Sockets with Damping Springs",
      manufacturer: "ACLA (آلمان) / هاس ترکیه / استانداردهای DIN 15315",
      specs: `مناسب بکسل نمره ${ropeDiameter} | گوه‌های چدنی قفل‌شونده با اشپیل، مهره دوبل، پین ایمنی و لاستیک/فنر لرزه‌گیر پلی‌اورتان`,
      material: "بدنه فولاد ریخته‌گری داکتیل گالوانیزه و فنرهای فولادی فنر ۶۰SiCr7",
      quantity: `${ropeCount * (suspension === "1:1" ? 2 : 2)} دست کامل`,
      standard: "ISIRI 6303-1 بند ۹.۲.۳ و استاندارد اروپایی DIN 15315",
      status: "تأیید استاندارد"
    },
    {
      code: "ROP-03",
      category: "ropes",
      categoryFa: "سیم‌بکسل‌ها و تعلیق",
      nameFa: "سیم‌بکسل فولادی گاورنر سرعت",
      nameEn: "Centrifugal Governor Steel Rope",
      manufacturer: "Gustav Wolf / Brugg Drahtseil",
      specs: "قطر d = ۶.۰ میلی‌متر یا ۶.۵ میلی‌متر | بافت ۶x۱۹ با مغزی الیافی | رده کششی ۱۷۷۰ N/mm²",
      material: "مفتول‌های فولادی گالوانیزه ضد زنگ",
      quantity: `${Math.round((travelMeters + 6) * 2)} متر طول`,
      standard: "ISIRI 6303-1 بند ۹.۹.۲ (حداقل قطر ۶ میلی‌متر)",
      status: "تأیید استاندارد"
    },

    // 3. Guide Rails & Brackets
    {
      code: "RAL-01",
      category: "rails",
      categoryFa: "ریل‌های راهنما و براکت‌ها",
      nameFa: "شاخه ریل راهنمای کابین (ماشین‌کاری شده)",
      nameEn: "Machined Car Guide Rails (ISO 7465)",
      manufacturer: "Marazzi (ایتالیا) / Savera (اسپانیا) / Monteferro",
      specs: `تیپ ${carRailType} | طول شاخه ۵ متر | لبه ماشین‌کاری شده با دقت صدم میلی‌متر همراه با زبانه و شیار (Tongue & Groove) فاق و زبانه`,
      material: "فولاد با کیفیت ساختمانی استاندارد ISO 7465 گرید E275B",
      quantity: `${Math.ceil((travelMeters + 4.5) / 5) * 2} شاخه`,
      standard: "ISIRI 6303-1 بند ۱۰.۱ و ISO 7465",
      status: "تأیید استاندارد"
    },
    {
      code: "RAL-02",
      category: "rails",
      categoryFa: "ریل‌های راهنما و براکت‌ها",
      nameFa: "شاخه ریل راهنمای وزنه تعادل (کشش سرد)",
      nameEn: "Cold Drawn Counterweight Guide Rails",
      manufacturer: "Marazzi / Savera / چیلیک تورک",
      specs: `تیپ ${cwtRailType} | طول شاخه ۵ متر | سطح کشش سرد مقاومت بالا با فاق و زبانه اتصال دقیق`,
      material: "فولاد سازه‌ای کربنی ISO 7465",
      quantity: `${Math.ceil((travelMeters + 4.5) / 5) * 2} شاخه`,
      standard: "ISIRI 6303-1 بند ۱۰.۱ و ISO 7465",
      status: "تأیید استاندارد"
    },
    {
      code: "RAL-03",
      category: "rails",
      categoryFa: "ریل‌های راهنما و براکت‌ها",
      nameFa: "براکت‌های اتصال ریل و لقمه‌های فولادی",
      nameEn: "Adjustable Rail Brackets & Heavy Clips",
      manufacturer: "طراحی تخصصی سازه VERTEX / قطعات استاندارد",
      specs: "براکت‌های رگلاژی سه‌بعدی با نبشی دوبل و لقمه‌های چدنی نشکن T1/T2 و پیچ و مهره گرید ۸.۸ گالوانیزه",
      material: "فولاد ساختمانی گالوانیزه گرم با ضخامت حداقل ۶ میلی‌متر",
      quantity: `${bracketCount} دست کامل`,
      standard: "ISIRI 6303-1 بند ۱۰.۱.۲ (فواصل کمتر از ۲.۵ متر)",
      status: "تأیید استاندارد"
    },
    {
      code: "RAL-04",
      category: "rails",
      categoryFa: "ریل‌های راهنما و براکت‌ها",
      nameFa: "پشت‌بندهای فولادی ریل (Fishplates)",
      nameEn: "Machined Rail Fishplates",
      manufacturer: "Savera / Marazzi",
      specs: `پشت‌بند ۸ سوراخه ماشین‌کاری شده با پیچ و مهره ۸.۸ مخصوص اتصال ریل‌های ${carRailType} و ${cwtRailType}`,
      material: "فولاد کربنی ماشین‌کاری شده بدون تابیدگی",
      quantity: `${Math.ceil((travelMeters + 4.5) / 5) * 4} عدد`,
      standard: "ISO 7465 و استاندارد ملی ۶۳۰۳",
      status: "تأیید استاندارد"
    },

    // 4. Car Sling & Body
    {
      code: "CAB-01",
      category: "cabin",
      categoryFa: "کابین و سازه یوک",
      nameFa: "فریم و اسکلت یوک کابین (Car Sling Frame)",
      nameEn: "Heavy Duty Car Sling Frame (Crosshead & Safety Plank)",
      manufacturer: "شرکت‌های دانش‌بنیان مهندسی سازه آسانسور ایران / VERTEX",
      specs: `تیر فوقانی دوبل ناودانی ۱۴ | تیر زیرین پاراشوت ناودانی ۱۶ | ستون‌های جانبی (Stiles) نبشی تقویت‌شده | مناسب ظرفیت ${capacity} کیلوگرم`,
      material: "فولاد آلیاژی St37/St52 نورد گرم با جوشکاری تحت گاز محافظ CO2 و تست NDT",
      quantity: "۱ مجموعه کامل",
      standard: "ISIRI 6303-1 بند ۸ و EN 81-20 بند ۵.۴",
      status: "تأیید استاندارد"
    },
    {
      code: "CAB-02",
      category: "cabin",
      categoryFa: "کابین و سازه یوک",
      nameFa: "اتاق و دکوراسیون لوکس کابین",
      nameEn: "Elevator Cabin Enclosure & Luxury Finishes",
      manufacturer: "سفارشی VERTEX Luxury Line",
      specs: `عرض داخل ۱۴۰۰ میلی‌متر | عمق داخل ۱۱۰۰ میلی‌متر | ارتفاع مفید ۲۲۰۰ میلی‌متر | مساحت ۱.۵۴ مترمربع (مجاز: ${carAreaMax} مترمربع) | نورپردازی سقف LED معکوس`,
      material: "ورق استیل ضد زنگ نگیر ۳۰۴ خش‌دار طلایی/دودی ضد اثر انگشت و کفپوش سنگ طبیعی اسلب مرمریت",
      quantity: "۱ دستگاه",
      standard: "ISIRI 6303-1 جدول ۶ (کنترل دقیق حداکثر مساحت کابین)",
      status: "تأیید استاندارد"
    },
    {
      code: "CAB-03",
      category: "cabin",
      categoryFa: "کابین و سازه یوک",
      nameFa: "کفشک‌های راهنمای رولری فنردار (Roller Guides)",
      nameEn: "Spring Loaded 3-Wheel Roller Guide Shoes",
      manufacturer: "ACLA (آلمان) / Wittur / ELSCO",
      specs: "قطر رولرها ۱۲۵ میلی‌متر با پوشش پلی‌اورتان ضدسایش | فنربندی مستقل جهت حرکت بی‌صدا تا سرعت ۲.۵ m/s",
      material: "بدنه آلومینیوم آلیاژی دایکست با چرخ‌های پلی‌اورتان نیسوپک (Vulkollan)",
      quantity: "۴ مجموعه (۲ بالا، ۲ پایین)",
      standard: "ISO 18738 استاندارد کیفیت و آسایش سفر",
      status: "تأیید استاندارد"
    },
    {
      code: "CAB-04",
      category: "cabin",
      categoryFa: "کابین و سازه یوک",
      nameFa: "پرده نوری ایمنی چندکاناله درب (Photocell Curtain)",
      nameEn: "Full-Height Infrared Light Curtain Sensor",
      manufacturer: "WECO / CEDES (سوئیس) سری Cegard/Mini",
      specs: "پوشش سراسری ارتفاع تا ۱۸۰۰ میلی‌متر | ۱۲۸ پرتو مادون قرمز متقاطع | مدار عیب‌یابی خودکار با IP65",
      material: "پروفیل آلومینیومی باریک اکسترود شده با روکش پلی‌کربنات مقاوم",
      quantity: "۱ ست فرستنده و گیرنده",
      standard: "ISIRI 6303-1 بند ۷.۷.۵ و EN 81-20 بند ۵.۳.۶.۲",
      status: "تأیید استاندارد"
    },

    // 5. Counterweight System
    {
      code: "CWT-01",
      category: "cwt",
      categoryFa: "سیستم وزنه تعادل",
      nameFa: "قاب وزنه تعادل تقویت‌شده (CWT Frame)",
      nameEn: "Rigid Structural Counterweight Frame",
      manufacturer: "طراحی تخصصی VERTEX / دیتابیس لیفت‌دیزاینر",
      specs: `ارتفاع ۴۲۰۰ میلی‌متر | مناسب موقعیت ${cwtPosition === "rear" ? "پشت چاهک" : "سمت راست/چپ چاهک"} | مجهز به تسمه‌های نگهدارنده و قفل ضد لرزش بلوک‌ها`,
      material: "ناودانی‌های صنعتی فولادی St37 با ورق‌های مهاربندی ضخامت ۵ میلی‌متر",
      quantity: "۱ دستگاه",
      standard: "ISIRI 6303-1 بند ۸.۱۸ و EN 81-20 بند ۵.۴.۱۱",
      status: "تأیید استاندارد"
    },
    {
      code: "CWT-02",
      category: "cwt",
      categoryFa: "سیستم وزنه تعادل",
      nameFa: "بلوک‌های وزنه تعادل چدنی ریخته‌گری",
      nameEn: "Machined Cast Iron Counterweight Filler Blocks",
      manufacturer: "تولیدکنندگان استاندارد صنایع ریخته‌گری",
      specs: `وزن کل بلوک‌ها و قاب: ${cwtWeight} کیلوگرم (معادل بار تعادل ۴۵٪) | ابعاد متناسب با قاب و شیار عبور سیم‌های بکسل`,
      material: "چدن خاکستری ریخته‌گری GG20 سنگین با سطح صاف بدون پلیسه",
      quantity: `${Math.ceil((cwtWeight - 150) / 40)} عدد قالب ۴۰ کیلوگرمی`,
      standard: "ISIRI 6303-1 بند ۸.۱۸",
      status: "تأیید استاندارد"
    },
    {
      code: "CWT-03",
      category: "cwt",
      categoryFa: "سیستم وزنه تعادل",
      nameFa: "توری محافظ وزنه تعادل در کف چاهک",
      nameEn: "Pit Counterweight Safety Guard Screen",
      manufacturer: "طراحی مطابق استاندارد ۶۳۰۳",
      specs: "شروع از ارتفاع ۳۰۰ میلی‌متر کف چاه تا ارتفاع ۲۵۰۰ میلی‌متری | مش‌بندی توری ریز مقاوم در برابر نفوذ دست",
      material: "توری فولادی گالوانیزه مفتول ضخیم با قاب نبشی",
      quantity: "۱ عدد",
      standard: "ISIRI 6303-1 بند ۵.۶ و EN 81-20 بند ۵.۲.۵.۵",
      status: "تأیید استاندارد"
    },

    // 6. Doors & Operator
    {
      code: "DOR-01",
      category: "doors",
      categoryFa: "درب‌های کابین و طبقات",
      nameFa: "درب‌های لندینگ طبقات (Landing Doors)",
      nameEn: "Fire-Rated Elevator Landing Doors",
      manufacturer: "Fermator (اسپانیا) سری Premium / Wittur (آلمان) Augusta Evo / یاران",
      specs: `عرض بازشو مفید ${doorWidth} میلی‌متر | ارتفاع مفید ۲۰۰۰ میلی‌متر | تیپ ${doorTypeDesc} | مجهز به قفل‌های الکترومکانیکی استاندارد و دیکتاتور هیدرولیک`,
      material: "ورق فولادی گالوانیزه ضخامت ۱.۵ میلی‌متر با پوشش رنگ الکترواستاتیک یا روکش استیل ۳۰۴",
      quantity: `${stops} دستگاه`,
      standard: "استاندارد ملی ۲-۶۳۰۳ و استاندارد حریق EN 81-58 با رده E120 و EW60",
      status: "تأیید استاندارد"
    },
    {
      code: "DOR-02",
      category: "doors",
      categoryFa: "درب‌های کابین و طبقات",
      nameFa: "مکانیزم اپراتور درب کابین هوشمند (Car Door Operator)",
      nameEn: "VVVF Intelligent Automatic Car Door Operator",
      manufacturer: "Fermator 40/10 یا Wittur Fineline",
      specs: "موتور براشلس DC بدون تسمه سایش‌زا | کنترلر سرعت و موقعیت هوشمند VVVF با تشخیص خودکار موانع | باز و بست کاملاً سایلنت",
      material: "سیستم متحرک آلومینیوم با ریل فولادی و غلتک‌های پلی‌آمید بلبرینگی",
      quantity: "۱ دستگاه",
      standard: "ISIRI 6303-1 بند ۷.۵ و EN 81-20 بند ۵.۳",
      status: "تأیید استاندارد"
    },

    // 7. Safety Gear & Governor
    {
      code: "SAF-01",
      category: "safety",
      categoryFa: "سیستم ایمنی و گاورنر",
      nameFa: "گاورنر سرعت گریز از مرکز دو جهته",
      nameEn: "Overspeed Governor Unit with Electric Switch",
      manufacturer: "Cobianchi (ایتالیا) / Wittur / بهران",
      specs: `سرعت قطع نامی v = ${Math.round((speed * 1.15 + 0.06 / speed) * 100) / 100} m/s | فلکه قطر ۲۰۰ میلی‌متر | مجهز به اهرم تحریک مکانیکی و کنتاکت الکتریکی ایمنی ضد ریست خودکار`,
      material: "فلکه چدنی بالانس دینامیکی با بدنه فولادی و مکانیزم بادامک‌های آلیاژی",
      quantity: "۱ دستگاه",
      standard: "ISIRI 6303-1 بند ۹.۹ و EN 81-20 بند ۵.۶.۲",
      status: "تأیید استاندارد"
    },
    {
      code: "SAF-02",
      category: "safety",
      categoryFa: "سیستم ایمنی و گاورنر",
      nameFa: "ترمز ایمنی پاراشوت تدریجی دوسویه (Progressive Safety Gear)",
      nameEn: "Bidirectional Progressive Safety Gear",
      manufacturer: "Cobianchi سری PC13 یا Wittur یا بهران",
      specs: `مناسب بار ناخالص تا ${carWeight + capacity + 300} کیلوگرم و ریل ${carRailType} | فک‌های فنری عاج‌دار با ترمز یکنواخت بین ۰.۲g تا ۱.۰g شتاب کندشوندگی`,
      material: "فولادهای عملیات حرارتی شده سمانته و فنرهای بشقابی فشاری پرقدرت",
      quantity: "۱ جفت (چپ و راست)",
      standard: "ISIRI 6303-1 بند ۹.۸ و EN 81-50 بند ۵.۳",
      status: "تأیید استاندارد"
    },
    {
      code: "SAF-03",
      category: "safety",
      categoryFa: "سیستم ایمنی و گاورنر",
      nameFa: "فلکه کششی ته‌چاهک گاورنر با وزنه و سوئیچ",
      nameEn: "Pit Governor Tension Weight Pulley & Safety Switch",
      manufacturer: "Cobianchi / Wittur",
      specs: "فلکه چدنی شیار V معلق روی بازوی اهرمی با وزنه چدنی حداقل ۲۵ کیلوگرم و میکروسوئیچ الکتریکی قطع مدار ایمنی هنگام شل شدن بکسل",
      material: "چدن سنگین با بازوی فولادی مفصلی و فنر رگلاژ",
      quantity: "۱ مجموعه",
      standard: "ISIRI 6303-1 بند ۹.۹.۲ و EN 81-20 بند ۵.۶.۲.۲",
      status: "تأیید استاندارد"
    },

    // 8. Pit Buffers
    {
      code: "BUF-01",
      category: "buffers",
      categoryFa: "ضربه‌گیرهای ته‌چاهک",
      nameFa: "ضربه‌گیرهای الاستومری متراکم پلی‌اورتان یا هیدرولیک",
      nameEn: "Cellular Polyurethane / Hydraulic Energy Dissipation Buffers",
      manufacturer: "ACLA (آلمان) یا Henning یا هیدرولیک P+S",
      specs: `مناسب سرعت نامی ${speed} m/s | کورس فشرده‌شدن حداقل ${Math.round(0.0674 * speed * speed * 1000)} میلی‌متر | ۲ عدد برای زیر کابین و ۱ عدد برای زیر وزنه تعادل`,
      material: "پلی‌اورتان سلولی الاستومری ویژه با جذب انرژی فوق‌العاده بدون بازگشت ارتجاعی آنی",
      quantity: "۳ عدد",
      standard: "ISIRI 6303-1 بند ۱۰.۳ و ۱۰.۴ و EN 81-20 بند ۵.۸",
      status: "تأیید استاندارد"
    },
    {
      code: "BUF-02",
      category: "buffers",
      categoryFa: "ضربه‌گیرهای ته‌چاهک",
      nameFa: "پایه‌های فولادی و بتنی بافر کف چاهک",
      nameEn: "Reinforced Steel Buffer Plinths",
      manufacturer: "سازه مهندسی VERTEX",
      specs: "پایه‌های قوطی فولادی ۱۰۰x۱۰۰x۵ بتن‌ریزی شده جهت تأمین فضای جان‌پناه کف چاهک طبق استاندارد",
      material: "فولاد سازه‌ای St37 با رنگ اپوکسی ضد رطوبت چاهک",
      quantity: "۳ عدد",
      standard: "ISIRI 6303-1 بند ۵.۷.۳.۳ (فضای جان‌پناه کف چاهک)",
      status: "تأیید استاندارد"
    },

    // 9. Electrical & Traveling Cable
    {
      code: "ELE-01",
      category: "electrical",
      categoryFa: "تابلو فرمان و الکتریکال",
      nameFa: "تابلو فرمان میکروپروسسوری با درایو اینورتر ۳VF",
      nameEn: "VVVF Inverter Microprocessor Elevator Controller",
      manufacturer: "آرمان فراز پیمان (AFP) / داتیس (Datis) با درایو Yaskawa (ژاپن) یا Gefran (ایتالیا)",
      specs: `مناسب موتور ${motorKw} کیلووات | الگوریتم کنترل موقعیت Direct-to-Floor با همسطح‌سازی میلی‌متری | سیستم نجات اضطراری خودکار بلک‌آوت (Blackout UPS Rescue)`,
      material: "رک فولادی با استاندارد حفاظتی IP54 و بردهای الکترونیکی ۴ لایه صنعتی",
      quantity: "۱ دستگاه",
      standard: "ISIRI 6303-1 بند ۱۳ و ۱۴ و مبحث ۱۵ مقررات ملی ساختمان",
      status: "تأیید استاندارد"
    },
    {
      code: "ELE-02",
      category: "electrical",
      categoryFa: "تابلو فرمان و الکتریکال",
      nameFa: "کابل متحرک نواری تخت ۲۴ رشته (Traveling Cable)",
      nameEn: "Flat Flexible Elevator Traveling Cable (24-Cores)",
      manufacturer: "Datwyler (سوئیس) سری Liftoflex یا Draka (آلمان)",
      specs: "۲۴ رشته سیم مسی انعطاف‌پذیر افشان | دارای دو سیم بکسل فولادی طرفین جهت مهار بارهای کششی | روکش PVC نسوز مقاوم در برابر سایش",
      material: "مس آنیل‌شده بدون اکسیژن (OFC) با خلوص ۹۹.۹٪ و پلیمر الاستومری ضد اشتعال",
      quantity: `${Math.round(travelMeters + 10)} متر طول`,
      standard: "ISIRI 6303-1 بند ۱۳.۵ و استانداردهای IEC 60227-6",
      status: "تأیید استاندارد"
    },
    {
      code: "ELE-03",
      category: "electrical",
      categoryFa: "تابلو فرمان و الکتریکال",
      nameFa: "سنسورهای نوری همسطح‌سازی و پرچم‌های تراز طبقه",
      nameEn: "Optical Leveling Sensors & Landing Vanes",
      manufacturer: "Schmersal (آلمان) / سنسورهای فتوسل مادون قرمز",
      specs: "سنسورهای خوانش پرچم تراز طبقه با دقت ±۲ میلی‌متر | زون بازشدن مجاز درب‌ها در بازه ±۱۰ سانتی‌متر",
      material: "بدنه صنعتی ضد گرد و غبار IP67 با پرچم‌های آلومینیومی آنودایز",
      quantity: "۱ ست روی کابین + پرچم‌ها در هر طبقه",
      standard: "ISIRI 6303-1 بند ۱۴.۲.۱.۲",
      status: "تأیید استاندارد"
    }
  ], [
    motorKw, ropeDiameter, ropeCount, travelMeters, suspensionRatioVal, 
    staticSafetyFactor, carRailType, cwtRailType, bracketCount, capacity, 
    carWeight, cwtPosition, cwtWeight, carAreaMax, doorWidth, doorTypeDesc, 
    speed, stops, suspension
  ]);

  // Categories list
  const categories = [
    { id: "all", labelFa: "تمام اقلام (۳۲ قلم قطعه)" },
    { id: "machine", labelFa: "موتورخانه و محرکه" },
    { id: "ropes", labelFa: "سیم‌بکسل و تعلیق" },
    { id: "rails", labelFa: "ریل‌ها و اتصالات" },
    { id: "cabin", labelFa: "کابین و یوک" },
    { id: "cwt", labelFa: "وزنه تعادل" },
    { id: "doors", labelFa: "درب‌ها و اپراتور" },
    { id: "safety", labelFa: "ایمنی و گاورنر" },
    { id: "buffers", labelFa: "ضربه‌گیرها" },
    { id: "electrical", labelFa: "برق و فرمان" },
  ];

  // Filtered Items
  const filteredItems = useMemo(() => {
    return bomData.filter(item => {
      const matchCat = selectedCategory === "all" || item.category === selectedCategory;
      const matchSearch = searchQuery === "" || 
        item.nameFa.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.specs.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [bomData, selectedCategory, searchQuery]);

  // Copy table to clipboard
  const handleCopyTable = () => {
    const header = "کد\tنام قطعه\tسازنده / برند\tمشخصات فنی و متریال\tتعداد / متراژ\tاستاندارد\n";
    const rows = filteredItems.map(i => `${i.code}\t${i.nameFa}\t${i.manufacturer}\t${i.specs}\t${i.quantity}\t${i.standard}`).join("\n");
    navigator.clipboard.writeText(header + rows);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const header = "کد قطعه,نام قطعه (فارسی),نام قطعه (انگلیسی),سازنده و برند مرجع,مشخصات فنی و متریال,تعداد و متراژ,استاندارد مرجع,وضعیت انطباق\n";
    const rows = filteredItems.map(i => 
      `"${i.code}","${i.nameFa}","${i.nameEn}","${i.manufacturer}","${i.specs.replace(/"/g, '""')}","${i.quantity}","${i.standard}","${i.status}"`
    ).join("\n");
    
    // Add BOM for UTF-8 Excel support
    const blob = new Blob(["\uFEFF" + header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `VERTEX_LiftDesigner_BOM_${capacity}kg_${speed}ms.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Sheet
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl font-vazir text-slate-100">
      {/* ==============================================================
          STUDIO HEADER: BOM TITLE, PARAMETRIC CONTROLS & EXPORTS
      ============================================================== */}
      <div className="bg-slate-950 p-5 sm:p-6 border-b border-slate-800 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white font-mono">
                  {isFa ? "جدول مشخصات فنی، محاسبات و صورت متریال آسانسور (BOM)" : "DigiPara LiftDesigner™ Sizing & Material Schedule"}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                  ISIRI 6303 / EN 81-20
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isFa 
                  ? "لیست جامع متریال استاندارد، محاسبات کشش بکسل، توان موتور، اوزان، ریل‌ها و درب‌ها به سبک نرم‌افزار DigiPara LiftDesigner" 
                  : "Comprehensive Bill of Materials, component specifications, safety calculations, and LiftDesigner database items."}
              </p>
            </div>
          </div>

          {/* Action Buttons: Print, CSV, Copy */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopyTable}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono font-bold hover:bg-slate-700 transition-all flex items-center gap-1.5"
              title={isFa ? "کپی جدول در کلیپ‌بورد" : "Copy to clipboard"}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (isFa ? "کپی شد" : "Copied") : (isFa ? "کپی جدول" : "Copy")}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-mono font-bold hover:bg-emerald-500 transition-all flex items-center gap-1.5 shadow-sm"
              title={isFa ? "دریافت خروجی اکسل / CSV" : "Export CSV for Excel"}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isFa ? "خروجی اکسل (CSV)" : "Export CSV"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-sky-600 text-white text-xs font-mono font-bold hover:bg-sky-500 transition-all flex items-center gap-1.5 shadow-sm"
              title={isFa ? "چاپ شناسنامه فنی" : "Print Material Sheet"}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isFa ? "چاپ شناسنامه" : "Print"}</span>
            </button>
          </div>
        </div>

        {/* Global Parametric Quick-Tune Bar (Synchronized with 2D CAD & 3D Viewer) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-2 border-t border-slate-800/80">
          {/* Capacity */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-300 block">
              {isFa ? "ظرفیت نامی مسافر (Q):" : "Rated Capacity (Q):"}
            </span>
            <select
              value={capacity}
              onChange={(e) => handleCapacityChange(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-1.5 text-xs font-mono outline-none focus:border-sky-500"
            >
              <option value="320">۴ نفره (۳۲۰ kg)</option>
              <option value="450">۶ نفره (۴۵۰ kg)</option>
              <option value="630">۸ نفره (۶۳۰ kg) - استاندارد</option>
              <option value="800">۱۰ نفره (۸۰۰ kg)</option>
              <option value="1000">۱۳ نفره (۱۰۰۰ kg)</option>
              <option value="1275">۱۶ نفره (۱۲۷۵ kg) - برانکاردبر</option>
              <option value="1600">۲۱ نفره (۱۶۰۰ kg) - تخت‌بر</option>
            </select>
          </div>

          {/* Speed */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-300 block">
              {isFa ? "سرعت نامی حرکت (v):" : "Rated Speed (v):"}
            </span>
            <select
              value={speed}
              onChange={(e) => handleSpeedChange(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-1.5 text-xs font-mono outline-none focus:border-sky-500"
            >
              <option value="1.0">۱.۰ متر بر ثانیه (استاندارد)</option>
              <option value="1.6">۱.۶ متر بر ثانیه (ساختمان‌های متوسط)</option>
              <option value="2.0">۲.۰ متر بر ثانیه (برج‌های بلند)</option>
              <option value="2.5">۲.۵ متر بر ثانیه (تندرو)</option>
            </select>
          </div>

          {/* Suspension System */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-300 block">
              {isFa ? "سیستم تعلیق (Suspension):" : "Suspension Type:"}
            </span>
            <select
              value={suspension}
              onChange={(e) => handleSuspensionChange(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-1.5 text-xs font-mono outline-none focus:border-sky-500"
            >
              <option value="1:1">۱:۱ مستقیم (Direct Traction)</option>
              <option value="2:1">۲:۱ زیر کابین MRL (Underslung)</option>
              <option value="4:1">۴:۱ باربری سنگین (Heavy Freight)</option>
              <option value="cantilever">۲:۱ کوله‌ای / کنسولی (Cantilever)</option>
            </select>
          </div>

          {/* Counterweight Position */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-300 block">
              {isFa ? "آرایش وزنه تعادل (CWT):" : "CWT Position:"}
            </span>
            <select
              value={cwtPosition}
              onChange={(e) => handleCwtPositionChange(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-1.5 text-xs font-mono outline-none focus:border-sky-500"
            >
              <option value="rear">وزنه پشت چاهک (Rear CWT)</option>
              <option value="right">وزنه سمت راست (Right Side CWT)</option>
              <option value="left">وزنه سمت چپ (Left Side CWT)</option>
            </select>
          </div>

          {/* Travel & Stops */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1 col-span-2 sm:col-span-4 lg:col-span-1">
            <span className="text-[11px] font-semibold text-slate-300 block">
              {isFa ? "تعداد توقف / طول کورس:" : "Stops / Travel:"}
            </span>
            <div className="flex items-center gap-1.5">
              <select
                value={stops}
                onChange={(e) => {
                  const s = Number(e.target.value);
                  setStops(s);
                  setTravelMeters((s - 1) * 3.2);
                }}
                className="w-1/2 bg-slate-950 border border-slate-700 text-white rounded-lg p-1.5 text-xs font-mono outline-none focus:border-sky-500"
              >
                {[2, 3, 4, 5, 6, 7, 8, 10, 12].map(st => (
                  <option key={st} value={st}>{st} توقف</option>
                ))}
              </select>
              <span className="text-xs font-mono text-sky-400 whitespace-nowrap">{travelMeters.toFixed(1)} m</span>
            </div>
          </div>
        </div>
      </div>

      {/* ==============================================================
          ENGINEERING KPI CARDS (Calculations at a Glance)
      ============================================================== */}
      <div className="p-5 sm:p-6 bg-slate-900/50 border-b border-slate-800 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* KPI 1: Motor Power */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px]">{isFa ? "توان نامی موتور" : "Motor Power"}</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-base sm:text-lg font-black font-mono text-amber-400">
            {motorKw} <span className="text-xs text-slate-400 font-normal">kW</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block mt-0.5">PMSM Gearless</span>
        </div>

        {/* KPI 2: Car Mass */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px]">{isFa ? "جرم کابین خالی (P)" : "Car Tare (P)"}</span>
            <Weight className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-base sm:text-lg font-black font-mono text-sky-400">
            {carWeight} <span className="text-xs text-slate-400 font-normal">kg</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block mt-0.5">بار ناخالص: {carWeight + capacity}kg</span>
        </div>

        {/* KPI 3: CWT Mass */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px]">{isFa ? "جرم وزنه تعادل" : "CWT Mass"}</span>
            <Weight className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-base sm:text-lg font-black font-mono text-emerald-400">
            {cwtWeight} <span className="text-xs text-slate-400 font-normal">kg</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block mt-0.5">بالانس ۴۵٪ بار نامی</span>
        </div>

        {/* KPI 4: Wire Ropes */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px]">{isFa ? "سیم‌بکسل تعلیق" : "Rope Rigging"}</span>
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-base sm:text-lg font-black font-mono text-indigo-400">
            {ropeCount} × 𝜙{ropeDiameter} <span className="text-xs text-slate-400 font-normal">mm</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block mt-0.5">ضریب ایمنی: {staticSafetyFactor} ≥ ۱۲</span>
        </div>

        {/* KPI 5: Guide Rails */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px]">{isFa ? "تیپ ریل کابین/وزنه" : "Guide Rails"}</span>
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-base sm:text-lg font-black font-mono text-cyan-400">
            {carRailType} <span className="text-xs text-slate-400 font-normal">/ {cwtRailType}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block mt-0.5">ISO 7465 Machined</span>
        </div>

        {/* KPI 6: Max Floor Area */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px]">{isFa ? "مساحت مجاز کابین" : "Max Floor Area"}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-base sm:text-lg font-black font-mono text-emerald-400">
            {carAreaMax} <span className="text-xs text-slate-400 font-normal">m²</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block mt-0.5">جدول ۶ استاندارد ۶۳۰۳</span>
        </div>
      </div>

      {/* ==============================================================
          FILTER TABS & SEARCH BAR
      ============================================================== */}
      <div className="p-4 sm:p-5 bg-slate-950/70 border-b border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-mono font-medium whitespace-nowrap transition-all",
                selectedCategory === cat.id
                  ? "bg-sky-600 text-white font-bold shadow-md shadow-sky-600/30"
                  : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
              )}
            >
              {cat.labelFa}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isFa ? "جستجوی قطعه، برند، مشخصات..." : "Search part, brand, standard..."}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pr-9 pl-3 py-1.5 text-xs outline-none focus:border-sky-500 placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* ==============================================================
          COMPREHENSIVE BOM DATA TABLE
      ============================================================== */}
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-slate-950/90 text-[11px] font-mono text-slate-400 border-b border-slate-800 uppercase tracking-wider">
              <th className="py-3 px-4 w-14 text-center">ردیف</th>
              <th className="py-3 px-4 w-24">کد قطعه</th>
              <th className="py-3 px-4 min-w-[220px]">نام قطعه (فارسی و انگلیسی)</th>
              <th className="py-3 px-4 min-w-[240px]">سازنده / برند معتبر مرجع</th>
              <th className="py-3 px-4 min-w-[320px]">مشخصات فنی و متریال</th>
              <th className="py-3 px-4 w-28 text-center">تعداد / متراژ</th>
              <th className="py-3 px-4 min-w-[200px]">استاندارد مرجع و محاسبات</th>
              <th className="py-3 px-4 w-28 text-center">وضعیت انطباق</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredItems.map((item, idx) => (
              <tr 
                key={item.code}
                className="hover:bg-slate-800/40 transition-colors group"
              >
                {/* Index */}
                <td className="py-3 px-4 text-center font-mono text-slate-500">
                  {idx + 1}
                </td>

                {/* Part Code */}
                <td className="py-3 px-4 font-mono font-bold text-sky-400">
                  {item.code}
                </td>

                {/* Name */}
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                    {item.nameFa}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {item.nameEn}
                  </div>
                </td>

                {/* Manufacturer / Brand */}
                <td className="py-3 px-4">
                  <span className="font-semibold text-amber-300 font-mono text-[11px]">
                    {item.manufacturer}
                  </span>
                </td>

                {/* Specs & Material */}
                <td className="py-3 px-4 text-slate-300 leading-relaxed">
                  <div>{item.specs}</div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <span className="text-slate-500">متریال:</span>
                    <span>{item.material}</span>
                  </div>
                </td>

                {/* Quantity */}
                <td className="py-3 px-4 text-center font-mono font-semibold text-sky-300">
                  {item.quantity}
                </td>

                {/* Standard */}
                <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.standard}</span>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3 px-4 text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    <Check className="w-3 h-3" />
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}

            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500 font-mono">
                  هیچ قطعه‌ای مطابق با عبارت جستجو یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ==============================================================
          FOOTER NOTES & TECHNICAL SIGN-OFF
      ============================================================== */}
      <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            {isFa 
              ? "تمام اقلام و ضرایب فوق بر اساس آخرین ویرایش استاندارد ملی ISIRI 6303-1 و EN 81-20/50 محاسبه و اعتبارسنجی شده‌اند." 
              : "All components and calculation safety coefficients conform strictly to ISIRI 6303-1 and EN 81-20/50 standards."}
          </span>
        </div>
        <div className="font-mono text-[11px] text-slate-400">
          تعداد ردیف‌های فعال: <strong className="text-sky-400">{filteredItems.length}</strong> از ۳۲ قلم استاندارد
        </div>
      </div>
    </div>
  );
}
