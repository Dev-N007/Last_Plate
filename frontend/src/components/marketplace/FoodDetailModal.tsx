import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Building2,
  MapPin,
  Clock,
  Calendar,
  AlertTriangle,
  ShieldAlert,
  Thermometer,
  CheckCircle2,
  UtensilsCrossed,
  ArrowRight,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FoodListing, Claim } from '../../types';
import { UrgencyBadge } from '../ui/UrgencyBadge';
import { api } from '../../api/client';
import { useDemo } from '../../context/DemoContext';
import { useAuth } from '../../context/AuthContext';

interface FoodDetailModalProps {
  listing: FoodListing | null;
  onClose: () => void;
  onClaimSuccess: () => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  listing,
  onClose,
  onClaimSuccess
}) => {
  const navigate = useNavigate();
  const { currentUser, triggerRefresh } = useDemo();
  const { user: authUser, capabilities, loginAsPersona } = useAuth();

  const [portionsToClaim, setPortionsToClaim] = useState<number>(1);
  const [pickupNotes, setPickupNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [claimedResult, setClaimedResult] = useState<Claim | null>(null);

  if (!listing) return null;

  const isAvailable = listing.status === 'available' && listing.available_portions > 0;
  const isExpired = listing.status === 'expired' || listing.urgency_level === 'expired';

  const handleClaim = async () => {
    if (!isAvailable) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const claim = await api.claimPortions(listing.id, {
        recipient_id: currentUser.id,
        recipient_name: `${currentUser.name} (${currentUser.organization || 'Recipient'})`,
        portions_claimed: portionsToClaim,
        pickup_notes: pickupNotes
      });

      // Fire celebratory confetti!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D9F36A', '#163D2B', '#DCE7D8']
      });

      setClaimedResult(claim);
      triggerRefresh();
      onClaimSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to claim portions. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#112219] rounded-3xl overflow-hidden shadow-2xl border border-[#DCE7D8] dark:border-[#214232] my-8 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success View */}
        {claimedResult ? (
          <div className="p-8 text-center space-y-6 my-auto">
            <div className="w-16 h-16 rounded-full bg-[#163D2B] dark:bg-emerald-500/20 text-[#D9F36A] dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#163D2B] dark:text-[#E8F0EB]">
                Portions Successfully Reserved!
              </h3>
              <p className="text-sm text-[#737C73] dark:text-[#95A599] max-w-md mx-auto">
                You have reserved <strong>{claimedResult.portions_claimed} portions</strong> of{' '}
                <span className="text-[#26332B] dark:text-[#D1E0D6] font-semibold">{listing.name}</span>.
              </p>
            </div>

            {/* Claim Reference Card */}
            <div className="bg-[#F8F6EF] dark:bg-[#162B1F] p-5 rounded-2xl border border-[#DCE7D8] dark:border-[#214232] max-w-md mx-auto space-y-2">
              <div className="text-xs uppercase tracking-wider text-[#737C73] dark:text-[#95A599] font-bold">
                Your Pickup Reference Code
              </div>
              <div className="font-mono text-2xl font-bold text-[#163D2B] dark:text-[#D9F36A] tracking-widest bg-white dark:bg-[#0D1A13] py-2 px-4 rounded-xl border border-[#DCE7D8] dark:border-[#214232]">
                {claimedResult.claim_reference}
              </div>
              <div className="text-xs text-[#737C73] dark:text-[#95A599] flex items-center justify-center gap-1.5 pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#163D2B] dark:text-emerald-400" />
                <span>Show this code at {listing.pickup_location}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  navigate('/my-claims');
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#163D2B] dark:bg-emerald-600 text-white text-sm font-semibold hover:bg-[#10291F] dark:hover:bg-emerald-500 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>View in My Claims</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#F8F6EF] dark:bg-[#1C3527] text-[#26332B] dark:text-[#E8F0EB] text-sm font-medium hover:bg-[#DCE7D8] dark:hover:bg-[#284936] transition-all cursor-pointer"
              >
                Back to Marketplace
              </button>
            </div>
          </div>
        ) : (
          /* Normal Details & Claim Workflow */
          <>
            {/* Header Image */}
            <div className="relative aspect-21/9 w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden shrink-0">
              <img
                src={listing.image_url}
                alt={listing.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute top-4 left-4">
                <UrgencyBadge
                  urgency={listing.urgency_level}
                  minutesRemaining={listing.minutes_remaining}
                />
              </div>
              <div className="absolute bottom-3 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/70 backdrop-blur-md text-white">
                  {listing.category}
                </span>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#737C73] dark:text-[#95A599] mb-1">
                  <Building2 className="w-4 h-4 text-[#163D2B] dark:text-emerald-400" />
                  <span className="font-semibold text-[#26332B] dark:text-[#D1E0D6]">{listing.provider_name}</span>
                </div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#163D2B] dark:text-[#E8F0EB]">
                  {listing.name}
                </h2>
                <p className="text-sm text-[#737C73] dark:text-[#95A599] mt-2 leading-relaxed">
                  {listing.description}
                </p>
              </div>

              {/* Key Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-[#F8F6EF] dark:bg-[#162B1F] rounded-2xl border border-[#DCE7D8] dark:border-[#214232]">
                <div>
                  <div className="text-[11px] text-[#737C73] dark:text-[#95A599] uppercase tracking-wider font-semibold">
                    Available Portions
                  </div>
                  <div className="text-base font-bold text-[#163D2B] dark:text-[#E8F0EB] mt-0.5">
                    {listing.available_portions} {listing.quantity_unit}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-[#737C73] dark:text-[#95A599] uppercase tracking-wider font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#163D2B] dark:text-emerald-400" />
                    <span>Pickup Deadline</span>
                  </div>
                  <div className="text-xs font-bold text-[#163D2B] dark:text-[#E8F0EB] mt-0.5">
                    {formatDateTime(listing.pickup_deadline)}
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <div className="text-[11px] text-[#737C73] dark:text-[#95A599] uppercase tracking-wider font-semibold flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-[#163D2B] dark:text-emerald-400" />
                    <span>Storage Info</span>
                  </div>
                  <div className="text-xs font-bold text-[#163D2B] dark:text-[#E8F0EB] mt-0.5">
                    {listing.storage_information || 'Refrigerated'}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-2.5 p-3.5 bg-white dark:bg-[#162B1F] rounded-xl border border-[#DCE7D8] dark:border-[#214232]">
                <MapPin className="w-4 h-4 text-[#163D2B] dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#26332B] dark:text-[#E8F0EB]">Pickup Collection Point</div>
                  <div className="text-xs text-[#737C73] dark:text-[#95A599]">{listing.pickup_location}</div>
                </div>
              </div>

              {/* Dietary & Allergens declarations */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#26332B] dark:text-[#D1E0D6]">
                  Dietary Tags & Declared Allergens
                </div>
                <div className="flex flex-wrap gap-2">
                  {listing.dietary_tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#DCE7D8] dark:bg-[#1C3527] text-[#163D2B] dark:text-[#D9F36A]"
                    >
                      {tag}
                    </span>
                  ))}
                  {listing.declared_allergens && listing.declared_allergens.length > 0 ? (
                    listing.declared_allergens.map((alg) => (
                      <span
                        key={alg}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                          alg === 'None Declared'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-[#DCA647]/15 text-[#9E6E18] dark:text-amber-300 border border-[#DCA647]/30'
                        }`}
                      >
                        <AlertTriangle className="w-3 h-3" />
                        <span>Allergen: {alg}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#737C73] dark:text-[#95A599] italic">No allergens declared</span>
                  )}
                </div>
              </div>

              {/* Trust & Safety Disclaimer */}
              <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 rounded-xl flex items-start gap-2 text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
                <ShieldAlert className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Safety Notice:</strong> Providers must supply accurate preparation and allergen information. LastPlate does not certify food safety; recipients must inspect items upon collection.
                </span>
              </div>

              {/* Claim Action Box */}
              {isAvailable ? (
                !capabilities.canClaimSurplus ? (
                  <div className="p-4 bg-amber-50/80 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/60 space-y-3 text-left">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                      <Lock className="w-4 h-4 shrink-0" />
                      <span>Recipient Role Required to Claim Surplus</span>
                    </div>
                    <p className="text-xs text-amber-900/80 dark:text-amber-200/80">
                      You are signed in as <strong>{authUser?.name || 'Provider Account'}</strong> ({authUser?.role || 'provider'}). Kitchen Providers cannot claim surplus from other providers. Switch to Recipient persona to reserve portions.
                    </p>
                    <button
                      onClick={() => loginAsPersona('recipient')}
                      className="px-4 py-2 rounded-xl bg-[#163D2B] dark:bg-emerald-600 text-white text-xs font-bold hover:bg-[#10291F] dark:hover:bg-emerald-500 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Switch to Recipient Persona</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                <div className="p-4 bg-[#F8F6EF] dark:bg-[#162B1F] rounded-2xl border border-[#DCE7D8] dark:border-[#214232] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#163D2B] dark:text-[#E8F0EB]">How many portions do you need?</div>
                      <div className="text-[11px] text-[#737C73] dark:text-[#95A599]">
                        Max available: {listing.available_portions} portions
                      </div>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-2 bg-white dark:bg-[#112219] rounded-xl border border-[#DCE7D8] dark:border-[#214232] p-1">
                      <button
                        onClick={() => setPortionsToClaim((p) => Math.max(1, p - 1))}
                        disabled={portionsToClaim <= 1}
                        className="w-8 h-8 rounded-lg bg-[#F8F6EF] dark:bg-[#1C3527] hover:bg-[#DCE7D8] dark:hover:bg-[#284936] text-[#163D2B] dark:text-[#E8F0EB] font-bold text-sm disabled:opacity-40 transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-sm text-[#163D2B] dark:text-[#E8F0EB]">
                        {portionsToClaim}
                      </span>
                      <button
                        onClick={() =>
                          setPortionsToClaim((p) => Math.min(listing.available_portions, p + 1))
                        }
                        disabled={portionsToClaim >= listing.available_portions}
                        className="w-8 h-8 rounded-lg bg-[#F8F6EF] dark:bg-[#1C3527] hover:bg-[#DCE7D8] dark:hover:bg-[#284936] text-[#163D2B] dark:text-[#E8F0EB] font-bold text-sm disabled:opacity-40 transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Pickup Notes */}
                  <div>
                    <label className="block text-xs font-medium text-[#737C73] dark:text-[#95A599] mb-1">
                      Pickup Notes / Contact Phone (Optional):
                    </label>
                    <input
                      type="text"
                      value={pickupNotes}
                      onChange={(e) => setPickupNotes(e.target.value)}
                      placeholder="e.g. Arriving at 2:30 PM with insulated box, Contact: Dispatch Lead"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-[#DCE7D8] dark:border-[#214232] bg-white dark:bg-[#112219] text-[#163D2B] dark:text-[#E8F0EB] focus:outline-hidden focus:ring-1 focus:ring-[#163D2B] dark:focus:ring-emerald-400 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                    />
                  </div>

                  {errorMessage && (
                    <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    onClick={handleClaim}
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-[#163D2B] dark:bg-emerald-600 text-white font-bold text-sm hover:bg-[#10291F] dark:hover:bg-emerald-500 transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <UtensilsCrossed className="w-4 h-4 text-[#D9F36A]" />
                    <span>
                      {isSubmitting
                        ? 'Confirming Reservation...'
                        : `Confirm Reservation for ${portionsToClaim} ${listing.quantity_unit}`}
                    </span>
                  </button>
                </div>
                )
              ) : (
                <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-center text-xs text-neutral-600 dark:text-neutral-300 font-medium">
                  {isExpired
                    ? 'The pickup deadline for this food listing has passed.'
                    : 'All portions for this listing have been claimed or collected.'}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
