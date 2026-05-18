import React from 'react';

const SEGMENTS = [
    { key: 'highRiskCount', label: 'Nguy cơ cao', color: '#f43f5e', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
    { key: 'mediumRiskCount', label: 'Nguy cơ trung bình', color: '#f59e0b', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
    { key: 'lowRiskCount', label: 'Nguy cơ thấp', color: '#10b981', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
];

function DonutChart({ data, total }) {
    const size = 120;
    const cx = size / 2;
    const cy = size / 2;
    const r = 44;
    const stroke = 18;
    const circumference = 2 * Math.PI * r;

    let offset = 0;
    const slices = SEGMENTS.map(seg => {
        const value = data[seg.key] || 0;
        const frac = total > 0 ? value / total : 0;
        const dash = frac * circumference;
        const slice = { ...seg, dash, offset, frac, value };
        offset += dash;
        return slice;
    });

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {total === 0 ? (
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
            ) : (
                slices.map((s, i) => (
                    <circle
                        key={i}
                        cx={cx} cy={cy} r={r}
                        fill="none"
                        stroke={s.color}
                        strokeWidth={stroke}
                        strokeDasharray={`${s.dash} ${circumference - s.dash}`}
                        strokeDashoffset={-s.offset}
                        transform={`rotate(-90 ${cx} ${cy})`}
                        style={{ transition: 'stroke-dasharray 0.6s ease' }}
                    />
                ))
            )}
            <text x={cx} y={cy - 6} textAnchor="middle" fontSize="22" fontWeight="900" fill="#1e293b">{total}</text>
            <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fontWeight="700" fill="#94a3b8">BỆNH NHÂN</text>
        </svg>
    );
}

export default function RiskDistributionChart({ stats }) {
    const total = stats?.totalPatients || 0;

    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-800 text-base mb-5">Phân bổ Mức độ Rủi ro</h3>
            <div className="flex items-center gap-6">
                <div className="flex-shrink-0">
                    <DonutChart data={stats || {}} total={total} />
                </div>
                <div className="flex-1 space-y-2.5">
                    {SEGMENTS.map(seg => {
                        const count = stats?.[seg.key] || 0;
                        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                        return (
                            <div key={seg.key} className={`flex items-center justify-between px-3 py-2 rounded-xl border ${seg.bg} ${seg.border}`}>
                                <span className={`text-xs font-bold ${seg.text}`}>{seg.label}</span>
                                <div className="flex items-center gap-2">
                                    <span className={`text-lg font-black ${seg.text}`}>{count}</span>
                                    <span className="text-[10px] font-bold text-slate-400">{pct}%</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
