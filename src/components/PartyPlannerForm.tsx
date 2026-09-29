import React, { useState } from 'react';
import { Currency } from '../types';
import { formatCurrency } from '../utils/formatters';
import { Sparkles, PartyPopper, Users, MapPin, Utensils, Music, Bed, DollarSign, Store } from 'lucide-react';

interface PartyPlannerFormProps {
  currency: Currency;
  onSubmit: (data: {
    totalBudget: number;
    currency: Currency;
    guestCount: number;
    eventType: string;
    venueType: string;
    theme: string;
    includeAccommodation: boolean;
    dietaryPreference: string;
  }) => void;
  isLoading: boolean;
}

const EVENT_TYPES = [
  'Birthday Celebration',
  'Housewarming Party',
  'Anniversary Bash',
  'Bachelor / Bachelorette',
  'Corporate Mixer / Team Night',
  'Festive Gathering (Diwali/Eid/NYE)',
  'Intimate Engagement Party'
];

const VENUE_TYPES = [
  'Home / Living Room',
  'Rented Terrace / Rooftop',
  'Backyard Lawn / Garden',
  'OYO Townhouse / Banquet Suite',
  'Clubhouse / Community Hall'
];

const THEMES = [
  { name: 'Neon & Ambient Glow', desc: 'LED neon signs, dark mood lighting, glow accessories' },
  { name: 'Retro Bollywood', desc: 'Vintage film posters, vibrant marigold & fairy lights' },
  { name: 'Elegant Minimalist', desc: 'Monochrome, delicate fairy lights, champagne flutes' },
  { name: 'Tropical Fiesta', desc: 'Palm fronds, vibrant floral arches, fruity mocktails' },
  { name: 'Game & Karaoke Night', desc: 'Board games, karaoke mic, beer pong & finger bites' }
];

const DIETARY_OPTIONS = [
  'All-Inclusive (Veg & Non-Veg appetizers + dinner)',
  'Pure Vegetarian Feast',
  'Finger Foods, Sliders & Mocktail Platters',
  'Biryani Handi & Royal Dessert Combo',
  'Artisan Pizza & Pasta Party Pack'
];

