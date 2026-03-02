"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Stethoscope, Search, AlertCircle, CheckCircle, Clock, ChevronRight, Brain, Activity } from "lucide-react"
import { createSymptomLog, SymptomLogData } from "@/actions/symptoms.actions"

const symptomOptions = [
    "Headache", "Fever", "Cough", "Fatigue", "Nausea", "Body Ache",
    "Chest Pain", "Shortness of Breath", "Dizziness", "Sore Throat",
    "Runny Nose", "Abdominal Pain", "Joint Pain", "Back Pain", "Rash",
]

// Simple rule-based analysis for MVP (AI integration in v2)
function analyzeSymptoms(symptoms: string[]) {
    const s = symptoms.map(x => x.toLowerCase())
    let possibleCondition = "General Discomfort"
    let severity = "Mild"
    let advice = "Rest well, stay hydrated, and monitor your symptoms."
    let doctorNeeded = false

    if (s.includes("chest pain") || s.includes("shortness of breath")) {
        possibleCondition = "Possible Cardiac / Respiratory Issue"
        severity = "Severe"
        advice = "Seek immediate medical attention. These symptoms can be serious."
        doctorNeeded = true
    } else if (s.includes("fever") && s.includes("cough") && s.includes("body ache")) {
        possibleCondition = "Viral Fever / Flu"
        severity = "Moderate"
        advice = "Rest, hydrate, and take paracetamol if needed. See a doctor if fever persists beyond 3 days."
        doctorNeeded = false
    } else if (s.includes("headache") && s.includes("fatigue")) {
        possibleCondition = "Tension Headache / Dehydration"
        severity = "Mild"
        advice = "Drink water, rest in a quiet room. Consider OTC pain relief if needed."
        doctorNeeded = false
    } else if (s.includes("cough") && s.includes("sore throat")) {
        possibleCondition = "Common Cold"
        severity = "Mild"
        advice = "Warm fluids, throat lozenges, and rest. Should resolve in 5–7 days."
        doctorNeeded = false
    } else if (s.includes("dizziness") && s.includes("nausea")) {
        possibleCondition = "Vertigo / Inner Ear Issue"
        severity = "Moderate"
        advice = "Avoid sudden movements. Consult a doctor if recurring."
        doctorNeeded = true
    } else if (symptoms.length >= 5) {
        severity = "Moderate"
        advice = "Multiple symptoms detected. Rest and monitor closely. Consult a doctor if symptoms worsen."
        doctorNeeded = true
    }

    return { possibleCondition, severity, advice, doctorNeeded }
}

const severityColor: Record<string, string> = {
    Mild: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Moderate: "bg-amber-100 text-amber-700 border-amber-200",
    Severe: "bg-red-100 text-red-700 border-red-200",
}

interface Props {
    recentLogs: SymptomLogData[]
}

export function SymptomsClient({ recentLogs: initialLogs }: Props) {
    const router = useRouter()
    const [selected, setSelected] = useState<string[]>([])
    const [result, setResult] = useState<ReturnType<typeof analyzeSymptoms> | null>(null)
    const [isPending, startTransition] = useTransition()
    const [logs, setLogs] = useState<SymptomLogData[]>(initialLogs)

    const toggle = (s: string) =>
        setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

    const analyze = () => {
        if (selected.length === 0) return
        startTransition(async () => {
            const analysis = analyzeSymptoms(selected)
            setResult(analysis)

            // Save to DB
            await createSymptomLog({
                symptoms: selected,
                possibleCondition: analysis.possibleCondition,
                severity: analysis.severity,
                advice: analysis.advice,
                doctorNeeded: analysis.doctorNeeded,
            })

            // Optimistically prepend to local log list
            const newLog: SymptomLogData = {
                id: Date.now().toString(),
                symptoms: selected,
                possibleCondition: analysis.possibleCondition,
                severity: analysis.severity,
                advice: analysis.advice,
                doctorNeeded: analysis.doctorNeeded,
                createdAt: new Date(),
            }
            setLogs(prev => [newLog, ...prev].slice(0, 10))
            router.refresh()
        })
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
                                    disabled={isPending}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-100 transition-all disabled:opacity-60"
                                >
                                    {isPending ? (
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
                    {result && (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-5 animate-fade-in-up">
                            <div className="flex items-center gap-2">
                                <Brain className="w-5 h-5 text-blue-600" />
                                <h3 className="font-bold text-slate-800">Analysis Results</h3>
                                <span className="ml-auto text-xs text-slate-400 flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" /> Just now
                                </span>
                            </div>

                            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center gap-4">
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-800">{result.possibleCondition}</p>
                                    <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full mt-1 inline-block ${severityColor[result.severity]}`}>
                                        {result.severity}
                                    </span>
                                </div>
                                <Stethoscope className="w-6 h-6 text-slate-400" />
                            </div>

                            <div className={`rounded-xl p-4 flex items-start gap-3 ${result.doctorNeeded ? "bg-red-50 border border-red-200" : "bg-emerald-50 border border-emerald-200"}`}>
                                {result.doctorNeeded
                                    ? <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                    : <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                }
                                <div>
                                    <p className={`text-sm font-bold ${result.doctorNeeded ? "text-red-800" : "text-emerald-800"}`}>
                                        {result.doctorNeeded ? "Doctor visit recommended" : "Home care likely sufficient"}
                                    </p>
                                    <p className={`text-sm mt-0.5 ${result.doctorNeeded ? "text-red-700" : "text-emerald-700"}`}>
                                        {result.advice}
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
                    {logs.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                            <Stethoscope className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p className="text-xs">No logs yet — analyze your first symptoms!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {logs.map(l => (
                                <div key={l.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 transition-all">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-xs font-medium text-slate-500">
                                            {new Date(l.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                        </span>
                                        <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${severityColor[l.severity] ?? "bg-slate-100 text-slate-600"}`}>
                                            {l.severity}
                                        </span>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-700">{l.possibleCondition}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{l.symptoms.slice(0, 4).join(", ")}{l.symptoms.length > 4 ? "…" : ""}</p>
                                </div>
                            ))}
                        </div>
                    )}

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
