import React from 'react';
import { MapPin, Building2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { FoodListing } from '../../types';
import { UrgencyBadge } from '../ui/UrgencyBadge';

interface FoodCardProps {
  listing: FoodListing;
  onSelect: (listing: FoodListing) => void;
  onClaimDirect?: (listing: FoodListing) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ listing, onSelect, onClaimDirect }) => {
  const isAvailable = listing.status === 'available' && listing.available_portions > 0;
  const isExpired = listing.status === 'expired' || listing.urgency_level === 'expired';
  const isScarce = isAvailable && listing.available_portions <= 5;

  return (
    <div
      onClick={() => onSelect(listing)}
      className="group bg-white dark:bg-[#12241B] rounded-3xl overflow-hidden border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-[#163D2B]/30 dark:hover:border-[#D9F36A]/40 dark:hover:shadow-[0_8px_30px_rgba(217,243,106,0.1)] transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* Image container */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <img
          src={listing.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
          alt={listing.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Urgency Badge overlay */}
        <div className="absolute top-3 left-3 z-10">
          <UrgencyBadge
            urgency={listing.urgency_level}
            minutesRemaining={listing.minutes_remaining}
          />
        </div>

        {/* Category Pill overlay */}
        <div className="absolute top-3 right-3 z-10">
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-black/60 backdrop-blur-md text-white shadow-xs">
            {listing.category}
          </span>
        </div>

        {/* Status banner if not available */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/95 text-[#10291F] shadow-lg">
              {isExpired ? 'Pickup Window Closed' : listing.status === 'collected' ? 'Rescue Completed' : 'Fully Reserved'}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Provider & Location */}
          <div className="flex items-center justify-between text-xs text-[#737C73] dark:text-[#96A89D] mb-2">
            <span className="inline-flex items-center gap-1.5 font-medium text-[#26332B] dark:text-[#E8F0EB] truncate max-w-[65%]">
              <Building2 className="w-3.5 h-3.5 text-[#163D2B] dark:text-[#D9F36A] shrink-0" />
              <span className="truncate">{listing.provider_name}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] shrink-0">
              <MapPin className="w-3 h-3 text-[#737C73] dark:text-[#96A89D]" />
              <span className="truncate max-w-[120px]">{listing.pickup_location.split(',')[0]}</span>
            </span>
          </div>

          {/* Food Title */}
          <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#163D2B] dark:text-[#E8F0EB] leading-snug group-hover:text-[#10291F] dark:group-hover:text-[#D9F36A] transition-colors line-clamp-1 mb-2">
            {listing.name}
          </h3>

          <p className="text-xs text-[#737C73] dark:text-[#96A89D] line-clamp-2 leading-relaxed mb-3">
            {listing.description}
          </p>

          {/* Dietary Tags */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {listing.dietary_tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold px-2.5 py-0.5 rounded-lg bg-[#DCE7D8]/60 dark:bg-[#1C3527] text-[#163D2B] dark:text-[#D9F36A]"
              >
                {tag}
              </span>
            ))}
            {listing.declared_allergens && listing.declared_allergens.length > 0 && !listing.declared_allergens.includes('None Declared') && (
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-[#DCA647]/15 dark:bg-[#DCA647]/20 text-[#9E6E18] dark:text-[#DCA647] flex items-center gap-1"
                title={`Declared allergens: ${listing.declared_allergens.join(', ')}`}
              >
                <AlertCircle className="w-3 h-3" />
                <span>{listing.declared_allergens[0]}</span>
              </span>
            )}
          </div>
        </div>

        {/* Footer info: Portions & Claim CTA */}
        <div className="pt-3.5 border-t border-[#DCE7D8]/60 dark:border-[#1E3A2C] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#737C73] dark:text-[#96A89D]">Available:</span>
              {isScarce && (
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.2 rounded-sm">
                  Almost gone
                </span>
              )}
            </div>
            <div className="text-sm font-bold text-[#163D2B] dark:text-[#D9F36A] mt-0.5">
              {listing.available_portions} <span className="text-xs font-normal text-[#737C73] dark:text-[#96A89D]">{listing.quantity_unit}</span>
            </div>
          </div>

          <button
            disabled={!isAvailable}
            onClick={(e) => {
              e.stopPropagation();
              if (onClaimDirect) onClaimDirect(listing);
              else onSelect(listing);
            }}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl transition-all active:scale-95 cursor-pointer ${
              isAvailable
                ? 'bg-[#163D2B] dark:bg-[#D9F36A] text-white dark:text-[#10291F] hover:bg-[#10291F] dark:hover:bg-white shadow-xs hover:shadow-md'
                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-500 cursor-not-allowed'
            }`}
          >
            <span>{isAvailable ? 'Claim Portions' : 'Unavailable'}</span>
            {isAvailable && <ArrowRight className="w-3.5 h-3.5 opacity-80" />}
          </button>
        </div>
      </div>
    </div>
  );
};
