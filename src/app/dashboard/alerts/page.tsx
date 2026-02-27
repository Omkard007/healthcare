"use client"

import { useState } from "react"
import { Bell, AlertCircle, CheckCircle, Info, X, Zap, Heart, Moon, Droplets, ChevronRight } from "lucide-react"

type AlertSeverity = "critical" | "warning" | "info" | "success"

interface Alert {
    id: number
    title: string
    message: string
    severity: AlertSeverity
    time: string
    read: boolean
    icon: React.ElementType
}

const severityConfig: Record<AlertSeverity, { bg: string; border: string; badge: string; dot: string; icon: string }> = {
    critical: { bg: "bg-red-50", border: "border-red-200", badge: "bg-red-100 text-red-700 border-red-200", dot: "bg-red-500", icon: "text-red-600" },
    warning: { bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-500", icon: "text-amber-600" },
    info: { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-700 border-blue-200", dot: "bg-blue-500", icon: "text-blue-600" },
    success: { bg: "bg-emerald-50", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500", icon: "text-emerald-600" },
}

const initialAlerts: Alert[] = [
    { id: 1, title: "BP slightly elevated", message: "Your systolic pressure hit 128 mmHg yesterday. That's above your baseline. Monitor closely and consider reducing salt intake.", severity: "warning", time: "2 hrs ago", read: false, icon: Heart },
    { id: 2, title: "Sleep deficit detected", message: "You've averaged only 6.1 hrs/night this week vs your 7.5 hr target. Sleep affects immunity and mood. Aim to sleep by 10:30 PM tonight.", severity: "warning", time: "8 hrs ago", read: false, icon: Moon },
    { id: 3, title: "Hydration below target", message: "You've only logged 1.4 L of water today. Your target is 2.5 L. Dehydration can worsen headaches and reduce focus.", severity: "info", time: "Yesterday", read: false, icon: Droplets },
    { id: 4, title: "7-day streak achieved! 🔥", message: "Congratulations! You've logged your health data 7 days in a row. Consistency is the key to long-term health improvement.", severity: "success", time: "2 days ago", read: true, icon: Zap },
    { id: 5, title: "Profile 70% complete", message: "You haven't filled allergies and medical conditions. Complete your profile to unlock personalized diet and workout plans.", severity: "info", time: "3 days ago", read: true, icon: Info },
]

const Icon4Severity: Record<AlertSeverity, React.ElementType> = {
    critical: AlertCircle,
    warning: AlertCircle,
    info: Info,
    success: CheckCircle,
}

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)
    const [filter, setFilter] = useState<"all" | AlertSeverity>("all")

    const unread = alerts.filter(a => !a.read).length
    const markAll = () => setAlerts(prev => prev.map(a => ({ ...a, read: true })))
    const dismiss = (id: number) => setAlerts(prev => prev.filter(a => a.id !== id))
    const markRead = (id: number) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a))

    const filtered = filter === "all" ? alerts : alerts.filter(a => a.severity === filter)

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800">Smart Alerts</h2>
                    <p className="text-slate-500 text-sm mt-0.5">
                        {unread > 0 ? <><span className="text-red-600 font-semibold">{unread} unread</span> alerts need attention</> : "All alerts reviewed — you're up to date!"}
                    </p>
                </div>
                {unread > 0 && (
                    <button onClick={markAll} className="text-sm text-blue-600 hover:underline font-medium flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Mark all as read
                    </button>
                )}
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: "Total Alerts", value: alerts.length, color: "text-slate-700 bg-slate-50 border-slate-200" },
                    { label: "Critical", value: alerts.filter(a => a.severity === "critical").length, color: "text-red-700 bg-red-50 border-red-200" },
                    { label: "Warnings", value: alerts.filter(a => a.severity === "warning").length, color: "text-amber-700 bg-amber-50 border-amber-200" },
                    { label: "Unread", value: unread, color: "text-blue-700 bg-blue-50 border-blue-200" },
                ].map(s => (
                    <div key={s.label} className={`rounded-xl border p-4 text-center ${s.color}`}>
                        <div className="text-2xl font-extrabold">{s.value}</div>
                        <div className="text-xs mt-0.5">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap">
                {(["all", "critical", "warning", "info", "success"] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize ${filter === f ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Alert list */}
            <div className="space-y-3">
                {filtered.length === 0 && (
                    <div className="text-center py-16 text-slate-400">
                        <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No alerts in this category</p>
                    </div>
                )}

                {filtered.map(alert => {
                    const cfg = severityConfig[alert.severity]
                    const SeverityIcon = Icon4Severity[alert.severity]
                    const AlertIcon = alert.icon
                    return (
                        <div
                            key={alert.id}
                            className={`relative rounded-2xl border p-4 transition-all ${cfg.bg} ${cfg.border} ${!alert.read ? "shadow-sm" : "opacity-75"}`}
                            onClick={() => markRead(alert.id)}
                        >
                            {!alert.read && (
                                <span className={`absolute top-4 right-10 w-2 h-2 rounded-full ${cfg.dot}`} />
                            )}
                            <button
                                onClick={e => { e.stopPropagation(); dismiss(alert.id) }}
                                className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:bg-white hover:text-slate-700 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="flex items-start gap-3 pr-8">
                                <div className={`w-9 h-9 rounded-xl bg-white/70 border ${cfg.border} flex items-center justify-center shrink-0`}>
                                    <SeverityIcon className={`w-4.5 h-4.5 ${cfg.icon}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start gap-2 flex-wrap">
                                        <span className="font-bold text-slate-800 text-sm">{alert.title}</span>
                                        <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full capitalize ${cfg.badge}`}>
                                            {alert.severity}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{alert.message}</p>
                                    <p className="text-[10px] text-slate-400 mt-2">{alert.time}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* v2 banner */}
            <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-blue-300" />
                    </div>
                    <div>
                        <p className="font-bold">AI-Powered Predictive Alerts — Coming in Version 2</p>
                        <p className="text-slate-400 text-sm">Alerts generated from AI analysis of your long-term health trends and lab values.</p>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
            </div>
        </div>
    )
}
