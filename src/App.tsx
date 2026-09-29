import React, { useState, useEffect } from 'react';
import {
  PlannerMode,
  Currency,
  AnyPlan,
  HomePlan,
  PartyPlan,
  JewelryPlan,
  SavedPlan
} from './types';
import { Header } from './components/Header';
import { HomePlannerForm } from './components/HomePlannerForm';
import { PartyPlannerForm } from './components/PartyPlannerForm';
import { JewelryPlannerForm } from './components/JewelryPlannerForm';
import { RecommendationResults } from './components/RecommendationResults';
import { SavedPlansModal } from './components/SavedPlansModal';
import { Toast } from './components/Toast';
import {
  generateHomeRecommendations,
  generatePartyRecommendations,
  generateJewelryRecommendations,
  refinePlan
} from './services/api';
import {
  SAMPLE_HOME_PLAN,
  SAMPLE_PARTY_PLAN,
  SAMPLE_JEWELRY_PLAN
} from './data/mockPresets';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle,
  ShoppingBag,
  Zap,
  TrendingDown,
  Layers,
  ArrowRight
} from 'lucide-react';

const STORAGE_KEY = 'pocketsmart_ai_saved_plans_v1';

export default function App() {
  const [currentMode, setCurrentMode] = useState<PlannerMode>('home');
  const [currency, setCurrency] = useState<Currency>('INR');
  const [currentPlan, setCurrentPlan] = useState<AnyPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);

  // Load saved plans from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedPlans(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to parse saved plans from localStorage', e);
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const saveCurrentPlanToStorage = () => {
    if (!currentPlan) return;
    const title =
      currentMode === 'home'
        ? (currentPlan as HomePlan).style || 'Home Interior Plan'
        : currentMode === 'party'
        ? `Party Plan (${(currentPlan as PartyPlan).guestCount} Guests)`
        : 'Jewelry & Outfit Matching Suite';

    const newSavedItem: SavedPlan = {
      id: `plan-${Date.now()}`,
      timestamp: Date.now(),
      type: currentMode,
      title,
      totalBudget: currentPlan.totalBudget,
      estimatedSpend: currentPlan.totalEstimatedSpend,
      currency: currentPlan.currency || currency,
      plan: currentPlan
    };

    const updated = [newSavedItem, ...savedPlans.filter((p) => p.id !== newSavedItem.id)];
    setSavedPlans(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
    showToast('Plan successfully saved to My Plans!');
  };

  const handleDeleteSavedPlan = (id: string) => {
    const updated = savedPlans.filter((p) => p.id !== id);
    setSavedPlans(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to write to localStorage', e);
    }
    showToast('Plan removed from saved list.', 'info');
  };

  const handleSelectSavedPlan = (item: SavedPlan) => {
    setCurrentMode(item.type);
    setCurrency(item.currency);
    setCurrentPlan(item.plan);
    setIsSavedModalOpen(false);
    showToast(`Loaded ${item.title}`);
  };

  // Scenario 1: Home Interior Planning
  const handleHomeSubmit = async (data: {
    totalBudget: number;
    currency: Currency;
    rooms: string[];
    items: { name: string; qty: number }[];
    style: string;
    priorities: string;
    targetPlatforms: string[];
  }) => {
    setIsLoading(true);
    try {
      const plan = await generateHomeRecommendations(data);
      setCurrentPlan(plan);
      showToast('Home interior recommendations generated!');
    } catch (error: any) {
      console.error(error);
      showToast('Failed to generate plan. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Scenario 2: Party Planner
  const handlePartySubmit = async (data: {
    totalBudget: number;
    currency: Currency;
    guestCount: number;
    eventType: string;
    venueType: string;
    theme: string;
    includeAccommodation: boolean;
    dietaryPreference: string;
  }) => {
    setIsLoading(true);
    try {
      const plan = await generatePartyRecommendations(data);
      setCurrentPlan(plan);
      showToast('Party plan and procurement breakdown generated!');
    } catch (error: any) {
      console.error(error);
      showToast('Failed to generate party plan.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Scenario 3: Jewelry Planner
  const handleJewelrySubmit = async (data: {
    totalBudget: number;
    currency: Currency;
    occasion: string;
    style: string;
    metalPreference: string;
    outfitDescription: string;
    outfitImageBase64?: string | null;
    outfitImageMimeType?: string;
  }) => {
    setIsLoading(true);
    try {
      const plan = await generateJewelryRecommendations(data);
      setCurrentPlan(plan);
      showToast('Jewelry suite curated with visual synergy!');
    } catch (error: any) {
      console.error(error);
      showToast('Failed to generate jewelry plan.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Interactive AI Refine
  const handleRefinePlan = async (instruction: string) => {
    if (!currentPlan) return;
    setIsRefining(true);
    try {
      const updated = await refinePlan({
        currentPlan,
        userInstruction: instruction,
        plannerType: currentMode
      });
      setCurrentPlan(updated);
      showToast('Plan updated according to your instructions!');
    } catch (error: any) {
      console.error(error);
      showToast('Failed to refine plan. Please try a different prompt.', 'error');
    } finally {
      setIsRefining(false);
    }
  };

  // Quick Demo Presets
  const handleLoadPreset = (mode: PlannerMode) => {
    setCurrentMode(mode);
    if (mode === 'home') {
      setCurrentPlan(SAMPLE_HOME_PLAN);
      showToast('Loaded Demo: Urban 2BHK Scandinavian Living Room');
    } else if (mode === 'party') {
      setCurrentPlan(SAMPLE_PARTY_PLAN);
      showToast('Loaded Demo: Rooftop Neon Glow Birthday (25 Guests)');
    } else {
      setCurrentPlan(SAMPLE_JEWELRY_PLAN);
      showToast('Loaded Demo: Royal Sangeet Emerald Lehenga Jewelry');
    }
  };

  const handleReset = () => {
    setCurrentPlan(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <Header
        currentMode={currentMode}
        onModeChange={(mode) => {
          setCurrentMode(mode);
          setCurrentPlan(null);
        }}
        currency={currency}
        onCurrencyChange={setCurrency}
        savedPlansCount={savedPlans.length}
        onOpenSavedPlans={() => setIsSavedModalOpen(true)}
        onReset={handleReset}
        onLoadPreset={handleLoadPreset}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 md:py-8 space-y-8">
        {/* Intro Hero Subheader when on Form */}
        {!currentPlan && (
          <div className="text-center max-w-3xl mx-auto space-y-3 pt-2 pb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Cross-Platform GenAI Recommendation System
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Spend Smarter Across{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                Every Life Milestone
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
              PocketSmart AI uses Gemini to allocate your budget proportionally and source curated, price-matched items from <strong>Amazon, Flipkart, IKEA, Swiggy, Zomato, OYO & Myntra</strong>.
            </p>
          </div>
        )}

        {/* View Switcher: Active Plan vs Input Forms */}
        {currentPlan ? (
          <RecommendationResults
            mode={currentMode}
            plan={currentPlan}
            currency={currency}
            onRefinePlan={handleRefinePlan}
            isRefining={isRefining}
            onSavePlan={saveCurrentPlanToStorage}
            onBackToEdit={() => setCurrentPlan(null)}
          />
        ) : (
          <div className="max-w-5xl mx-auto">
            {currentMode === 'home' && (
              <HomePlannerForm
                currency={currency}
                onSubmit={handleHomeSubmit}
                isLoading={isLoading}
              />
            )}

            {currentMode === 'party' && (
              <PartyPlannerForm
                currency={currency}
                onSubmit={handlePartySubmit}
                isLoading={isLoading}
              />
            )}

            {currentMode === 'jewelry' && (
              <JewelryPlannerForm
                currency={currency}
                onSubmit={handleJewelrySubmit}
                isLoading={isLoading}
              />
            )}
          </div>
        )}

        {/* Supported Platforms Banner */}
        <div className="pt-8 border-t border-slate-900">
          <div className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
            Unified Intelligent Procurement Across Leading Ecosystems
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 opacity-75">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-amber-300">
              IKEA
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-amber-400">
              Amazon
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-sky-400">
              Flipkart
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-orange-400">
              Swiggy
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-red-400">
              Zomato
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-rose-400">
              OYO Rooms
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-fuchsia-400">
              Myntra
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-emerald-400">
              Pepperfry
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-300">PocketSmart AI</span>
            <span>• GenAI-Powered Smart Budgeting & Cross-Platform Recommendations</span>
          </div>
          <div className="text-slate-500">
            Powered by Google Gemini 1.5 Flash Pro & multimodal reasoning
          </div>
        </div>
      </footer>

      {/* Saved Plans Modal */}
      <SavedPlansModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedPlans={savedPlans}
        onSelectPlan={handleSelectSavedPlan}
        onDeletePlan={handleDeleteSavedPlan}
        currency={currency}
      />

      {/* Floating Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
