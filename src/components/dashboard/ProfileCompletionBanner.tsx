import Link from "next/link"
import { AlertCircle } from "lucide-react"

export function ProfileCompletionBanner() {
    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <AlertCircle className="h-4.5 w-4.5 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-blue-900">Complete your health profile</h3>
                    <p className="text-sm text-blue-700 mt-0.5">
                        We need a few details to generate your personalised BMI, calorie targets and health insights.
                    </p>
                </div>
            </div>
            <Link
                href="/dashboard/profile"
                className="shrink-0 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-100 transition-all"
            >
                Complete Profile
            </Link>
        </div>
    )
}
