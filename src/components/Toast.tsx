import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl text-xs font-semibold text-white animate-in slide-in-from-bottom-5 duration-300">
      {type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
      {type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
      {type === 'info' && <Info className="w-4 h-4 text-sky-400" />}
      <span>{message}</span>
      <button onClick={onClose} className="text-slate-500 hover:text-white ml-2">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
