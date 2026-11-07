export interface ProjectItem {
  id: string;
  category: "commercial" | "transit" | "hospitality";
  titleEn: string;
  titleFa: string;
  locationEn: string;
  locationFa: string;
  floors: number;
  height: string;
  speed: string;
  units: string;
  image: string;
  featured: boolean;
}

export const SHOWCASE_PROJECTS: ProjectItem[] = [
  {
    id: "lumina-tower",
    category: "commercial",
    titleEn: "Lumina Financial Pinnacle",
    titleFa: "برج بین‌المللی لومینا سنتر",
    locationEn: "Frankfurt, Germany",
    locationFa: "فرانکفورت، آلمان",
    floors: 68,
    height: "295 m",
    speed: "8.0 m/s",
    units: "18 Double-Deck Traction Units",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    featured: true,
  },
  {
    id: "aero-terminal-4",
    category: "transit",
    titleEn: "Grand Central Trans-Terminal",
    titleFa: "پایانه مرکزی فرودگاه بین‌المللی ترنزیت",
    locationEn: "Zurich, Switzerland",
    locationFa: "زوریخ، سوئیس",
    floors: 6,
    height: "36 m",
    speed: "0.65 m/s",
    units: "32 Heavy-Duty Transit Escalators & 16 Autowalks",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?q=80&w=1200&auto=format&fit=crop",
    featured: true,
  },
  {
    id: "solaris-atrium",
    category: "hospitality",
    titleEn: "The Royal Mirage Atrium & Suites",
    titleFa: "مجموعه لوکس هتل و آتریوم رویال میراژ",
    locationEn: "Dubai Marina, UAE",
    locationFa: "دبی مارینا، امارات",
    floors: 45,
    height: "190 m",
    speed: "4.0 m/s",
    units: "6 Panoramic Glass Observation Cabs",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
    featured: true,
  },
  {
    id: "horizon-center",
    category: "commercial",
    titleEn: "Horizon Innovation Plaza",
    titleFa: "مرکز نوآوری و تحقیقات هورایزن",
    locationEn: "Tehran, Iran",
    locationFa: "تهران، ایران",
    floors: 32,
    height: "135 m",
    speed: "3.5 m/s",
    units: "12 MRL High-Efficiency Elevators",
    image: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=1200&auto=format&fit=crop",
    featured: false,
  },
  {
    id: "nexus-metro",
    category: "transit",
    titleEn: "Underground Transit Interchange",
    titleFa: "ایستگاه تقاطعی خطوط مترو اکسپرس",
    locationEn: "Tokyo, Japan",
    locationFa: "توکیو، ژاپن",
    floors: 4,
    height: "28 m underground",
    speed: "0.75 m/s",
    units: "24 Transit-spec Escalators with Dual Drives",
    image: "https://images.unsplash.com/photo-1508873696983-2df5293cb32b?q=80&w=1200&auto=format&fit=crop",
    featured: false,
  },
  {
    id: "azure-residences",
    category: "hospitality",
    titleEn: "Azure Waterfront Sky Villas",
    titleFa: "برج‌های مسکونی لوکس آزور اسکای",
    locationEn: "Monaco",
    locationFa: "موناکو",
    floors: 28,
    height: "115 m",
    speed: "2.5 m/s",
    units: "8 Custom Titanium-Finished Residential Cabs",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop",
    featured: false,
  },
];

export interface AnatomyComponent {
  id: string;
  nameEn: string;
  nameFa: string;
  category: "mechanical" | "safety" | "hoistway" | "cabin";
  functionEn: string;
  functionFa: string;
  specsEn: string;
  specsFa: string;
  normReference: string;
  coords: { x: number; y: number }; // Percentage coords for SVG schematic
}

