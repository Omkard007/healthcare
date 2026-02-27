"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Activity, Home, User, Utensils, Stethoscope, Dumbbell, LineChart, Bell } from "lucide-react"

const navItems = [
    { name: "Overview", href: "/dashboard", icon: Home, color: "text-blue-500" },
    { name: "Health Profile", href: "/dashboard/profile", icon: User, color: "text-violet-500" },
    { name: "Diet Plan", href: "/dashboard/diet", icon: Utensils, color: "text-amber-500" },
    { name: "Symptoms", href: "/dashboard/symptoms", icon: Stethoscope, color: "text-rose-500" },
    { name: "Workout", href: "/dashboard/workout", icon: Dumbbell, color: "text-emerald-500" },
    { name: "Daily Tracker", href: "/dashboard/tracker", icon: LineChart, color: "text-cyan-500" },
    { name: "Alerts", href: "/dashboard/alerts", icon: Bell, color: "text-fuchsia-500" },
]

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Open navigation"
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
                    <div className="relative w-72 bg-white h-full flex flex-col shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                                    <Activity className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-lg font-extrabold text-slate-900">VitalAI</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Nav items */}
                        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                                ? "bg-blue-50 text-blue-700"
                                                : "text-slate-700 hover:bg-slate-50"
                                            }`}
                                    >
                                        <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : item.color}`} />
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* Footer: user info */}
                        <div className="p-4 border-t border-slate-100">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                                    PS
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-700">Priya Sharma</p>
                                    <p className="text-xs text-slate-400">priya@example.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
