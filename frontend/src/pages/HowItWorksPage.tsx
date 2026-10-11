import React from 'react';
import {
  BookOpen,
  Sparkles,
  ShieldCheck,
  Scale,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Leaf,
  Cpu,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { RescueJourney2D } from '../components/2d/RescueJourney2D';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-14 text-left">
      {/* Header */}
      <div className="border-b border-[#DCE7D8] dark:border-[#1E3A2C] pb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#163D2B]/10 dark:bg-[#D9F36A]/10 text-[#163D2B] dark:text-[#D9F36A]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Operational & Scientific Transparency</span>
        </div>
        <h1 className="font-editorial text-4xl sm:text-6xl font-bold text-[#163D2B] dark:text-[#E8F0EB]">
          How LastPlate Works.
        </h1>
        <p className="text-base text-[#737C73] dark:text-[#96A89D] max-w-2xl leading-relaxed">
          A comprehensive breakdown of our surplus matching architecture, allergen safety protocols, environmental accounting, and intelligent agent dispatch integration.
        </p>
      </div>

      {/* SECTION 1: SYSTEM LIFECYCLE WITH 3D PIPELINE */}
      <section className="space-y-6">
        <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#163D2B] dark:text-[#E8F0EB]">
          1. The Rescue Lifecycle
        </h2>

        {/* 2D Interactive Pipeline Corridor */}
        <RescueJourney2D className="mb-6 shadow-xl" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white dark:bg-[#12241B] rounded-3xl border border-[#DCE7D8] dark:border-[#1E3A2C] space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#F8F6EF] dark:bg-[#1A3326] flex items-center justify-center font-bold text-[#163D2B] dark:text-[#D9F36A]">
              A
            </div>
            <h3 className="font-editorial text-lg font-bold text-[#163D2B] dark:text-[#E8F0EB]">
              Surplus Intake & Expiration Window
            </h3>
            <p className="text-xs text-[#737C73] dark:text-[#96A89D] leading-relaxed">
              Food businesses publish edible surplus with exact preparation hours, pickup location, and explicit expiration cutoff times. When the deadline passes, our backend auto-marks the listing as expired, preventing unsafe claims.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-[#12241B] rounded-3xl border border-[#DCE7D8] dark:border-[#1E3A2C] space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#F8F6EF] dark:bg-[#1A3326] flex items-center justify-center font-bold text-[#163D2B] dark:text-[#D9F36A]">
              B
            </div>
            <h3 className="font-editorial text-lg font-bold text-[#163D2B] dark:text-[#E8F0EB]">
              Atomic Inventory Locking
            </h3>
            <p className="text-xs text-[#737C73] dark:text-[#96A89D] leading-relaxed">
              When a recipient reserves portions, database transactions decrement inventory in real time with row-level safeguards, eliminating duplicate or negative claims. If a recipient cancels, portions are instantly released back to the marketplace.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-[#12241B] rounded-3xl border border-[#DCE7D8] dark:border-[#1E3A2C] space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#F8F6EF] dark:bg-[#1A3326] flex items-center justify-center font-bold text-[#163D2B] dark:text-[#D9F36A]">
              C
            </div>
            <h3 className="font-editorial text-lg font-bold text-[#163D2B] dark:text-[#E8F0EB]">
              Unique Pickup Verification
            </h3>
            <p className="text-xs text-[#737C73] dark:text-[#96A89D] leading-relaxed">
              Each claim receives a unique reference code (e.g. <code>LP-7492-X</code>). The recipient presents this at the dispatch point. Only after on-site inspection and handover confirmation is the claim marked as completed.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-[#12241B] rounded-3xl border border-[#DCE7D8] dark:border-[#1E3A2C] space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#F8F6EF] dark:bg-[#1A3326] flex items-center justify-center font-bold text-[#163D2B] dark:text-[#D9F36A]">
              D
            </div>
            <h3 className="font-editorial text-lg font-bold text-[#163D2B] dark:text-[#E8F0EB]">
              Ledger Accounting
            </h3>
            <p className="text-xs text-[#737C73] dark:text-[#96A89D] leading-relaxed">
              Only verified handovers count toward environmental impact metrics. Unclaimed, cancelled, or expired food is never counted as rescued meals.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: INTELLIGENT AUTONOMOUS DISPATCH ENGINE */}
      <section className="bg-gradient-to-br from-[#10291F] via-[#143224] to-[#0A1811] text-white rounded-3xl p-8 sm:p-10 space-y-6 shadow-xl border border-white/5 dark:border-[#1E3A2C]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#D9F36A] text-[#10291F]">
          <Cpu className="w-3.5 h-3.5" />
          <span>Core Autonomous Matching Technology</span>
        </div>

        <h2 className="font-editorial text-3xl sm:text-4xl font-bold">
          2. Intelligent Autonomous Distribution Architecture
        </h2>

        <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed max-w-3xl">
          LastPlate integrates an autonomous agent harness to power the intelligent Distribution Coordinator, pairing urgent food surplus with community kitchens in real time.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="bg-white/10 p-5 rounded-2xl border border-white/10 space-y-2">
            <h3 className="text-sm font-bold text-[#D9F36A] flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              Deterministic Tool Grounding
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              The agent registers the real application tool <code>find_eligible_food_matches</code>. The tool enforces deterministic business constraints: rejecting expired items, checking portion capacity, and <strong>strictly rejecting allergen conflicts</strong> before the AI agent generates reasoning.
            </p>
          </div>

          <div className="bg-white/10 p-5 rounded-2xl border border-white/10 space-y-2">
            <h3 className="text-sm font-bold text-[#D9F36A] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Offline & Failure Resilience
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              If an external model provider or API key is unavailable, LastPlate never halts. The system seamlessly falls back to deterministic rule analysis while clearly labeling the status as <code>offline_fallback</code>.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: ALLERGEN SAFETY & FOOD INTEGRITY */}
      <section className="space-y-6">
        <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#163D2B] dark:text-[#E8F0EB]">
          3. Food Safety & Allergen Transparency Policy
        </h2>

        <div className="bg-amber-50/80 dark:bg-amber-950/30 border-2 border-amber-200/90 dark:border-amber-800/60 rounded-3xl p-6 sm:p-8 space-y-4 text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-900 dark:text-amber-300">
            <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0" />
            <span>Strict Allergen Exclusion Rules</span>
          </div>
          <p>
            1. <strong>No Inferred Safety:</strong> The application NEVER infers that food is allergen-free from its title, description, or image. All allergens must be explicitly declared by the food provider.
          </p>
          <p>
            2. <strong>Hard Exclusion:</strong> If a recipient profile specifies an allergen to avoid (e.g. Peanuts, Gluten, Dairy), and a food listing declares that allergen, the matching engine permanently excludes the listing from candidate pairings.
          </p>
          <p>
            3. <strong>On-Site Recipient Inspection:</strong> LastPlate does not certify food safety. All recipients and coordinators are trained to verify visual freshness, packaging seal, and temperature upon collection.
          </p>
        </div>
      </section>

      {/* SECTION 4: IMPACT METHODOLOGY */}
      <section className="space-y-6">
        <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#163D2B] dark:text-[#E8F0EB]">
          4. Defensible Environmental Accounting
        </h2>

        <div className="bg-white dark:bg-[#12241B] rounded-3xl p-6 sm:p-8 border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-xs space-y-4 text-xs text-[#737C73] dark:text-[#96A89D] leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-sm text-[#163D2B] dark:text-[#E8F0EB]">
            <Scale className="w-5 h-5 text-[#163D2B] dark:text-[#D9F36A] shrink-0" />
            <span>Documented Calculation Methodology</span>
          </div>
          <ul className="space-y-2 list-disc list-inside">
            <li>
              <strong>Mass Estimation:</strong> 1 portion = 0.45 kg of edible food. This represents the average weight of a prepared hot meal or bakery portion based on commercial catering standards.
            </li>
            <li>
              <strong>Greenhouse Gas Avoidance:</strong> 1 kg avoided food waste = 2.5 kg CO₂-equivalent prevented (United Nations Food and Agriculture Organization benchmark for avoided methane generation).
            </li>
            <li>
              <strong>Honest Reporting:</strong> Figures are labeled as estimates. No fictitious offsets or carbon credits are represented.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};
