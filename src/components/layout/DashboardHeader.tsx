"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Bell, Search, ChevronDown, LogOut, Settings, User,
    Home, Utensils, Stethoscope, Dumbbell, LineChart
} from "lucide-react"

const navItems = [
    { name: "Overview", href: "/dashboard", icon: Home },
    { name: "Health Profile", href: "/dashboard/profile", icon: User },
    { name: "Diet Plan", href: "/dashboard/diet", icon: Utensils },
    { name: "Symptoms", href: "/dashboard/symptoms", icon: Stethoscope },
    { name: "Workout", href: "/dashboard/workout", icon: Dumbbell },
    { name: "Daily Tracker", href: "/dashboard/tracker", icon: LineChart },
]

const mockUser = {
    name: "Priya Sharma",
    email: "priya@example.com",
    initials: "PS",
}

export function DashboardHeader() {
    const pathname = usePathname()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showNotif, setShowNotif] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    const pageTitle = navItems.find(n => n.href === pathname)?.name ?? "Dashboard"

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShowUserMenu(false)
                setShowNotif(false)
            }
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    return (
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6 gap-6 sticky top-0 z-30">
            {/* Page title */}
            <div className="flex-1">
                <h1 className="text-lg font-bold text-slate-800 hidden md:block">{pageTitle}</h1>
            </div>

            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-400 w-52 cursor-pointer hover:border-slate-300 transition-colors">
                <Search className="w-4 h-4" />
                <span>Search anything...</span>
            </div>

            <div className="flex items-center gap-2" ref={menuRef}>
                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => { setShowNotif(!showNotif); setShowUserMenu(false) }}
                        className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                    </button>
                    {showNotif && (
                        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-2">Notifications</p>
                            {[
                                { title: "Profile incomplete", desc: "Complete your health profile to get started.", dot: "bg-blue-500" },
                                { title: "Daily log reminder", desc: "You haven't logged your vitals today.", dot: "bg-amber-500" },
                            ].map(n => (
                                <div key={n.title} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer">
                                    <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.dot}`} />
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">{n.title}</p>
                                        <p className="text-xs text-slate-400">{n.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* User menu */}
                <div className="relative">
                    <button
                        onClick={() => { setShowUserMenu(!showUserMenu); setShowNotif(false) }}
                        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                            {mockUser.initials}
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-medium text-slate-700 leading-none">{mockUser.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{mockUser.email}</p>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-1.5 z-50">
                            <Link href="/dashboard/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                                <User className="w-4 h-4 text-slate-400" /> Profile
                            </Link>
                            <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                                <Settings className="w-4 h-4 text-slate-400" /> Settings
                            </button>
                            <div className="border-t border-slate-100 mt-1 pt-1">
                                <Link href="/" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
