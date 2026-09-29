import React from 'react';
import { PlannerMode, Currency } from '../types';
import { Sparkles, Home, PartyPopper, Gem, Bookmark, RotateCcw } from 'lucide-react';

interface HeaderProps {
  currentMode: PlannerMode;
  onModeChange: (mode: PlannerMode) => void;
  currency: Currency;
  onCurrencyChange: (curr: Currency) => void;
  savedPlansCount: number;
  onOpenSavedPlans: () => void;
  onReset: () => void;
  onLoadPreset: (mode: PlannerMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onModeChange,
  currency,
  onCurrencyChange,
  savedPlansCount,
  onOpenSavedPlans,
  onReset,
  onLoadPreset
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onReset}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-500 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  PocketSmart<span className="text-white"> AI</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  GenAI Optimizer
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Cross-Platform Budget Allocation & Multi-Vendor Recommendations
              </p>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenSavedPlans}
              className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              title="Saved Plans"
            >
              <Bookmark className="w-4 h-4" />
              {savedPlansCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950 flex items-center justify-center">
                  {savedPlansCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Center Mode Switcher Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 shadow-inner w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => onModeChange('home')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
              currentMode === 'home'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Home className="w-4 h-4" />
            Home Interior
          </button>

          <button
            onClick={() => onModeChange('party')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
              currentMode === 'party'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <PartyPopper className="w-4 h-4" />
            Party Planner
          </button>

          <button
            onClick={() => onModeChange('jewelry')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
              currentMode === 'jewelry'
                ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-md shadow-fuchsia-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Gem className="w-4 h-4" />
            Jewelry & Outfits
          </button>
        </div>

        {/* Right Tools: Currency, Demo Presets & Saved Plans */}
        <div className="hidden md:flex items-center gap-3">
          {/* Currency Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-semibold text-slate-300">
            {(['INR', 'USD', 'EUR'] as Currency[]).map((curr) => (
              <button
                key={curr}
                onClick={() => onCurrencyChange(curr)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  currency === curr
                    ? 'bg-slate-800 text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {curr === 'INR' ? '₹ INR' : curr === 'USD' ? '$ USD' : '€ EUR'}
              </button>
            ))}
          </div>

          {/* Quick Demo Preset Button */}
          <button
            onClick={() => onLoadPreset(currentMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 text-xs font-semibold transition-all shadow-sm"
            title="Load Pre-configured AI Scenario"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Demo Plan</span>
          </button>

          {/* Saved Plans */}
          <button
            onClick={onOpenSavedPlans}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-all"
          >
            <Bookmark className="w-3.5 h-3.5 text-slate-400" />
            <span>Saved Plans</span>
            {savedPlansCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950">
                {savedPlansCount}
              </span>
            )}
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-all"
            title="Reset Form"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
