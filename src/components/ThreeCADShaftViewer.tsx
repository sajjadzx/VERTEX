"use client";

import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import * as THREE from "three";
import { Locale } from "@/lib/dictionary";
import { 
  Box, 
  Layers, 
  RotateCcw, 
  Eye, 
  Sliders, 
  Download, 
  Check, 
  Maximize2, 
  Minimize2, 
  Cpu, 
  ShieldCheck, 
  Ruler,
  FileCode,
  ArrowUpDown,
  Play,
  Pause,
  Zap,
  Activity,
  Compass,
  Sparkles,
  Info,
  ChevronRight,
  Gauge
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SuspensionType = 
  | "1_1_direct"        // ۱:۱ مستقیم موتورخانه / بالا
  | "2_1_underslung"    // ۲:۱ زیر کابین MRL
  | "2_1_overslung"     // ۲:۱ روی کابین یوک فوقانی
  | "4_1_heavy_duty"    // ۴:۱ باربری سنگین صنعتی و خودروبر
  | "cantilever_2_1"    // ۲:۱ کوله‌ای / کنسولی یک‌طرفه
  | "hydraulic_2_1";    // ۲:۱ هیدرولیک غیرمستقیم با جک بغل

interface SuspensionSpec {
  id: SuspensionType;
  nameFa: string;
  nameEn: string;
  shortDescFa: string;
  shortDescEn: string;
  ratio: string;
  ratioVal: number;
  ropeSpeedFactor: number;
  torqueFactor: string;
  sheaveCount: number;
  sheaveLocationFa: string;
  sheaveLocationEn: string;
  typicalAppFa: string;
  typicalAppEn: string;
  advantagesFa: string[];
  advantagesEn: string[];
  color: string;
}

const SUSPENSION_CONFIGS: Record<SuspensionType, SuspensionSpec> = {
  "1_1_direct": {
    id: "1_1_direct",
    nameFa: "سیستم تعلیق ۱:۱ مستقیم (Direct Traction)",
    nameEn: "1:1 Direct Acting Traction",
    shortDescFa: "کشش مستقیم سیم‌بکسل‌ها از تیر یوک کابین به فلکه موتور و قاب وزنه بدون فلکه هرزگرد متحرک.",
    shortDescEn: "Direct suspension where ropes terminate directly on car crosshead and counterweight.",
    ratio: "1:1",
    ratioVal: 1,
    ropeSpeedFactor: 1.0,
    torqueFactor: "۱۰۰٪ گشتاور نامی (حداکثر نیاز به گشتاور موتور)",
    sheaveCount: 1,
    sheaveLocationFa: "تنها فلکه کشش موتور و یک فلکه انحراف (Diverter) در سر چاه",
    sheaveLocationEn: "Overhead traction sheave and optional diverter sheave only",
    typicalAppFa: "آسانسورهای پرسرعت (بیش از ۲.۵ متر بر ثانیه)، برج‌های بلندمرتبه و پروژه‌های موتورخانه‌دار",
    typicalAppEn: "High-speed elevators (>2.5 m/s), high-rise towers, geared/gearless with machine room",
    advantagesFa: [
      "حداقل تعداد خمش سیم‌بکسل و افزایش چشمگیر طول عمر کابل‌ها",
      "بالاترین راندمان مکانیکی انتقال قدرت (بیش از ۹۲٪)",
      "سرعت سیم‌بکسل دقیقاً برابر با سرعت حرکت کابین (V_rope = V_car)",
      "ساختار ساده‌تر بدون نیاز به هوزینگ فلکه روی کابین"
    ],
    advantagesEn: [
      "Minimal rope bends for maximum wire rope operating lifespan",
      "Highest mechanical transmission efficiency (>92%)",
      "Rope speed equals car speed directly (V_rope = V_car)",
      "Simpler car sling without pulley cages"
    ],
    color: "#0284c7"
  },
  "2_1_underslung": {
    id: "2_1_underslung",
    nameFa: "سیستم تعلیق ۲:۱ زیر کابین (Underslung MRL)",
    nameEn: "2:1 Underslung Pulley System (MRL)",
    shortDescFa: "عبور سیم‌بکسل‌ها از زیر کفی کابین با دو فلکه هرزگرد؛ استانداردی بی‌نظیر برای آسانسورهای بدون موتورخانه.",
    shortDescEn: "Ropes pass underneath the car platform around two pulleys; the industry standard for MRL lifts.",
    ratio: "2:1",
    ratioVal: 2,
    ropeSpeedFactor: 2.0,
    torqueFactor: "۵۰٪ گشتاور نامی (کاهش ۵۰ درصدی سایز و وزن موتور)",
    sheaveCount: 3,
    sheaveLocationFa: "۲ عدد فلکه هرزگرد زیر کفی کابین + ۱ عدد فلکه روی قاب وزنه تعادل",
    sheaveLocationEn: "2 diverter sheaves beneath car floor + 1 sheave atop counterweight",
    typicalAppFa: "آسانسورهای مدرن MRL (بدون موتورخانه)، پروژه‌های با ارتفاع اورهد محدود و مسکونی/اداری استاندارد",
    typicalAppEn: "Modern MRL elevators, reduced overhead heights, standard residential & commercial buildings",
    advantagesFa: [
      "کاهش ۵۰٪ گشتاور مورد نیاز شفت و امکان استفاده از موتورهای بسیار کوچک‌تر و سبک‌تر",
      "امکان نصب موتور داخل چاه بدون نیاز به احداث اتاقک موتورخانه بر روی بام",
      "کاهش چشمگیر ارتفاع بالاسری چاهک (Low Headroom Requirement)",
      "توزیع متوازن بار بر روی شاسی زیرین کفی و سواری نرم‌تر"
    ],
    advantagesEn: [
      "Halves required motor shaft torque, enabling compact and energy-saving PMSM machines",
      "Eliminates penthouse machine room; motor mounts directly on guide rails",
      "Significantly lower headroom overhead dimension requirement",
      "Balanced platform load distribution and vibration damping"
    ],
    color: "#059669"
  },
  "2_1_overslung": {
    id: "2_1_overslung",
    nameFa: "سیستم تعلیق ۲:۱ روی کابین (Overslung Crosshead)",
    nameEn: "2:1 Overslung Top Sheaves System",
    shortDescFa: "قرارگیری دو فلکه هرزگرد تعلیق بر روی تیر فوقانی یوک کابین (Crosshead) با نسبت تبدیل ۲:۱.",
    shortDescEn: "Two suspension pulleys mounted on the upper crosshead of the car sling with 2:1 mechanical ratio.",
    ratio: "2:1",
    ratioVal: 2,
    ropeSpeedFactor: 2.0,
    torqueFactor: "۵۰٪ گشتاور نامی (کاهش ۵۰ درصدی فشار روی گیربکس)",
    sheaveCount: 3,
    sheaveLocationFa: "۲ عدد فلکه هرزگرد روی تیر بالایی یوک کابین + ۱ عدد فلکه روی قاب وزنه",
    sheaveLocationEn: "2 sheaves on top car crosshead + 1 sheave on counterweight frame",
    typicalAppFa: "آسانسورهای باری-مسافری با ابعاد بزرگ، ظرفیت‌های ۸۰۰ تا ۱۶۰۰ کیلوگرم با موتورخانه یا بدون موتورخانه",
    typicalAppEn: "Passenger-freight large capacity lifts (800-1600 kg) with or without machine room",
    advantagesFa: [
      "دسترسی بسیار آسان به فلکه‌ها جهت سرویس، روغن‌کاری و بازرسی ایمنی از روی سقف کابین",
      "محافظت کامل فلکه‌ها و سیم‌بکسل‌ها از غبار و رطوبت کف چاهک",
      "نصف شدن گشتاور موتور نسبت به ۱:۱ مستقیم",
      "پایداری دینامیکی عالی در چاه‌های با عمق متوسط و زیاد"
    ],
    advantagesEn: [
      "Easy maintenance, inspection, and sheave lubrication from car top",
      "Protects pulleys and cables from pit dust, humidity, or water ingress",
      "50% lower required motor torque compared to direct 1:1",
      "Excellent dynamic stability for medium to high travel heights"
    ],
    color: "#d97706"
  },
  "4_1_heavy_duty": {
    id: "4_1_heavy_duty",
    nameFa: "سیستم تعلیق ۴:۱ باربری سنگین (Heavy Freight 4:1)",
    nameEn: "4:1 Heavy Freight & Vehicle Suspension",
    shortDescFa: "سیستم تعلیق چهار به یک با ۴ رشته سیم‌بکسل برای جابجایی بارهای عظیم، لیفتراک و آسانسورهای خودروبر.",
    shortDescEn: "4:1 mechanical advantage roping for extreme payloads, vehicle lifts, and heavy industrial cargo.",
    ratio: "4:1",
    ratioVal: 4,
    ropeSpeedFactor: 4.0,
    torqueFactor: "۲۵٪ گشتاور نامی (کاهش ۷۵ درصدی گشتاور لازم)",
    sheaveCount: 5,
    sheaveLocationFa: "۲ فلکه دوبل زیر یا روی کابین + ۲ فلکه دوبل روی وزنه + فلکه‌های انحراف سر چاه",
    sheaveLocationEn: "Dual sheaves on car, dual sheaves on CWT, plus overhead deflectors",
    typicalAppFa: "آسانسورهای باربری صنعتی سنگین (۲ تا ۱۰ تن)، آسانسورهای خودروبر پارکینگ‌ها و انبارها",
    typicalAppEn: "Heavy industrial cargo (2000 to 10,000 kg), car lifts, warehouse heavy machinery",
    advantagesFa: [
      "امکان جابجایی بارهای بسیار سنگین با موتورهای الکتریکی استاندارد",
      "کاهش چشمگیر قطر سیم‌بکسل و کاهش قطر فلکه‌های کشش به نسبت ظرفیت",
      "فوق‌العاده ایمن با ضریب اطمینان تعلیق چندگانه مطابق استانداردهای سنگین",
      "توزیع تنش یکنواخت در سازه چاه و یوک تقویتی"
    ],
    advantagesEn: [
      "Lifts massive industrial payloads using standard-sized electric machines",
      "Allows smaller rope diameters and manageable sheave diameters",
      "High multi-fall suspension safety redundancy per industrial codes",
      "Balanced structural stress across heavy-duty steel sling"
    ],
    color: "#dc2626"
  },
  "cantilever_2_1": {
    id: "cantilever_2_1",
    nameFa: "سیستم تعلیق کوله‌ای ۲:۱ (Rucksack Cantilever)",
    nameEn: "2:1 Cantilever / Rucksack System",
    shortDescFa: "هدایت کابین از یک سمت چاهک به سبک کوله‌پشتی؛ مناسب برای درب‌های مجاور، شیشه‌ای و چاه‌های خاص.",
    shortDescEn: "Single-side mast guided elevator car; ideal for 3-side glass, panoramic cars, or adjacent entrances.",
    ratio: "2:1",
    ratioVal: 2,
    ropeSpeedFactor: 2.0,
    torqueFactor: "۵۰٪ گشتاور نامی (طراحی شده برای فریم L-Shape)",
    sheaveCount: 3,
    sheaveLocationFa: "فلکه‌ها روی دکل کالسکه و قاب وزنه در دیواره کناری یا پشتی",
    sheaveLocationEn: "Sheaves on cantilever upright mast and side-mounted counterweight",
    typicalAppFa: "آسانسورهای پانورامیک ۳ طرف شیشه، هوم‌لیفت‌های خانگی، چاه‌های با ورودی مجاور (Adjacent Doors)",
    typicalAppEn: "Panoramic glass lifts, luxury home lifts, shafts requiring 2 adjacent or 3 entrance doors",
    advantagesFa: [
      "آزادسازی ۳ وجه کابین برای شیشه‌ای شدن کامل یا تعبیه درب در جهات مختلف",
      "اشغال حداقل فضا در پلان معماری ساختمان‌های لوکس",
      "حذف ریل‌های جانبی مزاحم در دید مسافران",
      "امکان پیاده‌سازی هم در سیستم‌های کششی گیرلس و هم هیدرولیک"
    ],
    advantagesEn: [
      "Frees up three cabin sides for all-glass walls or multiple entrance doors",
      "Minimal shaft footprint in high-end luxury residences",
      "Clears visual obstructions for panoramic passenger views",
      "Compatible with both gearless traction and hydraulic rams"
    ],
    color: "#7c3aed"
  },
  "hydraulic_2_1": {
    id: "hydraulic_2_1",
    nameFa: "سیستم تعلیق هیدرولیک غیرمستقیم ۲:۱ (Indirect Hydraulic)",
    nameEn: "2:1 Indirect Hydraulic (Side Ram + Pulley)",
    shortDescFa: "حرکت با جک هیدرولیک کناری، پیستون متحرک و فلکه پولی؛ دو برابر شدن سرعت و کورس حرکت کابین.",
    shortDescEn: "Hydraulic ram with sheave atop cylinder piston; doubles cylinder stroke and cabin travel velocity.",
    ratio: "2:1",
    ratioVal: 2,
    ropeSpeedFactor: 0.5, // Piston moves at 0.5 car speed
    torqueFactor: "فشار هیدرولیک متناسب با سطح مقطع پیستون (۳۵ تا ۵۵ بار)",
    sheaveCount: 1,
    sheaveLocationFa: "۱ عدد فلکه پولی هیدرولیک متصل به سر پیستون متحرک جک در چاهک",
    sheaveLocationEn: "1 hydraulic pulley mounted on top of extending cylinder ram",
    typicalAppFa: "ساختمان‌های تا ۶ طبقه، ظرفیت‌های سنگین باربری، بدون نیاز به موتورخانه بالا و کم‌صدا",
    typicalAppEn: "Low to medium rise (up to 6 floors), heavy freight, no overhead penthouse, silent travel",
    advantagesFa: [
      "عدم نیاز به وزنه تعادل و افزایش فضای مفید کابین در چاهک",
      "انتقال کلیه بارهای استاتیکی و دینامیکی مستقیماً به کف فونداسیون ساختمان",
      "امکان پایین آمدن اضطراری بدون برق با باز شدن شیر تخلیه دستی",
      "کورس پیستون نصف ارتفاع کل چاهک است (کاهش ۵۰٪ طول جک)"
    ],
    advantagesEn: [
      "Eliminates counterweight, maximizing usable cabin floor space in small shafts",
      "Transfers all structural loads directly to the foundation floor",
      "Safe gravity descent during complete power outages via manual relief valve",
      "Cylinder stroke is half total travel height (50% shorter cylinder)"
    ],
    color: "#0891b2"
  }
};

interface ThreeCADShaftViewerProps {
  locale: Locale;
}

export function ThreeCADShaftViewer({ locale }: ThreeCADShaftViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isFa = locale === "fa";

  // Core Configuration States
  const [capacity, setCapacity] = useState<number>(1000); // kg
  const [speed, setSpeed] = useState<number>(2.0); // m/s
  const [suspension, setSuspension] = useState<SuspensionType>("2_1_underslung");
  const [viewMode, setViewMode] = useState<"3d" | "front" | "side" | "top" | "sheaves">("3d");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [wallMode, setWallMode] = useState<"cutaway" | "transparent" | "wireframe">("cutaway");

  // Display toggles
  const [showRopes, setShowRopes] = useState<boolean>(true);
  const [showRails, setShowRails] = useState<boolean>(true);
  const [showTravelingCable, setShowTravelingCable] = useState<boolean>(true);
  const [showRefuge, setShowRefuge] = useState<boolean>(false);
  const [showDoors, setShowDoors] = useState<boolean>(true);

  // Manual Car Height (0 = pit, 0.5 = mid, 1 = overhead)
  const [manualPos, setManualPos] = useState<number>(0.5);
  const carPosNormalizedRef = useRef<number>(0.5);
  const isAutoMovingRef = useRef<boolean>(true);

  // Telemetry badge text (updated throttled to avoid 60fps React rerenders)
  const [telemetryElevation, setTelemetryElevation] = useState<number>(50);
  const [copiedDxf, setCopiedDxf] = useState<boolean>(false);

  // References for Three.js engine
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  
  // Object hierarchy refs
  const carGroupRef = useRef<THREE.Group | null>(null);
  const cwtGroupRef = useRef<THREE.Group | null>(null);
  const machineGroupRef = useRef<THREE.Group | null>(null);
  const dynamicRopesGroupRef = useRef<THREE.Group | null>(null);
  const travelingCableGroupRef = useRef<THREE.Group | null>(null);
  const refugeGroupRef = useRef<THREE.Group | null>(null);
  const wallGroupRef = useRef<THREE.Group | null>(null);
  const railGroupRef = useRef<THREE.Group | null>(null);
  const hydPistonRef = useRef<THREE.Mesh | null>(null);

  // Orbit controls state
  const isDraggingRef = useRef<boolean>(false);
  const isPanningRef = useRef<boolean>(false);
  const prevMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraOrbitRef = useRef<{ theta: number; phi: number; radius: number; targetY: number }>({
    theta: 0.85,
    phi: 0.55,
    radius: 30,
    targetY: 0
  });

  // Shaft Dimensions
  const shaftData = useMemo(() => {
    return {
      450: { sw: 1600, sd: 1600, cw: 1000, cd: 1250, op: 800, ch: 2200, oh: 3800, pd: 1400 },
      630: { sw: 1800, sd: 1800, cw: 1100, cd: 1400, op: 900, ch: 2300, oh: 4000, pd: 1500 },
      800: { sw: 1950, sd: 1950, cw: 1350, cd: 1400, op: 900, ch: 2400, oh: 4200, pd: 1550 },
      1000: { sw: 2100, sd: 2100, cw: 1400, cd: 1600, op: 1000, ch: 2400, oh: 4400, pd: 1650 },
      1275: { sw: 2300, sd: 2300, cw: 1600, cd: 1800, op: 1100, ch: 2500, oh: 4600, pd: 1800 },
      1600: { sw: 2500, sd: 2700, cw: 1400, cd: 2400, op: 1300, ch: 2500, oh: 4800, pd: 2000 },
      2000: { sw: 2800, sd: 3000, cw: 1800, cd: 2500, op: 1500, ch: 2500, oh: 5000, pd: 2200 },
    }[capacity as 450 | 630 | 800 | 1000 | 1275 | 1600 | 2000] || {
      sw: 2100, sd: 2100, cw: 1400, cd: 1600, op: 1000, ch: 2400, oh: 4400, pd: 1650
    };
  }, [capacity]);

  const activeSpec = SUSPENSION_CONFIGS[suspension];

  // Helper to re-position camera
  const updateCameraPosition = useCallback(() => {
    if (!cameraRef.current) return;
    const { theta, phi, radius, targetY } = cameraOrbitRef.current;
    const x = radius * Math.sin(phi) * Math.sin(theta);
    const y = targetY + radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(0, targetY, 0);
  }, []);

  // Update preset views
  useEffect(() => {
    if (viewMode === "3d") {
      cameraOrbitRef.current = { theta: 0.85, phi: 0.55, radius: 30, targetY: 0 };
    } else if (viewMode === "front") {
      cameraOrbitRef.current = { theta: 0, phi: Math.PI / 2, radius: 28, targetY: 0 };
    } else if (viewMode === "side") {
      cameraOrbitRef.current = { theta: Math.PI / 2, phi: Math.PI / 2, radius: 28, targetY: 0 };
    } else if (viewMode === "top") {
      cameraOrbitRef.current = { theta: 0, phi: 0.05, radius: 26, targetY: 0 };
    } else if (viewMode === "sheaves") {
      // Zoom close to machine & upper pulleys
      cameraOrbitRef.current = { theta: 0.5, phi: 0.7, radius: 14, targetY: 8 };
    }
    updateCameraPosition();
  }, [viewMode, updateCameraPosition]);

  // Sync isPlaying with ref
  useEffect(() => {
    isAutoMovingRef.current = isPlaying;
  }, [isPlaying]);

  // --------------------------------------------------------------------------
  // Main Three.js Scene Construction
  // --------------------------------------------------------------------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Environment
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf1f5f9); // Clean architectural slate-100

    // 2. Camera & Viewport
    const width = container.clientWidth;
    const height = container.clientHeight || 560;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. Renderer with antialiasing and soft shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
    sunLight.position.set(20, 30, 25);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 5;
    sunLight.shadow.camera.far = 70;
    sunLight.shadow.camera.left = -18;
    sunLight.shadow.camera.right = 18;
    sunLight.shadow.camera.top = 22;
    sunLight.shadow.camera.bottom = -22;
    scene.add(sunLight);

    // Blue architectural accent rim light
    const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    blueRimLight.position.set(-20, 10, -20);
    scene.add(blueRimLight);

    // 5. Shaft Geometry Coordinates
    const shaftHeight = 24; // full travel + OH + pit in 3D scale units
    const sw3D = (shaftData.sw / 1000) * 3.4;
    const sd3D = (shaftData.sd / 1000) * 3.4;
    const halfW = sw3D / 2;
    const halfD = sd3D / 2;
    const pitFloorY = -shaftHeight / 2;
    const overheadCeilingY = shaftHeight / 2;

    // Ground Grid
    const grid = new THREE.GridHelper(30, 30, 0x0284c7, 0xcbd5e1);
    grid.position.y = pitFloorY - 0.05;
    scene.add(grid);

    // A) Shaft Walls & Structural Columns
    const wallGroup = new THREE.Group();
    wallGroupRef.current = wallGroup;

    // Concrete columns at 4 corners
    const colMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7, metalness: 0.1 });
    const colGeo = new THREE.BoxGeometry(0.5, shaftHeight, 0.5);
    [
      [-halfW, 0, -halfD],
      [halfW, 0, -halfD],
      [-halfW, 0, halfD],
      [halfW, 0, halfD]
    ].forEach(([cx, cy, cz]) => {
      const col = new THREE.Mesh(colGeo, colMat);
      col.position.set(cx, cy, cz);
      col.castShadow = true;
      col.receiveShadow = true;
      wallGroup.add(col);
    });

    // Horizontal Steel Ring Beams (کلاف‌کشی هر ۳ واحد)
    const beamMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6, roughness: 0.3 });
    for (let by = pitFloorY + 2.5; by < overheadCeilingY; by += 3.5) {
      // Rear beam
      const bRear = new THREE.Mesh(new THREE.BoxGeometry(sw3D, 0.3, 0.3), beamMat);
      bRear.position.set(0, by, -halfD);
      wallGroup.add(bRear);

      // Left beam
      const bLeft = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, sd3D), beamMat);
      bLeft.position.set(-halfW, by, 0);
      wallGroup.add(bLeft);

      // Right beam
      const bRight = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, sd3D), beamMat);
      bRight.position.set(halfW, by, 0);
      wallGroup.add(bRight);
    }

    // Rear Wall panel (semi-transparent architectural glass/concrete)
    const wallPanelMat = new THREE.MeshStandardMaterial({ 
      color: 0xe2e8f0, 
      roughness: 0.4, 
      transparent: true, 
      opacity: wallMode === "wireframe" ? 0.15 : wallMode === "transparent" ? 0.35 : 0.85 
    });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(sw3D, shaftHeight, 0.1), wallPanelMat);
    backWall.position.set(0, 0, -halfD);
    wallGroup.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, shaftHeight, sd3D), wallPanelMat);
    leftWall.position.set(-halfW, 0, 0);
    wallGroup.add(leftWall);

    scene.add(wallGroup);

    // B) Guide Rails (ISO 7465 T-Section Style)
    const railGroup = new THREE.Group();
    railGroupRef.current = railGroup;

    const carRailMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.85, roughness: 0.2 });
    const cwtRailMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.25 });

    // Left and Right Car Rails
    const carRailGeo = new THREE.BoxGeometry(0.18, shaftHeight - 0.5, 0.2);
    const railL = new THREE.Mesh(carRailGeo, carRailMat);
    railL.position.set(-halfW + 0.55, 0, 0);
    const railR = new THREE.Mesh(carRailGeo, carRailMat);
    railR.position.set(halfW - 0.55, 0, 0);
    railGroup.add(railL, railR);

    // Counterweight Rails (rear or side depending on suspension)
    const cwtRailGeo = new THREE.BoxGeometry(0.12, shaftHeight - 0.5, 0.12);
    const cwtRailPos = suspension === "cantilever_2_1" 
      ? [[-halfW + 0.55, 0, -halfD * 0.55], [-halfW + 0.55, 0, halfD * 0.55]]
      : [[-1.2, 0, -halfD + 0.65], [1.2, 0, -halfD + 0.65]];

    cwtRailPos.forEach(([rx, ry, rz]) => {
      const cRail = new THREE.Mesh(cwtRailGeo, cwtRailMat);
      cRail.position.set(rx, ry, rz);
      railGroup.add(cRail);
    });

    scene.add(railGroup);

    // C) Landing Doors at 3 levels
    if (showDoors) {
      const doorFrameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6 });
      const doorLeafMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, metalness: 0.9, roughness: 0.15 });
      const doorLevels = [pitFloorY + 2.8, 0, overheadCeilingY - 4.5];

      doorLevels.forEach((dy) => {
        const dGroup = new THREE.Group();
        dGroup.position.set(0, dy, halfD);

        // Header and frame jambs
        const jambL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 3.2, 0.2), doorFrameMat);
        jambL.position.set(-1.45, 0, 0);
        const jambR = new THREE.Mesh(new THREE.BoxGeometry(0.15, 3.2, 0.2), doorFrameMat);
        jambR.position.set(1.45, 0, 0);
        const header = new THREE.Mesh(new THREE.BoxGeometry(3.05, 0.25, 0.2), doorFrameMat);
        header.position.set(0, 1.6, 0);

        // Door panels
        const leaf1 = new THREE.Mesh(new THREE.BoxGeometry(1.3, 3.0, 0.06), doorLeafMat);
        leaf1.position.set(-0.68, 0, 0);
        const leaf2 = new THREE.Mesh(new THREE.BoxGeometry(1.3, 3.0, 0.06), doorLeafMat);
        leaf2.position.set(0.68, 0, 0);

        dGroup.add(jambL, jambR, header, leaf1, leaf2);
        scene.add(dGroup);
      });
    }

    // D) Pit Buffers (ضربه‌گیرهای هیدرولیک و پلی‌اورتان کف چاهک)
    const bufMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.2 });
    const bufBaseMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.5 });

    // Car Buffers (2 units)
    [-0.9, 0.9].forEach((bx) => {
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.6), bufBaseMat);
      base.position.set(bx, pitFloorY + 0.2, 0);
      const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 1.2, 16), bufMat);
      piston.position.set(bx, pitFloorY + 0.9, 0);
      scene.add(base, piston);
    });

    // CWT Buffer
    const cwtBufBase = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.5), bufBaseMat);
    const cwtBufX = suspension === "cantilever_2_1" ? -halfW + 0.55 : 0;
    const cwtBufZ = suspension === "cantilever_2_1" ? 0 : -halfD + 0.65;
    cwtBufBase.position.set(cwtBufX, pitFloorY + 0.2, cwtBufZ);
    const cwtBufPiston = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.2, 16), bufMat);
    cwtBufPiston.position.set(cwtBufX, pitFloorY + 0.9, cwtBufZ);
    scene.add(cwtBufBase, cwtBufPiston);

    // E) Machine & Drive Head (سر چاهک / موتورخانه)
    const machineGroup = new THREE.Group();
    machineGroupRef.current = machineGroup;

    if (suspension === "hydraulic_2_1") {
      // Hydraulic System: Cylinder in Pit
      const hydGroup = new THREE.Group();
      hydGroup.position.set(-halfW + 0.7, pitFloorY + 4.5, 0);

      // Outer cylinder barrel
      const barrel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 9, 24),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 })
      );
      hydGroup.add(barrel);

      // Moving chrome ram piston
      const ram = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 8, 24),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.98, roughness: 0.05 })
      );
      ram.position.y = 4.0;
      hydPistonRef.current = ram;
      hydGroup.add(ram);

      // Hydraulic Sheave on top of ram
      const hydSheave = new THREE.Mesh(
        new THREE.CylinderGeometry(0.65, 0.65, 0.25, 32),
        new THREE.MeshStandardMaterial({ color: 0x0891b2, metalness: 0.9, roughness: 0.1 })
      );
      hydSheave.rotation.x = Math.PI / 2;
      hydSheave.position.set(0, 8.0, 0);
      hydGroup.add(hydSheave);

      machineGroup.add(hydGroup);
    } else {
      // Traction Machine (موتور سنکرون گیرلس PMSM با شاسی ایزوله)
      machineGroup.position.set(0, overheadCeilingY - 0.8, 0);

      // Heavy steel machine bedplate beams (تیرهای دوبل ناودانی شاسی موتور)
      const bedplate = new THREE.Mesh(
        new THREE.BoxGeometry(sw3D - 0.8, 0.4, 1.6),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.3 })
      );
      machineGroup.add(bedplate);

      // PMSM Synchronous Motor Body
      const motorBody = new THREE.Mesh(
        new THREE.CylinderGeometry(1.0, 1.0, 1.6, 32),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85, roughness: 0.2 })
      );
      motorBody.rotation.z = Math.PI / 2;
      motorBody.position.set(0, 1.1, 0);
      machineGroup.add(motorBody);

      // Disc Brake Calipers (ترمز دیسکی دوبل)
      const brakeGeo = new THREE.BoxGeometry(0.35, 0.8, 0.6);
      const brakeMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.6 });
      const brake1 = new THREE.Mesh(brakeGeo, brakeMat);
      brake1.position.set(-0.9, 1.1, 0.6);
      const brake2 = new THREE.Mesh(brakeGeo, brakeMat);
      brake2.position.set(0.9, 1.1, 0.6);
      machineGroup.add(brake1, brake2);

      // Traction Sheave with cable grooves (فلکه کشش)
      const sheaveMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.1 });
      const tractionSheave = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.35, 32), sheaveMat);
      tractionSheave.rotation.z = Math.PI / 2;
      tractionSheave.position.set(0, 1.1, -0.2);
      machineGroup.add(tractionSheave);

      // Deflector / Diverter Sheave (فلکه انحراف)
      const diverterSheave = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.28, 32), sheaveMat);
      diverterSheave.rotation.z = Math.PI / 2;
      diverterSheave.position.set(0, 0.4, -halfD + 0.65);
      machineGroup.add(diverterSheave);
    }

    scene.add(machineGroup);

    // F) Comprehensive Realistic Elevator Car Assembly (کابین و یوک مهندسی)
    const carGroup = new THREE.Group();
    carGroupRef.current = carGroup;

    const carW = (shaftData.cw / 1000) * 2.8;
    const carD = (shaftData.cd / 1000) * 2.8;
    const carH = (shaftData.ch / 1000) * 2.0;

    // 1. Steel Sling (یوک فولادی کابین)
    const slingMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.75, roughness: 0.25 });
    
    // Top Crosshead Beam (تیر دوبل فوقانی)
    const crosshead = new THREE.Mesh(new THREE.BoxGeometry(carW + 0.4, 0.28, 0.35), slingMat);
    crosshead.position.set(0, carH / 2 + 0.2, 0);
    
    // Bottom Safety Plank (تیر تحتانی کفی با ناودانی دوبل)
    const safetyPlank = new THREE.Mesh(new THREE.BoxGeometry(carW + 0.4, 0.35, 0.35), slingMat);
    safetyPlank.position.set(0, -carH / 2 - 0.2, 0);

    // Left and Right Vertical Upright Stiles (ستون‌های عمودی یوک)
    const stileGeo = new THREE.BoxGeometry(0.2, carH + 0.7, 0.3);
    const stileL = new THREE.Mesh(stileGeo, slingMat);
    stileL.position.set(-carW / 2 - 0.1, 0, 0);
    const stileR = new THREE.Mesh(stileGeo, slingMat);
    stileR.position.set(carW / 2 + 0.1, 0, 0);

    carGroup.add(crosshead, safetyPlank, stileL, stileR);

    // 2. Roller Guide Shoes (۴ مجموعه کفشک رولری ۳ تایی متصل به ریل‌ها)
    const rollerMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6 });
    const rollerMountMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
    
    [
      [-carW / 2 - 0.22, carH / 2 + 0.2, 0],
      [carW / 2 + 0.22, carH / 2 + 0.2, 0],
      [-carW / 2 - 0.22, -carH / 2 - 0.2, 0],
      [carW / 2 + 0.22, -carH / 2 - 0.2, 0],
    ].forEach(([rx, ry, rz]) => {
      const mount = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 0.28), rollerMountMat);
      mount.position.set(rx, ry, rz);
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.08, 16), rollerMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(rx > 0 ? rx + 0.08 : rx - 0.08, ry, rz);
      carGroup.add(mount, wheel);
    });

    // 3. Progressive Safety Gear Wedges (فک‌های پاراشوت تدریجی زیر کفی)
    const safetyBlockMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.7 });
    [-carW / 2 - 0.1, carW / 2 + 0.1].forEach((px) => {
      const pBlock = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.45, 0.3), safetyBlockMat);
      pBlock.position.set(px, -carH / 2 - 0.4, 0);
      carGroup.add(pBlock);
    });

    // 4. Cabin Body Shell (کابین لوکس استنلس استیل با پنجره و آینه)
    const cabinWallMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.85,
      roughness: 0.2,
      envMapIntensity: 1.2
    });
    const cabinGlassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.2,
      roughness: 0.1,
      transparent: true,
      opacity: 0.45
    });

    // Main cabin box
    const cabinShell = new THREE.Mesh(new THREE.BoxGeometry(carW, carH, carD), cabinWallMat);
    cabinShell.castShadow = true;
    cabinShell.receiveShadow = true;
    carGroup.add(cabinShell);

    // Rear Mirror / Panoramic Glass insert
    const rearGlass = new THREE.Mesh(new THREE.BoxGeometry(carW - 0.4, carH - 0.4, 0.02), cabinGlassMat);
    rearGlass.position.set(0, 0, -carD / 2 - 0.01);
    carGroup.add(rearGlass);

    // Cabin Floor (Carrara Marble finish)
    const floorMesh = new THREE.Mesh(
      new THREE.BoxGeometry(carW - 0.1, 0.08, carD - 0.1),
      new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.25 })
    );
    floorMesh.position.set(0, -carH / 2 + 0.05, 0);
    carGroup.add(floorMesh);

    // Interior Warm LED Ceiling Glow
    const interiorLight = new THREE.PointLight(0xfffbeb, 1.8, 4.5);
    interiorLight.position.set(0, carH / 2 - 0.3, 0);
    carGroup.add(interiorLight);

    // Car Roof Inspection Station & Safety Handrail (سکوی سرویس‌کار و کلید استپ)
    const inspBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.35, 0.35),
      new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.6 })
    );
    inspBox.position.set(carW * 0.25, carH / 2 + 0.25, carD * 0.2);
    const stopBtn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.08, 16),
      new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3 })
    );
    stopBtn.position.set(carW * 0.25, carH / 2 + 0.45, carD * 0.2);

    // Yellow Safety Handrail on roof
    const railLineMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.4 });
    const handrail = new THREE.Mesh(
      new THREE.BoxGeometry(carW - 0.4, 0.6, carD - 0.4),
      new THREE.MeshStandardMaterial({ color: 0xeab308, wireframe: true })
    );
    handrail.position.set(0, carH / 2 + 0.45, 0);
    carGroup.add(inspBox, stopBtn, handrail);

    // Automatic Door Operator on Car Top (موتور درب فرماتور 40/10 با تسمه)
    const opBox = new THREE.Mesh(
      new THREE.BoxGeometry(carW * 0.85, 0.25, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 })
    );
    opBox.position.set(0, carH / 2 + 0.2, carD / 2 + 0.1);
    carGroup.add(opBox);

    // 5. Suspension Sheaves on Car (بسته به نوع سیستم تعلیق)
    const sheaveMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.1 });
    
    if (suspension === "2_1_underslung") {
      // 2 Sheaves underneath the car platform
      const uSheave1 = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.2, 32), sheaveMat);
      uSheave1.rotation.z = Math.PI / 2;
      uSheave1.position.set(-carW / 2 + 0.2, -carH / 2 - 0.4, 0);
      const uSheave2 = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.2, 32), sheaveMat);
      uSheave2.rotation.z = Math.PI / 2;
      uSheave2.position.set(carW / 2 - 0.2, -carH / 2 - 0.4, 0);
      carGroup.add(uSheave1, uSheave2);
    } else if (suspension === "2_1_overslung") {
      // 2 Sheaves on top crosshead
      const oSheave1 = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.2, 32), sheaveMat);
      oSheave1.rotation.z = Math.PI / 2;
      oSheave1.position.set(-carW * 0.35, carH / 2 + 0.55, 0);
      const oSheave2 = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.2, 32), sheaveMat);
      oSheave2.rotation.z = Math.PI / 2;
      oSheave2.position.set(carW * 0.35, carH / 2 + 0.55, 0);
      carGroup.add(oSheave1, oSheave2);
    } else if (suspension === "4_1_heavy_duty") {
      // Dual sheaves top and bottom
      [-carW * 0.35, carW * 0.35].forEach((sx) => {
        const dualSheave = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.35, 32), sheaveMat);
        dualSheave.rotation.z = Math.PI / 2;
        dualSheave.position.set(sx, carH / 2 + 0.6, 0);
        carGroup.add(dualSheave);
      });
    }

    scene.add(carGroup);

    // G) Counterweight Assembly (قاب وزنه تعادل با بلوک‌های چدنی)
    const cwtGroup = new THREE.Group();
    cwtGroupRef.current = cwtGroup;

    if (suspension !== "hydraulic_2_1") {
      const cwtW = 2.2;
      const cwtH = 4.2;
      const cwtD = 0.5;

      // Steel welded frame
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.2 });
      const cwtFrame = new THREE.Mesh(new THREE.BoxGeometry(cwtW, cwtH, cwtD), frameMat);
      cwtGroup.add(cwtFrame);

      // Stacked Cast Iron Filler Blocks (وزنه‌های چدنی پرکننده)
      const blockMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.4 });
      for (let cy = -1.6; cy <= 1.6; cy += 0.45) {
        const block = new THREE.Mesh(new THREE.BoxGeometry(cwtW - 0.2, 0.38, cwtD - 0.08), blockMat);
        block.position.set(0, cy, 0);
        cwtGroup.add(block);
      }

      // Counterweight Suspension Sheave (برای ۲:۱ و ۴:۱)
      if (suspension === "2_1_underslung" || suspension === "2_1_overslung" || suspension === "cantilever_2_1") {
        const cwtSheave = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.22, 32), sheaveMat);
        cwtSheave.rotation.x = Math.PI / 2;
        cwtSheave.position.set(0, cwtH / 2 + 0.4, 0);
        cwtGroup.add(cwtSheave);
      } else if (suspension === "4_1_heavy_duty") {
        const cwtDual = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.38, 32), sheaveMat);
        cwtDual.rotation.x = Math.PI / 2;
        cwtDual.position.set(0, cwtH / 2 + 0.45, 0);
        cwtGroup.add(cwtDual);
      }

      // Initial position of Counterweight
      const cwtPosX = suspension === "cantilever_2_1" ? -halfW + 0.55 : 0;
      const cwtPosZ = suspension === "cantilever_2_1" ? 0 : -halfD + 0.65;
      cwtGroup.position.set(cwtPosX, 0, cwtPosZ);
      scene.add(cwtGroup);
    }

    // H) Dynamic Steel Wire Ropes (سیم‌بکسل‌های متحرک و اتصالات سر چاه)
    const ropesGroup = new THREE.Group();
    dynamicRopesGroupRef.current = ropesGroup;
    scene.add(ropesGroup);

    // I) Traveling Electric Cable (کابل فرمان آویزان با انحنای طبیعی U)
    const cableGroup = new THREE.Group();
    travelingCableGroupRef.current = cableGroup;
    scene.add(cableGroup);

    // J) Safety Refuge Spaces (EN 81-20 مکعب‌های جان‌پناه ایمنی)
    const refugeGroup = new THREE.Group();
    refugeGroupRef.current = refugeGroup;
    refugeGroup.visible = showRefuge;

    const refMat = new THREE.MeshBasicMaterial({ 
      color: 0x10b981, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.85 
    });

    // Car Top Refuge (0.5m x 0.7m x 1.0m standing or crouching)
    const refTop = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.4, 0.8), refMat);
    refTop.position.set(-carW * 0.2, carH / 2 + 0.8, 0);
    carGroup.add(refTop);

    // Pit Refuge Space on pit floor
    const refPit = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.2, 1.0), refMat);
    refPit.position.set(halfW - 1.2, pitFloorY + 0.6, halfD - 1.2);
    refugeGroup.add(refPit);

    scene.add(refugeGroup);

    // ------------------------------------------------------------------------
    // Ropes Re-calculation Function
    // ------------------------------------------------------------------------
    const updateRopesAndCables = (carY: number, cwtY: number) => {
      // Clear previous dynamic rope meshes
      while (ropesGroup.children.length > 0) {
        const obj = ropesGroup.children[0];
        ropesGroup.remove(obj);
      }

      if (!showRopes) return;

      const ropeMat = new THREE.MeshStandardMaterial({ 
        color: 0x38bdf8, // High-visibility precision steel cyan
        metalness: 0.95, 
        roughness: 0.1 
      });

      const ropeThickness = 0.04;
      const ropeCount = suspension === "4_1_heavy_duty" ? 6 : 4;
      const ropeSpacing = 0.08;

      // Draw helper: Multi-rope tube between two points
      const drawMultiRope = (p1: THREE.Vector3, p2: THREE.Vector3, axisSpread: "x" | "z" = "x") => {
        const dir = new THREE.Vector3().subVectors(p2, p1);
        const len = dir.length();
        if (len < 0.01) return;

        const cylGeo = new THREE.CylinderGeometry(ropeThickness, ropeThickness, len, 8);
        const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

        for (let r = 0; r < ropeCount; r++) {
          const offset = (r - (ropeCount - 1) / 2) * ropeSpacing;
          const ropeMesh = new THREE.Mesh(cylGeo, ropeMat);
          
          const pos = midPoint.clone();
          if (axisSpread === "x") pos.x += offset;
          else pos.z += offset;
          
          ropeMesh.position.copy(pos);
          ropeMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
          ropesGroup.add(ropeMesh);
        }
      };

      if (suspension === "1_1_direct") {
        // From Car Crosshead -> Up to Traction Sheave -> Over Sheave to CWT Hitch
        const carHitchY = carY + carH / 2 + 0.35;
        const machineSheaveY = overheadCeilingY + 0.3;
        
        drawMultiRope(
          new THREE.Vector3(0, carHitchY, 0),
          new THREE.Vector3(0, machineSheaveY, -0.2),
          "x"
        );
        drawMultiRope(
          new THREE.Vector3(0, machineSheaveY, -halfD + 0.65),
          new THREE.Vector3(0, cwtY + 2.1, -halfD + 0.65),
          "x"
        );
      } else if (suspension === "2_1_underslung") {
        // Fixed Hitch Beam on Top -> Down to Under-car Pulley 1 -> Under Car -> Pulley 2 -> Up to Machine -> Down to CWT Pulley -> Up to Top Hitch
        const hitchTopY = overheadCeilingY - 0.2;
        const pulleyBottomY = carY - carH / 2 - 0.4;
        const machineSheaveY = overheadCeilingY + 0.3;

        // Fall 1: Top Hitch (Left) -> Underslung Sheave 1
        drawMultiRope(
          new THREE.Vector3(-carW / 2 + 0.2, hitchTopY, 0),
          new THREE.Vector3(-carW / 2 + 0.2, pulleyBottomY, 0),
          "z"
        );

        // Fall 2: Under Car Platform (Horizontal rope run)
        drawMultiRope(
          new THREE.Vector3(-carW / 2 + 0.2, pulleyBottomY - 0.2, 0),
          new THREE.Vector3(carW / 2 - 0.2, pulleyBottomY - 0.2, 0),
          "z"
        );

        // Fall 3: Underslung Sheave 2 -> Up to Traction Sheave
        drawMultiRope(
          new THREE.Vector3(carW / 2 - 0.2, pulleyBottomY, 0),
          new THREE.Vector3(0.4, machineSheaveY, -0.2),
          "z"
        );

        // Fall 4: Traction Sheave -> Down around Counterweight Sheave
        drawMultiRope(
          new THREE.Vector3(0, machineSheaveY, -halfD + 0.65),
          new THREE.Vector3(-0.3, cwtY + 2.4, -halfD + 0.65),
          "x"
        );

        // Fall 5: CWT Sheave -> Up to Top Dead-End Hitch
        drawMultiRope(
          new THREE.Vector3(0.3, cwtY + 2.4, -halfD + 0.65),
          new THREE.Vector3(0.3, hitchTopY, -halfD + 0.65),
          "x"
        );
      } else if (suspension === "2_1_overslung") {
        // Hitch Beam Top -> Down around Car Crosshead Sheaves -> Up to Traction Machine -> Down to CWT Sheave -> Up to Hitch
        const hitchTopY = overheadCeilingY - 0.2;
        const carSheaveY = carY + carH / 2 + 0.55;
        const machineSheaveY = overheadCeilingY + 0.3;

        // Fall 1: Dead End Hitch -> Car Sheave 1
        drawMultiRope(
          new THREE.Vector3(-carW * 0.35, hitchTopY, 0),
          new THREE.Vector3(-carW * 0.35, carSheaveY, 0),
          "z"
        );

        // Fall 2: Crosshead span between sheaves
        drawMultiRope(
          new THREE.Vector3(-carW * 0.35, carSheaveY + 0.2, 0),
          new THREE.Vector3(carW * 0.35, carSheaveY + 0.2, 0),
          "z"
        );

        // Fall 3: Car Sheave 2 -> Up to Traction Sheave
        drawMultiRope(
          new THREE.Vector3(carW * 0.35, carSheaveY, 0),
          new THREE.Vector3(0.3, machineSheaveY, -0.2),
          "z"
        );

        // Fall 4: Traction Sheave -> CWT Sheave
        drawMultiRope(
          new THREE.Vector3(0, machineSheaveY, -halfD + 0.65),
          new THREE.Vector3(-0.3, cwtY + 2.4, -halfD + 0.65),
          "x"
        );

        // Fall 5: CWT Sheave -> Dead-End Hitch on Shaft Roof
        drawMultiRope(
          new THREE.Vector3(0.3, cwtY + 2.4, -halfD + 0.65),
          new THREE.Vector3(0.3, hitchTopY, -halfD + 0.65),
          "x"
        );
      } else if (suspension === "4_1_heavy_duty") {
        // 4:1 Heavy Freight Multiple Falls
        const hitchTopY = overheadCeilingY - 0.2;
        const carSheaveY = carY + carH / 2 + 0.6;
        const machineSheaveY = overheadCeilingY + 0.3;

        drawMultiRope(
          new THREE.Vector3(-carW * 0.35, hitchTopY, 0),
          new THREE.Vector3(-carW * 0.35, carSheaveY, 0),
          "z"
        );
        drawMultiRope(
          new THREE.Vector3(carW * 0.35, carSheaveY, 0),
          new THREE.Vector3(0, machineSheaveY, -0.2),
          "z"
        );
        drawMultiRope(
          new THREE.Vector3(0, machineSheaveY, -halfD + 0.65),
          new THREE.Vector3(-0.4, cwtY + 2.5, -halfD + 0.65),
          "x"
        );
        drawMultiRope(
          new THREE.Vector3(0.4, cwtY + 2.5, -halfD + 0.65),
          new THREE.Vector3(0.4, hitchTopY, -halfD + 0.65),
          "x"
        );
      } else if (suspension === "hydraulic_2_1") {
        // Hydraulic 2:1: Anchor in Pit -> Loop over Ram Sheave -> Down to Car Sling Bottom
        const pitAnchorY = pitFloorY + 1.0;
        const ramHeadY = pitFloorY + 4.5 + 4.0 + 4.0 + (carY / 2); // Ram extends at half car speed!
        const carBottomY = carY - carH / 2 - 0.2;

        if (hydPistonRef.current) {
          hydPistonRef.current.position.y = 4.0 + (carY / 2);
        }

        // Pit Anchor -> Ram Head Sheave
        drawMultiRope(
          new THREE.Vector3(-halfW + 0.5, pitAnchorY, 0),
          new THREE.Vector3(-halfW + 0.5, ramHeadY, 0),
          "z"
        );

        // Ram Head Sheave -> Down to Car Bottom Hitch
        drawMultiRope(
          new THREE.Vector3(-halfW + 0.9, ramHeadY, 0),
          new THREE.Vector3(-carW / 2 - 0.1, carBottomY, 0),
          "z"
        );
      }

      // Traveling Cable (کابل فرمان آویزان با انحنای طبیعی کاتنری)
      if (showTravelingCable && travelingCableGroupRef.current) {
        while (travelingCableGroupRef.current.children.length > 0) {
          travelingCableGroupRef.current.remove(travelingCableGroupRef.current.children[0]);
        }

        const midWallY = 0; // Shaft junction box at mid height
        const carCableAnchor = new THREE.Vector3(carW * 0.25, carY - carH / 2 - 0.1, -carD * 0.25);
        const wallCableAnchor = new THREE.Vector3(halfW - 0.15, midWallY, -halfD * 0.2);
        const loopBottomY = Math.min(carCableAnchor.y, wallCableAnchor.y) - 2.8;

        const curve = new THREE.QuadraticBezierCurve3(
          carCableAnchor,
          new THREE.Vector3((carCableAnchor.x + wallCableAnchor.x) / 2, loopBottomY, (carCableAnchor.z + wallCableAnchor.z) / 2),
          wallCableAnchor
        );

        const cableGeo = new THREE.TubeGeometry(curve, 24, 0.08, 8, false);
        const cableMesh = new THREE.Mesh(
          cableGeo,
          new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 })
        );
        travelingCableGroupRef.current.add(cableMesh);
      }
    };

    // ------------------------------------------------------------------------
    // Mouse Drag Orbit & Zoom Handlers
    // ------------------------------------------------------------------------
    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) isDraggingRef.current = true;
      if (e.button === 2) isPanningRef.current = true;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - prevMousePosRef.current.x;
      const deltaY = e.clientY - prevMousePosRef.current.y;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };

      if (isDraggingRef.current) {
        cameraOrbitRef.current.theta += deltaX * 0.007;
        cameraOrbitRef.current.phi = Math.max(0.08, Math.min(Math.PI - 0.08, cameraOrbitRef.current.phi - deltaY * 0.007));
        updateCameraPosition();
      } else if (isPanningRef.current) {
        cameraOrbitRef.current.targetY = Math.max(-10, Math.min(10, cameraOrbitRef.current.targetY + deltaY * 0.02));
        updateCameraPosition();
      }
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      isPanningRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraOrbitRef.current.radius = Math.max(8, Math.min(60, cameraOrbitRef.current.radius + e.deltaY * 0.035));
      updateCameraPosition();
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    domElement.addEventListener("wheel", onWheel, { passive: false });
    domElement.addEventListener("contextmenu", (e) => e.preventDefault());

    // ------------------------------------------------------------------------
    // 60 FPS Render & Kinematics Animation Loop
    // ------------------------------------------------------------------------
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let lastTelemetryUpdate = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const travelRange = 13.5;

      // Update position smoothly
      if (isAutoMovingRef.current) {
        const time = clock.getElapsedTime() * (speed * 0.35);
        const normalized = (Math.sin(time) + 1) / 2; // 0 to 1
        carPosNormalizedRef.current = normalized;
      } else {
        // Static or slider driven
      }

      const currentNorm = carPosNormalizedRef.current;
      const carY = (currentNorm - 0.5) * travelRange;
      const cwtY = -carY; // Counterweight moves opposite

      // Update Car & Counterweight Meshes directly
      if (carGroupRef.current) {
        carGroupRef.current.position.y = carY;
      }
      if (cwtGroupRef.current && suspension !== "hydraulic_2_1") {
        cwtGroupRef.current.position.y = cwtY;
      }

      // Update ropes and traveling cable vertices
      updateRopesAndCables(carY, cwtY);

      // Throttled UI Telemetry update (avoids React 60fps render lag!)
      const now = performance.now();
      if (now - lastTelemetryUpdate > 150) {
        lastTelemetryUpdate = now;
        setTelemetryElevation(Math.round(currentNorm * 100));
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      domElement.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [capacity, suspension, wallMode, showRopes, showDoors, showRefuge, speed, updateCameraPosition, shaftData]);

  // Synchronize manual slider with ref
  const handleSliderChange = (newVal: number) => {
    setIsPlaying(false);
    isAutoMovingRef.current = false;
    carPosNormalizedRef.current = newVal;
    setManualPos(newVal);
    setTelemetryElevation(Math.round(newVal * 100));
  };

  // Jump to floor presets
  const jumpToFloor = (normY: number) => {
    setIsPlaying(false);
    isAutoMovingRef.current = false;
    carPosNormalizedRef.current = normY;
    setManualPos(normY);
    setTelemetryElevation(Math.round(normY * 100));
  };

  const copyDxfData = () => {
    const dxfSample = `0\nSECTION\n2\nENTITIES\n0\nLINE\n8\nLD_SUSPENSION_${suspension.toUpperCase()}\n10\n0.0\n20\n0.0\n11\n${shaftData.sw}\n21\n${shaftData.sd}\n0\nENDSEC\n0\nEOF`;
    navigator.clipboard.writeText(dxfSample);
    setCopiedDxf(true);
    setTimeout(() => setCopiedDxf(false), 2500);
  };

  return (
    <div className="rounded-2xl border border-vertex-border bg-white shadow-card overflow-hidden">
      {/* CAD Studio Header */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-vertex-blueprint flex items-center justify-center text-white shadow-sm">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold font-mono text-white">
                VERTEX 3D KINEMATICS & SUSPENSION ENGINE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                EN 81-20/50 & ISIRI 6303
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isFa 
                ? "موتور سه‌بعدی محاسبات انواع سیستم تعلیق، مسیر سیم‌بکسل‌بندی، فلکه‌های هرزگرد، یوک و سینماتیک حرکت" 
                : "Real-time 3D WebGL kinematics, suspension roping paths, deflector sheaves, and elevator sling anatomy"}
            </p>
          </div>
        </div>

        {/* View Mode Presets */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-800 border border-slate-700 text-xs">
          <button
            onClick={() => setViewMode("3d")}
            className={cn(
              "px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5",
              viewMode === "3d" ? "bg-vertex-blueprint text-white shadow-sm" : "text-slate-300 hover:text-white"
            )}
          >
            <Box className="w-3.5 h-3.5" />
            <span>{isFa ? "سه‌بعدی آزاد" : "3D Orbit"}</span>
          </button>
          <button
            onClick={() => setViewMode("front")}
            className={cn(
              "px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5",
              viewMode === "front" ? "bg-vertex-blueprint text-white shadow-sm" : "text-slate-300 hover:text-white"
            )}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isFa ? "نمای روبرو" : "Front"}</span>
          </button>
          <button
            onClick={() => setViewMode("side")}
            className={cn(
              "px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5",
              viewMode === "side" ? "bg-vertex-blueprint text-white shadow-sm" : "text-slate-300 hover:text-white"
            )}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{isFa ? "نمای جانبی ریل" : "Side Rails"}</span>
          </button>
          <button
            onClick={() => setViewMode("sheaves")}
            className={cn(
              "px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5",
              viewMode === "sheaves" ? "bg-vertex-blueprint text-white shadow-sm" : "text-slate-300 hover:text-white"
            )}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isFa ? "زوم تعلیق و فلکه‌ها" : "Sheaves Zoom"}</span>
          </button>
          <button
            onClick={() => setViewMode("top")}
            className={cn(
              "px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5",
              viewMode === "top" ? "bg-vertex-blueprint text-white shadow-sm" : "text-slate-300 hover:text-white"
            )}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>{isFa ? "پلان از بالا" : "Plan"}</span>
          </button>
        </div>
      </div>

      {/* SUSPENSION SELECTOR BAR (انواع سیستم تعلیق) */}
      <div className="bg-slate-50 border-b border-vertex-border p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold text-vertex-blueprint uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>{isFa ? "گزینش نوع سیستم تعلیق و سیم‌بکسل‌بندی (Suspension & Roping Systems):" : "Suspension & Roping Configuration:"}</span>
          </span>
          <span className="text-[11px] font-mono text-vertex-steel">
            {isFa ? "استاندارد EN 81-50 / مبحث ۱۵" : "EN 81-50 Certified"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {(Object.keys(SUSPENSION_CONFIGS) as SuspensionType[]).map((suspKey) => {
            const item = SUSPENSION_CONFIGS[suspKey];
            const isSelected = suspension === suspKey;
            return (
              <button
                key={suspKey}
                onClick={() => setSuspension(suspKey)}
                className={cn(
                  "p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between text-xs",
                  isSelected
                    ? "bg-white border-vertex-blueprint ring-2 ring-vertex-blueprint/20 shadow-sm"
                    : "bg-white/80 hover:bg-white border-vertex-border text-vertex-secondary hover:text-vertex-primary"
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span 
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono font-black"
                      style={{ 
                        backgroundColor: isSelected ? `${item.color}20` : '#f1f5f9',
                        color: isSelected ? item.color : '#475569' 
                      }}
                    >
                      {item.ratio}
                    </span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-vertex-blueprint animate-ping" />}
                  </div>
                  <div className="font-bold text-[11px] text-vertex-primary line-clamp-1">
                    {isFa ? item.nameFa.split("(")[0].trim() : item.nameEn.split("(")[0].trim()}
                  </div>
                </div>
                <div className="text-[10px] text-vertex-steel font-mono mt-1 pt-1 border-t border-slate-100 flex items-center justify-between">
                  <span>{item.sheaveCount} فلکه</span>
                  <span>{item.torqueFactor.split("(")[0].replace("گشتاور نامی", "").trim()}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main CAD Interactive Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[580px]">
        {/* Left Side: Three.js Canvas */}
        <div className="lg:col-span-3 relative h-[500px] sm:h-[580px] bg-slate-100 overflow-hidden border-b lg:border-b-0 lg:border-r border-vertex-border">
          {/* Three.js viewport */}
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Floating Canvas Live Telemetry Badges */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
            <div className="p-3 rounded-xl bg-white/95 backdrop-blur-md border border-vertex-border shadow-sm text-xs space-y-1">
              <div className="font-mono font-bold text-vertex-primary flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isFa ? "تله‌متری سینماتیک حرکت" : "Kinematics Telemetry"}</span>
              </div>
              <div className="text-[11px] text-vertex-secondary font-mono flex items-center justify-between gap-3">
                <span className="text-vertex-steel">{isFa ? "موقعیت کابین:" : "Car Elevation:"}</span>
                <span className="font-bold text-vertex-blueprint">{telemetryElevation}% ارتفاع چاه</span>
              </div>
              <div className="text-[11px] text-vertex-secondary font-mono flex items-center justify-between gap-3">
                <span className="text-vertex-steel">{isFa ? "سرعت نامی:" : "Rated Speed:"}</span>
                <span className="font-bold text-emerald-600">{speed.toFixed(1)} m/s</span>
              </div>
              <div className="text-[11px] text-vertex-secondary font-mono flex items-center justify-between gap-3">
                <span className="text-vertex-steel">{isFa ? "نسبت تعلیق:" : "Roping Ratio:"}</span>
                <span className="font-bold text-vertex-primary">{activeSpec.ratio}</span>
              </div>
            </div>
          </div>

          {/* Canvas Suspension Info Pill */}
          <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-2 p-2 px-3 rounded-xl bg-white/95 backdrop-blur-md border border-vertex-border shadow-sm text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeSpec.color }} />
            <span className="font-bold text-vertex-primary">
              {isFa ? activeSpec.nameFa : activeSpec.nameEn}
            </span>
          </div>

          {/* Bottom Left Controls: Motion, Floor presets, and DXF Export */}
          <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 shadow-sm",
                isPlaying 
                  ? "bg-vertex-blueprint text-white border-vertex-blueprint"
                  : "bg-white text-vertex-primary hover:text-vertex-blueprint border-vertex-border"
              )}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? (isFa ? "توقف حرکت" : "Pause") : (isFa ? "حرکت پیوسته" : "Auto Motion")}</span>
            </button>

            {/* Quick Floor Jump Presets */}
            <div className="hidden sm:flex items-center gap-1 p-0.5 rounded-lg bg-white/90 backdrop-blur-md border border-vertex-border text-[11px] font-mono">
              <button
                onClick={() => jumpToFloor(0.05)}
                className="px-2 py-1 rounded hover:bg-slate-100 text-vertex-secondary hover:text-vertex-primary"
                title={isFa ? "توقف در کف چاهک و بافر" : "Pit Level"}
              >
                {isFa ? "چاهک (Pit)" : "Pit"}
              </button>
              <button
                onClick={() => jumpToFloor(0.5)}
                className="px-2 py-1 rounded hover:bg-slate-100 text-vertex-secondary hover:text-vertex-primary"
                title={isFa ? "توقف در طبقه میانی" : "Mid Floor"}
              >
                {isFa ? "طبقه میانی" : "Mid"}
              </button>
              <button
                onClick={() => jumpToFloor(0.95)}
                className="px-2 py-1 rounded hover:bg-slate-100 text-vertex-secondary hover:text-vertex-primary"
                title={isFa ? "توقف در بام و بالاسری" : "Overhead"}
              >
                {isFa ? "بالاسری (OH)" : "Overhead"}
              </button>
            </div>

            <button
              onClick={copyDxfData}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-white hover:bg-slate-50 text-vertex-primary hover:text-vertex-blueprint border-vertex-border transition-all flex items-center gap-1.5 shadow-sm"
              title={isFa ? "کپی لایه تعلیق در حافظه" : "Export DXF Layer"}
            >
              {copiedDxf ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileCode className="w-3.5 h-3.5 text-vertex-blueprint" />}
              <span>{copiedDxf ? (isFa ? "کپی شد!" : "Copied!") : (isFa ? "خروجی لایه DXF" : "Export DXF")}</span>
            </button>
          </div>
        </div>

        {/* Right Side: CAD Controls, Kinematic Formulas & Suspension Details */}
        <div className="p-5 sm:p-6 bg-slate-50/70 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Active Suspension Specifications Card */}
            <div className="p-4 rounded-xl bg-white border border-vertex-border shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-mono font-bold text-vertex-blueprint flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  <span>{isFa ? "مشخصات فنی سیستم انتخابی" : "Suspension Specifications"}</span>
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {activeSpec.ratio}
                </span>
              </div>

              <p className="text-xs text-vertex-secondary leading-relaxed">
                {isFa ? activeSpec.shortDescFa : activeSpec.shortDescEn}
              </p>

              <div className="space-y-1.5 text-xs font-mono pt-1">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-vertex-steel">{isFa ? "سرعت سیم‌بکسل:" : "Rope Velocity:"}</span>
                  <span className="font-bold text-vertex-primary">{activeSpec.ropeSpeedFactor} × سرعت کابین</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-vertex-steel">{isFa ? "گشتاور موتور:" : "Motor Torque:"}</span>
                  <span className="font-bold text-emerald-600">{activeSpec.torqueFactor.split("(")[0].trim()}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-vertex-steel">{isFa ? "تعداد فلکه‌ها:" : "Sheave Count:"}</span>
                  <span className="font-bold text-vertex-primary">{activeSpec.sheaveCount} عدد</span>
                </div>
              </div>

              {/* Key Advantages Checklist */}
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <span className="text-[11px] font-bold text-vertex-primary block mb-1">
                  {isFa ? "مزایای مکانیکی این آرایش:" : "Key Engineering Advantages:"}
                </span>
                {(isFa ? activeSpec.advantagesFa : activeSpec.advantagesEn).map((adv, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[11px] text-vertex-secondary leading-normal">
                    <span className="w-1.5 h-1.5 rounded-full bg-vertex-blueprint shrink-0 mt-1.5" />
                    <span>{adv}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Manual Car Elevation Slider */}
            <div className="space-y-2 p-3.5 rounded-xl bg-white border border-vertex-border">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-vertex-primary">{isFa ? "کنترل دستی موقعیت کابین:" : "Manual Position:"}</span>
                <span className="font-bold text-vertex-blueprint">{telemetryElevation}%</span>
              </div>
              <input
                type="range"
                min="0.02"
                max="0.98"
                step="0.01"
                value={manualPos}
                onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
                className="w-full accent-vertex-blueprint cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] text-vertex-steel font-mono">
                <span>{isFa ? "کف چاهک (Pit)" : "Pit Level"}</span>
                <span>{isFa ? "سقف چاه (Overhead)" : "Overhead"}</span>
              </div>
            </div>

            {/* Speed Control Slider */}
            <div className="space-y-2 p-3.5 rounded-xl bg-white border border-vertex-border">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-vertex-primary">{isFa ? "سرعت نامی حرکت (Speed):" : "Rated Speed (m/s):"}</span>
                <span className="font-bold text-emerald-600">{speed.toFixed(1)} m/s</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="3.5"
                step="0.5"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* 3D Layers Toggles */}
            <div className="space-y-2 pt-2 border-t border-vertex-border">
              <span className="text-xs font-mono font-bold text-vertex-steel block">
                {isFa ? "مدیریت لایه‌های بصری CAD:" : "CAD Visualization Layers:"}
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-vertex-border cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={showRopes}
                    onChange={(e) => setShowRopes(e.target.checked)}
                    className="accent-vertex-blueprint w-3.5 h-3.5 rounded"
                  />
                  <span>{isFa ? "سیم‌بکسل‌ها و فلکه‌ها" : "Ropes & Pulleys"}</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-vertex-border cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={showTravelingCable}
                    onChange={(e) => setShowTravelingCable(e.target.checked)}
                    className="accent-vertex-blueprint w-3.5 h-3.5 rounded"
                  />
                  <span>{isFa ? "کابل متحرک فرمان" : "Traveling Cable"}</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-vertex-border cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={showDoors}
                    onChange={(e) => setShowDoors(e.target.checked)}
                    className="accent-vertex-blueprint w-3.5 h-3.5 rounded"
                  />
                  <span>{isFa ? "درب‌های طبقات" : "Landing Doors"}</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-vertex-border cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={showRefuge}
                    onChange={(e) => setShowRefuge(e.target.checked)}
                    className="accent-vertex-blueprint w-3.5 h-3.5 rounded"
                  />
                  <span>{isFa ? "جان‌پناه EN 81-20" : "Refuge Cubes"}</span>
                </label>
              </div>
            </div>

            {/* Wall Cutaway Mode */}
            <div className="space-y-1.5 pt-2 border-t border-vertex-border">
              <span className="text-xs font-mono font-bold text-vertex-steel block">
                {isFa ? "برش و نمای دیواره‌های بتنی چاهک:" : "Shaft Wall Render Mode:"}
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                <button
                  onClick={() => setWallMode("cutaway")}
                  className={cn(
                    "py-1.5 rounded-lg border font-bold transition-all",
                    wallMode === "cutaway" 
                      ? "bg-vertex-blueprint text-white border-vertex-blueprint" 
                      : "bg-white text-slate-600 border-vertex-border hover:bg-slate-50"
                  )}
                >
                  {isFa ? "برش باز (Cutaway)" : "Cutaway"}
                </button>
                <button
                  onClick={() => setWallMode("transparent")}
                  className={cn(
                    "py-1.5 rounded-lg border font-bold transition-all",
                    wallMode === "transparent" 
                      ? "bg-vertex-blueprint text-white border-vertex-blueprint" 
                      : "bg-white text-slate-600 border-vertex-border hover:bg-slate-50"
                  )}
                >
                  {isFa ? "نیمه شفاف" : "Transparent"}
                </button>
                <button
                  onClick={() => setWallMode("wireframe")}
                  className={cn(
                    "py-1.5 rounded-lg border font-bold transition-all",
                    wallMode === "wireframe" 
                      ? "bg-vertex-blueprint text-white border-vertex-blueprint" 
                      : "bg-white text-slate-600 border-vertex-border hover:bg-slate-50"
                  )}
                >
                  {isFa ? "خطی (Wire)" : "Wireframe"}
                </button>
              </div>
            </div>
          </div>

          {/* Compliance Footer Pill */}
          <div className="pt-4 border-t border-vertex-border">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-start gap-2 text-emerald-900 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                {isFa 
                  ? "محاسبه ضرایب اطمینان سیم‌بکسل‌بندی و زاویه تماس (Angle of Wrap) فلکه‌ها منطبق بر بند ۵.۵ استاندارد EN 81-50 و استاندارد ملی ۶۳۰۳-۱." 
                  : "Certified rope safety factors and angle-of-wrap compliance per EN 81-50 Art. 5.5 and ISIRI 6303-1."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
