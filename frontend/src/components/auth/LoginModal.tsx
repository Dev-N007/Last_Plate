import React, { useState } from 'react';
import {
  X,
  ChefHat,
  Users,
  ShieldAlert,
  Cpu,
  Lock,
  Mail,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAuth, PERSONA_PROFILES } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const LoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    closeLoginModal,
    loginAsPersona,
    loginWithCredentials,
    targetRoleForModal
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'personas' | 'credentials'>('personas');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRoleForCreds, setSelectedRoleForCreds] = useState<UserRole>(targetRoleForModal || 'recipient');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      loginWithCredentials(email || 'user@campus.edu', selectedRoleForCreds);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#112219] rounded-3xl overflow-hidden shadow-2xl border border-[#DCE7D8] dark:border-[#214232] my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={closeLoginModal}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#F8F6EF] dark:bg-[#162B1F] text-[#737C73] hover:text-black dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b border-[#DCE7D8] dark:border-[#214232] text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#163D2B]/10 dark:bg-emerald-500/15 text-[#163D2B] dark:text-emerald-300 mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Role-Based Authentication</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#163D2B] dark:text-[#E8F0EB]">
            Sign in to LastPlate
          </h2>
          <p className="text-xs text-[#737C73] dark:text-[#95A599] mt-1">
            Choose your community role to access specialized kitchen, claiming, or coordination features.
          </p>

          {/* Tab Navigation */}
          <div className="flex gap-2 mt-5 bg-[#F8F6EF] dark:bg-[#162B1F] p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('personas')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'personas'
                  ? 'bg-white dark:bg-[#112219] text-[#163D2B] dark:text-[#E8F0EB] shadow-xs'
                  : 'text-[#737C73] dark:text-[#95A599]'
              }`}
            >
              Quick Persona Switch
            </button>
            <button
              onClick={() => setActiveTab('credentials')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'credentials'
                  ? 'bg-white dark:bg-[#112219] text-[#163D2B] dark:text-[#E8F0EB] shadow-xs'
                  : 'text-[#737C73] dark:text-[#95A599]'
              }`}
            >
              Account Login
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-4 text-left">
          {activeTab === 'personas' ? (
            <div className="space-y-3">
              {/* Option 1: Provider */}
              <button
                onClick={() => loginAsPersona('provider')}
                className="w-full p-4 rounded-2xl border border-[#DCE7D8] dark:border-[#214232] hover:border-[#163D2B] dark:hover:border-emerald-400 bg-white dark:bg-[#162B1F] hover:bg-[#F8F6EF]/60 dark:hover:bg-[#1C3527]/60 transition-all text-left group cursor-pointer flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#163D2B] dark:text-[#E8F0EB] group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                      Food Provider Persona
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                      Kitchen Portal
                    </span>
                  </div>
                  <p className="text-xs text-[#737C73] dark:text-[#95A599] mt-0.5">
                    Campus Central Dining · List surplus, set expiration cutoffs, verify recipient pickup codes.
                  </p>
                </div>
              </button>

              {/* Option 2: Recipient */}
              <button
                onClick={() => loginAsPersona('recipient')}
                className="w-full p-4 rounded-2xl border border-[#DCE7D8] dark:border-[#214232] hover:border-[#163D2B] dark:hover:border-emerald-400 bg-white dark:bg-[#162B1F] hover:bg-[#F8F6EF]/60 dark:hover:bg-[#1C3527]/60 transition-all text-left group cursor-pointer flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#163D2B] dark:text-[#E8F0EB] group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                      Community Recipient Persona
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                      Claim Access
                    </span>
                  </div>
                  <p className="text-xs text-[#737C73] dark:text-[#95A599] mt-0.5">
                    Hostel Food Committee · Browse marketplace, claim portions, manage collection reference codes.
                  </p>
                </div>
              </button>

              {/* Option 3: Coordinator */}
              <button
                onClick={() => loginAsPersona('coordinator')}
                className="w-full p-4 rounded-2xl border border-[#DCE7D8] dark:border-[#214232] hover:border-[#163D2B] dark:hover:border-emerald-400 bg-white dark:bg-[#162B1F] hover:bg-[#F8F6EF]/60 dark:hover:bg-[#1C3527]/60 transition-all text-left group cursor-pointer flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-lime-100 dark:bg-lime-950/60 text-lime-800 dark:text-[#D9F36A] flex items-center justify-center shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#163D2B] dark:text-[#E8F0EB] group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                      Regional Coordinator Persona
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-lime-800 dark:text-[#D9F36A] bg-lime-50 dark:bg-lime-950/40 px-2 py-0.5 rounded">
                      Command Centre
                    </span>
                  </div>
                  <p className="text-xs text-[#737C73] dark:text-[#95A599] mt-0.5">
                    Central Food Rescue Network · Run autonomous AI matching and audit operational distribution.
                  </p>
                </div>
              </button>
            </div>
          ) : (
            /* Traditional Credentials Form */
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#26332B] dark:text-[#D1E0D6] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#737C73] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. lead@dining.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DCE7D8] dark:border-[#214232] bg-[#F8F6EF]/60 dark:bg-[#162B1F]/60 text-sm text-[#163D2B] dark:text-[#E8F0EB] focus:outline-hidden focus:ring-1 focus:ring-[#163D2B] dark:focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#26332B] dark:text-[#D1E0D6] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#737C73] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DCE7D8] dark:border-[#214232] bg-[#F8F6EF]/60 dark:bg-[#162B1F]/60 text-sm text-[#163D2B] dark:text-[#E8F0EB] focus:outline-hidden focus:ring-1 focus:ring-[#163D2B] dark:focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#26332B] dark:text-[#D1E0D6] mb-1">
                  Target Role
                </label>
                <select
                  value={selectedRoleForCreds}
                  onChange={(e) => setSelectedRoleForCreds(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE7D8] dark:border-[#214232] bg-[#F8F6EF]/60 dark:bg-[#162B1F]/60 text-sm text-[#163D2B] dark:text-[#E8F0EB] focus:outline-hidden"
                >
                  <option value="recipient">Community Recipient</option>
                  <option value="provider">Food Provider</option>
                  <option value="coordinator">Regional Coordinator</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#163D2B] dark:bg-emerald-600 text-white font-bold text-sm hover:bg-[#10291F] dark:hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In with Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
