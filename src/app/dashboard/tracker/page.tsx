"use client"

import { useState } from "react"
import { Heart, Droplets, Moon, Footprints, Activity, Scale, CheckCircle2, PlusCircle, TrendingUp } from "lucide-react"

const todayData = {
    weightKg: "61.2",
    steps: "7432",
    waterLiters: "1.8",
    sleepHours: "7.2",
    systolic: "118",
    diastolic: "78",
    glucoseMgDl: "95",
}

const weeklyLog = [
    { date: "Feb 19", weight: 61.8, steps: 8200, water: 2.1, sleep: 6.5, bp: "120/80", glucose: 98 },
    { date: "Feb 20", weight: 61.6, steps: 6800, water: 1.9, sleep: 7.0, bp: "118/76", glucose: 94 },
    { date: "Feb 21", weight: 61.5, steps: 9100, water: 2.3, sleep: 7.5, bp: "116/74", glucose: 92 },
    { date: "Feb 22", weight: 61.4, steps: 7500, water: 2.0, sleep: 6.8, bp: "119/77", glucose: 96 },
    { date: "Feb 23", weight: 61.4, steps: 5200, water: 1.6, sleep: 5.9, bp: "122/80", glucose: 100 },
    { date: "Feb 24", weight: 61.3, steps: 8900, water: 2.4, sleep: 7.2, bp: "117/75", glucose: 93 },
    { date: "Feb 25", weight: 61.2, steps: 7432, water: 1.8, sleep: 7.2, bp: "118/78", glucose: 95 },
]

const trackerFields = [
    { key: "weightKg", label: "Weight", unit: "kg", icon: Scale, color: "border-violet-200 bg-violet-50 focus:ring-violet-400", iconColor: "text-violet-500" },
    { key: "steps", label: "Steps", unit: "steps", icon: Footprints, color: "border-cyan-200 bg-cyan-50 focus:ring-cyan-400", iconColor: "text-cyan-500" },
    { key: "waterLiters", label: "Water", unit: "L", icon: Droplets, color: "border-blue-200 bg-blue-50 focus:ring-blue-400", iconColor: "text-blue-500" },
    { key: "sleepHours", label: "Sleep", unit: "hrs", icon: Moon, color: "border-indigo-200 bg-indigo-50 focus:ring-indigo-400", iconColor: "text-indigo-500" },
    { key: "systolic", label: "Systolic BP", unit: "mmHg", icon: Heart, color: "border-rose-200 bg-rose-50 focus:ring-rose-400", iconColor: "text-rose-500" },
    { key: "diastolic", label: "Diastolic BP", unit: "mmHg", icon: Activity, color: "border-pink-200 bg-pink-50 focus:ring-pink-400", iconColor: "text-pink-500" },
    { key: "glucoseMgDl", label: "Blood Glucose", unit: "mg/dL", icon: Activity, color: "border-amber-200 bg-amber-50 focus:ring-amber-400", iconColor: "text-amber-500" },
]

export default function TrackerPage() {
    const [form, setForm] = useState<Record<string, string>>(todayData)
    const [saved, setSaved] = useState(false)

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800">Daily Health Tracker</h2>
                    <p className="text-slate-500 text-sm mt-0.5">Log today's vitals and track trends over time</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full font-medium">
                        Feb 25, 2026
                    </span>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Log form */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-5 flex items-center gap-2">
                        <PlusCircle className="w-4 h-4 text-blue-500" /> Today's Log
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {trackerFields.map(f => {
                            const Icon = f.icon
                            return (
                                <div key={f.key}>
                                    <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mb-1.5">
                                        <Icon className={`w-3.5 h-3.5 ${f.iconColor}`} /> {f.label}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={form[f.key] ?? ""}
                                            onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                                            className={`w-full px-4 py-2.5 pr-14 rounded-xl border ${f.color} text-sm font-medium text-slate-800 outline-none focus:ring-2 transition-all`}
                                            placeholder="0"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                                            {f.unit}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <button
                        onClick={handleSave}
                        className={`mt-6 w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${saved
                                ? "bg-emerald-500 text-white shadow-md shadow-emerald-100"
                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100"
                            }`}
                    >
                        {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved successfully!</> : "Save Today's Log"}
                    </button>
                </div>

                {/* Quick stats */}
                <div className="space-y-3">
                    {[
                        { label: "7-day Avg Weight", value: "61.5 kg", icon: Scale, color: "bg-violet-50 border-violet-100", iconColor: "text-violet-500", trend: "↓ 0.3 kg", trendColor: "text-emerald-600" },
                        { label: "Avg Daily Steps", value: "7,871", icon: Footprints, color: "bg-cyan-50 border-cyan-100", iconColor: "text-cyan-500", trend: "↑ 12%", trendColor: "text-emerald-600" },
                        { label: "Avg Sleep", value: "6.9 hrs", icon: Moon, color: "bg-indigo-50 border-indigo-100", iconColor: "text-indigo-500", trend: "↓ 0.3", trendColor: "text-amber-600" },
                        { label: "Avg Glucose", value: "95.4 mg/dL", icon: Activity, color: "bg-amber-50 border-amber-100", iconColor: "text-amber-500", trend: "Stable", trendColor: "text-emerald-600" },
                    ].map(s => {
                        const Icon = s.icon
                        return (
                            <div key={s.label} className={`stat-card border ${s.color}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Icon className={`w-4 h-4 ${s.iconColor}`} />
                                        <span className="text-xs text-slate-500">{s.label}</span>
                                    </div>
                                    <span className={`text-xs font-bold ${s.trendColor}`}>{s.trend}</span>
                                </div>
                                <div className="text-lg font-extrabold text-slate-800 mt-1">{s.value}</div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Weekly history table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-slate-400" /> 7-Day History
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                {["Date", "Weight", "Steps", "Water", "Sleep", "BP", "Glucose"].map(h => (
                                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {weeklyLog.map((row, i) => (
                                <tr key={row.date} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${i === weeklyLog.length - 1 ? "font-semibold bg-blue-50/30" : ""}`}>
                                    <td className="px-4 py-3 text-slate-600 font-medium">{row.date}{i === weeklyLog.length - 1 && <span className="ml-2 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">Today</span>}</td>
                                    <td className="px-4 py-3 text-slate-700">{row.weight} kg</td>
                                    <td className="px-4 py-3 text-slate-700">{row.steps.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-slate-700">{row.water} L</td>
                                    <td className="px-4 py-3 text-slate-700">{row.sleep} hrs</td>
                                    <td className="px-4 py-3 text-slate-700">{row.bp}</td>
                                    <td className="px-4 py-3 text-slate-700">{row.glucose} mg/dL</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
