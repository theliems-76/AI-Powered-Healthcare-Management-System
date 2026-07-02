import React, { useState } from 'react';
import { MessageSquarePlus, X, Star, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

export default function FeedbackWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Vui lòng chọn số sao đánh giá!");
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            await api.post('/feedbacks', { rating, content: feedback });
            setIsOpen(false);
            setRating(0);
            setFeedback('');
            setHasSubmitted(true);
            toast.success("Cảm ơn bạn đã đóng góp ý kiến! Chúng tôi vô cùng trân trọng.");
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra khi gửi đánh giá.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (hasSubmitted) return null;

    return (
        <>
            {/* Floating Action Button */}
            <button 
                onClick={() => setIsOpen(true)}
                className={`p-4 bg-secondary text-on-secondary rounded-2xl shadow-xl shadow-secondary/30 hover:scale-110 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group ${isOpen ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'}`}
                title="Góp ý & Đánh giá"
            >
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Star size={24} className="fill-amber-400 text-amber-400" />
                <span className="absolute -top-2 -right-2 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500"></span>
                </span>
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    
                    {/* Modal Box */}
                    <div className="bg-surface-container-lowest w-full max-w-md rounded-[2rem] shadow-[0_12px_40px_rgba(0,24,72,0.15)] relative z-10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden flex flex-col">
                        
                        {/* Header Gradient */}
                        <div className="bg-gradient-to-br from-indigo-500 to-cyan-400 p-6 text-white relative overflow-hidden shrink-0">
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <h3 className="text-xl font-black tracking-tight mb-1">Góp ý hệ thống</h3>
                            <p className="text-sm font-medium text-white/80">Ý kiến của bạn giúp Hiệp Sĩ Tiểu Đường hoàn thiện hơn.</p>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
                            
                            {/* Star Rating */}
                            <div className="flex flex-col items-center gap-3">
                                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Đánh giá chung</span>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="p-1 transition-transform hover:scale-125 focus:outline-none"
                                        >
                                            <Star 
                                                size={36} 
                                                className={`transition-colors duration-200 ${
                                                    star <= (hoverRating || rating) 
                                                    ? 'fill-amber-400 text-amber-400 drop-shadow-sm' 
                                                    : 'fill-surface-container-highest text-outline-variant'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <span className="text-sm font-bold text-on-surface-variant h-5">
                                    {hoverRating === 1 || rating === 1 ? 'Rất tệ' : 
                                     hoverRating === 2 || rating === 2 ? 'Tệ' : 
                                     hoverRating === 3 || rating === 3 ? 'Bình thường' : 
                                     hoverRating === 4 || rating === 4 ? 'Tốt' : 
                                     hoverRating === 5 || rating === 5 ? 'Tuyệt vời!' : ''}
                                </span>
                            </div>

                            {/* Text Area */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Bạn có muốn chia sẻ thêm không?</label>
                                <textarea 
                                    rows="4"
                                    placeholder="Tính năng nào bạn thích nhất? Hoặc có gì khiến bạn không hài lòng..."
                                    className="w-full bg-surface-container border border-outline-variant rounded-2xl p-4 text-sm font-medium text-on-surface placeholder-on-surface-variant/60 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full py-4 bg-primary text-on-primary rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-95 shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Send size={16} /> Gửi Ý Kiến
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
