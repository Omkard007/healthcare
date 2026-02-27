import Navbar from "@/components/ui/Navbar"
import Hero from "@/components/ui/Hero"
import StatsBar from "@/components/ui/Statsbar"
import Features from "@/components/ui/Features"
import HowItWorks from "@/components/ui/Howitworks"
import Testimonials from "@/components/ui/Testimonials"
import CTA from "@/components/ui/Cta"
import Footer from "@/components/ui/Footer"

export default function LandingPage() {
  return (
    <main className="bg-gray-950 text-white min-h-screen">
      <Navbar />
      <Hero />
      <StatsBar />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  )
}