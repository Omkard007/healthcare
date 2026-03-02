"use client"

import { useState, useTransition } from "react"
import { Heart, Droplets, Moon, Footprints, Activity, Scale, CheckCircle2, PlusCircle, TrendingUp } from "lucide-react"
import { upsertTodayLog, DailyLogData } from "@/actions/tracker.actions"
import { useRouter } from "next/navigation"

const trackerFields = [
    { key: "weightKg", label: "Weight", unit: "kg", icon: Scale, color: "border-violet-200 bg-violet-50 focus:ring-violet-400", iconColor: "text-violet-500" },
    { key: "steps", label: "Steps", unit: "steps", icon: Footprints, color: "border-cyan-200 bg-cyan-50 focus:ring-cyan-400", iconColor: "text-cyan-500" },
    { key: "waterLiters", label: "Water", unit: "L", icon: Droplets, color: "border-blue-200 bg-blue-50 focus:ring-blue-400", iconColor: "text-blue-500" },
    { key: "sleepHours", label: "Sleep", unit: "hrs", icon: Moon, color: "border-indigo-200 bg-indigo-50 focus:ring-indigo-400", iconColor: "text-indigo-500" },
    { key: "systolic", label: "Systolic BP", unit: "mmHg", icon: Heart, color: "border-rose-200 bg-rose-50 focus:ring-rose-400", iconColor: "text-rose-500" },
    { key: "diastolic", label: "Diastolic BP", unit: "mmHg", icon: Activity, color: "border-pink-200 bg-pink-50 focus:ring-pink-400", iconColor: "text-pink-500" },
    { key: "glucoseMgDl", label: "Blood Glucose", unit: "mg/dL", icon: Activity, color: "border-amber-200 bg-amber-50 focus:ring-amber-400", iconColor: "text-amber-500" },
]

interface Props {
    weeklyLogs: DailyLogData[]
    todayLog: DailyLogData | null
}

export function TrackerClient({ weeklyLogs, todayLog }: Props) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [form, setForm] = useState<Record<string, string>>({
        weightKg: todayLog?.weightKg?.toString() ?? "",
        steps: todayLog?.steps?.toString() ?? "",
        waterLiters: todayLog?.waterLiters?.toString() ?? "",
        sleepHours: todayLog?.sleepHours?.toString() ?? "",
        systolic: todayLog?.systolic?.toString() ?? "",
        diastolic: todayLog?.diastolic?.toString() ?? "",
        glucoseMgDl: todayLog?.glucoseMgDl?.toString() ?? "",
    })

    const handleSave = () => {
        setError(null)
        startTransition(async () => {
            const result = await upsertTodayLog({
                weightKg: form.weightKg ? Number(form.weightKg) : undefined,
                steps: form.steps ? Number(form.steps) : undefined,
                waterLiters: form.waterLiters ? Number(form.waterLiters) : undefined,
                sleepHours: form.sleepHours ? Number(form.sleepHours) : undefined,
                systolic: form.systolic ? Number(form.systolic) : undefined,
                diastolic: form.diastolic ? Number(form.diastolic) : undefined,
                glucoseMgDl: form.glucoseMgDl ? Number(form.glucoseMgDl) : undefined,
            })
            if (result.success) {
                setSaved(true)
                setTimeout(() => { setSaved(false); router.refresh() }, 2000)
            } else {
                setError(result.error ?? "Something went wrong")
            }
        })
    }

    const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })

    // Stats from weekly logs
    const avg = (key: keyof DailyLogData) => {
        const vals = weeklyLogs.map(l => l[key] as number | null).filter((v): v is number => v !== null)
        return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length) : null
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800">Daily Health Tracker</h2>
                    <p className="text-slate-500 text-sm mt-0.5">Log today&apos;s vitals and track trends over time</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full font-medium">{today}</span>
                    {todayLog && <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full font-medium">✓ Logged today</span>}
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Log form */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-5 flex items-center gap-2">
                        <PlusCircle className="w-4 h-4 text-blue-500" /> Today&apos;s Log
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
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">{f.unit}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {error && <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>}

                    <button
                        onClick={handleSave}
                        disabled={isPending || saved}
                        className={`mt-6 w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${saved
                            ? "bg-emerald-500 text-white shadow-md shadow-emerald-100"
                            : isPending ? "bg-blue-400 text-white cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100"
                            }`}
                    >
                        {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved successfully!</> :
                            isPending ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</> :
                                "Save Today's Log"}
                    </button>
                </div>

                {/* Quick stats */}
                <div className="space-y-3">
                    {[
                        { label: "7-day Avg Weight", value: avg("weightKg") ? `${avg("weightKg")!.toFixed(1)} kg` : "—", icon: Scale, color: "bg-violet-50 border-violet-100", iconColor: "text-violet-500" },
                        { label: "Avg Daily Steps", value: avg("steps") ? Math.round(avg("steps")!).toLocaleString() : "—", icon: Footprints, color: "bg-cyan-50 border-cyan-100", iconColor: "text-cyan-500" },
                        { label: "Avg Sleep", value: avg("sleepHours") ? `${avg("sleepHours")!.toFixed(1)} hrs` : "—", icon: Moon, color: "bg-indigo-50 border-indigo-100", iconColor: "text-indigo-500" },
                        { label: "Avg Glucose", value: avg("glucoseMgDl") ? `${avg("glucoseMgDl")!.toFixed(1)} mg/dL` : "—", icon: Activity, color: "bg-amber-50 border-amber-100", iconColor: "text-amber-500" },
                    ].map(s => {
                        const Icon = s.icon
                        return (
                            <div key={s.label} className={`stat-card border ${s.color}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Icon className={`w-4 h-4 ${s.iconColor}`} />
                                        <span className="text-xs text-slate-500">{s.label}</span>
                                    </div>
                                </div>
                                <div className="text-lg font-extrabold text-slate-800 mt-1">{s.value}</div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Weekly history table */}
            {weeklyLogs.length > 0 && (
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
                                {weeklyLogs.map((row, i) => {
                                    const isToday = i === 0
                                    const dateStr = new Date(row.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                                    return (
                                        <tr key={row.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${isToday ? "font-semibold bg-blue-50/30" : ""}`}>
                                            <td className="px-4 py-3 text-slate-600 font-medium">
                                                {dateStr}
                                                {isToday && <span className="ml-2 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">Today</span>}
                                            </td>
                                            <td className="px-4 py-3 text-slate-700">{row.weightKg ? `${row.weightKg} kg` : "—"}</td>
                                            <td className="px-4 py-3 text-slate-700">{row.steps ? row.steps.toLocaleString() : "—"}</td>
                                            <td className="px-4 py-3 text-slate-700">{row.waterLiters ? `${row.waterLiters} L` : "—"}</td>
                                            <td className="px-4 py-3 text-slate-700">{row.sleepHours ? `${row.sleepHours} hrs` : "—"}</td>
                                            <td className="px-4 py-3 text-slate-700">{row.systolic && row.diastolic ? `${row.systolic}/${row.diastolic}` : "—"}</td>
                                            <td className="px-4 py-3 text-slate-700">{row.glucoseMgDl ? `${row.glucoseMgDl} mg/dL` : "—"}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {weeklyLogs.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
                    <TrendingUp className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">No history yet — save your first log above!</p>
                </div>
            )}
        </div>
    )
}
