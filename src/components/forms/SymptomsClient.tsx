"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
    Stethoscope,
    Search,
    AlertCircle,
    CheckCircle,
    Clock,
    ChevronRight,
    Brain,
    Activity
} from "lucide-react"
import { createSymptomLog, SymptomLogData } from "@/actions/symptoms.actions"

type Severity = "Mild" | "Moderate" | "Severe"

interface AnalysisResult {
    possibleCondition: string
    severity: Severity
    advice: string
    doctorNeeded: boolean
    confidence: number
    riskScore: number
}

/* ============================
   MEDICAL TRIAGE ENGINE
============================ */

const symptomOptions = [
    "Headache", "Fever", "Cough", "Fatigue", "Nausea", "Body Ache",
    "Chest Pain", "Shortness of Breath", "Dizziness", "Sore Throat",
    "Runny Nose", "Abdominal Pain", "Joint Pain", "Back Pain", "Rash",
]

const normalize = (arr: string[]) =>
    arr.map(s => s.toLowerCase())

function analyzeSymptoms(symptoms: string[]): AnalysisResult {
    const s = normalize(symptoms)

    let riskScore = 0
    let confidence = 40
   let severity: Severity = "Mild" as Severity
    let doctorNeeded = false
    let possibleCondition = "Non-Specific Viral / General Condition"
    let advice =
        "Rest adequately, maintain hydration, light diet, and monitor symptoms for 48 hours."

    /* ======================
       EMERGENCY OVERRIDES
    ====================== */

    if (s.includes("chest pain") && s.includes("shortness of breath")) {
        return {
            possibleCondition: "Possible Cardiac Event (Heart-related emergency)",
            severity: "Severe",
            doctorNeeded: true,
            riskScore: 95,
            confidence: 90,
            advice:
                "Seek emergency medical care immediately. Do not delay. This may indicate heart attack or serious lung condition."
        }
    }

    if (s.includes("shortness of breath")) {
        return {
            possibleCondition: "Respiratory Distress / Asthma / Lung Infection",
            severity: "Severe",
            doctorNeeded: true,
            riskScore: 90,
            confidence: 85,
            advice:
                "Seek urgent medical attention. Difficulty breathing requires immediate evaluation."
        }
    }

    /* ======================
       COMBINATION LOGIC
    ====================== */

    if (s.includes("fever") && s.includes("cough") && s.includes("body ache")) {
        possibleCondition = "Influenza (Flu)"
        severity = "Moderate"
        riskScore = 70
        confidence = 85
        advice =
            "Rest, fluids, paracetamol 500mg if fever above 100°F (consult doctor before use), warm fluids, and monitor for 3 days."
    }

    if (s.includes("fever") && s.includes("rash")) {
        possibleCondition = "Viral Fever / Possible Dengue-like Illness"
        severity = "Moderate"
        doctorNeeded = true
        riskScore = 75
        confidence = 80
        advice =
            "Get blood tests if fever persists. Monitor platelet count. Avoid NSAIDs unless prescribed."
    }

    if (s.includes("cough") && s.includes("sore throat") && s.includes("runny nose")) {
        possibleCondition = "Common Cold"
        severity = "Mild"
        riskScore = 40
        confidence = 90
        advice =
            "Steam inhalation, warm salt water gargle, hydration, rest. Usually resolves in 5–7 days."
    }

    if (s.includes("headache") && s.includes("fatigue") && s.includes("dizziness")) {
        possibleCondition = "Dehydration / Low Blood Pressure"
        severity = "Mild"
        riskScore = 35
        confidence = 75
        advice =
            "Drink ORS, increase fluids, avoid sudden standing, rest well."
    }

    if (s.includes("abdominal pain") && s.includes("nausea")) {
        possibleCondition = "Gastritis / Food-related Irritation"
        severity = "Moderate"
        riskScore = 55
        confidence = 80
        advice =
            "Eat light meals, avoid oily/spicy food, oral rehydration. Consult doctor if pain severe."
    }

    /* ======================
       SINGLE SYMPTOM LOGIC
    ====================== */

    if (symptoms.length === 1) {
        switch (s[0]) {
            case "headache":
                possibleCondition = "Tension Headache"
                advice = "Hydrate, reduce screen time, rest."
                confidence = 70
                break

            case "fever":
                possibleCondition = "Mild Viral Fever"
                advice = "Monitor temperature. Hydrate well."
                confidence = 65
                break

            case "cough":
                possibleCondition = "Irritative / Mild Viral Cough"
                advice = "Steam inhalation, honey (if non-diabetic)."
                confidence = 60
                break

            case "fatigue":
                possibleCondition = "Lifestyle Fatigue / Sleep Deficit"
                advice = "Sleep 7–8 hours, balanced diet."
                confidence = 60
                break

            case "nausea":
                possibleCondition = "Acidity / Mild Gastric Disturbance"
                advice = "Small frequent meals, avoid oily food."
                confidence = 60
                break

            case "back pain":
                possibleCondition = "Muscular Strain"
                advice = "Hot compress, posture correction."
                confidence = 70
                break

            case "joint pain":
                possibleCondition = "Inflammatory / Overuse Joint Pain"
                advice = "Rest, gentle stretching."
                confidence = 65
                break

            case "rash":
                possibleCondition = "Allergic Reaction"
                advice = "Avoid allergen, apply soothing lotion."
                confidence = 65
                break
        }
    }

    /* ======================
       ESCALATION RULES
    ====================== */

    if (symptoms.length >= 5 && severity !== "Severe") {
        severity = "Moderate"
        doctorNeeded = true
        riskScore += 15
        advice =
            "Multiple symptoms detected. Seek medical evaluation if no improvement in 48 hours."
    }

    if (riskScore >= 80) severity = "Severe"
    else if (riskScore >= 50) severity = "Moderate"

    return {
        possibleCondition,
        severity,
        advice,
        doctorNeeded,
        confidence,
        riskScore
    }
}

/* ============================
   UI COMPONENT
============================ */

const severityColor: Record<string, string> = {
    Mild: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Moderate: "bg-amber-100 text-amber-700 border-amber-200",
    Severe: "bg-red-100 text-red-700 border-red-200",
}

interface Props {
    recentLogs: SymptomLogData[]
}

export function SymptomsClient({ recentLogs }: Props) {
    const router = useRouter()
    const [selected, setSelected] = useState<string[]>([])
    const [result, setResult] = useState<AnalysisResult | null>(null)
    const [isPending, startTransition] = useTransition()
    const [logs, setLogs] = useState<SymptomLogData[]>(recentLogs)

    const toggle = (s: string) =>
        setSelected(prev =>
            prev.includes(s)
                ? prev.filter(x => x !== s)
                : [...prev, s]
        )

    const analyze = () => {
        if (!selected.length) return

        startTransition(async () => {
            const analysis = analyzeSymptoms(selected)
            setResult(analysis)

            await createSymptomLog({
                symptoms: selected,
                possibleCondition: analysis.possibleCondition,
                severity: analysis.severity,
                advice: analysis.advice,
                doctorNeeded: analysis.doctorNeeded,
            })

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
