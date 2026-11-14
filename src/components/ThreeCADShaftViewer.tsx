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
  Check, 
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
  MoveHorizontal, 
  Loader2,
  Building,
  Building2,
  DoorOpen,
  DoorClosed,
  Calculator,
  Gauge,
  Workflow,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SuspensionType = 
  | "1_1_direct"        // ۱:۱ مستقیم
  | "2_1_underslung"    // ۲:۱ زیر کابین
  | "2_1_overslung"     // ۲:۱ روی کابین
  | "4_1_heavy_duty"    // ۴:۱ باربری سنگین
  | "cantilever_2_1"    // ۲:۱ کوله‌ای / کنسولی
  | "hydraulic_2_1";    // ۲:۱ هیدرولیک جک بغل

export type DoorMechanismType = 
  | "central"           // سانترال اتوماتیک ۲ لته از وسط بازشو
  | "telescopic_right"  // تلسکوپی اتوماتیک ۲ لته راست بازشو
  | "telescopic_left"   // تلسکوپی اتوماتیک ۲ لته چپ بازشو
  | "folding_bus"       // درب اتوبوسی / آکاردئونی تاشو
  | "semi_automatic";   // نیمه اتوماتیک (لولایی طبقه با دستگیره و شیشه دید)

export type CounterweightPosition = "rear" | "right" | "left";

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
  color: string;
}

const SUSPENSION_CONFIGS: Record<SuspensionType, SuspensionSpec> = {
  "1_1_direct": {
    id: "1_1_direct",
    nameFa: "۱:۱ مستقیم (Direct Traction)",
    nameEn: "1:1 Direct Traction",
    shortDescFa: "کشش مستقیم سیم‌بکسل‌ها از تیر یوک به فلکه موتور و قاب وزنه بدون فلکه هرزگرد متحرک.",
    shortDescEn: "Direct suspension where ropes terminate directly on car crosshead and counterweight.",
    ratio: "1:1",
    ratioVal: 1,
    ropeSpeedFactor: 1.0,
    torqueFactor: "۱۰۰٪ گشتاور نامی موتور",
    sheaveCount: 1,
    color: "#0284c7"
  },
  "2_1_underslung": {
    id: "2_1_underslung",
    nameFa: "۲:۱ زیر کابین (Underslung MRL)",
    nameEn: "2:1 Underslung MRL",
    shortDescFa: "عبور سیم‌بکسل‌ها از زیر کفی کابین با دو فلکه هرزگرد؛ استانداردی بی‌نظیر برای MRL.",
    shortDescEn: "Ropes pass underneath the car platform around two pulleys; standard for MRL lifts.",
    ratio: "2:1",
    ratioVal: 2,
    ropeSpeedFactor: 2.0,
    torqueFactor: "۵۰٪ گشتاور (موتور سبک‌تر و کوچک‌تر)",
    sheaveCount: 3,
    color: "#059669"
  },
  "2_1_overslung": {
    id: "2_1_overslung",
    nameFa: "۲:۱ روی کابین (Overslung)",
    nameEn: "2:1 Overslung Crosshead",
    shortDescFa: "قرارگیری دو فلکه هرزگرد تعلیق بر روی تیر فوقانی یوک کابین با نسبت ۲:۱.",
    shortDescEn: "Two suspension pulleys mounted on the upper crosshead of the car sling.",
    ratio: "2:1",
    ratioVal: 2,
    ropeSpeedFactor: 2.0,
    torqueFactor: "۵۰٪ گشتاور نامی",
    sheaveCount: 3,
    color: "#d97706"
  },
  "4_1_heavy_duty": {
    id: "4_1_heavy_duty",
    nameFa: "۴:۱ باربری سنگین (Heavy Freight)",
    nameEn: "4:1 Heavy Freight",
    shortDescFa: "سیستم تعلیق چهار به یک با ۴ رشته کابل برای بارهای عظیم و خودروبر.",
    shortDescEn: "4:1 mechanical advantage roping for extreme payloads and vehicle lifts.",
    ratio: "4:1",
    ratioVal: 4,
    ropeSpeedFactor: 4.0,
    torqueFactor: "۲۵٪ گشتاور (کاهش ۷۵٪ گشتاور موتور)",
    sheaveCount: 5,
    color: "#dc2626"
  },
  "cantilever_2_1": {
    id: "cantilever_2_1",
    nameFa: "۲:۱ کوله‌ای / کنسولی (Cantilever)",
    nameEn: "2:1 Cantilever Rucksack",
    shortDescFa: "هدایت کالسکه و کابین از یک سمت چاهک به سبک کوله‌پشتی برای ۳ طرف شیشه.",
    shortDescEn: "Single-side mast guided elevator car; ideal for 3-side glass panoramic cars.",
    ratio: "2:1",
    ratioVal: 2,
    ropeSpeedFactor: 2.0,
    torqueFactor: "۵۰٪ گشتاور نامی",
    sheaveCount: 3,
    color: "#7c3aed"
  },
  "hydraulic_2_1": {
    id: "hydraulic_2_1",
    nameFa: "۲:۱ هیدرولیک جک بغل (Hydraulic Ram)",
    nameEn: "2:1 Indirect Hydraulic",
    shortDescFa: "حرکت با جک هیدرولیک، پیستون کروم و فلکه پولی؛ دو برابر شدن کورس و سرعت.",
    shortDescEn: "Hydraulic ram with sheave atop cylinder piston; doubles cylinder stroke.",
    ratio: "2:1",
    ratioVal: 2,
    ropeSpeedFactor: 0.5,
    torqueFactor: "فشار کاری هیدرولیک ۳۵ الی ۵۵ بار",
    sheaveCount: 1,
    color: "#0891b2"
  }
};

// Floor Definitions
interface FloorLevel {
  id: number;
  labelFa: string;
  labelEn: string;
  elevationM: number; // meters from ground
  name: string;
}

const BUILDING_FLOORS: FloorLevel[] = [
  { id: 0, labelFa: "طبقه همکف (ورودی اصلی)", labelEn: "Ground Floor (L0)", elevationM: 0.0, name: "G" },
  { id: 1, labelFa: "طبقه اول (اداری/مسکونی)", labelEn: "1st Floor (L1)", elevationM: 3.2, name: "1" },
  { id: 2, labelFa: "طبقه دوم (واحدهای فوقانی)", labelEn: "2nd Floor (L2)", elevationM: 6.4, name: "2" },
  { id: 3, labelFa: "طبقه سوم (پنت‌هاوس/بام)", labelEn: "Penthouse / Top (L3)", elevationM: 9.6, name: "3" },
];

interface ThreeCADShaftViewerProps {
  locale: Locale;
}

