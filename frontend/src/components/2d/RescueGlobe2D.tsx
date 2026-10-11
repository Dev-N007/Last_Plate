import React, { useEffect, useRef, useState } from 'react';
import { Globe2, Sparkles, MapPin, Leaf } from 'lucide-react';

interface HubNode {
  name: string;
  x: number;
  y: number;
  portions: number;
  co2: number;
  status: string;
}

const HUBS: HubNode[] = [
  { name: 'Campus Central Dining', x: 0.35, y: 0.42, portions: 42, co2: 47.2, status: 'Active Dispatch' },
  { name: 'Hostel Block Canteen', x: 0.62, y: 0.38, portions: 28, co2: 31.5, status: 'Active Dispatch' },
  { name: 'Metro Cafe Hub', x: 0.48, y: 0.68, portions: 35, co2: 39.4, status: 'Completed' },
  { name: 'Artisan Bakery', x: 0.75, y: 0.60, portions: 19, co2: 21.4, status: 'Active Dispatch' }
];

export const RescueGlobe2D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeHubIndex, setActiveHubIndex] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let rotation = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(cx, cy) - 25;

      ctx.clearRect(0, 0, w, h);

      // Globe Base Atmosphere Glow
      const globeGlow = ctx.createRadialGradient(cx, cy, r * 0.4, cx, cy, r);
      globeGlow.addColorStop(0, '#193B2B');
      globeGlow.addColorStop(0.85, '#0E2419');
      globeGlow.addColorStop(1, 'rgba(82, 183, 136, 0.4)');

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = globeGlow;
      ctx.fill();
      ctx.strokeStyle = '#D9F36A';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Latitude & Longitude Arc Rings
      rotation += 0.005;
      for (let lat = -2; lat <= 2; lat++) {
        const latY = cy + (lat / 3) * (r * 0.8);
        const latR = Math.sqrt(Math.max(0, r * r - Math.pow(latY - cy, 2)));

        ctx.beginPath();
        ctx.ellipse(cx, latY, latR, latR * 0.35, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(217, 243, 106, 0.12)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Longitude Arcs with simulated spherical spin
      for (let lon = 0; lon < 4; lon++) {
        const offset = (rotation + (lon * Math.PI) / 4) % (Math.PI);
        const lonW = Math.sin(offset) * r;

        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.abs(lonW), r, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(82, 183, 136, 0.15)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Hub Markers on Globe
      HUBS.forEach((hub, idx) => {
        const hx = cx - r * 0.7 + hub.x * (r * 1.4);
        const hy = cy - r * 0.7 + hub.y * (r * 1.4);

        const isCurrent = idx === activeHubIndex;

        // Pulse ring
        ctx.beginPath();
        ctx.arc(hx, hy, isCurrent ? 8 : 4.5, 0, Math.PI * 2);
        ctx.fillStyle = isCurrent ? '#D9F36A' : '#52B788';
        ctx.fill();

        if (isCurrent) {
          ctx.beginPath();
          ctx.arc(hx, hy, 14, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(217, 243, 106, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    const interval = setInterval(() => {
      setActiveHubIndex((prev) => (prev + 1) % HUBS.length);
    }, 3200);

    return () => {
      window.removeEventListener('resize', resize);
      clearInterval(interval);
      cancelAnimationFrame(animId);
    };
  }, [activeHubIndex]);

  const activeHub = HUBS[activeHubIndex];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none">
      <canvas ref={canvasRef} className="w-full h-48 sm:h-56 block" />

      {/* Floating Active Regional Hub Card */}
      <div className="absolute bottom-1 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 flex items-center gap-2 text-xs text-white shadow-lg">
        <span className="w-2 h-2 rounded-full bg-[#D9F36A] animate-ping"></span>
        <span className="font-bold text-[#D9F36A]">{activeHub.name}:</span>
        <span className="text-neutral-200">{activeHub.portions} portions ({activeHub.co2} kg CO₂e)</span>
      </div>
    </div>
  );
};
