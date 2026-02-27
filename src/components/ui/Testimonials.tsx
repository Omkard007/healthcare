import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Diabetic patient",
    text: "VitalAI helped me manage my glucose levels with a personalized diet plan. My HbA1c dropped from 8.2 to 6.4 in 3 months!",
    avatar: "PS",
  },
  {
    name: "Raj Mehta",
    role: "Fitness enthusiast",
    text: "The workout plans adapt perfectly to my schedule. I've lost 12 kg and feel stronger than ever!",
    avatar: "RM",
  },
  {
    name: "Dr. Anjali Nair",
    role: "Cardiologist",
    text: "I recommend VitalAI to all my patients. The symptom checker accurately flags when they need urgent care.",
    avatar: "AN",
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Loved by thousands</h2>
          <p className="text-gray-400">Real results from real users across India.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-gray-900/60 border border-white/5 rounded-2xl p-6"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">&quot;{t.text}&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}