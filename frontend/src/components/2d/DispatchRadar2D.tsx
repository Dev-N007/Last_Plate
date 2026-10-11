import React, { useEffect, useRef } from 'react';

export const DispatchRadar2D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let scanAngle = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Simulated dispatch points
    const points = [
      { x: 0.35, y: 0.35, label: 'Kitchen A', color: '#D9F36A' },
      { x: 0.72, y: 0.42, label: 'Bakery', color: '#DCA647' },
      { x: 0.52, y: 0.75, label: 'Hostel B', color: '#52B788' },
      { x: 0.28, y: 0.65, label: 'Shelter', color: '#80ED99' }
    ];

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Radar Circles
      [35, 65, 95].forEach((r) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(217, 243, 106, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Grid crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - 95, cy);
      ctx.lineTo(cx + 95, cy);
      ctx.moveTo(cx, cy - 95);
      ctx.lineTo(cx, cy + 95);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Radar Sweep
      scanAngle += 0.03;
      const sweep = ctx.createConicGradient(scanAngle, cx, cy);
      sweep.addColorStop(0, 'rgba(217, 243, 106, 0.35)');
      sweep.addColorStop(0.15, 'rgba(82, 183, 136, 0.05)');
      sweep.addColorStop(0.3, 'transparent');
      sweep.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(cx, cy, 95, 0, Math.PI * 2);
      ctx.fillStyle = sweep;
      ctx.fill();

      // Dispatch Nodes
      points.forEach((p, idx) => {
        const px = p.x * w;
        const py = p.y * h;

        // Connecting dashed line to center
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(px, py);
        ctx.strokeStyle = `${p.color}33`;
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Node dot
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Node ping ring
        ctx.beginPath();
        ctx.arc(px, py, 7 + Math.sin(scanAngle * 3 + idx) * 2, 0, Math.PI * 2);
        ctx.strokeStyle = `${p.color}88`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
