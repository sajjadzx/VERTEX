"use client";

import React, { useRef, useEffect, useState } from "react";
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
  ArrowUpDown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ThreeCADShaftViewerProps {
  locale: Locale;
}

export function ThreeCADShaftViewer({ locale }: ThreeCADShaftViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isFa = locale === "fa";

  // Configuration state
  const [capacity, setCapacity] = useState<number>(1000); // kg
  const [speed, setSpeed] = useState<number>(2.5); // m/s
  const [carPosition, setCarPosition] = useState<number>(0.5); // 0 (pit) to 1 (overhead)
  const [viewMode, setViewMode] = useState<"3d" | "front" | "top" | "wireframe">("3d");
  const [showRopes, setShowRopes] = useState<boolean>(true);
  const [showRefuge, setShowRefuge] = useState<boolean>(true);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [isAutoMoving, setIsAutoMoving] = useState<boolean>(true);
  const [copiedDxf, setCopiedDxf] = useState<boolean>(false);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carMeshRef = useRef<THREE.Group | null>(null);
  const cwtMeshRef = useRef<THREE.Group | null>(null);
  const ropesMeshRef = useRef<THREE.LineSegments | null>(null);
  const refugeBoxesRef = useRef<THREE.Group | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const prevMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraRotationRef = useRef<{ theta: number; phi: number; radius: number }>({
    theta: 0.8,
    phi: 0.5,
    radius: 28,
  });

  // Calculate dynamic dimensions based on capacity
  const shaftData = {
    450: { sw: 1600, sd: 1600, cw: 1000, cd: 1250, op: 800, ch: 2200, oh: 3800, pd: 1400 },
    630: { sw: 1800, sd: 1800, cw: 1100, cd: 1400, op: 900, ch: 2300, oh: 4000, pd: 1500 },
    800: { sw: 1950, sd: 1950, cw: 1350, cd: 1400, op: 900, ch: 2400, oh: 4200, pd: 1550 },
    1000: { sw: 2100, sd: 2100, cw: 1400, cd: 1600, op: 1000, ch: 2400, oh: 4400, pd: 1650 },
    1275: { sw: 2300, sd: 2300, cw: 1600, cd: 1800, op: 1100, ch: 2500, oh: 4600, pd: 1800 },
    1600: { sw: 2500, sd: 2700, cw: 1400, cd: 2400, op: 1300, ch: 2500, oh: 4800, pd: 2000 },
  }[capacity as 450 | 630 | 800 | 1000 | 1275 | 1600] || {
    sw: 2100, sd: 2100, cw: 1400, cd: 1600, op: 1000, ch: 2400, oh: 4400, pd: 1650
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Setup Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf8fafc); // Clean Architectural Slate

    // 2. Setup Camera
    const width = container.clientWidth;
    const height = container.clientHeight || 520;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;

    // 3. Setup Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(15, 25, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const blueAccentLight = new THREE.PointLight(0x0284c7, 1.5, 40);
    blueAccentLight.position.set(0, 10, 0);
    scene.add(blueAccentLight);

    // 5. Build Structural CAD Elements in 3D
    const shaftHeight = 22; // Represents full rise + overhead + pit
    const shaftWidth = 7;
    const shaftDepth = 7;

    // A) Ground / Foundation Grid
    const gridHelper = new THREE.GridHelper(26, 26, 0x0284c7, 0xcbd5e1);
    gridHelper.position.y = -shaftHeight / 2 - 0.2;
    scene.add(gridHelper);

    // B) Transparent Architectural Concrete Shaft Columns
    const colGeo = new THREE.BoxGeometry(0.5, shaftHeight, 0.5);
    const colMat = new THREE.MeshStandardMaterial({ 
      color: 0x94a3b8, 
      roughness: 0.4,
      metalness: 0.1,
    });
    
    // 4 corner columns
    const halfW = shaftWidth / 2;
    const halfD = shaftDepth / 2;
    const colsPos = [
      [-halfW, 0, -halfD],
      [halfW, 0, -halfD],
      [-halfW, 0, halfD],
      [halfW, 0, halfD],
    ];
    colsPos.forEach(([x, y, z]) => {
      const col = new THREE.Mesh(colGeo, colMat);
      col.position.set(x, y, z);
      scene.add(col);
    });

    // C) Horizontal Steel Ring Beams (کلاف‌کشی و تیرریزی هر ۲ متر)
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.5 });
    for (let y = -shaftHeight / 2 + 3; y < shaftHeight / 2; y += 3) {
      // Rear beam
      const beamR = new THREE.Mesh(new THREE.BoxGeometry(shaftWidth, 0.25, 0.3), ringMat);
      beamR.position.set(0, y, -halfD);
      scene.add(beamR);

      // Left beam
      const beamL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.25, shaftDepth), ringMat);
      beamL.position.set(-halfW, y, 0);
      scene.add(beamL);

      // Right beam
      const beamRight = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.25, shaftDepth), ringMat);
      beamRight.position.set(halfW, y, 0);
      scene.add(beamRight);
    }

    // D) Guide Rails (ریل‌های راهنمای کابین T89 / T125)
    const railMat = new THREE.MeshStandardMaterial({ 
      color: 0x0284c7, // Precision cyan/blue steel
      metalness: 0.8, 
      roughness: 0.2 
    });
    const railGeo = new THREE.BoxGeometry(0.18, shaftHeight - 1, 0.18);

    const railLeft = new THREE.Mesh(railGeo, railMat);
    railLeft.position.set(-halfW + 0.9, 0, 0);
    scene.add(railLeft);

    const railRight = new THREE.Mesh(railGeo, railMat);
    railRight.position.set(halfW - 0.9, 0, 0);
    scene.add(railRight);

    // Counterweight guide rails
    const cwtRailGeo = new THREE.BoxGeometry(0.12, shaftHeight - 1, 0.12);
    const cwtRailMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7 });
    const cwtRailL = new THREE.Mesh(cwtRailGeo, cwtRailMat);
    cwtRailL.position.set(-1.2, 0, -halfD + 0.8);
    scene.add(cwtRailL);

    const cwtRailR = new THREE.Mesh(cwtRailGeo, cwtRailMat);
    cwtRailR.position.set(1.2, 0, -halfD + 0.8);
    scene.add(cwtRailR);

    // E) Landing Doors at 3 levels
    const doorFrameMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6 });
    const doorLeafMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });
    const levels = [-shaftHeight / 2 + 2, 0, shaftHeight / 2 - 4];

    levels.forEach((lvlY, idx) => {
      const doorGroup = new THREE.Group();
      doorGroup.position.set(0, lvlY, halfD);

      const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 3.2, 0.2), doorFrameMat);
      frameL.position.set(-1.4, 0, 0);
      const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.15, 3.2, 0.2), doorFrameMat);
      frameR.position.set(1.4, 0, 0);
      const frameTop = new THREE.Mesh(new THREE.BoxGeometry(2.95, 0.2, 0.2), doorFrameMat);
      frameTop.position.set(0, 1.6, 0);

      // Leaves
      const leafL = new THREE.Mesh(new THREE.BoxGeometry(1.25, 3.0, 0.05), doorLeafMat);
      leafL.position.set(-0.65, 0, 0);
      const leafR = new THREE.Mesh(new THREE.BoxGeometry(1.25, 3.0, 0.05), doorLeafMat);
      leafR.position.set(0.65, 0, 0);

      doorGroup.add(frameL, frameR, frameTop, leafL, leafR);
      scene.add(doorGroup);
    });

    // F) Top Machine Bedplate & Gearless PMSM Motor
    const machineGroup = new THREE.Group();
    machineGroup.position.set(0, shaftHeight / 2 + 0.8, 0);

    const motorGeo = new THREE.CylinderGeometry(1.0, 1.0, 1.8, 32);
    const motorMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 });
    const motor = new THREE.Mesh(motorGeo, motorMat);
    motor.rotation.z = Math.PI / 2;
    machineGroup.add(motor);

    // Traction Sheave
    const sheaveGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 32);
    const sheaveMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.1 });
    const sheave = new THREE.Mesh(sheaveGeo, sheaveMat);
    sheave.rotation.z = Math.PI / 2;
    sheave.position.set(0.8, 0, 0);
    machineGroup.add(sheave);

    scene.add(machineGroup);

    // G) Elevator Car Group (کابین و یوک)
    const carGroup = new THREE.Group();
    carMeshRef.current = carGroup;

    // Car Sling (یوک فولادی کابین)
    const yokeMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7 });
    const yokeTop = new THREE.Mesh(new THREE.BoxGeometry(shaftWidth - 2.2, 0.25, 0.3), yokeMat);
    yokeTop.position.set(0, 2.2, 0);
    const yokeBot = new THREE.Mesh(new THREE.BoxGeometry(shaftWidth - 2.2, 0.35, 0.3), yokeMat);
    yokeBot.position.set(0, -1.9, 0);
    const yokeL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.2, 0.25), yokeMat);
    yokeL.position.set(-(shaftWidth - 2.2) / 2 + 0.1, 0.15, 0);
    const yokeR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.2, 0.25), yokeMat);
    yokeR.position.set((shaftWidth - 2.2) / 2 - 0.1, 0.15, 0);
    carGroup.add(yokeTop, yokeBot, yokeL, yokeR);

    // Cabin Enclosure Body (دیواره‌های کابین)
    const cabinGeo = new THREE.BoxGeometry(3.6, 3.4, 3.8);
    const cabinMat = new THREE.MeshStandardMaterial({ 
      color: 0xffffff, 
      metalness: 0.2, 
      roughness: 0.1,
      transparent: true,
      opacity: 0.92
    });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(0, 0.1, 0);
    carGroup.add(cabin);

    // Interior floor (Italian Marble visual)
    const floorGeo = new THREE.BoxGeometry(3.4, 0.05, 3.6);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.2, metalness: 0.1 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, -1.55, 0);
    carGroup.add(floor);

    // Car top inspection station
    const inspGeo = new THREE.BoxGeometry(0.6, 0.4, 0.4);
    const inspMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.5 });
    const insp = new THREE.Mesh(inspGeo, inspMat);
    insp.position.set(0.8, 1.9, 0.5);
    carGroup.add(insp);

    scene.add(carGroup);

    // H) Counterweight Group (وزنه تعادل)
    const cwtGroup = new THREE.Group();
    cwtMeshRef.current = cwtGroup;

    const cwtFrameGeo = new THREE.BoxGeometry(2.1, 3.6, 0.6);
    const cwtFrameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
    const cwtFrame = new THREE.Mesh(cwtFrameGeo, cwtFrameMat);
    cwtGroup.add(cwtFrame);

    // CWT weights (بلوک‌های چدنی)
    for (let w = -1.4; w <= 1.4; w += 0.5) {
      const block = new THREE.Mesh(
        new THREE.BoxGeometry(1.85, 0.38, 0.5), 
        new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6 })
      );
      block.position.set(0, w, 0);
      cwtGroup.add(block);
    }
    cwtGroup.position.set(0, 0, -halfD + 0.8);
    scene.add(cwtGroup);

    // I) Pit Buffers (ضربه‌گیرهای هیدرولیک کف چاهک)
    const bufferGeo = new THREE.CylinderGeometry(0.3, 0.35, 1.4, 16);
    const bufferMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.7 });
    
    // Car buffer
    const bufCar1 = new THREE.Mesh(bufferGeo, bufferMat);
    bufCar1.position.set(-0.8, -shaftHeight / 2 + 0.7, 0);
    const bufCar2 = new THREE.Mesh(bufferGeo, bufferMat);
    bufCar2.position.set(0.8, -shaftHeight / 2 + 0.7, 0);

    // CWT buffer
    const bufCwt = new THREE.Mesh(bufferGeo, bufferMat);
    bufCwt.position.set(0, -shaftHeight / 2 + 0.7, -halfD + 0.8);
    scene.add(bufCar1, bufCar2, bufCwt);

    // J) Safety Refuge Spaces (مکعب‌های فضای جان‌پناه EN 81-20)
    const refugeGroup = new THREE.Group();
    refugeBoxesRef.current = refugeGroup;

    const refugeGeo = new THREE.BoxGeometry(0.8, 1.2, 0.8);
    const refugeMat = new THREE.MeshBasicMaterial({ 
      color: 0x059669, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.8 
    });
    
    // Car top refuge
    const refTop = new THREE.Mesh(refugeGeo, refugeMat);
    refTop.position.set(-0.6, 2.5, 0);
    carGroup.add(refTop);

    // Pit refuge
    const refPit = new THREE.Mesh(refugeGeo, refugeMat);
    refPit.position.set(1.5, -shaftHeight / 2 + 0.7, 1.2);
    refugeGroup.add(refPit);

    scene.add(refugeGroup);

    // 6. Camera Position & Orbit update function
    const updateCamera = () => {
      if (!cameraRef.current) return;
      const { theta, phi, radius } = cameraRotationRef.current;
      const x = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.cos(phi) * Math.cos(theta);
      cameraRef.current.position.set(x, y, z);
      cameraRef.current.lookAt(0, 0, 0);
    };

    updateCamera();

    // 7. Mouse Orbit Handlers
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevMousePosRef.current.x;
      const deltaY = e.clientY - prevMousePosRef.current.y;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };

      cameraRotationRef.current.theta += deltaX * 0.008;
      cameraRotationRef.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraRotationRef.current.phi - deltaY * 0.008));
      updateCamera();
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraRotationRef.current.radius = Math.max(12, Math.min(48, cameraRotationRef.current.radius + e.deltaY * 0.03));
      updateCamera();
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    domElement.addEventListener("wheel", onWheel, { passive: false });

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Auto cycle elevator movement if enabled
      if (isAutoMoving) {
        const time = clock.getElapsedTime() * 0.5;
        const normalizedPos = (Math.sin(time) + 1) / 2; // 0 to 1
        setCarPosition(normalizedPos);
      }

      // Update positions
      if (carMeshRef.current && cwtMeshRef.current) {
        const travelRange = 14;
        const currentCarY = (carPosition - 0.5) * travelRange;
        carMeshRef.current.position.y = currentCarY;
        // Counterweight moves in opposite direction!
        cwtMeshRef.current.position.y = -currentCarY;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle Window Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 520;
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
  }, [capacity, isAutoMoving]);

  // Update camera preset positions when viewMode changes
  useEffect(() => {
    if (!cameraRef.current) return;
    if (viewMode === "3d") {
      cameraRotationRef.current = { theta: 0.8, phi: 0.5, radius: 28 };
    } else if (viewMode === "front") {
      cameraRotationRef.current = { theta: 0, phi: Math.PI / 2, radius: 26 };
    } else if (viewMode === "top") {
      cameraRotationRef.current = { theta: 0, phi: 0.05, radius: 24 };
    }
    const { theta, phi, radius } = cameraRotationRef.current;
    const x = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.cos(phi) * Math.cos(theta);
    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(0, 0, 0);
  }, [viewMode]);

  // Update refuge visibility
  useEffect(() => {
    if (refugeBoxesRef.current) {
      refugeBoxesRef.current.visible = showRefuge;
    }
  }, [showRefuge]);

  const copyDxfData = () => {
    const dxfSample = `0\nSECTION\n2\nENTITIES\n0\nLINE\n8\nSHAFT_WALLS\n10\n0.0\n20\n0.0\n11\n${shaftData.sw}\n21\n0.0\n0\nLINE\n10\n${shaftData.sw}\n20\n0.0\n11\n${shaftData.sw}\n21\n${shaftData.sd}\n0\nENDSEC\n0\nEOF`;
    navigator.clipboard.writeText(dxfSample);
    setCopiedDxf(true);
    setTimeout(() => setCopiedDxf(false), 2500);
  };

  return (
    <div className="rounded-2xl border border-vertex-border bg-white shadow-card overflow-hidden">
      {/* CAD Studio Top Bar */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-vertex-blueprint flex items-center justify-center text-white shadow-sm">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold font-mono text-white">
                VERTEX CAD SHAFT 3D STUDIO
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                EN 81-20/50 LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isFa ? "موتور سه‌بعدی وکتوری بررسی ابعاد، ریل‌ها، بالاسری و چاهک بر اساس استانداردهای بین‌المللی" : "Interactive 3D WebGL shaft kinematics, guide rails, and refuge safety clearances"}
            </p>
          </div>
        </div>

        {/* View mode buttons */}
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
            <span>{isFa ? "برش مقطع" : "Section Cut"}</span>
          </button>
          <button
            onClick={() => setViewMode("top")}
            className={cn(
              "px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5",
              viewMode === "top" ? "bg-vertex-blueprint text-white shadow-sm" : "text-slate-300 hover:text-white"
            )}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>{isFa ? "پلان از بالا" : "Plan View"}</span>
          </button>
        </div>
      </div>

      {/* Main CAD Interactive Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[540px]">
        {/* Left Side: Three.js Canvas */}
        <div className="lg:col-span-3 relative h-[480px] sm:h-[540px] bg-cad-paper overflow-hidden border-b lg:border-b-0 lg:border-r border-vertex-border">
          {/* Three.js viewport */}
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Floating Canvas Overlay Badges */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
            <div className="p-3 rounded-xl bg-white/95 backdrop-blur-md border border-vertex-border shadow-sm text-xs space-y-1">
              <div className="font-mono font-bold text-vertex-primary flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isFa ? "وضعیت محاسباتی زنده" : "Kinematics Telemetry"}</span>
              </div>
              <div className="text-[11px] text-vertex-secondary font-mono">
                {isFa ? `موقعیت کابین: ${Math.round(carPosition * 100)}% ارتفاع` : `Car Elevation: ${Math.round(carPosition * 100)}%`}
              </div>
              <div className="text-[11px] text-vertex-steel font-mono">
                {isFa ? `عرض چاه: ${shaftData.sw}mm | عمق: ${shaftData.sd}mm` : `Shaft: ${shaftData.sw} x ${shaftData.sd} mm`}
              </div>
            </div>
          </div>

          {/* Architectural Drawing Title Block (مهر و تابلوی مشخصات نقشه مهندسی) */}
          <div className="absolute bottom-4 right-4 z-20 hidden sm:block p-3.5 rounded-xl bg-white/95 backdrop-blur-md border border-vertex-border shadow-sm text-xs font-mono max-w-xs">
            <div className="text-[10px] text-vertex-steel uppercase tracking-wider font-bold border-b border-vertex-border pb-1 mb-1.5 flex items-center justify-between">
              <span>CAD TITLE BLOCK</span>
              <span className="text-vertex-blueprint font-bold">REV 2.4</span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
              <span className="text-vertex-steel">{isFa ? "استاندارد:" : "Code:"}</span>
              <span className="font-bold text-vertex-primary">EN 81-20/50</span>
              <span className="text-vertex-steel">{isFa ? "مقررات ملی:" : "Standard:"}</span>
              <span className="font-bold text-vertex-primary">{isFa ? "مبحث ۱۵ ایران" : "INBC Art. 15"}</span>
              <span className="text-vertex-steel">{isFa ? "مقیاس:" : "Scale:"}</span>
              <span className="font-bold text-vertex-blueprint">1:20 / 1:50</span>
              <span className="text-vertex-steel">{isFa ? "شماره شیت:" : "Drawing ID:"}</span>
              <span className="font-bold text-vertex-primary">DWG-VTX-01</span>
            </div>
          </div>

          {/* Motion Controls Over Canvas */}
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
            <button
              onClick={() => setIsAutoMoving(!isAutoMoving)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 shadow-sm",
                isAutoMoving 
                  ? "bg-vertex-blueprint text-white border-vertex-blueprint"
                  : "bg-white text-vertex-primary hover:text-vertex-blueprint border-vertex-border"
              )}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{isAutoMoving ? (isFa ? "توقف چرخه حرکت" : "Pause Motion") : (isFa ? "حرکت خودکار کابین" : "Auto Cycle")}</span>
            </button>
            <button
              onClick={copyDxfData}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-white hover:bg-slate-50 text-vertex-primary hover:text-vertex-blueprint border-vertex-border transition-all flex items-center gap-1.5 shadow-sm"
              title={isFa ? "کپی اطلاعات وکتوری DXF" : "Copy DXF ASCII Entities"}
            >
              {copiedDxf ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileCode className="w-3.5 h-3.5 text-vertex-blueprint" />}
              <span>{copiedDxf ? (isFa ? "کپی شد!" : "Copied!") : (isFa ? "خروجی DXF" : "Export DXF")}</span>
            </button>
          </div>
        </div>

        {/* Right Side: CAD Controls & Engineering Tolerances */}
        <div className="p-5 sm:p-6 bg-slate-50/60 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div>
              <span className="text-xs font-mono font-bold text-vertex-blueprint uppercase tracking-wider block">
                {isFa ? "تنظیمات ابعادی چاه" : "Parametric Shaft Controls"}
              </span>
              <h4 className="text-base font-black text-vertex-primary mt-1">
                {isFa ? "گزینش ظرفیت و دیمانسیون" : "Rated Capacity & Sizing"}
              </h4>
            </div>

            {/* Capacity buttons */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-vertex-secondary flex items-center justify-between">
                <span>{isFa ? "ظرفیت نامی مسافر (کیلوگرم):" : "Rated Load (kg):"}</span>
                <span className="font-mono text-vertex-blueprint font-black">{capacity} kg</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                {[450, 630, 800, 1000, 1275, 1600].map((cap) => (
                  <button
                    key={cap}
                    onClick={() => setCapacity(cap)}
                    className={cn(
                      "py-2 rounded-lg font-bold border transition-all text-center",
                      capacity === cap
                        ? "bg-vertex-blueprint text-white border-vertex-blueprint shadow-sm"
                        : "bg-white hover:bg-slate-100 text-vertex-secondary border-vertex-border"
                    )}
                  >
                    {cap} kg
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Car Position Slider (if paused) */}
            {!isAutoMoving && (
              <div className="space-y-1.5 p-3 rounded-xl bg-white border border-vertex-border">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-vertex-steel">{isFa ? "ارتفاع دستی کابین:" : "Manual Position:"}</span>
                  <span className="font-bold text-vertex-blueprint">{Math.round(carPosition * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={carPosition}
                  onChange={(e) => setCarPosition(parseFloat(e.target.value))}
                  className="w-full accent-vertex-blueprint cursor-pointer"
                />
              </div>
            )}

            {/* Dimension Callouts Table */}
            <div className="space-y-2 pt-2 border-t border-vertex-border">
              <span className="text-xs font-mono font-bold text-vertex-steel block">
                {isFa ? "جدول اندازه‌های اجرایی (میلی‌متر):" : "As-Built Dimensional Table (mm):"}
              </span>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-vertex-border">
                  <span className="text-vertex-steel">{isFa ? "عرض چاه (SW):" : "Shaft Width (SW):"}</span>
                  <span className="font-bold text-vertex-primary">{shaftData.sw} mm</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-vertex-border">
                  <span className="text-vertex-steel">{isFa ? "عمق چاه (SD):" : "Shaft Depth (SD):"}</span>
                  <span className="font-bold text-vertex-primary">{shaftData.sd} mm</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-vertex-border">
                  <span className="text-vertex-steel">{isFa ? "کابین (CW × CD):" : "Cabin (CW x CD):"}</span>
                  <span className="font-bold text-vertex-blueprint">{shaftData.cw} × {shaftData.cd}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-vertex-border">
                  <span className="text-vertex-steel">{isFa ? "بالاسری (Overhead):" : "Overhead (OH):"}</span>
                  <span className="font-bold text-vertex-primary">{shaftData.oh} mm</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-vertex-border">
                  <span className="text-vertex-steel">{isFa ? "عمق چاهک (Pit):" : "Pit Depth (PD):"}</span>
                  <span className="font-bold text-vertex-primary">{shaftData.pd} mm</span>
                </div>
              </div>
            </div>

            {/* Layer toggles */}
            <div className="space-y-2 pt-2 border-t border-vertex-border">
              <span className="text-xs font-mono font-bold text-vertex-steel block">
                {isFa ? "لایه‌های مهندسی (CAD Layers):" : "CAD Engineering Layers:"}
              </span>
              <div className="flex items-center justify-between text-xs font-medium">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showRefuge}
                    onChange={(e) => setShowRefuge(e.target.checked)}
                    className="accent-vertex-blueprint w-4 h-4 rounded"
                  />
                  <span>{isFa ? "فضای جان‌پناه (EN 81-20 Refuge)" : "Refuge Cubes (EN 81-20)"}</span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-vertex-border">
            <div className="p-3 rounded-xl bg-vertex-blueprint/5 border border-vertex-blueprint/20 text-xs flex items-start gap-2 text-vertex-blueprint font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                {isFa 
                  ? "تأییدیه ضخامت دیواره بتنی ۲۰cm و فواصل انکر ریل‌ها هر ۲۵۰۰mm مطابق مقررات ملی ایران." 
                  : "Verified for 200mm RC shaft walls and 2500mm rail bracket intervals."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
