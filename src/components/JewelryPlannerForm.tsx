import React, { useState, useRef } from 'react';
import { Currency } from '../types';
import { formatCurrency } from '../utils/formatters';
import { SAMPLE_OUTFIT_IMAGE } from '../data/mockPresets';
import { Sparkles, Gem, Upload, Camera, Image as ImageIcon, Trash2, CheckCircle, Palette, DollarSign, Store } from 'lucide-react';

interface JewelryPlannerFormProps {
  currency: Currency;
  onSubmit: (data: {
    totalBudget: number;
    currency: Currency;
    occasion: string;
    style: string;
    metalPreference: string;
    outfitDescription: string;
    outfitImageBase64?: string | null;
    outfitImageMimeType?: string;
  }) => void;
  isLoading: boolean;
}

const OCCASIONS = [
  'Wedding Ceremony / Reception',
  'Sangeet / Mehendi Night',
  'Festive Gathering (Diwali/Eid/Navratri)',
  'Cocktail & Evening Gala',
  'Romantic Date Night',
  'Traditional Family Puja',
  'Formal Work Gala / Award Night'
];

const JEWELRY_STYLES = [
  { name: 'Kundan & Polki Fusion', desc: 'Glass-cut gemstones, uncut diamonds, regal meenakari' },
  { name: 'Minimalist Fine Gold', desc: 'Delicate geometric lines, sleek chains, subtle solitaires' },
  { name: 'Temple Jewelry', desc: 'Antique dull gold, coin motifs, Lakshmi & divine carvings' },
  { name: 'Diamond Simulants / CZ', desc: 'High-fire zirconias, moissanite sparkle, rhodium shine' },
  { name: 'Oxidized Silver & Boho', desc: 'Rustic charcoal finish, ghungroo drops, tribal charms' },
  { name: 'Contemporary Fusion', desc: 'Pearl clusters, asymmetrical chokers, rose gold sheen' }
];

const METALS = [
  '18K/22K Gold Plated Brass',
  '925 Sterling Silver',
  'Rose Gold Tone',
  'Antique Gold / Matte Finish',
  'Rhodium / Silver Finish',
  'Freshwater Pearl & Alloy'
];

