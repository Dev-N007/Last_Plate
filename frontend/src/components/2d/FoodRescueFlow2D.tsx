import React, { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  Utensils,
  Apple,
  Clock,
  ShieldCheck,
  Flame,
  Zap,
  RotateCw,
  Sliders,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface FoodNode {
  id: string;
  name: string;
  category: string;
  emoji: string;
  portions: number;
  unit: string;
  timeLeft: string;
  temperature: string;
  allergens: string;
  co2SavedKg: number;
  angle: number; // in radians
  speed: number;
  radius: number;
  color: string;
  accentHex: string;
}

const INITIAL_NODES: FoodNode[] = [
  {
    id: 'bread',
    name: 'Artisan Sourdough Loaves',
    category: 'Bakery Surplus',
    emoji: '🥖',
    portions: 14,
    unit: 'loaves',
    timeLeft: '3h 45m',
    temperature: 'Ambient (Room Temp)',
    allergens: 'Gluten (Declared)',
    co2SavedKg: 15.75,
    angle: 0,
    speed: 0.007,
    radius: 175,
    color: '#DCA647',
    accentHex: '#DCA647'
  },
  {
    id: 'apple',
    name: 'Crisp Orchard Apples',
    category: 'Harvest Produce',
    emoji: '🍏',
    portions: 22,
    unit: 'kg',
    timeLeft: '5h 15m',
    temperature: 'Chilled 8°C',
    allergens: 'None Declared',
    co2SavedKg: 24.75,
    angle: Math.PI * 0.5,
    speed: 0.006,
    radius: 140,
    color: '#52B788',
    accentHex: '#52B788'
  },
  {
    id: 'rice',
    name: 'Warm Vegetable Biryani',
    category: 'Prepared Meals',
    emoji: '🍲',
    portions: 18,
    unit: 'portions',
    timeLeft: '1h 30m',
    temperature: 'Heated Warmer 65°C',
    allergens: 'Dairy (Declared)',
    co2SavedKg: 20.25,
    angle: Math.PI,
    speed: 0.008,
    radius: 185,
    color: '#D9F36A',
    accentHex: '#D9F36A'
  },
  {
    id: 'sandwich',
    name: 'Gourmet Deli Sandwiches',
    category: 'Packaged Goods',
    emoji: '🥪',
    portions: 12,
    unit: 'portions',
    timeLeft: '2h 10m',
    temperature: 'Refrigerated 4°C',
    allergens: 'Gluten, Dairy (Declared)',
    co2SavedKg: 13.5,
    angle: Math.PI * 1.5,
    speed: 0.0075,
    radius: 155,
    color: '#FF9F1C',
    accentHex: '#FF9F1C'
  }
];

interface FoodRescueFlow2DProps {
  className?: string;
}

export const FoodRescueFlow2D: React.FC<FoodRescueFlow2DProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('bread');
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [pulseCount, setPulseCount] = useState<number>(0);
  const nodesRef = useRef<FoodNode[]>(INITIAL_NODES);

  const selectedNode = nodesRef.current.find((n) => n.id === selectedNodeId) || nodesRef.current[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let scanAngle = 0;
    let particlePulse = 0;

    // Responsive canvas dimensions
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle flow bursts
    const flowParticles: { x: number; y: number; r: number; alpha: number; speed: number; angle: number }[] = [];
    for (let p = 0; p < 24; p++) {
      flowParticles.push({
        x: 0,
        y: 0,
        r: 1.5 + Math.random() * 2,
        alpha: 0.3 + Math.random() * 0.7,
        speed: 0.5 + Math.random() * 1.2,
        angle: Math.random() * Math.PI * 2
      });
    }

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      const isDark = document.documentElement.classList.contains('dark');

      // Responsive scale factor based on actual canvas dimensions
      const baseDim = Math.min(w, h);
      const scale = Math.max(0.55, Math.min(1.0, baseDim / 360));

      // 1. Concentric Freshness Radar Rings
      const ringRadii = [45, 80, 120, 155].map((r) => r * scale);
      ringRadii.forEach((r, idx) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = isDark
          ? `rgba(82, 183, 136, ${0.12 - idx * 0.02})`
          : `rgba(22, 61, 43, ${0.08 - idx * 0.015})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 2. Animated Radar Sweep Beam
      scanAngle += 0.018 * speedMultiplier;
      const sweepGradient = ctx.createConicGradient(scanAngle, cx, cy);
      sweepGradient.addColorStop(0, 'rgba(217, 243, 106, 0.22)');
      sweepGradient.addColorStop(0.12, 'rgba(82, 183, 136, 0.04)');
      sweepGradient.addColorStop(0.35, 'transparent');
      sweepGradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(cx, cy, 160 * scale, 0, Math.PI * 2);
      ctx.fillStyle = sweepGradient;
      ctx.fill();

      // 3. Central Zero-Waste Core (Culinary Preservation Hearth)
      particlePulse += 0.04;
      const corePulse = Math.sin(particlePulse) * (3 * scale);
      const coreR = 26 * scale;

      // Outer Core Glow
      const coreGlow = ctx.createRadialGradient(cx, cy, 8 * scale, cx, cy, (42 + corePulse) * scale);
      coreGlow.addColorStop(0, 'rgba(217, 243, 106, 0.4)');
      coreGlow.addColorStop(0.6, 'rgba(82, 183, 136, 0.15)');
      coreGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, (42 + corePulse) * scale, 0, Math.PI * 2);
      ctx.fill();

      // Inner Solid Core
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#143224' : '#163D2B';
      ctx.fill();
      ctx.strokeStyle = '#D9F36A';
      ctx.lineWidth = 2 * scale;
      ctx.stroke();

      // Core Text Emblem
      ctx.fillStyle = '#D9F36A';
      ctx.font = `bold ${Math.max(8, Math.round(9 * scale))}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ZERO', cx, cy - 5 * scale);
      ctx.fillStyle = '#ffffff';
      ctx.font = `${Math.max(7, Math.round(7.5 * scale))}px sans-serif`;
      ctx.fillText('WASTE', cx, cy + 5 * scale);

      // 4. Connecting Trajectory Laser Streams & Nodes
      nodesRef.current.forEach((node) => {
        // Update angle
        node.angle += node.speed * speedMultiplier;

        // Scale orbit radius dynamically to avoid clipping
        const scaledRadius = node.radius * 0.78 * scale;
        const nx = cx + Math.cos(node.angle) * scaledRadius;
        const ny = cy + Math.sin(node.angle) * scaledRadius;

        // Draw connecting beam to center
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(nx, ny);
        ctx.strokeStyle = isDark ? `${node.color}33` : `${node.color}44`;
        ctx.lineWidth = 1.1;
        ctx.setLineDash([2, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Orbit Track
        ctx.beginPath();
        ctx.arc(cx, cy, scaledRadius, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Node Glow Halo
        const isSelected = node.id === selectedNodeId;
        const nodeGlowRadius = (isSelected ? 22 : 15) * scale;

        const nGlow = ctx.createRadialGradient(nx, ny, 3 * scale, nx, ny, nodeGlowRadius);
        nGlow.addColorStop(0, `${node.color}88`);
        nGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = nGlow;
        ctx.beginPath();
        ctx.arc(nx, ny, nodeGlowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Node Outer Ring
        ctx.beginPath();
        ctx.arc(nx, ny, 14 * scale, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? '#0C1C13' : '#FFFFFF';
        ctx.fill();
        ctx.strokeStyle = isSelected ? '#D9F36A' : node.color;
        ctx.lineWidth = isSelected ? 2.2 * scale : 1.4 * scale;
        ctx.stroke();

        // Node Emoji / Icon
        ctx.font = `${Math.max(10, Math.round(13 * scale))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.emoji, nx, ny);

        // Floating Portions Tag
        ctx.font = `bold ${Math.max(8, Math.round(8.5 * scale))}px sans-serif`;
        ctx.fillStyle = isDark ? '#E8F0EB' : '#163D2B';
        ctx.fillText(`${node.portions} ${node.unit.split(' ')[0]}`, nx, ny + 20 * scale);
      });

      // 5. Flow Particles traveling outward
      flowParticles.forEach((p) => {
        p.speed = 0.8 * speedMultiplier;
        const dist = (scanAngle * 40 * p.speed + p.angle * 30) % 200;
        const px = cx + Math.cos(p.angle) * dist;
        const py = cy + Math.sin(p.angle) * dist;

        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(217, 243, 106, ${0.6 - dist / 350})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [selectedNodeId, speedMultiplier, pulseCount]);

  const handleSimulateSurplus = () => {
    setPulseCount((prev) => prev + 1);
  };

  return (
    <div className={`relative w-full h-full select-none flex flex-col justify-between p-3 sm:p-6 ${className}`}>
      {/* Top HUD Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/95 dark:bg-[#12241B]/95 backdrop-blur-md border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <span className="text-[11px] sm:text-xs font-bold text-[#163D2B] dark:text-[#D9F36A] flex items-center gap-1.5 whitespace-nowrap">
            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#DCA647] shrink-0" />
            <span className="hidden sm:inline">Circular Surplus Radar (2D Motion)</span>
            <span className="sm:hidden">Surplus Radar (2D)</span>
          </span>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1 bg-white/95 dark:bg-[#12241B]/95 backdrop-blur-md px-1.5 py-1 rounded-xl border border-[#DCE7D8] dark:border-[#1E3A2C] text-[11px] sm:text-xs">
          <button
            onClick={() => setSpeedMultiplier(0.7)}
            className={`px-2 py-0.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              speedMultiplier === 0.7
                ? 'bg-[#163D2B] dark:bg-emerald-600 text-white'
                : 'text-[#737C73] dark:text-[#95A599] hover:text-[#163D2B]'
            }`}
          >
            Eco
          </button>
          <button
            onClick={() => setSpeedMultiplier(1)}
            className={`px-2 py-0.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              speedMultiplier === 1
                ? 'bg-[#163D2B] dark:bg-emerald-600 text-white'
                : 'text-[#737C73] dark:text-[#95A599] hover:text-[#163D2B]'
            }`}
          >
            1x
          </button>
          <button
            onClick={() => setSpeedMultiplier(1.8)}
            className={`px-2 py-0.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              speedMultiplier === 1.8
                ? 'bg-[#163D2B] dark:bg-emerald-600 text-white'
                : 'text-[#737C73] dark:text-[#95A599] hover:text-[#163D2B]'
            }`}
          >
            Rush ⚡
          </button>
        </div>
      </div>

      {/* 2D Canvas Flow Stage */}
      <div className="relative w-full h-[280px] xs:h-[320px] sm:h-[360px] flex items-center justify-center my-1 sm:my-2">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Interactive Food Node Selector Bar */}
      <div className="z-10 space-y-2.5 sm:space-y-3">
        {/* Category Pills */}
        <div className="grid grid-cols-4 gap-1.5 bg-white/90 dark:bg-[#12241B]/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-sm">
          {nodesRef.current.map((node) => {
            const isSelected = node.id === selectedNodeId;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#163D2B] dark:bg-[#D9F36A] text-white dark:text-[#10291F] shadow-sm'
                    : 'text-[#737C73] dark:text-[#95A599] hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <span>{node.emoji}</span>
                <span className="hidden xs:inline">{node.category.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Node Live Telemetry Card */}
        <div className="bg-white/95 dark:bg-[#12241B]/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-left">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg sm:text-xl shrink-0 shadow-xs"
              style={{ backgroundColor: `${selectedNode.color}25` }}
            >
              {selectedNode.emoji}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#163D2B] dark:text-[#E8F0EB] flex items-center gap-1.5 flex-wrap">
                <span className="truncate">{selectedNode.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 shrink-0">
                  {selectedNode.portions} {selectedNode.unit}
                </span>
              </div>
              <div className="text-[11px] text-[#737C73] dark:text-[#96A89D] mt-0.5 flex items-center gap-1.5 flex-wrap">
                <span className="truncate">Temp: {selectedNode.temperature}</span>
                <span>·</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium whitespace-nowrap">
                  {selectedNode.co2SavedKg} kg CO₂e saved
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-900/60">
              <Clock className="w-3.5 h-3.5" />
              <span>{selectedNode.timeLeft} left</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
