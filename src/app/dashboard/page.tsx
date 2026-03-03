import Link from "next/link"
import {
    Activity, Droplets, Moon, Footprints, Flame,
    TrendingUp, ChevronRight, Clock, Target,
    AlertCircle, CheckCircle2, Zap, Calendar, ArrowUp, ArrowDown
} from "lucide-react"
import { ProfileCompletionBanner } from "@/components/dashboard/ProfileCompletionBanner"
import { BMICard } from "@/components/dashboard/BMICard"
import { CalorieCard } from "@/components/dashboard/CalorieCard"
import { getHealthProfile } from "@/actions/profile.actions"
import { getWeeklyLogs } from "@/actions/tracker.actions"
import { getAlerts } from "@/actions/alerts.actions"
import { currentUser } from "@clerk/nextjs/server"

const weeklyData = [
    { day: "Mon", pct: 85 },
    { day: "Tue", pct: 70 },
    { day: "Wed", pct: 92 },
    { day: "Thu", pct: 60 },
    { day: "Fri", pct: 78 },
    { day: "Sat", pct: 55 },
    { day: "Sun", pct: 88 },
]

function getGreeting(): string {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
}

export default async function DashboardPage() {
    const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })

    const [profileResult, trackerResult, alertsResult, user] = await Promise.all([
        getHealthProfile(),
        getWeeklyLogs(),
        getAlerts(),
        currentUser(),
    ])

    const profile = profileResult.data ?? null
    const todayLog = trackerResult.todayLog ?? null
    const unreadAlerts = (alertsResult.data ?? []).filter(a => !a.read)

    const hasProfile = !!profile
    const firstName = user?.firstName ?? "there"
    const greeting = getGreeting()

    const vitals = [
        {
            label: "Blood Pressure",
            value: todayLog?.systolic && todayLog?.diastolic ? `${todayLog.systolic}/${todayLog.diastolic}` : "—",
            unit: "mmHg",
            icon: Activity,
            color: "bg-blue-50",
            iconColor: "text-blue-500",
            trend: todayLog?.systolic ? (todayLog.systolic > 120 ? +1 : -2) : 0,
            good: todayLog?.systolic ? todayLog.systolic <= 120 : true,
        },
        {
            label: "Blood Glucose",
            value: todayLog?.glucoseMgDl?.toString() ?? "—",
            unit: "mg/dL",
            icon: Zap,
            color: "bg-amber-50",
            iconColor: "text-amber-500",
            trend: todayLog?.glucoseMgDl ? (todayLog.glucoseMgDl > 100 ? +5 : -2) : 0,
            good: todayLog?.glucoseMgDl ? todayLog.glucoseMgDl <= 100 : true,
        },
        {
            label: "Sleep",
            value: todayLog?.sleepHours?.toString() ?? "—",
            unit: "hrs",
            icon: Moon,
            color: "bg-violet-50",
            iconColor: "text-violet-500",
            trend: todayLog?.sleepHours ? (todayLog.sleepHours >= 7 ? +0.5 : -0.5) : 0,
            good: todayLog?.sleepHours ? todayLog.sleepHours >= 7 : true,
        },
        {
            label: "Steps",
            value: todayLog?.steps?.toLocaleString() ?? "—",
            unit: "steps",
            icon: Footprints,
            color: "bg-emerald-50",
            iconColor: "text-emerald-500",
            trend: todayLog?.steps ? (todayLog.steps >= 8000 ? +500 : -500) : 0,
            good: todayLog?.steps ? todayLog.steps >= 8000 : true,
        },
    ]

    const dailyGoals = [
        {
            label: "Water",
            current: todayLog?.waterLiters ?? 0,
            target: 2.5,
            unit: "L",
            color: "bg-cyan-500",
            icon: Droplets,
            pct: todayLog?.waterLiters ? Math.min(100, Math.round((todayLog.waterLiters / 2.5) * 100)) : 0,
        },
        {
            label: "Steps",
            current: todayLog?.steps ?? 0,
            target: 10000,
            unit: "",
            color: "bg-violet-500",
            icon: Footprints,
            pct: todayLog?.steps ? Math.min(100, Math.round((todayLog.steps / 10000) * 100)) : 0,
        },
        {
            label: "Sleep",
            current: todayLog?.sleepHours ?? 0,
            target: profile?.sleepHours ?? 8,
            unit: "hrs",
            color: "bg-indigo-500",
            icon: Moon,
            pct: todayLog?.sleepHours && profile?.sleepHours
                ? Math.min(100, Math.round((todayLog.sleepHours / profile.sleepHours) * 100))
                : 0,
        },
        {
            label: "Calories Target",
            current: 0,
            target: profile ? Math.round(profile.dailyCalories) : 2000,
            unit: "kcal",
            color: "bg-rose-500",
            icon: Flame,
            pct: 0,
        },
    ]

    return (
        <div className="space-y-6 animate-fade-in-up">

            {/* Greeting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" /> {today}
                    </p>
                    <h2 className="text-2xl font-extrabold text-slate-800 mt-0.5">
                        {greeting}, {firstName} 👋
                    </h2>
                    <p className="text-slate-500 text-sm mt-0.5">
                        {hasProfile
                            ? <>Your BMI is <span className="text-emerald-600 font-semibold">{profile.bmi.toFixed(1)}</span> — keep logging your vitals!</>
                            : <>Complete your profile to unlock personalized health insights.</>}
                    </p>
                </div>
                <Link
                    href="/dashboard/tracker"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-100 transition-all hover:scale-105"
                >
                    <TrendingUp className="w-4 h-4" /> Log Today&apos;s Vitals
                </Link>
            </div>

            {/* Profile completion banner */}
            {!hasProfile && <ProfileCompletionBanner />}

            {/* BMI + Calories + Goal + Alerts */}
            {hasProfile && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
                    <BMICard bmi={profile.bmi} heightCm={profile.heightCm} weightKg={profile.weightKg} />
                    <CalorieCard dailyCalories={profile.dailyCalories} bmr={profile.bmr} goal={profile.fitnessGoal} />

                    {/* Health Goal card */}
                    <div className="stat-card border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Health Goal</span>
                            <Target className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="text-2xl font-extrabold text-emerald-700 capitalize">
                            {profile.fitnessGoal.replace(/_/g, " ")}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Calorie target: {Math.round(profile.dailyCalories).toLocaleString()} kcal/day
                        </p>
                        <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Profile complete
                        </div>
                    </div>

                    {/* Alerts card */}
                    <div className="stat-card border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-violet-700 uppercase tracking-wide">Alerts</span>
                            <Zap className="w-4 h-4 text-violet-500" />
                        </div>
                        <div className="text-2xl font-extrabold text-violet-700">{unreadAlerts.length}</div>
                        <p className="text-xs text-slate-500 mt-1">Unread health alerts</p>
                        <Link href="/dashboard/alerts" className="mt-3 flex items-center gap-1 text-xs text-violet-600 font-medium hover:underline">
                            View all <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>
            )}

            {/* Vitals grid */}
            <div>
                <h3 className="text-base font-bold text-slate-700 mb-3">Today&apos;s Vitals</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {vitals.map(v => {
                        const Icon = v.icon
                        const up = v.trend > 0
                        return (
                            <div key={v.label} className="stat-card">
                                <div className={`w-9 h-9 rounded-xl ${v.color} flex items-center justify-center mb-3`}>
                                    <Icon className={`w-4 h-4 ${v.iconColor}`} />
                                </div>
                                <div className="text-2xl font-extrabold text-slate-800">{v.value}</div>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs text-slate-400">{v.label}</span>
                                    {v.trend !== 0 && (
                                        <span className={`flex items-center text-xs font-medium ${v.good ? "text-emerald-600" : "text-amber-600"}`}>
                                            {up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                            {Math.abs(v.trend)}
                                        </span>
                                    )}
                                </div>
                                <div className="text-[10px] text-slate-400 mt-0.5">{v.unit}</div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Daily progress + Alerts feed */}
            <div className="grid lg:grid-cols-3 gap-6">

                {/* Daily progress */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-base font-bold text-slate-700">Daily Progress</h3>
                        <Link href="/dashboard/tracker" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                            Log vitals <ChevronRight className="w-3 h-3" />
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
                                                ? g.current.toLocaleString()
                                                : g.current}
                                            {g.unit && ` ${g.unit}`}
                                            <span className="text-slate-400 font-normal">
                                                {" "}/ {typeof g.target === "number" && g.target > 999
                                                    ? g.target.toLocaleString()
                                                    : g.target}
                                                {g.unit && ` ${g.unit}`}
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

                    {/* Weekly activity mini-chart */}
                    <div className="mt-6 border-t border-slate-100 pt-5">
                        <p className="text-xs text-slate-500 font-medium mb-3">Weekly Activity Score</p>
                        <div className="flex items-end gap-1.5 h-16">
                            {weeklyData.map(d => (
                                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                                    <div
                                        className={`w-full rounded-t-md transition-all duration-500 ${
                                            d.pct >= 80 ? "bg-emerald-400" : d.pct >= 60 ? "bg-blue-400" : "bg-slate-200"
                                        }`}
                                        style={{ height: `${d.pct * 0.56}px` }}
                                    />
                                    <span className="text-[9px] text-slate-400">{d.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Unread Alerts feed */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-base font-bold text-slate-700">Unread Alerts</h3>
                        <Clock className="w-4 h-4 text-slate-400" />
                    </div>
                    {unreadAlerts.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-300" />
                            <p className="text-xs">All clear — no unread alerts!</p>
                        </div>
                    ) : (
                        <div className="space-y-0">
                            {unreadAlerts.slice(0, 4).map((alert, i) => (
                                <div key={alert.id} className="flex gap-3 relative pb-4">
                                    {i < Math.min(unreadAlerts.length, 4) - 1 && (
                                        <div className="absolute left-3.5 top-7 bottom-0 w-px bg-slate-100" />
                                    )}
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                                        alert.severity === "warning"
                                            ? "bg-amber-100"
                                            : alert.severity === "critical"
                                                ? "bg-red-100"
                                                : "bg-blue-100"
                                    }`}>
                                        <AlertCircle className={`w-3.5 h-3.5 ${
                                            alert.severity === "warning"
                                                ? "text-amber-600"
                                                : alert.severity === "critical"
                                                    ? "text-red-600"
                                                    : "text-blue-600"
                                        }`} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-slate-700">{alert.type}</p>
                                        <p className="text-xs text-slate-400 line-clamp-2">{alert.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <Link
                        href="/dashboard/alerts"
                        className="mt-2 flex items-center justify-center gap-1 text-xs text-blue-600 font-medium border border-blue-100 rounded-lg py-2 hover:bg-blue-50 transition-colors"
                    >
                        View all alerts <ChevronRight className="w-3 h-3" />
                    </Link>
                </div>
            </div>

            {/* Critical/warning alert strip */}
            {unreadAlerts.some(a => a.severity === "warning" || a.severity === "critical") && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-amber-800">{unreadAlerts[0]?.type}</p>
                            <p className="text-xs text-amber-700">{unreadAlerts[0]?.message}</p>
                        </div>
                    </div>
                    <Link
                        href="/dashboard/alerts"
                        className="shrink-0 text-xs font-semibold text-amber-700 bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors"
                    >
                        View Alerts
                    </Link>
                </div>
            )}
        </div>
    )
}