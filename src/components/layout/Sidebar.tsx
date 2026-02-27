"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Activity, Home, User, Utensils, Stethoscope,
    Dumbbell, LineChart, Bell, ChevronRight
} from "lucide-react"

const navItems = [
    { name: "Overview", href: "/dashboard", icon: Home, color: "text-blue-500" },
    { name: "Health Profile", href: "/dashboard/profile", icon: User, color: "text-violet-500" },
    { name: "Diet Plan", href: "/dashboard/diet", icon: Utensils, color: "text-amber-500" },
    { name: "Symptoms", href: "/dashboard/symptoms", icon: Stethoscope, color: "text-rose-500" },
    { name: "Workout", href: "/dashboard/workout", icon: Dumbbell, color: "text-emerald-500" },
    { name: "Daily Tracker", href: "/dashboard/tracker", icon: LineChart, color: "text-cyan-500" },
    { name: "Alerts", href: "/dashboard/alerts", icon: Bell, color: "text-fuchsia-500" },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden md:flex flex-col w-[260px] bg-white border-r border-slate-100 h-screen sticky top-0 shrink-0">
            {/* Logo */}
            <div className="px-5 py-5 border-b border-slate-100">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-100 group-hover:scale-105 transition-transform">
                        <Activity className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div>
                        <span className="text-lg font-extrabold text-slate-900 leading-none block">VitalAI</span>
                        <span className="text-[10px] text-slate-400 font-medium tracking-wide">Health Dashboard</span>
                    </div>
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto scrollbar-hide px-3 py-4 space-y-0.5">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest px-3 mb-2">Navigation</p>
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                        >
                            <Icon className={`h-4.5 w-4.5 transition-colors ${isActive ? "text-blue-600" : item.color}`} />
                            <span className="flex-1">{item.name}</span>
                            {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400" />}
                        </Link>
                    )
                })}
            </nav>

            {/* Health score footer card */}
            <div className="p-4 border-t border-slate-100">
                <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-4">
                    <p className="text-xs font-semibold text-emerald-800 mb-1">Your Health Score</p>
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-2xl font-extrabold text-emerald-700">78</span>
                        <span className="text-xs text-emerald-600 mb-1">/ 100 · Good</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill bg-gradient-to-r from-emerald-400 to-teal-500" style={{ width: "78%" }} />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">Complete your profile to improve your score</p>
                </div>
            </div>
        </aside>
    )
}
