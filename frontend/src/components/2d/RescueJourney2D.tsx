import React, { useState, useEffect } from 'react';
import { ChefHat, ShieldCheck, Scale, HeartHandshake, CheckCircle2, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

interface Phase {
  id: number;
  number: string;
  title: string;
  subtitle: string;
  icon: any;
  emoji: string;
  color: string;
  badge: string;
  description: string;
}

const PHASES: Phase[] = [
  {
    id: 0,
    number: '01',
    title: 'Commercial Kitchen Surplus',
    subtitle: '60-Second Declaration',
    icon: ChefHat,
    emoji: '🥖',
    color: '#DCA647',
    badge: 'Step 1: Declaration',
    description: 'Commercial dining halls, bakeries, and cafes declare unsold edible surplus with prep timestamps, storage condition (warm/chilled), and mandatory allergen declarations.'
  },
  {
    id: 1,
    number: '02',
    title: 'Autonomous Safety Routing',
    subtitle: 'Zero-Allergen Risk Filter',
    icon: ShieldCheck,
    emoji: '🛡️',
    color: '#52B788',
    badge: 'Step 2: Verification',
    description: 'The AWS Strands Agents engine executes deterministic allergen verification tools, filtering out conflicts before proposing pairings.'
  },
  {
    id: 2,
    number: '03',
    title: 'Environmental Accounting',
    subtitle: '2.5 kg CO₂e / kg Baseline',
    icon: Scale,
    emoji: '⚖️',
    color: '#D9F36A',
    badge: 'Step 3: Impact Ledger',
    description: 'Verifiable ledger calculates mass and methane avoidance. Only confirmed handovers count toward the regional sustainability total.'
  },
  {
    id: 3,
    number: '04',
    title: 'Verified Handover & Meal Served',
    subtitle: 'Code-Secured Collection',
    icon: HeartHandshake,
    emoji: '📦',
    color: '#2D6A4F',
    badge: 'Step 4: Fulfillment',
    description: 'Recipients present their unique reference code (e.g. LP-529-SAND) at the counter. The provider verifies the code, writes an S3 receipt, and completes the rescue.'
  }
];

interface RescueJourney2DProps {
  className?: string;
}

export const RescueJourney2D: React.FC<RescueJourney2DProps> = ({ className = '' }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % PHASES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [autoPlay]);

  const current = PHASES[activeStep];
  const Icon = current.icon;

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#10291F] via-[#143224] to-[#0A1811] dark:from-[#0B1A12] dark:via-[#11271C] dark:to-[#08150E] p-5 sm:p-8 text-white border border-white/10 shadow-2xl ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D9F36A] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#DCA647]" />
            Interactive Rescue Pipeline (2D Motion)
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
              onClick={() => {
                setActiveStep(idx);
                setAutoPlay(false);
              }}
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

      {/* 2D Animated Conveyor Pipeline Stage */}
      <div className="my-6 py-4 px-2 sm:px-6 bg-black/20 rounded-2xl border border-white/5 relative overflow-hidden">
        {/* Animated Connecting Track */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-white/10 rounded-full" />
        <div
          className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-gradient-to-r from-[#DCA647] via-[#52B788] to-[#D9F36A] rounded-full transition-all duration-700"
          style={{ width: `${((activeStep + 1) / PHASES.length) * 100}%` }}
        />

        {/* 4 Animated Pipeline Stations */}
        <div className="grid grid-cols-4 gap-2 relative z-10">
          {PHASES.map((p, idx) => {
            const isCurrent = activeStep === idx;
            const isDone = activeStep > idx;
            const StepIcon = p.icon;

            return (
              <button
                key={p.id}
                onClick={() => {
                  setActiveStep(idx);
                  setAutoPlay(false);
                }}
                className={`flex flex-col items-center text-center p-2 sm:p-3 rounded-2xl transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-white/15 backdrop-blur-md shadow-lg scale-105'
                    : 'hover:bg-white/5 opacity-70'
                }`}
              >
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl mb-2 transition-transform duration-300 ${
                    isCurrent ? 'animate-bounce shadow-md' : ''
                  }`}
                  style={{
                    backgroundColor: isCurrent ? p.color : isDone ? '#52B788' : 'rgba(255,255,255,0.08)',
                    color: '#10291F'
                  }}
                >
                  {p.emoji}
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-white truncate max-w-full">
                  {p.title.split(' ')[0]}
                </span>
                <span className="text-[9px] text-[#D9F36A] hidden sm:block mt-0.5">
                  Phase {p.number}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail Callout Card for Active Step */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shrink-0 shadow-md text-xl"
            style={{ backgroundColor: current.color, color: '#10291F' }}
          >
            {current.emoji}
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
            <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">
              {current.title}
            </h4>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-neutral-200 sm:max-w-md leading-relaxed sm:text-right">
          {current.description}
        </p>
      </div>
    </div>
  );
};
