import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
    MdArrowForward,
    MdSecurity
} from 'react-icons/md';
import Header from '../../layouts/Header';

export default function Landing() {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        } else {
            navigate('/register');
        }
    };

    return (
        <div className="min-h-screen bg-surface-container-lowest font-sans text-on-surface selection:bg-primary selection:text-on-primary">
            {/* Header Area (Minimal) */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-surface-container-lowest/90 backdrop-blur-xl transition-all border-b border-outline-variant/30">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 flex items-center justify-center">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="font-display font-bold text-2xl tracking-tight text-on-surface">Hiệp Sĩ Tiểu Đường</span>
                    </div>
                    <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-on-surface-variant">
                        <a href="#features" className="hover:text-primary transition-colors">Tính năng</a>
                        <a href="#how-it-works" className="hover:text-primary transition-colors">Hoạt động</a>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link to="/login" className="text-sm font-bold text-on-surface hover:text-primary transition-colors">
                            Đăng nhập
                        </Link>
                        <button 
                            onClick={handleGetStarted}
                            className="text-sm font-bold bg-primary text-on-primary px-7 py-3 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-all"
                        >
                            Dùng thử miễn phí
                        </button>
                    </div>
                </div>
            </nav>

            {/* SECTION 1: The Hero (Impactful & Clean) */}
            <section className="pt-48 pb-32 px-6 lg:px-12 max-w-[1440px] mx-auto overflow-hidden">
                <div className="grid lg:grid-cols-12 gap-16 items-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="lg:col-span-5 z-10"
                    >
                        <h1 className="text-6xl lg:text-[80px] font-display font-black leading-[1.05] text-[#0d1c2e] mb-8 tracking-tighter">
                            Quản lý tiểu đường<br/> Xây dựng bởi<br/> chuyên gia
                        </h1>
                        <p className="text-xl text-on-surface-variant mb-12 leading-relaxed font-medium max-w-lg">
                            Không chỉ là theo dõi đường huyết. Hệ thống kết hợp AI phân tích sâu dữ liệu lâm sàng, mang đến phác đồ dinh dưỡng và dự báo rủi ro chính xác cho từng cá nhân.
                        </p>
                        <button 
                            onClick={handleGetStarted}
                            className="group flex items-center gap-3 text-lg font-bold bg-[#004ac6] text-white px-10 py-5 rounded-full hover:bg-[#2563eb] transition-all hover:-translate-y-1"
                        >
                            Trải nghiệm miễn phí
                            <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>

                    {/* Hero Visual - Huge Bleeding Edge Mockup */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className="lg:col-span-7 relative"
                    >
                        <div className="aspect-[4/3] w-[120%] bg-[#f8f9ff] rounded-l-[4rem] flex items-center justify-center p-8 lg:p-12 relative overflow-hidden shadow-[-20px_0_60px_rgba(13,28,46,0.03)] ml-auto border-y border-l border-[#eaf1ff]">
                             {/* Decorative blurred spots */}
                             <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2563eb]/5 rounded-full blur-3xl"></div>
                             
                             <div className="relative z-10 w-full h-full flex items-center justify-center">
                                <img src="/dashboard_mockup.png" alt="Dashboard Mockup" className="w-full h-full object-contain rounded-2xl shadow-xl" />
                             </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* SECTION 2: Feature Showcase (Z-Pattern) */}
            <section id="features" className="py-32 px-6 lg:px-12 max-w-7xl mx-auto space-y-48">
                
                {/* Feature 1: Text Left, Image Right */}
                <div className="grid lg:grid-cols-2 gap-24 items-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="max-w-xl"
                    >
                        <h2 className="text-4xl lg:text-5xl font-display font-bold text-[#0d1c2e] mb-6 tracking-tight">
                            Bác sĩ AI của riêng bạn
                        </h2>
                        <p className="text-xl text-on-surface-variant leading-relaxed">
                            Phân tích triệu chứng tức thì. Trò chuyện và nhận lời khuyên y khoa 24/7 dựa trên dữ liệu sức khỏe thực tế của bạn, từ đó điều chỉnh thói quen sống kịp thời nhất.
                        </p>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="aspect-square lg:aspect-[4/3] bg-[#f8f9ff] rounded-[3rem] flex items-center justify-center p-8 border border-[#eaf1ff] overflow-hidden"
                    >
                        <img src="/chat_interface_mockup.png" alt="Chat Interface Mockup" className="w-full h-full object-contain scale-[1.35] lg:scale-[1.5] transition-transform duration-700 hover:scale-[1.6] rounded-2xl shadow-xl" />
                    </motion.div>
                </div>

                {/* Feature 2: Image Left, Text Right */}
                <div className="grid lg:grid-cols-2 gap-24 items-center">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="order-2 lg:order-1 aspect-square lg:aspect-[4/3] bg-[#f8f9ff] rounded-[3rem] flex items-center justify-center p-8 border border-[#eaf1ff] overflow-hidden"
                    >
                        <img src="/nutrition_tracker_mockup.png" alt="Nutrition Tracker UI" className="w-full h-full object-contain rounded-2xl shadow-xl" />
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="order-1 lg:order-2 max-w-xl"
                    >
                        <h2 className="text-4xl lg:text-5xl font-display font-bold text-[#0d1c2e] mb-6 tracking-tight">
                            Dinh dưỡng đo lường bằng con số
                        </h2>
                        <p className="text-xl text-on-surface-variant leading-relaxed">
                            Mỗi bữa ăn được tính toán chi tiết chỉ số đường huyết (GI) và tổng lượng Calo. Biết chính xác bạn đang nạp gì vào cơ thể mà không cần phải tự tính toán.
                        </p>
                    </motion.div>
                </div>

            </section>

            {/* SECTION 3: The Clinical Proof (Dark Section) */}
            <section id="how-it-works" className="py-40 px-6 lg:px-12 bg-[#0d1c2e] text-white mt-20">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="max-w-xl"
                    >
                        <h2 className="text-5xl lg:text-6xl font-display font-bold mb-8 tracking-tight leading-tight">
                            Thấy trước rủi ro<br/>Hành động kịp thời
                        </h2>
                        <p className="text-xl text-gray-300 leading-relaxed">
                            Mô hình Machine Learning (SHAP) liên tục quét qua các chỉ số sinh trắc học, đưa ra cảnh báo sớm về các biến chứng tiềm ẩn trước khi chúng xảy ra, giúp bác sĩ can thiệp đúng lúc.
                        </p>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="aspect-[4/3] bg-[#233144] rounded-[3rem] flex items-center justify-center p-8 border border-[#434655]/50 relative overflow-hidden"
                    >
                        {/* Glow effect */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#ad0033]/20 rounded-full blur-[100px]"></div>
                        <div className="relative z-10 w-full h-full">
                            <img src="/risk_prediction_chart.png" alt="Risk Prediction Chart" className="w-full h-full object-contain rounded-2xl shadow-xl" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* SECTION 3.5: Core Technologies (Thesis Requirement & Elegance) */}
            <section className="py-32 px-6 lg:px-12 max-w-7xl mx-auto border-b border-outline-variant/30">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-sm font-bold tracking-widest text-[#004ac6] uppercase mb-4"
                    >
                        Nền tảng kỹ thuật
                    </motion.h2>
                    <motion.h3 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl lg:text-5xl font-display font-bold text-[#0d1c2e] tracking-tight"
                    >
                        Sức mạnh đằng sau sự đơn giản.
                    </motion.h3>
                </div>
                
                <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
                    {/* Tech 1 */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                    >
                        <div className="text-3xl mb-6 opacity-80">🧠</div>
                        <h4 className="text-xl font-bold text-on-surface">Agentic RAG</h4>
                        <p className="text-on-surface-variant leading-relaxed">
                            Cấu trúc Retrieval-Augmented Generation tiên tiến giúp AI Chatbot truy xuất chính xác các phác đồ y khoa thay vì bịa đặt thông tin (hallucination).
                        </p>
                    </motion.div>

                    {/* Tech 2 */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4"
                    >
                        <div className="text-3xl mb-6 opacity-80">⚙️</div>
                        <h4 className="text-xl font-bold text-on-surface">SHAP Analysis</h4>
                        <p className="text-on-surface-variant leading-relaxed">
                            Mô hình Explainable AI (AI có thể giải thích) phân tích rủi ro biến chứng dựa trên 20+ chỉ số lâm sàng, cho phép bác sĩ hiểu rõ nguyên nhân gốc rễ.
                        </p>
                    </motion.div>

                    {/* Tech 3 */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4"
                    >
                        <div className="text-3xl mb-6 opacity-80">⚡</div>
                        <h4 className="text-xl font-bold text-on-surface">Modern Architecture</h4>
                        <p className="text-on-surface-variant leading-relaxed">
                            Kiến trúc tách rời linh hoạt (React & Python FastAPI) đảm bảo hiệu năng xử lý dữ liệu y tế lớn với độ trễ thấp và bảo mật nghiêm ngặt.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* SECTION 4: The Final CTA */}
            <section className="py-48 px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-5xl lg:text-7xl font-display font-black text-[#0d1c2e] mb-12 tracking-tight">
                        Sẵn sàng làm chủ<br/>sức khỏe?
                    </h2>
                    <button 
                        onClick={handleGetStarted}
                        className="text-lg font-bold bg-[#0d1c2e] text-white px-12 py-6 rounded-full hover:scale-105 hover:bg-black transition-all duration-300 shadow-2xl"
                    >
                        Tạo tài khoản ngay
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-surface-container-lowest border-t border-outline-variant/30 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="font-display font-black tracking-tight text-on-surface">Hiệp Sĩ Tiểu Đường</span>
                    </div>
                    <div className="flex gap-6 text-sm font-medium text-on-surface-variant">
                        <a href="#" className="hover:text-primary transition-colors">Chính sách bảo mật</a>
                        <a href="#" className="hover:text-primary transition-colors">Điều khoản sử dụng</a>
                        <a href="#" className="hover:text-primary transition-colors">Liên hệ</a>
                    </div>
                    <div className="text-sm font-medium text-outline-variant text-center">
                        &copy; 2026 Clinical Curator. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
