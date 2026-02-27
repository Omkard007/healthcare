import { Activity } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-white/5 py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold text-white">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
            <Activity className="w-3 h-3 text-white" />
          </div>
          VitalAI
        </div>
        <p className="text-sm text-gray-500">
          © 2026 VitalAI. Made with ❤️ for better health.
        </p>
      </div>
    </footer>
  )
}