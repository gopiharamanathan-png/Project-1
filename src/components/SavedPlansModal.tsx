import React from 'react';
import { SavedPlan, Currency } from '../types';
import { formatCurrency } from '../utils/formatters';
import { X, Bookmark, Trash2, ArrowRight, Home, PartyPopper, Gem, Calendar } from 'lucide-react';

interface SavedPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlans: SavedPlan[];
  onSelectPlan: (plan: SavedPlan) => void;
  onDeletePlan: (id: string) => void;
  currency: Currency;
}

export const SavedPlansModal: React.FC<SavedPlansModalProps> = ({
  isOpen,
  onClose,
  savedPlans,
  onSelectPlan,
  onDeletePlan,
  currency
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Saved Budget Plans</h2>
              <p className="text-xs text-slate-400">
                {savedPlans.length} stored {savedPlans.length === 1 ? 'plan' : 'plans'} in browser storage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {savedPlans.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <Bookmark className="w-6 h-6" />
              </div>
              <div className="text-sm font-semibold text-slate-300">No saved plans yet</div>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Generate a home interior, party, or jewelry plan and click "Save Plan" to view it here anytime.
              </p>
            </div>
          ) : (
            savedPlans.map((item) => {
              const formattedDate = new Date(item.timestamp).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-md bg-slate-800 text-slate-300">
                        {item.type === 'home' ? (
                          <Home className="w-3.5 h-3.5 text-emerald-400" />
                        ) : item.type === 'party' ? (
                          <PartyPopper className="w-3.5 h-3.5 text-orange-400" />
                        ) : (
                          <Gem className="w-3.5 h-3.5 text-fuchsia-400" />
                        )}
                      </span>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        {item.type} Plan
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {formattedDate}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-slate-200">{item.title}</div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-400">
                        Budget: <strong className="text-white">{formatCurrency(item.totalBudget, item.currency)}</strong>
                      </span>
                      <span className="text-emerald-400">
                        Spend: <strong>{formatCurrency(item.estimatedSpend, item.currency)}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => onDeletePlan(item.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onSelectPlan(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20"
                    >
                      <span>Open Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
