import React from 'react';

export default function Logo({ className = "w-8 h-8" }) {
    return (
        <img src="/logo.png" alt="Hiệp Sĩ Tiểu Đường Logo" className={`${className} object-contain drop-shadow-lg`} />
    );
}
