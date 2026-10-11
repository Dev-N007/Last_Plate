import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Sparkles,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Image as ImageIcon,
  Lock,
  ArrowRight
} from 'lucide-react';
import { api } from '../api/client';
import { FoodListing } from '../types';
import { FoodCard } from '../components/marketplace/FoodCard';
import { useDemo } from '../context/DemoContext';
import { useAuth } from '../context/AuthContext';

const SAMPLE_PRESET_IMAGES = [
  {
    name: 'Warm Rice & Lentil Bowls',
    category: 'Prepared Meals',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Artisan Bakery Sourdough',
    category: 'Bakery & Bread',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Ripe Seasonal Fruits',
    category: 'Produce & Fruits',
    url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Fresh Harvest Vegetables',
    category: 'Produce & Fruits',
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Cafe Gourmet Sandwiches',
    category: 'Packaged Goods',
    url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Morning Pastries & Croissants',
    category: 'Bakery & Bread',
    url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80'
  }
];

const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Halal', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'];
const ALLERGEN_OPTIONS = ['Gluten', 'Dairy', 'Eggs', 'Nuts', 'Soy', 'None Declared'];

export const CreateListingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, triggerRefresh } = useDemo();
  const { user: authUser, capabilities, loginAsPersona } = useAuth();

  // Form states
  const [name, setName] = useState('Fresh Vegetable Biryani & Raita');
  const [category, setCategory] = useState('Prepared Meals');
  const [description, setDescription] = useState(
    'Surplus fragrant vegetable biryani prepared for lunch buffet. Packed in clean food-grade containers with sealed lids.'
  );
  const [quantity, setQuantity] = useState(15);
  const [unit, setUnit] = useState('portions');
  const [prepHoursAgo, setPrepHoursAgo] = useState(2);
  const [pickupHoursFromNow, setPickupHoursFromNow] = useState(3);
  const [pickupLocation, setPickupLocation] = useState('Canteen Rear Dispatch, Student Centre Block B');
  const [storageInfo, setStorageInfo] = useState('Heated warmer at 65°C');
  const [dietaryTags, setDietaryTags] = useState<string[]>(['Vegetarian', 'Halal']);
  const [declaredAllergens, setDeclaredAllergens] = useState<string[]>(['Dairy']);
  const [imageUrl, setImageUrl] = useState(SAMPLE_PRESET_IMAGES[0].url);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdListing, setCreatedListing] = useState<FoodListing | null>(null);

  const toggleDietary = (tag: string) => {
    setDietaryTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleAllergen = (alg: string) => {
    if (alg === 'None Declared') {
      setDeclaredAllergens(['None Declared']);
      return;
    }
    setDeclaredAllergens((prev) => {
      const filtered = prev.filter((a) => a !== 'None Declared');
      return filtered.includes(alg) ? filtered.filter((a) => a !== alg) : [...filtered, alg];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const now = new Date();
    const prepTime = new Date(now.getTime() - prepHoursAgo * 60 * 60 * 1000);
    const deadlineTime = new Date(now.getTime() + pickupHoursFromNow * 60 * 60 * 1000);

    try {
      const created = await api.createListing({
        provider_id: currentUser.id,
        provider_name: currentUser.name,
        name: name.trim(),
        category,
        description: description.trim(),
        total_quantity: Number(quantity),
        quantity_unit: unit,
        available_portions: Number(quantity),
        preparation_time: prepTime.toISOString(),
        pickup_deadline: deadlineTime.toISOString(),
        pickup_location: pickupLocation.trim(),
        dietary_tags: dietaryTags,
        declared_allergens: declaredAllergens,
        storage_information: storageInfo,
        image_url: imageUrl
      });

      setCreatedListing(created);
      triggerRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preview object
  const previewListing: FoodListing = {
    id: 'preview-id',
    provider_id: currentUser.id,
    provider_name: currentUser.name,
    name: name || 'Untitled Listing',
    category,
    description: description || 'No description provided.',
    total_quantity: quantity,
    quantity_unit: unit,
    available_portions: quantity,
    preparation_time: new Date().toISOString(),
    pickup_deadline: new Date(Date.now() + pickupHoursFromNow * 3600000).toISOString(),
    pickup_location: pickupLocation || 'Pickup location',
    dietary_tags: dietaryTags,
    declared_allergens: declaredAllergens,
    storage_information: storageInfo,
    image_url: imageUrl,
    status: 'available',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    urgency_level: pickupHoursFromNow <= 2 ? 'critical' : pickupHoursFromNow <= 6 ? 'urgent' : 'normal',
    minutes_remaining: pickupHoursFromNow * 60
  };

  // Persona Access Guard
  if (!capabilities.canListSurplus) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Provider Persona Required
          </span>
          <h2 className="font-editorial text-3xl font-bold text-[#163D2B] dark:text-[#E8F0EB]">
            Surplus Listing Portal
          </h2>
          <p className="text-sm text-[#737C73] dark:text-[#95A599] max-w-md mx-auto">
            You are currently signed in as <strong>{authUser?.name || 'Guest User'}</strong> ({authUser?.role || 'guest'}). Only verified food provider accounts (canteens, bakeries, cafes) can publish surplus listings.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#112219] border border-[#DCE7D8] dark:border-[#214232] text-left text-xs space-y-2 max-w-md mx-auto">
          <div className="font-bold text-[#163D2B] dark:text-[#E8F0EB]">Provider Privileges:</div>
          <div className="flex items-center gap-2 text-[#737C73] dark:text-[#95A599]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Publish perishable & prepared surplus within minutes</span>
          </div>
          <div className="flex items-center gap-2 text-[#737C73] dark:text-[#95A599]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Specify strict safety & storage conditions (warm/chilled)</span>
          </div>
          <div className="flex items-center gap-2 text-[#737C73] dark:text-[#95A599]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Verify recipient pickup codes at handover counter</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => loginAsPersona('provider')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#163D2B] dark:bg-emerald-600 text-white text-sm font-semibold hover:bg-[#10291F] dark:hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span>Switch to Provider Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/discover')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#F8F6EF] dark:bg-[#1C3527] text-[#26332B] dark:text-[#E8F0EB] text-sm font-medium hover:bg-[#DCE7D8] dark:hover:bg-[#284936] transition-all cursor-pointer"
          >
            Browse Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-[#DCE7D8] dark:border-[#214232] pb-6 text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#163D2B]/10 dark:bg-emerald-500/15 text-[#163D2B] dark:text-emerald-300 mb-2">
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Food Provider Portal</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#163D2B] dark:text-[#E8F0EB]">
          List Surplus Food.
        </h1>
        <p className="text-sm text-[#737C73] dark:text-[#95A599] mt-1 max-w-xl">
          Publish edible surplus in 60 seconds with accurate dietary declarations and collection timing.
        </p>
      </div>

      {createdListing ? (
        /* Success Screen */
        <div className="bg-white dark:bg-[#112219] rounded-3xl p-8 sm:p-12 border border-[#DCE7D8] dark:border-[#214232] shadow-lg max-w-xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#163D2B] dark:bg-emerald-500/20 text-[#D9F36A] dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-editorial text-3xl font-bold text-[#163D2B] dark:text-[#E8F0EB]">
              Listing Published to Marketplace!
            </h2>
            <p className="text-sm text-[#737C73] dark:text-[#95A599]">
              <strong>{createdListing.name}</strong> ({createdListing.available_portions} {createdListing.quantity_unit}) is now visible to eligible community recipients.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => navigate('/discover')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#163D2B] dark:bg-emerald-600 text-white text-sm font-semibold hover:bg-[#10291F] dark:hover:bg-emerald-500 transition-all cursor-pointer"
            >
              View in Marketplace
            </button>
            <button
              onClick={() => {
                setCreatedListing(null);
                setName('');
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#F8F6EF] dark:bg-[#1C3527] text-[#26332B] dark:text-[#E8F0EB] text-sm font-medium hover:bg-[#DCE7D8] dark:hover:bg-[#284936] transition-all cursor-pointer"
            >
              List Another Item
            </button>
          </div>
        </div>
      ) : (
        /* Form & Live Preview Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 bg-white dark:bg-[#112219] rounded-3xl p-6 sm:p-8 border border-[#DCE7D8] dark:border-[#214232] shadow-xs space-y-6 text-left"
          >
            {/* Provider info pill */}
            <div className="p-3 bg-[#F8F6EF] dark:bg-[#162B1F] rounded-xl border border-[#DCE7D8] dark:border-[#214232] flex items-center justify-between text-xs text-[#737C73] dark:text-[#95A599]">
              <span className="flex items-center gap-1.5 font-medium text-[#26332B] dark:text-[#E8F0EB]">
                <Building2 className="w-4 h-4 text-[#163D2B] dark:text-emerald-400" />
                <span>Listing as: <strong>{currentUser.name}</strong></span>
              </span>
              <span className="text-[11px] bg-white dark:bg-[#0D1A13] px-2 py-0.5 rounded border border-[#DCE7D8] dark:border-[#214232] text-[#26332B] dark:text-[#E8F0EB]">
                {currentUser.organization || 'Verified Provider'}
              </span>
            </div>

            {/* Food Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#26332B] dark:text-[#D1E0D6] mb-1.5">
                Food Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Assorted Bakery Sourdough Bread"
                className="w-full px-4 py-2.5 rounded-xl border border-[#DCE7D8] dark:border-[#214232] bg-[#F8F6EF]/50 dark:bg-[#162B1F]/60 focus:bg-white dark:focus:bg-[#162B1F] text-sm text-[#163D2B] dark:text-[#E8F0EB] focus:outline-hidden focus:ring-2 focus:ring-[#163D2B]/20 dark:focus:ring-emerald-500/20 focus:border-[#163D2B] dark:focus:border-emerald-500 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
              />
            </div>

            {/* Category & Quantity Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#26332B] dark:text-[#D1E0D6] mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DCE7D8] dark:border-[#214232] bg-[#F8F6EF]/50 dark:bg-[#162B1F]/60 focus:bg-white dark:focus:bg-[#162B1F] text-sm text-[#163D2B] dark:text-[#E8F0EB] focus:outline-hidden focus:ring-2 focus:ring-[#163D2B]/20"
                >
                  <option value="Prepared Meals">Prepared Meals</option>
                  <option value="Bakery & Bread">Bakery & Bread</option>
                  <option value="Produce & Fruits">Produce & Fruits</option>
                  <option value="Packaged Goods">Packaged Goods</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#26332B] dark:text-[#D1E0D6] mb-1.5">
                  Quantity & Unit *
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 px-3 py-2.5 rounded-xl border border-[#DCE7D8] dark:border-[#214232] bg-[#F8F6EF]/50 dark:bg-[#162B1F]/60 focus:bg-white dark:focus:bg-[#162B1F] text-sm text-[#163D2B] dark:text-[#E8F0EB] focus:outline-hidden"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="flex-1 px-3 py-2.5 rounded-xl border border-[#DCE7D8] dark:border-[#214232] bg-[#F8F6EF]/50 dark:bg-[#162B1F]/60 focus:bg-white dark:focus:bg-[#162B1F] text-sm text-[#163D2B] dark:text-[#E8F0EB] focus:outline-hidden"
                  >
                    <option value="portions">portions</option>
                    <option value="boxes">boxes</option>
                    <option value="packs">packs</option>
                    <option value="kg">kg</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#26332B] dark:text-[#D1E0D6] mb-1.5">
                Description & Packaging Details *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention packaging, condition, warmth, and handling notes..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#DCE7D8] dark:border-[#214232] bg-[#F8F6EF]/50 dark:bg-[#162B1F]/60 focus:bg-white dark:focus:bg-[#162B1F] text-sm text-[#163D2B] dark:text-[#E8F0EB] focus:outline-hidden focus:ring-2 focus:ring-[#163D2B]/20 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
              />
            </div>

            {/* Timing Grid: Preparation hour & Pickup Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#26332B] dark:text-[#D1E0D6] mb-1.5">
                  Prepared (Hours ago)
                </label>
                <input
                  type="number"
                  min="0"
                  max="48"
                  value={prepHoursAgo}
                  onChange={(e) => setPrepHoursAgo(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DCE7D8] dark:border-[#214232] bg-[#F8F6EF]/50 dark:bg-[#162B1F]/60 focus:bg-white dark:focus:bg-[#162B1F] text-sm text-[#163D2B] dark:text-[#E8F0EB] focus:outline-hidden"
                />
                <span className="text-[11px] text-[#737C73] dark:text-[#95A599] mt-1 block">
                  When was this batch cooked or baked?
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#26332B] dark:text-[#D1E0D6] mb-1.5">
                  Pickup Cutoff Window (Hours from now) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="72"
                  required
                  value={pickupHoursFromNow}
                  onChange={(e) => setPickupHoursFromNow(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DCE7D8] dark:border-[#214232] bg-[#F8F6EF]/50 dark:bg-[#162B1F]/60 focus:bg-white dark:focus:bg-[#162B1F] text-sm text-[#163D2B] dark:text-[#E8F0EB] focus:outline-hidden"
                />
                <span className="text-[11px] text-[#737C73] dark:text-[#95A599] mt-1 block">
                  Listing will expire after this time window.
                </span>
              </div>
            </div>

            {/* Pickup Location & Storage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#26332B] dark:text-[#D1E0D6] mb-1.5">
                  Pickup Location Point *
                </label>
                <input
                  type="text"
                  required
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="e.g. Canteen Counter 2, Tech Block Gate 1"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DCE7D8] dark:border-[#214232] bg-[#F8F6EF]/50 dark:bg-[#162B1F]/60 focus:bg-white dark:focus:bg-[#162B1F] text-sm text-[#163D2B] dark:text-[#E8F0EB] focus:outline-hidden placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#26332B] dark:text-[#D1E0D6] mb-1.5">
                  Storage Conditions
                </label>
                <input
                  type="text"
                  value={storageInfo}
                  onChange={(e) => setStorageInfo(e.target.value)}
                  placeholder="e.g. Refrigerated at 4°C, Room temp"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DCE7D8] dark:border-[#214232] bg-[#F8F6EF]/50 dark:bg-[#162B1F]/60 focus:bg-white dark:focus:bg-[#162B1F] text-sm text-[#163D2B] dark:text-[#E8F0EB] focus:outline-hidden placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                />
              </div>
            </div>

            {/* Dietary Tags */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#26332B] dark:text-[#D1E0D6] mb-2">
                Dietary Compatibility
              </label>
              <div className="flex flex-wrap gap-2">
                {DIETARY_OPTIONS.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleDietary(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                      dietaryTags.includes(tag)
                        ? 'bg-[#163D2B] dark:bg-emerald-600 text-white shadow-xs'
                        : 'bg-[#F8F6EF] dark:bg-[#162B1F] text-[#737C73] dark:text-[#95A599] border border-[#DCE7D8] dark:border-[#214232]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Allergen Declarations */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#26332B] dark:text-[#D1E0D6] mb-1">
                Declared Allergens (Mandatory Safety Field) *
              </label>
              <p className="text-[11px] text-[#737C73] dark:text-[#95A599] mb-2">
                Select all ingredients present to allow safe AI matching and protect allergic recipients.
              </p>
              <div className="flex flex-wrap gap-2">
                {ALLERGEN_OPTIONS.map((alg) => (
                  <button
                    type="button"
                    key={alg}
                    onClick={() => toggleAllergen(alg)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                      declaredAllergens.includes(alg)
                        ? alg === 'None Declared'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-[#DCA647] text-black font-bold shadow-xs'
                        : 'bg-[#F8F6EF] dark:bg-[#162B1F] text-[#737C73] dark:text-[#95A599] border border-[#DCE7D8] dark:border-[#214232]'
                    }`}
                  >
                    {alg}
                  </button>
                ))}
              </div>
            </div>

            {/* Preset Images Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#26332B] dark:text-[#D1E0D6] mb-2">
                Select Photo or Preset Image
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                {SAMPLE_PRESET_IMAGES.map((preset) => (
                  <button
                    type="button"
                    key={preset.name}
                    onClick={() => setImageUrl(preset.url)}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                      imageUrl === preset.url
                        ? 'border-[#163D2B] dark:border-emerald-400 ring-2 ring-[#D9F36A]'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Or paste custom image URL..."
                className="w-full px-4 py-2 rounded-xl border border-[#DCE7D8] dark:border-[#214232] bg-[#F8F6EF]/50 dark:bg-[#162B1F]/60 text-xs text-[#163D2B] dark:text-[#E8F0EB] focus:outline-hidden placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
              />
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-[#163D2B] dark:bg-emerald-600 text-white font-bold text-sm hover:bg-[#10291F] dark:hover:bg-emerald-500 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-[#D9F36A]" />
              <span>{isSubmitting ? 'Publishing Listing...' : 'Publish Surplus Food Listing'}</span>
            </button>
          </form>

          {/* Live Card Preview Column */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-28">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#163D2B] dark:text-emerald-400">
              <Eye className="w-4 h-4" />
              <span>Live Marketplace Preview</span>
            </div>
            <p className="text-xs text-[#737C73] dark:text-[#95A599]">
              This is how your surplus card will appear to recipients and coordinators in real time.
            </p>

            <FoodCard listing={previewListing} onSelect={() => {}} />
          </div>
        </div>
      )}
    </div>
  );
};