export const ELEVATOR_ANATOMY_DATA: AnatomyComponent[] = [
  {
    id: "traction-machine",
    nameEn: "Gearless PMSM Traction Machine",
    nameFa: "موتور گیرلس سنکرون مغناطیس دائم (PMSM)",
    category: "mechanical",
    functionEn: "Converts electrical power into smooth rotational torque to drive suspension ropes without mechanical reduction gear losses.",
    functionFa: "تبدیل توان الکتریکی به گشتاور دورانی پیوسته جهت حرکت سیم‌بکسل‌ها بدون اتلاف مکانیکی گیربکس‌های سنتی.",
    specsEn: "Efficiency: >94%, Torque: up to 1,600 Nm, Rare-earth NdFeB permanent magnets, Dual independent disc brakes.",
    specsFa: "راندمان بیش از ۹۴٪، گشتاور تا ۱۶۰۰ نیوتن‌متر، مگنت نئودیمیوم دائم، ترمز دوگانه دیسکی مستقل.",
    normReference: "EN 81-20 § 5.9.2 / ISO 8100-1",
    coords: { x: 50, y: 12 },
  },
  {
    id: "governor",
    nameEn: "Bi-Directional Overspeed Governor",
    nameFa: "گاورنر سرعت دوطرفه مکانیکی",
    category: "safety",
    functionEn: "Centrifugal device that detects uncontrolled overspeed in either ascent or descent, cutting safety electrical power and mechanically tripping the safety gear.",
    functionFa: "حسگر مکانیکی گریز از مرکز که در صورت عبور سرعت مجاز از حد مجاز در حرکت به بالا یا پایین، مدار ایمنی را قطع و پاراشوت را درگیر می‌کند.",
    specsEn: "Tripping velocity: 115% of rated speed, Response latency: <80 ms, Steel rope diameter: 6.5 mm.",
    specsFa: "سرعت تحریک: ۱۱۵٪ سرعت نامی، زمان پاسخ کمتر از ۸۰ میلی‌ثانیه، قطر سیم گاورنر: ۶.۵ میلی‌متر.",
    normReference: "EN 81-20 § 5.6.2",
    coords: { x: 26, y: 18 },
  },
  {
    id: "suspension-ropes",
    nameEn: "High-Tensile Steel Suspension Ropes",
    nameFa: "سیم‌بکسل‌های فولادی پرمقاومت با الیاف فشرده",
    category: "mechanical",
    functionEn: "Transfers traction tractive force between machine sheave, elevator car sling, and counterweight system.",
    functionFa: "انتقال نیروی کششی اصطکاکی از فلکه موتور به یوک کابین و قاب وزنه‌تعادل.",
    specsEn: "Minimum safety factor: 12:1, Grade 1770/1960 N/mm², 8-strand compacted construction.",
    specsFa: "ضریب اطمینان بیش از ۱۲ برابر بار اسمی، تنسایل ۱۷۷۰/۱۹۶۰ نیوتن بر میلی‌متر مربع، ساختار فشرده ۸ رشته‌ای.",
    normReference: "EN 81-20 § 5.5 / ISO 4344",
    coords: { x: 44, y: 32 },
  },
  {
    id: "cabin",
    nameEn: "Structural Elevator Car & Sling",
    nameFa: "یوک و سازه صلب کابین آسانسور",
    category: "cabin",
    functionEn: "Isolated passenger compartment riding on elastomer isolation pads with active roller guide shoes.",
    functionFa: "اتاقک حمل مسافر ایزوله شده با ارتعاش‌گیرهای الاستومری و کفشک‌های غلتکی هیدرودینامیک.",
    specsEn: "Fire resistance: EN 81-58 Class E120, Structural frame: S355 steel, Acoustic rating: <42 dBA inside cab.",
    specsFa: "مقاومت در برابر حریق EN 81-58 کلاس E120، سازه فولاد ساختمانی S355، صدای محیطی زیر ۴۲ دسی‌بل.",
    normReference: "EN 81-20 § 5.4",
    coords: { x: 38, y: 55 },
  },
  {
    id: "counterweight",
    nameEn: "Balanced Counterweight Frame",
    nameFa: "قاب وزنه‌تعادل با بلوک‌های چدنی/کامپوزیت",
    category: "mechanical",
    functionEn: "Offsets car dead-weight plus 45%–50% of rated live passenger load to minimize motor motor torque demands.",
    functionFa: "تراز کردن وزن مرده کابین به اضافه ۴۵ تا ۵۰ درصد بار نامی مسافران جهت کاهش شدید مصرف انرژی موتور.",
    specsEn: "Fill material: high-density cast iron or engineered hematite blocks, structural steel guiding frame.",
    specsFa: "پرکننده: بلوک‌های چدنی دانسیته بالا یا هماتیت مهندسی‌شده، قاب مهار فولادی مقاوم به زلزله.",
    normReference: "EN 81-20 § 5.4.11",
    coords: { x: 68, y: 50 },
  },
  {
    id: "safety-gear",
    nameEn: "Progressive Instantaneous Safety Gear (Parachute)",
    nameFa: "ترمز ایمنی پاراشوت تدریجی (Progressive)",
    category: "safety",
    functionEn: "Mechanical wedge brakes under car sling that grip the machined steel guide rails with controlled deceleration in freefall emergency.",
    functionFa: "فک‌های گُوه‌ای زیر یوک کابین که در حالت اضطراری ریل‌های هادی را گاز گرفته و با شتاب کاهنده ایمن کابین را متوقف می‌سازند.",
    specsEn: "Deceleration rate: 0.2g to 1.0g strictly maintained, Hardened alloy gripping jaws (58 HRC).",
    specsFa: "شتاب توقف کنترل‌شده بین ۰.۲g تا ۱.۰g، فک‌های فورج شده آلیاژی با سختی ۵۸ راکول.",
    normReference: "EN 81-20 § 5.6.3 / EN 81-50 § 5.3",
    coords: { x: 38, y: 68 },
  },
  {
    id: "guide-rails",
    nameEn: "Machined Solid T-Profile Guide Rails",
    nameFa: "ریل‌های هادی T شکل فولادی صیقلی ماشین‌کاری شده",
    category: "hoistway",
    functionEn: "Provides precision vertical alignment, guidance, and reactionary braking surface for both car and counterweight.",
    functionFa: "تامین مسیر حرکتی کاملاً صلب و مستقیم عمودی و سطح تماس ترمز اضطراری برای کابین و وزنه‌تعادل.",
    specsEn: "Cold-drawn & planed T89/T127/T140 profiles, straightness tolerance <0.5 mm per 5 m joint.",
    specsFa: "پروفیل‌های ماشین‌کاری T89/T127/T140، رواداری انحراف خطی کمتر از ۰.۵ میلی‌متر در هر ۵ متر.",
    normReference: "ISO 7465 / EN 81-20 § 5.7",
    coords: { x: 28, y: 72 },
  },
  {
    id: "pit-buffers",
    nameEn: "Hydraulic Oil Buffers with Stroke Switches",
    nameFa: "ضربه‌گیرهای هیدرولیکی کف چاهک با سوئیچ کورس",
    category: "safety",
    functionEn: "Absorbs residual kinetic energy in extreme hoistway overrun conditions at the lowest landing level.",
    functionFa: "جذب انرژی جنبشی نهایی در صورت عبور پیش‌بینی‌نشده کابین یا وزنه‌تعادل از تراز پایینی چاهک.",
    specsEn: "Calculated for 115% rated car velocity, stroke up to 850 mm, spring or gas return mechanism.",
    specsFa: "محاسبه‌شده برای ۱۱۵٪ سرعت نامی، کورس تا ۸۵۰ میلی‌متر، مکانیسم بازگشت فنری یا نیتروژن گازی.",
    normReference: "EN 81-20 § 5.8 / EN 81-50 § 5.5",
    coords: { x: 42, y: 92 },
  },
];