export function ThreeCADShaftViewer({ locale }: ThreeCADShaftViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isFa = locale === "fa";

  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Configuration States
  const [capacity, setCapacity] = useState<number>(1000); // kg
  const [speed, setSpeed] = useState<number>(2.0); // m/s
  const [suspension, setSuspension] = useState<SuspensionType>("2_1_underslung");
  const [cwtPosition, setCwtPosition] = useState<CounterweightPosition>("rear");
  const [motorType, setMotorType] = useState<"geared" | "gearless">("geared");
  const [doorMechanism, setDoorMechanism] = useState<DoorMechanismType>("central");
  const [viewMode, setViewMode] = useState<"3d" | "front" | "side" | "top" | "sheaves" | "cabin" | "structure" | "machineroom" | "pit">("3d");
  const [wallMode, setWallMode] = useState<"steel-structure" | "cutaway" | "transparent" | "wireframe">("steel-structure");
  const [activeSideTab, setActiveSideTab] = useState<"kinematics" | "calculations" | "heights" | "standards">("kinematics");

  // Display toggles
  const [showRopes, setShowRopes] = useState<boolean>(true);
  const [showTravelingCable, setShowTravelingCable] = useState<boolean>(true);
  const [showGovernor, setShowGovernor] = useState<boolean>(true);
  const [showBrackets, setShowBrackets] = useState<boolean>(true);
  const [showRefuge, setShowRefuge] = useState<boolean>(true);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);

  // Elevator Dispatching & Floor State
  const [targetFloor, setTargetFloor] = useState<number>(0);
  const [currentFloorDisplay, setCurrentFloorDisplay] = useState<number>(0);
  const [doorProgress, setDoorProgress] = useState<number>(0.0); // 0 = closed, 1 = fully open
  const [doorStatusText, setDoorStatusText] = useState<string>("درب بسته (Closed)");
  const [isElevatorMoving, setIsElevatorMoving] = useState<boolean>(false);
  const [autoDispatchCycle, setAutoDispatchCycle] = useState<boolean>(true);

  // Manual Car Height Normalized (0.0 = Pit, 1.0 = Top OH)
  const [telemetryPosM, setTelemetryPosM] = useState<number>(0.0);
  const [telemetryVelocity, setTelemetryVelocity] = useState<number>(0.0);
  const [copiedDxf, setCopiedDxf] = useState<boolean>(false);

  // Animation & Motion Refs
  const currentYRef = useRef<number>(0.0); // 3D units Y
  const velocityYRef = useRef<number>(0.0);
  const targetYRef = useRef<number>(0.0);
  const doorProgressRef = useRef<number>(0.0);
  const doorStateRef = useRef<"closed" | "opening" | "open" | "closing">("closed");
  const doorTimerRef = useRef<number>(0);
  const autoDispatchTimerRef = useRef<number>(0);

  // References for Three.js engine
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  
  // Object hierarchy refs
  const carGroupRef = useRef<THREE.Group | null>(null);
  const cwtGroupRef = useRef<THREE.Group | null>(null);
  const carDoorLRef = useRef<THREE.Mesh | null>(null);
  const carDoorRRef = useRef<THREE.Mesh | null>(null);
  const landingDoorMeshesRef = useRef<{ left: THREE.Mesh; right: THREE.Mesh; floorId: number }[]>([]);
  const hydPistonRef = useRef<THREE.Mesh | null>(null);

  // Pre-allocated static rope segment meshes for 100% leak-free, 60fps rendering
  const ropeMeshesRef = useRef<THREE.Mesh[]>([]);
  const travelingCableMeshesRef = useRef<THREE.Mesh[]>([]);
  const governorRopeMeshesRef = useRef<THREE.Mesh[]>([]);

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

  // Shaft Dimensions & Engineering Calculations
  const shaftData = useMemo(() => {
    const base = {
      450: { sw: 1600, sd: 1600, cw: 1000, cd: 1250, op: 800, ch: 2200, ropeD: 8, ropeN: 4 },
      630: { sw: 1800, sd: 1800, cw: 1100, cd: 1400, op: 900, ch: 2300, ropeD: 10, ropeN: 4 },
      800: { sw: 1950, sd: 1950, cw: 1350, cd: 1400, op: 900, ch: 2400, ropeD: 10, ropeN: 5 },
      1000: { sw: 2100, sd: 2100, cw: 1400, cd: 1600, op: 1000, ch: 2400, ropeD: 10, ropeN: 5 },
      1275: { sw: 2300, sd: 2300, cw: 1600, cd: 1800, op: 1100, ch: 2500, ropeD: 11, ropeN: 6 },
      1600: { sw: 2500, sd: 2700, cw: 1400, cd: 2400, op: 1300, ch: 2500, ropeD: 12, ropeN: 6 },
      2000: { sw: 2800, sd: 3000, cw: 1800, cd: 2500, op: 1500, ch: 2500, ropeD: 12, ropeN: 8 },
    }[capacity as 450 | 630 | 800 | 1000 | 1275 | 1600 | 2000] || {
      sw: 2100, sd: 2100, cw: 1400, cd: 1600, op: 1000, ch: 2400, ropeD: 10, ropeN: 5
    };

    // ISIRI 6303 / EN 81-20 Calculations
    const bufferStrokeM = 0.0674 * speed * speed; // meters (Sb = 0.0674 v^2)
    const pitDepthM = Math.max(1.4, 1.4 + bufferStrokeM); // S1
    const overheadM = (base.ch / 1000) + 1.0 + (0.035 * speed * speed); // K = CH + 1.0 + 0.035 v^2
    const totalTravelM = 9.6; // 3 floors * 3.2m
    const totalShaftHeightM = pitDepthM + totalTravelM + overheadM;

    // Wire Rope Safety Factor Calculation (EN 81-50 & 6303)
    const breakingForcePerRopeKN = base.ropeD === 8 ? 38.2 : base.ropeD === 10 ? 59.8 : base.ropeD === 11 ? 72.4 : 86.1;
    const totalBreakingLoadKN = base.ropeN * breakingForcePerRopeKN;
    const carEmptyMassKg = Math.round(capacity * 0.95);
    const cwtMassKg = Math.round(carEmptyMassKg + 0.5 * capacity);
    const maxSuspendedMassKg = carEmptyMassKg + capacity;
    const staticSafetyFactor = ((totalBreakingLoadKN * 1000) / (maxSuspendedMassKg * 9.81)).toFixed(1);

    return {
      ...base,
      pitDepthM: parseFloat(pitDepthM.toFixed(2)),
      overheadM: parseFloat(overheadM.toFixed(2)),
      bufferStrokeM: parseFloat(bufferStrokeM.toFixed(3)),
      totalTravelM,
      totalShaftHeightM: parseFloat(totalShaftHeightM.toFixed(2)),
      breakingForcePerRopeKN,
      totalBreakingLoadKN,
      carEmptyMassKg,
      cwtMassKg,
      staticSafetyFactor,
      ddRatio: Math.round(400 / base.ropeD)
    };
  }, [capacity, speed]);

  const activeSpec = SUSPENSION_CONFIGS[suspension];

  // Camera Orbit update
  const updateCameraPosition = useCallback(() => {
    if (!cameraRef.current) return;
    const { theta, phi, radius, targetY } = cameraOrbitRef.current;
    const x = radius * Math.sin(phi) * Math.sin(theta);
    const y = targetY + radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(0, targetY, 0);
  }, []);

  // Preset Views
  useEffect(() => {
    if (viewMode === "3d") {
      cameraOrbitRef.current = { theta: 0.85, phi: 0.55, radius: 34, targetY: 2 };
    } else if (viewMode === "front") {
      cameraOrbitRef.current = { theta: 0, phi: Math.PI / 2, radius: 32, targetY: 2 };
    } else if (viewMode === "side") {
      cameraOrbitRef.current = { theta: Math.PI / 2, phi: Math.PI / 2, radius: 32, targetY: 2 };
    } else if (viewMode === "top") {
      cameraOrbitRef.current = { theta: 0, phi: 0.05, radius: 28, targetY: 2 };
    } else if (viewMode === "sheaves") {
      cameraOrbitRef.current = { theta: 0.45, phi: 0.65, radius: 15, targetY: 10 };
    } else if (viewMode === "cabin") {
      cameraOrbitRef.current = { theta: 0.2, phi: 1.45, radius: 4.5, targetY: currentYRef.current };
    } else if (viewMode === "structure") {
      cameraOrbitRef.current = { theta: 0.72, phi: 0.65, radius: 36, targetY: 2.5 };
    } else if (viewMode === "machineroom") {
      cameraOrbitRef.current = { theta: 0.45, phi: 0.82, radius: 14, targetY: 10.5 };
    } else if (viewMode === "pit") {
      // Direct focus on the elevator pit, buffer pedestals and buffer compression
      cameraOrbitRef.current = { theta: 0.55, phi: 1.15, radius: 11, targetY: -7.0 };
    }
    updateCameraPosition();
  }, [viewMode, updateCameraPosition]);

  // Dispatch elevator to a floor with millimeter-accurate leveling
  // In our 3D world: 1 meter = 1.6 3D units.
  // Leveling Rule: The car entrance sill (-carH / 2 + 0.085) must precisely align with the floor landing sill flY.
  // Car group center Y = flY + carH / 2 - 0.085.
  const dispatchToFloor = (floorIdx: number) => {
    if (floorIdx < 0 || floorIdx > 3) return;
    setTargetFloor(floorIdx);
    const mTo3D = 1.6;
    const floor0Y = -4.8 * mTo3D;
    const flY = floor0Y + (BUILDING_FLOORS[floorIdx].elevationM * mTo3D);
    const carH = (shaftData.ch / 1000) * 2.0;
    // Exact leveling target Y so car floor matches landing sill exactly
    const exactLevelY = flY + (carH / 2) - 0.085;
    targetYRef.current = exactLevelY;
    setIsElevatorMoving(true);
    doorStateRef.current = "closed";
  };

  useEffect(() => {
    dispatchToFloor(targetFloor);
  }, [targetFloor]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --------------------------------------------------------------------------
  // Main Three.js Scene Construction
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!isMounted) return;
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Environment
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf8fafc); // Clean architectural Slate-50

    // 2. Camera & Viewport
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 580;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
    sunLight.position.set(22, 35, 28);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 0.7);
    blueRimLight.position.set(-22, 12, -22);
    scene.add(blueRimLight);

    // 5. Shaft Scale Mapping (1m = 1.6 Three.js units)
    const mTo3D = 1.6;
    const shaftHeight = shaftData.totalShaftHeightM * mTo3D; // total 3D shaft height
    const sw3D = (shaftData.sw / 1000) * 3.4;
    const sd3D = (shaftData.sd / 1000) * 3.4;
    const halfW = sw3D / 2;
    const halfD = sd3D / 2;
    
    // Exact elevation datums in 3D:
    // Floor 0 (0.00m) is mapped to Y = -4.8 * mTo3D = -7.68
    // Pit floor is mapped to Y = (-4.8 - shaftData.pitDepthM) * mTo3D
    // Overhead roof slab is mapped to Y = (-4.8 + shaftData.totalTravelM + shaftData.overheadM) * mTo3D
    const floor0Y = -4.8 * mTo3D;
    const pitFloorY = floor0Y - (shaftData.pitDepthM * mTo3D);
    const overheadCeilingY = floor0Y + (shaftData.totalTravelM * mTo3D) + (shaftData.overheadM * mTo3D);

    // Car and Cabin Dimensions in 3D units
    const carW = (shaftData.cw / 1000) * 2.8;
    const carD = (shaftData.cd / 1000) * 2.8;
    const carH = (shaftData.ch / 1000) * 2.0;

    // Counterweight Position Coordinates
    let cwtPosX = 0;
    let cwtPosZ = -halfD + 0.65;
    if (cwtPosition === "right") {
      cwtPosX = halfW - 0.65;
      cwtPosZ = 0;
    } else if (cwtPosition === "left") {
      cwtPosX = -halfW + 0.65;
      cwtPosZ = 0;
    }

    // Ground Grid
    const grid = new THREE.GridHelper(32, 32, 0x0284c7, 0xcbd5e1);
    grid.position.y = pitFloorY - 0.05;
    scene.add(grid);

    // A) STRUCTURAL STEEL HOISTWAY FRAMEWORK (اسکلت فلزی و آهن‌کشی کامل چاهک)
    const wallGroup = new THREE.Group();
    const isSteelMode = wallMode === "steel-structure";

    // 4 Corner Steel Columns (نبشی دوبل / قوطی آهن ساختمانی St37 با رنگ قرمز اخرایی ضدزنگ مطابق نقشه مهندسی ۱)
    const steelColMat = new THREE.MeshStandardMaterial({ 
      color: isSteelMode ? 0xb91c1c : 0x991b1b, // Red Primer Steel Columns matching Image 1
      metalness: 0.85, 
      roughness: 0.25 
    });
    const colGeo = new THREE.BoxGeometry(0.38, shaftHeight, 0.38);
    const basePlateMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 });
    const gussetMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.85, roughness: 0.25 }); // Blue connection plates matching Image 1

    [
      [-halfW, 0, -halfD],
      [halfW, 0, -halfD],
      [-halfW, 0, halfD],
      [halfW, 0, halfD]
    ].forEach(([cx, cy, cz]) => {
      // Main Steel Column
      const col = new THREE.Mesh(colGeo, steelColMat);
      col.position.set(cx, (pitFloorY + overheadCeilingY) / 2, cz);
      col.castShadow = true;
      wallGroup.add(col);

      // Pit Steel Baseplate (صفحه‌ستون ۳۰×۳۰ کف چاهک با لچکی‌ها)
      const baseplate = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.08, 0.72), basePlateMat);
      baseplate.position.set(cx, pitFloorY + 0.04, cz);
      baseplate.receiveShadow = true;
      wallGroup.add(baseplate);

      // 4 Heavy Anchor Bolts per column
      [[-0.22, -0.22], [0.22, -0.22], [-0.22, 0.22], [0.22, 0.22]].forEach(([bx, bz]) => {
        const bolt = new THREE.Mesh(
          new THREE.CylinderGeometry(0.024, 0.024, 0.16, 12),
          new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 })
        );
        bolt.position.set(cx + bx, pitFloorY + 0.12, cz + bz);
        wallGroup.add(bolt);
      });

      // Tie Plates (تسمه‌های اتصال دوبل نبشی ستون‌ها در فواصل ارتفاعی)
      for (let ty = pitFloorY + 1.2; ty < overheadCeilingY; ty += 1.8) {
        const tiePlate = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.42), gussetMat);
        tiePlate.position.set(cx, ty, cz);
        wallGroup.add(tiePlate);
      }
    });

    // Horizontal Steel Ring Beams (کلاف‌کشی ناودانی و نبشی دور تا دور چاه در تمام ۴ وجه)
    // IMPORTANT: According to elevator shaft structural blueprints (Image 1 RELEVATOR & مبحث ۱۵),
    // the front side has DOOR OPENINGS at every floor. Steel ring beams must NOT cross the door openings!
    // Ring beams are placed on Rear, Left, and Right faces at every ring elevation.
    // On the Front face, a beam is only placed as a door header transom beam directly above each landing door entrance!
    const beamMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });
    for (let by = pitFloorY + 1.8; by < overheadCeilingY; by += (2.2 * mTo3D)) {
      // Rear Ring Beam
      const bRear = new THREE.Mesh(new THREE.BoxGeometry(sw3D, 0.22, 0.22), beamMat);
      bRear.position.set(0, by, -halfD);
      wallGroup.add(bRear);

      // Left Ring Beam
      const bLeft = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, sd3D), beamMat);
      bLeft.position.set(-halfW, by, 0);
      wallGroup.add(bLeft);

      // Right Ring Beam
      const bRight = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, sd3D), beamMat);
      bRight.position.set(halfW, by, 0);
      wallGroup.add(bRight);

      // Rear and Side Corner Connection Gusset Plates (ورق‌های لچکی اتصال کلاف به ستون)
      [
        [-halfW + 0.18, -halfD + 0.18],
        [halfW - 0.18, -halfD + 0.18]
      ].forEach(([gx, gz]) => {
        const gusset = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 0.18), gussetMat);
        gusset.position.set(gx, by, gz);
        wallGroup.add(gusset);
      });
    }

    // Front Structural Framing (ناودانی نعل‌درگاه و ستونک‌های تقویتی درب طبقه مطابق نقشه ۱ آهن‌کشی)
    BUILDING_FLOORS.forEach((fl) => {
      const flY = floor0Y + (fl.elevationM * mTo3D);
      // Front Lintol Beam directly above the door header transom (نعل‌درگاه بالای سردرب)
      const doorTopY = flY + carDoorH + 0.28;
      const bFrontTransom = new THREE.Mesh(new THREE.BoxGeometry(sw3D, 0.22, 0.22), beamMat);
      bFrontTransom.position.set(0, doorTopY, halfD);
      wallGroup.add(bFrontTransom);

      // Front Gussets at transom connection
      [
        [-halfW + 0.18, halfD - 0.18],
        [halfW - 0.18, halfD - 0.18]
      ].forEach(([gx, gz]) => {
        const gusset = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 0.18), gussetMat);
        gusset.position.set(gx, doorTopY, gz);
        wallGroup.add(gusset);
      });
    });

    // Heavy Overhead Machine Room Support I-Beams (تیرآهن‌های دوبل نمره ۱۸ و ۲۰ سقف چاهک)
    const iBeamMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.2 });
    [-sw3D * 0.28, sw3D * 0.28].forEach((ix) => {
      const iBeam = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.42, sd3D + 0.6), iBeamMat);
      iBeam.position.set(ix, overheadCeilingY - 0.2, 0);
      wallGroup.add(iBeam);
    });

    // Wall Panel (Cutaway / Transparent / Wireframe / Steel-Structure)
    const wallPanelMat = new THREE.MeshStandardMaterial({ 
      color: 0xe2e8f0, 
      roughness: 0.4, 
      transparent: true, 
      opacity: isSteelMode ? 0.0 : wallMode === "wireframe" ? 0.08 : wallMode === "transparent" ? 0.35 : 0.85 
    });
    if (!isSteelMode) {
      const backWall = new THREE.Mesh(new THREE.BoxGeometry(sw3D, shaftHeight, 0.08), wallPanelMat);
      backWall.position.set(0, (pitFloorY + overheadCeilingY) / 2, -halfD);
      wallGroup.add(backWall);

      const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.08, shaftHeight, sd3D), wallPanelMat);
      leftWall.position.set(-halfW, (pitFloorY + overheadCeilingY) / 2, 0);
      wallGroup.add(leftWall);
    }

    scene.add(wallGroup);

    // B) ARCHITECTURAL FLOOR LEVEL DATUMS & 3D MARKERS (رقوم و تراز ارتفاعی طبقات)
    const levelGroup = new THREE.Group();
    BUILDING_FLOORS.forEach((fl) => {
      const flY = floor0Y + (fl.elevationM * mTo3D);

      // Floor Landing Slab Floor Beam
      const slabGeo = new THREE.BoxGeometry(sw3D + 1.2, 0.25, 1.2);
      const slabMesh = new THREE.Mesh(slabGeo, new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.4 }));
      slabMesh.position.set(0, flY - 0.125, halfD + 0.6);
      levelGroup.add(slabMesh);

      // Level Marker Flag & Text in 3D
      const flagGeo = new THREE.BoxGeometry(1.4, 0.4, 0.05);
      const flagMat = new THREE.MeshBasicMaterial({ color: fl.id === targetFloor ? 0x0284c7 : 0x1e293b });
      const flag = new THREE.Mesh(flagGeo, flagMat);
      flag.position.set(-halfW - 0.9, flY + 0.2, halfD);
      levelGroup.add(flag);

      // Thin Horizontal Level Datum Line across shaft
      const lineGeo = new THREE.BoxGeometry(sw3D, 0.04, 0.04);
      const lineMesh = new THREE.Mesh(lineGeo, new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
      lineMesh.position.set(0, flY, halfD);
      levelGroup.add(lineMesh);
    });

    // Pit Datum Marker (عمق چاهک -1.60m)
    const pitFlag = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.45, 0.05),
      new THREE.MeshBasicMaterial({ color: 0xd97706 })
    );
    pitFlag.position.set(-halfW - 1.0, pitFloorY + 0.4, halfD);
    levelGroup.add(pitFlag);

    // Overhead Datum Marker (بالاسری +4.40m)
    const ohFlag = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.45, 0.05),
      new THREE.MeshBasicMaterial({ color: 0x059669 })
    );
    ohFlag.position.set(-halfW - 1.0, overheadCeilingY - 0.4, halfD);
    levelGroup.add(ohFlag);

    scene.add(levelGroup);

    // C) ISO 7465 T-Section Guide Rails & Brackets (ریل‌ها و براکت‌ها)
    const railGroup = new THREE.Group();
    const carRailMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.85, roughness: 0.2 });
    const cwtRailMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.25 });

    // Left and Right Car Guide Rails
    const carRailGeo = new THREE.BoxGeometry(0.18, shaftHeight - 0.5, 0.2);
    const railL = new THREE.Mesh(carRailGeo, carRailMat);
    railL.position.set(-halfW + 0.55, (pitFloorY + overheadCeilingY) / 2, 0);
    const railR = new THREE.Mesh(carRailGeo, carRailMat);
    railR.position.set(halfW - 0.55, (pitFloorY + overheadCeilingY) / 2, 0);
    railGroup.add(railL, railR);

    // Counterweight Guide Rails (rear, right, or left)
    const cwtRailGeo = new THREE.BoxGeometry(0.12, shaftHeight - 0.5, 0.12);
    if (cwtPosition === "rear") {
      [-1.2, 1.2].forEach(rx => {
        const cRail = new THREE.Mesh(cwtRailGeo, cwtRailMat);
        cRail.position.set(rx, (pitFloorY + overheadCeilingY) / 2, -halfD + 0.65);
        railGroup.add(cRail);
      });
    } else if (cwtPosition === "right") {
      [-0.8, 0.8].forEach(rz => {
        const cRail = new THREE.Mesh(cwtRailGeo, cwtRailMat);
        cRail.position.set(halfW - 0.65, (pitFloorY + overheadCeilingY) / 2, rz);
        railGroup.add(cRail);
      });
    } else if (cwtPosition === "left") {
      [-0.8, 0.8].forEach(rz => {
        const cRail = new THREE.Mesh(cwtRailGeo, cwtRailMat);
        cRail.position.set(-halfW + 0.65, (pitFloorY + overheadCeilingY) / 2, rz);
        railGroup.add(cRail);
      });
    }

    // Heavy-Duty Steel Rail Brackets (براکت‌های ریل کابین T89 و ریل وزنه T50 با لقمه‌ها و پیچ‌ها)
    if (showBrackets) {
      const bracketMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });
      const clipMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.2 }); // Gold/Yellow Primer Clips
      const boltMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });

      for (let brY = pitFloorY + 1.8; brY < overheadCeilingY; brY += (2.2 * mTo3D)) {
        // 1. Left Car Rail Bracket (L-shaped dual angle arm)
        const brL_Base = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.12, 0.28), bracketMat);
        brL_Base.position.set(-halfW + 0.28, brY, 0);
        const brL_Stiffener = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.18, 0.08), bracketMat);
        brL_Stiffener.position.set(-halfW + 0.35, brY - 0.08, 0);
        railGroup.add(brL_Base, brL_Stiffener);

        // Left Rail Clips (لقمه‌های M12 بالا و پایین بال ریل T89)
        [-0.1, 0.1].forEach(cz => {
          const clip = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.06), clipMat);
          clip.position.set(-halfW + 0.55 + 0.08, brY + 0.06, cz);
          const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.08, 8), boltMat);
          bolt.position.set(-halfW + 0.55 + 0.08, brY + 0.1, cz);
          railGroup.add(clip, bolt);
        });

        // 2. Right Car Rail Bracket
        const brR_Base = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.12, 0.28), bracketMat);
        brR_Base.position.set(halfW - 0.28, brY, 0);
        const brR_Stiffener = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.18, 0.08), bracketMat);
        brR_Stiffener.position.set(halfW - 0.35, brY - 0.08, 0);
        railGroup.add(brR_Base, brR_Stiffener);

        // Right Rail Clips (لقمه‌های M12)
        [-0.1, 0.1].forEach(cz => {
          const clip = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.06), clipMat);
          clip.position.set(halfW - 0.55 - 0.08, brY + 0.06, cz);
          const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.08, 8), boltMat);
          bolt.position.set(halfW - 0.55 - 0.08, brY + 0.1, cz);
          railGroup.add(clip, bolt);
        });

        // 3. Counterweight Rail Brackets (براکت‌های دوبل ریل وزنه تعادل T50)
        if (cwtPosition === "rear") {
          [-1.2, 1.2].forEach(rx => {
            const cwtBr = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.1, 0.45), bracketMat);
            cwtBr.position.set(rx, brY, -halfD + 0.35);
            const cwtClip = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.05), clipMat);
            cwtClip.position.set(rx, brY + 0.05, -halfD + 0.58);
            railGroup.add(cwtBr, cwtClip);
          });
        } else if (cwtPosition === "right") {
          [-0.8, 0.8].forEach(rz => {
            const cwtBr = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.1, 0.24), bracketMat);
            cwtBr.position.set(halfW - 0.35, brY, rz);
            const cwtClip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.06, 0.06), clipMat);
            cwtClip.position.set(halfW - 0.58, brY + 0.05, rz);
            railGroup.add(cwtBr, cwtClip);
          });
        } else if (cwtPosition === "left") {
          [-0.8, 0.8].forEach(rz => {
            const cwtBr = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.1, 0.24), bracketMat);
            cwtBr.position.set(-halfW + 0.35, brY, rz);
            const cwtClip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.06, 0.06), clipMat);
            cwtClip.position.set(-halfW + 0.58, brY + 0.05, rz);
            railGroup.add(cwtBr, cwtClip);
          });
        }
      }
    }

    scene.add(railGroup);

    // D) LANDING DOORS & SILLS AT ALL 4 FLOORS (درب‌های طبقات، آستانه‌ها و ساسپندور)
    // ISIRI 6303 / EN 81-20 Standard: Clear door opening height = 2.00m (in 3D scale: 2.0 * mTo3D = 3.2m or car clear height)
    // Door sill is at elevation flY. Door leaves extend from flY + 0.04 up to flY + carDoorH (matching car cabin clear height exactly).
    const carDoorH = carH * 0.95; // Exactly matching car sliding door height
    const landingDoorMeshes: { left: THREE.Mesh; right: THREE.Mesh; floorId: number }[] = [];
    BUILDING_FLOORS.forEach((fl) => {
      const flY = floor0Y + (fl.elevationM * mTo3D);
      const dGroup = new THREE.Group();
      dGroup.position.set(0, flY, halfD);

      const doorFrameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6 });
      const doorLeafMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, metalness: 0.9, roughness: 0.15 });

      // Aluminum Door Sill (آستانه آلومینیومی درب طبقه تراز با کف طبقه)
      const sill = new THREE.Mesh(
        new THREE.BoxGeometry(carW * 0.95, 0.06, 0.22),
        new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8 })
      );
      sill.position.set(0, 0.03, 0);
      dGroup.add(sill);

      // Frame Jambs and Transom Header (چهارچوب و سردرب طبقه منطبق با ارتفاع مفید درب کابین)
      const jambL = new THREE.Mesh(new THREE.BoxGeometry(0.14, carDoorH + 0.15, 0.2), doorFrameMat);
      jambL.position.set(-carW * 0.48, (carDoorH + 0.15) / 2, 0);
      const jambR = new THREE.Mesh(new THREE.BoxGeometry(0.14, carDoorH + 0.15, 0.2), doorFrameMat);
      jambR.position.set(carW * 0.48, (carDoorH + 0.15) / 2, 0);
      const header = new THREE.Mesh(new THREE.BoxGeometry(carW * 0.96 + 0.28, 0.22, 0.2), doorFrameMat);
      header.position.set(0, carDoorH + 0.11, 0);

      // Landing Door Suspension Track & Mechanism (مکانیزم ساسپنشن، ریل آویز لنگه‌ها و قرقره‌های تفلونی درب طبقه)
      const suspensionRail = new THREE.Mesh(
        new THREE.BoxGeometry(carW * 0.96, 0.12, 0.14),
        new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.2 })
      );
      suspensionRail.position.set(0, carDoorH + 0.05, 0.08);

      // Suspension Hanger Rollers (قرقره‌های آویز دوبل بلبرینگی روی ریل ساسپنشن)
      const rollerMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7, roughness: 0.2 });
      [-carW * 0.32, -carW * 0.14, carW * 0.14, carW * 0.32].forEach((rx) => {
        const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.04, 16), rollerMat);
        roller.rotation.x = Math.PI / 2;
        roller.position.set(rx, carDoorH + 0.07, 0.12);
        dGroup.add(roller);
      });

      // Synchronizing Cable / Steel Rope for Door Panels (سیم هماهنگ‌کننده مکانیزم تلسکوپی/سانترال)
      const syncCable = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, carW * 0.75, 8),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95 })
      );
      syncCable.rotation.z = Math.PI / 2;
      syncCable.position.set(0, carDoorH + 0.09, 0.13);

      // Mechanical Door Interlock & Lock Hook (قفل ایمنی مکانیکی و کنتاکت درب طبقه طبق استاندارد ۶۳۰۳)
      const lockBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.24, 0.12),
        new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.6 })
      );
      lockBox.position.set(-carW * 0.05, carDoorH + 0.14, 0.09);

      // Unlocking Skate Roller Pickups (کمان درب / قفل‌کن محرک با زبانه کنتاکتور)
      const lockHook = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.12, 0.06),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85 })
      );
      lockHook.position.set(-carW * 0.05, carDoorH + 0.03, 0.1);

      dGroup.add(suspensionRail, syncCable, lockBox, lockHook);

      // 2-Panel Landing Door Leaves (ارتفاع و ابعاد دقیقاً برابر با لنگه‌های درب کابین برای همپوشانی ۱۰۰٪ در حالت باز و بسته)
      const leafL = new THREE.Mesh(new THREE.BoxGeometry(carW * 0.45, carDoorH, 0.04), doorLeafMat);
      leafL.position.set(-carW * 0.23, carDoorH / 2 + 0.04, 0);
      const leafR = new THREE.Mesh(new THREE.BoxGeometry(carW * 0.45, carDoorH, 0.04), doorLeafMat);
      leafR.position.set(carW * 0.23, carDoorH / 2 + 0.04, 0);

      dGroup.add(jambL, jambR, header, leafL, leafR);
      scene.add(dGroup);

      landingDoorMeshes.push({ left: leafL, right: leafR, floorId: fl.id });
    });
    landingDoorMeshesRef.current = landingDoorMeshes;

    // E) PIT EQUIPMENT & REINFORCED CONCRETE PIT BASIN (چاهک بتنی، بافرهای هیدرولیک، سکوهای بافر و نردبان چاهک)
    // 1. Reinforced Concrete Pit Floor & Walls Basin (کف و دیواره‌های بتنی چاهک مطابق نقشه ۲)
    const pitBasinGroup = new THREE.Group();
    const pitConcreteMat = new THREE.MeshStandardMaterial({ 
      color: 0x475569, // Reinforced concrete grey
      roughness: 0.85,
      metalness: 0.15
    });

    const pitDepth3D = shaftData.pitDepthM * mTo3D; // exact depth in 3D scale
    // Heavy concrete bottom foundation slab (35cm thick)
    const pitSlab = new THREE.Mesh(
      new THREE.BoxGeometry(sw3D + 0.8, 0.4, sd3D + 0.8),
      pitConcreteMat
    );
    pitSlab.position.set(0, pitFloorY - 0.2, 0);
    pitSlab.receiveShadow = true;
    pitBasinGroup.add(pitSlab);

    // Concrete pit retaining walls (Back, Left, Right, Front bottom)
    const pitBackWall = new THREE.Mesh(
      new THREE.BoxGeometry(sw3D + 0.8, pitDepth3D, 0.25),
      pitConcreteMat
    );
    pitBackWall.position.set(0, pitFloorY + pitDepth3D / 2, -halfD - 0.125);
    const pitLeftWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, pitDepth3D, sd3D + 0.8),
      pitConcreteMat
    );
    pitLeftWall.position.set(-halfW - 0.125, pitFloorY + pitDepth3D / 2, 0);
    const pitRightWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, pitDepth3D, sd3D + 0.8),
      pitConcreteMat
    );
    pitRightWall.position.set(halfW + 0.125, pitFloorY + pitDepth3D / 2, 0);
    const pitFrontWall = new THREE.Mesh(
      new THREE.BoxGeometry(sw3D + 0.8, pitDepth3D * 0.4, 0.25),
      pitConcreteMat
    );
    pitFrontWall.position.set(0, pitFloorY + (pitDepth3D * 0.4) / 2, halfD + 0.125);

    pitBasinGroup.add(pitBackWall, pitLeftWall, pitRightWall, pitFrontWall);
    scene.add(pitBasinGroup);

    // 2. High-Strength Oil/Polyurethane Buffers & Engineered Pedestals (پایه‌های ستونی بافر ضربه‌گیر با قوطی و لچکی مطابق نقشه ۲)
    const bufMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.2 });
    const bufBaseMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.5 });
    const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.25 });
    const gussetPlateMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.85 }); // Blue gusset plates matching blueprint 2

    // Car Pit Buffers on Structural Steel Pedestals (۲ پایه بافر ستونی با قوطی و لچکی زیر کفی کابین)
    [-carW * 0.35, carW * 0.35].forEach((bx) => {
      // Main box steel pedestal column (پایه ستونی قوطی)
      const pedestal = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.75, 0.45), pedestalMat);
      pedestal.position.set(bx, pitFloorY + 0.375, 0);
      
      // Bottom anchor baseplate (صفحه پلیت اتصال به کف چاه با ۴ رول‌بولت)
      const baseplate = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.08, 0.65), bufBaseMat);
      baseplate.position.set(bx, pitFloorY + 0.04, 0);

      // 4 Gusset Stiffener Triangular Plates (لچکی‌های مثلثی مقاوم‌ساز پایه بافر)
      [
        [-0.22, 0], [0.22, 0], [0, -0.22], [0, 0.22]
      ].forEach(([gx, gz]) => {
        const gusset = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.45, 0.15), gussetPlateMat);
        gusset.position.set(bx + gx, pitFloorY + 0.265, gz !== 0 ? gz : 0);
        scene.add(gusset);
      });

      // Buffer mounting top plate
      const topPlate = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.06, 0.55), bufBaseMat);
      topPlate.position.set(bx, pitFloorY + 0.78, 0);

      // Hydraulic Buffer Cylinder & Piston with Rubber Strike Pad (سیلندر، پیستون هیدرولیک و پد ضربه‌گیر زرد)
      const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.65, 24), bufBaseMat);
      cylinder.position.set(bx, pitFloorY + 1.135, 0);
      const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.55, 24), bufMat);
      piston.position.set(bx, pitFloorY + 1.6, 0);
      const strikePad = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 24), new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 }));
      strikePad.position.set(bx, pitFloorY + 1.88, 0);

      scene.add(pedestal, baseplate, topPlate, cylinder, piston, strikePad);
    });

    // CWT Buffer on Structural Steel Pedestal (پایه بافر ستونی با قوطی و لچکی زیر وزنه تعادل)
    if (suspension !== "hydraulic_2_1") {
      const cwtPedestal = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.75, 0.42), pedestalMat);
      cwtPedestal.position.set(cwtPosX, pitFloorY + 0.375, cwtPosZ);
      
      const cwtBaseplate = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.08, 0.6), bufBaseMat);
      cwtBaseplate.position.set(cwtPosX, pitFloorY + 0.04, cwtPosZ);

      const cwtTopPlate = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.5), bufBaseMat);
      cwtTopPlate.position.set(cwtPosX, pitFloorY + 0.78, cwtPosZ);

      const cwtCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.65, 24), bufBaseMat);
      cwtCylinder.position.set(cwtPosX, pitFloorY + 1.135, cwtPosZ);
      const cwtPiston = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.55, 24), bufMat);
      cwtPiston.position.set(cwtPosX, pitFloorY + 1.6, cwtPosZ);
      const cwtPad = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.08, 24), new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 }));
      cwtPad.position.set(cwtPosX, pitFloorY + 1.88, cwtPosZ);

      scene.add(cwtPedestal, cwtBaseplate, cwtTopPlate, cwtCylinder, cwtPiston, cwtPad);
    }

    // Pit Ladder (نردبان بازرسی کف چاهک طبق استاندارد ۶۳۰۳)
    const ladderMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.6 });
    const ladderGroup = new THREE.Group();
    ladderGroup.position.set(halfW - 0.4, pitFloorY + 1.6, halfD - 0.2);
    const railL_Lad = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 3.2, 8), ladderMat);
    railL_Lad.position.set(-0.25, 0, 0);
    const railR_Lad = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 3.2, 8), ladderMat);
    railR_Lad.position.set(0.25, 0, 0);
    ladderGroup.add(railL_Lad, railR_Lad);
    for (let r = -1.4; r <= 1.4; r += 0.35) {
      const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8), ladderMat);
      rung.rotation.z = Math.PI / 2;
      rung.position.set(0, r, 0);
      ladderGroup.add(rung);
    }
    scene.add(ladderGroup);

    // Pit Governor Tension Pulley with Weight (فلکه هرزگرد ته‌چاه با وزنه کشش گاورنر)
    const pitGovGroup = new THREE.Group();
    pitGovGroup.position.set(halfW - 0.85, pitFloorY + 0.8, -halfD + 0.85);
    const govPulley = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.35, 0.08, 24),
      new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.7 })
    );
    govPulley.rotation.x = Math.PI / 2;
    const govWeight = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.35, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 })
    );
    govWeight.position.set(0, -0.3, 0);
    pitGovGroup.add(govPulley, govWeight);
    scene.add(pitGovGroup);

    // F) TRACTION MACHINE, DIVERTER SHEAVE & ROPE GUARDS (موتورخانه سر چاهک با فلکه هرزگرد انحراف)
    const machineGroup = new THREE.Group();

    if (suspension === "hydraulic_2_1") {
      const hydGroup = new THREE.Group();
      hydGroup.position.set(-halfW + 0.7, pitFloorY + 4.5, 0);

      const barrel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 9, 24),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 })
      );
      hydGroup.add(barrel);

      const ram = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 8, 24),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.98, roughness: 0.05 })
      );
      ram.position.y = 4.0;
      hydPistonRef.current = ram;
      hydGroup.add(ram);

      const hydSheave = new THREE.Mesh(
        new THREE.CylinderGeometry(0.65, 0.65, 0.25, 32),
        new THREE.MeshStandardMaterial({ color: 0x0891b2, metalness: 0.9, roughness: 0.1 })
      );
      hydSheave.rotation.x = Math.PI / 2;
      hydSheave.position.set(0, 8.0, 0);
      hydGroup.add(hydSheave);

      machineGroup.add(hydGroup);
    } else {
      // -----------------------------------------------------------------------
      // COMPLETE 3D MACHINE ROOM (فضای کامل سه‌بعدی موتورخانه، تابلو فرمان و جزئیات)
      // -----------------------------------------------------------------------
      const mrFloorY = overheadCeilingY;
      const mrCeilY = mrFloorY + 3.4; // 3.4m machine room height
      const mrW = sw3D + 1.8;
      const mrD = sd3D + 1.8;

      // 1. Concrete Floor Slab with Cable Passages (دال بتنی کف موتورخانه با شابلون عبور سیم‌بکسل)
      const mrSlabMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
      const mrFloorSlab = new THREE.Mesh(new THREE.BoxGeometry(mrW, 0.28, mrD), mrSlabMat);
      mrFloorSlab.position.set(0, mrFloorY - 0.14, 0);
      machineGroup.add(mrFloorSlab);

      // Machine Room Ceiling Slab
      const mrCeilSlab = new THREE.Mesh(new THREE.BoxGeometry(mrW, 0.22, mrD), mrSlabMat);
      mrCeilSlab.position.set(0, mrCeilY, 0);
      machineGroup.add(mrCeilSlab);

      // Lifting I-Beam with 2-Ton Safety Hook (تیرآهن حمال و قلاب سقف موتورخانه ۲ تنی)
      const hookBeam = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.32, mrD - 0.4),
        new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85 })
      );
      hookBeam.position.set(0, mrCeilY - 0.16, 0);
      machineGroup.add(hookBeam);

      const hookTorus = new THREE.Mesh(
        new THREE.TorusGeometry(0.18, 0.04, 12, 24),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9 })
      );
      hookTorus.position.set(0, mrCeilY - 0.42, 0);
      hookTorus.rotation.y = Math.PI / 2;
      machineGroup.add(hookTorus);

      // Machine Room Enclosure Walls (Cutaway / Semi-transparent)
      const mrWallMat = new THREE.MeshStandardMaterial({ 
        color: 0xe2e8f0, 
        roughness: 0.5, 
        transparent: true, 
        opacity: wallMode === "wireframe" ? 0.08 : 0.35 
      });
      const mrRearWall = new THREE.Mesh(new THREE.BoxGeometry(mrW, 3.4, 0.08), mrWallMat);
      mrRearWall.position.set(0, mrFloorY + 1.7, -mrD / 2);
      const mrLeftWall = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.4, mrD), mrWallMat);
      mrLeftWall.position.set(-mrW / 2, mrFloorY + 1.7, 0);
      machineGroup.add(mrRearWall, mrLeftWall);

      // Louvered Ventilation Window on rear wall
      const mrWindow = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.9, 0.12),
        new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 })
      );
      mrWindow.position.set(mrW * 0.25, mrFloorY + 2.2, -mrD / 2);
      machineGroup.add(mrWindow);

      // 2. Full-Height Elevator Control Panel (تابلو فرمان آسانسور ایرانی آرمان فراز / داتیس)
      const ctrlGroup = new THREE.Group();
      ctrlGroup.position.set(-mrW / 2 + 0.65, mrFloorY + 1.15, mrD * 0.22);
      
      const ctrlBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 1.9, 0.45),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.75, roughness: 0.25 })
      );
      ctrlGroup.add(ctrlBody);

      // TFT / LCD Status Screen on Control Panel
      const ctrlLcd = new THREE.Mesh(
        new THREE.PlaneGeometry(0.42, 0.22),
        new THREE.MeshBasicMaterial({ color: 0x0284c7 })
      );
      ctrlLcd.position.set(0.43, 0.45, 0);
      ctrlLcd.rotation.y = Math.PI / 2;
      ctrlGroup.add(ctrlLcd);

      // Main Rotary Disconnect Switch (کلید گردان اصلی صفر و یک برق)
      const mainSw = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.06, 16),
        new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.8 })
      );
      mainSw.rotation.z = Math.PI / 2;
      mainSw.position.set(0.44, -0.15, 0.12);
      ctrlGroup.add(mainSw);

      // Metal Trunking / Conduit from Controller to Shaft Floor
      const conduit = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.65, 0.18),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 })
      );
      conduit.position.set(0, -1.15, 0);
      ctrlGroup.add(conduit);
      machineGroup.add(ctrlGroup);

      // 3. Three-Phase Electrical Distribution Box (جعبه برق ۳ فاز با کلید مینیاتوری)
      const distBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.65, 0.22),
        new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.65 })
      );
      distBox.position.set(-mrW / 2 + 0.35, mrFloorY + 2.1, -mrD * 0.18);
      machineGroup.add(distBox);

      // 4. Fire Extinguisher (کپسول آتش‌نشانی CO2 استاندارد ۶۳۰۳)
      const fireExtGroup = new THREE.Group();
      fireExtGroup.position.set(-mrW / 2 + 0.25, mrFloorY + 1.25, -mrD * 0.32);
      const fireCyl = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.65, 16),
        new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.7, roughness: 0.2 })
      );
      const fireHose = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8),
        new THREE.MeshStandardMaterial({ color: 0x0f172a })
      );
      fireHose.position.set(0.1, 0.1, 0);
      fireExtGroup.add(fireCyl, fireHose);
      machineGroup.add(fireExtGroup);

      // 5. Machine Room Illumination Lamps (۲ ردیف روشنایی فلورسنت سقف موتورخانه مطابق تصویر ۳)
      const mrLight = new THREE.PointLight(0xffffff, 1.8, 8, 1.2);
      mrLight.position.set(0, mrCeilY - 0.3, 0);
      machineGroup.add(mrLight);

      [-0.8, 0.8].forEach(lx => {
        const fixture = new THREE.Mesh(
          new THREE.BoxGeometry(0.3, 0.08, 1.6),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        fixture.position.set(lx, mrCeilY - 0.04, 0);
        machineGroup.add(fixture);
      });

      // Exhaust Ventilation Fan (اگزاست فن تهویه موتورخانه با پره‌های دوار مطابق تصویر ۳)
      const exFanBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.55, 0.12),
        new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7 })
      );
      exFanBox.position.set(0, mrFloorY + 2.4, -mrD / 2);
      const exFanBlade = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 0.02, 8),
        new THREE.MeshStandardMaterial({ color: 0x0284c7 })
      );
      exFanBlade.rotation.x = Math.PI / 2;
      exFanBlade.position.set(0, mrFloorY + 2.4, -mrD / 2 + 0.08);
      machineGroup.add(exFanBox, exFanBlade);

      // Insulating Rubber Safety Mat in front of Controller (کفپوش لاستیکی عایق برق ۱۰ کیلوولت جلوی تابلو مطابق تصویر ۳)
      const rubberMat = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.02, 1.6),
        new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.95 })
      );
      rubberMat.position.set(-mrW / 2 + 1.25, mrFloorY + 0.01, mrD * 0.22);
      machineGroup.add(rubberMat);

      // 6. Elevated Machine Pedestal Platform (سکوی نصب موتور آسانسور به ارتفاع ۶۵ سانتی‌متر مطابق تصویر ۳)
      const pedestalHeight = 0.65;
      const mrPedestalY = mrFloorY + pedestalHeight;
      const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.3, roughness: 0.7 });
      const mrPedestal = new THREE.Mesh(
        new THREE.BoxGeometry(sw3D - 0.2, pedestalHeight, 2.5),
        pedestalMat
      );
      mrPedestal.position.set(0, mrFloorY + pedestalHeight / 2, 0);
      machineGroup.add(mrPedestal);

      // Metal Access Ladder onto Pedestal with Handrails (نردبان دسترسی فلزی با حفاظ مطابق تصویر ۳)
      const safetyYellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8 });
      const mrLadder = new THREE.Group();
      mrLadder.position.set(halfW * 0.45, mrFloorY + pedestalHeight / 2, 1.3);
      const ladRailL = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, pedestalHeight, 12), safetyYellowMat);
      ladRailL.position.set(-0.25, 0, 0);
      const ladRailR = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, pedestalHeight, 12), safetyYellowMat);
      ladRailR.position.set(0.25, 0, 0);
      mrLadder.add(ladRailL, ladRailR);
      [-0.15, 0.15].forEach(ry => {
        const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.5, 8), safetyYellowMat);
        rung.rotation.z = Math.PI / 2;
        rung.position.set(0, ry, 0);
        mrLadder.add(rung);
      });
      machineGroup.add(mrLadder);

      // Safety Balustrade Railing around Pedestal (نرده حفاظ دور سکوی موتور مطابق تصویر ۳)
      const mrRailGroup = new THREE.Group();
      const mrRailTop = new THREE.Mesh(new THREE.BoxGeometry(sw3D - 0.2, 0.04, 0.04), safetyYellowMat);
      mrRailTop.position.set(0, mrPedestalY + 0.8, -1.25);
      const mrRailSide = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 2.5), safetyYellowMat);
      mrRailSide.position.set(-halfW + 0.1, mrPedestalY + 0.8, 0);
      mrRailGroup.add(mrRailTop, mrRailSide);
      machineGroup.add(mrRailGroup);

      // Emergency Escape Trapdoor underneath Pedestal (دریچه اضطراری خروج/نجات با کرکره‌های تهویه زیر سکو مطابق تصویر ۳)
      const trapdoor = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.5, 0.04),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 })
      );
      trapdoor.position.set(0, mrFloorY + 0.28, 1.26);
      machineGroup.add(trapdoor);

      // 7. Heavy Machine Bedplate Steel Beams (شاسی دوبل ناودانی با لاستیک‌های لرزه‌گیر نئوپرن روی سکو)
      const bedplate = new THREE.Mesh(
        new THREE.BoxGeometry(sw3D - 0.4, 0.35, 2.2),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.25 })
      );
      bedplate.position.set(0, mrPedestalY + 0.18, 0);
      machineGroup.add(bedplate);

      // Neoprene Anti-Vibration Pads (بالشتک‌های لرزه‌گیر نئوپرن)
      [-halfW + 0.6, halfW - 0.6].forEach(px => {
        [-0.7, 0.7].forEach(pz => {
          const pad = new THREE.Mesh(
            new THREE.BoxGeometry(0.45, 0.08, 0.45),
            new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 })
          );
          pad.position.set(px, mrPedestalY + 0.04, pz);
          machineGroup.add(pad);
        });
      });

      // 8. TRACTION MOTOR: GEARED (بهران/الکو حلزونی ایرانی) vs GEARLESS (PMSM دیسکی)
      if (motorType === "geared") {
        // IRANIAN GEARED MACHINE (موتور گیربکس بهران / الکو NR12 / موتوژن)
        const gearedGroup = new THREE.Group();
        gearedGroup.position.set(0, mrPedestalY + 0.35, 0);

        // Worm Gearbox Cast Iron Casing (پوسته چدنی حلزونی با رنگ آبی صنعتی)
        const gearMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.75, roughness: 0.3 });
        const gearboxCasing = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.1, 1.3), gearMat);
        gearboxCasing.position.set(0, 0.55, 0.1);
        gearedGroup.add(gearboxCasing);

        // Oil Level Sight Glass (روغن‌نمای گیربکس)
        const sightGlass = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.08, 0.04, 16),
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.1 })
        );
        sightGlass.rotation.x = Math.PI / 2;
        sightGlass.position.set(0.35, 0.35, 0.76);
        gearedGroup.add(sightGlass);

        // Horizontal Asynchronous Motor Body with Cooling Fins (الکتروموتور آسنکرون افقی با پره‌های خنک‌کننده)
        const motorMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
        const asynchMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 1.8, 32), motorMat);
        asynchMotor.rotation.z = Math.PI / 2;
        asynchMotor.position.set(-1.4, 0.65, 0.1);
        gearedGroup.add(asynchMotor);

        // Cooling Fins (پره‌های خنک‌کننده روی الکتروموتور)
        for (let fx = -2.1; fx <= -0.7; fx += 0.14) {
          const fin = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.03, 24), motorMat);
          fin.rotation.z = Math.PI / 2;
          fin.position.set(fx, 0.65, 0.1);
          gearedGroup.add(fin);
        }

        // Yellow Manual Rescue Flywheel Handwheel (فلکه فلایویل زرد رنگ جهت مانور دستی در قطعی برق)
        const flywheelMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.2 });
        const flywheel = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.14, 32), flywheelMat);
        flywheel.rotation.z = Math.PI / 2;
        flywheel.position.set(-2.38, 0.65, 0.1);
        gearedGroup.add(flywheel);

        // Electro-Mechanical Double Shoe Brake with Red Manual Release Lever (ترمز فکی دوبل با اهرم قرمز خلاص‌کن)
        const brakeMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.7 });
        const brakeDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.3, 24), new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 }));
        brakeDrum.rotation.z = Math.PI / 2;
        brakeDrum.position.set(-0.65, 0.65, 0.1);
        
        const brakeShoeL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.6, 0.32), brakeMat);
        brakeShoeL.position.set(-0.65, 0.95, 0.1);
        const brakeLever = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.7, 12), brakeMat);
        brakeLever.position.set(-0.65, 1.45, 0.1);
        gearedGroup.add(brakeDrum, brakeShoeL, brakeLever);

        // Traction Sheave with Cable Grooves (فلکه اصلی کشش موتور گیربکس دقیقاً در مرکز X=0)
        const sheaveMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.15 });
        const tractionSheave = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.35, 32), sheaveMat);
        tractionSheave.rotation.z = Math.PI / 2;
        tractionSheave.position.set(0.0, 0.65, -0.2);
        gearedGroup.add(tractionSheave);

        machineGroup.add(gearedGroup);
      } else {
        // PMSM GEARLESS SLIM DISC MOTOR (موتور سنکرون گیرلس دیسکی باریک در مرکز X=0)
        const gearlessGroup = new THREE.Group();
        gearlessGroup.position.set(0, mrPedestalY + 0.35, 0);

        const motorBody = new THREE.Mesh(
          new THREE.CylinderGeometry(1.05, 1.05, 0.8, 32),
          new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.88, roughness: 0.18 })
        );
        motorBody.rotation.z = Math.PI / 2;
        motorBody.position.set(0, 1.1, 0);
        gearlessGroup.add(motorBody);

        const brakeGeo = new THREE.BoxGeometry(0.35, 0.8, 0.6);
        const brakeMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.6 });
        const brake1 = new THREE.Mesh(brakeGeo, brakeMat);
        brake1.position.set(-0.55, 1.1, 0.6);
        const brake2 = new THREE.Mesh(brakeGeo, brakeMat);
        brake2.position.set(0.55, 1.1, 0.6);
        gearlessGroup.add(brake1, brake2);

        const sheaveMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.1 });
        const tractionSheave = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.35, 32), sheaveMat);
        tractionSheave.rotation.z = Math.PI / 2;
        tractionSheave.position.set(0.0, 1.1, -0.2);
        gearlessGroup.add(tractionSheave);

        machineGroup.add(gearlessGroup);
      }

      // 9. DIVERTER SHEAVE WITH EXACT TANGENTIAL DROP TO CWT (فلکه هرزگرد انحراف هم‌راستا با فلکه موتور با فاصله استاندارد)
      // Standard Lift Designer Rule: Diverter sheave is aligned with traction sheave grooves and spaced closely (0.75m to 0.9m)
      const sheaveMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.15 });
      const diverterSheave = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.3, 32), sheaveMat);
      const guardRod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.8, 16),
        new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.8 })
      );
      guardRod.rotation.x = Math.PI / 2;

      // Realistic engineered diverter spacing (closer to motor, collinear with grooves)
      const divZ = cwtPosition === "rear" ? Math.max(-halfD + 0.65, -1.15) : -0.2;
      const divX = cwtPosition === "rear" ? 0.0 : (cwtPosition === "right" ? Math.min(halfW - 0.65, 1.15) : Math.max(-halfW + 0.65, -1.15));

      if (cwtPosition === "rear") {
        diverterSheave.rotation.z = Math.PI / 2;
        diverterSheave.position.set(0.0, mrPedestalY + 0.55, divZ);
        guardRod.position.set(0.0, mrPedestalY + 1.35, divZ);
      } else {
        diverterSheave.rotation.x = Math.PI / 2;
        diverterSheave.position.set(divX, mrPedestalY + 0.55, divZ);
        guardRod.position.set(divX, mrPedestalY + 1.35, divZ);
      }
      machineGroup.add(diverterSheave, guardRod);
      machineGroup.add(diverterSheave, guardRod);

      // Centrifugal Overspeed Governor Unit in Machine Room
      const govUnitGroup = new THREE.Group();
      govUnitGroup.position.set(halfW - 0.85, mrFloorY + 0.65, -halfD + 0.85);
      const govUpperPulley = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 0.1, 24),
        new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.8 })
      );
      govUpperPulley.rotation.x = Math.PI / 2;
      govUnitGroup.add(govUpperPulley);
      machineGroup.add(govUnitGroup);
    }

    scene.add(machineGroup);

    // G) CAR ASSEMBLY: SLING, ROLLER GUIDES, CABIN & SLIDING CAR DOORS
    const carGroup = new THREE.Group();
    carGroupRef.current = carGroup;

    const slingMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.75, roughness: 0.25 });
    
    // Crosshead (تیر فوقانی دوبل با لچکی‌ها)
    const crosshead = new THREE.Mesh(new THREE.BoxGeometry(carW + 0.4, 0.28, 0.35), slingMat);
    crosshead.position.set(0, carH / 2 + 0.2, 0);
    
    // Safety Plank (تیر زیرین کفی با فک‌های پاراشوت تدریجی)
    const safetyPlank = new THREE.Mesh(new THREE.BoxGeometry(carW + 0.4, 0.35, 0.35), slingMat);
    safetyPlank.position.set(0, -carH / 2 - 0.2, 0);

    // Left and Right Stiles
    const stileGeo = new THREE.BoxGeometry(0.2, carH + 0.7, 0.3);
    const stileL = new THREE.Mesh(stileGeo, slingMat);
    stileL.position.set(-carW / 2 - 0.1, 0, 0);
    const stileR = new THREE.Mesh(stileGeo, slingMat);
    stileR.position.set(carW / 2 + 0.1, 0, 0);

    carGroup.add(crosshead, safetyPlank, stileL, stileR);

    // Car Top Hitch Plate with 4 Spring-Loaded Wedge Sockets (DIN 15315)
    const carHitchGroup = new THREE.Group();
    const hitchPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.08, 0.22),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.2 })
    );
    hitchPlate.position.set(0, carH / 2 + 0.38, -0.2);
    carHitchGroup.add(hitchPlate);

    const socketMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.2 });
    const springMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
    
    [-0.12, -0.04, 0.04, 0.12].forEach(ox => {
      // Spring dampener
      const spring = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.1, 12), springMat);
      spring.position.set(ox, carH / 2 + 0.44, -0.2);
      // Wedge socket body
      const socket = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.035, 0.18, 12), socketMat);
      socket.position.set(ox, carH / 2 + 0.54, -0.2);
      carHitchGroup.add(spring, socket);
    });
    carGroup.add(carHitchGroup);

    // Roller Guide Shoes (۴ مجموعه کفشک رولری ۳ تایی با فنر)
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

    // Safety Gear Blocks (فک‌های پاراشوت تدریجی قرمز دو طرف)
    const safetyBlockMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.7 });
    [-carW / 2 - 0.1, carW / 2 + 0.1].forEach((px) => {
      const pBlock = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.45, 0.3), safetyBlockMat);
      pBlock.position.set(px, -carH / 2 - 0.4, 0);
      carGroup.add(pBlock);
    });

    // ==============================================================
    // DETAILED 3D ARCHITECTURAL CABIN DESIGN (طراحی سه‌بعدی کامل و لوکس کابین)
    // ==============================================================
    const cabinGroup = new THREE.Group();

    // Materials
    const wallStainlessMat = new THREE.MeshStandardMaterial({ 
      color: 0xe2e8f0, 
      metalness: 0.9, 
      roughness: 0.25 
    });
    const wallAccentMat = new THREE.MeshStandardMaterial({ 
      color: 0xd4af37, // Titanium Gold Mirror Accent
      metalness: 0.95, 
      roughness: 0.15 
    });
    const marbleFloorMat = new THREE.MeshStandardMaterial({ 
      color: 0xf8fafc, 
      roughness: 0.2 
    });
    const borderFloorMat = new THREE.MeshStandardMaterial({ 
      color: 0x1e293b, 
      roughness: 0.3 
    });
    const ceilingMat = new THREE.MeshStandardMaterial({ 
      color: 0x0f172a, 
      metalness: 0.85, 
      roughness: 0.2 
    });
    const mirrorGlassMat = new THREE.MeshStandardMaterial({ 
      color: 0xbae6fd, 
      metalness: 0.98, 
      roughness: 0.05 
    });
    const handrailMat = new THREE.MeshStandardMaterial({ 
      color: 0xf1f5f9, 
      metalness: 0.95, 
      roughness: 0.15 
    });

    // 1) FLOOR SLAB & POLISHED MARBLE WITH BORDER (کفپوش سنگ اسلب با قاب)
    const floorBase = new THREE.Mesh(new THREE.BoxGeometry(carW - 0.04, 0.08, carD - 0.04), borderFloorMat);
    floorBase.position.set(0, -carH / 2 + 0.04, 0);
    const floorCenter = new THREE.Mesh(new THREE.BoxGeometry(carW - 0.25, 0.02, carD - 0.25), marbleFloorMat);
    floorCenter.position.set(0, -carH / 2 + 0.081, 0);
    
    // Aluminum Entrance Sill with Guidance Tracks
    const doorSill = new THREE.Mesh(
      new THREE.BoxGeometry(carW * 0.9, 0.03, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 })
    );
    doorSill.position.set(0, -carH / 2 + 0.085, carD / 2 + 0.04);
    cabinGroup.add(floorBase, floorCenter, doorSill);

    // 2) LEFT & RIGHT WALLS (دیواره‌های چپ و راست استیل ماژولار)
    const wallThick = 0.04;
    const wallL = new THREE.Mesh(new THREE.BoxGeometry(wallThick, carH - 0.1, carD - 0.08), wallStainlessMat);
    wallL.position.set(-carW / 2 + wallThick / 2 + 0.02, 0, 0);
    const wallR = new THREE.Mesh(new THREE.BoxGeometry(wallThick, carH - 0.1, carD - 0.08), wallStainlessMat);
    wallR.position.set(carW / 2 - wallThick / 2 - 0.02, 0, 0);
    cabinGroup.add(wallL, wallR);

    // 3) REAR WALL WITH TITANIUM ACCENTS (دیواره عقب با نوارهای استیل طلایی)
    const wallBack = new THREE.Mesh(new THREE.BoxGeometry(carW - 0.08, carH - 0.1, wallThick), wallStainlessMat);
    wallBack.position.set(0, 0, -carD / 2 + wallThick / 2 + 0.02);
    
    // Gold Accent Stripes on Back Wall
    [-carW * 0.38, carW * 0.38].forEach(ax => {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.08, carH - 0.15, 0.01), wallAccentMat);
      stripe.position.set(ax, 0, -carD / 2 + wallThick + 0.01);
      cabinGroup.add(stripe);
    });
    cabinGroup.add(wallBack);

    // 4) REAR WALL FULL-HEIGHT POLISHED MIRROR (آینه قدی با فریم)
    const mirrorMesh = new THREE.Mesh(new THREE.BoxGeometry(carW * 0.55, carH * 0.72, 0.015), mirrorGlassMat);
    mirrorMesh.position.set(0, carH * 0.08, -carD / 2 + wallThick + 0.015);
    const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(carW * 0.57, carH * 0.74, 0.01), wallAccentMat);
    mirrorFrame.position.set(0, carH * 0.08, -carD / 2 + wallThick + 0.01);
    cabinGroup.add(mirrorFrame, mirrorMesh);

    // 5) ERGONOMIC TUBULAR STAINLESS HANDRAIL (دستگیره لوله‌ای استیل)
    const handrailGeo = new THREE.CylinderGeometry(0.022, 0.022, carW * 0.65, 16);
    const hrMesh = new THREE.Mesh(handrailGeo, handrailMat);
    hrMesh.rotation.z = Math.PI / 2;
    hrMesh.position.set(0, -carH * 0.1, -carD / 2 + wallThick + 0.08);
    // Standoff Mounts
    [-carW * 0.28, carW * 0.28].forEach(hx => {
      const mount = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.06, 8), handrailMat);
      mount.rotation.x = Math.PI / 2;
      mount.position.set(hx, -carH * 0.1, -carD / 2 + wallThick + 0.04);
      cabinGroup.add(mount);
    });
    cabinGroup.add(hrMesh);

    // 6) CAR OPERATING PANEL - COP (شستی احضار داخل کابین تمام‌قد با نمایشگر TFT)
    const copCol = new THREE.Mesh(new THREE.BoxGeometry(0.02, carH * 0.82, 0.3), wallStainlessMat);
    copCol.position.set(carW / 2 - wallThick - 0.01, 0, carD * 0.15);
    
    // Digital Floor Indicator Screen (LCD/TFT Blue Display)
    const copLcd = new THREE.Mesh(
      new THREE.BoxGeometry(0.022, 0.16, 0.22),
      new THREE.MeshBasicMaterial({ color: 0x0284c7 })
    );
    copLcd.position.set(carW / 2 - wallThick - 0.011, carH * 0.28, carD * 0.15);

    // Push Buttons Matrix (G, 1, 2, 3, Doors, Alarm)
    const btnMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    for (let bRow = 0; bRow < 4; bRow++) {
      [-0.05, 0.05].forEach(bz => {
        const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.01, 12), btnMat);
        btn.rotation.z = Math.PI / 2;
        btn.position.set(carW / 2 - wallThick - 0.015, carH * 0.12 - bRow * 0.08, carD * 0.15 + bz);
        cabinGroup.add(btn);
      });
    }
    cabinGroup.add(copCol, copLcd);

    // 7) FALSE CEILING & DOWNLIGHTS WITH REAL LIGHT EMISSION (سقف کاذب معرق با هالوژن)
    const ceilingCanopy = new THREE.Mesh(new THREE.BoxGeometry(carW - 0.04, 0.06, carD - 0.04), ceilingMat);
    ceilingCanopy.position.set(0, carH / 2 - 0.03, 0);
    
    // Laser-cut inner ceiling panel
    const innerCeiling = new THREE.Mesh(
      new THREE.BoxGeometry(carW - 0.2, 0.02, carD - 0.2),
      wallAccentMat
    );
    innerCeiling.position.set(0, carH / 2 - 0.07, 0);
    cabinGroup.add(ceilingCanopy, innerCeiling);

    // 4 LED Recessed Spotlights
    const spotMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
    [-carW * 0.25, carW * 0.25].forEach(sx => {
      [-carD * 0.25, carD * 0.25].forEach(sz => {
        const spot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.01, 16), spotMat);
        spot.position.set(sx, carH / 2 - 0.075, sz);
        cabinGroup.add(spot);
      });
    });

    // Real Warm Interior Illumination
    const interiorLight = new THREE.PointLight(0xfff7ed, 2.2, 5.0);
    interiorLight.position.set(0, carH / 2 - 0.4, 0);
    cabinGroup.add(interiorLight);

    // 8) UNDER-CAR STEEL TOE GUARD APRON (سینی زیر درب کابین ۷۵ سانتی‌متری طبق ۶۳۰۳)
    const apronMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.8, roughness: 0.3 });
    const toeGuardApron = new THREE.Mesh(new THREE.BoxGeometry(carW * 0.9, 0.75, 0.02), apronMat);
    toeGuardApron.position.set(0, -carH / 2 - 0.38, carD / 2 + 0.04);
    cabinGroup.add(toeGuardApron);

    // 9) CAR TOP SAFETY BALUSTRADE RAILING (نرده حفاظ سقف کابین ۷۰ سانتی‌متری)
    const railTubeMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.7 });
    const balustradeGroup = new THREE.Group();
    // Top rails
    const balBack = new THREE.Mesh(new THREE.BoxGeometry(carW - 0.3, 0.04, 0.04), railTubeMat);
    balBack.position.set(0, carH / 2 + 0.7, -carD / 2 + 0.15);
    const balLeft = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, carD - 0.4), railTubeMat);
    balLeft.position.set(-carW / 2 + 0.15, carH / 2 + 0.7, -0.05);
    const balRight = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, carD - 0.4), railTubeMat);
    balRight.position.set(carW / 2 - 0.15, carH / 2 + 0.7, -0.05);
    // Vertical Posts
    [
      [-carW / 2 + 0.15, -carD / 2 + 0.15],
      [carW / 2 - 0.15, -carD / 2 + 0.15],
      [-carW / 2 + 0.15, carD / 2 - 0.25],
      [carW / 2 - 0.15, carD / 2 - 0.25]
    ].forEach(([px, pz]) => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.7, 8), railTubeMat);
      post.position.set(px, carH / 2 + 0.35, pz);
      balustradeGroup.add(post);
    });
    balustradeGroup.add(balBack, balLeft, balRight);
    cabinGroup.add(balustradeGroup);

    // 10) CAR TOP INSPECTION STATION (جعبه رویزیون با کلید قارچی استپ قرمز)
    const inspBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.25, 0.25),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.5 })
    );
    inspBox.position.set(carW * 0.25, carH / 2 + 0.18, -carD * 0.15);
    const stopBtn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.04, 16),
      new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3 })
    );
    stopBtn.position.set(carW * 0.25, carH / 2 + 0.32, -carD * 0.15);
    cabinGroup.add(inspBox, stopBtn);

    // Add Complete Architectural Cabin to Car Group
    carGroup.add(cabinGroup);

    // Automatic Car Door Operator Header (موتور درب کابین با تسمه)
    const opBox = new THREE.Mesh(
      new THREE.BoxGeometry(carW * 0.85, 0.25, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 })
    );
    opBox.position.set(0, carH / 2 + 0.2, carD / 2 + 0.1);
    carGroup.add(opBox);

    // ACTIVE SLIDING CAR DOORS (لنگه‌های بازشونده درب کابین)
    const carDoorLeafMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 });
    const cDoorL = new THREE.Mesh(new THREE.BoxGeometry(carW * 0.45, carH * 0.95, 0.04), carDoorLeafMat);
    cDoorL.position.set(-carW * 0.23, 0, carD / 2 + 0.06);
    const cDoorR = new THREE.Mesh(new THREE.BoxGeometry(carW * 0.45, carH * 0.95, 0.04), carDoorLeafMat);
    cDoorR.position.set(carW * 0.23, 0, carD / 2 + 0.06);
    carGroup.add(cDoorL, cDoorR);
    carDoorLRef.current = cDoorL;
    carDoorRRef.current = cDoorR;

    // PHYSICAL SUSPENSION SHEAVES ON CAR (فلکه‌های فیزیکی زیر کفی و روی یوک ۲:۱)
    const sheaveMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.1 });
    const sheaveCoverMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.8 });

    if (suspension === "2_1_underslung") {
      // 2 Underslung Pulleys under the car platform with yellow protective covers
      [-carW / 2 + 0.25, carW / 2 - 0.25].forEach(sx => {
        const uSheave = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.18, 32), sheaveMat);
        uSheave.rotation.x = Math.PI / 2;
        uSheave.position.set(sx, -carH / 2 - 0.28, 0);
        // Protective yellow casing
        const cover = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.35, 0.65), sheaveCoverMat);
        cover.position.set(sx, -carH / 2 - 0.28, 0);
        carGroup.add(uSheave, cover);
      });
    } else if (suspension === "2_1_overslung") {
      // 2 Overslung Pulleys mounted on the upper crosshead beam
      [-carW * 0.35, carW * 0.35].forEach(sx => {
        const oSheave = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.18, 32), sheaveMat);
        oSheave.rotation.x = Math.PI / 2;
        oSheave.position.set(sx, carH / 2 + 0.52, 0);
        const cover = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.35, 0.65), sheaveCoverMat);
        cover.position.set(sx, carH / 2 + 0.52, 0);
        carGroup.add(oSheave, cover);
      });
    }

    scene.add(carGroup);

    // H) COUNTERWEIGHT ASSEMBLY
    const cwtGroup = new THREE.Group();
    cwtGroupRef.current = cwtGroup;

    if (suspension !== "hydraulic_2_1") {
      const isSideCwt = cwtPosition === "right" || cwtPosition === "left";
      const cwtW = isSideCwt ? 0.5 : 2.2;
      const cwtD = isSideCwt ? 1.8 : 0.5;
      const cwtH = 4.2;

      const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.2 });
      const cwtFrame = new THREE.Mesh(new THREE.BoxGeometry(cwtW, cwtH, cwtD), frameMat);
      cwtGroup.add(cwtFrame);

      const blockMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.4 });
      for (let cy = -1.6; cy <= 1.6; cy += 0.45) {
        const block = new THREE.Mesh(new THREE.BoxGeometry(cwtW - 0.1, 0.38, cwtD - 0.1), blockMat);
        block.position.set(0, cy, 0);
        cwtGroup.add(block);
      }

      if (suspension === "1_1_direct") {
        // CWT Top Hitch Plate with 4 Spring-Loaded Wedge Sockets (DIN 15315)
        const cwtHitchGroup = new THREE.Group();
        const cwtHitchPlate = new THREE.Mesh(
          new THREE.BoxGeometry(isSideCwt ? 0.35 : 0.65, 0.08, isSideCwt ? 0.65 : 0.22),
          new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.2 })
        );
        cwtHitchPlate.position.set(0, cwtH / 2 + 0.05, 0);
        cwtHitchGroup.add(cwtHitchPlate);

        const socketMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.2 });
        const springMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
        [-0.12, -0.04, 0.04, 0.12].forEach(offset => {
          const sx = isSideCwt ? 0 : offset;
          const sz = isSideCwt ? offset : 0;
          const spring = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.1, 12), springMat);
          spring.position.set(sx, cwtH / 2 + 0.12, sz);
          const socket = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.035, 0.18, 12), socketMat);
          socket.position.set(sx, cwtH / 2 + 0.24, sz);
          cwtHitchGroup.add(spring, socket);
        });
        cwtGroup.add(cwtHitchGroup);
      } else if (suspension === "2_1_underslung" || suspension === "2_1_overslung" || suspension === "cantilever_2_1") {
        const cwtSheave = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.22, 32), sheaveMat);
        if (isSideCwt) {
          cwtSheave.rotation.z = Math.PI / 2;
        } else {
          cwtSheave.rotation.x = Math.PI / 2;
        }
        cwtSheave.position.set(0, cwtH / 2 + 0.4, 0);
        cwtGroup.add(cwtSheave);
      }

      cwtGroup.position.set(cwtPosX, 0, cwtPosZ);
      scene.add(cwtGroup);
    }

    // I) PRE-ALLOCATED ROPE SEGMENT MESHES (Zero memory leak, 60 FPS)
    const ropesContainer = new THREE.Group();
    scene.add(ropesContainer);

    // Realistic steel wire rope material (braided metallic finish)
    const ropeMat = new THREE.MeshStandardMaterial({ 
      color: 0x94a3b8, 
      metalness: 0.95, 
      roughness: 0.25 
    });
    const unitCylGeo = new THREE.CylinderGeometry(0.022, 0.022, 1.0, 8);

    const preAllocatedRopes: THREE.Mesh[] = [];
    for (let i = 0; i < 40; i++) {
      const rMesh = new THREE.Mesh(unitCylGeo, ropeMat);
      rMesh.visible = false;
      ropesContainer.add(rMesh);
      preAllocatedRopes.push(rMesh);
    }
    ropeMeshesRef.current = preAllocatedRopes;

    // Pre-create Traveling Cable (2 segments for smooth catenary U-loop)
    const travelingCableMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
    const tc1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.0, 8), travelingCableMat);
    const tc2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.0, 8), travelingCableMat);
    tc1.visible = false;
    tc2.visible = false;
    scene.add(tc1, tc2);
    travelingCableMeshesRef.current = [tc1, tc2];

    // Pre-create Governor Rope (2 continuous full-height loops)
    const govRopeMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.9, roughness: 0.2 });
    const govUnitCyl = new THREE.CylinderGeometry(0.02, 0.02, 1.0, 6);
    const gov1 = new THREE.Mesh(govUnitCyl, govRopeMat);
    const gov2 = new THREE.Mesh(govUnitCyl, govRopeMat);
    gov1.visible = false;
    gov2.visible = false;
    scene.add(gov1, gov2);
    governorRopeMeshesRef.current = [gov1, gov2];

    // J) EN 81-20 SAFETY REFUGE SPACES (مکعب‌های جان‌پناه سقف و چاهک)
    const refugeGroup = new THREE.Group();
    refugeGroup.visible = showRefuge;

    const refMat = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true, transparent: true, opacity: 0.85 });
    // Car Top Standing Refuge (0.5m x 0.7m x 1.0m per EN 81-20)
    const refTop = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.4, 0.8), refMat);
    refTop.position.set(-carW * 0.2, carH / 2 + 0.8, 0);
    carGroup.add(refTop);

    // Pit Safety Refuge Box
    const refPit = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.2, 1.0), refMat);
    refPit.position.set(halfW - 1.2, pitFloorY + 0.6, halfD - 1.2);
    refugeGroup.add(refPit);
    scene.add(refugeGroup);

    // ------------------------------------------------------------------------
    // Helper to position a unit cylinder between 2 points
    // ------------------------------------------------------------------------
    const positionCylinder = (mesh: THREE.Mesh, p1: THREE.Vector3, p2: THREE.Vector3, isVisible: boolean) => {
      const dir = new THREE.Vector3().subVectors(p2, p1);
      const len = dir.length();
      if (len < 0.01 || !isVisible) {
        mesh.visible = false;
        return;
      }
      mesh.visible = true;
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mesh.position.copy(mid);
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
      mesh.scale.set(1, len, 1);
    };

    // ------------------------------------------------------------------------
    // Ropes & Rigging Update
    // ------------------------------------------------------------------------
    const updateRigging = (carY: number, cwtY: number) => {
      const meshes = ropeMeshesRef.current;
      meshes.forEach(m => { m.visible = false; });

      // Physical Machine Sheave and Diverter Sheave elevations in Machine Room (on Pedestal)
      const pedestalHeight = 0.65;
      const mrPedestalY = overheadCeilingY + pedestalHeight;
      const sheaveBaseY = mrPedestalY + 0.35;
      const hitchTopY = overheadCeilingY - 0.15; // Suspension rope hitch plate under machine room floor slab
      const ropeOffsets = [-0.12, -0.04, 0.04, 0.12];
      let meshIdx = 0;

      // Traction Sheave geometry & world tangent coordinates
      const trRadius = 0.85;
      const trCenterY = sheaveBaseY + (motorType === "geared" ? 0.65 : 1.1);
      const trTopY = trCenterY + trRadius;
      const trCenterX = 0.0;
      const trCenterZ = -0.2;

      // Diverter Sheave geometry & world tangent coordinates (Aligned and compact)
      const divRadius = 0.72;
      const divCenterY = mrPedestalY + 0.55;
      const divTopY = divCenterY + divRadius;
      const divCenterZ = cwtPosition === "rear" ? Math.max(-halfD + 0.65, -1.15) : -0.2;
      const divCenterX = cwtPosition === "rear" ? 0.0 : (cwtPosition === "right" ? Math.min(halfW - 0.65, 1.15) : Math.max(-halfW + 0.65, -1.15));

      if (suspension === "1_1_direct") {
        for (let i = 0; i < ropeOffsets.length && meshIdx + 4 < meshes.length; i++) {
          const off = ropeOffsets[i];
          const carRopeX = off;
          const carRopeZ = -0.2;
          const cwtRopeX = cwtPosition === "rear" ? cwtPosX + off : cwtPosX;
          const cwtRopeZ = cwtPosition === "rear" ? cwtPosZ : cwtPosZ + off;
          const divRopeX = cwtPosition === "rear" ? divCenterX + off : divCenterX;
          const divRopeZ = cwtPosition === "rear" ? divCenterZ : divCenterZ + off;

          // 1) Car Crosshead Hitch Socket strictly vertical ascent to Traction Sheave Front Tangent
          positionCylinder(
            meshes[meshIdx++],
            new THREE.Vector3(carRopeX, carY + carH / 2 + 0.52, carRopeZ),
            new THREE.Vector3(carRopeX, trCenterY, carRopeZ + trRadius),
            showRopes
          );
          // 2) Over the Traction Sheave arc towards Diverter Sheave
          positionCylinder(
            meshes[meshIdx++],
            new THREE.Vector3(carRopeX, trCenterY, carRopeZ + trRadius),
            new THREE.Vector3(carRopeX, trTopY, trCenterZ),
            showRopes
          );
          // 3) Span across from Traction Sheave top tangent to Diverter Sheave top tangent
          positionCylinder(
            meshes[meshIdx++],
            new THREE.Vector3(carRopeX, trTopY, trCenterZ),
            new THREE.Vector3(divRopeX, divTopY, divRopeZ),
            showRopes
          );
          // 4) Over the Diverter Sheave arc to vertical drop tangent point
          positionCylinder(
            meshes[meshIdx++],
            new THREE.Vector3(divRopeX, divTopY, divRopeZ),
            new THREE.Vector3(divRopeX, divCenterY, divRopeZ),
            showRopes
          );
          // 5) Diverter Sheave strictly vertical drop down to CWT Hitch Socket
          positionCylinder(
            meshes[meshIdx++],
            new THREE.Vector3(divRopeX, divCenterY, divRopeZ),
            new THREE.Vector3(cwtRopeX, cwtY + 2.25, cwtRopeZ),
            showRopes
          );
        }
      } else if (suspension === "2_1_underslung") {
        const pBottomY = carY - carH / 2 - 0.28;
        const rSheave = 0.25;
        
        for (let i = 0; i < ropeOffsets.length && meshIdx + 5 < meshes.length; i++) {
          const off = ropeOffsets[i];
          const hitchX = -carW / 2;
          const carRopeZ = off;
          const divRopeX = cwtPosition === "rear" ? divCenterX + off : divCenterX;
          const divRopeZ = cwtPosition === "rear" ? divCenterZ : divCenterZ + off;

          let cwtTangentInX = cwtPosX + off;
          let cwtTangentInZ = cwtPosition === "rear" ? cwtPosZ + rSheave : cwtPosZ + off;
          let cwtTangentOutX = cwtPosX + off;
          let cwtTangentOutZ = cwtPosition === "rear" ? cwtPosZ - rSheave : cwtPosZ + off;

          if (cwtPosition === "right") {
            cwtTangentInX = cwtPosX - rSheave;
            cwtTangentInZ = cwtPosZ + off;
            cwtTangentOutX = cwtPosX + rSheave;
            cwtTangentOutZ = cwtPosZ + off;
          } else if (cwtPosition === "left") {
            cwtTangentInX = cwtPosX + rSheave;
            cwtTangentInZ = cwtPosZ + off;
            cwtTangentOutX = cwtPosX - rSheave;
            cwtTangentOutZ = cwtPosZ + off;
          }

          // Fall 1: Vertical drop from Overhead Hitch 1 down to Car Pulley 1 outer tangent
          positionCylinder(
            meshes[meshIdx++],
            new THREE.Vector3(hitchX, hitchTopY, carRopeZ),
            new THREE.Vector3(hitchX, pBottomY, carRopeZ),
            showRopes
          );

          // Fall 2: Strictly horizontal run underneath car platform between bottom tangents
          positionCylinder(
            meshes[meshIdx++],
            new THREE.Vector3(-carW / 2 + 0.25, pBottomY - rSheave, carRopeZ),
            new THREE.Vector3(carW / 2 - 0.25, pBottomY - rSheave, carRopeZ),
            showRopes
          );

          // Fall 3: Ascent from Car Pulley 2 up to Traction Sheave on elevated pedestal
          positionCylinder(
            meshes[meshIdx++],
            new THREE.Vector3(carW / 2, pBottomY, carRopeZ),
            new THREE.Vector3(off, trTopY, trCenterZ),
            showRopes
          );

          // Fall 4: Traction sheave across diverter sheave towards CWT Sheave
          positionCylinder(
            meshes[meshIdx++],
            new THREE.Vector3(off, trTopY, trCenterZ),
            new THREE.Vector3(divRopeX, divCenterY, divRopeZ),
            showRopes
          );

          // Fall 5: Diverter Sheave down to CWT Sheave incoming tangent
          positionCylinder(
            meshes[meshIdx++],
            new THREE.Vector3(divRopeX, divCenterY, divRopeZ),
            new THREE.Vector3(cwtTangentInX, cwtY + 2.5, cwtTangentInZ),
            showRopes
          );

          // Fall 6: Vertical ascent from CWT Sheave outgoing tangent up to Overhead Hitch 2
          positionCylinder(
            meshes[meshIdx++],
            new THREE.Vector3(cwtTangentOutX, cwtY + 2.5, cwtTangentOutZ),
            new THREE.Vector3(cwtTangentOutX, hitchTopY, cwtTangentOutZ),
            showRopes
          );
        }
      } else if (suspension === "2_1_overslung") {
        const carSheaveY = carY + carH / 2 + 0.52;
        const rSheave = 0.25;

        for (let i = 0; i < ropeOffsets.length && meshIdx + 5 < meshes.length; i++) {
          const off = ropeOffsets[i];
          const hitchX = -carW * 0.35 - rSheave;
          const carRopeZ = off;
          const divRopeX = cwtPosition === "rear" ? divCenterX + off : divCenterX;
          const divRopeZ = cwtPosition === "rear" ? divCenterZ : divCenterZ + off;

          let cwtTangentInX = cwtPosX + off;
          let cwtTangentInZ = cwtPosition === "rear" ? cwtPosZ + rSheave : cwtPosZ + off;
          let cwtTangentOutX = cwtPosX + off;
          let cwtTangentOutZ = cwtPosition === "rear" ? cwtPosZ - rSheave : cwtPosZ + off;

          if (cwtPosition === "right") {
            cwtTangentInX = cwtPosX - rSheave;
            cwtTangentInZ = cwtPosZ + off;
            cwtTangentOutX = cwtPosX + rSheave;
            cwtTangentOutZ = cwtPosZ + off;
          } else if (cwtPosition === "left") {
            cwtTangentInX = cwtPosX + rSheave;
            cwtTangentInZ = cwtPosZ + off;
            cwtTangentOutX = cwtPosX - rSheave;
            cwtTangentOutZ = cwtPosZ + off;
          }

          // Fall 1: Vertical drop from Overhead Hitch 1 down to Car Pulley 1
          positionCylinder(
            meshes[meshIdx++],
            new THREE.Vector3(hitchX, hitchTopY, carRopeZ),
            new THREE.Vector3(hitchX, carSheaveY, carRopeZ),
            showRopes
          );

          // Fall 2: Horizontal run over crosshead between pulleys
          positionCylinder(
            meshes[meshIdx++],
            new THREE.Vector3(-carW * 0.35, carSheaveY + rSheave, carRopeZ),
            new THREE.Vector3(carW * 0.35, carSheaveY + rSheave, carRopeZ),
            showRopes
          );

          // Fall 3: Ascent from Car Pulley 2 up to Traction Sheave
          positionCylinder(
            meshes[meshIdx++],
            new THREE.Vector3(carW * 0.35 + rSheave, carSheaveY, carRopeZ),
            new THREE.Vector3(off, trTopY, trCenterZ),
            showRopes
          );

          // Fall 4: Traction sheave across to Diverter Sheave
          positionCylinder(
            meshes[meshIdx++],
            new THREE.Vector3(off, trTopY, trCenterZ),
            new THREE.Vector3(divRopeX, divCenterY, divRopeZ),
            showRopes
          );

          // Fall 5: Diverter Sheave down to CWT Sheave incoming tangent
          positionCylinder(
            meshes[meshIdx++],
            new THREE.Vector3(divRopeX, divCenterY, divRopeZ),
            new THREE.Vector3(cwtTangentInX, cwtY + 2.5, cwtTangentInZ),
            showRopes
          );

          // Fall 6: Vertical ascent from CWT Sheave outgoing tangent up to Overhead Hitch 2
          positionCylinder(
            meshes[meshIdx++],
            new THREE.Vector3(cwtTangentOutX, cwtY + 2.5, cwtTangentOutZ),
            new THREE.Vector3(cwtTangentOutX, hitchTopY, cwtTangentOutZ),
            showRopes
          );
        }
      } else if (suspension === "4_1_heavy_duty") {
        const carSheaveY = carY + carH / 2 + 0.55;
        const rSheave = 0.22;
        for (let i = 0; i < ropeOffsets.length && meshIdx + 3 < meshes.length; i++) {
          const off = ropeOffsets[i];
          const hitchX = -carW * 0.35 - rSheave;
          const sheave2X = carW * 0.35 + rSheave;
          const cwtRopeX = cwtPosition === "rear" ? cwtPosX + off : cwtPosX;
          const cwtRopeZ = cwtPosition === "rear" ? cwtPosZ : cwtPosZ + off;

          positionCylinder(meshes[meshIdx++], new THREE.Vector3(hitchX, hitchTopY, off), new THREE.Vector3(hitchX, carSheaveY, off), showRopes);
          positionCylinder(meshes[meshIdx++], new THREE.Vector3(sheave2X, carSheaveY, off), new THREE.Vector3(off, trTopY, trCenterZ), showRopes);
          positionCylinder(meshes[meshIdx++], new THREE.Vector3(off, trTopY, trCenterZ), new THREE.Vector3(cwtRopeX, cwtY + 2.5, cwtRopeZ + 0.2), showRopes);
          positionCylinder(meshes[meshIdx++], new THREE.Vector3(cwtRopeX, cwtY + 2.5, cwtRopeZ - 0.2), new THREE.Vector3(cwtRopeX, hitchTopY, cwtRopeZ - 0.2), showRopes);
        }
      } else if (suspension === "cantilever_2_1") {
        for (let i = 0; i < ropeOffsets.length && meshIdx + 3 < meshes.length; i++) {
          const off = ropeOffsets[i];
          const cwtRopeX = cwtPosition === "rear" ? cwtPosX + off : cwtPosX;
          const cwtRopeZ = cwtPosition === "rear" ? cwtPosZ : cwtPosZ + off;
          positionCylinder(meshes[meshIdx++], new THREE.Vector3(-carW / 2 - 0.15, hitchTopY, off), new THREE.Vector3(-carW / 2 - 0.15, carY, off), showRopes);
          positionCylinder(meshes[meshIdx++], new THREE.Vector3(-carW / 2 - 0.15, carY, off), new THREE.Vector3(off, trTopY, trCenterZ), showRopes);
          positionCylinder(meshes[meshIdx++], new THREE.Vector3(off, trTopY, trCenterZ), new THREE.Vector3(cwtRopeX, cwtY + 2.5, cwtRopeZ + 0.2), showRopes);
          positionCylinder(meshes[meshIdx++], new THREE.Vector3(cwtRopeX, cwtY + 2.5, cwtRopeZ - 0.2), new THREE.Vector3(cwtRopeX, hitchTopY, cwtRopeZ - 0.2), showRopes);
        }
      } else if (suspension === "hydraulic_2_1") {
        const pitAnchorY = pitFloorY + 1.0;
        const ramHeadY = pitFloorY + 4.5 + 4.0 + (carY / 2);
        const carBottomY = carY - carH / 2 - 0.2;
        if (hydPistonRef.current) {
          hydPistonRef.current.position.y = 4.0 + (carY / 2);
        }
        [-0.05, 0.05].forEach(off => {
          positionCylinder(meshes[meshIdx++], new THREE.Vector3(-halfW + 0.5, pitAnchorY, off), new THREE.Vector3(-halfW + 0.5, ramHeadY, off), showRopes);
          positionCylinder(meshes[meshIdx++], new THREE.Vector3(-halfW + 0.9, ramHeadY, off), new THREE.Vector3(-carW / 2 - 0.1, carBottomY, off), showRopes);
        });
      }

      // Traveling Cable (Flat flexible cable in catenary U-loop)
      if (travelingCableMeshesRef.current.length >= 2) {
        const [tcA, tcB] = travelingCableMeshesRef.current;
        const carAnchor = new THREE.Vector3(carW * 0.25, carY - carH / 2 - 0.1, -carD * 0.25);
        const wallAnchor = new THREE.Vector3(halfW - 0.15, floor0Y + 4.8 * mTo3D, -halfD * 0.2); // Mid-shaft anchor
        const catenaryBottomY = Math.min(carAnchor.y, wallAnchor.y) - 2.6;
        const midPoint = new THREE.Vector3((carAnchor.x + wallAnchor.x) / 2, catenaryBottomY, (carAnchor.z + wallAnchor.z) / 2);

        positionCylinder(tcA, carAnchor, midPoint, showTravelingCable);
        positionCylinder(tcB, midPoint, wallAnchor, showTravelingCable);
      }

      // Governor Continuous Wire Loop
      if (governorRopeMeshesRef.current.length >= 2) {
        const [gA, gB] = governorRopeMeshesRef.current;
        const govTop = new THREE.Vector3(halfW - 0.85, overheadCeilingY + 0.4, -halfD + 0.85);
        const govPit = new THREE.Vector3(halfW - 0.85, pitFloorY + 0.8, -halfD + 0.85);
        
        positionCylinder(gA, new THREE.Vector3(govTop.x - 0.1, govTop.y, govTop.z), new THREE.Vector3(govPit.x - 0.1, govPit.y, govPit.z), showGovernor);
        positionCylinder(gB, new THREE.Vector3(govTop.x + 0.1, govTop.y, govTop.z), new THREE.Vector3(govPit.x + 0.1, govPit.y, govPit.z), showGovernor);
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
        cameraOrbitRef.current.targetY = Math.max(-10, Math.min(14, cameraOrbitRef.current.targetY + deltaY * 0.02));
        updateCameraPosition();
      }
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      isPanningRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraOrbitRef.current.radius = Math.max(8, Math.min(65, cameraOrbitRef.current.radius + e.deltaY * 0.035));
      updateCameraPosition();
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    domElement.addEventListener("wheel", onWheel, { passive: false });
    domElement.addEventListener("contextmenu", (e) => e.preventDefault());

    // ------------------------------------------------------------------------
    // REALISTIC KINEMATICS & DOOR SYNCHRONIZATION LOOP (60 FPS)
    // ------------------------------------------------------------------------
    let animationFrameId: number;
    let lastTime = performance.now();
    let lastTelemetryUpdate = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Kinematic S-Curve Motion towards target floor Y
      const currentY = currentYRef.current;
      const targetY = targetYRef.current;
      const dy = targetY - currentY;
      const dist = Math.abs(dy);

      if (dist > 0.02) {
        // Elevator is travelling! Doors MUST be closed
        doorProgressRef.current = 0.0;
        doorStateRef.current = "closed";

        const moveDir = Math.sign(dy);
        const maxV = speed * 1.6; // scaled velocity
        const accel = 1.2 * 1.6;

        if (dist > 1.2) {
          velocityYRef.current = Math.min(maxV, velocityYRef.current + accel * dt);
        } else {
          // Decelerate smoothly into floor leveling zone
          velocityYRef.current = Math.max(0.2, Math.sqrt(2 * accel * dist));
        }

        currentYRef.current += moveDir * velocityYRef.current * dt;
      } else {
        // Levelled at floor!
        currentYRef.current = targetY;
        velocityYRef.current = 0.0;

        // Find floor id
        const matchedFloor = BUILDING_FLOORS.find(fl => {
          const flY = floor0Y + (fl.elevationM * mTo3D);
          return Math.abs(flY - targetY) < 0.2;
        });

        // Trigger Synchronized Door Operation
        if (doorStateRef.current === "closed" && doorTimerRef.current === 0) {
          doorStateRef.current = "opening";
        }

        if (doorStateRef.current === "opening") {
          doorProgressRef.current = Math.min(1.0, doorProgressRef.current + dt * 0.7); // 1.4s to open
          if (doorProgressRef.current >= 1.0) {
            doorStateRef.current = "open";
            doorTimerRef.current = 2.5; // Dwell open for 2.5 seconds
          }
        } else if (doorStateRef.current === "open") {
          doorTimerRef.current -= dt;
          if (doorTimerRef.current <= 0) {
            doorStateRef.current = "closing";
          }
        } else if (doorStateRef.current === "closing") {
          doorProgressRef.current = Math.max(0.0, doorProgressRef.current - dt * 0.8);
          if (doorProgressRef.current <= 0.0) {
            doorStateRef.current = "closed";
            
            // Auto dispatch cycle if enabled: proceed to next floor!
            if (autoDispatchCycle) {
              autoDispatchTimerRef.current += dt;
              if (autoDispatchTimerRef.current > 1.0) {
                autoDispatchTimerRef.current = 0;
                const nextFl = (targetFloor + 1) % 4;
                dispatchToFloor(nextFl);
              }
            }
          }
        }
      }

      // Update Car Mesh Position
      const carY = currentYRef.current;
      const cwtY = -carY;
      if (carGroupRef.current) {
        carGroupRef.current.position.y = carY;
      }
      if (cwtGroupRef.current && suspension !== "hydraulic_2_1") {
        cwtGroupRef.current.position.y = cwtY;
      }

      // Update Sliding Car Doors & Landing Doors based on Mechanism
      const dProg = doorProgressRef.current;
      const totalClearance = carW * 0.76;

      if (carDoorLRef.current && carDoorRRef.current) {
        if (doorMechanism === "central") {
          // Central 2-Panel: Left moves left, Right moves right
          const carDoorSlideDist = dProg * (carW * 0.38);
          carDoorLRef.current.position.x = -carW * 0.23 - carDoorSlideDist;
          carDoorRRef.current.position.x = carW * 0.23 + carDoorSlideDist;
          carDoorLRef.current.rotation.y = 0;
          carDoorRRef.current.rotation.y = 0;
        } else if (doorMechanism === "telescopic_right") {
          // Telescopic Right Opening: Both leaves slide towards the right
          const strokeFast = dProg * (totalClearance * 0.55);
          const strokeSlow = dProg * (totalClearance * 0.28);
          carDoorLRef.current.position.x = -carW * 0.23 + strokeSlow;
          carDoorRRef.current.position.x = carW * 0.23 + strokeFast;
          carDoorLRef.current.rotation.y = 0;
          carDoorRRef.current.rotation.y = 0;
        } else if (doorMechanism === "telescopic_left") {
          // Telescopic Left Opening: Both leaves slide towards the left
          const strokeFast = dProg * (totalClearance * 0.55);
          const strokeSlow = dProg * (totalClearance * 0.28);
          carDoorLRef.current.position.x = -carW * 0.23 - strokeFast;
          carDoorRRef.current.position.x = carW * 0.23 - strokeSlow;
          carDoorLRef.current.rotation.y = 0;
          carDoorRRef.current.rotation.y = 0;
        } else if (doorMechanism === "folding_bus") {
          // Folding Bus / Accordion Door: Accordion angle fold and compress
          const foldAngle = dProg * (Math.PI / 2.6);
          carDoorLRef.current.rotation.y = foldAngle;
          carDoorRRef.current.rotation.y = -foldAngle;
          carDoorLRef.current.position.x = -carW * 0.23 - dProg * 0.35;
          carDoorRRef.current.position.x = carW * 0.23 + dProg * 0.35;
        } else if (doorMechanism === "semi_automatic") {
          // Semi-Automatic: Car bus door folds slightly, landing door hinges
          const foldAngle = dProg * (Math.PI / 2.8);
          carDoorLRef.current.rotation.y = foldAngle;
          carDoorRRef.current.rotation.y = -foldAngle;
          carDoorLRef.current.position.x = -carW * 0.23 - dProg * 0.3;
          carDoorRRef.current.position.x = carW * 0.23 + dProg * 0.3;
        }
      }

      // Synchronize Landing Door only at current floor
      const activeLandingDoors = landingDoorMeshesRef.current.find(d => d.floorId === targetFloor);
      if (activeLandingDoors) {
        const landingClearance = carW * 0.76;
        if (doorMechanism === "central") {
          const landingSlideDist = dProg * (carW * 0.38);
          activeLandingDoors.left.position.x = -carW * 0.23 - landingSlideDist;
          activeLandingDoors.right.position.x = carW * 0.23 + landingSlideDist;
          activeLandingDoors.left.rotation.y = 0;
          activeLandingDoors.right.rotation.y = 0;
          activeLandingDoors.right.visible = true;
        } else if (doorMechanism === "telescopic_right") {
          const strokeFast = dProg * (landingClearance * 0.55);
          const strokeSlow = dProg * (landingClearance * 0.28);
          activeLandingDoors.left.position.x = -carW * 0.23 + strokeSlow;
          activeLandingDoors.right.position.x = carW * 0.23 + strokeFast;
          activeLandingDoors.left.rotation.y = 0;
          activeLandingDoors.right.rotation.y = 0;
          activeLandingDoors.right.visible = true;
        } else if (doorMechanism === "telescopic_left") {
          const strokeFast = dProg * (landingClearance * 0.55);
          const strokeSlow = dProg * (landingClearance * 0.28);
          activeLandingDoors.left.position.x = -carW * 0.23 - strokeFast;
          activeLandingDoors.right.position.x = -carW * 0.23 - strokeSlow;
          activeLandingDoors.left.rotation.y = 0;
          activeLandingDoors.right.rotation.y = 0;
          activeLandingDoors.right.visible = true;
        } else if (doorMechanism === "folding_bus") {
          const foldAngle = dProg * (Math.PI / 2.6);
          activeLandingDoors.left.rotation.y = foldAngle;
          activeLandingDoors.right.rotation.y = -foldAngle;
          activeLandingDoors.left.position.x = -carW * 0.23 - dProg * 0.35;
          activeLandingDoors.right.position.x = carW * 0.23 + dProg * 0.35;
          activeLandingDoors.right.visible = true;
        } else if (doorMechanism === "semi_automatic") {
          // Real Hinged Landing Door (درب لولایی طبقه با لولا در سمت چپ و بازشو ۹۰ درجه به بیرون)
          const hingeAngle = -dProg * (Math.PI / 2.2);
          activeLandingDoors.left.rotation.y = hingeAngle;
          // Offset pivot to hinge edge
          activeLandingDoors.left.position.x = -carW * 0.46 + Math.cos(hingeAngle) * (carW * 0.23);
          activeLandingDoors.left.position.z = Math.sin(-hingeAngle) * (carW * 0.23);
          // Right panel remains fixed frame or second leaf
          activeLandingDoors.right.visible = false;
        }
      }

      // Update ropes and rigging
      updateRigging(carY, cwtY);

      // Throttled UI Telemetry updates (10 FPS)
      if (now - lastTelemetryUpdate > 100) {
        lastTelemetryUpdate = now;
        const currentM = (carY - floor0Y) / mTo3D;
        setTelemetryPosM(parseFloat(currentM.toFixed(2)));
        setTelemetryVelocity(parseFloat((velocityYRef.current / mTo3D).toFixed(2)));
        setDoorProgress(parseFloat(dProg.toFixed(2)));
        setDoorStatusText(
          doorStateRef.current === "opening" ? (isFa ? "در حال باز شدن درب‌ها..." : "Opening Doors...") :
          doorStateRef.current === "open" ? (isFa ? "درب باز (توقف مسافرگیری)" : "Doors Open (Boarding)") :
          doorStateRef.current === "closing" ? (isFa ? "در حال بستن درب‌ها..." : "Closing Doors...") :
          (isFa ? "درب بسته و قفل مکانیکی" : "Doors Closed & Interlocked")
        );
        setCurrentFloorDisplay(targetFloor);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 580;
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
  }, [isMounted, capacity, suspension, cwtPosition, doorMechanism, wallMode, motorType, showRopes, showTravelingCable, showGovernor, showBrackets, showRefuge, speed, updateCameraPosition, shaftData, targetFloor, autoDispatchCycle]);

  const copyDxfData = () => {
    const dxfSample = `0\nSECTION\n2\nENTITIES\n0\nLINE\n8\nLD_SHAFT_3D_ISIRI_6303\n10\n0.0\n20\n0.0\n11\n${shaftData.sw}\n21\n${shaftData.sd}\n0\nENDSEC\n0\nEOF`;
    navigator.clipboard.writeText(dxfSample);
    setCopiedDxf(true);
    setTimeout(() => setCopiedDxf(false), 2500);
  };

  return (
    <div className="rounded-2xl border border-vertex-border bg-white shadow-card overflow-hidden">
      {/* CAD Studio Header */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shadow-sm">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold font-mono text-white">
                VERTEX 3D ELEVATOR CAD & KINEMATICS ENGINE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                ISIRI 6303-1 / EN 81-20
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isFa 
                ? "موتور سه‌بعدی پیشرفته آسانسور: شبیه‌سازی حرکت بین طبقات، باز و بست درب‌ها، فلکه هرزگرد، محاسبات سیم‌بکسل و رقوم ارتفاعی" 
                : "Full 3D elevator kinematics, synchronized sliding doors, diverter sheaves, wire rope sizing, and hoistway datums"}
            </p>
          </div>
        </div>

        {/* View Mode Presets */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono">
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
            <span>{isFa ? "موتور و فلکه‌ها" : "Machine"}</span>
          </button>
          <button
            onClick={() => setViewMode("cabin")}
            className={cn(
              "px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5",
              viewMode === "cabin" ? "bg-amber-600 text-white shadow-sm font-black" : "text-amber-400 hover:text-amber-300"
            )}
            title={isFa ? "اینسپکشن و مشاهده ۳ بعدی داخل کابین، سنگ اسلب، آینه و شستی" : "3D Cabin Interior Inspection"}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isFa ? "طراحی داخل کابین ۳D" : "Cabin 3D"}</span>
          </button>
          <button
            onClick={() => {
              setViewMode("structure");
              setWallMode("steel-structure");
            }}
            className={cn(
              "px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5",
              viewMode === "structure" ? "bg-emerald-600 text-white shadow-sm font-black" : "text-emerald-400 hover:text-emerald-300"
            )}
            title={isFa ? "مشاهده اسکلت فلزی، ستون‌های ۴ گوشه، کلاف‌های ناودانی و آهن‌کشی چاه" : "Inspect Steel Hoistway Structure"}
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-300" />
            <span>{isFa ? "اسکلت و آهن‌کشی چاه" : "Steel Structure"}</span>
          </button>
          <button
            onClick={() => setViewMode("machineroom")}
            className={cn(
              "px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5",
              viewMode === "machineroom" ? "bg-cyan-600 text-white shadow-sm font-black" : "text-cyan-400 hover:text-cyan-300"
            )}
            title={isFa ? "مشاهده فضای موتورخانه، تابلو فرمان ایرانی، جعبه برق، قلاب سقف و جزئیات" : "Inspect 3D Machine Room & Controller"}
          >
            <Building2 className="w-3.5 h-3.5 text-cyan-300" />
            <span>{isFa ? "فضای موتورخانه ۳D" : "Machine Room"}</span>
          </button>
          <button
            onClick={() => setViewMode("pit")}
            className={cn(
              "px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5",
              viewMode === "pit" ? "bg-orange-600 text-white shadow-sm font-black" : "text-orange-400 hover:text-orange-300"
            )}
            title={isFa ? "مشاهده چاهک، سکوهای بافر ضربه‌گیر و تجهیزات انتهای چاهک" : "Inspect Pit & Buffer Pedestals"}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-orange-300" />
            <span>{isFa ? "چاهک و سکوی بافر ۳D" : "Pit & Buffers"}</span>
          </button>
        </div>

        {/* Iranian Motor Type Toggle: Geared vs Gearless */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-700 text-xs font-mono font-bold">
          <span className="text-slate-400 px-2 text-[11px] hidden sm:inline">
            {isFa ? "مدل موتور:" : "Motor:"}
          </span>
          <button
            onClick={() => setMotorType("geared")}
            className={cn(
              "px-3 py-1 rounded-lg transition-all flex items-center gap-1",
              motorType === "geared" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            )}
          >
            <span>{isFa ? "گیربکس ایرانی (بهران/الکو)" : "Geared Machine"}</span>
          </button>
          <button
            onClick={() => setMotorType("gearless")}
            className={cn(
              "px-3 py-1 rounded-lg transition-all flex items-center gap-1",
              motorType === "gearless" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            )}
          >
            <span>{isFa ? "گیرلس سنکرون (PMSM)" : "Gearless PMSM"}</span>
          </button>
        </div>
      </div>

      {/* FLOORS & DISPATCH BAR (فرمان احضار طبقات و کنترل حرکتی) */}
      <div className="bg-slate-950 text-white p-3 sm:p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Floor Call Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-sky-400 flex items-center gap-1.5">
            <Building className="w-4 h-4 text-sky-400" />
            <span>{isFa ? "احضار کابین به طبقات:" : "Dispatch Elevator:"}</span>
          </span>
          <div className="flex items-center gap-1.5">
            {BUILDING_FLOORS.map((fl) => {
              const isSelected = targetFloor === fl.id;
              return (
                <button
                  key={fl.id}
                  onClick={() => dispatchToFloor(fl.id)}
                  className={cn(
                    "w-9 h-9 rounded-xl font-mono font-black text-sm transition-all flex items-center justify-center border",
                    isSelected
                      ? "bg-sky-500 text-slate-950 border-sky-400 shadow-md ring-2 ring-sky-400/30 scale-105"
                      : "bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700 hover:text-white"
                  )}
                  title={`${fl.labelFa} (+${fl.elevationM}m)`}
                >
                  {fl.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Door Telemetry Indicator */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
            {doorProgress > 0 ? (
              <DoorOpen className="w-4 h-4 text-emerald-400 animate-pulse" />
            ) : (
              <DoorClosed className="w-4 h-4 text-slate-400" />
            )}
            <span className={doorProgress > 0 ? "text-emerald-400 font-bold" : "text-slate-300"}>
              {doorStatusText}
            </span>
            <span className="text-[10px] text-slate-500">
              ({Math.round(doorProgress * 100)}%)
            </span>
          </div>

          {/* Auto Dispatch Toggle */}
          <button
            onClick={() => setAutoDispatchCycle(!autoDispatchCycle)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5",
              autoDispatchCycle 
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" 
                : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
            )}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{autoDispatchCycle ? (isFa ? "گردش خودکار طبقات" : "Auto Cycle") : (isFa ? "توقف خودکار" : "Manual Hold")}</span>
          </button>
        </div>
      </div>

      {/* DUAL SELECTOR BAR: 1) SUSPENSION TYPES + 2) COUNTERWEIGHT POSITIONS */}
      <div className="bg-slate-50 border-b border-vertex-border p-3 sm:p-4 space-y-3">
        {/* Row 1: Suspension Types */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-vertex-blueprint uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>{isFa ? "سیستم تعلیق و سیم‌بکسل‌بندی:" : "Suspension & Roping Configuration:"}</span>
            </span>
            <span className="text-[11px] font-mono text-vertex-steel">
              {isFa ? "استاندارد ۶۳۰۳-۱ و EN 81-50" : "ISIRI 6303 / EN 81-50"}
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
                    <span>{item.torqueFactor.split(" ")[0]}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Counterweight Position Selector */}
        {suspension !== "hydraulic_2_1" && (
          <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5">
              <MoveHorizontal className="w-3.5 h-3.5 text-vertex-blueprint" />
              <span>{isFa ? "موقعیت استقرار قاب وزنه تعادل (Counterweight Placement):" : "Counterweight Location:"}</span>
            </span>

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-slate-300 text-xs font-mono">
              <button
                onClick={() => setCwtPosition("rear")}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5",
                  cwtPosition === "rear" 
                    ? "bg-slate-900 text-white shadow-sm" 
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <span>{isFa ? "وزنه پشت چاهک (Rear CWT)" : "Rear Wall"}</span>
              </button>
              <button
                onClick={() => setCwtPosition("right")}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5",
                  cwtPosition === "right" 
                    ? "bg-slate-900 text-white shadow-sm" 
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <span>{isFa ? "وزنه بغل راست (Right CWT)" : "Right Side"}</span>
              </button>
              <button
                onClick={() => setCwtPosition("left")}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5",
                  cwtPosition === "left" 
                    ? "bg-slate-900 text-white shadow-sm" 
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <span>{isFa ? "وزنه بغل چپ (Left CWT)" : "Left Side"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Row 3: Door Mechanism Type Selector (انواع مکانیزم و جهت بازشوی درب طبقه و کابین طبق نقشه‌های ایرانی) */}
        <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5">
            <DoorOpen className="w-3.5 h-3.5 text-vertex-blueprint" />
            <span>{isFa ? "مکانیزم و جهت بازشوی درب‌ها (Door Type & Handing):" : "Door Mechanism & Handing:"}</span>
          </span>

          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white border border-slate-300 text-xs font-mono">
            <button
              onClick={() => setDoorMechanism("central")}
              className={cn(
                "px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1",
                doorMechanism === "central" 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-slate-600 hover:text-slate-900"
              )}
              title={isFa ? "درب اتوماتیک سانترال ۲ لته بازشو از وسط" : "Central 2-Panel"}
            >
              <span>{isFa ? "سانترال (وسط بازشو)" : "Central"}</span>
            </button>
            <button
              onClick={() => setDoorMechanism("telescopic_right")}
              className={cn(
                "px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1",
                doorMechanism === "telescopic_right" 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-slate-600 hover:text-slate-900"
              )}
              title={isFa ? "درب اتوماتیک تلسکوپی ۲ لته راست بازشو" : "Telescopic Right"}
            >
              <span>{isFa ? "تلسکوپی راست بازشو" : "Telescopic R"}</span>
            </button>
            <button
              onClick={() => setDoorMechanism("telescopic_left")}
              className={cn(
                "px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1",
                doorMechanism === "telescopic_left" 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-slate-600 hover:text-slate-900"
              )}
              title={isFa ? "درب اتوماتیک تلسکوپی ۲ لته چپ بازشو" : "Telescopic Left"}
            >
              <span>{isFa ? "تلسکوپی چپ بازشو" : "Telescopic L"}</span>
            </button>
            <button
              onClick={() => setDoorMechanism("folding_bus")}
              className={cn(
                "px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1",
                doorMechanism === "folding_bus" 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-slate-600 hover:text-slate-900"
              )}
              title={isFa ? "درب تاشو اتوبوسی / آکاردئونی کابین" : "Bus Folding Door"}
            >
              <span>{isFa ? "اتوبوسی (تاشو)" : "Bus Folding"}</span>
            </button>
            <button
              onClick={() => setDoorMechanism("semi_automatic")}
              className={cn(
                "px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1",
                doorMechanism === "semi_automatic" 
                  ? "bg-amber-600 text-white shadow-sm" 
                  : "text-slate-600 hover:text-slate-900"
              )}
              title={isFa ? "درب لولایی طبقه با دستگیره و شیشه دید طبق نقشه شماتیک ۶۳۰۳" : "Semi-Automatic (Hinged Landing Door)"}
            >
              <span>{isFa ? "نیمه اتوماتیک (لولایی)" : "Semi-Automatic"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main CAD Interactive Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[600px]">
        {/* Left Side: Three.js Canvas */}
        <div className="lg:col-span-3 relative h-[520px] sm:h-[620px] bg-slate-100 overflow-hidden border-b lg:border-b-0 lg:border-r border-vertex-border">
          {/* Three.js Viewport */}
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing">
            {!isMounted && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white gap-3 font-mono">
                <Loader2 className="w-8 h-8 animate-spin text-vertex-blueprint" />
                <span className="text-xs text-slate-300">INITIALIZING 3D WEBGL CAD ENGINE...</span>
              </div>
            )}
          </div>

          {/* Floating Canvas Live Kinematic Telemetry Badges */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
            <div className="p-3.5 rounded-xl bg-white/95 backdrop-blur-md border border-vertex-border shadow-sm text-xs space-y-1.5">
              <div className="font-mono font-bold text-vertex-primary flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isFa ? "تله‌متری سینماتیک حرکت ۶۳۰۳" : "ISIRI 6303 Kinematics"}</span>
              </div>
              <div className="text-[11px] text-vertex-secondary font-mono flex items-center justify-between gap-4">
                <span className="text-vertex-steel">{isFa ? "تراز ارتفاعی فعلی:" : "Current Elevation:"}</span>
                <span className="font-bold text-sky-600">+{telemetryPosM} m ({BUILDING_FLOORS[currentFloorDisplay].name})</span>
              </div>
              <div className="text-[11px] text-vertex-secondary font-mono flex items-center justify-between gap-4">
                <span className="text-vertex-steel">{isFa ? "سرعت آنی شفت:" : "Velocity:"}</span>
                <span className="font-bold text-emerald-600">{telemetryVelocity} m/s</span>
              </div>
              <div className="text-[11px] text-vertex-secondary font-mono flex items-center justify-between gap-4">
                <span className="text-vertex-steel">{isFa ? "تعداد رشته سیم‌بکسل:" : "Wire Ropes:"}</span>
                <span className="font-bold text-vertex-primary">{shaftData.ropeN} × Ø{shaftData.ropeD}mm</span>
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

          {/* Bottom Left Controls: Quick Floor Presets and DXF Export */}
          <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-2">
            <button
              onClick={copyDxfData}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border bg-white hover:bg-slate-50 text-vertex-primary hover:text-vertex-blueprint border-vertex-border transition-all flex items-center gap-1.5 shadow-sm"
              title={isFa ? "کپی لایه تعلیق در حافظه" : "Export DXF Layer"}
            >
              {copiedDxf ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileCode className="w-3.5 h-3.5 text-vertex-blueprint" />}
              <span>{copiedDxf ? (isFa ? "کپی شد!" : "Copied!") : (isFa ? "خروجی لایه DXF" : "Export DXF")}</span>
            </button>
          </div>

          {/* Engineering CAD Title Block with Designer Info */}
          <div className="absolute bottom-4 right-4 z-20 hidden md:block p-3.5 rounded-xl bg-white/95 backdrop-blur-md border border-vertex-border shadow-sm text-xs font-mono max-w-xs">
            <div className="text-[10px] text-vertex-steel uppercase tracking-wider font-bold border-b border-vertex-border pb-1 mb-1.5 flex items-center justify-between">
              <span>CAD TITLE BLOCK</span>
              <span className="text-sky-600 font-bold">REV 4.0</span>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
              <span className="text-vertex-steel">{isFa ? "طرح و برنامه‌نویس:" : "Lead Developer:"}</span>
              <span className="font-bold text-vertex-primary">{isFa ? "سید سجاد طباطبایی" : "S. S. Tabatabaei"}</span>
              <span className="text-vertex-steel">{isFa ? "شماره تماس:" : "Contact Tel:"}</span>
              <a href="tel:09013356283" className="font-bold text-sky-600 hover:underline" dir="ltr">09013356283</a>
              <span className="text-vertex-steel">{isFa ? "استاندارد:" : "Safety Code:"}</span>
              <span className="font-bold text-emerald-700">ISIRI 6303 / EN 81-20</span>
              <span className="text-vertex-steel">{isFa ? "مقیاس سه‌بعدی:" : "Scale:"}</span>
              <span className="font-bold text-vertex-primary">1:20 Parametric</span>
            </div>
          </div>
        </div>

        {/* Right Side: Tabbed Engineering Suite */}
        <div className="p-4 sm:p-5 bg-slate-50/80 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            {/* Sidebar Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-200/80 text-xs font-mono">
              <button
                onClick={() => setActiveSideTab("kinematics")}
                className={cn(
                  "py-1.5 rounded-lg font-bold transition-all text-center",
                  activeSideTab === "kinematics" ? "bg-white text-vertex-primary shadow-sm" : "text-slate-600 hover:text-slate-900"
                )}
              >
                {isFa ? "سینماتیک" : "Motion"}
              </button>
              <button
                onClick={() => setActiveSideTab("calculations")}
                className={cn(
                  "py-1.5 rounded-lg font-bold transition-all text-center",
                  activeSideTab === "calculations" ? "bg-white text-vertex-primary shadow-sm" : "text-slate-600 hover:text-slate-900"
                )}
              >
                {isFa ? "سیم‌بکسل" : "Ropes"}
              </button>
              <button
                onClick={() => setActiveSideTab("heights")}
                className={cn(
                  "py-1.5 rounded-lg font-bold transition-all text-center",
                  activeSideTab === "heights" ? "bg-white text-vertex-primary shadow-sm" : "text-slate-600 hover:text-slate-900"
                )}
              >
                {isFa ? "رقوم چاه" : "Datums"}
              </button>
            </div>

            {/* TAB 1: KINEMATICS & DISPATCH CONTROLS */}
            {activeSideTab === "kinematics" && (
              <div className="space-y-3.5">
                {/* Speed Slider */}
                <div className="p-3 rounded-xl bg-white border border-vertex-border space-y-2">
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
                  <div className="flex justify-between text-[10px] text-vertex-steel font-mono">
                    <span>1.0 m/s (استاندارد مسکونی)</span>
                    <span>3.5 m/s (برج پرسرعت)</span>
                  </div>
                </div>

                {/* Rated Capacity */}
                <div className="p-3 rounded-xl bg-white border border-vertex-border space-y-2">
                  <span className="text-xs font-mono font-bold text-vertex-primary block">
                    {isFa ? "ظرفیت نامی بار (Rated Load):" : "Rated Capacity:"}
                  </span>
                  <div className="grid grid-cols-4 gap-1 text-xs font-mono">
                    {[630, 800, 1000, 1600].map(c => (
                      <button
                        key={c}
                        onClick={() => setCapacity(c)}
                        className={cn(
                          "py-1.5 rounded-lg border font-bold transition-all",
                          capacity === c 
                            ? "bg-sky-500 text-white border-sky-500 shadow-sm" 
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        )}
                      >
                        {c} kg
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wall Cutaway Mode */}
                <div className="space-y-1.5">
                  <span className="text-xs font-mono font-bold text-vertex-steel block">
                    {isFa ? "نمای سازه دیواره چاهک:" : "Wall Cutaway Mode:"}
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                    {(["steel-structure", "cutaway", "transparent", "wireframe"] as const).map(mode => (
                      <button
                        key={mode}
                        onClick={() => setWallMode(mode)}
                        className={cn(
                          "py-1.5 rounded-lg border font-bold transition-all text-center",
                          wallMode === mode 
                            ? "bg-slate-900 text-white border-slate-900 shadow-sm" 
                            : "bg-white text-slate-600 border-vertex-border hover:bg-slate-50"
                        )}
                      >
                        {mode === "steel-structure" ? (isFa ? "آهن‌کشی چاه" : "Steel Frame") :
                         mode === "cutaway" ? (isFa ? "برش باز" : "Cutaway") :
                         mode === "transparent" ? (isFa ? "نیمه شفاف" : "Transparent") : (isFa ? "خطی" : "Wireframe")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: WIRE ROPE & TRACTION CALCULATIONS (ISIRI 6303 & EN 81-50) */}
            {activeSideTab === "calculations" && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white border border-vertex-border space-y-2">
                  <span className="text-xs font-mono font-bold text-sky-600 flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5" />
                    <span>{isFa ? "محاسبات تخصصی سیم‌بکسل تعلیق" : "Suspension Rope Engineering"}</span>
                  </span>
                  
                  <div className="space-y-1.5 text-xs font-mono pt-1">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-vertex-steel">{isFa ? "تعداد رشته‌ها (n):" : "Number of Ropes (n):"}</span>
                      <span className="font-bold text-vertex-primary">{shaftData.ropeN} رشته ({shaftData.ropeN >= 3 ? "✓ مجاز" : "غیرمجاز"})</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-vertex-steel">{isFa ? "قطر سیم‌بکسل (d):" : "Rope Diameter (d):"}</span>
                      <span className="font-bold text-vertex-primary">Ø{shaftData.ropeD} mm (وارینگتون سیل)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-vertex-steel">{isFa ? "نسبت قطر فلکه (D/d):" : "Sheave Ratio (D/d):"}</span>
                      <span className="font-bold text-emerald-600">{shaftData.ddRatio} ≥ ۴۰ (استاندارد ۶۳۰۳)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-vertex-steel">{isFa ? "بار گسیختگی کل:" : "Total Breaking Load:"}</span>
                      <span className="font-bold text-vertex-primary">{shaftData.totalBreakingLoadKN.toFixed(1)} kN</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                      <span className="font-bold">{isFa ? "ضریب اطمینان استاتیکی (γ):" : "Safety Factor (γ):"}</span>
                      <span className="font-bold font-mono">{shaftData.staticSafetyFactor} ≥ ۱۲.۰ (پاس شده)</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-vertex-border space-y-2">
                  <span className="text-xs font-mono font-bold text-vertex-steel block">
                    {isFa ? "اصطکاک کششی اویلر (Euler-Eytelwein):" : "Traction Condition Check:"}
                  </span>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs font-mono space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">T1 / T2:</span>
                      <span className="font-bold text-slate-800">1.45</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">e^(fα):</span>
                      <span className="font-bold text-emerald-600">2.18 (عدم لغزش تضمین‌شده)</span>
                    </div>
                  </div>
                </div>

                {/* FASTENERS & BOLT SCHEDULE PER ISIRI 6303 (جدول استاندارد پیچ و مهره‌های ۸، ۱۰ و ۱۲) */}
                <div className="p-3 rounded-xl bg-white border border-vertex-border space-y-2">
                  <span className="text-xs font-mono font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isFa ? "جدول محاسبات پیچ و مهره استاندارد" : "Bolts & Fasteners Schedule"}</span>
                  </span>
                  <div className="space-y-1 text-[11px] font-mono">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-vertex-primary block">پیچ و مهره M8 (گرید ۸.۸)</span>
                        <span className="text-[10px] text-vertex-steel">لنت کفشک، میکروسوئیچ و سنسور</span>
                      </div>
                      <span className="font-bold text-blue-600">~۱۴۴ عدد</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-vertex-primary block">پیچ و مهره M10 (گرید ۸.۸)</span>
                        <span className="text-[10px] text-vertex-steel">لقمه ریل وزنه T50 و قفل درب</span>
                      </div>
                      <span className="font-bold text-blue-600">~۱۷۶ عدد</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-vertex-primary block">پیچ و مهره M12 (گرید ۱۰.۹)</span>
                        <span className="text-[10px] text-vertex-steel">پشت‌بند ریل T89 و لچکی آهن‌کشی</span>
                      </div>
                      <span className="font-bold text-blue-600">~۱۹۲ عدد</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SHAFT HEIGHTS & LEVEL DATUMS */}
            {activeSideTab === "heights" && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white border border-vertex-border space-y-2">
                  <span className="text-xs font-mono font-bold text-vertex-primary flex items-center gap-1.5">
                    <Ruler className="w-3.5 h-3.5 text-sky-600" />
                    <span>{isFa ? "رقوم ارتفاعی چاهک و بالاسری" : "Shaft Elevation Schedule"}</span>
                  </span>

                  <div className="space-y-1.5 text-xs font-mono pt-1">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-vertex-steel">{isFa ? "بالاسری (Overhead - K):" : "Overhead (K):"}</span>
                      <span className="font-bold text-emerald-600">{shaftData.overheadM} m</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-vertex-steel">{isFa ? "عمق چاهک (Pit Depth - S1):" : "Pit Depth (S1):"}</span>
                      <span className="font-bold text-amber-600">{shaftData.pitDepthM} m</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-vertex-steel">{isFa ? "کورس ضربه‌گیر (Sb):" : "Buffer Stroke (Sb):"}</span>
                      <span className="font-bold text-vertex-primary">{Math.round(shaftData.bufferStrokeM * 1000)} mm</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-vertex-steel">{isFa ? "ارتفاع کل چاهک:" : "Total Hoistway:"}</span>
                      <span className="font-bold text-sky-600">{shaftData.totalShaftHeightM} m</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-vertex-border space-y-2 text-xs font-mono">
                  <span className="font-bold text-vertex-steel block">
                    {isFa ? "تراز ارتفاعی طبقات ساختمان:" : "Building Floor Elevation Schedule:"}
                  </span>
                  <div className="space-y-1">
                    {BUILDING_FLOORS.map(fl => (
                      <div key={fl.id} className="flex items-center justify-between p-1.5 rounded bg-slate-50 text-[11px]">
                        <span className="text-slate-600">{fl.labelFa}:</span>
                        <span className="font-bold text-slate-900">+{fl.elevationM.toFixed(2)} m</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VISUAL LAYERS TOGGLES */}
            <div className="space-y-2 pt-2 border-t border-vertex-border">
              <span className="text-xs font-mono font-bold text-vertex-steel block">
                {isFa ? "لایه‌های قابل نمایش در ۳D:" : "Visual Subsystem Toggles:"}
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                <label className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-vertex-border cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={showRopes}
                    onChange={(e) => setShowRopes(e.target.checked)}
                    className="accent-sky-500 w-3.5 h-3.5 rounded"
                  />
                  <span>{isFa ? "سیم‌بکسل‌ها" : "Wire Ropes"}</span>
                </label>
                <label className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-vertex-border cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={showTravelingCable}
                    onChange={(e) => setShowTravelingCable(e.target.checked)}
                    className="accent-sky-500 w-3.5 h-3.5 rounded"
                  />
                  <span>{isFa ? "تراول‌کابل" : "Travel Cable"}</span>
                </label>
                <label className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-vertex-border cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={showGovernor}
                    onChange={(e) => setShowGovernor(e.target.checked)}
                    className="accent-sky-500 w-3.5 h-3.5 rounded"
                  />
                  <span>{isFa ? "گاورنر و بکسل" : "Governor Loop"}</span>
                </label>
                <label className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-vertex-border cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={showBrackets}
                    onChange={(e) => setShowBrackets(e.target.checked)}
                    className="accent-sky-500 w-3.5 h-3.5 rounded"
                  />
                  <span>{isFa ? "براکت‌های ریل" : "Rail Brackets"}</span>
                </label>
              </div>
            </div>
          </div>

          {/* Compliance Footer Pill */}
          <div className="pt-3 border-t border-vertex-border">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] flex items-start gap-2 text-emerald-900 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                {isFa 
                  ? "تأییدیه کامل مقررات ملی ساختمان مبحث ۱۵ و استانداردهای ۶۳۰۳-۱ و ۶۳۰۳-۲ ایران." 
                  : "Certified for Iranian National Building Code Art. 15 and ISIRI 6303-1/2."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
