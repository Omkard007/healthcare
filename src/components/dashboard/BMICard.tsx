"use client"

import { getBMICategory } from "@/lib/calculations"

interface BMICardProps {
    bmi: number
    heightCm: number
    weightKg: number
}

const categoryConfig = {
    Underweight: { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", bar: "bg-blue-400", pct: 12 },
    Normal: { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", bar: "bg-emerald-400", pct: 40 },
    Overweight: { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", bar: "bg-amber-400", pct: 65 },
    Obese: { color: "text-red-600", bg: "bg-red-50", border: "border-red-200", bar: "bg-red-400", pct: 88 },
}

export function BMICard({ bmi, heightCm, weightKg }: BMICardProps) {
    const category = getBMICategory(bmi)
    const cfg = categoryConfig[category]

    return (
        <div className={`stat-card border ${cfg.border} ${cfg.bg}`}>
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">BMI</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.color} ${cfg.bg} border ${cfg.border}`}>
                    {category}
                </span>
            </div>
            <div className={`text-3xl font-extrabold ${cfg.color}`}>{bmi.toFixed(1)}</div>
            <p className="text-xs text-slate-400 mt-1">{heightCm} cm · {weightKg} kg</p>

            {/* BMI spectrum bar */}
            <div className="mt-4 bmi-track relative">
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-slate-700 shadow"
                    style={{ left: `calc(${cfg.pct}% - 6px)` }}
                />
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 mt-1.5">
                <span>Underweight</span><span>Normal</span><span>Over</span><span>Obese</span>
            </div>
        </div>
    )
}
