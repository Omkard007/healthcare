"use client"

import { Flame } from "lucide-react"

interface CalorieCardProps {
    dailyCalories: number
    bmr: number
    goal: string
}

const goalLabel: Record<string, { label: string; color: string }> = {
    fat_loss: { label: "Fat Loss", color: "text-rose-600 bg-rose-50 border-rose-200" },
    muscle_gain: { label: "Muscle Gain", color: "text-violet-600 bg-violet-50 border-violet-200" },
    maintenance: { label: "Maintenance", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    diabetic_friendly: { label: "Diabetic Plan", color: "text-blue-600 bg-blue-50 border-blue-200" },
}

export function CalorieCard({ dailyCalories, bmr, goal }: CalorieCardProps) {
    const cfg = goalLabel[goal] ?? { label: goal, color: "text-slate-600 bg-slate-50 border-slate-200" }
    const consumed = Math.round(dailyCalories * 0.69)   // mock 69% consumed
    const pct = Math.round((consumed / dailyCalories) * 100)

    return (
        <div className="stat-card border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Calories</span>
                <Flame className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-3xl font-extrabold text-orange-600">{Math.round(dailyCalories).toLocaleString()}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">kcal target · BMR {Math.round(bmr)}</p>

            <div className="mt-3 progress-bar">
                <div className="progress-fill bg-gradient-to-r from-orange-400 to-amber-400" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>{consumed.toLocaleString()} consumed</span>
                <span>{pct}%</span>
            </div>

            <span className={`mt-3 inline-block text-[10px] font-semibold border px-2 py-0.5 rounded-full ${cfg.color}`}>
                {cfg.label}
            </span>
        </div>
    )
}
