"use client"

import { Dumbbell, Clock, Flame, ChevronRight, Play, Trophy, Calendar } from "lucide-react"
import Link from "next/link"

const workouts = [
    {
        title: "Upper Body Strength",
        duration: "45 min",
        calories: 380,
        difficulty: "Moderate",
        diffColor: "text-amber-600 bg-amber-50 border-amber-200",
        tag: "Today's Focus",
        tagColor: "bg-blue-600 text-white",
        exercises: [
            { name: "Push-Ups", sets: "3 × 15", muscle: "Chest, Triceps" },
            { name: "Dumbbell Rows", sets: "3 × 12", muscle: "Back, Biceps" },
            { name: "Shoulder Press", sets: "3 × 10", muscle: "Shoulders" },
            { name: "Tricep Dips", sets: "2 × 12", muscle: "Triceps" },
            { name: "Plank", sets: "3 × 45s", muscle: "Core" },
        ]
    },
    {
        title: "Cardio & HIIT",
        duration: "30 min",
        calories: 310,
        difficulty: "Hard",
        diffColor: "text-rose-600 bg-rose-50 border-rose-200",
        tag: "Tomorrow",
        tagColor: "bg-slate-600 text-white",
        exercises: [
            { name: "Jump Rope", sets: "5 × 2 min", muscle: "Full Body" },
            { name: "Burpees", sets: "4 × 10", muscle: "Full Body" },
            { name: "Mountain Climbers", sets: "3 × 30s", muscle: "Core, Legs" },
            { name: "High Knees", sets: "3 × 30s", muscle: "Legs, Cardio" },
        ]
    },
    {
        title: "Yoga & Flexibility",
        duration: "40 min",
        calories: 180,
        difficulty: "Easy",
        diffColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
        tag: "Recovery",
        tagColor: "bg-emerald-600 text-white",
        exercises: [
            { name: "Sun Salutation", sets: "5 rounds", muscle: "Full Body" },
            { name: "Warrior I & II", sets: "3 min each", muscle: "Legs, Core" },
            { name: "Seated Forward Fold", sets: "2 × 60s", muscle: "Hamstrings" },
            { name: "Savasana", sets: "5 min", muscle: "Recovery" },
        ]
    },
]

const weekSchedule = [
    { day: "Mon", workout: "Upper Body", done: true },
    { day: "Tue", workout: "Cardio", done: true },
    { day: "Wed", workout: "Yoga", done: true },
    { day: "Thu", workout: "Lower Body", done: false, today: true },
    { day: "Fri", workout: "Full Body", done: false },
    { day: "Sat", workout: "Rest", done: false },
    { day: "Sun", workout: "Active Rest", done: false },
]

export default function WorkoutPage() {
    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800">Workout Planner</h2>
                    <p className="text-slate-500 text-sm mt-0.5">Week 3 · Maintenance Program · Moderate Intensity</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs bg-violet-50 text-violet-700 border border-violet-200 px-3 py-1.5 rounded-full font-medium flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> 3-day streak 🔥
                    </span>
                </div>
            </div>

            {/* Week schedule */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> This Week
                </h3>
                <div className="grid grid-cols-7 gap-1.5">
                    {weekSchedule.map(d => (
                        <div
                            key={d.day}
                            className={`flex flex-col items-center py-3 rounded-xl text-center transition-all ${d.today ? "bg-gradient-to-b from-blue-600 to-indigo-600 text-white shadow-md" :
                                    d.done ? "bg-emerald-50 border border-emerald-200" :
                                        "bg-slate-50 border border-slate-100"
                                }`}
                        >
                            <span className={`text-[10px] font-semibold ${d.today ? "text-blue-100" : "text-slate-400"}`}>{d.day}</span>
                            <div className="my-1.5">
                                {d.done
                                    ? <span className="text-lg">✅</span>
                                    : d.today
                                        ? <Dumbbell className="w-4 h-4 text-white" />
                                        : <span className="text-lg text-slate-300">·</span>
                                }
                            </div>
                            <span className={`text-[9px] font-medium ${d.today ? "text-white" : d.done ? "text-emerald-600" : "text-slate-400"}`}>
                                {d.workout.slice(0, 6)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Workout cards */}
            <div className="space-y-4">
                {workouts.map((w, idx) => (
                    <div key={w.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${idx === 0 ? "from-blue-400 to-indigo-600" : idx === 1 ? "from-rose-400 to-pink-600" : "from-emerald-400 to-teal-600"}`}>
                                    <Dumbbell className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-slate-800">{w.title}</h3>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${w.tagColor}`}>{w.tag}</span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {w.duration}</span>
                                        <span className="flex items-center gap-1"><Flame className="w-3 h-3" /> {w.calories} kcal</span>
                                        <span className={`border px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${w.diffColor}`}>{w.difficulty}</span>
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
                                    <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-lg">
                                        {ex.sets}
                                    </span>
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
