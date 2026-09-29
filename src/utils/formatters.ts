import { Currency } from '../types';

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£'
};

export function formatCurrency(amount: number | undefined | null, currency: Currency = 'INR'): string {
  if (amount === undefined || amount === null || isNaN(amount)) return `${CURRENCY_SYMBOLS[currency]} 0`;
  const symbol = CURRENCY_SYMBOLS[currency] || '₹';
  
  if (currency === 'INR') {
    return `${symbol} ${amount.toLocaleString('en-IN')}`;
  }
  return `${symbol} ${amount.toLocaleString('en-US')}`;
}

export function getPlatformBadgeStyle(platform: string): { bg: string; text: string; border: string; label: string } {
  const plat = (platform || '').toLowerCase();

  if (plat.includes('ikea')) {
    return {
      bg: 'bg-blue-950/80',
      text: 'text-amber-300',
      border: 'border-blue-600/40',
      label: 'IKEA'
    };
  }
  if (plat.includes('amazon')) {
    return {
      bg: 'bg-amber-950/70',
      text: 'text-amber-400',
      border: 'border-amber-600/40',
      label: 'Amazon'
    };
  }
  if (plat.includes('flipkart')) {
    return {
      bg: 'bg-sky-950/80',
      text: 'text-sky-300',
      border: 'border-sky-500/40',
      label: 'Flipkart'
    };
  }
  if (plat.includes('swiggy')) {
    return {
      bg: 'bg-orange-950/80',
      text: 'text-orange-400',
      border: 'border-orange-500/40',
      label: 'Swiggy'
    };
  }
  if (plat.includes('zomato')) {
    return {
      bg: 'bg-red-950/80',
      text: 'text-red-400',
      border: 'border-red-500/40',
      label: 'Zomato'
    };
  }
  if (plat.includes('oyo')) {
    return {
      bg: 'bg-rose-950/80',
      text: 'text-rose-400',
      border: 'border-rose-600/40',
      label: 'OYO Rooms'
    };
  }
  if (plat.includes('myntra')) {
    return {
      bg: 'bg-fuchsia-950/80',
      text: 'text-fuchsia-300',
      border: 'border-fuchsia-500/40',
      label: 'Myntra'
    };
  }
  if (plat.includes('pepperfry')) {
    return {
      bg: 'bg-emerald-950/80',
      text: 'text-emerald-300',
      border: 'border-emerald-600/40',
      label: 'Pepperfry'
    };
  }
  return {
    bg: 'bg-slate-800',
    text: 'text-slate-300',
    border: 'border-slate-700',
    label: platform || 'Online'
  };
}

export function getTradeoffBadge(tier?: string): { label: string; bg: string; text: string } {
  if (tier === 'splurge_worthy') {
    return { label: 'Splurge Hero', bg: 'bg-purple-900/60', text: 'text-purple-300' };
  }
  if (tier === 'budget_saver') {
    return { label: 'Budget Saver', bg: 'bg-emerald-900/60', text: 'text-emerald-300' };
  }
  return { label: 'Value Pick', bg: 'bg-blue-900/60', text: 'text-blue-300' };
}
