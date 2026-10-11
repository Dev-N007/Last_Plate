import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Clock,
  ShieldCheck,
  TrendingUp,
  Leaf,
  UtensilsCrossed,
  CheckCircle2,
  Building2,
  Users,
  Box,
  Image as ImageIcon
} from 'lucide-react';
import { api } from '../api/client';
import { FoodListing, ImpactSummary } from '../types';
import { UrgencyBadge } from '../components/ui/UrgencyBadge';
import { useDemo } from '../context/DemoContext';
import { FoodRescueFlow2D } from '../components/2d/FoodRescueFlow2D';
import { AmbientHeroCanvas2D } from '../components/2d/AmbientHeroCanvas2D';
import { EcoBadge2D } from '../components/2d/EcoBadge2D';
import { LiveActivityBar } from '../components/layout/LiveActivityBar';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshKey } = useDemo();

  const [impact, setImpact] = useState<ImpactSummary | null>(null);
  const [urgentListings, setUrgentListings] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroViewMode, setHeroViewMode] = useState<'2d' | 'photo'>('2d');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [impactData, urgentData] = await Promise.all([
          api.getImpactSummary(),
          api.getUrgentListings(6)
        ]);
        setImpact(impactData);
        setUrgentListings(urgentData);
      } catch (err) {
        console.error('Failed to load landing data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshKey]);

  const featuredUrgent = urgentListings[0];

  return (
    <div className="space-y-16 pb-20 overflow-hidden text-left">
      {/* HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 lg:pt-16">
        {/* Ambient 2D Background Canvas */}
        <AmbientHeroCanvas2D />

        {/* Ambient atmospheric lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-[#DCE7D8]/50 dark:from-[#163D2B]/30 via-[#D9F36A]/20 dark:via-[#D9F36A]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headlines & Call to Actions */}
            <div className="lg:col-span-7 space-y-8">
              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#12241B]/90 backdrop-blur-md border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#163D2B] dark:bg-[#D9F36A] animate-pulse"></span>
                <span className="text-xs font-semibold text-[#163D2B] dark:text-[#D9F36A]">
                  Zero-Waste Community Initiative · Verified Edible Surplus
                </span>
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#163D2B] dark:text-[#E8F0EB] leading-[1.06]">
                  Good food. <br />
                  <span className="italic font-normal text-[#10291F] dark:text-[#D9F36A]">A second chance.</span>
                </h1>
                <p className="text-base sm:text-lg text-[#737C73] dark:text-[#96A89D] max-w-xl leading-relaxed font-normal">
                  Every day, perfectly good food goes unsold across commercial canteens, bakeries, and cafes.
                  LastPlate helps it find the people who need it—before time runs out.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1">
                <Link
                  to="/discover"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#163D2B] dark:bg-[#D9F36A] text-white dark:text-[#10291F] text-base font-semibold hover:bg-[#10291F] dark:hover:bg-white shadow-md hover:shadow-lg transition-all group cursor-pointer"
                >
                  <span>Explore surplus food</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </Link>

                <Link
                  to="/list-surplus"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white/90 dark:bg-[#12241B]/90 backdrop-blur-sm text-[#163D2B] dark:text-[#E8F0EB] border border-[#DCE7D8] dark:border-[#1E3A2C] text-base font-semibold hover:bg-[#F8F6EF] dark:hover:bg-[#183124] shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                >
                  <span>List surplus food</span>
                </Link>
              </div>

              {/* Live Impact Counters (Upgraded Glassmorphic Ticker) */}
              <div className="pt-8 border-t border-[#DCE7D8]/80 dark:border-[#1E3A2C] grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white/60 dark:bg-[#12241B]/60 backdrop-blur-xs p-3.5 rounded-2xl border border-[#DCE7D8]/60 dark:border-[#1E3A2C]/60 space-y-1">
                  <div className="text-2xl sm:text-3xl font-bold text-[#163D2B] dark:text-[#D9F36A] tracking-tight">
                    {impact ? impact.total_portions_collected : '22'}
                  </div>
                  <div className="text-[11px] text-[#737C73] dark:text-[#96A89D] font-medium uppercase tracking-wider">Portions Rescued</div>
                </div>

                <div className="bg-white/60 dark:bg-[#12241B]/60 backdrop-blur-xs p-3.5 rounded-2xl border border-[#DCE7D8]/60 dark:border-[#1E3A2C]/60 space-y-1">
                  <div className="text-2xl sm:text-3xl font-bold text-[#163D2B] dark:text-[#D9F36A] tracking-tight">
                    {impact ? `${impact.estimated_kg_redistributed} kg` : '9.9 kg'}
                  </div>
                  <div className="text-[11px] text-[#737C73] dark:text-[#96A89D] font-medium uppercase tracking-wider">Waste Avoided</div>
                </div>

                <div className="bg-white/60 dark:bg-[#12241B]/60 backdrop-blur-xs p-3.5 rounded-2xl border border-[#DCE7D8]/60 dark:border-[#1E3A2C]/60 space-y-1">
                  <div className="text-2xl sm:text-3xl font-bold text-[#163D2B] dark:text-[#D9F36A] tracking-tight">
                    {impact ? impact.total_completed_pickups : '2'}
                  </div>
                  <div className="text-[11px] text-[#737C73] dark:text-[#96A89D] font-medium uppercase tracking-wider">Confirmed Pickups</div>
                </div>

                <div className="bg-white/60 dark:bg-[#12241B]/60 backdrop-blur-xs p-3.5 rounded-2xl border border-[#DCE7D8]/60 dark:border-[#1E3A2C]/60 space-y-1">
                  <div className="text-2xl sm:text-3xl font-bold text-[#163D2B] dark:text-[#D9F36A] tracking-tight">
                    {impact ? impact.total_active_partners : '4'}
                  </div>
                  <div className="text-[11px] text-[#737C73] dark:text-[#96A89D] font-medium uppercase tracking-wider">Active Partners</div>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Three.js Plate & Visual Box */}
            {/* Right Column: 2D Interactive Rescue Flow & Visual Box */}
            <div className="lg:col-span-5 relative w-full">
              {/* Mode Toggle Pill */}
              <div className="flex items-center justify-center mb-3">
                <div className="bg-white/90 dark:bg-[#12241B]/90 backdrop-blur-md p-1 rounded-2xl border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-xs flex items-center gap-1">
                  <button
                    onClick={() => setHeroViewMode('2d')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      heroViewMode === '2d'
                        ? 'bg-[#163D2B] dark:bg-[#D9F36A] text-white dark:text-[#10291F] shadow-xs'
                        : 'text-[#737C73] dark:text-[#96A89D] hover:text-[#163D2B] dark:hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Visual Rescue Flow</span>
                  </button>
                  <button
                    onClick={() => setHeroViewMode('photo')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      heroViewMode === 'photo'
                        ? 'bg-[#163D2B] dark:bg-[#D9F36A] text-white dark:text-[#10291F] shadow-xs'
                        : 'text-[#737C73] dark:text-[#96A89D] hover:text-[#163D2B] dark:hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Editorial Photo</span>
                  </button>
                </div>
              </div>

              {/* Main Visual Box */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/80 dark:border-[#1E3A2C] w-full max-w-lg mx-auto bg-gradient-to-b from-white/95 dark:from-[#12241B] via-[#F8F6EF]/90 dark:via-[#0F2218] to-[#DCE7D8]/50 dark:to-[#0B1A12]">
                {heroViewMode === '2d' ? (
                  <div className="w-full relative flex items-center justify-center min-h-[480px]">
                    <FoodRescueFlow2D />
                  </div>
                ) : (
                  <div className="aspect-4/5 w-full relative">
                    <img
                      src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80"
                      alt="Fresh edible surplus meal ready for community rescue"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#D9F36A] text-[#10291F] shadow-sm">
                        <Sparkles className="w-3.5 h-3.5" />
                        Edible & Ready to Rescue
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating Urgent Card */}
              {featuredUrgent ? (
                <div className="sm:absolute -bottom-8 -left-6 z-20 mt-6 sm:mt-0 max-w-sm w-full bg-white/95 dark:bg-[#12241B]/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-xl animate-float">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <UrgencyBadge
                      urgency={featuredUrgent.urgency_level}
                      minutesRemaining={featuredUrgent.minutes_remaining}
                    />
                    <span className="text-[11px] font-bold text-[#163D2B] dark:text-[#D9F36A] bg-[#DCE7D8]/60 dark:bg-[#1C3527] px-2 py-0.5 rounded-md">
                      {featuredUrgent.available_portions} portions left
                    </span>
                  </div>

                  <h4 className="font-editorial text-base font-bold text-[#163D2B] dark:text-[#E8F0EB] truncate">
                    {featuredUrgent.name}
                  </h4>
                  <p className="text-xs text-[#737C73] dark:text-[#96A89D] truncate mt-0.5">
                    {featuredUrgent.provider_name} · {featuredUrgent.pickup_location.split(',')[0]}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-[#DCE7D8]/60 dark:border-[#1E3A2C] flex items-center justify-between">
                    <span className="text-[11px] text-[#737C73] dark:text-[#96A89D]">Approaching cutoff</span>
                    <button
                      onClick={() => navigate('/discover')}
                      className="text-xs font-bold text-[#163D2B] dark:text-[#D9F36A] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Claim now</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="sm:absolute -bottom-8 -left-6 z-20 mt-6 sm:mt-0 max-w-sm w-full bg-white/95 dark:bg-[#12241B]/95 backdrop-blur-md rounded-2xl p-4 border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-xl">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#163D2B] dark:text-[#D9F36A]">
                    <Clock className="w-4 h-4 text-[#DCA647]" />
                    <span>Live surplus monitoring active</span>
                  </div>
                  <p className="text-xs text-[#737C73] dark:text-[#96A89D] mt-1">
                    Listings expire automatically when pickup windows close.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* LIVE ACTIVITY MARQUEE STRIP */}
      <LiveActivityBar />

      {/* HOW IT WORKS: 3 STEPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#163D2B] dark:text-[#D9F36A] bg-[#DCE7D8]/60 dark:bg-[#1C3527] px-3 py-1 rounded-full">
            The Rescue Workflow
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#163D2B] dark:text-[#E8F0EB]">
            Three steps before time runs out.
          </h2>
          <p className="text-sm text-[#737C73] dark:text-[#96A89D]">
            A seamless bridge connecting commercial surplus with hungry communities in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white dark:bg-[#12241B] rounded-3xl p-8 border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-left relative group">
            <div className="w-12 h-12 rounded-2xl bg-[#F8F6EF] dark:bg-[#1A3326] border border-[#DCE7D8] dark:border-[#1E3A2C] flex items-center justify-center text-[#163D2B] dark:text-[#D9F36A] font-bold text-lg mb-6 group-hover:bg-[#163D2B] dark:group-hover:bg-[#D9F36A] group-hover:text-[#D9F36A] dark:group-hover:text-[#10291F] transition-colors">
              01
            </div>
            <h3 className="font-editorial text-xl font-bold text-[#163D2B] dark:text-[#E8F0EB] mb-2">
              1. Share Surplus Food
            </h3>
            <p className="text-xs text-[#737C73] dark:text-[#96A89D] leading-relaxed">
              Canteens, bakeries, and cafes list unsold edible food in 60 seconds—specifying portions, preparation hour, pickup cutoff, and declared allergens.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-[#12241B] rounded-3xl p-8 border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-left relative group">
            <div className="w-12 h-12 rounded-2xl bg-[#F8F6EF] dark:bg-[#1A3326] border border-[#DCE7D8] dark:border-[#1E3A2C] flex items-center justify-center text-[#163D2B] dark:text-[#D9F36A] font-bold text-lg mb-6 group-hover:bg-[#163D2B] dark:group-hover:bg-[#D9F36A] group-hover:text-[#D9F36A] dark:group-hover:text-[#10291F] transition-colors">
              02
            </div>
            <h3 className="font-editorial text-xl font-bold text-[#163D2B] dark:text-[#E8F0EB] mb-2">
              2. Match with Recipients
            </h3>
            <p className="text-xs text-[#737C73] dark:text-[#96A89D] leading-relaxed">
              Recipients browse dietary-filtered listings, or coordinators use our <strong>Intelligent Autonomous Agent</strong> to prioritize imminent deadlines while strictly rejecting allergen conflicts.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-[#12241B] rounded-3xl p-8 border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-left relative group">
            <div className="w-12 h-12 rounded-2xl bg-[#F8F6EF] dark:bg-[#1A3326] border border-[#DCE7D8] dark:border-[#1E3A2C] flex items-center justify-center text-[#163D2B] dark:text-[#D9F36A] font-bold text-lg mb-6 group-hover:bg-[#163D2B] dark:group-hover:bg-[#D9F36A] group-hover:text-[#D9F36A] dark:group-hover:text-[#10291F] transition-colors">
              03
            </div>
            <h3 className="font-editorial text-xl font-bold text-[#163D2B] dark:text-[#E8F0EB] mb-2">
              3. Complete the Rescue
            </h3>
            <p className="text-xs text-[#737C73] dark:text-[#96A89D] leading-relaxed">
              Recipients arrive with unique reference codes, inspect food, and confirm handover. Only verified collections advance the environmental impact ledger.
            </p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER (With 3D Eco Gem Badge) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#10291F] via-[#143224] to-[#0A1811] dark:from-[#0B1A12] dark:via-[#11271C] dark:to-[#08150E] rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl border border-white/10 dark:border-[#1E3A2C]">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-6 text-left">
              <span className="text-xs uppercase font-bold tracking-widest text-[#D9F36A] bg-[#163D2B] px-3.5 py-1 rounded-full">
                Join the Zero-Waste Movement
              </span>
              <h2 className="font-editorial text-3xl sm:text-5xl font-bold leading-tight">
                Don’t let wholesome food end up in a landfill.
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed font-normal max-w-xl">
                Whether you are running a college canteen with surplus evening meals or representing a student hostel, LastPlate turns wasted food into shared nourishment.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 pt-2">
                <Link
                  to="/discover"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#D9F36A] text-[#10291F] text-sm font-bold hover:bg-white transition-all shadow-md cursor-pointer text-center"
                >
                  Browse Available Surplus
                </Link>
                <Link
                  to="/list-surplus"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#163D2B] dark:bg-[#1C3527] text-white text-sm font-semibold hover:bg-[#10291F] border border-white/20 transition-all cursor-pointer text-center"
                >
                  List Your Kitchen's Surplus
                </Link>
              </div>
            </div>

            {/* 2D Eco Gem Badge in CTA */}
            <div className="md:col-span-4 flex items-center justify-center">
              <EcoBadge2D />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

