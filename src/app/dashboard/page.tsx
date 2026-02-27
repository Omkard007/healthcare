"use client"

import Link from "next/link"
import {
    Activity, Heart, Droplets, Moon, Footprints, Flame,
    TrendingUp, TrendingDown, ChevronRight, Clock, Target,
    AlertCircle, CheckCircle2, Zap, Calendar, ArrowUp, ArrowDown
} from "lucide-react"
import { ProfileCompletionBanner } from "@/components/dashboard/ProfileCompletionBanner"
import { BMICard } from "@/components/dashboard/BMICard"
import { CalorieCard } from "@/components/dashboard/CalorieCard"

const vitals = [
    { label: "Heart Rate", value: "72", unit: "bpm", icon: Heart, color: "bg-rose-50", iconColor: "text-rose-500", trend: +2, good: true },
    { label: "Blood Pressure", value: "118/78", unit: "mmHg", icon: Activity, color: "bg-blue-50", iconColor: "text-blue-500", trend: -3, good: true },
    { label: "Blood Glucose", value: "95", unit: "mg/dL", icon: Zap, color: "bg-amber-50", iconColor: "text-amber-500", trend: +5, good: true },
    { label: "Sleep", value: "7.2", unit: "hrs", icon: Moon, color: "bg-violet-50", iconColor: "text-violet-500", trend: -0.5, good: false },
]

const dailyGoals = [
    { label: "Calories", current: 1250, target: 1800, unit: "kcal", color: "bg-blue-500", icon: Flame, pct: 69 },
    { label: "Water", current: 1.8, target: 2.5, unit: "L", color: "bg-cyan-500", icon: Droplets, pct: 72 },
    { label: "Steps", current: 7432, target: 10000, unit: "", color: "bg-violet-500", icon: Footprints, pct: 74 },
    { label: "Calories Burned", current: 420, target: 600, unit: "kcal", color: "bg-rose-500", icon: Flame, pct: 70 },
]

const recentActivity = [
    { title: "Morning Yoga", time: "7:00 AM", duration: "30 min", cal: 120, type: "workout" },
    { title: "Breakfast logged", time: "8:30 AM", duration: "Oats + milk", cal: 320, type: "diet" },
    { title: "Vitals recorded", time: "9:00 AM", duration: "HR 72 · BP 118/78", cal: 0, type: "vitals" },
    { title: "Lunch logged", time: "1:00 PM", duration: "Dal rice + salad", cal: 480, type: "diet" },
]

const weeklyData = [
    { day: "Mon", pct: 85 },
    { day: "Tue", pct: 70 },
    { day: "Wed", pct: 92 },
    { day: "Thu", pct: 60 },
    { day: "Fri", pct: 78 },
    { day: "Sat", pct: 55 },
    { day: "Sun", pct: 88 },
]

const SHOW_BANNER = false   // switch to true to test the banner

