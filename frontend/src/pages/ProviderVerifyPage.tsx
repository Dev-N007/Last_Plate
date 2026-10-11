import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  QrCode,
  Search,
  Building2,
  Clock,
  MapPin,
  UtensilsCrossed,
  ShieldCheck,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api/client';
import { Claim } from '../types';
import { useAuth } from '../context/AuthContext';

export const ProviderVerifyPage: React.FC = () => {
  const { user, role, capabilities, openLoginModal } = useAuth();
  const [searchRef, setSearchRef] = useState('');
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState<Claim | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const data = await api.getClaims();
      setClaims(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  // Access guard: Provider or Coordinator only
  if (!capabilities.canVerifyHandover) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center mx-auto shadow-md">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-editorial text-3xl font-bold text-[#163D2B] dark:text-[#E8F0EB]">
            Provider Clearance Required
          </h2>
          <p className="text-sm text-[#737C73] dark:text-[#95A599] max-w-md mx-auto">
            The Handover Verification Station is reserved for verified Food Providers at dispatch counters.
          </p>
        </div>
        <button
          onClick={() => openLoginModal('provider')}
          className="px-6 py-3 rounded-xl bg-[#163D2B] dark:bg-emerald-600 text-white font-bold text-sm hover:bg-[#10291F] dark:hover:bg-emerald-500 transition-all cursor-pointer shadow-sm"
        >
          Switch to Food Provider Persona
        </button>
      </div>
    );
  }

  const handleVerify = async (claimId: string) => {
    setIsVerifying(true);
    setErrorMsg(null);
    try {
      const res = await api.confirmPickup(claimId);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D9F36A', '#163D2B']
      });
      setVerifiedSuccess(res);
      fetchClaims();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to verify handover code.');
    } finally {
      setIsVerifying(false);
    }
  };

  const pendingClaims = claims.filter((c) => c.status === 'reserved');
  const matchedClaim = searchRef.trim()
    ? pendingClaims.find((c) => c.claim_reference.toLowerCase() === searchRef.trim().toLowerCase())
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 text-left">
      {/* Header */}
      <div className="border-b border-[#DCE7D8] dark:border-[#214232] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#163D2B]/10 dark:bg-emerald-500/15 text-[#163D2B] dark:text-emerald-300 mb-2">
            <QrCode className="w-3.5 h-3.5" />
            <span>Kitchen Dispatch Counter</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#163D2B] dark:text-[#E8F0EB]">
            Verify Food Handover.
          </h1>
          <p className="text-sm text-[#737C73] dark:text-[#95A599] mt-1 max-w-xl">
            Input the recipient's reference code at the counter to verify portions, record the handover, and credit the sustainability ledger.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F8F6EF] dark:bg-[#162B1F] p-2.5 rounded-2xl border border-[#DCE7D8] dark:border-[#214232] text-xs">
          <Building2 className="w-4 h-4 text-[#163D2B] dark:text-emerald-400 shrink-0" />
          <span className="font-semibold text-[#163D2B] dark:text-[#E8F0EB]">
            Counter: {user?.name || 'Verified Kitchen'}
          </span>
        </div>
      </div>

      {/* Code Input & Verification Box */}
      <div className="bg-white dark:bg-[#112219] p-6 sm:p-8 rounded-3xl border border-[#DCE7D8] dark:border-[#214232] shadow-sm space-y-5">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#26332B] dark:text-[#D1E0D6]">
          Enter Recipient Pickup Code
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-[#737C73] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchRef}
              onChange={(e) => setSearchRef(e.target.value)}
              placeholder="e.g. LP-529-SAND"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#DCE7D8] dark:border-[#214232] bg-[#F8F6EF]/60 dark:bg-[#162B1F]/60 text-base font-mono uppercase tracking-widest text-[#163D2B] dark:text-[#E8F0EB] focus:outline-hidden focus:ring-2 focus:ring-[#163D2B] dark:focus:ring-emerald-400"
            />
          </div>
          {matchedClaim && (
            <button
              onClick={() => handleVerify(matchedClaim.id)}
              disabled={isVerifying}
              className="px-6 py-3 rounded-xl bg-[#163D2B] dark:bg-emerald-600 text-white font-bold text-sm hover:bg-[#10291F] dark:hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-[#D9F36A]" />
              <span>{isVerifying ? 'Confirming...' : 'Confirm Handover'}</span>
            </button>
          )}
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {verifiedSuccess && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <strong>Handover Recorded!</strong> {verifiedSuccess.portions_claimed} portions of{' '}
                {verifiedSuccess.listing_name} collected by {verifiedSuccess.recipient_name}.
              </div>
            </div>
            <button
              onClick={() => setVerifiedSuccess(null)}
              className="text-xs font-bold underline hover:opacity-80"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Pending Reservations Queue */}
      <div className="space-y-4">
        <h2 className="font-editorial text-2xl font-bold text-[#163D2B] dark:text-[#E8F0EB] flex items-center gap-2">
          <span>Pending Collections Awaiting Handover</span>
          <span className="text-xs font-sans font-bold bg-[#D9F36A] dark:bg-emerald-400 text-[#10291F] px-2.5 py-0.5 rounded-full">
            {pendingClaims.length} awaiting pickup
          </span>
        </h2>

        {pendingClaims.length === 0 ? (
          <div className="p-8 bg-white dark:bg-[#112219] rounded-3xl border border-[#DCE7D8] dark:border-[#214232] text-center text-xs text-[#737C73] dark:text-[#95A599]">
            All reserved claims have been collected or cancelled.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingClaims.map((claim) => (
              <div
                key={claim.id}
                className="bg-white dark:bg-[#112219] rounded-2xl p-5 border border-[#DCE7D8] dark:border-[#214232] shadow-xs hover:border-[#163D2B] dark:hover:border-emerald-400 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-[#163D2B] dark:text-[#D9F36A] bg-[#F8F6EF] dark:bg-[#162B1F] px-2.5 py-1 rounded-lg border border-[#DCE7D8] dark:border-[#214232]">
                      {claim.claim_reference}
                    </span>
                    <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                      Reserved
                    </span>
                  </div>

                  <h3 className="font-editorial text-lg font-bold text-[#163D2B] dark:text-[#E8F0EB]">
                    {claim.listing_name}
                  </h3>

                  <div className="mt-2 space-y-1 text-xs text-[#737C73] dark:text-[#95A599]">
                    <div className="text-[#26332B] dark:text-[#E8F0EB] font-bold">
                      {claim.portions_claimed} portions for {claim.recipient_name}
                    </div>
                    {claim.pickup_notes && (
                      <div className="italic text-[11px] bg-[#F8F6EF] dark:bg-[#162B1F] p-2 rounded-lg mt-1">
                        "{claim.pickup_notes}"
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleVerify(claim.id)}
                  disabled={isVerifying}
                  className="w-full py-2.5 rounded-xl bg-[#163D2B] dark:bg-emerald-600 text-white text-xs font-bold hover:bg-[#10291F] dark:hover:bg-emerald-500 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D9F36A]" />
                  <span>Verify Code & Confirm Collection</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
