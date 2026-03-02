"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, Clock, Utensils, Coffee, Apple, Moon, Flame, Leaf, Sparkles } from "lucide-react"
import Link from "next/link"
import { generateDefaultDietPlan, DietPlanData, MealItem } from "@/actions/diet.actions"

const mealMeta = [
    { key: "breakfast" as const, label: "Breakfast", time: "7–9 AM", icon: Coffee, color: "from-amber-400 to-orange-500", bg: "bg-amber-50", border: "border-amber-100" },
    { key: "lunch" as const, label: "Lunch", time: "12:30–2 PM", icon: Utensils, color: "from-emerald-400 to-teal-500", bg: "bg-emerald-50", border: "border-emerald-100" },
    { key: "snacks" as const, label: "Snacks", time: "4–5 PM", icon: Apple, color: "from-violet-400 to-purple-500", bg: "bg-violet-50", border: "border-violet-100" },
    { key: "dinner" as const, label: "Dinner", time: "7–8:30 PM", icon: Moon, color: "from-blue-400 to-indigo-500", bg: "bg-blue-50", border: "border-blue-100" },
]

interface Props {
    plan: DietPlanData | null
}

export function DietClient({ plan }: Props) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleGenerate = () => {
        startTransition(async () => {
            await generateDefaultDietPlan()
            router.refresh()
        })
    }

    if (!plan) {
        return (
            <div className="space-y-6 animate-fade-in-up">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800">Diet Planner</h2>
                    <p className="text-slate-500 text-sm mt-0.5">Personalized meal plans based on your health profile</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Utensils className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">No Diet Plan Yet</h3>
                    <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
                        Generate your personalized meal plan based on your fitness goal and health profile.
                    </p>
                    <button
                        onClick={handleGenerate}
                        disabled={isPending}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-100 transition-all disabled:opacity-60"
                    >
                        {isPending ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating…</> : <><Sparkles className="w-4 h-4" /> Generate My Plan</>}
                    </button>
                    <p className="text-xs text-slate-400 mt-3">
                        Complete your <Link href="/dashboard/profile" className="text-blue-500 underline">health profile</Link> first for best results
                    </p>
                </div>
            </div>
        )
    }

    const mealPlanItems = mealMeta.map(m => ({
        ...m,
        items: (plan[m.key] as MealItem[]) ?? [],
    }))

    const totalKcal = mealPlanItems.reduce((sum, m) => sum + m.items.reduce((s, i) => s + (i.cal ?? 0), 0), 0)

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800">Diet Planner</h2>
                    <p className="text-slate-500 text-sm mt-0.5">Personalized meal plan · Goal: <span className="capitalize font-medium text-slate-700">{plan.goal.replace("_", " ")}</span></p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full font-medium flex items-center gap-1">
                        <Leaf className="w-3 h-3" /> {totalKcal.toLocaleString()} / {Math.round(plan.totalCalories).toLocaleString()} kcal today
                    </span>
                </div>
            </div>

            {/* Daily macros overview */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-4">Daily Macro Summary</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: "Calories", value: `${Math.round(plan.totalCalories).toLocaleString()} kcal`, color: "text-orange-600", bg: "bg-orange-50", pct: Math.min(100, Math.round((totalKcal / plan.totalCalories) * 100)) },
                        { label: "Protein", value: `${Math.round(plan.totalProtein)}g`, color: "text-blue-600", bg: "bg-blue-50", pct: 72 },
                        { label: "Plan", value: plan.goal.replace("_", " "), color: "text-emerald-600", bg: "bg-emerald-50", pct: 100 },
                        { label: "Meals", value: `${mealPlanItems.length}`, color: "text-violet-600", bg: "bg-violet-50", pct: 100 },
                    ].map(m => (
                        <div key={m.label} className={`${m.bg} rounded-xl p-4 text-center`}>
                            <div className={`text-xl font-extrabold ${m.color} capitalize`}>{m.value}</div>
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
                {mealPlanItems.map(m => {
                    const Icon = m.icon
                    const mealCal = m.items.reduce((a, i) => a + (i.cal ?? 0), 0)
                    return (
                        <div key={m.label} className={`bg-white rounded-2xl border ${m.border} shadow-sm overflow-hidden`}>
                            <div className={`bg-gradient-to-r ${m.color} px-5 py-4 flex items-center justify-between`}>
                                <div className="flex items-center gap-2.5">
                                    <Icon className="w-5 h-5 text-white" />
                                    <div>
                                        <p className="font-bold text-white text-base">{m.label}</p>
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
                    Update Profile <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    )
}
