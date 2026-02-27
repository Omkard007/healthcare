"use client"

import Link from "next/link"
import { CheckCircle, Zap } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gray-950" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left copy */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
            <Zap className="w-3 h-3" />
            AI-Powered Health Intelligence
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Your Personal{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              Health OS
            </span>
          </h1>

          <p className="text-lg text-gray-400 mb-8 leading-relaxed">
            Manage your vitals, get AI meal plans, adaptive workouts, and instant symptom
            analysis — all designed for Indian bodies and lifestyles.
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/30"
            >
              Start Your Journey
            </Link>
            
          </div>

          <div className="flex flex-wrap gap-4">
            {["Free Forever Plan", "No Credit Card", "Indian Meal Plans"].map((t) => (
              <div key={t} className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Floating dashboard preview */}
        <div className="relative">
          <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl">
            {/* BMI Card */}
            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 rounded-xl p-4 mb-4">
              <p className="text-xs text-gray-400 mb-1">Your BMI</p>
              <p className="text-3xl font-bold text-white">22.4</p>
              <p className="text-xs text-emerald-400 mt-1">✓ Normal — Great work!</p>
              <div className="flex gap-1 mt-3">
                {["Under", "Normal", "Over", "Obese"].map((label, i) => (
                  <div
                    key={label}
                    className={`h-1.5 flex-1 rounded-full ${
                      i === 1 ? "bg-emerald-400" : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                {["Under", "Normal", "Over", "Obese"].map((label) => (
                  <span key={label} className="text-[10px] text-gray-500">
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Welcome */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-gray-500">Welcome back</p>
                <p className="text-sm font-semibold text-white">Priya Sharma 👋</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                P
              </div>
            </div>

            {/* Metrics */}
            {[
              { label: "Daily Calories", value: "1,800 kcal", pct: 65, color: "bg-blue-400" },
              { label: "Water Intake", value: "1.8 / 2.5 L", pct: 72, color: "bg-cyan-400" },
              { label: "Steps Today", value: "7,432", pct: 74, color: "bg-violet-400" },
            ].map((r) => (
              <div key={r.label} className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{r.label}</span>
                  <span className="text-white font-medium">{r.value}</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${r.color} rounded-full`}
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
              </div>
            ))}

            {/* Workout card */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 mt-4">
              <p className="text-xs text-gray-400 mb-1">Today&apos;s Workout</p>
              <p className="text-sm font-semibold text-white">Upper Body Strength</p>
              <p className="text-xs text-gray-500">45 min · Moderate</p>
              <div className="flex gap-0.5 mt-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 flex-1 rounded bg-gradient-to-t from-violet-500 to-purple-400 opacity-80"
                    style={{ height: `${12 + i * 4}px` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}