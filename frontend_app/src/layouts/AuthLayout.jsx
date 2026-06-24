import React from 'react';
import Logo from '../components/ui/Logo';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex bg-background font-sans selection:bg-primary-container selection:text-on-primary-container">
      
      {/* Cột trái: Artwork / Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-surface-container-low border-r border-outline-variant">
        
        {/* Soft Clinical Background */}
        <div className="absolute inset-0 overflow-hidden opacity-50">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary-fixed-dim/20 via-transparent to-transparent"></div>
        </div>
        
        {/* Branding Card */}
        <div className="relative z-10 p-12 max-w-lg flex flex-col items-center text-center">
          <div className="mb-8 flex justify-center w-full">
            <Logo className="w-32 h-32 text-primary" />
          </div>
          
          <h1 className="text-4xl font-bold text-on-surface mb-6 tracking-tight leading-tight">
            Hệ Sinh Thái<br/>
            <span className="text-primary">Hiệp Sĩ Tiểu Đường</span>
          </h1>
          
          <p className="text-base text-on-surface-variant font-normal leading-relaxed max-w-md">
            Tiên phong trong phân tích rủi ro lâm sàng và cá nhân hóa lộ trình điều trị bằng Trí tuệ nhân tạo. An toàn, bảo mật và chuẩn y khoa.
          </p>
        </div>
      </div>

      {/* Cột phải: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 xl:p-24 bg-surface-container-lowest relative">
        <div className="w-full max-w-md space-y-10 relative z-10">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
             <div className="flex items-center justify-center">
                 <Logo className="w-10 h-10 text-primary" />
             </div>
             <span className="text-xl font-bold text-on-surface tracking-tight">Hiệp Sĩ Tiểu Đường</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-semibold text-on-surface tracking-tight">{title}</h2>
            <p className="text-sm font-normal text-on-surface-variant">{subtitle}</p>
          </div>

          {children}

        </div>
      </div>
    </div>
  );
}