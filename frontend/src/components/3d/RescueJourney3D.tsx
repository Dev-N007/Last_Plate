import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChefHat, ShieldCheck, Scale, HeartHandshake, CheckCircle2, ChevronRight } from 'lucide-react';

interface RescueJourney3DProps {
  className?: string;
}

const PHASES = [
  {
    id: 0,
    number: '01',
    title: 'Commercial Kitchen Surplus',
    subtitle: '60-Second Declaration',
    icon: ChefHat,
    color: '#DCA647',
    hexColor: 0xdca647,
    description: 'Canteens, bakeries, and cafes declare unsold edible food with prep timestamp, quantity, and mandatory allergen declarations.'
  },
  {
    id: 1,
    number: '02',
    title: 'Autonomous Safety Routing',
    subtitle: 'Zero-Allergen Risk Filter',
    icon: ShieldCheck,
    color: '#52B788',
    hexColor: 0x52b788,
    description: 'The AI matching engine verifies dietary tags and hard-excludes any allergen conflicts before proposing pairings.'
  },
  {
    id: 2,
    number: '03',
    title: 'Environmental Accounting',
    subtitle: '2.5 kg CO₂e / kg Baseline',
    icon: Scale,
    color: '#D9F36A',
    hexColor: 0xd9f36a,
    description: 'Ledger tracks mass and prevents methane generation. Only confirmed handovers count toward the sustainability total.'
  },
  {
    id: 3,
    number: '04',
    title: 'Verified Handover & Meal Served',
    subtitle: 'Code-Secured Collection',
    icon: HeartHandshake,
    color: '#2D6A4F',
    hexColor: 0x2d6a4f,
    description: 'Recipients present their unique reference code (e.g. LP-312-BAKE). Handover is verified on-site, completing the rescue.'
  }
];

