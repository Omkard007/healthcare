"use client"

import { ChevronRight, Clock, Utensils, Coffee, Apple, Moon, Flame, Leaf } from "lucide-react"
import Link from "next/link"

const mealPlan = [
    {
        meal: "Breakfast",
        time: "7–9 AM",
        icon: Coffee,
        color: "from-amber-400 to-orange-500",
        bg: "bg-amber-50",
        border: "border-amber-100",
        items: [
            { name: "Steel-cut Oats with Almonds", cal: 280, protein: "12g", carbs: "48g", fat: "7g" },
            { name: "Banana + Mixed Berries", cal: 90, protein: "1g", carbs: "22g", fat: "0g" },
            { name: "Green Tea", cal: 5, protein: "0g", carbs: "1g", fat: "0g" },
        ]
    },
    {
        meal: "Lunch",
        time: "12:30–2 PM",
        icon: Utensils,
        color: "from-emerald-400 to-teal-500",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
        items: [
            { name: "Brown Rice (1 cup)", cal: 215, protein: "5g", carbs: "45g", fat: "2g" },
            { name: "Dal Tadka", cal: 180, protein: "10g", carbs: "28g", fat: "4g" },
            { name: "Mixed Vegetable Sabzi", cal: 120, protein: "3g", carbs: "18g", fat: "4g" },
            { name: "Cucumber Raita", cal: 60, protein: "3g", carbs: "7g", fat: "2g" },
        ]
    },
    {
        meal: "Snacks",
        time: "4–5 PM",
        icon: Apple,
        color: "from-violet-400 to-purple-500",
        bg: "bg-violet-50",
        border: "border-violet-100",
        items: [
            { name: "Apple with Peanut Butter", cal: 180, protein: "5g", carbs: "25g", fat: "8g" },
            { name: "Black Coffee", cal: 5, protein: "0g", carbs: "0g", fat: "0g" },
        ]
    },
    {
        meal: "Dinner",
        time: "7–8:30 PM",
        icon: Moon,
        color: "from-blue-400 to-indigo-500",
        bg: "bg-blue-50",
        border: "border-blue-100",
        items: [
            { name: "2 Multigrain Rotis", cal: 175, protein: "5g", carbs: "32g", fat: "3g" },
            { name: "Palak Paneer", cal: 220, protein: "12g", carbs: "18g", fat: "12g" },
            { name: "Side Salad", cal: 45, protein: "1g", carbs: "8g", fat: "1g" },
        ]
    },
]

const totals = { calories: 1578, protein: "57g", carbs: "252g", fat: "43g" }

export default function DietPage() {
    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800">Diet Planner</h2>
                    <p className="text-slate-500 text-sm mt-0.5">Personalized Indian meal plan for your maintenance goal</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full font-medium flex items-center gap-1">
                        <Leaf className="w-3 h-3" /> 1,578 / 1,800 kcal today
                    </span>
                </div>
            </div>

            {/* Daily macros overview */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-4">Daily Macro Summary</h3>
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { label: "Calories", value: totals.calories, unit: "kcal", color: "text-orange-600", bg: "bg-orange-50", pct: 88 },
                        { label: "Protein", value: totals.protein, unit: "", color: "text-blue-600", bg: "bg-blue-50", pct: 72 },
                        { label: "Carbs", value: totals.carbs, unit: "", color: "text-amber-600", bg: "bg-amber-50", pct: 80 },
                        { label: "Fats", value: totals.fat, unit: "", color: "text-violet-600", bg: "bg-violet-50", pct: 60 },
                    ].map(m => (
                        <div key={m.label} className={`${m.bg} rounded-xl p-4 text-center`}>
                            <div className={`text-xl font-extrabold ${m.color}`}>{m.value}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{m.label}</div>
                            <div className="mt-2 progress-bar bg-white">
                                <div className={`progress-fill ${m.color.replace("text-", "bg-")}`} style={{ width: `${m.pct}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Meal cards */}
            <div className="grid md:grid-cols-2 gap-5">
                {mealPlan.map(m => {
                    const Icon = m.icon
                    const mealCal = m.items.reduce((a, i) => a + i.cal, 0)
                    return (
                        <div key={m.meal} className={`bg-white rounded-2xl border ${m.border} shadow-sm overflow-hidden`}>
                            <div className={`bg-gradient-to-r ${m.color} px-5 py-4 flex items-center justify-between`}>
                                <div className="flex items-center gap-2.5">
                                    <Icon className="w-5 h-5 text-white" />
                                    <div>
                                        <p className="font-bold text-white text-base">{m.meal}</p>
                                        <p className="text-white/70 text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> {m.time}</p>
                                    </div>
                                </div>
                                <div className="text-white/90 text-right">
                                    <div className="font-extrabold text-lg">{mealCal}</div>
                                    <div className="text-xs">kcal</div>
                                </div>
                            </div>
                            <div className="p-4 space-y-2">
                                {m.items.map(item => (
                                    <div key={item.name} className={`flex items-center justify-between py-2 px-3 rounded-lg ${m.bg}`}>
                                        <span className="text-sm text-slate-700 font-medium">{item.name}</span>
                                        <div className="flex items-center gap-3 text-xs text-slate-500">
                                            <span className="font-semibold text-slate-800">{item.cal} kcal</span>
                                            <span className="hidden sm:inline text-slate-300">|</span>
                                            <span className="hidden sm:inline">P: {item.protein}</span>
                                            <span className="hidden sm:inline">C: {item.carbs}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Coming soon banner */}
            <div className="rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                        <Flame className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                        <p className="font-bold text-base">AI Meal Generation Coming in Version 2</p>
                        <p className="text-slate-400 text-sm">Get dynamic, personalized Indian meal plans generated fresh every day by AI.</p>
                    </div>
                </div>
                <Link href="/dashboard/profile" className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 bg-white text-slate-800 text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors">
                    Complete Profile <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    )
}
