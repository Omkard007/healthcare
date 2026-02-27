import Link from "next/link"
import { Shield } from "lucide-react"

export default function CTA() {
  return (
    <section className="py-24 bg-gray-900/30">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-3xl p-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Start taking control of your health today
          </h2>
          <p className="text-gray-400 mb-8">
            Join thousands who transformed their health with VitalAI. It&apos;s free.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/30 text-lg"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </section>
  )
}