export const JewelryPlannerForm: React.FC<JewelryPlannerFormProps> = ({
  currency,
  onSubmit,
  isLoading
}) => {
  const defaultBudget = currency === 'USD' ? 120 : 10000;
  const [totalBudget, setTotalBudget] = useState<number>(defaultBudget);
  const [selectedOccasion, setSelectedOccasion] = useState<string>('Sangeet / Mehendi Night');
  const [selectedStyle, setSelectedStyle] = useState<string>('Kundan & Polki Fusion');
  const [metalPreference, setMetalPreference] = useState<string>('18K/22K Gold Plated Brass');
  const [outfitDescription, setOutfitDescription] = useState<string>(
    'Emerald green embroidered lehenga with heavy gold zari border and sweetheart neckline'
  );
  const [outfitImage, setOutfitImage] = useState<string | null>(SAMPLE_OUTFIT_IMAGE);
  const [imageMimeType, setImageMimeType] = useState<string>('image/svg+xml');
  const [isSampleActive, setIsSampleActive] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const quickBudgetPresets =
    currency === 'USD'
      ? [60, 120, 250, 500]
      : [5000, 10000, 20000, 40000];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be under 5MB');
        return;
      }
      setImageMimeType(file.type || 'image/jpeg');
      const reader = new FileReader();
      reader.onload = (event) => {
        setOutfitImage(event.target?.result as string);
        setIsSampleActive(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSample = () => {
    setOutfitImage(SAMPLE_OUTFIT_IMAGE);
    setImageMimeType('image/svg+xml');
    setIsSampleActive(true);
    setOutfitDescription('Emerald green embroidered lehenga with heavy gold zari border and sweetheart neckline');
  };

  const handleRemoveImage = () => {
    setOutfitImage(null);
    setIsSampleActive(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      totalBudget: Number(totalBudget),
      currency,
      occasion: selectedOccasion,
      style: selectedStyle,
      metalPreference,
      outfitDescription,
      outfitImageBase64: outfitImage,
      outfitImageMimeType: imageMimeType
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Hero Card: Budget Configuration */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-fuchsia-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400">
              <Gem className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                Jewelry & Outfit Matching Planner
                <span className="text-xs font-normal text-fuchsia-400 bg-fuchsia-500/10 px-2 py-0.5 rounded-full border border-fuchsia-500/20">
                  Scenario 3 (Multimodal)
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Gemini analyzes outfit colors & neckline cut to curate a harmonious jewelry suite
              </p>
            </div>
          </div>

          {/* Budget Display */}
          <div className="text-left md:text-right">
            <span className="text-2xl md:text-3xl font-black tracking-tight text-white">
              {formatCurrency(totalBudget, currency)}
            </span>
            <div className="text-[11px] text-slate-400">Max Jewelry Suite Budget</div>
          </div>
        </div>

        {/* Budget Slider */}
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={currency === 'USD' ? 30 : 2500}
              max={currency === 'USD' ? 800 : 60000}
              step={currency === 'USD' ? 10 : 500}
              value={totalBudget}
              onChange={(e) => setTotalBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
            />
            <div className="relative min-w-[120px]">
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Math.max(500, Number(e.target.value)))}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-fuchsia-500"
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
                    ? 'bg-fuchsia-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {formatCurrency(amt, currency)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Multimodal Outfit Upload & Description */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Outfit Photo & Multimodal Visual Analyzer */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Camera className="w-4 h-4 text-fuchsia-400" />
              Outfit Photo (AI Color & Neckline)
            </div>
            {outfitImage && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            )}
          </div>

          {outfitImage ? (
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden border border-fuchsia-500/30 bg-slate-950 group">
                <img
                  src={outfitImage}
                  alt="Outfit Preview"
                  className="w-full h-52 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-fuchsia-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    {isSampleActive ? 'Sample Emerald Lehenga' : 'Custom Upload Loaded'}
                  </span>
                  <span className="text-[10px] text-slate-400">Ready for Multimodal AI</span>
                </div>
              </div>

              {/* Sample Photo Toggle */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Want to test with a demo dress?</span>
                <button
                  type="button"
                  onClick={handleUseSample}
                  className="text-xs text-fuchsia-400 hover:text-fuchsia-300 font-semibold underline"
                >
                  Use Emerald Lehenga
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-fuchsia-500/60 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-950/50 hover:bg-fuchsia-500/5 flex flex-col items-center justify-center space-y-2.5 h-52"
            >
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-fuchsia-400">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold text-slate-300">
                Click or drag & drop outfit photo
              </div>
              <div className="text-[10px] text-slate-500 max-w-[200px]">
                Supports JPG, PNG up to 5MB. AI scans fabric tone & collar.
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUseSample();
                }}
                className="mt-1 px-3 py-1 rounded-lg bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-300 text-xs font-semibold border border-fuchsia-500/25"
              >
                Or Load Demo Outfit
              </button>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Right: Outfit Description & Occasion */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Palette className="w-4 h-4 text-fuchsia-400" />
              Occasion & Outfit Specifications
            </div>
          </div>

          {/* Occasions */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Event / Occasion</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {OCCASIONS.map((occ) => {
                const active = selectedOccasion === occ;
                return (
                  <button
                    type="button"
                    key={occ}
                    onClick={() => setSelectedOccasion(occ)}
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs font-medium truncate ${
                      active
                        ? 'bg-fuchsia-500/10 border-fuchsia-500/60 text-fuchsia-300 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                    }`}
                  >
                    {occ}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Outfit Description */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-semibold text-slate-300">
              Outfit Details (Colors, Fabric & Neckline cut)
            </label>
            <textarea
              rows={3}
              value={outfitDescription}
              onChange={(e) => setOutfitDescription(e.target.value)}
              placeholder="e.g., Emerald green silk saree with gold border, deep sweetheart neckline..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-fuchsia-500 placeholder-slate-600"
            />
            <p className="text-[10px] text-slate-500">
              Mention neckline (Sweetheart, V-neck, Boatneck, High-neck) for collar vs choker precision.
            </p>
          </div>
        </div>
      </div>

      {/* Jewelry Style & Metal Preference */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Style Selection */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Gem className="w-4 h-4 text-purple-400" />
              Jewelry Style Aesthetic
            </div>
            <span className="text-xs text-purple-400 font-semibold">{selectedStyle}</span>
          </div>

          <div className="space-y-2">
            {JEWELRY_STYLES.map((st) => {
              const active = selectedStyle === st.name;
              return (
                <button
                  type="button"
                  key={st.name}
                  onClick={() => setSelectedStyle(st.name)}
                  className={`w-full p-2.5 rounded-xl text-left border transition-all text-xs flex items-center justify-between ${
                    active
                      ? 'bg-purple-500/10 border-purple-500/60 text-purple-300 shadow-sm ring-1 ring-purple-500/30'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <span className="font-bold text-slate-200">{st.name}</span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">{st.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Metal & Finish */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Metal & Finish Preference
            </div>
            <span className="text-xs text-amber-400 font-semibold">{metalPreference}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {METALS.map((metal) => {
              const active = metalPreference === metal;
              return (
                <button
                  type="button"
                  key={metal}
                  onClick={() => setMetalPreference(metal)}
                  className={`p-3 rounded-xl text-left border transition-all text-xs font-semibold ${
                    active
                      ? 'bg-amber-500/10 border-amber-500/60 text-amber-300 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  {metal}
                </button>
              );
            })}
          </div>

          <div className="pt-2 text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            ✨ Curates matching Choker/Necklace, Chandbalis/Earrings, Bangles/Kada, Cocktail Ring & Maang Tikka across Amazon, Flipkart, Myntra.
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-extrabold text-sm md:text-base shadow-xl shadow-fuchsia-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Gemini is Scanning Neckline & Curating Jewelry Suite...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-fuchsia-200" />
              <span>Generate AI Jewelry Recommendations</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
