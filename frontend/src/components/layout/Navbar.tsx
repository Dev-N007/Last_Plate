import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  UtensilsCrossed,
  ShoppingBag,
  PlusCircle,
  LayoutDashboard,
  BarChart3,
  BookOpen,
  RotateCcw,
  UserCheck,
  ChevronDown,
  Check,
  Menu,
  X,
  ShieldCheck,
  Building2,
  HeartHandshake,
  Sun,
  Moon,
  LogIn,
  LogOut,
  QrCode,
  Sparkles
} from 'lucide-react';
import { useAuth, PERSONA_PROFILES } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const {
    isAuthenticated,
    user,
    role,
    capabilities,
    loginAsPersona,
    logout,
    openLoginModal,
    resetDemoData
  } = useAuth();

  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Persona-specific navigation links
  const getNavLinks = () => {
    switch (role) {
      case 'provider':
        return [
          { to: '/discover', label: 'Surplus Inventory', icon: ShoppingBag },
          { to: '/list-surplus', label: 'List Surplus', icon: PlusCircle },
          { to: '/verify-handover', label: 'Verify Handover', icon: QrCode },
          { to: '/impact', label: 'Impact Ledger', icon: BarChart3 }
        ];
      case 'coordinator':
        return [
          { to: '/coordinator', label: 'Command Centre', icon: LayoutDashboard },
          { to: '/verify-handover', label: 'Verify Handover', icon: QrCode },
          { to: '/discover', label: 'Surplus Grid', icon: ShoppingBag },
          { to: '/impact', label: 'Impact Ledger', icon: BarChart3 },
          { to: '/how-it-works', label: 'Methodology', icon: BookOpen }
        ];
      case 'recipient':
      default:
        return [
          { to: '/discover', label: 'Discover Food', icon: ShoppingBag },
          { to: '/my-claims', label: 'My Claims', icon: UtensilsCrossed },
          { to: '/impact', label: 'Impact Ledger', icon: BarChart3 },
          { to: '/how-it-works', label: 'Methodology', icon: BookOpen }
        ];
    }
  };

  const navLinks = getNavLinks();

  const roleProfiles: { role: UserRole; title: string; subtitle: string; icon: any }[] = [
    {
      role: 'recipient',
      title: 'Community Recipient',
      subtitle: PERSONA_PROFILES.recipient.name,
      icon: HeartHandshake
    },
    {
      role: 'provider',
      title: 'Food Provider',
      subtitle: PERSONA_PROFILES.provider.name,
      icon: Building2
    },
    {
      role: 'coordinator',
      title: 'Regional Coordinator',
      subtitle: PERSONA_PROFILES.coordinator.name,
      icon: ShieldCheck
    }
  ];

  const handleReset = async () => {
    setIsResetting(true);
    await resetDemoData();
    setIsResetting(false);
  };

  const isActive = (path: string) => location.pathname === path;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#F8F6EF]/95 dark:bg-[#09150F]/95 backdrop-blur-md border-b border-[#DCE7D8]/80 dark:border-[#1E3A2C] transition-colors duration-300">
      {/* Top Utility Bar */}
      <div className="bg-[#10291F] dark:bg-[#060E0A] text-[#DCE7D8] text-[11px] py-1.5 px-3 sm:px-6 border-b border-[#163D2B] dark:border-[#14261B]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="flex items-center gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#D9F36A] animate-pulse"></span>
              <span className="font-bold tracking-wider text-white uppercase text-[10px]">
                Network Live
              </span>
            </span>
            <span className="text-[#DCE7D8]/40 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-neutral-300 font-medium truncate">
              Surplus Redistribution Grid · Active Regional Hubs
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <span className="hidden md:inline text-neutral-300 text-[11px]">
              Active Role: <strong className="text-[#D9F36A] font-semibold">{capabilities.badgeLabel}</strong>
            </span>
            <button
              onClick={handleReset}
              disabled={isResetting}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[#D9F36A] hover:text-white transition-all cursor-pointer text-[10px] font-semibold"
              title="Reset sample data back to predictable initial demo state"
            >
              <RotateCcw className={`w-3 h-3 ${isResetting ? 'animate-spin' : ''}`} />
              <span className="hidden xs:inline">{isResetting ? 'Resetting...' : 'Reset Sample Data'}</span>
              <span className="xs:hidden">{isResetting ? '...' : 'Reset'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo with tagline */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-[#163D2B] dark:bg-[#D9F36A] flex items-center justify-center text-[#D9F36A] dark:text-[#10291F] shadow-md group-hover:scale-105 transition-all duration-300">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#163D2B] dark:text-[#E8F0EB]">
                  LastPlate
                </span>
              </div>
              <p className="text-[11px] text-[#737C73] dark:text-[#96A89D] leading-none mt-0.5 tracking-wide hidden sm:block">
                Good food. A second chance.
              </p>
            </div>
          </Link>

          {/* Center Persona-Adaptive Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-[#163D2B] text-white dark:bg-[#D9F36A] dark:text-[#10291F] shadow-xs font-semibold'
                      : 'text-[#26332B] dark:text-[#D5E2D9] hover:text-[#163D2B] dark:hover:text-[#D9F36A] hover:bg-[#DCE7D8]/60 dark:hover:bg-[#162D21]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#D9F36A] dark:text-[#10291F]' : 'opacity-70'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Persona Dropdown, Auth & Theme Toggle */}
          <div className="hidden sm:flex items-center gap-3 shrink-0" ref={dropdownRef}>
            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="p-2.5 rounded-2xl bg-white dark:bg-[#12241B] border border-[#DCE7D8] dark:border-[#1E3A2C] text-[#163D2B] dark:text-[#D9F36A] shadow-xs hover:border-[#163D2B]/40 transition-all cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Persona & Auth Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white dark:bg-[#12241B] border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-xs hover:border-[#163D2B]/40 transition-all text-left cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#163D2B]/10 dark:bg-[#163D2B] text-[#163D2B] dark:text-[#D9F36A] flex items-center justify-center font-bold text-xs group-hover:bg-[#163D2B] group-hover:text-white transition-colors">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[#737C73] dark:text-[#96A89D] leading-none">
                    Active Persona
                  </div>
                  <div className="text-xs font-bold text-[#163D2B] dark:text-[#E8F0EB] capitalize flex items-center gap-1 mt-0.5">
                    <span>
                      {role === 'recipient' ? 'Recipient' : role === 'provider' ? 'Food Provider' : 'Coordinator'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#737C73] dark:text-[#96A89D] transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </button>

              {/* Floating Dropdown Card */}
              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#12241B] rounded-2xl shadow-xl border border-[#DCE7D8] dark:border-[#1E3A2C] p-2 space-y-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
                  {/* Current Active Account Header */}
                  <div className="p-3 bg-[#F8F6EF] dark:bg-[#162B1F] rounded-xl border border-[#DCE7D8] dark:border-[#214232]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-[#D9F36A] bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                        {capabilities.badgeLabel}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-[#163D2B] dark:text-[#E8F0EB] truncate">
                      {user ? user.name : 'Guest User'}
                    </div>
                    <div className="text-[11px] text-[#737C73] dark:text-[#96A89D] truncate">
                      {user ? user.organization : 'Not signed in'}
                    </div>
                  </div>

                  <div className="px-3 pt-1 text-[11px] font-bold uppercase tracking-wider text-[#737C73] dark:text-[#96A89D]">
                    Switch Community Role:
                  </div>

                  {roleProfiles.map((item) => {
                    const isSelected = role === item.role;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.role}
                        onClick={() => {
                          loginAsPersona(item.role);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#163D2B] dark:bg-[#1E3A2C] text-white shadow-xs'
                            : 'hover:bg-[#F8F6EF] dark:hover:bg-[#183124] text-[#26332B] dark:text-[#E8F0EB]'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-white/20 text-[#D9F36A]' : 'bg-[#DCE7D8]/60 dark:bg-[#1A3326] text-[#163D2B] dark:text-[#D9F36A]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-[#163D2B] dark:text-[#E8F0EB]'}`}>
                            {item.title}
                          </div>
                          <div className={`text-[10px] truncate ${isSelected ? 'text-neutral-200' : 'text-[#737C73] dark:text-[#96A89D]'}`}>
                            {item.subtitle}
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#D9F36A] shrink-0" />}
                      </button>
                    );
                  })}

                  <div className="pt-2 border-t border-[#DCE7D8]/60 dark:border-[#1E3A2C] flex items-center justify-between gap-2 px-1">
                    <button
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        openLoginModal();
                      }}
                      className="text-xs font-semibold text-[#163D2B] dark:text-[#D9F36A] hover:underline flex items-center gap-1 cursor-pointer py-1"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Account Login</span>
                    </button>

                    {isAuthenticated && (
                      <button
                        onClick={() => {
                          logout();
                          setRoleDropdownOpen(false);
                        }}
                        className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer py-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="p-2.5 rounded-xl bg-white dark:bg-[#12241B] border border-[#DCE7D8] dark:border-[#1E3A2C] text-[#163D2B] dark:text-[#D9F36A]"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-white dark:bg-[#12241B] border border-[#DCE7D8] dark:border-[#1E3A2C] text-[#163D2B] dark:text-[#E8F0EB] hover:bg-[#DCE7D8]/60 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#DCE7D8] dark:border-[#1E3A2C] bg-[#F8F6EF] dark:bg-[#09150F] px-4 pt-4 pb-8 space-y-4 text-left animate-in slide-in-from-top-2 duration-200">
          {/* User Status Card */}
          <div className="p-3.5 bg-white dark:bg-[#12241B] rounded-2xl border border-[#DCE7D8] dark:border-[#1E3A2C] shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-[#D9F36A] bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                {capabilities.badgeLabel}
              </span>
              {isAuthenticated && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Signed in
                </span>
              )}
            </div>
            <div>
              <div className="text-xs font-bold text-[#163D2B] dark:text-[#E8F0EB] truncate">
                {user ? user.name : 'Guest User'}
              </div>
              <div className="text-[11px] text-[#737C73] dark:text-[#96A89D] truncate">
                {user ? user.organization : 'Not signed in'}
              </div>
            </div>

            <p className="text-[11px] font-bold uppercase tracking-wider text-[#737C73] dark:text-[#96A89D] pt-1 border-t border-[#DCE7D8]/60 dark:border-[#1E3A2C]">
              Switch Persona:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(['recipient', 'provider', 'coordinator'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    loginAsPersona(r);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-xs py-2 px-1 rounded-xl font-bold capitalize text-center transition-all cursor-pointer ${
                    role === r
                      ? 'bg-[#163D2B] dark:bg-[#D9F36A] text-white dark:text-[#10291F] shadow-xs'
                      : 'bg-[#F8F6EF] dark:bg-[#162D21] text-[#26332B] dark:text-[#E8F0EB] border border-[#DCE7D8] dark:border-[#1E3A2C]'
                  }`}
                >
                  {r === 'recipient' ? 'Recipient' : r === 'provider' ? 'Provider' : 'Coord'}
                </button>
              ))}
            </div>

            {/* Auth Actions in Mobile Drawer */}
            <div className="pt-2 border-t border-[#DCE7D8]/60 dark:border-[#1E3A2C] flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openLoginModal();
                }}
                className="text-xs font-semibold text-[#163D2B] dark:text-[#D9F36A] hover:underline flex items-center gap-1 cursor-pointer py-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Account Login</span>
              </button>

              {isAuthenticated && (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer py-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    active ? 'bg-[#163D2B] dark:bg-[#D9F36A] text-white dark:text-[#10291F] shadow-xs' : 'text-[#26332B] dark:text-[#E8F0EB] hover:bg-[#DCE7D8]/50 dark:hover:bg-[#162D21]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

