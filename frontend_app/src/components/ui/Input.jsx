import React from 'react';

export default function Input({ label, icon: Icon, ...props }) {
  return (
    <div className="space-y-2">
      {label && <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            <Icon size={18} strokeWidth={2.5} />
          </div>
        )}
        <input
          {...props}
          className={`w-full py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder:font-medium placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all ${
            Icon ? 'pl-11 pr-4' : 'px-4'
          }`}
        />
      </div>
    </div>
  );
}