import React, { useEffect, useState } from 'react';
import { ShoppingBag, RefreshCw, AlertCircle, UtensilsCrossed } from 'lucide-react';
import { api } from '../api/client';
import { FoodListing } from '../types';
import { FoodCard } from '../components/marketplace/FoodCard';
import { FoodFilters } from '../components/marketplace/FoodFilters';
import { FoodDetailModal } from '../components/marketplace/FoodDetailModal';
import { useDemo } from '../context/DemoContext';

export const DiscoverPage: React.FC = () => {
  const { refreshKey } = useDemo();

  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDietary, setSelectedDietary] = useState<string>('All');
  const [selectedSort, setSelectedSort] = useState<string>('urgency');

  // Selected modal listing
  const [selectedListing, setSelectedListing] = useState<FoodListing | null>(null);

  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getListings({
        q: searchQuery,
        category: selectedCategory,
        dietary: selectedDietary,
        status: 'all', // fetch all so users can see available and recently rescued/expired
        sort: selectedSort
      });
      setListings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch food listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [searchQuery, selectedCategory, selectedDietary, selectedSort, refreshKey]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left border-b border-[#DCE7D8] dark:border-[#214232] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#163D2B]/10 dark:bg-emerald-500/15 text-[#163D2B] dark:text-emerald-300 mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Surplus Food Marketplace</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#163D2B] dark:text-[#E8F0EB]">
            Food worth saving.
          </h1>
          <p className="text-sm text-[#737C73] dark:text-[#95A599] mt-1 max-w-xl">
            Browse real-time edible surplus from neighborhood canteens, bakeries, and cafes before their pickup deadlines.
          </p>
        </div>

        <button
          onClick={fetchListings}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#112219] border border-[#DCE7D8] dark:border-[#214232] text-[#163D2B] dark:text-[#E8F0EB] hover:bg-[#F8F6EF] dark:hover:bg-[#1C3527] transition-all self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Inventory</span>
        </button>
      </div>

      {/* Filter Controls */}
      <FoodFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedDietary={selectedDietary}
        setSelectedDietary={setSelectedDietary}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
        totalCount={listings.length}
      />

      {/* Listings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white dark:bg-[#112219] rounded-2xl overflow-hidden border border-[#DCE7D8] dark:border-[#214232] p-4 space-y-3 animate-pulse"
            >
              <div className="aspect-16/10 bg-neutral-200 dark:bg-[#1C3527] rounded-xl w-full" />
              <div className="h-4 bg-neutral-200 dark:bg-[#1C3527] rounded w-2/3" />
              <div className="h-3 bg-neutral-100 dark:bg-[#162B1F] rounded w-full" />
              <div className="h-8 bg-neutral-200 dark:bg-[#1C3527] rounded-xl w-full mt-4" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-8 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-400 mx-auto" />
          <h3 className="font-bold text-rose-900 dark:text-rose-200">Failed to load marketplace listings</h3>
          <p className="text-xs text-rose-700 dark:text-rose-300">{error}</p>
          <button
            onClick={fetchListings}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white dark:bg-[#112219] rounded-3xl border border-[#DCE7D8] dark:border-[#214232] p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#F8F6EF] dark:bg-[#1C3527] flex items-center justify-center text-[#737C73] dark:text-[#95A599] mx-auto">
            <UtensilsCrossed className="w-7 h-7" />
          </div>
          <h3 className="font-editorial text-2xl font-bold text-[#163D2B] dark:text-[#E8F0EB]">No surplus matches found</h3>
          <p className="text-xs text-[#737C73] dark:text-[#95A599] leading-relaxed">
            No active food listings match your chosen filters. Try clearing search keywords or selecting a broader dietary tag.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedDietary('All');
            }}
            className="px-5 py-2.5 rounded-xl bg-[#163D2B] dark:bg-emerald-600 text-white text-xs font-semibold hover:bg-[#10291F] dark:hover:bg-emerald-500 transition-all cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {listings.map((item) => (
            <FoodCard
              key={item.id}
              listing={item}
              onSelect={(l) => setSelectedListing(l)}
              onClaimDirect={(l) => setSelectedListing(l)}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedListing && (
        <FoodDetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onClaimSuccess={() => fetchListings()}
        />
      )}
    </div>
  );
};
