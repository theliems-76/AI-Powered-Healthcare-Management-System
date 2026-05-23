import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({ children, isLoading, className = '', ...props }) {
  return (
    <button
      disabled={isLoading}
      {...props}
      className={`w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
        isLoading 
          ? 'bg-slate-200 text-slate-500 cursor-not-allowed shadow-none' 
          : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/20 hover:shadow-slate-900/30'
      } ${className}`}
    >
      {isLoading && <Loader2 className="animate-spin" size={16} />}
      {children}
    </button>
  );
}