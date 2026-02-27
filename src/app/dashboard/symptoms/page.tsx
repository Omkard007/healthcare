"use client"

import { useState } from "react"
import { Stethoscope, Search, AlertCircle, CheckCircle, Clock, ChevronRight, Brain, Activity } from "lucide-react"

const symptomOptions = [
    "Headache", "Fever", "Cough", "Fatigue", "Nausea", "Body Ache",
    "Chest Pain", "Shortness of Breath", "Dizziness", "Sore Throat",
    "Runny Nose", "Abdominal Pain", "Joint Pain", "Back Pain", "Rash",
]

const mockResult = {
    symptoms: ["Headache", "Fatigue", "Body Ache"],
    possibleConditions: [
        { name: "Common Cold / Viral Fever", probability: 72, severity: "Mild", color: "emerald" },
        { name: "Migraine", probability: 18, severity: "Moderate", color: "amber" },
        { name: "Dehydration", probability: 10, severity: "Mild", color: "blue" },
    ],
    advice: "Rest well and stay hydrated. Take OTC pain reliever if needed. Monitor for worsening symptoms.",
    doctorNeeded: false,
}

const recentLogs = [
    { date: "Feb 22", symptoms: ["Headache", "Fatigue"], condition: "Viral Fever", severity: "Mild", color: "emerald" },
    { date: "Feb 18", symptoms: ["Cough", "Sore Throat"], condition: "Common Cold", severity: "Mild", color: "emerald" },
    { date: "Feb 10", symptoms: ["Chest Pain", "Dizziness"], condition: "Anxiety", severity: "Moderate", color: "amber" },
]

const severityColor: Record<string, string> = {
    Mild: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Moderate: "bg-amber-100 text-amber-700 border-amber-200",
    Severe: "bg-red-100 text-red-700 border-red-200",
}

export default function SymptomsPage() {
    const [selected, setSelected] = useState<string[]>([])
    const [showResult, setShowResult] = useState(false)
    const [loading, setLoading] = useState(false)

    const toggle = (s: string) =>
        setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

    const analyze = () => {
        if (selected.length === 0) return
        setLoading(true)
        setTimeout(() => { setLoading(false); setShowResult(true) }, 1800)
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800">Symptom Checker</h2>
                    <p className="text-slate-500 text-sm mt-0.5">Select your symptoms to get AI-powered insights</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> Not a replacement for medical advice
                </span>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Symptom selector */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <Search className="w-4 h-4 text-slate-400" /> Select symptoms you are experiencing
                        </label>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {symptomOptions.map(s => (
                                <button
                                    key={s}
                                    onClick={() => toggle(s)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${selected.includes(s)
                                            ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100"
                                            : "bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        {selected.length > 0 && (
                            <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100">
                                <p className="text-sm text-slate-600">
                                    <span className="font-bold text-blue-600">{selected.length}</span> symptom{selected.length > 1 ? "s" : ""} selected
                                </p>
                                <button
                                    onClick={analyze}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-100 transition-all disabled:opacity-60"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Analyzing…
                                        </>
                                    ) : (
                                        <><Brain className="w-4 h-4" /> Analyze with AI</>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Result */}
                    {showResult && (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-5 animate-fade-in-up">
                            <div className="flex items-center gap-2">
                                <Brain className="w-5 h-5 text-blue-600" />
                                <h3 className="font-bold text-slate-800">AI Analysis Results</h3>
                                <span className="ml-auto text-xs text-slate-400 flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" /> Just now
                                </span>
                            </div>

                            <div className="space-y-3">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Possible Conditions</p>
                                {mockResult.possibleConditions.map(c => (
                                    <div key={c.name} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50">
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                                            <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full mt-1 inline-block ${severityColor[c.severity]}`}>
                                                {c.severity}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-extrabold text-slate-700">{c.probability}%</div>
                                            <div className="text-[10px] text-slate-400">likelihood</div>
                                        </div>
                                        <div className="w-20">
                                            <div className="progress-bar">
                                                <div
                                                    className={`progress-fill ${c.color === "emerald" ? "bg-emerald-400" : c.color === "amber" ? "bg-amber-400" : "bg-blue-400"}`}
                                                    style={{ width: `${c.probability}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={`rounded-xl p-4 flex items-start gap-3 ${mockResult.doctorNeeded ? "bg-red-50 border border-red-200" : "bg-emerald-50 border border-emerald-200"}`}>
                                {mockResult.doctorNeeded
                                    ? <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                    : <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                }
                                <div>
                                    <p className={`text-sm font-bold ${mockResult.doctorNeeded ? "text-red-800" : "text-emerald-800"}`}>
                                        {mockResult.doctorNeeded ? "Doctor visit recommended" : "Home care likely sufficient"}
                                    </p>
                                    <p className={`text-sm mt-0.5 ${mockResult.doctorNeeded ? "text-red-700" : "text-emerald-700"}`}>
                                        {mockResult.advice}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Recent logs */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-slate-400" /> Recent Symptom Logs
                    </h3>
                    <div className="space-y-3">
                        {recentLogs.map(l => (
                            <div key={l.date} className="p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 transition-all cursor-pointer">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs font-medium text-slate-500">{l.date}</span>
                                    <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${severityColor[l.severity]}`}>{l.severity}</span>
                                </div>
                                <p className="text-sm font-semibold text-slate-700">{l.condition}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{l.symptoms.join(", ")}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                        <p className="text-xs font-bold text-blue-800 mb-1">Coming in Version 2</p>
                        <p className="text-xs text-blue-600">Full AI diagnosis with GPT-4 integration and doctor referral system.</p>
                        <ChevronRight className="w-4 h-4 text-blue-400 mt-2" />
                    </div>
                </div>
            </div>
        </div>
    )
}
