import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Heart, ShieldCheck, Leaf, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#10291F] dark:bg-[#060E0A] text-[#DCE7D8] pt-14 pb-10 border-t border-[#163D2B] dark:border-[#14261B] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#163D2B]/80 dark:border-[#14261B]">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#163D2B] dark:bg-[#D9F36A] flex items-center justify-center text-[#D9F36A] dark:text-[#10291F]">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="font-editorial text-2xl font-bold tracking-tight text-white">
                LastPlate
              </span>
            </div>
            <p className="text-sm text-neutral-300 max-w-md leading-relaxed">
              Every day, perfectly good food goes unsold across college canteens, bakeries, cafes, and grocers.
              LastPlate connects surplus food providers with eligible recipients before time runs out.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#163D2B] text-[#D9F36A]">
                <Sparkles className="w-3.5 h-3.5" />
                Zero-Waste Circular Platform
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#163D2B]/80 text-white">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                Verified Edible Food Redistribution
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Application
            </h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>
                <Link to="/discover" className="hover:text-[#D9F36A] transition-colors">
                  Surplus Marketplace
                </Link>
              </li>
              <li>
                <Link to="/list-surplus" className="hover:text-[#D9F36A] transition-colors">
                  List Surplus Food
                </Link>
              </li>
              <li>
                <Link to="/my-claims" className="hover:text-[#D9F36A] transition-colors">
                  Recipient Dashboard
                </Link>
              </li>
              <li>
                <Link to="/coordinator" className="hover:text-[#D9F36A] transition-colors">
                  Coordinator Command Centre
                </Link>
              </li>
              <li>
                <Link to="/impact" className="hover:text-[#D9F36A] transition-colors">
                  Environmental Impact
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-[#D9F36A] transition-colors">
                  Methodology & Safety Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Integrity & Trust
            </h4>
            <div className="space-y-3 text-xs text-neutral-300 leading-relaxed">
              <p className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D9F36A] shrink-0 mt-0.5" />
                <span>
                  <strong>Safety First:</strong> Providers supply accurate preparation and allergen declarations. Recipients verify quality upon handover.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <Leaf className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Defensible Impact:</strong> Calculations use a 0.45 kg/portion baseline. Only confirmed collections count toward impact ledgers.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <p>© 2026 LastPlate · Give Good Food a Second Chance. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-neutral-300">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for sustainable communities
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
