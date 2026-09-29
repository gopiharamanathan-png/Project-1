import { HomePlan, PartyPlan, JewelryPlan, AnyPlan, Currency } from '../types';
import { SAMPLE_HOME_PLAN, SAMPLE_PARTY_PLAN, SAMPLE_JEWELRY_PLAN } from '../data/mockPresets';

export async function generateHomeRecommendations(params: {
  totalBudget: number;
  currency: Currency;
  rooms: string[];
  items: { name: string; qty: number }[];
  style: string;
  priorities: string;
  targetPlatforms: string[];
}): Promise<HomePlan> {
  try {
    const res = await fetch('/api/recommendations/home', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP error ${res.status}`);
    }

    const json = await res.json();
    if (json.success && json.data) {
      return json.data as HomePlan;
    }
    throw new Error('Invalid response structure');
  } catch (error) {
    console.warn('API error, using optimized fallback preset:', error);
    // Scale preset to the user's budget proportionally
    const scale = params.totalBudget / SAMPLE_HOME_PLAN.totalBudget;
    return {
      ...SAMPLE_HOME_PLAN,
      totalBudget: params.totalBudget,
      currency: params.currency,
      style: params.style,
      totalEstimatedSpend: Math.round(SAMPLE_HOME_PLAN.totalEstimatedSpend * scale),
      savingsCushion: Math.round(params.totalBudget - (SAMPLE_HOME_PLAN.totalEstimatedSpend * scale)),
      categoryBreakdown: SAMPLE_HOME_PLAN.categoryBreakdown.map(c => ({
        ...c,
        allocatedAmount: Math.round(c.allocatedAmount * scale),
        estimatedSpend: Math.round(c.estimatedSpend * scale)
      })),
      recommendations: SAMPLE_HOME_PLAN.recommendations.map(r => ({
        ...r,
        unitPrice: Math.round(r.unitPrice * scale),
        totalPrice: Math.round(r.totalPrice * scale)
      }))
    };
  }
}

export async function generatePartyRecommendations(params: {
  totalBudget: number;
  currency: Currency;
  guestCount: number;
  eventType: string;
  venueType: string;
  theme: string;
  includeAccommodation: boolean;
  dietaryPreference: string;
}): Promise<PartyPlan> {
  try {
    const res = await fetch('/api/recommendations/party', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP error ${res.status}`);
    }

    const json = await res.json();
    if (json.success && json.data) {
      return json.data as PartyPlan;
    }
    throw new Error('Invalid response structure');
  } catch (error) {
    console.warn('API error, using optimized fallback preset:', error);
    const scale = params.totalBudget / SAMPLE_PARTY_PLAN.totalBudget;
    return {
      ...SAMPLE_PARTY_PLAN,
      totalBudget: params.totalBudget,
      currency: params.currency,
      guestCount: params.guestCount,
      costPerGuest: Math.round(params.totalBudget / Math.max(1, params.guestCount)),
      totalEstimatedSpend: Math.round(SAMPLE_PARTY_PLAN.totalEstimatedSpend * scale),
      savingsCushion: Math.round(params.totalBudget - (SAMPLE_PARTY_PLAN.totalEstimatedSpend * scale)),
      recommendations: SAMPLE_PARTY_PLAN.recommendations.map(r => ({
        ...r,
        unitPrice: Math.round(r.unitPrice * scale),
        totalPrice: Math.round(r.totalPrice * scale)
      }))
    };
  }
}

export async function generateJewelryRecommendations(params: {
  totalBudget: number;
  currency: Currency;
  occasion: string;
  style: string;
  metalPreference: string;
  outfitDescription: string;
  outfitImageBase64?: string | null;
  outfitImageMimeType?: string;
}): Promise<JewelryPlan> {
  try {
    const res = await fetch('/api/recommendations/jewelry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP error ${res.status}`);
    }

    const json = await res.json();
    if (json.success && json.data) {
      return json.data as JewelryPlan;
    }
    throw new Error('Invalid response structure');
  } catch (error) {
    console.warn('API error, using optimized fallback preset:', error);
    const scale = params.totalBudget / SAMPLE_JEWELRY_PLAN.totalBudget;
    return {
      ...SAMPLE_JEWELRY_PLAN,
      totalBudget: params.totalBudget,
      currency: params.currency,
      totalEstimatedSpend: Math.round(SAMPLE_JEWELRY_PLAN.totalEstimatedSpend * scale),
      savingsCushion: Math.round(params.totalBudget - (SAMPLE_JEWELRY_PLAN.totalEstimatedSpend * scale)),
      recommendations: SAMPLE_JEWELRY_PLAN.recommendations.map(r => ({
        ...r,
        unitPrice: Math.round(r.unitPrice * scale),
        totalPrice: Math.round(r.totalPrice * scale)
      }))
    };
  }
}

export async function refinePlan(params: {
  currentPlan: AnyPlan;
  userInstruction: string;
  plannerType: 'home' | 'party' | 'jewelry';
}): Promise<AnyPlan> {
  try {
    const res = await fetch('/api/recommendations/refine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP error ${res.status}`);
    }

    const json = await res.json();
    if (json.success && json.data) {
      return json.data as AnyPlan;
    }
    throw new Error('Invalid response structure');
  } catch (error) {
    console.warn('Refinement API error:', error);
    throw error;
  }
}
