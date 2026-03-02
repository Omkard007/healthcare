"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Dumbbell, Clock, Flame, ChevronRight, Play, Trophy, Calendar, Sparkles } from "lucide-react"
import Link from "next/link"
import { generateDefaultWorkoutPlan, WorkoutPlanData, WorkoutBlock } from "@/actions/workout.actions"

const difficultyColors: Record<string, string> = {
    Easy: "text-emerald-600 bg-emerald-50 border-emerald-200",
    Moderate: "text-amber-600 bg-amber-50 border-amber-200",
    Hard: "text-rose-600 bg-rose-50 border-rose-200",
}

const tagColors: Record<string, string> = {
    "Today's Focus": "bg-blue-600 text-white",
    "Tomorrow": "bg-slate-600 text-white",
    "Recovery": "bg-emerald-600 text-white",
}

const blockGradients = [
    "from-blue-400 to-indigo-600",
    "from-rose-400 to-pink-600",
    "from-emerald-400 to-teal-600",
]

interface Props {
    plan: WorkoutPlanData | null
}

export function WorkoutClient({ plan }: Props) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleGenerate = () => {
        startTransition(async () => {
            await generateDefaultWorkoutPlan()
            router.refresh()
        })
    }

    if (!plan) {
        return (
            <div className="space-y-6 animate-fade-in-up">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800">Workout Planner</h2>
                    <p className="text-slate-500 text-sm mt-0.5">Personalized workout plans based on your fitness goal</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
                    <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Dumbbell className="w-8 h-8 text-violet-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">No Workout Plan Yet</h3>
                    <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
                        Generate your personalized workout plan based on your fitness goals and activity level.
                    </p>
                    <button
                        onClick={handleGenerate}
                        disabled={isPending}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-md shadow-violet-100 transition-all disabled:opacity-60"
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

    const workouts = plan.exercises as WorkoutBlock[]
    const createdDate = new Date(plan.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800">Workout Planner</h2>
                    <p className="text-slate-500 text-sm mt-0.5">
                        Goal: <span className="font-medium text-slate-700 capitalize">{plan.goal.replace("_", " ")}</span> · {plan.difficulty} intensity · Created {createdDate}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs bg-violet-50 text-violet-700 border border-violet-200 px-3 py-1.5 rounded-full font-medium flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> {workouts.length} workouts planned
                    </span>
                </div>
            </div>

            {/* Week schedule placeholder */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> This Week
                </h3>
                <div className="grid grid-cols-7 gap-1.5">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
                        const isToday = i === new Date().getDay() - 1
                        return (
                            <div
                                key={day}
                                className={`flex flex-col items-center py-3 rounded-xl text-center ${isToday ? "bg-gradient-to-b from-blue-600 to-indigo-600 text-white shadow-md" : "bg-slate-50 border border-slate-100"}`}
                            >
                                <span className={`text-[10px] font-semibold ${isToday ? "text-blue-100" : "text-slate-400"}`}>{day}</span>
                                <div className="my-1.5">
                                    {isToday ? <Dumbbell className="w-4 h-4 text-white" /> : <span className="text-lg text-slate-300">·</span>}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Workout cards */}
            <div className="space-y-4">
                {workouts.map((w, idx) => (
                    <div key={w.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${blockGradients[idx % blockGradients.length]}`}>
                                    <Dumbbell className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-slate-800">{w.title}</h3>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tagColors[w.tag] ?? "bg-slate-600 text-white"}`}>{w.tag}</span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {w.duration}</span>
                                        <span className="flex items-center gap-1"><Flame className="w-3 h-3" /> {w.calories} kcal</span>
                                        <span className={`border px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${difficultyColors[w.difficulty] ?? "text-slate-600 bg-slate-50 border-slate-200"}`}>{w.difficulty}</span>
                                    </div>
                                </div>
                            </div>
                            {idx === 0 && (
                                <button className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors">
                                    <Play className="w-3.5 h-3.5 fill-white" /> Start
                                </button>
                            )}
                        </div>
                        <div className="px-6 pb-5 grid sm:grid-cols-2 gap-2">
                            {w.exercises.map(ex => (
                                <div key={ex.name} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-2.5">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">{ex.name}</p>
                                        <p className="text-[10px] text-slate-400">{ex.muscle}</p>
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-lg">{ex.sets}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* v2 banner */}
            <div className="rounded-2xl bg-gradient-to-r from-violet-700 to-indigo-700 p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <p className="font-bold text-base">AI Adaptive Workouts — Coming in Version 2</p>
                    <p className="text-violet-200 text-sm">Workouts that automatically adjust based on your logged performance.</p>
                </div>
                <Link href="/dashboard" className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 bg-white text-violet-700 text-sm font-bold rounded-xl hover:bg-violet-50 transition-colors">
                    Back to Dashboard <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    )
}
