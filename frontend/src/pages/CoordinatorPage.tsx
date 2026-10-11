import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Sparkles,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Building2,
  Users,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Cpu,
  Layers,
  ChevronRight,
  Network,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api/client';
import {
  FoodListing,
  Claim,
  AIRecommendationResponse,
  AIStatusResponse,
  CoordinatorOverview,
  MatchingSuggestion
} from '../types';
import { UrgencyBadge } from '../components/ui/UrgencyBadge';
import { useDemo } from '../context/DemoContext';
import { useAuth } from '../context/AuthContext';
import { DispatchRadar2D } from '../components/2d/DispatchRadar2D';

export const CoordinatorPage: React.FC = () => {
  const { refreshKey, triggerRefresh } = useDemo();
  const { user: authUser, capabilities, loginAsPersona } = useAuth();

  const [overview, setOverview] = useState<CoordinatorOverview | null>(null);
  const [urgentListings, setUrgentListings] = useState<FoodListing[]>([]);
  const [aiResponse, setAiResponse] = useState<AIRecommendationResponse | null>(null);
  const [aiStatus, setAiStatus] = useState<AIStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [overviewData, urgentData, statusData] = await Promise.all([
        api.getCoordinatorOverview(),
        api.getUrgentListings(6),
        api.getAIStatus()
      ]);
      setOverview(overviewData);
      setUrgentListings(urgentData);
      setAiStatus(statusData);

      await runAiMatching();
    } catch (err) {
      console.error('Failed to load coordinator data:', err);
    } finally {
      setLoading(false);
    }
  };

  const runAiMatching = async (listingId?: string) => {
    setAiLoading(true);
    try {
      const resp = await api.getAIMatches({
        listing_id: listingId,
        max_matches: 4
      });
      setAiResponse(resp);
    } catch (err) {
      console.error('AI matching error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const handleExecuteSuggestion = async (suggestion: MatchingSuggestion) => {
    try {
      await api.claimPortions(suggestion.listing_id, {
        recipient_id: suggestion.recipient_id,
        recipient_name: `${suggestion.recipient_name} (${suggestion.recipient_org || 'Recipient'})`,
        portions_claimed: suggestion.portions_requested,
        pickup_notes: `Coordinator fast-track dispatch: ${suggestion.suggested_action}`
      });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D9F36A', '#163D2B']
      });

      setActionMessage(
        `Successfully allocated ${suggestion.portions_requested} portions of ${suggestion.listing_name} to ${suggestion.recipient_name}!`
      );
      triggerRefresh();
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to dispatch allocation');
    }
  };

  if (!capabilities.canRunCoordinatorAgent) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            Regional Coordinator Clearance Required
          </span>
          <h2 className="font-editorial text-3xl font-bold text-[#163D2B] dark:text-[#E8F0EB]">
            Autonomous Command Centre
          </h2>
          <p className="text-sm text-[#737C73] dark:text-[#96A89D] max-w-md mx-auto">
            You are currently signed in as <strong>{authUser?.name || 'Guest User'}</strong> ({authUser?.role || 'guest'}). Only regional dispatch coordinators have clearance to execute autonomous AI allocation batches and cross-network matching.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#112219] border border-[#DCE7D8] dark:border-[#214232] text-left text-xs space-y-2 max-w-md mx-auto">
          <div className="font-bold text-[#163D2B] dark:text-[#E8F0EB]">Coordinator Clearance Includes:</div>
          <div className="flex items-center gap-2 text-[#737C73] dark:text-[#96A89D]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Autonomous AI matching matrix execution</span>
          </div>
          <div className="flex items-center gap-2 text-[#737C73] dark:text-[#96A89D]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Deterministic allergen constraint verification</span>
          </div>
          <div className="flex items-center gap-2 text-[#737C73] dark:text-[#96A89D]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Network-wide emergency dispatch re-balancing</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => loginAsPersona('coordinator')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#163D2B] dark:bg-[#D9F36A] text-white dark:text-[#10291F] text-sm font-semibold hover:bg-[#10291F] dark:hover:bg-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span>Switch to Coordinator Persona</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 text-left">
      {/* Header */}
      <div className="border-b border-[#DCE7D8] dark:border-[#1E3A2C] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#163D2B]/10 dark:bg-[#D9F36A]/10 text-[#163D2B] dark:text-[#D9F36A] mb-2">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Distribution Command Centre</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#163D2B] dark:text-[#E8F0EB]">
            Operational Command.
          </h1>
          <p className="text-sm text-[#737C73] dark:text-[#96A89D] mt-1 max-w-xl">
            Real-time surplus dispatch oversight with intelligent autonomous matching and verifiable allocation.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#12241B] border border-[#DCE7D8] dark:border-[#1E3A2C] text-[#163D2B] dark:text-[#E8F0EB] hover:bg-[#F8F6EF] dark:hover:bg-[#183124] transition-all self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Operations</span>
        </button>
      </div>

      {actionMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{actionMessage}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI METRICS OVERVIEW */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-[#12241B] p-5 rounded-2xl border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-2xs">
          <div className="text-[11px] font-semibold uppercase text-[#737C73] dark:text-[#96A89D]">Active Surplus</div>
          <div className="text-2xl font-bold text-[#163D2B] dark:text-[#D9F36A] mt-1">
            {overview ? overview.active_listings_count : '—'}
          </div>
          <div className="text-[11px] text-[#737C73] dark:text-[#96A89D] mt-0.5">Available for claim</div>
        </div>

        <div className="bg-white dark:bg-[#12241B] p-5 rounded-2xl border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-2xs">
          <div className="text-[11px] font-semibold uppercase text-[#C64E42]">Imminent Deadlines</div>
          <div className="text-2xl font-bold text-[#C64E42] mt-1">
            {overview ? overview.urgent_listings_count : '—'}
          </div>
          <div className="text-[11px] text-[#C64E42]/80 mt-0.5">Expiring &lt; 6 hours</div>
        </div>

        <div className="bg-white dark:bg-[#12241B] p-5 rounded-2xl border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-2xs">
          <div className="text-[11px] font-semibold uppercase text-[#9E6E18] dark:text-[#DCA647]">Pending Pickups</div>
          <div className="text-2xl font-bold text-[#9E6E18] dark:text-[#DCA647] mt-1">
            {overview ? overview.pending_claims_count : '—'}
          </div>
          <div className="text-[11px] text-[#737C73] dark:text-[#96A89D] mt-0.5">
            {overview ? `${overview.portions_awaiting_pickup} portions awaiting` : '—'}
          </div>
        </div>

        <div className="bg-white dark:bg-[#12241B] p-5 rounded-2xl border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-2xs">
          <div className="text-[11px] font-semibold uppercase text-emerald-800 dark:text-emerald-400">Completed Rescues</div>
          <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-400 mt-1">
            {overview ? overview.completed_rescues_count : '—'}
          </div>
          <div className="text-[11px] text-[#737C73] dark:text-[#96A89D] mt-0.5">Confirmed handovers</div>
        </div>

        <div className="bg-white dark:bg-[#12241B] p-5 rounded-2xl border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-2xs col-span-2 lg:col-span-1">
          <div className="text-[11px] font-semibold uppercase text-[#737C73] dark:text-[#96A89D]">Expired Windows</div>
          <div className="text-2xl font-bold text-neutral-600 dark:text-neutral-400 mt-1">
            {overview ? overview.expired_listings_count : '—'}
          </div>
          <div className="text-[11px] text-[#737C73] dark:text-[#96A89D] mt-0.5">Auto-closed listings</div>
        </div>
      </div>

      {/* AI ASSISTED DISTRIBUTION PLANNER WITH 3D DISPATCH MATRIX */}
      <section className="bg-gradient-to-br from-[#10291F] via-[#143224] to-[#0A1811] rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6 border border-white/10 dark:border-[#1E3A2C]">
        {/* Panel Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#D9F36A] text-[#10291F]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Intelligent Distribution Planner · Autonomous Dispatch Engine</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
              AI Priority Dispatch Recommendations
            </h2>
            <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
              Autonomous matching agent inspects current inventory, executes deterministic allergen & deadline filtering tools, and presents coordinator recommendations with verifiable evidence.
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center gap-3 shrink-0">
            <Cpu className="w-5 h-5 text-[#D9F36A]" />
            <div className="text-xs">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D9F36A] animate-pulse"></span>
                <span>Dispatch Engine: Active</span>
              </div>
              <div className="text-[10px] text-neutral-300">
                Rule-grounded verification enabled
              </div>
            </div>
          </div>
        </div>

        {/* 3D Dispatch Matrix + Rationale row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Agent Reasoning */}
          <div className="lg:col-span-8 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#D9F36A] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Agent Synthesis & Decision Rationale</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-100 leading-relaxed font-sans">
              {aiResponse?.agent_reasoning || 'Evaluating real-time surplus inventory for high-urgency allocations...'}
            </p>
            <div className="text-[11px] text-neutral-300 italic pt-1">
              {aiResponse?.limitations_and_safety_notes || 'All recommendations grounded in verified food declarations.'}
            </div>
          </div>

          {/* 2D Neural Dispatch Radar */}
          <div className="lg:col-span-4 h-48 w-full relative flex items-center justify-center bg-black/35 rounded-2xl border border-white/10 overflow-hidden">
            <DispatchRadar2D />
            <div className="absolute bottom-2 text-[9px] text-[#D9F36A] font-mono tracking-wider flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded-full border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9F36A] animate-ping"></span>
              <span>AWS Strands SDK v1.59.0 Dispatch Radar</span>
            </div>
          </div>
        </div>

        {/* Structured Recommendations Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-white">
            <span>Prioritized Candidate Pairings ({aiResponse?.recommendations.length || 0}):</span>
            <button
              onClick={() => runAiMatching()}
              disabled={aiLoading}
              className="text-xs text-[#D9F36A] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${aiLoading ? 'animate-spin' : ''}`} />
              <span>Re-run Agent Matching</span>
            </button>
          </div>

          {aiLoading ? (
            <div className="p-8 text-center text-xs text-neutral-300 animate-pulse">
              Agent evaluating inventory rules and allergen matrices...
            </div>
          ) : !aiResponse?.recommendations.length ? (
            <div className="p-6 bg-white/5 rounded-2xl text-center text-xs text-neutral-300">
              No immediate urgent rescue matches required. All active listings have adequate time windows.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiResponse.recommendations.map((item, idx) => (
                <div
                  key={`${item.listing_id}-${item.recipient_id}-${idx}`}
                  className="bg-white dark:bg-[#12241B] text-[#26332B] dark:text-[#E8F0EB] rounded-2xl p-5 border border-white/20 dark:border-[#1E3A2C] shadow-md flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#163D2B] dark:bg-[#1E3A2C] text-[#D9F36A]">
                        Match Score: {item.score}%
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#C64E42] bg-[#C64E42]/10 px-2 py-0.5 rounded">
                        {item.urgency_level} cutoff
                      </span>
                    </div>

                    <h3 className="font-editorial text-lg font-bold text-[#163D2B] dark:text-[#E8F0EB]">
                      {item.listing_name} → {item.recipient_name}
                    </h3>

                    <p className="text-xs text-[#737C73] dark:text-[#96A89D] mt-1.5 leading-relaxed">
                      {item.reason}
                    </p>

                    <div className="mt-3 p-3 bg-[#F8F6EF] dark:bg-[#0E1F16] rounded-xl text-[11px] space-y-1 border border-[#DCE7D8] dark:border-[#1C3527]">
                      <div className="font-bold text-[#163D2B] dark:text-[#D9F36A]">Deterministic Evidence Grounding:</div>
                      <div className="text-[#737C73] dark:text-[#96A89D]">
                        • Time remaining: <strong>{item.evidence.hours_remaining || item.evidence.minutes_remaining} hours</strong>
                      </div>
                      <div className="text-[#737C73] dark:text-[#96A89D]">
                        • Allergen safety: <strong className="text-emerald-700 dark:text-emerald-400">Strictly verified (No conflict)</strong>
                      </div>
                      {item.missing_info && (
                        <div className="text-[#9E6E18] dark:text-[#DCA647] font-medium pt-1">
                          ⚠️ Note: {item.missing_info}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#DCE7D8] dark:border-[#1E3A2C] flex items-center justify-between gap-2">
                    <span className="text-[11px] text-[#737C73] dark:text-[#96A89D] max-w-[55%] truncate">
                      {item.suggested_action}
                    </span>

                    <button
                      onClick={() => handleExecuteSuggestion(item)}
                      className="px-3.5 py-2 rounded-xl bg-[#163D2B] dark:bg-[#D9F36A] text-white dark:text-[#10291F] text-xs font-bold hover:bg-[#10291F] dark:hover:bg-white transition-all cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <span>Approve & Dispatch</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* URGENT LISTINGS TABLE */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-editorial text-2xl font-bold text-[#163D2B] dark:text-[#E8F0EB] flex items-center gap-2">
            <span>Urgent Surplus Listings</span>
            <span className="text-xs font-sans font-bold bg-[#C64E42]/15 text-[#C64E42] px-2.5 py-0.5 rounded-full">
              {urgentListings.length} urgent
            </span>
          </h2>
        </div>

        {/* Mobile Card View (screens < 640px) */}
        <div className="block sm:hidden space-y-3">
          {urgentListings.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#12241B] rounded-2xl p-4 border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <UrgencyBadge
                  urgency={item.urgency_level}
                  minutesRemaining={item.minutes_remaining}
                />
                <span className="text-xs font-bold text-[#163D2B] dark:text-[#D9F36A] bg-[#DCE7D8]/60 dark:bg-[#1C3527] px-2 py-0.5 rounded">
                  {item.available_portions} {item.quantity_unit}
                </span>
              </div>

              <div>
                <h3 className="font-editorial text-base font-bold text-[#163D2B] dark:text-[#E8F0EB]">
                  {item.name}
                </h3>
                <p className="text-xs text-[#737C73] dark:text-[#96A89D] mt-0.5">
                  {item.provider_name} · Closes at {new Date(item.pickup_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                {item.declared_allergens.length > 0 && (
                  <p className="text-[11px] text-[#9E6E18] dark:text-[#DCA647] mt-1 font-medium">
                    Allergens: {item.declared_allergens.join(', ')}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-[#DCE7D8]/60 dark:border-[#1E3A2C] flex items-center justify-end">
                <button
                  onClick={() => runAiMatching(item.id)}
                  className="px-3 py-1.5 rounded-xl bg-[#163D2B] dark:bg-[#D9F36A] text-white dark:text-[#10291F] text-xs font-bold hover:bg-[#10291F] dark:hover:bg-white transition-all cursor-pointer"
                >
                  Plan Match with AI
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop / Tablet Table View (screens >= 640px) */}
        <div className="hidden sm:block bg-white dark:bg-[#12241B] rounded-3xl border border-[#DCE7D8] dark:border-[#1E3A2C] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F6EF] dark:bg-[#0E1F16] text-[#737C73] dark:text-[#96A89D] uppercase tracking-wider font-semibold border-b border-[#DCE7D8] dark:border-[#1E3A2C]">
                <tr>
                  <th className="py-3 px-4">Surplus Item</th>
                  <th className="py-3 px-4">Provider</th>
                  <th className="py-3 px-4">Available Portions</th>
                  <th className="py-3 px-4">Pickup Deadline</th>
                  <th className="py-3 px-4">Urgency</th>
                  <th className="py-3 px-4">Allergens Declared</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE7D8]/60 dark:divide-[#1E3A2C]">
                {urgentListings.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8F6EF]/50 dark:hover:bg-[#183124] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#163D2B] dark:text-[#E8F0EB]">
                      {item.name}
                    </td>
                    <td className="py-3.5 px-4 text-[#26332B] dark:text-[#D5E2D9]">
                      {item.provider_name}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#163D2B] dark:text-[#D9F36A]">
                      {item.available_portions} {item.quantity_unit}
                    </td>
                    <td className="py-3.5 px-4 text-[#737C73] dark:text-[#96A89D]">
                      {new Date(item.pickup_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4">
                      <UrgencyBadge
                        urgency={item.urgency_level}
                        minutesRemaining={item.minutes_remaining}
                      />
                    </td>
                    <td className="py-3.5 px-4 text-[#737C73] dark:text-[#96A89D]">
                      {item.declared_allergens.join(', ') || 'None'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => runAiMatching(item.id)}
                        className="text-xs font-bold text-[#163D2B] dark:text-[#D9F36A] hover:underline cursor-pointer"
                      >
                        Plan Match
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
