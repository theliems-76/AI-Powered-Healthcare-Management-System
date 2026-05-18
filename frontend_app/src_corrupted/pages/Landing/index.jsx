import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, Brain, Heart, ChevronRight } from 'lucide-react';

export default function Landing() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                            <Activity className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold text-slate-800 tracking-tight">AI Healthcare</span>
                    </div>
                    <div>
                        <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-blue-600 px-4 py-2 transition-colors">Đăng nhập</Link>
                        <Link to="/login" className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-full shadow-sm transition-all">Bắt đầu ngay</Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
                    Sức Khỏe Của Bạn, <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Được Quản Lý Bởi AI</span>
                </h1>
                <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-10 leading-relaxed">
                    Nền tảng quản lý sức khỏe toàn diện. Tự động đánh giá rủi ro, đề xuất thực đơn dinh dưỡng và bài tập cá nhân hóa dựa trên dữ liệu y khoa của chính bạn.
                </p>
                <div className="flex items-center justify-center gap-4">
                    <Link to="/login" className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5">
                        Trải nghiệm miễn phí
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>

            {/* Features Section */}
            <section className="bg-white py-20 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow group">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Brain className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">AI Phân Tích Thông Minh</h3>
                            <p className="text-slate-600 leading-relaxed">Hệ thống AI phân tích 21 chỉ số sinh hóa để đưa ra dự báo nguy cơ sức khỏe chính xác.</p>
                        </div>

                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow group">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Heart className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Dinh Dưỡng & Vận Động</h3>
                            <p className="text-slate-600 leading-relaxed">Lên thực đơn theo từng gram nguyên liệu và tính toán chỉ số tiêu thụ năng lượng MET cho từng bài tập.</p>
                        </div>

                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow group">
                            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Bảo Mật Y Tế</h3>
                            <p className="text-slate-600 leading-relaxed">Hồ sơ bệnh án được bảo mật nghiêm ngặt. Chỉ bạn và bác sĩ chuyên trách mới có quyền truy cập.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
