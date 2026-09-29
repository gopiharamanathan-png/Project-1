import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  PlannerMode,
  HomePlan,
  PartyPlan,
  JewelryPlan,
  AnyPlan,
  Currency,
  RecommendationItem
} from '../types';
import {
  formatCurrency,
  getPlatformBadgeStyle,
  getTradeoffBadge
} from '../utils/formatters';
import {
  Sparkles,
  ArrowRight,
  TrendingDown,
  ExternalLink,
  CheckCircle2,
  Circle,
  Copy,
  Printer,
  Bookmark,
  Share2,
  RefreshCw,
  Search,
  Filter,
  DollarSign,
  Tag,
  ChevronDown,
  ChevronUp,
  Clock,
  Lightbulb,
  Camera,
  Layers,
  ArrowDownUp
} from 'lucide-react';

interface RecommendationResultsProps {
  mode: PlannerMode;
  plan: AnyPlan;
  currency: Currency;
  onRefinePlan: (instruction: string) => Promise<void>;
  isRefining: boolean;
  onSavePlan: () => void;
  onBackToEdit: () => void;
}

export const RecommendationResults: React.FC<RecommendationResultsProps> = ({
  mode,
  plan,
  currency,
  onRefinePlan,
  isRefining,
  onSavePlan,
  onBackToEdit
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [checkedItemIds, setCheckedItemIds] = useState<Set<string>>(new Set());
  const [expandedAlternatives, setExpandedAlternatives] = useState<Set<string>>(new Set());
  const [customRefineText, setCustomRefineText] = useState<string>('');
  const [copiedChecklist, setCopiedChecklist] = useState<boolean>(false);

  // Cast plan according to mode
  const homePlan = mode === 'home' ? (plan as HomePlan) : null;
  const partyPlan = mode === 'party' ? (plan as PartyPlan) : null;
  const jewelryPlan = mode === 'jewelry' ? (plan as JewelryPlan) : null;

  const totalBudget = plan.totalBudget || 0;
  const totalEstimatedSpend = plan.totalEstimatedSpend || 0;
  const savingsCushion = Math.max(0, totalBudget - totalEstimatedSpend);
  const savingsPercent = totalBudget > 0 ? Math.round((savingsCushion / totalBudget) * 100) : 0;

  // Trigger celebration confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const toggleItemCheck = (id: string) => {
    setCheckedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAlternative = (id: string) => {
    setExpandedAlternatives((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Filter recommendations
  const recommendations = plan.recommendations || [];
  const filteredItems = recommendations.filter((item) => {
    if (selectedPlatform !== 'All' && !item.platform.toLowerCase().includes(selectedPlatform.toLowerCase())) {
      return false;
    }
    if (selectedTier !== 'All' && item.tradeoffTier !== selectedTier) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCat = (item.category || '').toLowerCase().includes(q);
      const matchRoom = (item.room || '').toLowerCase().includes(q);
      if (!matchTitle && !matchCat && !matchRoom) return false;
    }
    return true;
  });

  // Calculate checked items spend
  const checkedSpend = recommendations
    .filter((i) => checkedItemIds.has(i.id))
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  // Quick Refine Chips
  const refineChips =
    mode === 'home'
      ? ['Make it 10% cheaper', 'Swap to IKEA only', 'Focus on Scandinavian wood', 'Reduce lighting cost']
      : mode === 'party'
      ? ['Cut catering budget by 15%', 'Add more finger food platters', 'Keep under ₹1,000 per guest', 'Swap to casual pizza pack']
      : ['Keep under ₹7,500 budget', 'Swap to minimalist rose gold', 'Focus on Kundan choker', 'Lighter weight earrings'];

  const handleRefineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRefineText.trim() || isRefining) return;
    await onRefinePlan(customRefineText);
    setCustomRefineText('');
  };

  const handleCopyChecklist = () => {
    const lines = [
      `🛒 PocketSmart AI Shopping Plan (${mode.toUpperCase()})`,
      `Total Budget: ${formatCurrency(totalBudget, currency)}`,
      `Estimated Spend: ${formatCurrency(totalEstimatedSpend, currency)} (Savings: ${formatCurrency(savingsCushion, currency)})`,
      '',
      ...recommendations.map(
        (i, idx) =>
          `${idx + 1}. [${i.platform}] ${i.title} - ${formatCurrency(i.totalPrice, currency)} (${i.quantity}x)\n   Link: ${i.shoppingSearchUrl}`
      )
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedChecklist(true);
    setTimeout(() => setCopiedChecklist(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Banner: Budget Health & Strategic Allocation */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  AI Plan Generated
                </span>
                <span className="text-xs text-slate-400 capitalize">
                  {mode === 'home' ? 'Home Interior' : mode === 'party' ? 'Party & Event' : 'Jewelry & Outfit'} Mode
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Optimized Multi-Platform Procurement Strategy
              </h1>
              <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
                {plan.summary}
              </p>
            </div>

            {/* Actions: Save, Print, Back */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={onSavePlan}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all shadow-sm"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save Plan</span>
              </button>

              <button
                onClick={handleCopyChecklist}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
              >
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>{copiedChecklist ? 'Copied!' : 'Copy List'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
                title="Print Plan"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                onClick={onBackToEdit}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>New Budget</span>
              </button>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Budget Card */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
              <div className="text-[11px] font-semibold text-slate-400 mb-1">Target Budget</div>
              <div className="text-xl md:text-2xl font-black text-white">
                {formatCurrency(totalBudget, currency)}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">100% User Defined Ceiling</div>
            </div>

            {/* Estimated Spend Card */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
              <div className="text-[11px] font-semibold text-slate-400 mb-1">AI Curated Spend</div>
              <div className="text-xl md:text-2xl font-black text-emerald-400">
                {formatCurrency(totalEstimatedSpend, currency)}
              </div>
              <div className="text-[10px] text-emerald-500/80 mt-1">
                Across {recommendations.length} Selected Items
              </div>
            </div>

            {/* Savings Cushion Card */}
            <div
              onClick={triggerConfetti}
              className="bg-slate-950/70 border border-emerald-500/30 rounded-2xl p-4 cursor-pointer hover:border-emerald-500/60 transition-all group"
            >
              <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-400 mb-1">
                <span>Savings Cushion</span>
                <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300 group-hover:scale-105 transition-transform">
                  🎉 {savingsPercent}% Saved
                </span>
              </div>
              <div className="text-xl md:text-2xl font-black text-emerald-300">
                {formatCurrency(savingsCushion, currency)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Unallocated reserve / contingency
              </div>
            </div>

            {/* Contextual Metric (Per Guest / Checked Total) */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
              {mode === 'party' && partyPlan ? (
                <>
                  <div className="text-[11px] font-semibold text-orange-400 mb-1">
                    Cost Per Guest ({partyPlan.guestCount} Guests)
                  </div>
                  <div className="text-xl md:text-2xl font-black text-white">
                    {formatCurrency(partyPlan.costPerGuest, currency)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">All-inclusive per attendee</div>
                </>
              ) : (
                <>
                  <div className="text-[11px] font-semibold text-indigo-400 mb-1">
                    Checked / In Cart Spend
                  </div>
                  <div className="text-xl md:text-2xl font-black text-white">
                    {formatCurrency(checkedSpend, currency)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {checkedItemIds.size} of {recommendations.length} items checked
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Visual Budget Allocation Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300">Budget Utilization Meter</span>
              <span className="text-emerald-400">
                {Math.round((totalEstimatedSpend / Math.max(1, totalBudget)) * 100)}% Spent •{' '}
                {savingsPercent}% Buffer
              </span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
              <div
                style={{
                  width: `${Math.min(100, Math.round((totalEstimatedSpend / Math.max(1, totalBudget)) * 100))}%`
                }}
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 transition-all duration-500"
              />
              <div
                style={{ width: `${Math.max(0, 100 - Math.round((totalEstimatedSpend / Math.max(1, totalBudget)) * 100))}%` }}
                className="h-full bg-emerald-500/20"
              />
            </div>
          </div>

          {/* Special Contextual Displays */}
          {/* Home Category Breakdown */}
          {homePlan && homePlan.categoryBreakdown && (
            <div className="pt-3 border-t border-slate-800/80">
              <div className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                Category Distribution
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {homePlan.categoryBreakdown.map((cat) => (
                  <div
                    key={cat.category}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
                  >
                    <div className="text-[11px] font-semibold text-slate-400 truncate">
                      {cat.category}
                    </div>
                    <div className="font-bold text-white mt-0.5">
                      {formatCurrency(cat.estimatedSpend, currency)}
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">
                      {cat.percentage}% of allocation
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Party Allocation Breakdown */}
          {partyPlan && partyPlan.allocationBreakdown && (
            <div className="pt-3 border-t border-slate-800/80">
              <div className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-orange-400" />
                Party Pillar Allocation
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(partyPlan.allocationBreakdown).map(([key, val]) => (
                  <div
                    key={key}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
                  >
                    <div className="text-[11px] font-semibold text-slate-400 capitalize">
                      {key.replace('venueOrStay', 'Venue / Stay')}
                    </div>
                    <div className="font-bold text-white mt-0.5">
                      {formatCurrency(val.allocatedAmount, currency)}
                    </div>
                    <div className="text-[10px] text-orange-400 mt-0.5">
                      {val.percentage}% • {val.platform || 'Online'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Jewelry Outfit Multimodal Analysis */}
          {jewelryPlan && jewelryPlan.outfitAnalysis && (
            <div className="pt-3 border-t border-slate-800/80 bg-fuchsia-950/20 p-4 rounded-2xl border border-fuchsia-500/20">
              <div className="text-xs font-bold text-fuchsia-300 mb-2 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-fuchsia-400" />
                Gemini Multimodal Outfit Analysis
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">
                    Dominant Palette
                  </span>
                  <span className="font-semibold text-slate-200">
                    {jewelryPlan.outfitAnalysis.dominantColors}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">
                    Neckline Cut Harmony
                  </span>
                  <span className="font-semibold text-slate-200">
                    {jewelryPlan.outfitAnalysis.necklineHarmony}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">
                    Styling Vibe
                  </span>
                  <span className="font-semibold text-slate-200">
                    {jewelryPlan.outfitAnalysis.stylingVibe}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Refinement Bar ("Plan Adjuster") */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-white">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            AI Budget & Recommendation Refiner
          </div>
          <span className="text-[11px] text-slate-400">
            Prompt Gemini to adjust prices, platforms, or items
          </span>
        </div>

        {/* Quick Refine Prompt Chips */}
        <div className="flex flex-wrap gap-2">
          {refineChips.map((chip) => (
            <button
              key={chip}
              type="button"
              disabled={isRefining}
              onClick={() => onRefinePlan(chip)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-slate-300 hover:text-emerald-300 text-xs font-semibold transition-all disabled:opacity-50"
            >
              ⚡ {chip}
            </button>
          ))}
        </div>

        {/* Custom Text Prompt */}
        <form onSubmit={handleRefineSubmit} className="flex gap-2">
          <input
            type="text"
            value={customRefineText}
            onChange={(e) => setCustomRefineText(e.target.value)}
            disabled={isRefining}
            placeholder={`Ask Gemini: "Swap dining table to 6-seater", "Make party menu vegan", "Swap gold to silver"...`}
            className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={isRefining || !customRefineText.trim()}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-md shadow-emerald-500/20"
          >
            {isRefining ? (
              <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
            ) : (
              <>
                <span>Refine Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, rooms, or categories..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filter Badges: Platform */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
            <Filter className="w-3 h-3" /> Platform:
          </span>
          {['All', 'IKEA', 'Amazon', 'Flipkart', 'Swiggy', 'Zomato', 'OYO', 'Myntra'].map((plat) => (
            <button
              key={plat}
              onClick={() => setSelectedPlatform(plat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedPlatform === plat
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {plat}
            </button>
          ))}
        </div>

        {/* Filter Badges: Tier */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-semibold">Tier:</span>
          {[
            { id: 'All', label: 'All' },
            { id: 'budget_saver', label: 'Saver' },
            { id: 'balanced_pick', label: 'Value' },
            { id: 'splurge_worthy', label: 'Hero' }
          ].map((tier) => (
            <button
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                selectedTier === tier.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendation Items Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            Curated Procurement Items ({filteredItems.length} of {recommendations.length})
          </h2>
          <span className="text-xs text-slate-400">
            Check off items as you buy or add to cart
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const badge = getPlatformBadgeStyle(item.platform);
            const tierBadge = getTradeoffBadge(item.tradeoffTier);
            const isChecked = checkedItemIds.has(item.id);
            const isAltExpanded = expandedAlternatives.has(item.id);

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-lg ${
                  isChecked
                    ? 'bg-slate-950/90 border-emerald-500/40 ring-1 ring-emerald-500/20'
                    : 'bg-slate-900/85 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="p-5 space-y-3.5">
                  {/* Top Bar: Platform & Tier Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide border flex items-center gap-1.5 ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {badge.label}
                      </span>
                      {item.room && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800 text-slate-300">
                          {item.room}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800 text-slate-400">
                        {item.category}
                      </span>
                    </div>

                    {/* Trade-off Tier Pill */}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${tierBadge.bg} ${tierBadge.text}`}
                    >
                      {tierBadge.label}
                    </span>
                  </div>

                  {/* Title & Checkbox */}
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggleItemCheck(item.id)}
                      className="mt-0.5 text-slate-500 hover:text-emerald-400 transition-colors flex-shrink-0"
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600" />
                      )}
                    </button>

                    <div className="flex-1">
                      <h3
                        className={`text-sm md:text-base font-bold leading-snug transition-colors ${
                          isChecked ? 'line-through text-slate-400' : 'text-white'
                        }`}
                      >
                        {item.title}
                      </h3>
                      {(item.specs || item.details || item.material) && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {item.specs || item.details || item.material}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <div>
                      <div className="text-[10px] text-slate-500">Unit Price</div>
                      <div className="text-xs font-semibold text-slate-300">
                        {formatCurrency(item.unitPrice, currency)}
                        {item.quantity > 1 && ` × ${item.quantity}`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500">Total Price</div>
                      <div className="text-base font-black text-emerald-400">
                        {formatCurrency(item.totalPrice, currency)}
                      </div>
                    </div>
                  </div>

                  {/* Why PocketSmart AI picked this */}
                  {(item.reasonForSelection || item.stylingReason) && (
                    <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60 text-xs text-slate-300 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">
                        {item.reasonForSelection || item.stylingReason}
                      </span>
                    </div>
                  )}

                  {/* Alternative Option Accordion ("Save vs Splurge") */}
                  {item.alternativeOption && (
                    <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                      <button
                        type="button"
                        onClick={() => toggleAlternative(item.id)}
                        className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center justify-between bg-slate-900/50"
                      >
                        <span className="flex items-center gap-1.5">
                          <ArrowDownUp className="w-3.5 h-3.5 text-teal-400" />
                          Compare Alternative ({item.alternativeOption.platform})
                        </span>
                        {isAltExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {isAltExpanded && (
                        <div className="p-3 text-xs space-y-1.5 border-t border-slate-800 bg-slate-950/90">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">
                              {item.alternativeOption.title}
                            </span>
                            <span className="font-bold text-teal-400">
                              {formatCurrency(item.alternativeOption.price, currency)}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {item.alternativeOption.note}
                          </p>
                          <div className="pt-1">
                            <a
                              href={item.shoppingSearchUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-teal-400 hover:underline flex items-center gap-1"
                            >
                              Search {item.alternativeOption.platform} Deals <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Direct Shopping Link */}
                <div className="p-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    Source: <span className="font-semibold text-slate-200">{item.platform}</span>
                  </div>
                  <a
                    href={item.shoppingSearchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all shadow-sm group"
                  >
                    <span>Check on {item.platform}</span>
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Party Timeline Schedule (if party mode) */}
      {partyPlan && partyPlan.timelineSchedule && partyPlan.timelineSchedule.length > 0 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Clock className="w-4 h-4 text-orange-400" />
            AI Recommended Event Timeline & Run of Show
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {partyPlan.timelineSchedule.map((slot, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col justify-between"
              >
                <div className="text-xs font-bold text-orange-400">{slot.time}</div>
                <div className="text-xs text-slate-300 mt-1">{slot.activity}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pro Tips & Budget Hacks Accordion */}
      {((homePlan && homePlan.proTips) ||
        (partyPlan && partyPlan.proTips) ||
        (jewelryPlan && jewelryPlan.stylingTips)) && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            Strategic Budget Saving Hacks & Designer Advice
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(homePlan?.proTips || partyPlan?.proTips || jewelryPlan?.stylingTips || []).map(
              (tip, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{tip}</span>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Bottom Sticky-like Action Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold text-slate-200">
            PocketSmart AI Plan Active: {recommendations.length} Items Selected
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSavePlan}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Save to My Plans</span>
          </button>
          <button
            onClick={onBackToEdit}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all"
          >
            Adjust Budget / Criteria
          </button>
        </div>
      </div>
    </div>
  );
};
