import { Sidebar } from "@/components/layout/Sidebar"
import { DashboardHeader } from "@/components/layout/DashboardHeader"
import { MobileNav } from "@/components/layout/MobileNav"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* Desktop sidebar */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                {/* Header with mobile nav trigger */}
                <div className="flex items-center md:hidden h-16 px-4 bg-white border-b border-slate-100 gap-3 sticky top-0 z-30">
                    <MobileNav />
                    <span className="text-lg font-extrabold text-slate-900">VitalAI</span>
                </div>

                <div className="hidden md:block">
                    <DashboardHeader />
                </div>

                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-thin">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
