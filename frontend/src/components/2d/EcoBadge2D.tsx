import React from 'react';
import { Leaf, ShieldCheck, Sparkles } from 'lucide-react';

interface EcoBadge2DProps {
  className?: string;
}

export const EcoBadge2D: React.FC<EcoBadge2DProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-40 h-40 sm:w-52 sm:h-52 flex items-center justify-center select-none ${className}`}>
      {/* Outer Rotating Eco Dashed Track */}
      <div className="absolute inset-2 rounded-full border-2 border-dashed border-[#D9F36A]/50 animate-[spin_20s_linear_infinite]" />

      {/* Middle Glowing Energy Ring */}
      <div className="absolute inset-5 rounded-full border border-emerald-400/40 bg-emerald-500/10 dark:bg-emerald-500/15 animate-pulse backdrop-blur-xs" />

      {/* Inner Hexagonal Shield Emblem */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#163D2B] via-[#1B4B35] to-[#10291F] dark:from-[#0E2017] dark:via-[#193B2B] dark:to-[#0B1A12] border-2 border-[#D9F36A] shadow-2xl flex flex-col items-center justify-center text-center p-3 transform transition-transform hover:scale-105 duration-300">
        <div className="w-9 h-9 rounded-xl bg-[#D9F36A] text-[#10291F] flex items-center justify-center mb-1 shadow-md">
          <Leaf className="w-5 h-5 text-[#163D2B]" />
        </div>
        <span className="text-[10px] font-bold text-[#D9F36A] uppercase tracking-wider">
          Verified
        </span>
        <span className="text-[8px] font-semibold text-white/90 uppercase tracking-widest">
          Zero Landfill
        </span>
      </div>

      {/* Orbiting Sparkle Satellite Badges */}
      <div className="absolute -top-1 right-4 bg-white/90 dark:bg-[#12241B]/90 backdrop-blur-sm px-2 py-1 rounded-full border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-sm flex items-center gap-1 text-[10px] font-bold text-[#163D2B] dark:text-[#D9F36A] animate-bounce">
        <Sparkles className="w-3 h-3 text-[#DCA647]" />
        <span>100% Edible</span>
      </div>
    </div>
  );
};
