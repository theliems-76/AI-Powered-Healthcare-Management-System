import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Shield, Brain, Activity, User, Menu, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../../components/ui/Logo';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function Guide() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('overview');

    const sections = [
        { id: 'overview', title: 'Tổng quan Hệ thống', desc: 'Kiến trúc và luồng dữ liệu' },
        { id: 'patient', title: 'Quyền hạn: Bệnh Nhân', desc: 'Theo dõi & Cá nhân hóa' },
        { id: 'doctor', title: 'Quyền hạn: Bác Sĩ', desc: 'Quản lý & Giám sát' },
        { id: 'admin', title: 'Quyền hạn: Quản Trị Viên', desc: 'Thiết lập & Điều hành' },
        { id: 'ai', title: 'Kiến trúc AI', desc: 'CatBoost & Giải thích SHAP' },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-12">
                        <div>
                            <h1 className="text-[clamp(2.5rem,4vw,3.5rem)] font-black text-white mb-6 tracking-tight leading-[1.1]" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
                                Hệ Sinh Thái Hiệp Sĩ Tiểu Đường
                            </h1>
                            <p className="text-xl text-slate-400 font-light leading-relaxed max-w-3xl">
                                Nền tảng chăm sóc sức khỏe toàn diện kết hợp công nghệ Machine Learning để phân tích rủi ro lâm sàng và đưa ra phác đồ cá nhân hóa. Không chỉ là chẩn đoán, đây là sự can thiệp chủ động.
                            </p>
                        </div>
                        
                        <div className="relative pt-12 border-t border-white/10">
                            <h3 className="text-2xl font-bold text-white mb-8">Luồng Hoạt Động Cốt Lõi</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                {[
                                    { step: '01', title: 'Thu thập Sinh hóa', desc: 'Hệ thống tiếp nhận các chỉ số cơ thể đầu vào (Đường huyết, Huyết áp, BMI, Mức độ vận động, Tiền sử bệnh lý).' },
                                    { step: '02', title: 'Phân tích Rủi ro', desc: 'Mô hình AI xử lý khối lượng dữ liệu khổng lồ, đánh giá rủi ro tiềm ẩn của bệnh nhân dựa trên hàng triệu mẫu y khoa.' },
                                    { step: '03', title: 'Phác đồ Cá nhân hóa', desc: 'Tự động trích xuất và đề xuất thực đơn dinh dưỡng (Kcal/Macro) cùng bài tập tiêu hao năng lượng (MET) phù hợp nhất.' },
                                    { step: '04', title: 'Giám sát Chuyên môn', desc: 'Bác sĩ chuyên khoa tiếp nhận kết quả, thẩm định khuyến nghị từ AI và can thiệp điều trị kịp thời khi có cảnh báo.' }
                                ].map((item, idx) => (
                                    <div key={idx} className="relative pl-8 border-l border-white/10 hover:border-white/40 transition-colors">
                                        <div className="text-3xl font-black text-slate-700 mb-2 font-mono tracking-tighter">{item.step}</div>
                                        <h4 className="text-white font-bold text-xl mb-2">{item.title}</h4>
                                        <p className="text-slate-400 text-base leading-relaxed font-light">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );
            case 'patient':
                return (
                    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-12">
                        <div>
                            <h1 className="text-[clamp(2.5rem,4vw,3.5rem)] font-black text-white mb-6 tracking-tight leading-[1.1]" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
                                Quyền Hạn:<br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Bệnh Nhân (Patient)</span>
                            </h1>
                            <p className="text-xl text-slate-400 font-light leading-relaxed max-w-3xl">
                                Trung tâm của hệ sinh thái. Bệnh nhân được trang bị một bảng điều khiển cá nhân hóa hoàn toàn, kết nối trực tiếp với công cụ AI dự báo và đội ngũ y bác sĩ.
                            </p>
                        </div>

                        <div className="flex flex-col border-t border-white/10 mt-8 pt-4">
                            {[
                                { title: 'Đánh giá Khảo sát', desc: 'Cung cấp thông tin sinh hóa định kỳ. Hệ thống sẽ ngay lập tức tính toán và hiển thị cấp độ rủi ro thông qua thuật toán máy học.', num: '01' },
                                { title: 'Phác đồ Dinh dưỡng & Vận động', desc: 'Nhận thực đơn ăn uống tính toán chính xác tới từng Kcal, cùng danh sách bài tập vận động chuẩn y khoa.', num: '02' },
                                { title: 'Lịch sử Y án', desc: 'Theo dõi xu hướng sức khỏe qua thời gian thực thông qua biểu đồ trực quan. Nhận cảnh báo biến động rủi ro tức thời.', num: '03' },
                                { title: 'Đặt lịch Khám', desc: 'Chủ động kết nối, yêu cầu tư vấn và đặt lịch khám trực tiếp với bác sĩ chuyên khoa phụ trách hồ sơ của mình.', num: '04' }
                            ].map((feature, idx) => (
                                <div key={idx} className="py-12 border-b border-white/5 flex flex-col md:flex-row gap-6 md:items-start group">
                                    <div className="text-4xl font-black text-slate-800 font-mono tracking-tighter w-16 pt-1 transition-colors group-hover:text-cyan-900">{feature.num}</div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-bold text-2xl mb-3 tracking-wide">{feature.title}</h4>
                                        <p className="text-slate-400 font-light leading-relaxed text-lg max-w-2xl">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );
            case 'doctor':
                return (
                    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-12">
                        <div>
                            <h1 className="text-[clamp(2.5rem,4vw,3.5rem)] font-black text-white mb-6 tracking-tight leading-[1.1]" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
                                Quyền Hạn:<br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Bác Sĩ (Doctor)</span>
                            </h1>
                            <p className="text-xl text-slate-400 font-light leading-relaxed max-w-3xl">
                                Vị trí giám sát và ra quyết định. Bác sĩ kiểm soát y lệnh, phân tích dữ liệu AI và can thiệp y tế khi phát hiện rủi ro cao.
                            </p>
                        </div>

                        <div className="space-y-0 border-l border-white/10 pl-8 ml-4">
                            {[
                                { title: 'Quản lý Bệnh nhân (Roster)', desc: 'Truy cập hồ sơ y án của các bệnh nhân được phân công. Lọc và sắp xếp bệnh nhân theo mức độ rủi ro khẩn cấp do AI dự báo.' },
                                { title: 'Giám sát Khuyến nghị AI', desc: 'Máy móc chỉ đề xuất, bác sĩ mới là người quyết định. Toàn quyền xem xét, phê duyệt hoặc tinh chỉnh các thực đơn/bài tập do AI sinh ra.' },
                                { title: 'Xử lý Lịch hẹn (Appointments)', desc: 'Tiếp nhận, xác nhận hoặc dời lịch khám chuyên môn từ bệnh nhân thông qua hệ thống quản lý lịch trình nội bộ.' }
                            ].map((item, idx) => (
                                <div key={idx} className="relative py-10 border-b border-white/5 last:border-0 group">
                                    <div className="absolute -left-[41px] top-12 w-2 h-2 rounded-full bg-slate-700 group-hover:bg-indigo-500 transition-colors"></div>
                                    <h4 className="text-2xl font-bold text-white mb-3 tracking-wide">{item.title}</h4>
                                    <p className="text-slate-400 font-light leading-relaxed text-lg max-w-2xl">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );
            case 'admin':
                return (
                    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-12">
                        <div>
                            <h1 className="text-[clamp(2.5rem,4vw,3.5rem)] font-black text-white mb-6 tracking-tight leading-[1.1]" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
                                Quyền Hạn:<br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Quản Trị Viên (Admin)</span>
                            </h1>
                            <p className="text-xl text-slate-400 font-light leading-relaxed max-w-3xl">
                                Người nắm giữ hệ thống hạ tầng. Thiết lập cơ sở dữ liệu y tế lõi, cấu hình phân quyền và giám sát hoạt động hệ thống.
                            </p>
                        </div>

                        <div className="space-y-16 mt-16">
                            {[
                                { title: 'Quản trị Danh tính', desc: 'Thêm mới, khóa hoặc thiết lập phân quyền (Doctor/Patient). Quản lý vòng đời tài khoản hệ thống với tính bảo mật cao nhất.' },
                                { title: 'Kho Dữ liệu Y tế', desc: 'Xây dựng và chuẩn hóa danh mục Thực phẩm (Macro/Kcal) và danh mục Bài tập (chỉ số MET), đảm bảo nền tảng kiến thức cho hệ thống sinh phác đồ.' },
                                { title: 'Log & Thống kê', desc: 'Theo dõi lưu lượng truy cập API, tần suất dự báo của AI và hiệu suất hoạt động tổng thể của nền tảng qua các dashboards thời gian thực.' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col gap-2 group">
                                    <div className="flex items-center gap-6 mb-2">
                                        <div className="h-[1px] flex-1 bg-white/5 group-hover:bg-gradient-to-r group-hover:from-red-500/50 group-hover:to-transparent transition-colors"></div>
                                        <h4 className="text-white font-bold text-2xl tracking-wide shrink-0">{item.title}</h4>
                                    </div>
                                    <p className="text-slate-400 font-light leading-relaxed text-lg lg:ml-auto max-w-2xl text-right">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );
            case 'ai':
                return (
                    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-16">
                        <div>
                            <h1 className="text-[clamp(2.5rem,4vw,3.5rem)] font-black text-white mb-6 tracking-tight leading-[1.1]" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
                                Kiến Trúc AI<br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">CatBoost & SHAP</span>
                            </h1>
                            <p className="text-xl text-slate-400 font-light leading-relaxed max-w-3xl">
                                Trái tim của hệ thống dự báo. Không phải một "hộp đen" bí ẩn, mọi dự đoán đều có cơ sở khoa học và có thể giải thích minh bạch.
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-6">Mô hình Phân loại CatBoost</h3>
                            <p className="text-slate-400 font-light leading-relaxed mb-8 max-w-3xl text-lg">
                                Huấn luyện trên bộ dữ liệu BRFSS khổng lồ, mô hình tối ưu hóa chuyên sâu cho các biến phân loại (Categorical Features) thường gặp trong hồ sơ bệnh án.
                            </p>
                            
                            <div className="flex flex-wrap gap-6 mb-10">
                                <div className="px-6 py-4 border border-pink-500/30 bg-pink-500/5">
                                    <div className="text-sm text-pink-400 font-semibold tracking-widest uppercase mb-1">Recall (Độ nhạy)</div>
                                    <div className="text-4xl font-black text-white">80.0%</div>
                                </div>
                                <div className="px-6 py-4 border border-indigo-500/30 bg-indigo-500/5">
                                    <div className="text-sm text-indigo-400 font-semibold tracking-widest uppercase mb-1">Accuracy (Độ chính xác)</div>
                                    <div className="text-4xl font-black text-white">75.0%</div>
                                </div>
                            </div>
                            
                            <div className="p-8 border border-white/10 bg-white/5 relative">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-amber-600"></div>
                                <h4 className="text-white font-bold text-lg mb-4">Lý giải sự chênh lệch của Accuracy (75%)</h4>
                                <div className="text-slate-400 font-light leading-relaxed space-y-4">
                                    <p>
                                        Trong y tế thực tiễn, số lượng người khỏe mạnh luôn áp đảo người mang mầm bệnh (Imbalanced Data). Nếu không can thiệp, mô hình có thể dễ dàng đạt Accuracy 95% chỉ bằng cách dự đoán mọi người là "Không bệnh" – một sai lầm chết người vì nó bỏ sót toàn bộ các ca nguy hiểm.
                                    </p>
                                    <p>
                                        Để khắc phục, chúng tôi áp dụng chiến lược <b>Cân bằng dữ liệu (Split 50/50)</b> khi Training. Việc này ép mô hình đối mặt với rủi ro như nhau, khiến Accuracy tổng thể giảm về mức trung thực 75%, nhưng bù lại đẩy <b>Recall lên mức 80.0%</b>.
                                    </p>
                                    <p className="text-white font-medium">
                                        Kết luận: Trong chẩn đoán lâm sàng, "bắt nhầm còn hơn bỏ sót". Hệ thống chấp nhận hy sinh Accuracy ảo để tối đa hóa khả năng quét lưới an toàn cho bệnh nhân.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/10">
                            <h3 className="text-2xl font-bold text-white mb-6">Giải Thích SHAP (Explainable AI)</h3>
                            <p className="text-slate-400 font-light leading-relaxed mb-6 max-w-3xl text-lg">
                                Công nghệ SHAP (SHapley Additive exPlanations) bóc tách tư duy của mô hình, định lượng chính xác mức độ ảnh hưởng của từng chỉ số đầu vào lên quyết định cuối cùng.
                            </p>
                            
                            <div className="bg-[#0a0a0a] p-8 border border-white/10 font-mono text-sm shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                    <Brain className="w-32 h-32" />
                                </div>
                                <div className="text-indigo-400 mb-6"> Mức độ ảnh hưởng trung bình (Feature Importance)</div>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between text-slate-300 mb-2">
                                            <span>1. Tình trạng sức khỏe chung (GenHlth)</span>
                                            <span className="text-white font-bold">29.8%</span>
                                        </div>
                                        <div className="w-full bg-white/5 h-1"><div className="bg-gradient-to-r from-indigo-600 to-indigo-400 h-full w-[29.8%] shadow-[0_0_10px_currentColor]"></div></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-slate-300 mb-2">
                                            <span>2. Chỉ số khối cơ thể (BMI)</span>
                                            <span className="text-white font-bold">19.7%</span>
                                        </div>
                                        <div className="w-full bg-white/5 h-1"><div className="bg-gradient-to-r from-purple-600 to-purple-400 h-full w-[19.7%] shadow-[0_0_10px_currentColor]"></div></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-slate-300 mb-2">
                                            <span>3. Độ tuổi (Age Category)</span>
                                            <span className="text-white font-bold">18.3%</span>
                                        </div>
                                        <div className="w-full bg-white/5 h-1"><div className="bg-gradient-to-r from-pink-600 to-pink-400 h-full w-[18.3%] shadow-[0_0_10px_currentColor]"></div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-black text-slate-200 font-sans flex flex-col selection:bg-indigo-500/30 selection:text-white">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center justify-between px-6 sm:px-10 h-20 max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-6">
                        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <Logo className="w-10 h-10 shadow-[0_0_20px_rgba(34,211,238,0.3)] rounded-[14px]" />
                            <span className="text-2xl font-black tracking-tight text-white drop-shadow-md hidden sm:block">Hiệp Sĩ<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400"> Tiểu Đường</span></span>
                        </Link>
                        <div className="h-6 w-px bg-white/10 hidden sm:block"></div>
                        <span className="text-slate-400 font-semibold tracking-wide hidden sm:block uppercase text-sm">Documentation</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-sm font-semibold text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                            <ArrowLeft className="w-4 h-4"/> Quay lại Landing Page
                        </Link>
                        <button className="lg:hidden p-2 text-slate-400 hover:text-white" onClick={() => setMobileMenuOpen(true)}>
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex w-full max-w-[1400px] mx-auto">
                {/* Sidebar Desktop */}
                <aside className="hidden lg:block w-80 shrink-0 border-r border-white/5 py-12 px-8 overflow-y-auto">
                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-6 ml-2">Mục lục</h3>
                    <nav className="space-y-2">
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all relative group ${
                                    activeSection === section.id 
                                    ? 'text-white font-bold' 
                                    : 'text-slate-500 hover:text-slate-300 font-medium'
                                }`}
                            >
                                <span className="relative z-10">{section.title}</span>
                                {activeSection === section.id && (
                                    <motion.div layoutId="activeGuideSection" className="absolute left-0 top-0 w-full h-full bg-white/5 border-l-2 border-indigo-500 pointer-events-none" />
                                )}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Mobile Sidebar */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] lg:hidden" onClick={() => setMobileMenuOpen(false)} />
                            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }} className="fixed inset-y-0 left-0 w-[85vw] max-w-[320px] bg-[#0a0a0a] border-r border-white/10 shadow-2xl z-[70] p-6 lg:hidden flex flex-col">
                                <div className="flex items-center justify-between mb-10">
                                    <span className="font-bold text-white text-lg tracking-wide uppercase">Mục lục</span>
                                    <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white rounded-full"><X className="w-5 h-5"/></button>
                                </div>
                                <nav className="space-y-1 flex-1 overflow-y-auto">
                                    {sections.map(section => (
                                        <button
                                            key={section.id}
                                            onClick={() => { setActiveSection(section.id); setMobileMenuOpen(false); }}
                                            className={`w-full flex flex-col gap-1 px-4 py-3 text-left transition-all border-l-2 ${
                                                activeSection === section.id 
                                                ? 'border-indigo-500 bg-white/5 text-white' 
                                                : 'border-transparent text-slate-500 hover:text-slate-300'
                                            }`}
                                        >
                                            <span className="font-bold text-lg">{section.title}</span>
                                            <span className="text-xs tracking-wider uppercase opacity-60">{section.desc}</span>
                                        </button>
                                    ))}
                                </nav>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Main Content Area */}
                <main className="flex-1 min-h-[calc(100vh-5rem)]">
                    <div className="max-w-4xl mx-auto py-16 px-6 sm:px-12 lg:px-20">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
}