export const PartyPlannerForm: React.FC<PartyPlannerFormProps> = ({
  currency,
  onSubmit,
  isLoading
}) => {
  const defaultBudget = currency === 'USD' ? 400 : 30000;
  const [totalBudget, setTotalBudget] = useState<number>(defaultBudget);
  const [guestCount, setGuestCount] = useState<number>(20);
  const [selectedEvent, setSelectedEvent] = useState<string>('Birthday Celebration');
  const [selectedVenue, setSelectedVenue] = useState<string>('Rented Terrace / Rooftop');
  const [selectedTheme, setSelectedTheme] = useState<string>('Neon & Ambient Glow');
  const [includeAccommodation, setIncludeAccommodation] = useState<boolean>(false);
  const [dietaryPreference, setDietaryPreference] = useState<string>(
    'All-Inclusive (Veg & Non-Veg appetizers + dinner)'
  );

  const quickBudgetPresets =
    currency === 'USD'
      ? [200, 400, 750, 1200]
      : [15000, 30000, 50000, 80000];

  const estimatedCostPerGuest = Math.round(totalBudget / Math.max(1, guestCount));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      totalBudget: Number(totalBudget),
      currency,
      guestCount: Number(guestCount),
      eventType: selectedEvent,
      venueType: selectedVenue,
      theme: selectedTheme,
      includeAccommodation,
      dietaryPreference
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Hero Card: Party Budget & Cost Per Guest */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <PartyPopper className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                Party & Event Budget Planner
                <span className="text-xs font-normal text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                  Scenario 2
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                AI optimizes catering (Swiggy/Zomato), decor (Amazon), entertainment & OYO stay
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4">
            <div className="text-left md:text-right">
              <span className="text-2xl md:text-3xl font-black tracking-tight text-white">
                {formatCurrency(totalBudget, currency)}
              </span>
              <div className="text-[11px] text-slate-400">Total Party Budget</div>
            </div>
            <div className="hidden sm:block border-l border-slate-800 pl-4 text-left md:text-right">
              <span className="text-lg md:text-xl font-bold text-orange-400">
                {formatCurrency(estimatedCostPerGuest, currency)}
              </span>
              <div className="text-[11px] text-slate-400">Per Guest Target</div>
            </div>
          </div>
        </div>

        {/* Budget Slider */}
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={currency === 'USD' ? 100 : 8000}
              max={currency === 'USD' ? 2500 : 150000}
              step={currency === 'USD' ? 25 : 1000}
              value={totalBudget}
              onChange={(e) => setTotalBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="relative min-w-[120px]">
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Math.max(1000, Number(e.target.value)))}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-500 font-medium">Quick Presets:</span>
            {quickBudgetPresets.map((amt) => (
              <button
                type="button"
                key={amt}
                onClick={() => setTotalBudget(amt)}
                className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                  totalBudget === amt
                    ? 'bg-orange-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {formatCurrency(amt, currency)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Guest Count & Event Type */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Guest Count Counter */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Users className="w-4 h-4 text-orange-400" />
              Guest Count
            </div>
            <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
              {guestCount} Guests
            </span>
          </div>

          <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl p-3">
            <button
              type="button"
              onClick={() => setGuestCount((g) => Math.max(4, g - 5))}
              className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold flex items-center justify-center hover:bg-slate-800"
            >
              -5
            </button>
            <div className="text-center">
              <span className="text-2xl font-black text-white">{guestCount}</span>
              <p className="text-[10px] text-slate-400">Attendees</p>
            </div>
            <button
              type="button"
              onClick={() => setGuestCount((g) => Math.min(200, g + 5))}
              className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold flex items-center justify-center hover:bg-slate-800"
            >
              +5
            </button>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            💡 Estimated catering & drinks allocation: ~{formatCurrency(Math.round(totalBudget * 0.5), currency)} (50% of budget)
          </div>
        </div>

        {/* Event Type */}
        <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <PartyPopper className="w-4 h-4 text-amber-400" />
              Event Type & Occasion
            </div>
            <span className="text-xs text-slate-400">{selectedEvent}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {EVENT_TYPES.map((ev) => {
              const active = selectedEvent === ev;
              return (
                <button
                  type="button"
                  key={ev}
                  onClick={() => setSelectedEvent(ev)}
                  className={`p-2.5 rounded-xl text-left border transition-all text-xs font-medium ${
                    active
                      ? 'bg-orange-500/10 border-orange-500/60 text-orange-300 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  {ev}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Theme & Venue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Venue Selection */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <MapPin className="w-4 h-4 text-rose-400" />
              Venue Setting
            </div>
            <span className="text-xs text-rose-400 font-medium">{selectedVenue}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {VENUE_TYPES.map((venue) => {
              const active = selectedVenue === venue;
              return (
                <button
                  type="button"
                  key={venue}
                  onClick={() => setSelectedVenue(venue)}
                  className={`p-3 rounded-xl text-left border transition-all text-xs font-semibold ${
                    active
                      ? 'bg-rose-500/10 border-rose-500/60 text-rose-300 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  {venue}
                </button>
              );
            })}
          </div>

          {/* OYO Stay Toggle */}
          <div className="pt-2 border-t border-slate-800/80">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer hover:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <Bed className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    Include Accommodation (OYO Townhouse)
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Allocate 8-15% of budget for out-of-town guest stay or prep suite
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={includeAccommodation}
                onChange={(e) => setIncludeAccommodation(e.target.checked)}
                className="w-4 h-4 rounded text-orange-500 accent-orange-500 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Theme & Vibe */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Music className="w-4 h-4 text-purple-400" />
              Party Theme & Aesthetic
            </div>
            <span className="text-xs text-purple-400 font-semibold">{selectedTheme}</span>
          </div>

          <div className="space-y-2">
            {THEMES.map((th) => {
              const active = selectedTheme === th.name;
              return (
                <button
                  type="button"
                  key={th.name}
                  onClick={() => setSelectedTheme(th.name)}
                  className={`w-full p-2.5 rounded-xl text-left border transition-all text-xs flex items-center justify-between ${
                    active
                      ? 'bg-purple-500/10 border-purple-500/60 text-purple-300 shadow-sm ring-1 ring-purple-500/30'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <span className="font-bold text-slate-200">{th.name}</span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">{th.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Food & Dietary Menu Preference */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Utensils className="w-4 h-4 text-orange-400" />
          Catering & Food Style (Swiggy / Zomato Procurement)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {DIETARY_OPTIONS.map((opt) => {
            const active = dietaryPreference === opt;
            return (
              <button
                type="button"
                key={opt}
                onClick={() => setDietaryPreference(opt)}
                className={`p-3 rounded-xl text-left border transition-all text-xs font-medium ${
                  active
                    ? 'bg-orange-500/10 border-orange-500/60 text-orange-300 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white font-extrabold text-sm md:text-base shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Gemini is Allocating Catering, Decor & Music...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span>Generate AI Party Budget Plan ({guestCount} Guests)</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
