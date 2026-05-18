import React from 'react';

export default function Logo({ className = "w-8 h-8" }) {
    return (
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            {/* Hình vuông bo viền (Squircle) phong cách hiện đại */}
            <rect width="48" height="48" rx="14" fill="#0f172a" />
            
            {/* Chữ C (Clinical) - Màu Cyan Y tế */}
            <path 
                d="M32 16 C 22 13, 14 18, 14 24 C 14 30, 22 35, 32 32" 
                stroke="#22d3ee" 
                strokeWidth="4" 
                strokeLinecap="round" 
            />
            
            {/* Chữ A (AI) - Màu trắng nổi bật */}
            <path 
                d="M18 34 L 28 14 L 38 34" 
                stroke="white" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
            {/* Nét gạch ngang của chữ A */}
            <path 
                d="M21 27 L 35 27" 
                stroke="white" 
                strokeWidth="4" 
                strokeLinecap="round" 
            />
            
            {/* Một điểm nhấn nhỏ (Sparkle/Node) để nhấn mạnh tính AI */}
            <circle cx="28" cy="14" r="3" fill="#22d3ee" />
        </svg>
    );
}