export default function DashboardPage() {
    const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })

    return (
        <div className="space-y-6 animate-fade-in-up">

            {/* Greeting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" /> {today}
                    </p>
                    <h2 className="text-2xl font-extrabold text-slate-800 mt-0.5">
                        Good morning, Priya 👋
                    </h2>
                    <p className="text-slate-500 text-sm mt-0.5">Your health score is <span className="text-emerald-600 font-semibold">78 / 100</span> — Keep it up!</p>
                </div>
                <Link
                    href="/dashboard/tracker"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-100 transition-all hover:scale-105"
                >
                    <TrendingUp className="w-4 h-4" /> Log Today's Vitals
                </Link>
            </div>

            {/* If no profile: show banner */}
            {SHOW_BANNER && <ProfileCompletionBanner />}

            {/* BMI + Calories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
                <BMICard bmi={22.4} heightCm={165} weightKg={61} />
                <CalorieCard dailyCalories={1800} bmr={1450} goal="maintenance" />

                {/* Quick health card 1 */}
                <div className="stat-card border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Health Goal</span>
                        <Target className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-2xl font-extrabold text-emerald-700">Maintenance</div>
                    <p className="text-xs text-slate-500 mt-1">Calorie target: 1,800 kcal/day</p>
                    <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> On track today
                    </div>
                </div>

                {/* Quick health card 2 */}
                <div className="stat-card border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-violet-700 uppercase tracking-wide">Streak</span>
                        <Zap className="w-4 h-4 text-violet-500" />
                    </div>
                    <div className="text-2xl font-extrabold text-violet-700">14 days</div>
                    <p className="text-xs text-slate-500 mt-1">Consecutive logging streak</p>
                    <div className="mt-3 flex gap-1">
                        {[...Array(7)].map((_, i) => (
                            <div key={i} className={`flex-1 h-2 rounded-sm ${i < 6 ? "bg-violet-400" : "bg-violet-200"}`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Vitals grid */}
            <div>
                <h3 className="text-base font-bold text-slate-700 mb-3">Today's Vitals</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {vitals.map(v => {
                        const Icon = v.icon
                        const up = v.trend > 0
                        return (
                            <div key={v.label} className="stat-card">
                                <div className={`w-9 h-9 rounded-xl ${v.color} flex items-center justify-center mb-3`}>
                                    <Icon className={`w-4.5 h-4.5 ${v.iconColor}`} />
                                </div>
                                <div className="text-2xl font-extrabold text-slate-800">{v.value}</div>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs text-slate-400">{v.label}</span>
                                    <span className={`flex items-center text-xs font-medium ${v.good ? "text-emerald-600" : "text-amber-600"}`}>
                                        {up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                        {Math.abs(v.trend)}
                                    </span>
                                </div>
                                <div className="text-[10px] text-slate-400 mt-0.5">{v.unit}</div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Daily progress + activity feed */}
            <div className="grid lg:grid-cols-3 gap-6">

                {/* Daily Goals */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-base font-bold text-slate-700">Daily Progress</h3>
                        <Link href="/dashboard/tracker" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                            View details <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-5">
                        {dailyGoals.map(g => {
                            const Icon = g.icon
                            return (
                                <div key={g.label}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <Icon className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm font-medium text-slate-700">{g.label}</span>
                                        </div>
                                        <span className="text-sm font-semibold text-slate-800">
                                            {typeof g.current === "number" && g.current > 999
                                                ? g.current.toLocaleString() : g.current}
                                            {g.unit && ` ${g.unit}`}
                                            <span className="text-slate-400 font-normal">
                                                {" "}/ {typeof g.target === "number" && g.target > 999
                                                    ? g.target.toLocaleString() : g.target}{g.unit && ` ${g.unit}`}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className={`progress-fill ${g.color}`} style={{ width: `${g.pct}%` }} />
                                    </div>
                                    <div className="text-[10px] text-slate-400 mt-1 text-right">{g.pct}% of goal</div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Weekly overview mini-chart */}
                    <div className="mt-6 border-t border-slate-100 pt-5">
                        <p className="text-xs text-slate-500 font-medium mb-3">Weekly Activity Score</p>
                        <div className="flex items-end gap-1.5 h-16">
                            {weeklyData.map(d => (
                                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                                    <div
                                        className={`w-full rounded-t-md transition-all duration-500 ${d.pct >= 80 ? "bg-emerald-400" : d.pct >= 60 ? "bg-blue-400" : "bg-slate-200"}`}
                                        style={{ height: `${d.pct * 0.56}px` }}
                                    />
                                    <span className="text-[9px] text-slate-400">{d.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-base font-bold text-slate-700">Today's Activity</h3>
                        <Clock className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="space-y-0">
                        {recentActivity.map((a, i) => (
                            <div key={i} className="flex gap-3 relative pb-4">
                                {/* Timeline line */}
                                {i < recentActivity.length - 1 && (
                                    <div className="absolute left-3.5 top-7 bottom-0 w-px bg-slate-100" />
                                )}
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${a.type === "workout" ? "bg-violet-100" :
                                        a.type === "diet" ? "bg-amber-100" :
                                            "bg-blue-100"
                                    }`}>
                                    {a.type === "workout" ? <TrendingUp className="w-3.5 h-3.5 text-violet-600" /> :
                                        a.type === "diet" ? <Flame className="w-3.5 h-3.5 text-amber-600" /> :
                                            <Activity className="w-3.5 h-3.5 text-blue-600" />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-700">{a.title}</p>
                                    <p className="text-xs text-slate-400">{a.time} · {a.duration}</p>
                                    {a.cal > 0 && (
                                        <span className="inline-block text-[10px] font-medium text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded mt-1">
                                            {a.cal} kcal
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link href="/dashboard/tracker" className="mt-2 flex items-center justify-center gap-1 text-xs text-blue-600 font-medium border border-blue-100 rounded-lg py-2 hover:bg-blue-50 transition-colors">
                        View full log <ChevronRight className="w-3 h-3" />
                    </Link>
                </div>
            </div>

            {/* Alerts strip */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                        <p className="text-sm font-semibold text-amber-800">Daily sleep below target</p>
                        <p className="text-xs text-amber-700">You averaged 6.1 hrs this week — aim for 7–9 hrs.</p>
                    </div>
                </div>
                <Link href="/dashboard/tracker" className="shrink-0 text-xs font-semibold text-amber-700 bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors">
                    Log Sleep
                </Link>
            </div>
        </div>
    )
}
