import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Shield, Brain, Heart, ChevronRight, Menu, X, ArrowRightCircle, Stethoscope, ActivitySquare, Play } from 'lucide-react';
import Logo from '../../components/ui/Logo';

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (custom) => ({
        opacity: 1, 
        y: 0, 
        transition: { delay: custom * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    })
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const slideIn = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
    exit: { x: '100%', transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }
};

// Spotify-like floating glowing orbs
const GlowingOrbs = () => (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black">
        <motion.div 
            animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
                x: [0, 100, 0],
                y: [0, -50, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#4F46E5] blur-[150px] opacity-30 mix-blend-screen"
        />
        <motion.div 
            animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
                x: [0, -100, 0],
                y: [0, 100, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#9333EA] blur-[150px] opacity-20 mix-blend-screen"
        />
        <motion.div 
            animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.1, 0.3, 0.1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-[#06B6D4] blur-[150px] opacity-20 mix-blend-screen"
        />
        
        {/* Subtle noise overlay for cinematic film grain feel */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
    </div>
);

export default function Landing() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Khám phá', href: '#kham-pha', isRoute: false },
        { name: 'Công nghệ AI', href: '#cong-nghe', isRoute: false },
        { name: 'Hành trình', href: '#hanh-trinh', isRoute: false },
        { name: 'Tài liệu', href: '/guide', isRoute: true }
    ];

    return (
        <div className="relative w-full min-h-screen font-sans text-slate-200 bg-black overflow-x-hidden selection:bg-[#4F46E5]/40">
            <GlowingOrbs />

            {/* Navbar - Netflix/Spotify style (transparent to dark glass) */}
            <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-black/60 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-[1400px] mx-auto px-6 sm:px-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Logo className="w-10 h-10 shadow-[0_0_20px_rgba(34,211,238,0.3)] rounded-[14px]" />
                        <span className="text-2xl font-black tracking-tight text-white drop-shadow-md">Hiệp Sĩ<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400"> Tiểu Đường</span></span>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map((item) => (
                            item.isRoute ? (
                                <Link key={item.name} to={item.href} className="text-sm font-semibold text-slate-300 hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all">
                                    {item.name}
                                </Link>
                            ) : (
                                <a key={item.name} href={item.href} className="text-sm font-semibold text-slate-300 hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all">
                                    {item.name}
                                </a>
                            )
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-5">
                        <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                            Đăng nhập
                        </Link>
                        <Link to="/register" className="relative group overflow-hidden text-sm font-bold text-white bg-white/10 hover:bg-white/20 px-6 py-2.5 rounded-full backdrop-blur-md border border-white/10 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]">
                            <span className="relative z-10">Bắt đầu miễn phí</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>
                    </div>

                    <button className="md:hidden p-2 text-white" onClick={() => setMobileMenuOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.div 
                            variants={slideIn} initial="hidden" animate="visible" exit="exit"
                            className="fixed top-0 right-0 w-[min(88vw,360px)] h-[100dvh] bg-[#121212] border-l border-white/10 shadow-2xl z-[70] flex flex-col"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-white/10">
                                <span className="text-xl font-bold text-white">Menu</span>
                                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6"/></button>
                            </div>
                            <div className="flex flex-col p-6 gap-6 overflow-y-auto flex-1">
                                {navLinks.map((item, i) => (
                                    item.isRoute ? (
                                        <motion.div key={item.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                                            <Link 
                                                to={item.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="text-2xl font-bold text-slate-300 hover:text-white transition-colors"
                                            >
                                                {item.name}
                                            </Link>
                                        </motion.div>
                                    ) : (
                                        <motion.a 
                                            key={item.name} href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                                            className="text-2xl font-bold text-slate-300 hover:text-white transition-colors"
                                        >
                                            {item.name}
                                        </motion.a>
                                    )
                                ))}
                            </div>
                            <div className="p-6 flex flex-col gap-4 border-t border-white/10">
                                <Link to="/login" className="w-full py-4 text-center rounded-full bg-white/10 hover:bg-white/20 text-white font-bold backdrop-blur-md border border-white/10 transition-colors">Đăng nhập</Link>
                                <Link to="/register" className="w-full py-4 text-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-[0_0_20px_rgba(79,70,229,0.4)]">Bắt đầu miễn phí</Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Cinematic Hero Section - Spotify/Netflix Vibe */}
            <section id="kham-pha" className="relative w-full min-h-screen flex items-center pt-24 pb-12 overflow-hidden">
                <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-10 w-full flex flex-col items-center text-center">
                    
                    <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-semibold tracking-widest uppercase mb-10 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
                        Healthcare Intelligence
                    </motion.div>

                    <motion.h1 
                        custom={1} variants={fadeUp} initial="hidden" animate="visible"
                        className="text-[clamp(3.5rem,8vw,7.5rem)] font-black text-white leading-[1.05] tracking-tight mb-8 drop-shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                        style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
                    >
                        Bảo vệ sinh mệnh <br/>
                        với <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">trí tuệ vô hạn.</span>
                    </motion.h1>

                    <motion.p 
                        custom={2} variants={fadeUp} initial="hidden" animate="visible"
                        className="text-[clamp(1.1rem,2vw,1.4rem)] leading-[1.6] text-slate-300 opacity-80 max-w-[800px] mb-12 font-light"
                    >
                        Tận hưởng cuộc sống trọn vẹn. Hiệp Sĩ Tiểu Đường hoạt động âm thầm như một vị bác sĩ chuyên trách, dự báo nguy cơ và thiết kế phác đồ chăm sóc hoàn hảo dành riêng cho bạn.
                    </motion.p>

                    <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row items-center gap-6">
                        <Link to="/register" className="group flex items-center justify-center gap-4 px-10 py-5 bg-white text-black rounded-full font-black text-[clamp(1rem,1.5vw,1.2rem)] shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:scale-105 active:scale-95 transition-all">
                            <span>Bắt đầu trải nghiệm</span>
                            <ArrowRightCircle className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Cinematic Metrics & SHAP Section (Editorial/Human Layout) */}
            <section id="cong-nghe" className="py-32 relative z-10 bg-black">
                <div className="max-w-[1200px] mx-auto px-6 sm:px-10">
                    
                    {/* Immersive Editorial Metrics - No Boxes */}
                    <div className="mb-40">
                        <motion.h2 
                            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                            className="text-[clamp(2.5rem,5vw,4.5rem)] font-black text-white mb-16 tracking-tight leading-[1.1] max-w-4xl"
                            style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
                        >
                            Không phải những con số khô khan.<br/>
                            Đây là <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-500">sự sống</span> được mã hóa.
                        </motion.h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 gap-x-20">
                            {[
                                { title: 'Độ Nhạy Bệnh Lý', value: '80.0%', desc: 'Trong y khoa, bỏ sót bệnh nhân là tối kỵ. Khả năng "bắt trúng" 80% các ca có nguy cơ cao giúp hệ thống trở thành lưới lọc an toàn đầu tiên của bạn.', color: 'text-pink-500' },
                                { title: 'Độ Chính Xác Tổng Thể', value: '75.0%', desc: 'Hoạt động ổn định trên bộ dữ liệu BRFSS phức tạp với hàng triệu mẫu, đảm bảo dự báo không chỉ mang tính lý thuyết mà áp dụng thực tiễn.', color: 'text-indigo-400' },
                                { title: 'F1-Score', value: '75.0%', desc: 'Sự cân bằng hoàn hảo giữa việc chẩn đoán đúng và không bỏ sót, loại bỏ tình trạng máy học thiên vị hay Overfitting.', color: 'text-purple-400' },
                                { title: 'Độ Chuẩn Xác', value: '72.9%', desc: 'Tỷ lệ dự đoán đúng cao, giúp bạn yên tâm khi nhận các cảnh báo sức khỏe từ hệ thống.', color: 'text-cyan-400' },
                            ].map((stat, idx) => (
                                <motion.div 
                                    key={idx} 
                                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={idx}
                                    className="relative pl-8 border-l border-white/10 hover:border-white/40 transition-colors"
                                >
                                    <div className={`text-[clamp(3.5rem,6vw,5rem)] font-black leading-none mb-4 tracking-tighter ${stat.color} drop-shadow-[0_0_20px_currentColor]`}>
                                        {stat.value}
                                    </div>
                                    <h4 className="text-white font-bold text-2xl mb-3 tracking-wide">{stat.title}</h4>
                                    <p className="text-slate-400 text-lg font-light leading-relaxed">{stat.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* SHAP Analysis - Fluid Editorial List */}
                    <div className="relative pt-24 border-t border-white/10">
                        {/* Ambient background glow for this section */}
                        <div className="absolute top-0 right-1/4 w-[40vw] h-[40vw] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none"></div>

                        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10">
                            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="lg:w-1/3">
                                <h3 className="text-[clamp(2.5rem,4vw,3.5rem)] font-black text-white leading-tight mb-6" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
                                    SHAP <br className="hidden lg:block"/> Analysis
                                </h3>
                                <p className="text-xl text-slate-400 font-light leading-relaxed">
                                    Trí tuệ nhân tạo không còn là một "hộp đen" bí ẩn. Bằng công nghệ SHAP, chúng tôi bóc tách tư duy của máy học, chỉ ra chính xác những yếu tố sinh hóa nào đang chi phối trực tiếp đến dự báo rủi ro của bạn.
                                </p>
                            </motion.div>

                            <div className="lg:w-2/3 flex flex-col justify-center">
                                {[
                                    { name: 'Sức khỏe tổng quát', sub: 'General Health Status', val: 29.8, color: 'from-indigo-600 to-indigo-400' },
                                    { name: 'Chỉ số khối cơ thể', sub: 'Body Mass Index (BMI)', val: 19.7, color: 'from-purple-600 to-purple-400' },
                                    { name: 'Độ tuổi', sub: 'Age Category', val: 18.3, color: 'from-pink-600 to-pink-400' },
                                    { name: 'Huyết áp', sub: 'High Blood Pressure', val: 13.1, color: 'from-cyan-600 to-cyan-400' },
                                ].map((item, idx) => (
                                    <motion.div 
                                        key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={idx}
                                        className="group py-8 border-b border-white/10 hover:border-white/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative"
                                    >
                                        <div className="flex-1">
                                            <h4 className="text-2xl font-bold text-white mb-1 group-hover:translate-x-2 transition-transform duration-500">{item.name}</h4>
                                            <p className="text-slate-500 text-sm font-medium tracking-widest uppercase group-hover:translate-x-2 transition-transform duration-500 delay-75">{item.sub}</p>
                                        </div>
                                        
                                        <div className="flex-1 flex items-center gap-6">
                                            {/* Glowing Line representing importance */}
                                            <div className="flex-1 h-[2px] bg-white/5 relative overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }} whileInView={{ width: `${item.val * 3}%` }} viewport={{ once: true }}
                                                    transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                                    className={`absolute top-0 left-0 h-full bg-gradient-to-r ${item.color} shadow-[0_0_15px_currentColor]`}
                                                />
                                            </div>
                                            <span className="text-3xl font-black text-white min-w-[5rem] text-right drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{item.val}%</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works - Cinematic Storytelling (Editorial Line Layout) */}
            <section id="hanh-trinh" className="py-32 relative z-10 bg-black border-t border-white/10">
                <div className="max-w-[1000px] mx-auto px-6 sm:px-10">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-32">
                        <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black text-white mb-6" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>Hành trình của bạn.</h2>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">Ba bước đơn giản để tái lập và nắm giữ tương lai sức khỏe của chính mình.</p>
                    </motion.div>

                    <div className="relative">
                        {/* Continuous vertical line */}
                        <div className="absolute top-0 bottom-0 left-[2rem] md:left-1/2 w-[1px] bg-gradient-to-b from-indigo-500/50 via-purple-500/50 to-pink-500/50 -translate-x-1/2 hidden md:block"></div>

                        <div className="space-y-24">
                            {[
                                { step: '01', title: 'Thiết Lập', desc: 'Nhập các chỉ số sinh hóa cơ bản. Dữ liệu của bạn được mã hóa và bảo vệ tuyệt đối trong không gian riêng tư.', align: 'left' },
                                { step: '02', title: 'Phân Tích', desc: 'AI phân tích dữ liệu trong tích tắc, nhận diện rủi ro tiềm ẩn và mô hình hóa biểu đồ sức khỏe tương lai.', align: 'right' },
                                { step: '03', title: 'Hành Động', desc: 'Tiếp nhận phác đồ dinh dưỡng và vận động cá nhân hóa, đồng bộ trực tiếp với bác sĩ chuyên khoa.', align: 'left' },
                            ].map((item, idx) => (
                                <motion.div 
                                    key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={idx}
                                    className={`relative flex flex-col md:flex-row items-center gap-10 md:gap-20 ${item.align === 'right' ? 'md:flex-row-reverse' : ''}`}
                                >
                                    {/* Center Node on the line */}
                                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_20px_#fff] z-10"></div>
                                    
                                    <div className={`md:w-1/2 flex flex-col ${item.align === 'right' ? 'md:items-start md:text-left' : 'md:items-end md:text-right'} items-center text-center`}>
                                        <div className="text-[clamp(6rem,12vw,10rem)] font-black text-white/5 leading-none select-none mb-[-2rem] md:mb-[-3rem] -z-10">
                                            {item.step}
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">{item.title}</h3>
                                        <p className="text-slate-400 leading-relaxed text-lg font-light max-w-md relative z-10">{item.desc}</p>
                                    </div>
                                    
                                    <div className="md:w-1/2">
                                        {/* Empty space for the opposite side, or could hold an abstract image */}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Giant Footer CTA */}
            <section className="py-40 relative z-10 overflow-hidden bg-black border-t border-white/5">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900/20 pointer-events-none"></div>
                <div className="max-w-[1000px] mx-auto px-6 text-center relative z-10">
                    <motion.h2 
                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                        className="text-[clamp(3rem,6vw,5rem)] font-black text-white mb-10 leading-[1.1] tracking-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
                    >
                        Tương lai sức khỏe <br/>nằm trong tay bạn.
                    </motion.h2>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
                        <Link to="/register" className="inline-flex items-center justify-between gap-6 px-12 py-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-black text-xl shadow-[0_0_50px_rgba(79,70,229,0.5)] hover:shadow-[0_0_80px_rgba(79,70,229,0.7)] hover:scale-105 active:scale-95 transition-all">
                            <span>Khởi tạo tài khoản miễn phí</span>
                            <ArrowRightCircle className="w-7 h-7" />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
