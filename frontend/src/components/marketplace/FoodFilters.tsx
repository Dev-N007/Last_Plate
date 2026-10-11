import React from 'react';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';

interface FoodFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedDietary: string;
  setSelectedDietary: (diet: string) => void;
  selectedSort: string;
  setSelectedSort: (s: string) => void;
  totalCount: number;
}

const CATEGORIES = [
  'All',
  'Prepared Meals',
  'Bakery & Bread',
  'Produce & Fruits',
  'Packaged Goods'
];

const DIETARY_OPTIONS = [
  'All',
  'Vegetarian',
  'Vegan',
  'Halal',
  'Gluten-Free'
];

export const FoodFilters: React.FC<FoodFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedDietary,
  setSelectedDietary,
  selectedSort,
  setSelectedSort,
  totalCount
}) => {
  const hasActiveFilters =
    searchQuery || selectedCategory !== 'All' || selectedDietary !== 'All';

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDietary('All');
  };

  return (
    <div className="bg-white dark:bg-[#12241B] rounded-2xl p-4 sm:p-5 border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-xs space-y-4">
      {/* Top row: Search input & Sort */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#737C73] dark:text-[#96A89D] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by food name, bakery, canteen, or neighbourhood..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DCE7D8] dark:border-[#1E3A2C] bg-[#F8F6EF]/50 dark:bg-[#0E1F16] focus:bg-white dark:focus:bg-[#152B1E] text-sm text-[#26332B] dark:text-[#E8F0EB] focus:outline-hidden focus:ring-2 focus:ring-[#163D2B]/20 dark:focus:ring-[#D9F36A]/20 focus:border-[#163D2B] dark:focus:border-[#D9F36A] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Select & Count */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-[#F8F6EF] dark:bg-[#0E1F16] px-3 py-2 rounded-xl border border-[#DCE7D8] dark:border-[#1E3A2C] text-xs font-medium text-[#26332B] dark:text-[#E8F0EB]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#163D2B] dark:text-[#D9F36A]" />
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              aria-label="Sort food listings"
              className="bg-transparent border-none text-xs font-semibold text-[#163D2B] dark:text-[#D9F36A] focus:outline-hidden cursor-pointer"
            >
              <option value="urgency" className="dark:bg-[#12241B] dark:text-[#E8F0EB]">Sort: Approaching Deadline</option>
              <option value="portions" className="dark:bg-[#12241B] dark:text-[#E8F0EB]">Sort: Remaining Portions</option>
              <option value="newest" className="dark:bg-[#12241B] dark:text-[#E8F0EB]">Sort: Newly Listed</option>
            </select>
          </div>

          <div className="text-xs text-[#737C73] dark:text-[#96A89D] whitespace-nowrap hidden md:block">
            Showing <strong className="text-[#163D2B] dark:text-[#D9F36A]">{totalCount}</strong> listings
          </div>
        </div>
      </div>

      {/* Middle row: Category chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-[#737C73] dark:text-[#96A89D] uppercase tracking-wider shrink-0 pr-1">
          Category:
        </span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#163D2B] dark:bg-[#D9F36A] text-white dark:text-[#10291F] shadow-xs font-semibold'
                : 'bg-[#F8F6EF] dark:bg-[#0E1F16] text-[#26332B] dark:text-[#D5E2D9] hover:bg-[#DCE7D8]/60 dark:hover:bg-[#183124] border border-[#DCE7D8]/80 dark:border-[#1E3A2C]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Bottom row: Dietary chips + Clear Filter button */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#DCE7D8]/50 dark:border-[#1E3A2C]">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-[#737C73] dark:text-[#96A89D] uppercase tracking-wider shrink-0 pr-1">
            Dietary:
          </span>
          {DIETARY_OPTIONS.map((diet) => (
            <button
              key={diet}
              onClick={() => setSelectedDietary(diet)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedDietary === diet
                  ? 'bg-[#D9F36A] text-[#10291F] font-bold shadow-2xs'
                  : 'bg-white dark:bg-[#0E1F16] text-[#737C73] dark:text-[#96A89D] hover:text-[#26332B] dark:hover:text-[#E8F0EB] border border-[#DCE7D8] dark:border-[#1E3A2C]'
              }`}
            >
              {diet}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-[#C64E42] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
