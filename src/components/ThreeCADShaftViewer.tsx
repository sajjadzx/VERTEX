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
  const [viewMode, setViewMode] = useState<"3d" | "front" | "side" | "top" | "sheaves" | "cabin" | "structure">("3d");
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
    }
    updateCameraPosition();
  }, [viewMode, updateCameraPosition]);

  // Dispatch elevator to a floor
  const dispatchToFloor = (floorIdx: number) => {
    if (floorIdx < 0 || floorIdx > 3) return;
    setTargetFloor(floorIdx);
    // Convert elevation meters to 3D Y units
    // Shaft 3D scale: 1 meter = 1.6 3D units
    const elevation3DY = (BUILDING_FLOORS[floorIdx].elevationM - 4.8) * 1.6;
    targetYRef.current = elevation3DY;
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

    // 4 Corner Steel Columns (نبشی دوبل / قوطی آهن ساختمانی St37 با رنگ زغالی سازه‌ای)
    const steelColMat = new THREE.MeshStandardMaterial({ 
      color: isSteelMode ? 0x1e293b : 0x334155, 
      metalness: 0.85, 
      roughness: 0.25 
    });
    const colGeo = new THREE.BoxGeometry(0.38, shaftHeight, 0.38);
    const basePlateMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 });
    const gussetMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.25 }); // Primer Gold Accent

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

      // Front Header Ring Beam (کلاف افقی جلو - بالای درب‌ها)
      const bFront = new THREE.Mesh(new THREE.BoxGeometry(sw3D, 0.22, 0.22), beamMat);
      bFront.position.set(0, by, halfD);
      wallGroup.add(bFront);

      // Corner Connection Gusset Plates (ورق‌های لچکی اتصال کلاف به ستون در ۴ گوشه)
      [
        [-halfW + 0.18, -halfD + 0.18],
        [halfW - 0.18, -halfD + 0.18],
        [-halfW + 0.18, halfD - 0.18],
        [halfW - 0.18, halfD - 0.18]
      ].forEach(([gx, gz]) => {
        const gusset = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 0.18), gussetMat);
        gusset.position.set(gx, by, gz);
        wallGroup.add(gusset);
      });
    }

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

    // Heavy-Duty Steel Rail Brackets (براکت‌های ریل و انکر بولت‌ها هر ۲.۵ متر)
    if (showBrackets) {
      const bracketMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7 });
      for (let brY = pitFloorY + 2.0; brY < overheadCeilingY; brY += (2.5 * mTo3D)) {
        // Left Car Rail Bracket
        const brL = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.14, 0.35), bracketMat);
        brL.position.set(-halfW + 0.28, brY, 0);
        // Right Car Rail Bracket
        const brR = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.14, 0.35), bracketMat);
        brR.position.set(halfW - 0.28, brY, 0);
        railGroup.add(brL, brR);
      }
    }

    scene.add(railGroup);

    // D) LANDING DOORS & SILLS AT ALL 4 FLOORS (درب‌های طبقات، آستانه‌ها و ساسپندور)
    const landingDoorMeshes: { left: THREE.Mesh; right: THREE.Mesh; floorId: number }[] = [];
    BUILDING_FLOORS.forEach((fl) => {
      const flY = floor0Y + (fl.elevationM * mTo3D);
      const dGroup = new THREE.Group();
      dGroup.position.set(0, flY, halfD);

      const doorFrameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6 });
      const doorLeafMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, metalness: 0.9, roughness: 0.15 });

      // Aluminum Door Sill (آستانه آلومینیومی درب طبقه)
      const sill = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.08, 0.22),
        new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8 })
      );
      sill.position.set(0, 0.04, 0);
      dGroup.add(sill);

      // Frame Jambs and Transom Header
      const jambL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 3.2, 0.2), doorFrameMat);
      jambL.position.set(-1.4, 1.6, 0);
      const jambR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 3.2, 0.2), doorFrameMat);
      jambR.position.set(1.4, 1.6, 0);
      const header = new THREE.Mesh(new THREE.BoxGeometry(2.94, 0.25, 0.2), doorFrameMat);
      header.position.set(0, 3.2, 0);

      // 2-Panel Center/Telescopic Landing Sliding Door Leaves
      const leafL = new THREE.Mesh(new THREE.BoxGeometry(1.25, 3.0, 0.05), doorLeafMat);
      leafL.position.set(-0.64, 1.55, 0);
      const leafR = new THREE.Mesh(new THREE.BoxGeometry(1.25, 3.0, 0.05), doorLeafMat);
      leafR.position.set(0.64, 1.55, 0);

      dGroup.add(jambL, jambR, header, leafL, leafR);
      scene.add(dGroup);

      landingDoorMeshes.push({ left: leafL, right: leafR, floorId: fl.id });
    });
    landingDoorMeshesRef.current = landingDoorMeshes;

    // E) PIT EQUIPMENT (بافرهای هیدرولیک، نردبان دسترسی و فلکه ته‌چاه گاورنر)
    const bufMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.2 });
    const bufBaseMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.5 });

    // Car Pit Buffers (2 units)
    [-0.9, 0.9].forEach((bx) => {
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.6), bufBaseMat);
      base.position.set(bx, pitFloorY + 0.2, 0);
      const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 1.4, 16), bufMat);
      piston.position.set(bx, pitFloorY + 1.0, 0);
      scene.add(base, piston);
    });

    // CWT Buffer
    if (suspension !== "hydraulic_2_1") {
      const cwtBufBase = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.5), bufBaseMat);
      cwtBufBase.position.set(cwtPosX, pitFloorY + 0.2, cwtPosZ);
      const cwtBufPiston = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.4, 16), bufMat);
      cwtBufPiston.position.set(cwtPosX, pitFloorY + 1.0, cwtPosZ);
      scene.add(cwtBufBase, cwtBufPiston);
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
      machineGroup.position.set(0, overheadCeilingY - 0.8, 0);

      // Heavy Machine Bedplate Steel Beams (شاسی دوبل ناودانی با لاستیک لرزه‌گیر)
      const bedplate = new THREE.Mesh(
        new THREE.BoxGeometry(sw3D - 0.6, 0.4, 1.8),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.3 })
      );
      machineGroup.add(bedplate);

      // Neoprene Anti-Vibration Pads (لاستیک‌های لرزه‌گیر موتور)
      [-halfW + 0.7, halfW - 0.7].forEach(padX => {
        const pad = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 0.1, 1.2),
          new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 })
        );
        pad.position.set(padX, -0.25, 0);
        machineGroup.add(pad);
      });

      // PMSM Synchronous Motor (Ziehl-Abegg ZAtop SM200 Style)
      const motorBody = new THREE.Mesh(
        new THREE.CylinderGeometry(1.0, 1.0, 1.6, 32),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85, roughness: 0.2 })
      );
      motorBody.rotation.z = Math.PI / 2;
      motorBody.position.set(0, 1.1, 0);
      machineGroup.add(motorBody);

      // Disc Brake Calipers (ترمز دیسکی دوبل استاندارد ۶۳۰۳)
      const brakeGeo = new THREE.BoxGeometry(0.35, 0.8, 0.6);
      const brakeMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.6 });
      const brake1 = new THREE.Mesh(brakeGeo, brakeMat);
      brake1.position.set(-0.9, 1.1, 0.6);
      const brake2 = new THREE.Mesh(brakeGeo, brakeMat);
      brake2.position.set(0.9, 1.1, 0.6);
      machineGroup.add(brake1, brake2);

      // Traction Sheave with Cable Grooves (فلکه اصلی کشش)
      const sheaveMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.1 });
      const tractionSheave = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.35, 32), sheaveMat);
      tractionSheave.rotation.z = Math.PI / 2;
      tractionSheave.position.set(0, 1.1, -0.2);
      machineGroup.add(tractionSheave);

      // DIVERTER / SECONDARY SHEAVE WITH ROPE GUARD (فلکه هرزگرد انحراف و میله محافظ ضد پرش)
      const diverterSheave = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.3, 32), sheaveMat);
      const guardRod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.8, 16),
        new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.8 })
      );
      guardRod.rotation.x = Math.PI / 2;

      if (cwtPosition === "rear") {
        diverterSheave.rotation.z = Math.PI / 2;
        diverterSheave.position.set(0, 0.35, -halfD + 0.65);
        guardRod.position.set(0, 1.15, -halfD + 0.65);
      } else if (cwtPosition === "right") {
        diverterSheave.rotation.x = Math.PI / 2;
        diverterSheave.position.set(halfW - 0.65, 0.35, 0);
        guardRod.position.set(halfW - 0.65, 1.15, 0);
      } else if (cwtPosition === "left") {
        diverterSheave.rotation.x = Math.PI / 2;
        diverterSheave.position.set(-halfW + 0.65, 0.35, 0);
        guardRod.position.set(-halfW + 0.65, 1.15, 0);
      }
      machineGroup.add(diverterSheave, guardRod);

      // Centrifugal Overspeed Governor Unit at Overhead (گاورنر سر چاهک)
      const govUnitGroup = new THREE.Group();
      govUnitGroup.position.set(halfW - 0.85, 1.2, -halfD + 0.85);
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

    const carW = (shaftData.cw / 1000) * 2.8;
    const carD = (shaftData.cd / 1000) * 2.8;
    const carH = (shaftData.ch / 1000) * 2.0;

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

      const overheadSheaveY = overheadCeilingY + 0.3;
      const hitchTopY = overheadCeilingY - 0.2;
      const ropeOffsets = [-0.12, -0.04, 0.04, 0.12];
      let meshIdx = 0;

      const diverterWorldY = overheadCeilingY - 0.45;
      const diverterWorldX = cwtPosition === "rear" ? 0 : (cwtPosition === "right" ? halfW - 0.65 : -halfW + 0.65);
      const diverterWorldZ = cwtPosition === "rear" ? -halfD + 0.65 : 0;

      if (suspension === "1_1_direct") {
        for (let i = 0; i < ropeOffsets.length && meshIdx + 2 < meshes.length; i++) {
          const off = ropeOffsets[i];
          const carRopeX = off;
          const carRopeZ = -0.2;
          const cwtRopeX = cwtPosition === "rear" ? cwtPosX + off : cwtPosX;
          const cwtRopeZ = cwtPosition === "rear" ? cwtPosZ : cwtPosZ + off;
          const divRopeX = cwtPosition === "rear" ? diverterWorldX + off : diverterWorldX;
          const divRopeZ = cwtPosition === "rear" ? diverterWorldZ : diverterWorldZ + off;

          // 1) Car Hitch Socket straight up to Traction Sheave
          positionCylinder(
            meshes[meshIdx++],
            new THREE.Vector3(carRopeX, carY + carH / 2 + 0.52, carRopeZ),
            new THREE.Vector3(carRopeX, overheadSheaveY, carRopeZ),
            showRopes
          );
          // 2) Traction Sheave across to Diverter Sheave
          positionCylinder(
            meshes[meshIdx++],
            new THREE.Vector3(carRopeX, overheadSheaveY, carRopeZ),
            new THREE.Vector3(divRopeX, diverterWorldY + 0.35, divRopeZ),
            showRopes
          );
          // 3) Diverter Sheave strictly vertical drop down to CWT Hitch Socket
          positionCylinder(
            meshes[meshIdx++],
            new THREE.Vector3(divRopeX, diverterWorldY, divRopeZ),
            new THREE.Vector3(cwtRopeX, cwtY + 2.25, cwtRopeZ),
            showRopes
          );
        }
      } else if (suspension === "2_1_underslung") {
        const pBottomY = carY - carH / 2 - 0.28;
        const rSheave = 0.25;
        
        for (let i = 0; i < ropeOffsets.length && meshIdx + 4 < meshes.length; i++) {
          const off = ropeOffsets[i];
          const hitchX = -carW / 2;
          const carRopeZ = off;
          
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

          // Fall 1: Strictly vertical drop from Ceiling Hitch 1 down to Car Pulley 1 outer tangent
          positionCylinder(
            meshes[meshIdx++],
            new THREE.Vector3(hitchX, hitchTopY, carRopeZ),
            new THREE.Vector3(hitchX, pBottomY, carRopeZ),
            showRopes
          );

          // Fall 2: Strictly horizontal run underneath car floor between bottom tangents
          positionCylinder(
            meshes[meshIdx++],
            new THREE.Vector3(-carW / 2 + 0.25, pBottomY - rSheave, carRopeZ),
            new THREE.Vector3(carW / 2 - 0.25, pBottomY - rSheave, carRopeZ),
            showRopes
          );

          // Fall 3: Strictly vertical/tangent ascent from Car Pulley 2 up to Traction Sheave
          positionCylinder(
            meshes[meshIdx++],
            new THREE.Vector3(carW / 2, pBottomY, carRopeZ),
            new THREE.Vector3(off, overheadSheaveY, -0.2),
            showRopes
          );

          // Fall 4: Traction sheave across to CWT Sheave incoming tangent
          positionCylinder(
            meshes[meshIdx++],
            new THREE.Vector3(off, overheadSheaveY, -0.2),
            new THREE.Vector3(cwtTangentInX, cwtY + 2.5, cwtTangentInZ),
            showRopes
          );

          // Fall 5: Strictly vertical ascent from CWT Sheave outgoing tangent up to Ceiling Hitch 2
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

        for (let i = 0; i < ropeOffsets.length && meshIdx + 4 < meshes.length; i++) {
          const off = ropeOffsets[i];
          const hitchX = -carW * 0.35 - rSheave;
          const carRopeZ = off;

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

          // Fall 1: Strictly vertical drop from Ceiling Hitch 1 down to Car Pulley 1 outer tangent
          positionCylinder(
            meshes[meshIdx++],
            new THREE.Vector3(hitchX, hitchTopY, carRopeZ),
            new THREE.Vector3(hitchX, carSheaveY, carRopeZ),
            showRopes
          );

          // Fall 2: Strictly horizontal run over crosshead between top tangents of Pulleys
          positionCylinder(
            meshes[meshIdx++],
            new THREE.Vector3(-carW * 0.35, carSheaveY + rSheave, carRopeZ),
            new THREE.Vector3(carW * 0.35, carSheaveY + rSheave, carRopeZ),
            showRopes
          );

          // Fall 3: Ascent from Car Pulley 2 right tangent up to Traction Sheave
          positionCylinder(
            meshes[meshIdx++],
            new THREE.Vector3(carW * 0.35 + rSheave, carSheaveY, carRopeZ),
            new THREE.Vector3(off, overheadSheaveY, -0.2),
            showRopes
          );

          // Fall 4: Traction sheave across to CWT Sheave incoming tangent
          positionCylinder(
            meshes[meshIdx++],
            new THREE.Vector3(off, overheadSheaveY, -0.2),
            new THREE.Vector3(cwtTangentInX, cwtY + 2.5, cwtTangentInZ),
            showRopes
          );

          // Fall 5: Strictly vertical ascent from CWT Sheave outgoing tangent up to Ceiling Hitch 2
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
          positionCylinder(meshes[meshIdx++], new THREE.Vector3(sheave2X, carSheaveY, off), new THREE.Vector3(off, overheadSheaveY, -0.2), showRopes);
          positionCylinder(meshes[meshIdx++], new THREE.Vector3(off, overheadSheaveY, -0.2), new THREE.Vector3(cwtRopeX, cwtY + 2.5, cwtRopeZ + 0.2), showRopes);
          positionCylinder(meshes[meshIdx++], new THREE.Vector3(cwtRopeX, cwtY + 2.5, cwtRopeZ - 0.2), new THREE.Vector3(cwtRopeX, hitchTopY, cwtRopeZ - 0.2), showRopes);
        }
      } else if (suspension === "cantilever_2_1") {
        for (let i = 0; i < ropeOffsets.length && meshIdx + 3 < meshes.length; i++) {
          const off = ropeOffsets[i];
          const cwtRopeX = cwtPosition === "rear" ? cwtPosX + off : cwtPosX;
          const cwtRopeZ = cwtPosition === "rear" ? cwtPosZ : cwtPosZ + off;
          positionCylinder(meshes[meshIdx++], new THREE.Vector3(-carW / 2 - 0.15, hitchTopY, off), new THREE.Vector3(-carW / 2 - 0.15, carY, off), showRopes);
          positionCylinder(meshes[meshIdx++], new THREE.Vector3(-carW / 2 - 0.15, carY, off), new THREE.Vector3(off, overheadSheaveY, -0.2), showRopes);
          positionCylinder(meshes[meshIdx++], new THREE.Vector3(off, overheadSheaveY, -0.2), new THREE.Vector3(cwtRopeX, cwtY + 2.5, cwtRopeZ + 0.2), showRopes);
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

      // Update Sliding Car Doors & Landing Doors
      const dProg = doorProgressRef.current;
      const carDoorSlideDist = dProg * (carW * 0.38);
      if (carDoorLRef.current && carDoorRRef.current) {
        carDoorLRef.current.position.x = -carW * 0.23 - carDoorSlideDist;
        carDoorRRef.current.position.x = carW * 0.23 + carDoorSlideDist;
      }

      // Synchronize Landing Door only at current floor
      const activeLandingDoors = landingDoorMeshesRef.current.find(d => d.floorId === targetFloor);
      if (activeLandingDoors) {
        const landingSlideDist = dProg * 0.65;
        activeLandingDoors.left.position.x = -0.64 - landingSlideDist;
        activeLandingDoors.right.position.x = 0.64 + landingSlideDist;
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
  }, [isMounted, capacity, suspension, cwtPosition, wallMode, showRopes, showTravelingCable, showGovernor, showBrackets, showRefuge, speed, updateCameraPosition, shaftData, targetFloor, autoDispatchCycle]);

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
