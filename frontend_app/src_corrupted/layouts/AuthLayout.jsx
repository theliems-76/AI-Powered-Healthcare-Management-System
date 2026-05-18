import React from 'react';
import { Activity } from 'lucide-react';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex bg-white font-sans"> {}
      
      {}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 relative overflow-hidden items-center justify-center">
        
        {}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-1/4 -right-24 w-96 h-96 bg-blue-400 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        </div>
        
        {}
        <div className="relative z-10 p-12 max-w-lg text-center">
          <div className="bg-white p-4 rounded-3xl inline-block shadow-xl mb-8">
            <Activity size={48} className="text-blue-600" />
          </div>
          
          {}
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            H? Sinh Thái<br/>
            <span className="text-blue-200">Y T? AI Thông Minh</span>
          </h1>
          
          {}
          <p className="text-lg text-blue-100 font-medium leading-relaxed">
            ?ng d?ng trí tu? nhân t?o trong ch?n doán r?i ro ti?u du?ng và thi?t k? l? trình dinh du?ng cá nhân hóa.
          </p>
        </div>
      </div>

      {}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          
          {}
          <div className="lg:hidden flex items-center gap-2 mb-8">
             <Activity size={32} className="text-blue-600" />
             <span className="text-2xl font-extrabold text-blue-900">Clinical AI</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{title}</h2>
            <p className="text-slate-500 font-medium">{subtitle}</p>
          </div>

          {}
          {children}

        </div>
      </div>
    </div>
  );
}
