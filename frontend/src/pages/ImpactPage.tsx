import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Leaf,
  ShieldCheck,
  CheckCircle2,
  PieChart as PieIcon,
  RefreshCw,
  Scale,
  Globe2,
  Sparkles
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { api } from '../api/client';
import { ImpactSummary, ImpactTimeseriesPoint, ImpactCategoryPoint } from '../types';
import { useDemo } from '../context/DemoContext';
import { RescueGlobe3D } from '../components/3d/RescueGlobe3D';

const CATEGORY_COLORS = ['#163D2B', '#D9F36A', '#DCA647', '#2D6A4F', '#74C69D'];

export const ImpactPage: React.FC = () => {
  const { refreshKey } = useDemo();

  const [summary, setSummary] = useState<ImpactSummary | null>(null);
  const [timeseries, setTimeseries] = useState<ImpactTimeseriesPoint[]>([]);
  const [categories, setCategories] = useState<ImpactCategoryPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchImpact = async () => {
    setLoading(true);
    try {
      const [sum, time, cats] = await Promise.all([
        api.getImpactSummary(),
        api.getImpactTimeseries(),
        api.getImpactCategories()
      ]);
      setSummary(sum);
      setTimeseries(time);
      setCategories(cats);
    } catch (err) {
      console.error('Impact data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImpact();
  }, [refreshKey]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 text-left">
      {/* Header */}
      <div className="border-b border-[#DCE7D8] dark:border-[#1E3A2C] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#163D2B]/10 dark:bg-[#D9F36A]/10 text-[#163D2B] dark:text-[#D9F36A] mb-2">
            <Leaf className="w-3.5 h-3.5" />
            <span>Environmental Impact Ledger</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#163D2B] dark:text-[#E8F0EB]">
            Measuring Real Food Rescued.
          </h1>
          <p className="text-sm text-[#737C73] dark:text-[#96A89D] mt-1 max-w-xl">
            Strictly derived from confirmed completed handovers. No uncollected or speculative estimates.
          </p>
        </div>

        <button
          onClick={fetchImpact}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#12241B] border border-[#DCE7D8] dark:border-[#1E3A2C] text-[#163D2B] dark:text-[#E8F0EB] hover:bg-[#F8F6EF] dark:hover:bg-[#183124] transition-all self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Impact Ledger</span>
        </button>
      </div>

      {/* 3D INTERACTIVE RESCUE GLOBE HERO BANNER */}
      <section className="bg-gradient-to-br from-[#10291F] via-[#143224] to-[#0A1811] text-white rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#D9F36A] text-[#10291F]">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Planetary Resource Preservation</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-4xl font-bold leading-tight">
              Every meal saved preserves water, soil, and energy.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
              By connecting commercial kitchen surplus with community dining programs, LastPlate prevents organic methane emissions and ensures hard-earned agricultural resources feed people rather than waste incinerators.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-xs px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-[#D9F36A] font-semibold">
                ✓ 2.5 kg CO₂e Saved per kg Food
              </span>
              <span className="text-xs px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white font-medium">
                ✓ Verified Handover Auditing
              </span>
            </div>
          </div>

          {/* 3D Earth Orb Visual */}
          <div className="lg:col-span-5 h-64 sm:h-72 w-full relative flex items-center justify-center">
            <RescueGlobe3D />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full pointer-events-none flex items-center gap-1.5 whitespace-nowrap border border-white/10">
              <Sparkles className="w-3 h-3 text-[#D9F36A]" />
              <span>Interactive 3D Eco Globe · Drag to rotate</span>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FOUR IMPACT METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-[#12241B] p-6 rounded-3xl border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-xs space-y-2 relative overflow-hidden">
          <div className="text-xs uppercase font-bold tracking-wider text-[#737C73] dark:text-[#96A89D]">
            Verified Portions Rescued
          </div>
          <div className="font-editorial text-4xl font-bold text-[#163D2B] dark:text-[#D9F36A]">
            {summary ? summary.total_portions_collected : '—'}
          </div>
          <p className="text-xs text-[#737C73] dark:text-[#96A89D] leading-relaxed">
            Completed handovers confirmed by recipient and provider.
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-[#12241B] p-6 rounded-3xl border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-xs space-y-2 relative overflow-hidden">
          <div className="text-xs uppercase font-bold tracking-wider text-[#737C73] dark:text-[#96A89D]">
            Estimated Waste Avoided
          </div>
          <div className="font-editorial text-4xl font-bold text-[#163D2B] dark:text-[#D9F36A]">
            {summary ? `${summary.estimated_kg_redistributed} kg` : '—'}
          </div>
          <p className="text-xs text-[#737C73] dark:text-[#96A89D] leading-relaxed">
            Calculated at <strong>{summary?.kg_per_portion_factor || 0.45} kg/portion</strong> (defensible benchmark).
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-[#12241B] p-6 rounded-3xl border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-xs space-y-2 relative overflow-hidden">
          <div className="text-xs uppercase font-bold tracking-wider text-[#737C73] dark:text-[#96A89D]">
            Estimated CO₂e Prevented
          </div>
          <div className="font-editorial text-4xl font-bold text-emerald-700 dark:text-emerald-400">
            {summary ? `${summary.co2_avoided_kg_estimate} kg` : '—'}
          </div>
          <p className="text-xs text-[#737C73] dark:text-[#96A89D] leading-relaxed">
            Based on FAO standard benchmark (~2.5 kg CO₂e per kg food saved).
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-[#12241B] p-6 rounded-3xl border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-xs space-y-2 relative overflow-hidden">
          <div className="text-xs uppercase font-bold tracking-wider text-[#737C73] dark:text-[#96A89D]">
            Successful Pickup Rate
          </div>
          <div className="font-editorial text-4xl font-bold text-[#9E6E18] dark:text-[#DCA647]">
            {summary ? `${summary.successful_pickup_rate_pct}%` : '—'}
          </div>
          <p className="text-xs text-[#737C73] dark:text-[#96A89D] leading-relaxed">
            Ratio of claimed reservations that resulted in confirmed handovers.
          </p>
        </div>
      </div>

      {/* THREE-TIER PIPELINE BREAKDOWN */}
      <div className="bg-[#10291F] dark:bg-[#060E0A] text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border border-white/5 dark:border-[#1E3A2C]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <h3 className="font-editorial text-xl sm:text-2xl font-bold text-white">
              Food Rescue Funnel Integrity
            </h3>
            <p className="text-xs text-neutral-300">
              Clear mathematical separation between listings, claims, and confirmed handovers.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#163D2B] dark:bg-[#1A3326] text-[#D9F36A] self-start sm:self-auto">
            Strict Accounting
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
            <div className="text-xs font-semibold uppercase text-neutral-300">1. Listed Food</div>
            <div className="text-3xl font-bold text-white">
              {summary ? summary.total_portions_listed : '—'} <span className="text-sm font-normal text-neutral-400">portions</span>
            </div>
            <p className="text-[11px] text-neutral-300">Total surplus committed by kitchens</p>
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
            <div className="text-xs font-semibold uppercase text-[#DCA647]">2. Claimed / Reserved</div>
            <div className="text-3xl font-bold text-[#DCA647]">
              {summary ? summary.total_portions_claimed : '—'} <span className="text-sm font-normal text-neutral-400">portions</span>
            </div>
            <p className="text-[11px] text-neutral-300">Reserved by recipient communities</p>
          </div>

          <div className="p-4 bg-white/10 rounded-2xl border border-[#D9F36A]/40 space-y-1">
            <div className="text-xs font-semibold uppercase text-[#D9F36A]">3. Confirmed Collected</div>
            <div className="text-3xl font-bold text-[#D9F36A]">
              {summary ? summary.total_portions_collected : '—'} <span className="text-sm font-normal text-neutral-400">portions</span>
            </div>
            <p className="text-[11px] text-[#D9F36A]/90 font-medium">★ Counted toward impact totals</p>
          </div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Timeseries Rescue Activity Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-[#12241B] p-6 sm:p-8 rounded-3xl border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-editorial text-xl font-bold text-[#163D2B] dark:text-[#E8F0EB]">
                Rescue Volume Over Time
              </h3>
              <p className="text-xs text-[#737C73] dark:text-[#96A89D]">
                Daily verified rescued portions and avoided waste
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-[#163D2B] dark:text-[#D9F36A]" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeseries}>
                <defs>
                  <linearGradient id="colorPortions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#163D2B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#163D2B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#737C73' }} />
                <YAxis tick={{ fontSize: 11, fill: '#737C73' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#163D2B',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="portions_collected"
                  name="Portions Rescued"
                  stroke="#163D2B"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorPortions)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rescued Categories Breakdown */}
        <div className="lg:col-span-5 bg-white dark:bg-[#12241B] p-6 sm:p-8 rounded-3xl border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-editorial text-xl font-bold text-[#163D2B] dark:text-[#E8F0EB]">
                Rescues by Food Category
              </h3>
              <p className="text-xs text-[#737C73] dark:text-[#96A89D]">Distribution across surplus streams</p>
            </div>
            <PieIcon className="w-5 h-5 text-[#163D2B] dark:text-[#D9F36A]" />
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" opacity={0.3} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#737C73' }} />
                <YAxis dataKey="category" type="category" width={110} tick={{ fontSize: 11, fill: '#737C73' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#163D2B',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="portions" name="Portions Rescued" radius={[0, 8, 8, 0]}>
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#DCE7D8]/60 dark:border-[#1E3A2C]">
            {categories.map((cat, idx) => (
              <div key={cat.category} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                  />
                  <span className="font-medium text-[#26332B] dark:text-[#E8F0EB]">{cat.category}</span>
                </div>
                <span className="font-bold text-[#163D2B] dark:text-[#D9F36A]">{cat.portions} portions ({cat.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* METHODOLOGY TRANSPARENCY NOTE */}
      <div className="p-6 bg-[#F8F6EF] dark:bg-[#12241B] rounded-3xl border border-[#DCE7D8] dark:border-[#1E3A2C] flex items-start gap-4 text-xs text-[#737C73] dark:text-[#96A89D] leading-relaxed">
        <Scale className="w-5 h-5 text-[#163D2B] dark:text-[#D9F36A] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-[#163D2B] dark:text-[#E8F0EB] font-semibold text-sm">
            Methodology & Assumptions Documentation
          </strong>
          <p>
            Portion-to-mass conversion assumption: 1 portion = 0.45 kg edible mass (standard catered meal baseline).
            Carbon avoidance assumption: 1 kg avoided food waste = 2.5 kg CO₂-equivalent emissions prevented (UN FAO Food Wastage Footprint methodology).
            LastPlate does not claim precision beyond documented empirical estimates.
          </p>
        </div>
      </div>
    </div>
  );
};