export interface EscalatorComponent {
  id: string;
  nameEn: string;
  nameFa: string;
  functionEn: string;
  functionFa: string;
  safetyNorm: string;
  highlight: string;
}

export const ESCALATOR_COMPONENTS: EscalatorComponent[] = [
  {
    id: "truss",
    nameEn: "Rigid Structural Steel Truss",
    nameFa: "خرپای صلب سازه‌ای فولادی",
    functionEn: "Engineered box-girder truss supporting all functional mechanics, drive units, step tracks, and live passenger loads with deflection strictly limited to 1/750 of span.",
    functionFa: "سازه مشبک فولادی باربر که وزن موتور، چرخ‌دنده‌ها، استپ‌ها و مسافران را با مهار خیز حداکثر ۱ به ۷۵۰ دهانه تحمل می‌کند.",
    safetyNorm: "EN 115-1 § 5.2",
    highlight: "Galvanized hollow structural sections with acoustic damping pads",
  },
  {
    id: "drive-system",
    nameEn: "Integrated Traction Drive & Emergency Brake",
    nameFa: "واحد محرک الکترومکانیکی و ترمز کمکی",
    functionEn: "High-efficiency planetary or helical gearbox directly coupled to drive shaft with auxiliary electro-hydraulic safety brake.",
    functionFa: "گیربکس خورشیدی یا هلیکال با راندمان بالا کوپل‌شده مستقیم به شفت اصلی همراه با ترمز کمکی الکتروهیدرولیک.",
    safetyNorm: "EN 115-1 § 5.4",
    highlight: "Variable frequency drive (VFD) with regenerative grid return",
  },
  {
    id: "steps",
    nameEn: "Die-Cast Anodized Aluminum Steps",
    nameFa: "پله‌های یکپارچه دایکست آلومینیومی آجدار",
    functionEn: "Single-piece high-pressure die-cast steps with yellow boundary demarcation inserts and precision roller bearings.",
    functionFa: "پله‌های ریخته‌گری تحت فشار با شیارهای آج ضدلغزش و خطوط زرد هشداردهنده پیرامونی فسفری.",
    safetyNorm: "EN 115-1 § 5.3",
    highlight: "Fatigue tested to over 5,000,000 load cycles at 3,000 N",
  },
  {
    id: "comb-plate",
    nameEn: "Comb Plate & Safety Interlock Switches",
    nameFa: "صفحه شانه (Comb Plate) و میکروپروسسور ایمنی",
    functionEn: "Interlocking teeth that mesh with step tread grooves to prevent shoe laces or foreign objects from entering the return mechanism. Triggers immediate stop upon 2 mm deviation.",
    functionFa: "دندانه‌های شانه‌ای درگیر در شیار پله‌ها جهت ممانعت از گیر کردن بند کفش و اجسام خارجی، قطع‌کننده موتور در انحراف بیش از ۲ میلی‌متر.",
    safetyNorm: "EN 115-1 § 5.2.3",
    highlight: "High-contrast yellow comb segments with replaceable modular teeth",
  },
  {
    id: "handrail",
    nameEn: "Synchronized Handrail Drive & Disinfection",
    nameFa: "سیستم محرک هندریل همگام با استریل‌کننده UV",
    functionEn: "Dual friction drive wheel synchronized with step speed within +/- 1%, with optional hidden continuous UV-C germicidal sterilization chamber.",
    functionFa: "چرخ‌های محرک اصطکاکی با همگام‌سازی سرعت هندریل با پله‌ها تا خطای کمتر از ۱٪ و محفظه پرتودهی ضدعفونی‌کننده فرابنفش UV-C.",
    safetyNorm: "EN 115-1 § 5.6",
    highlight: "Multi-ply rubber composite with internal steel cord tension members",
  },
  {
    id: "landing-plates",
    nameEn: "Etched Stainless Steel Landing Plates",
    nameFa: "صفحات پاخور و ورودی استنلس استیل آجدار",
    functionEn: "Heavy-gauge removable floor covers providing durable slip-resistant passenger ingress and quick technician access to machinery spaces.",
    functionFa: "صفحات فولادی ضدزنگ مقاوم با شیارهای لیزری ضدلغزش و دریچه بازشو با قفل ایمنی جهت بازرسی تکنسین به موتورخانه.",
    safetyNorm: "EN 115-1 § 5.2.4",
    highlight: "Slip resistance rating R11 / DIN 51130 with laser-etched chevron pattern",
  },
];
