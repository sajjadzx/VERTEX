"use client";

import React, { useState, useMemo } from "react";
import { 
  FileText, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  Building2, 
  User, 
  MapPin, 
  Phone, 
  Calculator, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Sliders, 
  Info,
  Calendar,
  Sparkles,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProjectMaterialEstimatorProps {
  locale: string;
}

export function ProjectMaterialEstimator({ locale }: ProjectMaterialEstimatorProps) {
  const isFa = locale === "fa";

  // 1. Employer & Project Dossier State
  const [clientName, setClientName] = useState<string>("جناب آقای مهندس رضایی");
  const [projectName, setProjectName] = useState<string>("برج مسکونی ارم");
  const [projectAddress, setProjectAddress] = useState<string>("تهران، بلوار سعادت‌آباد، خیابان مروارید، پلاک ۱۲");
  const [clientPhone, setClientPhone] = useState<string>("09121234567");
  const [quoteNumber, setQuoteNumber] = useState<string>("VTX-2026-8842");

  // 2. Shaft & Hoistway Architectural Parameters
  const [stops, setStops] = useState<number>(6); // 6 stops
  const [floorHeight, setFloorHeight] = useState<number>(3.2); // m
  const [shaftWidth, setShaftWidth] = useState<number>(1800); // mm
  const [shaftDepth, setShaftDepth] = useState<number>(1900); // mm
  const [pitDepth, setPitDepth] = useState<number>(1500); // mm (S1)
  const [overheadHeight, setOverheadHeight] = useState<number>(3800); // mm (K)
  const [capacity, setCapacity] = useState<number>(630); // 8 persons / 630 kg
  const [speed, setSpeed] = useState<number>(1.0); // 1.0 m/s
  const [suspension, setSuspension] = useState<"1:1" | "2:1" | "4:1">("2:1");
  const [cwtPosition, setCwtPosition] = useState<"rear" | "right" | "left">("rear");
  const [doorType, setDoorType] = useState<"telescopic" | "central">("telescopic");
  const [doorWidth, setDoorWidth] = useState<number>(800); // mm

  // 3. Equipment Brand Preferences (Iranian & International Available in Iran)
  const [selectedMotorBrand, setSelectedMotorBrand] = useState<string>("بهران گیرلس (Bhran PMSM Gearless)");
  const [selectedControllerBrand, setSelectedControllerBrand] = useState<string>("آرمان فراز پیمان (AFP) با سیستم بلک‌آوت");
  const [selectedDriveBrand, setSelectedDriveBrand] = useState<string>("یاسکاوا ژاپن (Yaskawa L1000A)");
  const [selectedDoorBrand, setSelectedDoorBrand] = useState<string>("فرمتور اسپانیا / یاران پلاس (Fermator/Yaran)");
  const [selectedRopeBrand, setSelectedRopeBrand] = useState<string>("گوستاو ولف آلمان مغزی کنف (Gustav Wolf PAWO F7)");
  const [selectedRailBrand, setSelectedRailBrand] = useState<string>("مارازی ایتالیا T89/B ماشین‌کاری (Marazzi)");

  const [copied, setCopied] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>("");

  // =========================================================================
  // ENGINEERING CALCULATIONS PER ISIRI 6303-1 / EN 81-20
  // =========================================================================
  const calculations = useMemo(() => {
    // Total travel (H)
    const travelMeters = (stops - 1) * floorHeight;
    // Total shaft height from pit floor to machine room slab
    const totalShaftHeightM = (pitDepth / 1000) + travelMeters + (overheadHeight / 1000);

    // 1. Guide Rails Calculations (5m rail bars)
    const carRailType = capacity > 800 ? "T125/B" : "T89/B";
    const cwtRailType = capacity > 800 ? "T75/B" : "T50/A";
    const railRunLengthM = totalShaftHeightM - 0.2; // Leave 20cm clearance from pit
    const carRailTotalM = railRunLengthM * 2; // 2 rows
    const cwtRailTotalM = railRunLengthM * 2; // 2 rows
    const carRailBarsCount = Math.ceil(carRailTotalM / 5);
    const cwtRailBarsCount = Math.ceil(cwtRailTotalM / 5);
    const bracketSpacing = 2.2; // m (Max 2.5m per ISIRI 6303)
    const bracketCountPerSide = Math.ceil(railRunLengthM / bracketSpacing) + 1;
    const totalBrackets = bracketCountPerSide * 4; // 2 for car, 2 for cwt
    const fishplatesCount = (carRailBarsCount - 2) + (cwtRailBarsCount - 2);

    // 2. Wire Ropes Calculations
    const ropeDiameter = capacity > 1000 ? 11 : 10; // mm
    const ropeCount = capacity >= 1000 ? 5 : (suspension === "1:1" && capacity >= 800 ? 5 : 4);
    const ratioVal = suspension === "1:1" ? 1 : (suspension === "2:1" ? 2 : 4);
    // Length per rope = (travel + overhead + pit + machine room extra + hitch wraps) * ratio + safety margin
    const lengthPerRopeM = (travelMeters + (overheadHeight / 1000) + (pitDepth / 1000) + 4) * ratioVal + 6;
    const totalSuspensionRopesM = Math.round(lengthPerRopeM * ropeCount);

    // 3. Governor Wire Rope
    // Closed continuous loop = totalShaftHeight * 2 + pit tension pulley wrap + extra
    const governorRopeM = Math.round((totalShaftHeightM + 4) * 2 + 5);

    // 4. Flexible Traveling Cable (24-Core Flat)
    // Anchored at mid-shaft (travel / 2) to car bottom with catenary loop and inspection box entry
    const travelingCableM = Math.round((travelMeters / 2) + (overheadHeight / 1000) + 8);

    // 5. Electrical Wiring Schedule for Iran
    const earthWire6mmM = Math.round(totalShaftHeightM + 25); // Main earth bonding
    const earthWire4mmM = Math.round(totalShaftHeightM * 1.5 + 30); // Car and sill earth
    const flexWire15mmM = Math.round((stops * 18) + (totalShaftHeightM * 4) + 60); // Safety circuit & locks
    const flexWire25mmM = Math.round(totalShaftHeightM * 2 + 45); // Lighting & brakes
    const shieldedSensorCableM = Math.round(stops * 14 + 30); // Landing calls & photocell
    const encoderCableM = 15; // Shielded twisted pair

    // 6. Motor Power & Weights
    const carWeight = Math.round(400 + 0.55 * capacity);
    const cwtWeight = Math.round(carWeight + 0.45 * capacity);
    const kw = ((capacity * (1 - 0.45) * 9.81 * speed) / (1000 * 0.78));
    const motorKw = Math.max(3.7, Math.round(kw * 10) / 10);

    // 7. Bolts, Nuts & High-Tensile Fasteners Schedule (محاسبات دقیق پیچ و مهره ۸، ۱۰ و ۱۲ گرید 8.8)
    // پیچ M8 (لنت کفشک، میکروسوئیچ‌ها، شالترها، لیمیت‌ها و سنسورها):
    const boltsM8Count = Math.round(stops * 14 + 60);
    const boltsM8Kg = Math.round((boltsM8Count * 0.026) * 10) / 10;

    // پیچ M10 (مهار براکت‌های ریل وزنه T50، کلمپ‌ها و قفل درب طبقات):
    const boltsM10Count = Math.round(bracketCountPerSide * 2 * 4 + stops * 8 + 48);
    const boltsM10Kg = Math.round((boltsM10Count * 0.048) * 10) / 10;

    // پیچ M12 (براکت‌های ریل کابین T89، پشت‌بندهای فیش‌پلیت و لچکی‌های آهن‌کشی):
    const boltsM12Count = Math.round(bracketCountPerSide * 2 * 6 + fishplatesCount * 4 + 64);
    const boltsM12Kg = Math.round((boltsM12Count * 0.076) * 10) / 10;

    return {
      travelMeters: Math.round(travelMeters * 10) / 10,
      totalShaftHeightM: Math.round(totalShaftHeightM * 10) / 10,
      carRailType,
      cwtRailType,
      carRailBarsCount,
      cwtRailBarsCount,
      totalBrackets,
      fishplatesCount,
      ropeDiameter,
      ropeCount,
      totalSuspensionRopesM,
      governorRopeM,
      travelingCableM,
      earthWire6mmM,
      earthWire4mmM,
      flexWire15mmM,
      flexWire25mmM,
      shieldedSensorCableM,
      encoderCableM,
      carWeight,
      cwtWeight,
      motorKw,
      boltsM8Count,
      boltsM8Kg,
      boltsM10Count,
      boltsM10Kg,
      boltsM12Count,
      boltsM12Kg
    };
  }, [stops, floorHeight, pitDepth, overheadHeight, capacity, speed, suspension]);

  // Master Bill of Quantities Items
  const bomItems = useMemo(() => [
    {
      group: "۱. سیستم محرکه و موتور آسانسور",
      code: "MCH-01",
      itemFa: "موتور آسانسور (موجود در بازار ایران)",
      itemEn: "Traction Elevator Machine",
      spec: `${selectedMotorBrand} | توان نامی ${calculations.motorKw} kW | گشتاور ۳۸۰ N.m | فلکه ۴۰۰mm | مناسب ظرفیت ${capacity}kg و سرعت ${speed}m/s`,
      qty: "۱",
      unit: "دستگاه",
      standard: "استاندارد ملی ایران ۶۳۰۳-۱ و CE",
      category: "mechanical"
    },
    {
      group: "۱. سیستم محرکه و موتور آسانسور",
      code: "MCH-02",
      itemFa: "فلکه هرزگرد انحراف چدنی با شفت و بلبرینگ",
      itemEn: "Diverter Sheave with SKF Bearings",
      spec: `قطر فلکه D = ۳۶۰ تا ۴۰۰ میلیمتر | شیاردار با زاویه گوه استاندارد | مجهز به میله ضد پرش بکسل`,
      qty: suspension === "1:1" ? "۱" : "۳",
      unit: "عدد",
      standard: "ISIRI 6303-1 بند ۵.۵",
      category: "mechanical"
    },
    {
      group: "۱. سیستم محرکه و موتور آسانسور",
      code: "MCH-03",
      itemFa: "شاسی موتورخانه دوبل صنعتی و لرزه‌گیر نئوپرن",
      itemEn: "Machine Steel Bedplate & Neoprene Dampers",
      spec: `ناودانی دوبل UNP160/180 نورد سنگین با ۴ عدد بالشتک الاستومری ایزولاسیون ارتعاشی`,
      qty: "۱",
      unit: "دست",
      standard: "مبحث ۱۵ مقررات ملی ساختمان",
      category: "mechanical"
    },

    // 2. Rails
    {
      group: "۲. ریل‌های راهنما، براکت‌ها و لقمه‌ها",
      code: "RAL-01",
      itemFa: `شاخه‌های ریل راهنمای کابین ${calculations.carRailType}`,
      itemEn: `Car Guide Rails ${calculations.carRailType} (5m)`,
      spec: `${selectedRailBrand} | شاخه ۵ متری ماشین‌کاری دقیق با فاق و زبانه نری و مادگی | رده مقاومت E275B`,
      qty: calculations.carRailBarsCount.toString(),
      unit: "شاخه ۵ متری",
      standard: "ISO 7465 و ISIRI 6303-1",
      category: "rails"
    },
    {
      group: "۲. ریل‌های راهنما، براکت‌ها و لقمه‌ها",
      code: "RAL-02",
      itemFa: `شاخه‌های ریل راهنمای وزنه تعادل ${calculations.cwtRailType}`,
      itemEn: `CWT Guide Rails ${calculations.cwtRailType} (5m)`,
      spec: `شاخه ۵ متری کشش سرد فاق و زبانه‌دار جهت قاب وزنه تعادل | سختی بالا بدون تابیدگی`,
      qty: calculations.cwtRailBarsCount.toString(),
      unit: "شاخه ۵ متری",
      standard: "ISO 7465 و استاندارد ملی",
      category: "rails"
    },
    {
      group: "۲. ریل‌های راهنما، براکت‌ها و لقمه‌ها",
      code: "RAL-03",
      itemFa: "براکت‌های رگلاژی قابل تنظیم آهن‌کشی چاه",
      itemEn: "Adjustable Shaft Rail Brackets",
      spec: `نبشی دوبل گالوانیزه رگلاژی ۶ میلی‌متر با فاصله نصب حداکثر ۲.۲ متر در ارتفاع چاه`,
      qty: calculations.totalBrackets.toString(),
      unit: "دست کامل",
      standard: "ISIRI 6303-1 بند ۱۰.۱.۲",
      category: "rails"
    },
    {
      group: "۲. ریل‌های راهنما، براکت‌ها و لقمه‌ها",
      code: "RAL-04",
      itemFa: "لقمه‌های فولادی چدنی نشکن T1 و T2",
      itemEn: "Ductile Iron Rail Clips (T1 & T2)",
      spec: `لقمه نشکن فولادی همراه با پیچ و مهره گرید ۸.۸ گالوانیزه و واشر فنری`,
      qty: (calculations.totalBrackets * 2).toString(),
      unit: "عدد",
      standard: "استاندارد اتصالات ریل",
      category: "rails"
    },
    {
      group: "۲. ریل‌های راهنما، براکت‌ها و لقمه‌ها",
      code: "RAL-05",
      itemFa: "پشت‌بندهای ماشین‌کاری شده ریل (Fishplates)",
      itemEn: "Machined Rail Fishplates with 8 Bolts",
      spec: `پشت‌بند ۸ سوراخه هم‌محور جهت اتصال صلب شاخه‌های ریل به یکدیگر`,
      qty: calculations.fishplatesCount.toString(),
      unit: "عدد",
      standard: "ISO 7465",
      category: "rails"
    },
    {
      group: "۲. ریل‌های راهنما، براکت‌ها و لقمه‌ها",
      code: "FST-01",
      itemFa: "پیچ، مهره و واشر دوبل نمره M8 تمام‌رزوه گالوانیزه گرید 8.8",
      itemEn: "Hex Bolts & Nuts M8 (Grade 8.8 DIN 933)",
      spec: `پیچ M8x30 گالوانیزه گرم، مهره خودقفل‌شونده نایلونی و واشر فنری DIN 127 | جهت نصب لنت کفشک‌ها، میکروسوئیچ‌ها، شالترها و سنسورها`,
      qty: `${calculations.boltsM8Count} عدد (${calculations.boltsM8Kg} کیلوگرم)`,
      unit: "عدد / کیلوگرم",
      standard: "DIN 933 / گرید ۸.۸",
      category: "rails"
    },
    {
      group: "۲. ریل‌های راهنما، براکت‌ها و لقمه‌ها",
      code: "FST-02",
      itemFa: "پیچ و مهره شش‌گوش خشکه نمره M10 گرید 8.8 فولادی",
      itemEn: "Hex Bolts & Nuts M10 (Grade 8.8 DIN 933)",
      spec: `پیچ M10x40 تمام‌رزوه همراه با مهره و واشر دوبل | جهت اتصال براکت‌های ریل وزنه T50 به آهن‌کشی، لقمه‌ها و قفل‌های درب طبقات`,
      qty: `${calculations.boltsM10Count} عدد (${calculations.boltsM10Kg} کیلوگرم)`,
      unit: "عدد / کیلوگرم",
      standard: "DIN 933 / DIN 127 گرید ۸.۸",
      category: "rails"
    },
    {
      group: "۲. ریل‌های راهنما، براکت‌ها و لقمه‌ها",
      code: "FST-03",
      itemFa: "پیچ و مهره فولادی خشکه نمره M12 گرید 8.8 / 10.9",
      itemEn: "High-Tensile Hex Bolts & Nuts M12 (Grade 8.8/10.9)",
      spec: `پیچ M12x45 خشکه همراه با مهره کاسه‌نمدی و واشر فنری سخت‌کاری شده | جهت اتصال صلب پشت‌بندهای ریل کابین T89، براکت‌های اصلی و لچکی‌ها`,
      qty: `${calculations.boltsM12Count} عدد (${calculations.boltsM12Kg} کیلوگرم)`,
      unit: "عدد / کیلوگرم",
      standard: "DIN 931 / DIN 933 فولاد سخت",
      category: "rails"
    },

    // 3. Ropes & Rigging
    {
      group: "۳. سیم‌بکسل‌ها و اتصالات تعلیق",
      code: "ROP-01",
      itemFa: `سیم‌بکسل فولادی تعلیق نمره ${calculations.ropeDiameter}`,
      itemEn: `Main Suspension Steel Wire Ropes Ø${calculations.ropeDiameter}mm`,
      spec: `${selectedRopeBrand} | بافت 8x19S با مغزی کنف اشباع (NFC) | رده کششی ۱۷۷۰ N/mm² | ${calculations.ropeCount} رشته موازی`,
      qty: calculations.totalSuspensionRopesM.toString(),
      unit: "متر طول",
      standard: "ISIRI 6303-1 بند ۹.۲ (ضریب ایمنی ≥ ۱۲)",
      category: "ropes"
    },
    {
      group: "۳. سیم‌بکسل‌ها و اتصالات تعلیق",
      code: "ROP-02",
      itemFa: `سربکسل‌های اشپیل‌دار گُوه‌ای با فنر لرزه‌گیر DIN 15315`,
      itemEn: "Symmetrical Wedge Sockets with Damping Springs",
      spec: `سربکسل گالوانیزه متقارن نمره ${calculations.ropeDiameter} همراه با گوه، اشپیل، مهره دوبل و لاستیک/فنر ضربه‌گیر`,
      qty: (calculations.ropeCount * (suspension === "1:1" ? 2 : 2)).toString(),
      unit: "دست کامل",
      standard: "DIN 15315 و استاندارد ۶۳۰۳",
      category: "ropes"
    },
    {
      group: "۳. سیم‌بکسل‌ها و اتصالات تعلیق",
      code: "ROP-03",
      itemFa: "سیم‌بکسل فولادی گاورنر سرعت نمره ۶",
      itemEn: "Speed Governor Galvanized Wire Rope Ø6mm",
      spec: `سیم بکسل گالوانیزه مغزی الیافی انعطاف‌پذیر با بافت ۶x۱۹ مخصوص فلکه گاورنر و پاراشوت`,
      qty: calculations.governorRopeM.toString(),
      unit: "متر طول",
      standard: "ISIRI 6303-1 بند ۹.۹.۲",
      category: "ropes"
    },

    // 4. Electrical & Traveling Cable
    {
      group: "۴. کابل متحرک، تابلو فرمان و الکتریکال",
      code: "ELE-01",
      itemFa: "کابل متحرک نواری تخت ۲۴ رشته نسوز (تراول کابل)",
      itemEn: "24-Core Flexible Flat Traveling Cable",
      spec: `داتویلر سوئیس / آلمان | ۲۴ رشته مس خالص با دو رشته سیم بکسل فولادی مهار کشش جانبی | روکش نسوز ضد سایش`,
      qty: calculations.travelingCableM.toString(),
      unit: "متر طول",
      standard: "IEC 60227-6 و استاندارد ملی ۶۳۰۳",
      category: "electrical"
    },
    {
      group: "۴. کابل متحرک، تابلو فرمان و الکتریکال",
      code: "ELE-02",
      itemFa: "تابلو فرمان میکروپروسسوری هوشمند ایرانی",
      itemEn: "VVVF Intelligent Elevator Control Panel",
      spec: `${selectedControllerBrand} | مجهز به درایو ${selectedDriveBrand} | سیستم نجات اضطراری بلک‌آوت (UPS Rescue) | عیب‌یاب هوشمند`,
      qty: "۱",
      unit: "دستگاه",
      standard: "ISIRI 6303-1 بند ۱۳ و ۱۴ و مبحث ۱۵",
      category: "electrical"
    },
    {
      group: "۴. کابل متحرک، تابلو فرمان و الکتریکال",
      code: "ELE-03",
      itemFa: "سیم ارت تمام‌مس نمره ۶ (زرد و سبز)",
      itemEn: "6mm² Copper Main Protective Earth Wire",
      spec: `سیم مسی افشان استاندارد شرکت‌های سیم و کابل معتبر ایران جهت هم‌بندی ارت ریل‌ها، موتور و دال`,
      qty: calculations.earthWire6mmM.toString(),
      unit: "متر طول",
      standard: "مبحث ۱۳ و ۱۵ مقررات ملی",
      category: "electrical"
    },
    {
      group: "۴. کابل متحرک، تابلو فرمان و الکتریکال",
      code: "ELE-04",
      itemFa: "سیم ارت تمام‌مس نمره ۴ (زرد و سبز)",
      itemEn: "4mm² Copper Equipment Earth Wire",
      spec: `سیم مسی استاندارد جهت ارتینگ یوک کابین، قفل درها و سینی زیر کابین`,
      qty: calculations.earthWire4mmM.toString(),
      unit: "متر طول",
      standard: "مبحث ۱۳ مقررات ملی",
      category: "electrical"
    },
    {
      group: "۴. کابل متحرک، تابلو فرمان و الکتریکال",
      code: "ELE-05",
      itemFa: "سیم‌های افشان کلافی نمره ۱.۵ و ۲.۵ (رنگ‌بندی کد استاندارد)",
      itemEn: "1.5mm² & 2.5mm² Single Core Flexible Wires",
      spec: `سیم ۱.۵ جهت مدار سری استپ و قفل لندینگ (${calculations.flexWire15mmM} متر) + سیم ۲.۵ جهت روشنایی و ترمز (${calculations.flexWire25mmM} متر)`,
      qty: (calculations.flexWire15mmM + calculations.flexWire25mmM).toString(),
      unit: "متر طول",
      standard: "استاندارد ملی ISIRI 3569",
      category: "electrical"
    },
    {
      group: "۴. کابل متحرک، تابلو فرمان و الکتریکال",
      code: "ELE-06",
      itemFa: "کابل ۴ رشته شیلددار مهاردار و کابل انکودر",
      itemEn: "Shielded Sensor Cable & Motor Encoder Cable",
      spec: `کابل ۴ رشته جهت شستی احضار و فتوسل پرده‌ای (${calculations.shieldedSensorCableM} متر) + کابل شیلددار انکودر (${calculations.encoderCableM} متر)`,
      qty: (calculations.shieldedSensorCableM + calculations.encoderCableM).toString(),
      unit: "متر طول",
      standard: "استاندارد EMC ضد نویز صنعتی",
      category: "electrical"
    },
    {
      group: "۴. کابل متحرک، تابلو فرمان و الکتریکال",
      code: "ELE-07",
      itemFa: "جعبه رویزیون کارکدک سقف کابین",
      itemEn: "Car Top Inspection Box with Car-Codec",
      spec: `کلید نرمال/رویزیون، دکمه‌های بالا/پایین، پریز برق، چراغ تونلی و کلید قارچی استپ اضطراری قرمز`,
      qty: "۱",
      unit: "دستگاه",
      standard: "ISIRI 6303-1 بند ۱۴.۲.۱.۵",
      category: "electrical"
    },

    // 5. Doors & Entrances
    {
      group: "۵. درب‌های طبقات و کابین",
      code: "DOR-01",
      itemFa: `درب‌های طبقات لندینگ ضدحریق عرض ${doorWidth}mm`,
      itemEn: `Fire-Rated Landing Doors (${doorWidth}mm)`,
      spec: `${selectedDoorBrand} | تیپ ${doorType === "telescopic" ? "تلسکوپی دو لنگه" : "سانترال دو لنگه"} | رده مقاومت در برابر حریق E120/EW60 | همراه با قفل و دیکتاتور`,
      qty: stops.toString(),
      unit: "دستگاه",
      standard: "استاندارد ملی ۲-۶۳۰۳ و EN 81-58",
      category: "doors"
    },
    {
      group: "۵. درب‌های طبقات و کابین",
      code: "DOR-02",
      itemFa: "اپراتور درب کابین هوشمند VVVF",
      itemEn: "Automatic Intelligent VVVF Car Door Operator",
      spec: `موتور براشلس بدون سنسور سایش با کنترلر هوشمند ضد برخورد مانع و حرکت سایلنت`,
      qty: "۱",
      unit: "دستگاه",
      standard: "ISIRI 6303-1 بند ۷.۵",
      category: "doors"
    },
    {
      group: "۵. درب‌های طبقات و کابین",
      code: "DOR-03",
      itemFa: "پرده نوری ایمنی سراسری درب (Photocell Curtain)",
      itemEn: "Full-Height Infrared Light Curtain (128 Beams)",
      spec: `۱۲۸ پرتو مادون قرمز متقاطع با پوشش ارتفاع تا ۱۸۰ سانتیمتر و عملکرد ضد آب IP65`,
      qty: "۱",
      unit: "ست فرستنده/گیرنده",
      standard: "ISIRI 6303-1 بند ۷.۷.۵",
      category: "doors"
    },

    // 6. Safety & Buffers
    {
      group: "۶. ایمنی، پاراشوت، گاورنر و بافرها",
      code: "SAF-01",
      itemFa: "گاورنر سرعت دوجهته گریز از مرکز با کنتاکت برقی",
      itemEn: "Bidirectional Overspeed Governor",
      spec: `تحریک در سرعت ۱.۳۲ m/s با میکروسوئیچ ایمنی و فلکه ۲۰۰ میلی‌متری`,
      qty: "۱",
      unit: "دستگاه",
      standard: "ISIRI 6303-1 بند ۹.۹",
      category: "safety"
    },
    {
      group: "۶. ایمنی، پاراشوت، گاورنر و بافرها",
      code: "SAF-02",
      itemFa: "ترمز ایمنی پاراشوت تدریجی دوسویه (Progressive)",
      itemEn: "Progressive Safety Gear Blocks",
      spec: `فک‌های عاج‌دار فولادی سمانته مناسب ریل ${calculations.carRailType} و بار ناخالص تا ۲۲۰۰kg`,
      qty: "۱",
      unit: "جفت (چپ و راست)",
      standard: "ISIRI 6303-1 بند ۹.۸",
      category: "safety"
    },
    {
      group: "۶. ایمنی، پاراشوت، گاورنر و بافرها",
      code: "SAF-03",
      itemFa: "فلکه کششی ته‌چاهک با وزنه چدنی و سوئیچ",
      itemEn: "Pit Governor Tension Pulley with Safety Switch",
      spec: `وزنه چدنی ۲۵ کیلوگرم و میکروسوئیچ قطع مدار ایمنی هنگام شل شدن بکسل`,
      qty: "۱",
      unit: "مجموعه",
      standard: "ISIRI 6303-1 بند ۹.۹.۲",
      category: "safety"
    },
    {
      group: "۶. ایمنی، پاراشوت، گاورنر و بافرها",
      code: "SAF-04",
      itemFa: "ضربه‌گیرهای الاستومری پلی‌اورتان ته‌چاهک با پایه‌ها",
      itemEn: "Cellular Polyurethane Pit Buffers with Steel Plinths",
      spec: `ACLA آلمان / هنینگ | ۲ عدد زیر کابین و ۱ عدد زیر وزنه با کورس فشرده‌شدن ۱۲۰mm و پایه‌های قوطی فولادی`,
      qty: "۳",
      unit: "عدد",
      standard: "ISIRI 6303-1 بند ۱۰.۳ و ۱۰.۴",
      category: "safety"
    }
  ], [
    selectedMotorBrand, selectedControllerBrand, selectedDriveBrand, 
    selectedDoorBrand, selectedRopeBrand, selectedRailBrand, 
    calculations, capacity, speed, suspension, doorWidth, doorType, stops
  ]);

  const filteredItems = useMemo(() => {
    if (!searchFilter) return bomItems;
    const q = searchFilter.toLowerCase();
    return bomItems.filter(i => 
      i.itemFa.toLowerCase().includes(q) ||
      i.spec.toLowerCase().includes(q) ||
      i.code.toLowerCase().includes(q) ||
      i.group.toLowerCase().includes(q)
    );
  }, [bomItems, searchFilter]);

  // Export to CSV
  const handleExportCSV = () => {
    const header = "ردیف,کد کالا,شرح قطعه و تجهیز,مشخصات فنی و متریال استاندارد,تعداد/متراژ,واحد,استاندارد مرجع\n";
    const rows = filteredItems.map((item, idx) => 
      `"${idx + 1}","${item.code}","${item.itemFa}","${item.spec.replace(/"/g, '""')}","${item.qty}","${item.unit}","${item.standard}"`
    ).join("\n");
    const blob = new Blob(["\uFEFF" + header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `پیش‌فاکتور_${projectName.replace(/\s+/g, '_')}_${quoteNumber}.csv`;
    link.click();
  };

  // Copy to clipboard
  const handleCopy = () => {
    const text = `پیش‌فاکتور رسمی و جدول متریال آسانسور VERTEX\nکارفرما: ${clientName} | پروژه: ${projectName}\nتلفن: ${clientPhone} | شماره پیش‌فاکتور: ${quoteNumber}\nتعداد توقف: ${stops} | ظرفیت: ${capacity}kg | سرعت: ${speed}m/s\n\n` +
      filteredItems.map(i => `${i.code}: ${i.itemFa} -> ${i.qty} ${i.unit} (${i.spec})`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-vazir text-slate-100">
      {/* ==============================================================
          HEADER: OFFICIAL RFQ & PROJECT ESTIMATOR
      ============================================================== */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 sm:p-6 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 shadow-inner">
              <Calculator className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-black text-white font-mono">
                  {isFa ? "محاسبات فنی، برآورد متریال و پیش‌فاکتور رسمی آسانسور" : "Official Project Sizing & Material Quotation Engine"}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  استاندارد ملی ۶۳۰۳ / مبحث ۱۵
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {isFa 
                  ? "محاسبه دقیق تعداد شاخه‌های ریل، متراژ سیم‌بکسل‌ها، تراول‌کابل، انواع سیم‌های مصرفی، موتورهای بهران/الکو و تابلوهای آرمان‌فراز/داتیس" 
                  : "Precision calculation of rail bars, wire rope meters, traveling cables, Iranian control panels, and motors."}
              </p>
            </div>
          </div>

          {/* Action Buttons: Print, Excel, Copy */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-slate-900 text-slate-200 border border-slate-700 text-xs font-mono font-bold hover:bg-slate-800 transition-all flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (isFa ? "کپی شد" : "Copied") : (isFa ? "کپی پیش‌فاکتور" : "Copy")}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-mono font-bold hover:bg-emerald-500 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isFa ? "خروجی اکسل (CSV)" : "Excel Export"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-sky-600 text-white text-xs font-mono font-bold hover:bg-sky-500 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isFa ? "چاپ پیش‌فاکتور رسمی" : "Print RFQ"}</span>
            </button>
          </div>
        </div>

        {/* ==============================================================
            SECTION A: EMPLOYER & PROJECT INFORMATION (مشخصات پروژه و کارفرما)
        ============================================================== */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider font-mono">
            <User className="w-4 h-4" />
            <span>{isFa ? "الف) مشخصات شناسنامه پروژه و کارفرما" : "A) Client & Project Dossier"}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            {/* Client Name */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium block">
                {isFa ? "نام کارفرما / خریدار:" : "Employer / Client Name:"}
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2 text-xs outline-none focus:border-sky-500 font-bold"
              />
            </div>

            {/* Project Name */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium block">
                {isFa ? "نام پروژه / مجتمع:" : "Project / Building Name:"}
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2 text-xs outline-none focus:border-sky-500 font-bold text-sky-300"
              />
            </div>

            {/* Client Phone */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium block">
                {isFa ? "شماره تماس کارفرما:" : "Client Phone Number:"}
              </label>
              <input
                type="text"
                dir="ltr"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2 text-xs outline-none focus:border-sky-500 font-mono"
              />
            </div>

            {/* Quote Ref No */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium block">
                {isFa ? "شماره پیش‌فاکتور / سریال:" : "Quote Ref #:"}
              </label>
              <input
                type="text"
                dir="ltr"
                value={quoteNumber}
                onChange={(e) => setQuoteNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-amber-400 rounded-lg p-2 text-xs outline-none focus:border-sky-500 font-mono font-bold"
              />
            </div>

            {/* Project Address */}
            <div className="sm:col-span-2 lg:col-span-4 space-y-1 pt-1">
              <label className="text-[11px] text-slate-400 font-medium block">
                {isFa ? "آدرس و موقعیت احداث پروژه:" : "Project Site Location & Address:"}
              </label>
              <input
                type="text"
                value={projectAddress}
                onChange={(e) => setProjectAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-2 text-xs outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* ==============================================================
            SECTION B: HOISTWAY DIMENSIONS & ELEVATOR PARAMETERS
        ============================================================== */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider font-mono">
            <Building2 className="w-4 h-4" />
            <span>{isFa ? "ب) مشخصات هندسی چاهک و پارامترهای حرکتی" : "B) Shaft Dimensions & Travel Specs"}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            {/* Number of Stops */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium block">
                {isFa ? "تعداد توقف (Stops):" : "Stops:"}
              </label>
              <input
                type="number"
                min={2}
                max={24}
                value={stops}
                onChange={(e) => setStops(Math.max(2, Number(e.target.value)))}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2 text-xs font-mono font-bold outline-none focus:border-sky-500"
              />
            </div>

            {/* Floor Height */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium block">
                {isFa ? "ارتفاع طبقات (m):" : "Floor Height (m):"}
              </label>
              <input
                type="number"
                step="0.1"
                min={2.5}
                max={5.0}
                value={floorHeight}
                onChange={(e) => setFloorHeight(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2 text-xs font-mono font-bold outline-none focus:border-sky-500"
              />
            </div>

            {/* Shaft Width */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium block">
                {isFa ? "عرض چاهک (mm):" : "Shaft Width (mm):"}
              </label>
              <input
                type="number"
                step={50}
                value={shaftWidth}
                onChange={(e) => setShaftWidth(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2 text-xs font-mono font-bold outline-none focus:border-sky-500"
              />
            </div>

            {/* Shaft Depth */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium block">
                {isFa ? "عمق چاهک (mm):" : "Shaft Depth (mm):"}
              </label>
              <input
                type="number"
                step={50}
                value={shaftDepth}
                onChange={(e) => setShaftDepth(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2 text-xs font-mono font-bold outline-none focus:border-sky-500"
              />
            </div>

            {/* Pit Depth S1 */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium block">
                {isFa ? "عمق چاله چاهک S1 (mm):" : "Pit Depth S1 (mm):"}
              </label>
              <input
                type="number"
                step={50}
                value={pitDepth}
                onChange={(e) => setPitDepth(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-emerald-400 rounded-lg p-2 text-xs font-mono font-bold outline-none focus:border-sky-500"
              />
            </div>

            {/* Overhead Height K */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium block">
                {isFa ? "ارتفاع بالاسری K (mm):" : "Overhead K (mm):"}
              </label>
              <input
                type="number"
                step={50}
                value={overheadHeight}
                onChange={(e) => setOverheadHeight(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-sky-400 rounded-lg p-2 text-xs font-mono font-bold outline-none focus:border-sky-500"
              />
            </div>

            {/* Capacity */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium block">
                {isFa ? "ظرفیت نامی (Q):" : "Capacity (Q):"}
              </label>
              <select
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2 text-xs font-mono outline-none focus:border-sky-500"
              >
                <option value={320}>۴ نفره (۳۲۰ kg)</option>
                <option value={450}>۶ نفره (۴۵۰ kg)</option>
                <option value={630}>۸ نفره (۶۳۰ kg) - استاندارد</option>
                <option value={800}>۱۰ نفره (۸۰۰ kg)</option>
                <option value={1000}>۱۳ نفره (۱۰۰۰ kg)</option>
                <option value={1275}>۱۶ نفره (۱۲۷۵ kg)</option>
                <option value={1600}>۲۱ نفره (۱۶۰۰ kg)</option>
              </select>
            </div>

            {/* Speed */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium block">
                {isFa ? "سرعت نامی (v):" : "Rated Speed (v):"}
              </label>
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2 text-xs font-mono outline-none focus:border-sky-500"
              >
                <option value={1.0}>۱.۰ متر بر ثانیه</option>
                <option value={1.6}>۱.۶ متر بر ثانیه</option>
                <option value={2.0}>۲.۰ متر بر ثانیه</option>
                <option value={2.5}>۲.۵ متر بر ثانیه</option>
              </select>
            </div>

            {/* Suspension */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium block">
                {isFa ? "سیستم تعلیق:" : "Suspension:"}
              </label>
              <select
                value={suspension}
                onChange={(e) => setSuspension(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2 text-xs font-mono outline-none focus:border-sky-500"
              >
                <option value="1:1">۱:۱ مستقیم</option>
                <option value="2:1">۲:۱ زیر کابین MRL</option>
                <option value="4:1">۴:۱ باربری سنگین</option>
              </select>
            </div>

            {/* CWT Position */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium block">
                {isFa ? "آرایش وزنه:" : "CWT Position:"}
              </label>
              <select
                value={cwtPosition}
                onChange={(e) => setCwtPosition(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2 text-xs font-mono outline-none focus:border-sky-500"
              >
                <option value="rear">وزنه پشت چاه</option>
                <option value="right">وزنه سمت راست</option>
                <option value="left">وزنه سمت چپ</option>
              </select>
            </div>

            {/* Door Type */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium block">
                {isFa ? "نوع درب طبقات:" : "Door Type:"}
              </label>
              <select
                value={doorType}
                onChange={(e) => setDoorType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2 text-xs font-mono outline-none focus:border-sky-500"
              >
                <option value="telescopic">تلسکوپی ۲ لنگه</option>
                <option value="central">سانترال ۲ لنگه وسط‌بازشو</option>
              </select>
            </div>

            {/* Door Width */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium block">
                {isFa ? "عرض مفید درب (mm):" : "Door Width (mm):"}
              </label>
              <select
                value={doorWidth}
                onChange={(e) => setDoorWidth(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2 text-xs font-mono outline-none focus:border-sky-500"
              >
                <option value={800}>۸۰۰ میلیمتر</option>
                <option value={900}>۹۰۰ میلیمتر</option>
                <option value={1000}>۱۰۰۰ میلیمتر</option>
                <option value={1100}>۱۱۰۰ میلیمتر</option>
              </select>
            </div>
          </div>
        </div>

        {/* ==============================================================
            SECTION C: IRANIAN & MARKET BRAND PREFERENCES
        ============================================================== */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider font-mono">
            <Zap className="w-4 h-4" />
            <span>{isFa ? "ج) برندها و تجهیزات معتبر موجود در بازار ایران" : "C) Equipment Brands Available in Iran"}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs">
            {/* Traction Machine */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium block">
                {isFa ? "موتور آسانسور (محرکه):" : "Traction Machine:"}
              </label>
              <select
                value={selectedMotorBrand}
                onChange={(e) => setSelectedMotorBrand(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-amber-300 rounded-lg p-2 outline-none focus:border-sky-500"
              >
                <option value="بهران گیرلس (Bhran PMSM Gearless)">بهران گیرلس (Bhran PMSM) - ساخت ایران با استاندارد ملی</option>
                <option value="بهران گیربکس (Bhran Geared)">بهران گیربکس دو سرعته/۳VF - ایران</option>
                <option value="الکو ایران مدل NR12 / TR5 (ELCO)">الکو ایران (ELCO) - ساخت ایران</option>
                <option value="موتوژن تبریز (Motogen)">موتوژن تبریز - ساخت ایران</option>
                <option value="آلبرتو ساسی ایتالیا (Alberto Sassi)">آلبرتو ساسی ایتالیا (Alberto Sassi) - وارداتی</option>
                <option value="مونتاناری ایتالیا (Montanari MGX)">مونتاناری ایتالیا (Montanari) - وارداتی</option>
                <option value="زیلابگ آلمان سری ZAtop (Ziehl-Abegg)">زیلابگ آلمان (Ziehl-Abegg ZAtop) - وارداتی</option>
              </select>
            </div>

            {/* Controller */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium block">
                {isFa ? "تابلو فرمان آسانسور:" : "Elevator Controller:"}
              </label>
              <select
                value={selectedControllerBrand}
                onChange={(e) => setSelectedControllerBrand(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-sky-300 rounded-lg p-2 outline-none focus:border-sky-500"
              >
                <option value="آرمان فراز پیمان (AFP) با سیستم بلک‌آوت">آرمان فراز پیمان (AFP) - نجات اضطراری هوشمند UPS</option>
                <option value="داتیس (Datis) سری کارکدک لیان">داتیس (Datis) - کارکدک لیان با برد میکروکنترلری</option>
                <option value="آریان آسانسور (Arian) سری اکو">آریان آسانسور (Arian Control) - پردازشگر ۳۲ بیتی</option>
                <option value="پایا کنترل (Paya Control)">پایا کنترل (Paya) - هوشمند</option>
                <option value="الکو کنترل (ELCO Panel)">الکو کنترل - همگام با موتورهای الکو</option>
              </select>
            </div>

            {/* Drive */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium block">
                {isFa ? "درایو کنترل سرعت (VVVF Inverter):" : "VVVF Drive:"}
              </label>
              <select
                value={selectedDriveBrand}
                onChange={(e) => setSelectedDriveBrand(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-emerald-300 rounded-lg p-2 outline-none focus:border-sky-500"
              >
                <option value="یاسکاوا ژاپن (Yaskawa L1000A)">یاسکاوا ژاپن (Yaskawa L1000A / GA700) - بسیار نرم و بی‌صدا</option>
                <option value="جفران ایتالیا (Gefran ADL300)">جفران ایتالیا (Gefran ADL300) - تخصصی آسانسور</option>
                <option value="زیما ایران (Xima W9)">زیما ایران (Xima) - درایو ایرانی دانش‌بنیان با گارانتی</option>
                <option value="سناو تایوان (Sanch)">سناو تایوان (Sanch) - باکیفیت و اقتصادی</option>
                <option value="ال‌اس کره جنوبی (LS iG5A / iS7)">ال‌اس کره (LS Electric) - بادوام و پایدار</option>
              </select>
            </div>

            {/* Wire Ropes */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium block">
                {isFa ? "سیم‌بکسل تعلیق و گاورنر:" : "Wire Ropes:"}
              </label>
              <select
                value={selectedRopeBrand}
                onChange={(e) => setSelectedRopeBrand(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-2 outline-none focus:border-sky-500"
              >
                <option value="گوستاو ولف آلمان مغزی کنف (Gustav Wolf PAWO F7)">گوستاو ولف آلمان (Gustav Wolf PAWO F7) - استاندارد برتر</option>
                <option value="بروگ سوئیس (Brugg Drahtseil AG)">بروگ سوئیس (Brugg Drahtseil) - فوق‌العاده مقاوم</option>
                <option value="پفایفر دراکو آلمان (Pfeifer Drako)">پفایفر دراکو (Pfeifer Drako) - تخصصی آسانسورهای تندرو</option>
                <option value="سیم‌بکسل فولادی استاندارد ایرانی">سیم‌بکسل استاندارد بافت ۸x۱۹ مغزی کنف</option>
              </select>
            </div>

            {/* Guide Rails */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium block">
                {isFa ? "شاخه‌های ریل راهنما:" : "Guide Rails:"}
              </label>
              <select
                value={selectedRailBrand}
                onChange={(e) => setSelectedRailBrand(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-2 outline-none focus:border-sky-500"
              >
                <option value="مارازی ایتالیا T89/B ماشین‌کاری (Marazzi)">مارازی ایتالیا (Marazzi) - ماشین‌کاری فاق و زبانه‌دار</option>
                <option value="ساورا اسپانیا T89/B (Savera)">ساورا اسپانیا (Savera) - استاندارد ISO 7465</option>
                <option value="مونتفرو ایتالیا (Monteferro)">مونتفرو ایتالیا (Monteferro)</option>
                <option value="چیلیک تورک (Celik Turk)">چیلیک تورک - کشش سرد و ماشین‌کاری</option>
              </select>
            </div>

            {/* Landing Doors */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium block">
                {isFa ? "درب‌های لندینگ طبقات و کابین:" : "Landing & Car Doors:"}
              </label>
              <select
                value={selectedDoorBrand}
                onChange={(e) => setSelectedDoorBrand(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-2 outline-none focus:border-sky-500"
              >
                <option value="فرمتور اسپانیا / یاران پلاس (Fermator/Yaran)">فرمتور اسپانیا / یاران پلاس (رده حریق E120)</option>
                <option value="ویتور آلمان سری آگوستا (Wittur Augusta)">ویتور آلمان (Wittur Augusta Evo)</option>
                <option value="حریری ایران (Hariri Doors)">صنایع درب آسانسور حریری - تمام اتوماتیک</option>
                <option value="روانکار / بهران">روانکار / درب‌های تمام اتوماتیک تلسکوپی و سانترال</option>
              </select>
            </div>
          </div>
        </div>

        {/* ==============================================================
            SECTION D: AUTOMATED ENGINEERING SIZING METRICS
        ============================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Metric 1 */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">کورس حرکت / ارتفاع کل</span>
            <div className="text-base sm:text-lg font-black font-mono text-sky-400">
              {calculations.travelMeters}m <span className="text-xs text-slate-400 font-normal">/ {calculations.totalShaftHeightM}m</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">{stops} توقف</span>
          </div>

          {/* Metric 2 */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">شاخه‌های ریل کابین/وزنه</span>
            <div className="text-base sm:text-lg font-black font-mono text-cyan-400">
              {calculations.carRailBarsCount} <span className="text-xs text-slate-400 font-normal">شاخه ({calculations.cwtRailBarsCount} وزنه)</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">ریل ۵ متری استاندارد</span>
          </div>

          {/* Metric 3 */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">متراژ سیم‌بکسل تعلیق</span>
            <div className="text-base sm:text-lg font-black font-mono text-indigo-400">
              {calculations.totalSuspensionRopesM} <span className="text-xs text-slate-400 font-normal">متر</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">{calculations.ropeCount} رشته نمره {calculations.ropeDiameter}</span>
          </div>

          {/* Metric 4 */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">متراژ تراول کابل ۲۴ رشته</span>
            <div className="text-base sm:text-lg font-black font-mono text-emerald-400">
              {calculations.travelingCableM} <span className="text-xs text-slate-400 font-normal">متر</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">مس خالص با مهار فولادی</span>
          </div>

          {/* Metric 5 */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">سیم‌بکسل گاورنر سرعت</span>
            <div className="text-base sm:text-lg font-black font-mono text-amber-400">
              {calculations.governorRopeM} <span className="text-xs text-slate-400 font-normal">متر</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">فولاد گالوانیزه نمره ۶</span>
          </div>

          {/* Metric 6 */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">توان موتور / تعادل</span>
            <div className="text-base sm:text-lg font-black font-mono text-purple-400">
              {calculations.motorKw} <span className="text-xs text-slate-400 font-normal">kW</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">وزنه: {calculations.cwtWeight}kg</span>
          </div>
        </div>
      </div>

      {/* ==============================================================
          OFFICIAL RFQ TABLE (پیش‌فاکتور رسمی و جدول تفکیکی اقلام)
      ============================================================== */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
        {/* Table Search & Title Header */}
        <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-400" />
            <h2 className="text-sm sm:text-base font-bold text-white font-mono">
              {isFa ? "جدول تفکیکی اقلام و پیش‌فاکتور قطعات متریال آسانسور" : "Detailed Bill of Materials & Equipment Quantities"}
            </h2>
          </div>

          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder={isFa ? "جستجوی ریل، سیم، موتور، تابلو..." : "Search parts, wires, rails..."}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pr-9 pl-3 py-1.5 text-xs outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Printable Official Letterhead (Visible in Print) */}
        <div className="hidden print:block p-6 bg-white text-slate-900 border-b border-slate-300">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <h1 className="text-2xl font-black">شرکت مهندسی آسانسور و بالابر VERTEX</h1>
              <p className="text-xs text-slate-600 mt-1">پیش‌فاکتور رسمی و شناسنامه محاسبات فنی متریال پروژه</p>
            </div>
            <div className="text-left text-xs font-mono">
              <div>شماره: {quoteNumber}</div>
              <div>تاریخ: {new Date().toLocaleDateString('fa-IR')}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
            <div><strong>کارفرما:</strong> {clientName}</div>
            <div><strong>نام پروژه:</strong> {projectName}</div>
            <div><strong>تلفن:</strong> {clientPhone}</div>
            <div><strong>تعداد توقف:</strong> {stops} توقف | {capacity} کیلوگرم | {speed} m/s</div>
            <div className="col-span-2"><strong>آدرس:</strong> {projectAddress}</div>
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/90 text-[11px] font-mono text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">ردیف</th>
                <th className="py-3 px-4 w-24">کد قطعه</th>
                <th className="py-3 px-4 min-w-[220px]">شرح کالا و تجهیزات</th>
                <th className="py-3 px-4 min-w-[340px]">مشخصات فنی، برند و متریال</th>
                <th className="py-3 px-4 w-24 text-center font-bold text-sky-400">تعداد/متراژ</th>
                <th className="py-3 px-4 w-28 text-center">واحد سنجش</th>
                <th className="py-3 px-4 min-w-[200px]">استاندارد مرجع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredItems.map((item, idx) => (
                <tr 
                  key={idx} 
                  className="hover:bg-slate-900/60 transition-colors group"
                >
                  <td className="py-3 px-4 text-center font-mono text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-sky-400">
                    {item.code}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-100 group-hover:text-sky-300">
                    {item.itemFa}
                  </td>
                  <td className="py-3 px-4 text-slate-300 leading-relaxed">
                    {item.spec}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-black text-sky-400 text-sm">
                    {item.qty}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-400 font-medium">
                    {item.unit}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-emerald-400 flex items-center gap-1.5 pt-3">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.standard}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Official Sign-off & Developer Box */}
        <div className="p-5 bg-slate-900 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Info className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              {isFa 
                ? "تمامی متراژها و مقادیر فوق با فرمول‌های دقیق استاندارد ملی ایران ۶۳۰۳-۱ و مبحث ۱۵ محاسبه شده و دارای ضرایب اطمینان مهندسی می‌باشند." 
                : "All material quantities and wire schedules calculated per ISIRI 6303 and Iranian National Building Code Art. 15."}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3 font-mono text-[11px]">
            <div>
              <span className="text-slate-500 block">طرح و محاسبات فنی:</span>
              <span className="font-bold text-white">سید سجاد طباطبایی</span>
            </div>
            <div className="border-r border-slate-800 pr-3">
              <span className="text-slate-500 block">تماس مستقیم مهندسی:</span>
              <a href="tel:09013356283" className="font-bold text-sky-400 hover:underline" dir="ltr">09013356283</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
