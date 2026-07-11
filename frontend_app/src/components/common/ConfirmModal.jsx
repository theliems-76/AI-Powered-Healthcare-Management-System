import React from 'react';
import { MdWarning, MdClose } from 'react-icons/md';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Xóa", cancelText = "Hủy" }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl shadow-xl overflow-hidden flex flex-col">
                <div className="flex justify-between items-center px-5 py-4 border-b border-outline-variant">
                    <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                        <MdWarning className="w-5 h-5 text-rose-500" />
                        {title || "Xác nhận xóa"}
                    </h3>
                    <button onClick={onClose} className="p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-lg transition-colors">
                        <MdClose className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-5">
                    <p className="text-sm font-semibold text-on-surface-variant leading-relaxed">
                        {message}
                    </p>
                </div>
                
                <div className="px-5 py-4 bg-surface-container/50 border-t border-outline-variant flex gap-3 justify-end">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 bg-surface hover:bg-surface-container-high text-on-surface text-sm font-bold rounded-xl border border-outline-variant transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button 
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold rounded-xl shadow-[0_4px_12px_rgba(225,29,72,0.2)] transition-all active:scale-95"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
