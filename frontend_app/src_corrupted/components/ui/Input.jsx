import React from 'react';

export default function Input({ label, icon: Icon, ...props }) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-bold text-slate-700">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon size={20} />
          </div>
        )}
        <input
          {...props}
          className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all ${
            Icon ? 'pl-10' : 'pl-4'
          }`}
        />
      </div>
    </div>
  );
}
