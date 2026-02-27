"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Scale, Ruler, Activity, Moon, Target, Heart, CheckCircle2, ChevronRight } from "lucide-react"

const CONDITION_OPTIONS = [
    { label: "Diabetes", value: "diabetes" },
    { label: "Hypertension", value: "hypertension" },
    { label: "Asthma", value: "asthma" },
    { label: "Thyroid", value: "thyroid" },
    { label: "PCOD", value: "pcod" },
    { label: "Heart Disease", value: "heart_disease" },
    { label: "None", value: "none" },
]

const ACTIVITY_OPTS = [
    { label: "Sedentary — Desk job, little exercise", value: "sedentary" },
    { label: "Light — Exercise 1–3 days/week", value: "light" },
    { label: "Moderate — Exercise 3–5 days/week", value: "moderate" },
    { label: "Active — Exercise 6–7 days/week", value: "active" },
    { label: "Very Active — Athlete / physical job", value: "very_active" },
]

const GOAL_OPTS = [
    { label: "Fat Loss", value: "fat_loss", color: "border-rose-300 bg-rose-50 text-rose-700", check: "bg-rose-500" },
    { label: "Muscle Gain", value: "muscle_gain", color: "border-violet-300 bg-violet-50 text-violet-700", check: "bg-violet-500" },
    { label: "Maintenance", value: "maintenance", color: "border-emerald-300 bg-emerald-50 text-emerald-700", check: "bg-emerald-500" },
    { label: "Diabetic Friendly", value: "diabetic_friendly", color: "border-blue-300 bg-blue-50 text-blue-700", check: "bg-blue-500" },
]

