"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { 
  RotateCw, 
  Eye, 
  Maximize2, 
  Compass, 
  Layers, 
  Sparkles,
  Volume2
} from "lucide-react";

export interface CabinVisualProps {
  wall: {
    id: string;
    nameFa: string;
    nameEn: string;
    color: string;
    accent: string;
    type: string;
    vein: string;
  };
  floor: {
    id: string;
    nameFa: string;
    nameEn: string;
    color: string;
    accent: string;
    weight: string;
  };
  ceiling: {
    id: string;
    nameFa: string;
    nameEn: string;
    type: string;
  };
  lighting: {
    id: string;
    nameFa: string;
    nameEn: string;
    hex: string;
  };
  cop: {
    id: string;
    nameFa: string;
    nameEn: string;
  };
  currentFloor: number;
  locale: "fa" | "en";
}

export function ThreeCabinStudioViewer({
  wall,
  floor,
  ceiling,
  lighting,
  cop,
  currentFloor,
  locale,
}: CabinVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const [cameraMode, setCameraMode] = useState<"isometric" | "interior" | "top">("isometric");
  const [autoRotate, setAutoRotate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Orbit angles
  const orbitRef = useRef({
    theta: 0.35,
    phi: 1.15,
    radius: 4.8,
    target: new THREE.Vector3(0, 0, 0),
  });

  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });

  // Mesh refs for real-time dynamic material swapping
  const wallMeshGroupRef = useRef<THREE.Group | null>(null);
  const floorMeshRef = useRef<THREE.Mesh | null>(null);
  const ceilingGroupRef = useRef<THREE.Group | null>(null);
  const interiorLightRef = useRef<THREE.PointLight | null>(null);
  const ceilingSpotlightsRef = useRef<THREE.SpotLight[]>([]);
  const copDisplayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const copDisplayTextureRef = useRef<THREE.CanvasTexture | null>(null);

  const isFa = locale === "fa";

  // ---------------------------------------------------------------------------
  // 1. Initialize Scene, Camera, WebGLRenderer & Orbit
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 480;

    // SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0f172a); // dark blueprint slate background

    // CAMERA
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    cameraRef.current = camera;

    const updateCameraPos = () => {
      const { theta, phi, radius, target } = orbitRef.current;
      const x = target.x + radius * Math.sin(phi) * Math.sin(theta);
      const y = target.y + radius * Math.cos(phi);
      const z = target.z + radius * Math.sin(phi) * Math.cos(theta);
      camera.position.set(x, y, z);
      camera.lookAt(target);
    };
    updateCameraPos();

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // STUDIO LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 8, 6);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const softFillLight = new THREE.DirectionalLight(0x38bdf8, 0.4);
    softFillLight.position.set(-6, 3, -4);
    scene.add(softFillLight);

    // Floor Base Studio Stage
    const stageGeo = new THREE.CylinderGeometry(3.8, 4.0, 0.2, 48);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.3,
      roughness: 0.7,
    });
    const stage = new THREE.Mesh(stageGeo, stageMat);
    stage.position.y = -1.35;
    stage.receiveShadow = true;
    scene.add(stage);

    const grid = new THREE.GridHelper(8, 16, 0x0284c7, 0x334155);
    grid.position.y = -1.24;
    scene.add(grid);

    // -------------------------------------------------------------------------
    // 2. Build 3D Cabin Interior Model
    // -------------------------------------------------------------------------
    // Cabin dimensions in Three.js (width: 1.8, depth: 1.8, height: 2.3)
    const cw = 1.8;
    const cd = 1.8;
    const ch = 2.3;
    const halfW = cw / 2;
    const halfD = cd / 2;

    const cabinGroup = new THREE.Group();
    scene.add(cabinGroup);

    // A) Outer Structural Enclosure (Sling / Yoke / Car Top)
    const slingMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.4 });
    const slingBeamGeo = new THREE.BoxGeometry(cw + 0.3, 0.16, 0.2);
    
    // Upper crosshead beam
    const topBeam = new THREE.Mesh(slingBeamGeo, slingMat);
    topBeam.position.set(0, ch / 2 + 0.14, 0);
    topBeam.castShadow = true;
    cabinGroup.add(topBeam);

    // Lower plank beam
    const btmBeam = new THREE.Mesh(slingBeamGeo, slingMat);
    btmBeam.position.set(0, -ch / 2 - 0.14, 0);
    cabinGroup.add(btmBeam);

    // Safety balustrade railing on car top
    const balustradeGroup = new THREE.Group();
    const railMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.5, roughness: 0.4 }); // Safety yellow
    const railGeo = new THREE.BoxGeometry(cw, 0.04, 0.04);
    const railPostGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.65, 12);
    
    // Top railing
    const topRail = new THREE.Mesh(railGeo, railMat);
    topRail.position.set(0, ch / 2 + 0.75, -halfD);
    balustradeGroup.add(topRail);

    // Stanchion posts
    [-halfW * 0.9, 0, halfW * 0.9].forEach((px) => {
      const post = new THREE.Mesh(railPostGeo, railMat);
      post.position.set(px, ch / 2 + 0.45, -halfD);
      balustradeGroup.add(post);
    });
    cabinGroup.add(balustradeGroup);

    // Car Top Yellow Inspection Station
    const inspBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.16, 0.16),
      new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.3 })
    );
    inspBox.position.set(halfW * 0.55, ch / 2 + 0.15, -halfD * 0.4);
    cabinGroup.add(inspBox);

    // Red E-Stop Mushroom Button
    const estopBtn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.04, 0.05, 16),
      new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.2 })
    );
    estopBtn.position.set(halfW * 0.55, ch / 2 + 0.26, -halfD * 0.4);
    cabinGroup.add(estopBtn);

    // Under-car Toe Guard Apron (750mm yellow/black hazard)
    const apronMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const apron = new THREE.Mesh(new THREE.BoxGeometry(cw - 0.1, 0.65, 0.04), apronMat);
    apron.position.set(0, -ch / 2 - 0.35, halfD + 0.02);
    cabinGroup.add(apron);

    // B) Floor Mesh (Substrate + Luxury Cladding)
    const floorGeo = new THREE.BoxGeometry(cw, 0.1, cd);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.2,
      metalness: 0.1,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.set(0, -ch / 2 + 0.05, 0);
    floorMesh.receiveShadow = true;
    cabinGroup.add(floorMesh);
    floorMeshRef.current = floorMesh;

    // Dark granite / brass perimeter border frame
    const frameBorderMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.8 });
    const bFront = new THREE.Mesh(new THREE.BoxGeometry(cw, 0.11, 0.08), frameBorderMat);
    bFront.position.set(0, -ch / 2 + 0.055, halfD - 0.04);
    cabinGroup.add(bFront);
    const bRear = new THREE.Mesh(new THREE.BoxGeometry(cw, 0.11, 0.08), frameBorderMat);
    bRear.position.set(0, -ch / 2 + 0.055, -halfD + 0.04);
    cabinGroup.add(bRear);

    // C) Walls Group
    const wallGroup = new THREE.Group();
    cabinGroup.add(wallGroup);
    wallMeshGroupRef.current = wallGroup;

    // D) False Ceiling & Lighting Group
    const ceilingGroup = new THREE.Group();
    cabinGroup.add(ceilingGroup);
    ceilingGroupRef.current = ceilingGroup;

    // Central Point Light for realistic interior illumination
    const pLight = new THREE.PointLight(0xffffff, 2.2, 5.0, 1.2);
    pLight.position.set(0, ch / 2 - 0.25, 0);
    pLight.castShadow = true;
    cabinGroup.add(pLight);
    interiorLightRef.current = pLight;

    // E) Ergonomic Handrail (Curved stainless platinum)
    const handrailGroup = new THREE.Group();
    const railMetalMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.15,
    });
    // Main horizontal tube across rear wall
    const hTube = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, cw * 0.78, 16), railMetalMat);
    hTube.rotation.z = Math.PI / 2;
    hTube.position.set(0, -0.15, -halfD + 0.12);
    hTube.castShadow = true;
    handrailGroup.add(hTube);

    // 2 Standoff brackets
    [-cw * 0.3, cw * 0.3].forEach((sx) => {
      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.1, 12), railMetalMat);
      stand.rotation.x = Math.PI / 2;
      stand.position.set(sx, -0.15, -halfD + 0.06);
      handrailGroup.add(stand);
    });
    cabinGroup.add(handrailGroup);

    // F) Car Operating Panel (COP) on Front-Right
    const copWidth = 0.24;
    const copHeight = 1.6;
    const copGeo = new THREE.BoxGeometry(copWidth, copHeight, 0.035);
    const copBodyMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.25,
    });
    const copMesh = new THREE.Mesh(copGeo, copBodyMat);
    copMesh.position.set(halfW - 0.02, 0.05, halfD * 0.35);
    copMesh.rotation.y = -Math.PI / 2;
    cabinGroup.add(copMesh);

    // Dynamic TFT Digital Display on COP
    const displayCanvas = document.createElement("canvas");
    displayCanvas.width = 256;
    displayCanvas.height = 160;
    copDisplayCanvasRef.current = displayCanvas;
    const displayTex = new THREE.CanvasTexture(displayCanvas);
    copDisplayTextureRef.current = displayTex;

    const displayGeo = new THREE.PlaneGeometry(0.2, 0.12);
    const displayMat = new THREE.MeshBasicMaterial({ map: displayTex });
    const displayMesh = new THREE.Mesh(displayGeo, displayMat);
    displayMesh.position.set(halfW - 0.04, 0.65, halfD * 0.35);
    displayMesh.rotation.y = -Math.PI / 2;
    cabinGroup.add(displayMesh);

    // COP Buttons Array
    const btnMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.6, metalness: 0.6, roughness: 0.2 });
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 2; c++) {
        const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.01, 16), btnMat);
        btn.rotation.z = Math.PI / 2;
        const bz = halfD * 0.35 + (c === 0 ? -0.045 : 0.045);
        const by = 0.35 - r * 0.12;
        btn.position.set(halfW - 0.04, by, bz);
        cabinGroup.add(btn);
      }
    }

    // -------------------------------------------------------------------------
    // 3. Mouse Orbit, Panning & Zoom Controls
    // -------------------------------------------------------------------------
    const domElement = renderer.domElement;

    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - prevMousePosRef.current.x;
      const dy = e.clientY - prevMousePosRef.current.y;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };

      orbitRef.current.theta += dx * 0.008;
      orbitRef.current.phi = Math.max(0.15, Math.min(Math.PI - 0.15, orbitRef.current.phi - dy * 0.008));
      updateCameraPos();
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      orbitRef.current.radius = Math.max(1.8, Math.min(10.0, orbitRef.current.radius + e.deltaY * 0.005));
      updateCameraPos();
    };

    // Touch support for mobile / tablets
    let touchStartDist = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDist = Math.hypot(dx, dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDraggingRef.current) {
        const dx = e.touches[0].clientX - prevMousePosRef.current.x;
        const dy = e.touches[0].clientY - prevMousePosRef.current.y;
        prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

        orbitRef.current.theta += dx * 0.009;
        orbitRef.current.phi = Math.max(0.15, Math.min(Math.PI - 0.15, orbitRef.current.phi - dy * 0.009));
        updateCameraPos();
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDist = Math.hypot(dx, dy);
        const diff = touchStartDist - currentDist;
        orbitRef.current.radius = Math.max(1.8, Math.min(10.0, orbitRef.current.radius + diff * 0.01));
        touchStartDist = currentDist;
        updateCameraPos();
      }
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    domElement.addEventListener("wheel", onWheel, { passive: false });
    domElement.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // -------------------------------------------------------------------------
    // 4. Animation Loop
    // -------------------------------------------------------------------------
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (autoRotate) {
        orbitRef.current.theta += 0.008;
        updateCameraPos();
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      domElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      domElement.removeEventListener("wheel", onWheel);
      domElement.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, []);

  // ---------------------------------------------------------------------------
  // 2. Dynamic Update of Wall Material & Panels
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const wallGroup = wallMeshGroupRef.current;
    if (!wallGroup) return;

    // Clear previous walls
    while (wallGroup.children.length > 0) {
      wallGroup.remove(wallGroup.children[0]);
    }

    const cw = 1.8;
    const cd = 1.8;
    const ch = 2.3;
    const halfW = cw / 2;
    const halfD = cd / 2;

    // Calculate material properties according to wall type
    let wallColor = new THREE.Color(wall.color);
    let roughness = 0.3;
    let metalness = 0.1;

    if (wall.type === "marble") {
      roughness = 0.15;
      metalness = 0.08;
    } else if (wall.type === "brushed") {
      roughness = 0.38;
      metalness = 0.85;
    } else if (wall.type === "wood") {
      roughness = 0.65;
      metalness = 0.05;
    } else if (wall.type === "mirror") {
      roughness = 0.05;
      metalness = 0.95;
    }

    const wallMat = new THREE.MeshStandardMaterial({
      color: wallColor,
      roughness: roughness,
      metalness: metalness,
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(wall.accent),
      metalness: 0.85,
      roughness: 0.25,
    });

    // Rear Wall
    const rearWall = new THREE.Mesh(new THREE.BoxGeometry(cw, ch, 0.05), wallMat);
    rearWall.position.set(0, 0, -halfD);
    rearWall.receiveShadow = true;
    wallGroup.add(rearWall);

    // Rear Center Mirror (Crystal Bronze/Clear Mirror)
    const mirrorMat = new THREE.MeshStandardMaterial({
      color: wall.type === "mirror" ? 0x27272a : 0xe2e8f0,
      metalness: 0.98,
      roughness: 0.02,
    });
    const centerMirror = new THREE.Mesh(new THREE.BoxGeometry(cw * 0.55, ch * 0.75, 0.02), mirrorMat);
    centerMirror.position.set(0, 0.08, -halfD + 0.035);
    wallGroup.add(centerMirror);

    // Mirror Titanium Border
    const mirrorBorder = new THREE.Mesh(new THREE.BoxGeometry(cw * 0.57, ch * 0.77, 0.015), accentMat);
    mirrorBorder.position.set(0, 0.08, -halfD + 0.025);
    wallGroup.add(mirrorBorder);

    // Left Wall
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.05, ch, cd), wallMat);
    leftWall.position.set(-halfW, 0, 0);
    leftWall.receiveShadow = true;
    wallGroup.add(leftWall);

    // Right Wall
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.05, ch, cd), wallMat);
    rightWall.position.set(halfW, 0, 0);
    rightWall.receiveShadow = true;
    wallGroup.add(rightWall);

    // Wood slat vertical decorative ribs (if wood selected)
    if (wall.type === "wood") {
      const slatMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 });
      for (let s = -halfD + 0.15; s < halfD - 0.15; s += 0.12) {
        const slatL = new THREE.Mesh(new THREE.BoxGeometry(0.02, ch * 0.9, 0.04), slatMat);
        slatL.position.set(-halfW + 0.035, 0, s);
        wallGroup.add(slatL);
      }
    }

    // Front Wall (Open Portal Doorway with Door Jambs)
    const jambMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.25 });
    // Left jamb
    const leftJamb = new THREE.Mesh(new THREE.BoxGeometry(0.2, ch, 0.08), jambMat);
    leftJamb.position.set(-halfW + 0.1, 0, halfD);
    wallGroup.add(leftJamb);

    // Right jamb
    const rightJamb = new THREE.Mesh(new THREE.BoxGeometry(0.2, ch, 0.08), jambMat);
    rightJamb.position.set(halfW - 0.1, 0, halfD);
    wallGroup.add(rightJamb);

    // Transom lintel beam over entrance
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(cw, 0.25, 0.08), jambMat);
    lintel.position.set(0, ch / 2 - 0.125, halfD);
    wallGroup.add(lintel);
  }, [wall]);

  // ---------------------------------------------------------------------------
  // 3. Dynamic Update of Floor Material & Texture Sheen
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const floorMesh = floorMeshRef.current;
    if (!floorMesh) return;

    let fColor = new THREE.Color(floor.color);
    let roughness = 0.2;
    let metalness = 0.1;

    if (floor.id === "marquina") {
      roughness = 0.12; // deep glossy black marble
      metalness = 0.15;
    } else if (floor.id === "carrara") {
      roughness = 0.18; // polished white quartz
      metalness = 0.08;
    } else if (floor.id === "terrazzo") {
      roughness = 0.45; // matte textured venetian terrazzo
      metalness = 0.05;
    } else if (floor.id === "steel") {
      roughness = 0.25; // diamond stainless steel
      metalness = 0.92;
    }

    const mat = floorMesh.material as THREE.MeshStandardMaterial;
    mat.color = fColor;
    mat.roughness = roughness;
    mat.metalness = metalness;
    mat.needsUpdate = true;
  }, [floor]);

  // ---------------------------------------------------------------------------
  // 4. Dynamic Ceiling & Lighting Update
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const ceilGroup = ceilingGroupRef.current;
    const pLight = interiorLightRef.current;
    if (!ceilGroup || !pLight) return;

    // Update light color
    const lightCol = new THREE.Color(lighting.hex);
    pLight.color = lightCol;

    // Clear previous ceiling items
    while (ceilGroup.children.length > 0) {
      ceilGroup.remove(ceilGroup.children[0]);
    }

    const cw = 1.8;
    const cd = 1.8;
    const ch = 2.3;
    const halfD = cd / 2;

    // Ceiling Main Structure Slab
    const slabMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.1,
    });
    const ceilSlab = new THREE.Mesh(new THREE.BoxGeometry(cw, 0.08, cd), slabMat);
    ceilSlab.position.set(0, ch / 2 - 0.04, 0);
    ceilGroup.add(ceilSlab);

    const emitterMat = new THREE.MeshBasicMaterial({ color: lightCol });

    if (ceiling.type === "linear") {
      // 4 modern recessed linear louvers
      for (let i = -0.45; i <= 0.45; i += 0.3) {
        const strip = new THREE.Mesh(new THREE.BoxGeometry(cw * 0.75, 0.02, 0.05), emitterMat);
        strip.position.set(0, ch / 2 - 0.085, i);
        ceilGroup.add(strip);
      }
    } else if (ceiling.type === "dots") {
      // Starfield fiber-optic micro dots on dark substrate
      const darkBack = new THREE.Mesh(
        new THREE.BoxGeometry(cw * 0.85, 0.01, cd * 0.85),
        new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.8 })
      );
      darkBack.position.set(0, ch / 2 - 0.075, 0);
      ceilGroup.add(darkBack);

      for (let x = -0.55; x <= 0.55; x += 0.22) {
        for (let z = -0.55; z <= 0.55; z += 0.22) {
          const dot = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), emitterMat);
          dot.position.set(x + (Math.random() * 0.05 - 0.025), ch / 2 - 0.085, z + (Math.random() * 0.05 - 0.025));
          ceilGroup.add(dot);
        }
      }
    } else if (ceiling.type === "cove") {
      // Perimeter Architectural Indirect Halo Cove
      const coveInner = new THREE.Mesh(
        new THREE.BoxGeometry(cw * 0.72, 0.04, cd * 0.72),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 })
      );
      coveInner.position.set(0, ch / 2 - 0.08, 0);
      ceilGroup.add(coveInner);

      // 4 Perimeter glow bars
      const barFront = new THREE.Mesh(new THREE.BoxGeometry(cw * 0.8, 0.015, 0.03), emitterMat);
      barFront.position.set(0, ch / 2 - 0.075, cd * 0.38);
      ceilGroup.add(barFront);

      const barRear = new THREE.Mesh(new THREE.BoxGeometry(cw * 0.8, 0.015, 0.03), emitterMat);
      barRear.position.set(0, ch / 2 - 0.075, -cd * 0.38);
      ceilGroup.add(barRear);

      const barLeft = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.015, cd * 0.8), emitterMat);
      barLeft.position.set(-cw * 0.38, ch / 2 - 0.075, 0);
      ceilGroup.add(barLeft);

      const barRight = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.015, cd * 0.8), emitterMat);
      barRight.position.set(cw * 0.38, ch / 2 - 0.075, 0);
      ceilGroup.add(barRight);
    }
  }, [ceiling, lighting]);

  // ---------------------------------------------------------------------------
  // 5. Update COP TFT Screen Texture
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const canvas = copDisplayCanvasRef.current;
    const tex = copDisplayTextureRef.current;
    if (!canvas || !tex) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear background
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Cyan Border
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

    // Header: VERTEX SMART
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "center";
    ctx.fillText("VERTEX ELEVATOR", canvas.width / 2, 28);

    // Floor Number & Direction Arrow
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 56px monospace";
    ctx.fillText(`▲ ${currentFloor}`, canvas.width / 2, 92);

    // Subtext: Load & Status
    ctx.fillStyle = "#22c55e";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("NORMAL RUN • 630 KG", canvas.width / 2, 130);

    tex.needsUpdate = true;
  }, [currentFloor]);

  // ---------------------------------------------------------------------------
  // 6. Camera View Mode Presets
  // ---------------------------------------------------------------------------
  const setPresetCamera = (mode: "isometric" | "interior" | "top") => {
    setCameraMode(mode);
    const camera = cameraRef.current;
    if (!camera) return;

    if (mode === "isometric") {
      orbitRef.current = {
        theta: 0.35,
        phi: 1.15,
        radius: 4.8,
        target: new THREE.Vector3(0, 0, 0),
      };
    } else if (mode === "interior") {
      orbitRef.current = {
        theta: 0.02,
        phi: 1.52,
        radius: 1.95,
        target: new THREE.Vector3(0, 0.05, -0.2),
      };
    } else if (mode === "top") {
      orbitRef.current = {
        theta: 0.0,
        phi: 0.25,
        radius: 5.2,
        target: new THREE.Vector3(0, 0, 0),
      };
    }

    const { theta, phi, radius, target } = orbitRef.current;
    camera.position.set(
      target.x + radius * Math.sin(phi) * Math.sin(theta),
      target.y + radius * Math.cos(phi),
      target.z + radius * Math.sin(phi) * Math.cos(theta)
    );
    camera.lookAt(target);
  };

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-vertex-borderStrong bg-slate-950 shadow-2xl flex flex-col justify-between select-none">
      {/* 3D Canvas Mount Point */}
      <div ref={containerRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Top Floating Ribbon: Status & Camera Modes */}
      <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 text-sky-400 border border-sky-500/30 font-mono text-xs font-bold backdrop-blur-md shadow-md">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            {isFa ? "رندر زنده سه‌بعدی Three.js" : "3D WebGL Realtime Engine"}
          </span>
        </div>

        {/* Camera Preset Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900/85 p-1 rounded-xl border border-slate-800 backdrop-blur-md pointer-events-auto shadow-md">
          <button
            onClick={() => setPresetCamera("interior")}
            className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              cameraMode === "interior"
                ? "bg-sky-500 text-white shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
            title={isFa ? "دید درون کابین" : "Inside Cabin View"}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isFa ? "نمای درون کابین" : "Inside"}</span>
          </button>

          <button
            onClick={() => setPresetCamera("isometric")}
            className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              cameraMode === "isometric"
                ? "bg-sky-500 text-white shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
            title={isFa ? "دید کلی سه‌بعدی" : "Isometric 3D"}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{isFa ? "نمای ایزومتریک" : "Isometric"}</span>
          </button>

          <button
            onClick={() => setPresetCamera("top")}
            className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              cameraMode === "top"
                ? "bg-sky-500 text-white shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
            title={isFa ? "دید پلان سقف و سقف کاذب" : "Top Ceiling View"}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isFa ? "سقف" : "Ceiling"}</span>
          </button>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded-lg transition-all ${
              autoRotate ? "bg-amber-500 text-white" : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
            title={isFa ? "چرخش خودکار ۳۶۰ درجه" : "Auto Rotate"}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between pointer-events-none">
        <div className="bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 backdrop-blur-md flex items-center gap-2 pointer-events-auto">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>
            {isFa
              ? "کلیک چپ و درگ: چرخش ۳۶۰° | اسکرول ماوس: زوم این/اوت"
              : "Drag: 360° Orbit | Scroll: Zoom"}
          </span>
        </div>

        <div className="bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono text-sky-300 backdrop-blur-md pointer-events-auto">
          <span>{isFa ? `طبقه فعال شستی: ${currentFloor}` : `COP Floor: ${currentFloor}`}</span>
        </div>
      </div>
    </div>
  );
}
