import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Calendar,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api/client';
import { Claim } from '../types';
import { useDemo } from '../context/DemoContext';

export const MyClaimsPage: React.FC = () => {
  const { currentUser, refreshKey, triggerRefresh } = useDemo();

  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchClaims = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get claims for the current logged-in demo recipient or all
      const data = await api.getClaims();
      setClaims(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch claims');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [refreshKey]);

  const handleConfirmPickup = async (claimId: string) => {
    setActionId(claimId);
    try {
      await api.confirmPickup(claimId);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D9F36A', '#163D2B']
      });
      triggerRefresh();
      fetchClaims();
    } catch (err: any) {
      alert(err.message || 'Failed to confirm pickup');
    } finally {
      setActionId(null);
    }
  };

  const handleCancelClaim = async (claimId: string) => {
    if (!confirm('Are you sure you want to cancel this reservation? The portions will be released back to the marketplace.')) {
      return;
    }
    setActionId(claimId);
    try {
      await api.cancelClaim(claimId);
      triggerRefresh();
      fetchClaims();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel claim');
    } finally {
      setActionId(null);
    }
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const reservedClaims = claims.filter((c) => c.status === 'reserved');
  const completedClaims = claims.filter((c) => c.status === 'confirmed');
  const pastClaims = claims.filter((c) => c.status === 'cancelled' || c.status === 'expired');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 text-left">
      {/* Header */}
      <div className="border-b border-[#DCE7D8] dark:border-[#214232] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#163D2B]/10 dark:bg-emerald-500/15 text-[#163D2B] dark:text-emerald-300 mb-2">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Recipient Claims Dashboard</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#163D2B] dark:text-[#E8F0EB]">
            My Food Rescues.
          </h1>
          <p className="text-sm text-[#737C73] dark:text-[#95A599] mt-1 max-w-xl">
            Track your reserved portions, pickup codes, collection points, and handover verifications.
          </p>
        </div>

        <button
          onClick={fetchClaims}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#112219] border border-[#DCE7D8] dark:border-[#214232] text-[#163D2B] dark:text-[#E8F0EB] hover:bg-[#F8F6EF] dark:hover:bg-[#1C3527] transition-all self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Claims</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 bg-white dark:bg-[#112219] rounded-2xl border border-[#DCE7D8] dark:border-[#214232] animate-pulse" />
          ))}
        </div>
      ) : claims.length === 0 ? (
        <div className="bg-white dark:bg-[#112219] rounded-3xl border border-[#DCE7D8] dark:border-[#214232] p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#F8F6EF] dark:bg-[#1C3527] flex items-center justify-center text-[#737C73] dark:text-[#95A599] mx-auto">
            <UtensilsCrossed className="w-7 h-7" />
          </div>
          <h3 className="font-editorial text-2xl font-bold text-[#163D2B] dark:text-[#E8F0EB]">No claims found</h3>
          <p className="text-xs text-[#737C73] dark:text-[#95A599] leading-relaxed">
            You have not claimed any surplus food portions yet. Visit the marketplace to rescue available food!
          </p>
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#163D2B] dark:bg-emerald-600 text-white text-xs font-semibold hover:bg-[#10291F] dark:hover:bg-emerald-500 transition-all"
          >
            <span>Explore Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Active Reserved Claims (Requiring Pickup) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-editorial text-2xl font-bold text-[#163D2B] dark:text-[#E8F0EB] flex items-center gap-2">
                <span>Upcoming Pickups</span>
                <span className="text-xs font-sans font-bold bg-[#D9F36A] dark:bg-emerald-400 text-[#10291F] px-2.5 py-0.5 rounded-full">
                  {reservedClaims.length} active
                </span>
              </h2>
            </div>

            {reservedClaims.length === 0 ? (
              <div className="p-6 bg-white dark:bg-[#112219] rounded-2xl border border-[#DCE7D8] dark:border-[#214232] text-center text-xs text-[#737C73] dark:text-[#95A599]">
                No pending pickups right now. All reserved claims have been collected or cancelled.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reservedClaims.map((claim) => (
                  <div
                    key={claim.id}
                    className="bg-white dark:bg-[#112219] rounded-3xl p-6 border-2 border-[#163D2B]/30 dark:border-emerald-500/30 shadow-md flex flex-col justify-between space-y-4 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#D9F36A]/20 dark:bg-emerald-500/10 rounded-full blur-2xl -z-10" />

                    <div>
                      {/* Top bar with status and reference */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#D9F36A] dark:bg-emerald-400 text-[#10291F]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Reserved · Awaiting Collection</span>
                        </span>

                        <span className="font-mono text-xs font-bold text-[#163D2B] dark:text-[#D9F36A] bg-[#F8F6EF] dark:bg-[#162B1F] px-2.5 py-1 rounded-lg border border-[#DCE7D8] dark:border-[#214232]">
                          {claim.claim_reference}
                        </span>
                      </div>

                      <h3 className="font-editorial text-xl font-bold text-[#163D2B] dark:text-[#E8F0EB]">
                        {claim.listing_name}
                      </h3>

                      <div className="mt-2 space-y-1.5 text-xs text-[#737C73] dark:text-[#95A599]">
                        <div className="flex items-center gap-2">
                          <strong className="text-[#26332B] dark:text-[#E8F0EB] font-bold text-sm">
                            {claim.portions_claimed} portions reserved
                          </strong>
                          <span>for {claim.recipient_name}</span>
                        </div>
                        <div className="flex items-start gap-1.5 text-[#26332B] dark:text-[#D1E0D6]">
                          <MapPin className="w-3.5 h-3.5 text-[#163D2B] dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{claim.pickup_location}</span>
                        </div>
                        {claim.pickup_deadline && (
                          <div className="flex items-center gap-1.5 text-[#C64E42] dark:text-rose-400 font-semibold">
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            <span>Deadline: {formatDateTime(claim.pickup_deadline)}</span>
                          </div>
                        )}
                        {claim.pickup_notes && (
                          <div className="p-2 bg-[#F8F6EF] dark:bg-[#162B1F] rounded-xl text-[11px] text-[#737C73] dark:text-[#95A599] italic">
                            "{claim.pickup_notes}"
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions: Confirm Handover / Cancel */}
                    <div className="pt-3 border-t border-[#DCE7D8] dark:border-[#214232] flex items-center justify-between gap-3">
                      <button
                        onClick={() => handleCancelClaim(claim.id)}
                        disabled={actionId === claim.id}
                        className="text-xs font-semibold text-[#C64E42] dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                      >
                        Cancel Reservation
                      </button>

                      <button
                        onClick={() => handleConfirmPickup(claim.id)}
                        disabled={actionId === claim.id}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#163D2B] dark:bg-emerald-600 text-white text-xs font-bold hover:bg-[#10291F] dark:hover:bg-emerald-500 shadow-sm transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#D9F36A]" />
                        <span>{actionId === claim.id ? 'Confirming...' : 'Confirm Handover Collection'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Pickups */}
          <div className="space-y-4">
            <h2 className="font-editorial text-2xl font-bold text-[#163D2B] dark:text-[#E8F0EB] flex items-center gap-2">
              <span>Completed Pickups</span>
              <span className="text-xs font-sans font-bold bg-[#DCE7D8] dark:bg-[#1C3527] text-[#163D2B] dark:text-[#D9F36A] px-2.5 py-0.5 rounded-full">
                {completedClaims.length} verified
              </span>
            </h2>

            <div className="bg-white dark:bg-[#112219] rounded-3xl border border-[#DCE7D8] dark:border-[#214232] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8F6EF] dark:bg-[#162B1F] text-[#737C73] dark:text-[#95A599] uppercase tracking-wider font-semibold border-b border-[#DCE7D8] dark:border-[#214232]">
                    <tr>
                      <th className="py-3 px-4">Food Item</th>
                      <th className="py-3 px-4">Portions</th>
                      <th className="py-3 px-4">Reference</th>
                      <th className="py-3 px-4">Collected At</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCE7D8]/60 dark:divide-[#214232]">
                    {completedClaims.map((claim) => (
                      <tr key={claim.id} className="hover:bg-[#F8F6EF]/50 dark:hover:bg-[#162B1F]/60 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-[#163D2B] dark:text-[#E8F0EB]">
                          {claim.listing_name}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#26332B] dark:text-[#D1E0D6]">
                          {claim.portions_claimed}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-neutral-600 dark:text-neutral-400">
                          {claim.claim_reference}
                        </td>
                        <td className="py-3.5 px-4 text-[#737C73] dark:text-[#95A599]">
                          {formatDateTime(claim.pickup_confirmed_at)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full dark:border dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span>Rescued & Verified</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