export default function ProfilePage() {
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [saved, setSaved] = useState(false)

    const [form, setForm] = useState({
        name: "Priya Sharma",
        age: "28",
        gender: "female",
        heightCm: "165",
        weightKg: "61",
        activityLevel: "light",
        sleepHours: "7",
        conditions: ["none"] as string[],
        allergies: "",
        smoking: false,
        alcohol: false,
        fitnessGoal: "maintenance",
    })

    const set = (k: string, v: unknown) => setForm(prev => ({ ...prev, [k]: v }))

    const toggleCondition = (val: string) => {
        const prev = form.conditions
        let next: string[]
        if (val === "none") {
            next = prev.includes("none") ? [] : ["none"]
        } else {
            next = prev.filter(c => c !== "none")
            next = prev.includes(val) ? prev.filter(c => c !== val) : [...prev.filter(c => c !== "none"), val]
        }
        if (next.length === 0) next = ["none"]
        set("conditions", next)
    }

    const bmi = form.heightCm && form.weightKg
        ? (Number(form.weightKg) / Math.pow(Number(form.heightCm) / 100, 2)).toFixed(1)
        : "--"

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => {
            router.push("/dashboard")
        }, 1500)
    }

    const steps = [
        { label: "Personal", icon: User },
        { label: "Vitals", icon: Scale },
        { label: "Lifestyle", icon: Activity },
        { label: "Goals", icon: Target },
    ]

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-extrabold text-slate-800">Health Profile</h2>
                <p className="text-slate-500 text-sm mt-0.5">Your data is used to generate personalised plans — nothing is shared.</p>
            </div>

            {/* Step progress */}
            <div className="flex items-center gap-0">
                {steps.map((s, i) => {
                    const Icon = s.icon
                    const done = i < step
                    const active = i === step
                    return (
                        <div key={s.label} className="flex items-center flex-1">
                            <button
                                onClick={() => setStep(i)}
                                className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all ${active ? "opacity-100" : "opacity-60 hover:opacity-80"}`}
                            >
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${done ? "bg-emerald-500 text-white" :
                                        active ? "bg-blue-600 text-white shadow-md shadow-blue-200" :
                                            "bg-slate-100 text-slate-500"
                                    }`}>
                                    {done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                                </div>
                                <span className={`text-[10px] font-semibold ${active ? "text-blue-600" : "text-slate-400"}`}>{s.label}</span>
                            </button>
                            {i < steps.length - 1 && (
                                <div className={`flex-1 h-0.5 transition-all ${i < step ? "bg-emerald-400" : "bg-slate-200"}`} />
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Step panels */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

                {/* Step 0: Personal */}
                {step === 0 && (
                    <div className="space-y-5">
                        <h3 className="text-base font-bold text-slate-700 flex items-center gap-2"><User className="w-4 h-4 text-slate-400" /> Personal Information</h3>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 block mb-1.5">Full Name</label>
                            <input
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-slate-800"
                                value={form.name}
                                onChange={e => set("name", e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Age</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-slate-800"
                                    value={form.age}
                                    onChange={e => set("age", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Gender</label>
                                <select
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-slate-800"
                                    value={form.gender}
                                    onChange={e => set("gender", e.target.value)}
                                >
                                    <option value="female">Female</option>
                                    <option value="male">Male</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 1: Vitals */}
                {step === 1 && (
                    <div className="space-y-5">
                        <h3 className="text-base font-bold text-slate-700 flex items-center gap-2"><Scale className="w-4 h-4 text-slate-400" /> Body Measurements</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Height (cm)</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                                    value={form.heightCm}
                                    onChange={e => set("heightCm", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Weight (kg)</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                                    value={form.weightKg}
                                    onChange={e => set("weightKg", e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Live BMI display */}
                        <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Calculated BMI</p>
                                <p className="text-2xl font-extrabold text-emerald-700">{bmi}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400">Category</p>
                                <p className="text-sm font-bold text-emerald-600">
                                    {Number(bmi) < 18.5 ? "Underweight" : Number(bmi) < 25 ? "Normal" : Number(bmi) < 30 ? "Overweight" : "Obese"}
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-500 block mb-1.5">Sleep Hours per Night</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                                value={form.sleepHours}
                                onChange={e => set("sleepHours", e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Lifestyle */}
                {step === 2 && (
                    <div className="space-y-5">
                        <h3 className="text-base font-bold text-slate-700 flex items-center gap-2"><Activity className="w-4 h-4 text-slate-400" /> Lifestyle & Medical</h3>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 block mb-1.5">Activity Level</label>
                            <select
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-slate-800"
                                value={form.activityLevel}
                                onChange={e => set("activityLevel", e.target.value)}
                            >
                                {ACTIVITY_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-500 block mb-2">Medical Conditions</label>
                            <div className="grid grid-cols-2 gap-2">
                                {CONDITION_OPTIONS.map(c => (
                                    <label key={c.value} className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all text-sm ${form.conditions.includes(c.value)
                                            ? "border-blue-400 bg-blue-50 text-blue-700"
                                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                                        }`}>
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={form.conditions.includes(c.value)}
                                            onChange={() => toggleCondition(c.value)}
                                        />
                                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${form.conditions.includes(c.value) ? "bg-blue-500 border-blue-500" : "border-slate-300"}`}>
                                            {form.conditions.includes(c.value) && <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12"><path d="M10 3L5 8.5 2 5.5l-1 1L5 10.5l6-7z" /></svg>}
                                        </div>
                                        {c.label}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-500 block mb-1.5">Allergies (comma-separated)</label>
                            <input
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                                placeholder="e.g. peanuts, dairy, shellfish"
                                value={form.allergies}
                                onChange={e => set("allergies", e.target.value)}
                            />
                        </div>

                        <div className="flex gap-6">
                            {[{ label: "Do you smoke?", key: "smoking" }, { label: "Do you drink alcohol?", key: "alcohol" }].map(f => (
                                <label key={f.key} className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                                    <div
                                        onClick={() => set(f.key, !form[f.key as keyof typeof form])}
                                        className={`w-10 h-6 rounded-full transition-all relative ${form[f.key as keyof typeof form] ? "bg-blue-500" : "bg-slate-300"}`}
                                    >
                                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form[f.key as keyof typeof form] ? "left-4.5" : "left-0.5"}`} />
                                    </div>
                                    {f.label}
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Goals */}
                {step === 3 && (
                    <div className="space-y-5">
                        <h3 className="text-base font-bold text-slate-700 flex items-center gap-2"><Target className="w-4 h-4 text-slate-400" /> Your Fitness Goal</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {GOAL_OPTS.map(g => (
                                <label key={g.value} className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition-all text-center ${form.fitnessGoal === g.value ? `${g.color} border-current` : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                                    }`}>
                                    <input type="radio" name="goal" value={g.value} className="sr-only" checked={form.fitnessGoal === g.value} onChange={() => set("fitnessGoal", g.value)} />
                                    <span className="font-bold">{g.label}</span>
                                    {form.fitnessGoal === g.value && <CheckCircle2 className="w-5 h-5" />}
                                </label>
                            ))}
                        </div>

                        {/* Summary card */}
                        <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-white p-5">
                            <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wide">Your Health Summary</p>
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div>
                                    <div className="text-2xl font-extrabold text-emerald-400">{bmi}</div>
                                    <div className="text-[10px] text-slate-400">BMI</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-extrabold text-blue-400">
                                        {form.weightKg && form.heightCm && form.age && form.gender
                                            ? Math.round(
                                                (form.gender === "male"
                                                    ? 10 * Number(form.weightKg) + 6.25 * Number(form.heightCm) - 5 * Number(form.age) + 5
                                                    : 10 * Number(form.weightKg) + 6.25 * Number(form.heightCm) - 5 * Number(form.age) - 161)
                                                * { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 }[form.activityLevel as "sedentary"]
                                            )
                                            : "--"}
                                    </div>
                                    <div className="text-[10px] text-slate-400">TDEE kcal</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-extrabold text-amber-400">{form.sleepHours || "--"}</div>
                                    <div className="text-[10px] text-slate-400">Sleep hrs</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation buttons */}
                <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100">
                    <button
                        onClick={() => setStep(s => Math.max(0, s - 1))}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors ${step === 0 ? "invisible" : ""}`}
                    >
                        ← Back
                    </button>

                    {step < 3 ? (
                        <button
                            onClick={() => setStep(s => s + 1)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-100 transition-all"
                        >
                            Continue <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSave}
                            disabled={saved}
                            className={`flex items-center gap-2 px-6 py-2.5 text-white text-sm font-bold rounded-xl shadow-md transition-all ${saved ? "bg-emerald-500 shadow-emerald-100" : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"}`}
                        >
                            {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <>Save Profile</>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
