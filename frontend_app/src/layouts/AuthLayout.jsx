import React from 'react';
import Logo from '../components/ui/Logo';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Cột trái: Artwork / Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-slate-900">
        
        {/* Abstract Glowing Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-600/30 blur-[120px]"></div>
          <div className="absolute bottom-[10%] -right-[20%] w-[60%] h-[60%] rounded-full bg-cyan-500/20 blur-[100px]"></div>
        </div>
        
        {/* Glassmorphism Card */}
        <div className="relative z-10 p-12 max-w-lg flex flex-col items-center text-center">
          <div className="mb-5">
            <Logo className="w-32 h-32 drop-shadow-[0_0_30px_rgba(34,211,238,0.4)]" />
          </div>
          
          <h1 className="text-5xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Hệ Sinh Thái<br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">Y Tế AI Thông Minh</span>
          </h1>
          
          <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-md">
            Đột phá trong phân tích rủi ro lâm sàng và cá nhân hóa lộ trình điều trị bằng Trí tuệ nhân tạo.
          </p>
        </div>
      </div>

      {/* Cột phải: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 xl:p-24 bg-white relative">
        <div className="w-full max-w-md space-y-10 relative z-10">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
             <div className="flex items-center justify-center">
                 <Logo className="w-12 h-12" />
             </div>
             <span className="text-2xl font-black text-slate-900 tracking-tight">Hiệp Sĩ Tiểu Đường</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{subtitle}</p>
          </div>

          {children}

        </div>
      </div>
    </div>
  );
}