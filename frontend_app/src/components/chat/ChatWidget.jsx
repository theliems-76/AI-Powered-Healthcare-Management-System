import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function ChatWidget({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/chat/history');
            if (res.data?.data && res.data.data.length > 0) {
                setMessages(res.data.data);
            } else {
                setMessages([{ role: 'model', content: `Xin chào ${user?.full_name?.split(' ')[0] || 'bạn'}, tôi là Bác sĩ AI của Hiệp sĩ Tiểu đường. Tôi có thể giúp gì cho bạn hôm nay?` }]);
            }
        } catch (error) {
            console.error("Lỗi tải lịch sử chat:", error);
            setMessages([{ role: 'model', content: `Xin chào ${user?.full_name?.split(' ')[0] || 'bạn'}, tôi là Bác sĩ AI của Hiệp sĩ Tiểu đường. Tôi có thể giúp gì cho bạn hôm nay?` }]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            fetchHistory();
        }
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        
        const userMessage = { role: 'user', content: input };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await api.post('/chat', { messages: updatedMessages });
            
            if (response.data?.data?.content) {
                setMessages(prev => [...prev, { role: 'model', content: response.data.data.content }]);
            } else {
                setMessages(prev => [...prev, { role: 'model', content: "Xin lỗi, tôi không thể trả lời lúc này." }]);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            const errorMsg = error.response?.data?.error || "Xin lỗi, Bác sĩ AI đang bận rộn. Vui lòng thử lại sau.";
            setMessages(prev => [...prev, { role: 'model', content: errorMsg }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-xl hover:shadow-slate-900/50 hover:scale-105 transition-all duration-300 z-50 group border border-slate-700"
            >
                <MessageSquare size={26} className="group-hover:animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-slate-500 border-2 border-slate-900"></span>
                </span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-[380px] h-[550px] bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden transform transition-all duration-300">
            {/* Header */}
            <div className="bg-slate-900 p-4 flex items-center justify-between text-white shrink-0 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                        <Bot size={22} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm leading-tight">Bác sĩ AI</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-slate-300">Đang trực tuyến</span>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-slate-300 hover:text-white"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto bg-[#F8F9FB] custom-scrollbar flex flex-col gap-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                            msg.role === 'user' 
                                ? 'bg-slate-900 text-white rounded-tr-sm' 
                                : 'bg-white text-slate-700 border border-slate-200 rounded-tl-sm'
                        }`}>
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2">
                            <span className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-white border-t border-slate-100 shrink-0">
                <div className="relative flex items-center bg-[#F1F5F9] rounded-xl border border-transparent focus-within:border-slate-900 focus-within:bg-white transition-all overflow-hidden shadow-inner">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Nhập câu hỏi của bạn..."
                        className="w-full bg-transparent text-sm text-slate-700 py-3 pl-4 pr-12 outline-none resize-none min-h-[44px] max-h-[120px]"
                        rows={1}
                        style={{ height: '44px' }}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 p-1.5 text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:text-slate-400 disabled:hover:bg-transparent"
                    >
                        <Send size={18} />
                    </button>
                </div>
                <div className="text-center mt-2">
                    <span className="text-[10px] text-slate-400 font-medium">Bác sĩ AI có thể cung cấp thông tin không chính xác.</span>
                </div>
            </div>
        </div>
    );
}
