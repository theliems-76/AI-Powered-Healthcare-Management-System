import React, { useState } from 'react';
import { MdClose, MdDataObject, MdInfo, MdCloudUpload } from 'react-icons/md';

export default function JSONImportModal({ isOpen, onClose, onSubmit, title, instructions, exampleJSON }) {
    const [jsonText, setJsonText] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!jsonText.trim()) return;
        onSubmit(jsonText);
        setJsonText('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                        <MdDataObject className="w-5 h-5 text-primary" />
                        {title}
                    </h3>
                    <button onClick={onClose} className="p-2 text-outline hover:text-slate-600 hover:bg-surface-container-high rounded-xl transition-colors">
                        <MdClose className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 space-y-4">
                    <div className="bg-primary-container/20 border border-primary-container rounded-xl p-4 flex gap-3 text-sm text-primary">
                        <MdInfo className="w-5 h-5 text-primary shrink-0" />
                        <div>
                            <p className="font-bold mb-1">Hướng dẫn nhập nhanh bằng AI (ChatGPT/Gemini):</p>
                            <p className="mb-2 text-on-surface-variant">{instructions}</p>
                            <div className="bg-inverse-surface text-inverse-on-surface p-3 rounded-lg font-mono text-xs overflow-x-auto">
                                {exampleJSON}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-on-surface mb-2">Dán mã JSON vào đây:</label>
                        <textarea
                            value={jsonText}
                            onChange={(e) => setJsonText(e.target.value)}
                            placeholder="[{...}, {...}]"
                            className="w-full h-48 p-4 bg-surface-container border border-outline-variant rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                        ></textarea>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-outline-variant bg-surface-container flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={!jsonText.trim()}
                        className="flex items-center gap-2 px-5 py-2 bg-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-on-primary text-sm font-bold rounded-xl transition-colors shadow-[0_4px_12px_rgba(0,24,72,0.04)]"
                    >
                        <MdCloudUpload className="w-4 h-4" />
                        Tiến hành Import
                    </button>
                </div>
            </div>
        </div>
    );
}
