export type PlannerMode = 'home' | 'party' | 'jewelry';

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface CategoryBreakdown {
  category: string;
  allocatedAmount: number;
  estimatedSpend: number;
  percentage: number;
}

export interface AlternativeOption {
  title: string;
  platform: string;
  price: number;
  note: string;
}

export interface RecommendationItem {
  id: string;
  title: string;
  room?: string;
  category: string;
  platform: 'IKEA' | 'Amazon' | 'Flipkart' | 'Swiggy' | 'Zomato' | 'OYO' | 'Myntra' | 'Pepperfry' | 'Urban Ladder' | string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specs?: string;
  details?: string;
  material?: string;
  reasonForSelection?: string;
  stylingReason?: string;
  tradeoffTier?: 'budget_saver' | 'balanced_pick' | 'splurge_worthy';
  alternativeOption?: AlternativeOption;
  shoppingSearchUrl: string;
  isPurchased?: boolean;
}

export interface HomePlan {
  summary: string;
  totalBudget: number;
  totalEstimatedSpend: number;
  savingsCushion: number;
  currency: Currency;
  style: string;
  categoryBreakdown: CategoryBreakdown[];
  recommendations: RecommendationItem[];
  proTips: string[];
}

export interface PartyAllocation {
  allocatedAmount: number;
  percentage: number;
  platform?: string;
}

export interface PartyPlan {
  summary: string;
  totalBudget: number;
  totalEstimatedSpend: number;
  savingsCushion: number;
  currency: Currency;
  guestCount: number;
  costPerGuest: number;
  allocationBreakdown: {
    catering: PartyAllocation;
    decoration: PartyAllocation;
    entertainment: PartyAllocation;
    venueOrStay?: PartyAllocation;
  };
  recommendations: RecommendationItem[];
  timelineSchedule?: { time: string; activity: string }[];
  proTips: string[];
}

export interface OutfitAnalysis {
  dominantColors: string;
  necklineHarmony: string;
  stylingVibe: string;
}

export interface JewelryPlan {
  summary: string;
  outfitAnalysis?: OutfitAnalysis;
  totalBudget: number;
  totalEstimatedSpend: number;
  savingsCushion: number;
  currency: Currency;
  recommendations: RecommendationItem[];
  stylingTips: string[];
}

export type AnyPlan = HomePlan | PartyPlan | JewelryPlan;

export interface SavedPlan {
  id: string;
  timestamp: number;
  type: PlannerMode;
  title: string;
  totalBudget: number;
  estimatedSpend: number;
  currency: Currency;
  plan: AnyPlan;
}
