import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({ children, isLoading, className = '', ...props }) {
  return (
    <button
      disabled={isLoading}
      {...props}
      className={`w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] ${
        isLoading 
          ? 'bg-blue-400 cursor-not-allowed shadow-none' 
          : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 hover:shadow-blue-200'
      } ${className}`}
    >
      {isLoading && <Loader2 className="animate-spin" size={24} />}
      {children}
    </button>
  );
}