export const RescueJourney3D: React.FC<RescueJourney3DProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isDark = document.documentElement.classList.contains('dark');

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2.8, 6.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 4 Pedestal Stations positioned along X axis
    const stationXCoords = [-3.3, -1.1, 1.1, 3.3];
    const stationMeshes: THREE.Group[] = [];

    stationXCoords.forEach((x, idx) => {
      const station = new THREE.Group();
      station.position.set(x, 0, 0);

      // Base Pedestal Cylinder
      const pedGeo = new THREE.CylinderGeometry(0.55, 0.65, 0.15, 32);
      const pedMat = new THREE.MeshStandardMaterial({
        color: isDark ? 0x14281e : 0xf8f6ef,
        roughness: 0.3,
        metalness: 0.2
      });
      const pedestal = new THREE.Mesh(pedGeo, pedMat);
      pedestal.position.y = -0.5;
      station.add(pedestal);

      // Pedestal Glowing Rim Ring
      const ringGeo = new THREE.TorusGeometry(0.66, 0.02, 16, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: PHASES[idx].hexColor,
        transparent: true,
        opacity: 0.8
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -0.42;
      station.add(ring);

      // Floating Food-Rescue Symbol for each station
      const coreSubGroup = new THREE.Group();
      coreSubGroup.position.y = 0.18;

      if (idx === 0) {
        // Station 1: Bakery / Kitchen Loaf
        const loafGeo = new THREE.SphereGeometry(0.3, 20, 16);
        loafGeo.scale(1.4, 0.7, 0.85);
        const loafMat = new THREE.MeshStandardMaterial({ color: 0xdca647, roughness: 0.7 });
        const loaf = new THREE.Mesh(loafGeo, loafMat);
        coreSubGroup.add(loaf);
      } else if (idx === 1) {
        // Station 2: AI Safety Verified Apple
        const fruitGeo = new THREE.SphereGeometry(0.24, 20, 20);
        const fruitMat = new THREE.MeshStandardMaterial({ color: 0x52b788, roughness: 0.3 });
        const fruit = new THREE.Mesh(fruitGeo, fruitMat);
        coreSubGroup.add(fruit);
        // Safety shield aura ring
        const sRingGeo = new THREE.TorusGeometry(0.34, 0.02, 12, 32);
        const sRingMat = new THREE.MeshBasicMaterial({ color: 0x52b788, transparent: true, opacity: 0.8 });
        const sRing = new THREE.Mesh(sRingGeo, sRingMat);
        sRing.rotation.x = Math.PI / 2;
        coreSubGroup.add(sRing);
      } else if (idx === 2) {
        // Station 3: Environmental Carbon Scale / Earth Node
        const globeGeo = new THREE.SphereGeometry(0.25, 20, 20);
        const globeMat = new THREE.MeshStandardMaterial({ color: 0xd9f36a, roughness: 0.35, wireframe: false });
        const globe = new THREE.Mesh(globeGeo, globeMat);
        coreSubGroup.add(globe);
        // Eco latitude ring
        const latRingGeo = new THREE.TorusGeometry(0.36, 0.015, 12, 32);
        const latRingMat = new THREE.MeshBasicMaterial({ color: 0xd9f36a, transparent: true, opacity: 0.7 });
        const latRing = new THREE.Mesh(latRingGeo, latRingMat);
        coreSubGroup.add(latRing);
      } else {
        // Station 4: Handover Food Care Box
        const boxGeo = new THREE.BoxGeometry(0.38, 0.32, 0.38);
        const boxMat = new THREE.MeshStandardMaterial({ color: 0x2d6a4f, roughness: 0.4 });
        const box = new THREE.Mesh(boxGeo, boxMat);
        coreSubGroup.add(box);
        // Ribbon Cross
        const ribGeo = new THREE.BoxGeometry(0.4, 0.34, 0.08);
        const ribMat = new THREE.MeshStandardMaterial({ color: 0xd9f36a });
        const rib = new THREE.Mesh(ribGeo, ribMat);
        coreSubGroup.add(rib);
      }

      station.add(coreSubGroup);

      rootGroup.add(station);
      stationMeshes.push(station);
    });

    // Clean Linear Energy Rail connecting the stations
    const railPoints = [
      new THREE.Vector3(-3.3, -0.4, 0),
      new THREE.Vector3(3.3, -0.4, 0)
    ];
    const railGeo = new THREE.TubeGeometry(new THREE.LineCurve3(railPoints[0], railPoints[1]), 32, 0.03, 8, false);
    const railMat = new THREE.MeshBasicMaterial({
      color: 0x163d2b,
      transparent: true,
      opacity: 0.45
    });
    const rail = new THREE.Mesh(railGeo, railMat);
    rootGroup.add(rail);

    // Glowing Pulse Packets traveling between stations
    const packetGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const packetMat = new THREE.MeshBasicMaterial({ color: 0xd9f36a });
    const packet = new THREE.Mesh(packetGeo, packetMat);
    rootGroup.add(packet);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xfff6e6, 2.2);
    dirLight.position.set(3, 5, 4);
    scene.add(dirLight);

    let mouseX = 0;
    let targetX = 0;
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetX = nx * 0.35;
    };
    window.addEventListener('mousemove', onMouseMove);

    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      mouseX += (targetX - mouseX) * 0.05;
      rootGroup.rotation.y = mouseX;

      // Animate cores rotating on their pedestals
      stationMeshes.forEach((station, idx) => {
        const coreMesh = station.children[2];
        if (coreMesh) {
          coreMesh.rotation.y = t * (0.8 + idx * 0.2);
          coreMesh.rotation.x = t * 0.4;
          // Pulse the active step
          if (idx === activeStep) {
            coreMesh.scale.setScalar(1.15 + Math.sin(t * 4) * 0.08);
          } else {
            coreMesh.scale.setScalar(0.95);
          }
        }
      });

      // Animate packet along the rail
      const progress = (t * 0.3) % 1;
      packet.position.x = -3.3 + progress * 6.6;
      packet.position.y = -0.4 + Math.sin(progress * Math.PI * 3) * 0.15;

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
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      railGeo.dispose();
      railMat.dispose();
      packetGeo.dispose();
      packetMat.dispose();
    };
  }, [activeStep]);

  const current = PHASES[activeStep];
  const Icon = current.icon;

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#10291F] via-[#143224] to-[#0A1811] dark:from-[#0B1A12] dark:via-[#11271C] dark:to-[#08150E] p-6 sm:p-8 text-white border border-white/10 shadow-2xl ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D9F36A]">
            Interactive Rescue Pipeline
          </span>
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold mt-1">
            The Verified Second-Chance Flow
          </h3>
        </div>

        {/* Phase Selectors */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {PHASES.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setActiveStep(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeStep === idx
                  ? 'bg-[#D9F36A] text-[#10291F] shadow-sm'
                  : 'bg-white/10 text-neutral-300 hover:bg-white/20'
              }`}
            >
              <span>{p.number}</span>
              <span className="hidden md:inline">{p.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3D Pedestal Stage Canvas */}
      <div ref={mountRef} className="w-full h-48 sm:h-56 cursor-grab select-none" />

      {/* Detail Callout Card for Active Step */}
      <div className="mt-4 p-5 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shrink-0 shadow-md"
            style={{ backgroundColor: current.color, color: '#10291F' }}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#D9F36A] uppercase tracking-wider">
                Phase {current.number}
              </span>
              <span className="text-neutral-400">·</span>
              <span className="text-xs text-neutral-300 font-medium">
                {current.subtitle}
              </span>
            </div>
            <h4 className="text-base font-bold text-white mt-0.5">
              {current.title}
            </h4>
          </div>
        </div>

        <p className="text-xs text-neutral-200 sm:max-w-md leading-relaxed sm:text-right">
          {current.description}
        </p>
      </div>
    </div>
  );
};
