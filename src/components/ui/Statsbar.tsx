const stats = [
  { value: "98%", label: "User Satisfaction" },
  { value: "50K+", label: "Health Profiles" },
  { value: "2M+", label: "Logs Tracked" },
  { value: "24/7", label: "AI Availability" },
]

export default function StatsBar() {
  return (
    <section className="bg-gray-900/50 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              {s.value}
            </p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}