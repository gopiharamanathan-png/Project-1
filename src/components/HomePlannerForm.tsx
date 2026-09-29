import React, { useState } from 'react';
import { Currency } from '../types';
import { formatCurrency } from '../utils/formatters';
import { Sparkles, Home, Sliders, CheckSquare, Plus, Minus, Layers, DollarSign, Store } from 'lucide-react';

interface HomePlannerFormProps {
  currency: Currency;
  onSubmit: (data: {
    totalBudget: number;
    currency: Currency;
    rooms: string[];
    items: { name: string; qty: number }[];
    style: string;
    priorities: string;
    targetPlatforms: string[];
  }) => void;
  isLoading: boolean;
}

const AVAILABLE_ROOMS = [
  'Living Room',
  'Master Bedroom',
  'Dining Area',
  'Kitchen',
  'Balcony / Garden',
  'Home Office'
];

const DEFAULT_ITEMS = [
  { name: 'Sofa / Seating', qty: 1, defaultRoom: 'Living Room' },
  { name: 'Coffee / Center Table', qty: 1, defaultRoom: 'Living Room' },
  { name: 'Ceiling Fan / Fixture', qty: 2, defaultRoom: 'Living Room' },
  { name: 'Pendant / Ambient Lights', qty: 2, defaultRoom: 'Dining Area' },
  { name: 'Dining Table & 4 Chairs', qty: 1, defaultRoom: 'Dining Area' },
  { name: 'Flatwoven Rug', qty: 1, defaultRoom: 'Living Room' },
  { name: 'Floating Wall Shelves', qty: 2, defaultRoom: 'Living Room' },
  { name: 'Indoor Plants & Planters', qty: 2, defaultRoom: 'Balcony / Garden' }
];

const STYLES = [
  { name: 'Modern Minimalist', desc: 'Clean lines, neutral tones, clutter-free' },
  { name: 'Scandinavian', desc: 'Warm wood, functional comfort, light palettes' },
  { name: 'Bohemian Warmth', desc: 'Jute, textured weaves, earthy botanicals' },
  { name: 'Luxury Contemporary', desc: 'Metallic brass accents, plush velvets' },
  { name: 'Industrial Chic', desc: 'Matte black metal, reclaimed timber, exposed warmth' },
  { name: 'Indian Modern Fusion', desc: 'Teak wood, brass curios, ethnic block accents' }
];

const PLATFORMS = ['IKEA', 'Amazon', 'Flipkart', 'Pepperfry', 'Urban Ladder'];

