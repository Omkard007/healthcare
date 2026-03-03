"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import {
    Bell, Search, ChevronDown, LogOut, Settings, User,
    Home, Utensils, Stethoscope, Dumbbell, LineChart
} from "lucide-react"
import {
  UserButton,
} from "@clerk/nextjs"
const navItems = [
    { name: "Overview", href: "/dashboard", icon: Home },
    { name: "Health Profile", href: "/dashboard/profile", icon: User },
    { name: "Diet Plan", href: "/dashboard/diet", icon: Utensils },
    { name: "Symptoms", href: "/dashboard/symptoms", icon: Stethoscope },
    { name: "Workout", href: "/dashboard/workout", icon: Dumbbell },
    { name: "Daily Tracker", href: "/dashboard/tracker", icon: LineChart },
]



export function DashboardHeader() {
    const pathname = usePathname()

    const pageTitle = navItems.find(n => n.href === pathname)?.name ?? "Dashboard"


    return (
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6 gap-6 sticky top-0 z-30">
            {/* Page title */}
            <div className="flex-1">
                <h1 className="text-lg font-bold text-slate-800 hidden md:block">{pageTitle}</h1>
            </div>

                {/* User menu */}
                <div className="relative">
                    
                        <div className="hidden sm:block text-left">
                            <UserButton></UserButton>
                        </div>
                   

                </div>
            
        </header>
    )
}
