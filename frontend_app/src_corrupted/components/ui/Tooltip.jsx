import React from 'react';
import { Info } from 'lucide-react';

export default function Tooltip({ text, children }) {
    return (
        <div className="group relative inline-flex items-center gap-1 cursor-help">
            {}
            {children}
            
            {}
            <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
            
            {}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-slate-800 text-white text-[11px] font-medium leading-relaxed rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] shadow-xl text-center pointer-events-none">
                {text}
                {}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
            </div>
        </div>
    );
}