export const HomePlannerForm: React.FC<HomePlannerFormProps> = ({
  currency,
  onSubmit,
  isLoading
}) => {
  const defaultBudget = currency === 'USD' ? 700 : 50000;
  const [totalBudget, setTotalBudget] = useState<number>(defaultBudget);
  const [selectedRooms, setSelectedRooms] = useState<string[]>(['Living Room', 'Dining Area']);
  const [items, setItems] = useState<{ name: string; qty: number; defaultRoom?: string }[]>(DEFAULT_ITEMS);
  const [selectedStyle, setSelectedStyle] = useState<string>('Modern Minimalist');
  const [priorities, setPriorities] = useState<string>(
    'Splurge on sofa comfort & dining durability; economize on ambient accent lighting and wall shelves.'
  );
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    'IKEA',
    'Amazon',
    'Flipkart',
    'Pepperfry'
  ]);

  const quickBudgetPresets =
    currency === 'USD'
      ? [350, 600, 1000, 1800]
      : [25000, 50000, 80000, 150000];

  const toggleRoom = (room: string) => {
    setSelectedRooms((prev) =>
      prev.includes(room) ? prev.filter((r) => r !== room) : [...prev, room]
    );
  };

  const togglePlatform = (plat: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(plat)
        ? prev.length > 1
          ? prev.filter((p) => p !== plat)
          : prev
        : [...prev, plat]
    );
  };

  const updateItemQty = (index: number, delta: number) => {
    setItems((prev) => {
      const copy = [...prev];
      const newQty = Math.max(0, copy[index].qty + delta);
      copy[index] = { ...copy[index], qty: newQty };
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const activeItems = items.filter((i) => i.qty > 0);
    onSubmit({
      totalBudget: Number(totalBudget),
      currency,
      rooms: selectedRooms.length ? selectedRooms : ['Living Room'],
      items: activeItems.length ? activeItems : [{ name: 'Living Room Furniture', qty: 1 }],
      style: selectedStyle,
      priorities,
      targetPlatforms: selectedPlatforms
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Hero Card: Budget Configuration */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                Home Interior Budget
                <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Scenario 1
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                AI will split this budget proportionally across rooms & fixtures
              </p>
            </div>
          </div>

          {/* Big Amount Badge */}
          <div className="text-left md:text-right">
            <span className="text-2xl md:text-3xl font-black tracking-tight text-white">
              {formatCurrency(totalBudget, currency)}
            </span>
            <div className="text-[11px] text-slate-400">Total Planned Spend</div>
          </div>
        </div>

        {/* Budget Slider & Input */}
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={currency === 'USD' ? 200 : 15000}
              max={currency === 'USD' ? 4000 : 300000}
              step={currency === 'USD' ? 50 : 2500}
              value={totalBudget}
              onChange={(e) => setTotalBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="relative min-w-[120px]">
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Math.max(1000, Number(e.target.value)))}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-500 font-medium">Quick Presets:</span>
            {quickBudgetPresets.map((amt) => (
              <button
                type="button"
                key={amt}
                onClick={() => setTotalBudget(amt)}
                className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                  totalBudget === amt
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {formatCurrency(amt, currency)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Rooms & Interior Style */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rooms Selection */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Home className="w-4 h-4 text-emerald-400" />
              Target Rooms
            </div>
            <span className="text-xs text-slate-400">
              {selectedRooms.length} selected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {AVAILABLE_ROOMS.map((room) => {
              const isSelected = selectedRooms.includes(room);
              return (
                <button
                  type="button"
                  key={room}
                  onClick={() => toggleRoom(room)}
                  className={`p-3 rounded-xl text-left border transition-all text-xs font-medium flex flex-col justify-between h-20 ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <span className="font-semibold">{room}</span>
                  <span className="text-[10px] text-slate-500">
                    {isSelected ? '✓ Included' : '+ Tap to add'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Style Selection */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Layers className="w-4 h-4 text-teal-400" />
              Interior Aesthetic & Theme
            </div>
            <span className="text-xs text-emerald-400 font-semibold">{selectedStyle}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {STYLES.map((style) => {
              const isSelected = selectedStyle === style.name;
              return (
                <button
                  type="button"
                  key={style.name}
                  onClick={() => setSelectedStyle(style.name)}
                  className={`p-3 rounded-xl text-left border transition-all text-xs flex flex-col justify-between h-20 ${
                    isSelected
                      ? 'bg-teal-500/10 border-teal-500/60 text-teal-300 shadow-sm ring-1 ring-teal-500/30'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <span className="font-bold text-slate-200">{style.name}</span>
                  <span className="text-[10px] text-slate-400 line-clamp-1">
                    {style.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Items & Quantities Checklist */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            Key Interior Items & Quantities
          </div>
          <span className="text-xs text-slate-400">
            {items.filter((i) => i.qty > 0).length} items configured
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {items.map((item, idx) => (
            <div
              key={item.name}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                item.qty > 0
                  ? 'bg-slate-950/90 border-slate-700/80 text-white'
                  : 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60'
              }`}
            >
              <div className="pr-2 truncate">
                <div className="text-xs font-semibold truncate">{item.name}</div>
                <div className="text-[10px] text-slate-400">{item.defaultRoom}</div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => updateItemQty(idx, -1)}
                  className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-bold text-emerald-400 w-4 text-center">
                  {item.qty}
                </span>
                <button
                  type="button"
                  onClick={() => updateItemQty(idx, 1)}
                  className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trade-offs & Preferred Platforms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priorities / Trade-offs */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Sliders className="w-4 h-4 text-emerald-400" />
            Budget Trade-offs & Priorities (Prompt Guidance)
          </div>
          <p className="text-xs text-slate-400">
            Tell the AI where to splurge (high-touch comfort items) and where to save (accent lighting, minor decor).
          </p>
          <textarea
            rows={2}
            value={priorities}
            onChange={(e) => setPriorities(e.target.value)}
            placeholder="e.g. Spend maximum on high-density sofa comfort, economize on lighting and side tables..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 placeholder-slate-600"
          />
        </div>

        {/* Platforms Selection */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Store className="w-4 h-4 text-amber-400" />
            Cross-Platform Sources
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {PLATFORMS.map((plat) => {
              const active = selectedPlatforms.includes(plat);
              return (
                <button
                  type="button"
                  key={plat}
                  onClick={() => togglePlatform(plat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    active
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-400'
                  }`}
                >
                  {plat} {active && '✓'}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-extrabold text-sm md:text-base shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Gemini is Allocating Budget & Curating Items...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-emerald-200" />
              <span>Generate AI Home Interior Budget Plan</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
