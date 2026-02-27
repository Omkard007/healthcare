const steps = [
  {
    step: "01",
    title: "Create Account",
    desc: "Sign up in seconds with Google or email. No credit card needed.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    step: "02",
    title: "Fill Health Profile",
    desc: "Tell us your age, weight, conditions, and goals. Takes 2 minutes.",
    color: "from-violet-500 to-purple-500",
  },
  {
    step: "03",
    title: "Get Your Plan",
    desc: "Instant AI-generated diet, workout, and health insights just for you.",
    color: "from-emerald-500 to-teal-500",
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="py-24 bg-gray-900/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Up and running in 3 steps</h2>
          <p className="text-gray-400">No complicated setup. Just sign up and go.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div
              key={s.step}
              className="relative bg-gray-900/60 border border-white/5 rounded-2xl p-8 text-center"
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-6 shadow-lg`}
              >
                <span className="text-white font-bold text-xl">{s.step}</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}