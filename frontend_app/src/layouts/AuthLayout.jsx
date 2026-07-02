import React from 'react';
import Logo from '../components/ui/Logo';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex bg-surface font-sans selection:bg-primary-container selection:text-on-primary-container">
      
      {/* Left Column: Medical Artwork / Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface-container-low border-r border-outline-variant">
        
        {/* Placeholder for Medical Image (Can be replaced with an actual img tag later) */}
        <div className="absolute inset-0 w-full h-full bg-[#f3f4f6]">
            {/* If we have a medical image, we would put: <img src="/medical-bg.jpg" className="w-full h-full object-cover opacity-80 mix-blend-multiply" /> */}
            <div className="absolute inset-0 bg-primary/5 mix-blend-multiply"></div>
        </div>
        
        {/* Branding Overlay */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-12 lg:p-24">
          <div>
              <div className="flex items-center gap-3 mb-12">
                  <Logo className="w-10 h-10 text-primary" />
                  <span className="text-xl font-bold text-on-surface tracking-tight">Hiệp Sĩ Tiểu Đường</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-on-surface mb-6 tracking-tight leading-tight max-w-lg">
                Hệ Sinh Thái Y Tế<br/>
                <span className="text-primary">Chuyên Sâu</span>
              </h1>
              
              <p className="text-lg text-on-surface-variant font-normal leading-relaxed max-w-md">
                Tiên phong trong phân tích rủi ro lâm sàng và cá nhân hóa lộ trình điều trị bằng Trí tuệ nhân tạo. An toàn, bảo mật và chuẩn y khoa.
              </p>
          </div>

          <div className="flex gap-4 items-center">
              <div className="px-3 py-1 bg-surface border border-outline-variant rounded-md text-xs font-bold text-secondary uppercase tracking-wider">Chuẩn Y Tế</div>
              <div className="px-3 py-1 bg-surface border border-outline-variant rounded-md text-xs font-bold text-secondary uppercase tracking-wider">Tích hợp AI</div>
          </div>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 xl:p-24 bg-surface">
        <div className="w-full max-w-md space-y-10">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-start gap-4 mb-8">
             <Logo className="w-12 h-12 text-primary" />
             <span className="text-2xl font-bold text-on-surface tracking-tight">Hiệp Sĩ Tiểu Đường</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-on-surface tracking-tight">{title}</h2>
            <p className="text-sm font-normal text-on-surface-variant">{subtitle}</p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant p-6 md:p-8 rounded-xl shadow-sm">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
}