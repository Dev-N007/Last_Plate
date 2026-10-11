import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Utensils, Apple, Clock, ShieldCheck, Flame, RefreshCw } from 'lucide-react';

interface RescueGridNetwork3DProps {
  className?: string;
}

export const RescueGridNetwork3D: React.FC<RescueGridNetwork3DProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'bakery' | 'produce' | 'kitchen'>('all');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isDark = document.documentElement.classList.contains('dark');

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 3.6, 5.8);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 2. Base Pedestal / Artisan Platter
    const dishGroup = new THREE.Group();
    rootGroup.add(dishGroup);

    // Ceramic Platter Dish
    const dishGeo = new THREE.CylinderGeometry(2.2, 1.85, 0.18, 48);
    const dishMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x14281e : 0xf4f1ea,
      roughness: 0.35,
      metalness: 0.15
    });
    const dishMesh = new THREE.Mesh(dishGeo, dishMat);
    dishMesh.position.y = -0.3;
    dishMesh.receiveShadow = true;
    dishGroup.add(dishMesh);

    // Platter Rim Accent (Emerald / Gold Leaf Rim)
    const rimGeo = new THREE.TorusGeometry(2.21, 0.025, 16, 64);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xd9f36a,
      roughness: 0.2,
      metalness: 0.8
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = -0.21;
    dishGroup.add(rimMesh);

    // Sub-pedestal Base
    const baseGeo = new THREE.CylinderGeometry(1.3, 1.5, 0.18, 36);
    const baseMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x0c1912 : 0xe3dec3,
      roughness: 0.5,
      metalness: 0.1
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.45;
    dishGroup.add(baseMesh);

    // 3. Stylized Food Centerpieces

    // --- (A) ARTISAN SOURDOUGH BREAD LOAF ---
    const breadGroup = new THREE.Group();
    breadGroup.position.set(-0.65, 0.15, -0.2);
    breadGroup.rotation.y = 0.45;
    breadGroup.rotation.z = 0.05;

    // Bread Loaf Body
    const loafGeo = new THREE.SphereGeometry(0.68, 32, 24);
    loafGeo.scale(1.5, 0.72, 0.88);
    const loafMat = new THREE.MeshStandardMaterial({
      color: 0xc87d2b, // warm honey golden crust
      roughness: 0.82,
      metalness: 0.05
    });
    const loafMesh = new THREE.Mesh(loafGeo, loafMat);
    loafMesh.castShadow = true;
    breadGroup.add(loafMesh);

    // Loaf Scoring Marks (Artisan Baker Slash Cuts)
    for (let s = -0.45; s <= 0.45; s += 0.3) {
      const slashGeo = new THREE.TorusGeometry(0.48, 0.03, 12, 24, Math.PI * 0.55);
      const slashMat = new THREE.MeshStandardMaterial({
        color: 0x6e360f, // baked caramelized crust
        roughness: 0.9
      });
      const slashMesh = new THREE.Mesh(slashGeo, slashMat);
      slashMesh.position.set(s, 0.15, 0);
      slashMesh.rotation.z = Math.PI * 0.72;
      slashMesh.rotation.y = 0.15;
      breadGroup.add(slashMesh);
    }
    rootGroup.add(breadGroup);

    // --- (B) CRISP ORCHARD APPLE ---
    const appleGroup = new THREE.Group();
    appleGroup.position.set(0.62, 0.12, 0.4);

    // Apple Body
    const appleGeo = new THREE.SphereGeometry(0.46, 32, 32);
    appleGeo.scale(1.0, 0.92, 1.0);
    const appleMat = new THREE.MeshStandardMaterial({
      color: 0xdf2935, // crisp ruby apple
      roughness: 0.28,
      metalness: 0.15
    });
    const appleMesh = new THREE.Mesh(appleGeo, appleMat);
    appleMesh.castShadow = true;
    appleGroup.add(appleMesh);

    // Apple Stem
    const stemGeo = new THREE.CylinderGeometry(0.018, 0.026, 0.22, 12);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x4a2e18, roughness: 0.9 });
    const stemMesh = new THREE.Mesh(stemGeo, stemMat);
    stemMesh.position.set(0, 0.45, 0);
    stemMesh.rotation.z = 0.18;
    appleGroup.add(stemMesh);

    // Fresh Green Leaf
    const leafGeo = new THREE.ConeGeometry(0.12, 0.26, 5);
    leafGeo.scale(1.2, 0.25, 0.8);
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x52b788, // fresh garden green
      roughness: 0.35,
      metalness: 0.1
    });
    const leafMesh = new THREE.Mesh(leafGeo, leafMat);
    leafMesh.position.set(0.08, 0.46, 0.05);
    leafMesh.rotation.z = -1.1;
    leafMesh.rotation.y = 0.4;
    appleGroup.add(leafMesh);

    rootGroup.add(appleGroup);

    // --- (C) FRESH CITRUS ORANGE ---
    const orangeGroup = new THREE.Group();
    orangeGroup.position.set(0.72, 0.04, -0.6);

    const orangeGeo = new THREE.SphereGeometry(0.4, 28, 28);
    const orangeMat = new THREE.MeshStandardMaterial({
      color: 0xf77f00, // vibrant citrus
      roughness: 0.45,
      metalness: 0.1
    });
    const orangeMesh = new THREE.Mesh(orangeGeo, orangeMat);
    orangeMesh.castShadow = true;
    orangeGroup.add(orangeMesh);

    // Citrus Slice Wedge Accent
    const wedgeGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.08, 16, 1, false, 0, Math.PI * 0.9);
    const wedgeMat = new THREE.MeshStandardMaterial({
      color: 0xffb703,
      roughness: 0.2
    });
    const wedgeMesh = new THREE.Mesh(wedgeGeo, wedgeMat);
    wedgeMesh.position.set(-0.25, -0.05, 0.35);
    wedgeMesh.rotation.x = Math.PI / 2.3;
    orangeGroup.add(wedgeMesh);

    rootGroup.add(orangeGroup);

    // --- (D) FRESH AVOCADO / GARDEN GREENS ---
    const avoGroup = new THREE.Group();
    avoGroup.position.set(-0.7, -0.02, 0.55);
    avoGroup.rotation.y = -0.3;

    const avoGeo = new THREE.SphereGeometry(0.34, 24, 24);
    avoGeo.scale(0.85, 1.25, 0.85);
    const avoMat = new THREE.MeshStandardMaterial({
      color: 0x2d6a4f, // rich botanical dark green
      roughness: 0.65,
      metalness: 0.05
    });
    const avoMesh = new THREE.Mesh(avoGeo, avoMat);
    avoMesh.castShadow = true;
    avoMesh.rotation.z = 0.5;
    avoGroup.add(avoMesh);

    rootGroup.add(avoGroup);

    // 4. Freshness Preservation Cloche / Eco Shield Dome
    const clocheGroup = new THREE.Group();
    const clocheGeo = new THREE.SphereGeometry(
      2.1,
      40,
      20,
      0,
      Math.PI * 2,
      0,
      Math.PI * 0.44
    );
    const clocheMat = new THREE.MeshStandardMaterial({
      color: 0xd9f36a,
      transparent: true,
      opacity: isDark ? 0.12 : 0.08,
      roughness: 0.1,
      metalness: 0.2,
      wireframe: false
    });
    const clocheMesh = new THREE.Mesh(clocheGeo, clocheMat);
    clocheMesh.position.y = -0.25;
    clocheGroup.add(clocheMesh);

    // Top Cloche Handle
    const handleGeo = new THREE.TorusGeometry(0.16, 0.03, 16, 32);
    const handleMat = new THREE.MeshStandardMaterial({
      color: 0xdca647,
      roughness: 0.2,
      metalness: 0.7
    });
    const handleMesh = new THREE.Mesh(handleGeo, handleMat);
    handleMesh.rotation.x = Math.PI / 2;
    handleMesh.position.y = 1.68;
    clocheGroup.add(handleMesh);

    rootGroup.add(clocheGroup);

    // 5. Orbital Rescue Ring (Countdown Window Rail)
    const haloRingGeo = new THREE.TorusGeometry(2.45, 0.022, 16, 80);
    const haloRingMat = new THREE.MeshBasicMaterial({
      color: 0xd9f36a,
      transparent: true,
      opacity: 0.75
    });
    const haloRing = new THREE.Mesh(haloRingGeo, haloRingMat);
    haloRing.rotation.x = Math.PI / 2;
    haloRing.position.y = 0.2;
    rootGroup.add(haloRing);

    // Countdown Marker Beacon traveling on the Halo Ring
    const beaconGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
    rootGroup.add(beaconMesh);

    // 6. Rising Warmth & Aroma Vapor Particles
    const particleCount = 28;
    const vaporGeo = new THREE.SphereGeometry(0.045, 10, 10);
    const vaporMat = new THREE.MeshBasicMaterial({
      color: 0xffe8a3,
      transparent: true,
      opacity: 0.55
    });
    const vapors: { mesh: THREE.Mesh; seedX: number; seedZ: number; speed: number; offset: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const mesh = new THREE.Mesh(vaporGeo, vaporMat.clone());
      const seedX = (Math.random() - 0.5) * 1.5;
      const seedZ = (Math.random() - 0.5) * 1.5;
      const speed = 0.4 + Math.random() * 0.5;
      const offset = Math.random() * 2;
      rootGroup.add(mesh);
      vapors.push({ mesh, seedX, seedZ, speed, offset });
    }

    // 7. Studio & Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.9);
    scene.add(ambientLight);

    // Warm Sunbeam Light
    const sunLight = new THREE.DirectionalLight(0xfff1d0, 2.6);
    sunLight.position.set(4, 7, 5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // Cool Eco Fill Light
    const fillLight = new THREE.DirectionalLight(0x52b788, 1.2);
    fillLight.position.set(-5, 3, -3);
    scene.add(fillLight);

    // Center Hearth Glow Point Light
    const hearthLight = new THREE.PointLight(0xffaa44, 2.2, 8);
    hearthLight.position.set(0, 0.8, 0);
    scene.add(hearthLight);

    // 8. User Interaction (Orbit & Parallax Drag)
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotVelocityY = 0.003;
    let rotVelocityX = 0;

    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let curParallaxX = 0;
    let curParallaxY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        rotVelocityY = deltaX * 0.005;
        rotVelocityX = deltaY * 0.003;
        prevMouseX = clientX;
        prevMouseY = clientY;
      } else {
        const rect = container.getBoundingClientRect();
        const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -(((clientY - rect.top) / rect.height) * 2 - 1);
        targetParallaxX = ny * 0.2;
        targetParallaxY = nx * 0.3;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onPointerDown);
    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);

    // 9. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Rotation inertia damping
      if (!isDragging) {
        rotVelocityY += (0.003 - rotVelocityY) * 0.04;
        rotVelocityX *= 0.93;
      }

      rootGroup.rotation.y += rotVelocityY;
      rootGroup.rotation.x = THREE.MathUtils.clamp(
        rootGroup.rotation.x + rotVelocityX,
        -0.1,
        0.55
      );

      curParallaxX += (targetParallaxX - curParallaxX) * 0.05;
      curParallaxY += (targetParallaxY - curParallaxY) * 0.05;
      rootGroup.position.x = curParallaxY * 0.2;
      rootGroup.position.z = curParallaxX * 0.15;

      // Gentle floating levitation for individual food items
      breadGroup.position.y = 0.15 + Math.sin(t * 1.8) * 0.04;
      appleGroup.position.y = 0.12 + Math.sin(t * 2.1 + 1) * 0.035;
      orangeGroup.position.y = 0.04 + Math.sin(t * 1.9 + 2) * 0.03;
      avoGroup.position.y = -0.02 + Math.sin(t * 2.0 + 3) * 0.025;

      // Cloche breathing pulse
      clocheMesh.scale.setScalar(1 + Math.sin(t * 1.5) * 0.015);

      // Countdown beacon rotation along the halo ring
      const beaconAngle = t * 0.65;
      beaconMesh.position.x = Math.cos(beaconAngle) * 2.45;
      beaconMesh.position.z = Math.sin(beaconAngle) * 2.45;
      beaconMesh.position.y = 0.2 + Math.sin(t * 3) * 0.04;

      // Animate rising aroma / warmth steam particles
      vapors.forEach((v) => {
        const progress = ((t * v.speed + v.offset) % 2.2) / 2.2;
        v.mesh.position.x = v.seedX + Math.sin(t * 2 + v.offset) * 0.15;
        v.mesh.position.z = v.seedZ + Math.cos(t * 2 + v.offset) * 0.15;
        v.mesh.position.y = 0.1 + progress * 1.6;

        // Fade in and out
        const mat = v.mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.sin(progress * Math.PI) * 0.45;
        v.mesh.scale.setScalar(0.7 + progress * 0.9);
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('mousedown', onPointerDown);
      container.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      dishGeo.dispose();
      dishMat.dispose();
      loafGeo.dispose();
      loafMat.dispose();
      appleGeo.dispose();
      appleMat.dispose();
      orangeGeo.dispose();
      orangeMat.dispose();
      haloRingGeo.dispose();
      haloRingMat.dispose();
      clocheGeo.dispose();
      clocheMat.dispose();
    };
  }, []);

  return (
    <div
      className={`relative w-full h-full select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        title="Interactive 3D Food Rescue Sanctuary: Drag to inspect surplus freshness"
      />

      {/* Floating Status Pill: Active Freshness Preservation */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 dark:bg-[#12241B]/95 backdrop-blur-md border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-[#163D2B] dark:text-[#D9F36A] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#DCA647]" />
            Surplus Freshness Vault
          </span>
        </div>
      </div>

      {/* Floating Top Right Timer Pill */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-[#12241B]/95 backdrop-blur-md border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-sm text-xs text-[#26332B] dark:text-[#E8F0EB]">
        <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span className="font-semibold">3h 45m</span>
        <span className="text-[11px] text-[#737C73] dark:text-[#95A599]">window active</span>
      </div>

      {/* Live Food Elements Inspection Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-10 bg-white/95 dark:bg-[#12241B]/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#163D2B] dark:bg-[#D9F36A] text-white dark:text-[#10291F] flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#163D2B] dark:text-[#E8F0EB] flex items-center gap-1.5">
              <span>Edible Surplus Preservation</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold uppercase tracking-wider">
                100% Safe
              </span>
            </div>
            <div className="text-[11px] text-[#737C73] dark:text-[#96A89D] mt-0.5">
              Artisan sourdough · Orchard harvest · Temperature controlled
            </div>
          </div>
        </div>

        {/* Quick Food Type Indicators */}
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#163D2B] dark:text-[#D9F36A]">
          <span className="px-2.5 py-1 rounded-lg bg-[#F8F6EF] dark:bg-[#1A3326] border border-[#DCE7D8] dark:border-[#244533]">
            🥖 Bakery
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#F8F6EF] dark:bg-[#1A3326] border border-[#DCE7D8] dark:border-[#244533]">
            🍏 Orchard
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#F8F6EF] dark:bg-[#1A3326] border border-[#DCE7D8] dark:border-[#244533]">
            🍲 Kitchen
          </span>
        </div>
      </div>
    </div>
  );
};
