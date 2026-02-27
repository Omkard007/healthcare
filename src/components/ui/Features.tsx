import { Heart, Utensils, Dumbbell, Brain, TrendingUp, Bell } from "lucide-react"

const features = [
  {
    icon: Heart,
    title: "BMI & Health Score",
    desc: "Track your body mass index with real-time calculations and get your personal health score.",
    color: "from-rose-400 to-pink-600",
  },
  {
    icon: Utensils,
    title: "Personalized Diet",
    desc: "AI-crafted Indian meal plans tailored to your conditions, allergies, and goals.",
    color: "from-amber-400 to-orange-600",
  },
  {
    icon: Dumbbell,
    title: "Adaptive Workouts",
    desc: "Dynamic fitness programs that evolve with your progress and activity level.",
    color: "from-violet-400 to-purple-600",
  },
  {
    icon: Brain,
    title: "Symptom Analyzer",
    desc: "Describe your symptoms and get AI-powered insights and when to see a doctor.",
    color: "from-blue-400 to-indigo-600",
  },
  {
    icon: TrendingUp,
    title: "Daily Tracker",
    desc: "Log vitals like blood pressure, glucose, steps, water, and sleep every day.",
    color: "from-emerald-400 to-teal-600",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    desc: "Proactive health alerts when your metrics trend outside your personal safe range.",
    color: "from-fuchsia-400 to-pink-600",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm text-emerald-400 font-medium mb-3">Everything you need</p>
          <h2 className="text-4xl font-bold text-white mb-4">All your health, one platform</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            From BMI tracking to AI meal planning — designed around your unique health needs.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="group bg-gray-900/60 border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}