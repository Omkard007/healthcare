"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Dumbbell, Clock, Flame, ChevronRight, Trophy, Calendar, Sparkles, Sun, Timer, RotateCcw } from "lucide-react"
import Link from "next/link"
import { getTodaysWorkout, WorkoutPlanData, Exercise } from "@/actions/workout.actions"

const difficultyColors: Record<string, string> = {
    beginner: "text-emerald-600 bg-emerald-50 border-emerald-200",
    intermediate: "text-amber-600 bg-amber-50 border-amber-200",
    advanced: "text-rose-600 bg-rose-50 border-rose-200",
}

const goalColors: Record<string, string> = {
    fat_loss: "text-orange-600 bg-orange-50 border-orange-200",
    muscle_gain: "text-violet-600 bg-violet-50 border-violet-200",
    maintenance: "text-blue-600 bg-blue-50 border-blue-200",
    diabetic_friendly: "text-teal-600 bg-teal-50 border-teal-200",
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

interface Props {
    plan: WorkoutPlanData | null
    dayName?: string
    isSunday?: boolean
}

export function WorkoutClient({ plan, dayName, isSunday }: Props) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleGenerate = () => {
        startTransition(async () => {
            await getTodaysWorkout()
            router.refresh()
        })
    }

    const todayDayIndex = new Date().getDay()

    // ── Empty state ────────────────────────────────────────────────────────────
    if (!plan) {
        return (
            <div className="space-y-6 animate-fade-in-up">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800">Workout Planner</h2>
                    <p className="text-slate-500 text-sm mt-0.5">Personalized workouts based on your fitness goal & activity level</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
                    <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Dumbbell className="w-8 h-8 text-violet-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">No Workout Yet Today</h3>
                    <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
                        Generate your personalized workout for today based on your fitness goals and activity level.
                    </p>
                    <button
                        onClick={handleGenerate}
                        disabled={isPending}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-md shadow-violet-100 transition-all disabled:opacity-60"
                    >
                        {isPending
                            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating…</>
                            : <><Sparkles className="w-4 h-4" /> Generate Today's Workout</>}
                    </button>
                    <p className="text-xs text-slate-400 mt-3">
                        Complete your <Link href="/dashboard/profile" className="text-blue-500 underline">health profile</Link> first for best results
                    </p>
                </div>
            </div>
        )
    }

    const exercises = plan.exercises as Exercise[]
    const createdDate = new Date(plan.createdAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric"
    })

    // Estimate total duration (each exercise ~3 min average)
    const estimatedMins = exercises.reduce((acc, ex) => {
        if (ex.duration) {
            const match = ex.duration.match(/\d+/)
            return acc + (match ? parseInt(match[0]) : 5)
        }
        return acc + (ex.sets ?? 3) * 1.5
    }, 0)

    return (
        <div className="space-y-6 animate-fade-in-up">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800">Workout Planner</h2>
                    <p className="text-slate-500 text-sm mt-0.5">
                        {dayName} · <span className="font-medium text-slate-700 capitalize">{plan.goal.replace(/_/g, " ")}</span> · Created {createdDate}
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs border px-3 py-1.5 rounded-full font-semibold capitalize ${difficultyColors[plan.difficulty] ?? "text-slate-600 bg-slate-50 border-slate-200"}`}>
                        {plan.difficulty}
                    </span>
                    <span className={`text-xs border px-3 py-1.5 rounded-full font-semibold capitalize ${goalColors[plan.goal] ?? "text-slate-600 bg-slate-50 border-slate-200"}`}>
                        {plan.goal.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs bg-violet-50 text-violet-700 border border-violet-200 px-3 py-1.5 rounded-full font-medium flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> {exercises.length} exercises
                    </span>
                </div>
            </div>

            {/* Week strip */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> This Week
                </h3>
                <div className="grid grid-cols-7 gap-1.5">
                    {DAY_LABELS.map((day, i) => {
                        const isToday = i === todayDayIndex
                        const isSun = i === 0
                        return (
                            <div
                                key={day}
                                className={`flex flex-col items-center py-3 rounded-xl text-center ${
                                    isToday
                                        ? "bg-gradient-to-b from-blue-600 to-indigo-600 text-white shadow-md"
                                        : "bg-slate-50 border border-slate-100"
                                }`}
                            >
                                <span className={`text-[10px] font-semibold ${isToday ? "text-blue-100" : "text-slate-400"}`}>{day}</span>
                                <div className="my-1.5">
                                    {isToday
                                        ? <Dumbbell className="w-4 h-4 text-white" />
                                        : isSun
                                            ? <Sun className="w-4 h-4 text-amber-300" />
                                            : <span className="text-lg text-slate-300">·</span>}
                                </div>
                                {isSun && !isToday && (
                                    <span className="text-[9px] text-amber-400 font-medium">Cardio</span>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Sunday special banner */}
            {isSunday && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 flex items-center gap-3">
                    <Sun className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-amber-800">Sunday Recovery Day</p>
                        <p className="text-xs text-amber-600">Light cardio and stretching only — your body needs rest to grow stronger!</p>
                    </div>
                </div>
            )}

            {/* Workout type banner */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-5 text-white flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold text-violet-200 uppercase tracking-wide mb-1">Today's Session</p>
                    <h3 className="text-xl font-extrabold">{plan.type}</h3>
                    <div className="flex items-center gap-3 mt-2 text-sm text-violet-200">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> ~{Math.round(estimatedMins)} min</span>
                        <span className="flex items-center gap-1.5"><Dumbbell className="w-3.5 h-3.5" /> {exercises.length} exercises</span>
                    </div>
                </div>
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Dumbbell className="w-7 h-7 text-white" />
                </div>
            </div>

            {/* Exercise list */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-700">Exercises</h3>
                    <button
                        onClick={handleGenerate}
                        disabled={isPending}
                        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-violet-600 transition-colors disabled:opacity-50"
                    >
                        <RotateCcw className={`w-3.5 h-3.5 ${isPending ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>

                <div className="divide-y divide-slate-50">
                    {exercises.map((ex, idx) => (
                        <div key={`${ex.name}-${idx}`} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                {/* Index badge */}
                                <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                                    <span className="text-xs font-bold text-violet-600">{idx + 1}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">{ex.name}</p>
                                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                        {ex.sets && ex.reps && (
                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                <RotateCcw className="w-3 h-3" /> {ex.sets} × {ex.reps}
                                            </span>
                                        )}
                                        {ex.duration && (
                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                <Timer className="w-3 h-3" /> {ex.duration}
                                            </span>
                                        )}
                                        {ex.rest && (
                                            <span className="text-xs text-slate-400">Rest: {ex.rest}</span>
                                        )}
                                    </div>
                                    {ex.notes && (
                                        <p className="text-[11px] text-blue-500 mt-0.5 italic">{ex.notes}</p>
                                    )}
                                </div>
                            </div>

                           
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats summary */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
                    <Dumbbell className="w-5 h-5 text-violet-500 mx-auto mb-1.5" />
                    <p className="text-xl font-extrabold text-slate-800">{exercises.length}</p>
                    <p className="text-xs text-slate-400">Exercises</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
                    <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1.5" />
                    <p className="text-xl font-extrabold text-slate-800">~{Math.round(estimatedMins)}</p>
                    <p className="text-xs text-slate-400">Minutes</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
                    <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1.5" />
                    <p className="text-xl font-extrabold text-slate-800">~{Math.round(estimatedMins * 6)}</p>
                    <p className="text-xs text-slate-400">Est. kcal</p>
                </div>
            </div>

            {/* v2 banner */}
            <div className="rounded-2xl bg-gradient-to-r from-violet-700 to-indigo-700 p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <p className="font-bold text-base">AI Adaptive Workouts — Coming in Version 2</p>
                    <p className="text-violet-200 text-sm">Workouts that automatically adjust based on your logged performance.</p>
                </div>
                <Link
                    href="/dashboard"
                    className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 bg-white text-violet-700 text-sm font-bold rounded-xl hover:bg-violet-50 transition-colors"
                >
                    Back to Dashboard <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    )
}