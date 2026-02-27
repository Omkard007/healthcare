"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Activity, Menu, X } from "lucide-react"
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs"

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how" },
  { label: "Testimonials", href: "#testimonials" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-out ${
          scrolled
            ? "bg-gray-950/75 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            : "bg-transparent"
        }`}
      >
        {/* Subtle top accent line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="h-[62px] flex items-center justify-between gap-6">

            {/* ── Logo ── */}
            <Link
              href="/"
              className="group flex items-center gap-2.5 shrink-0"
            >
              <div className="relative w-8 h-8 rounded-[10px] bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-shadow duration-300">
                {/* Inner glow */}
                <div className="absolute inset-0 rounded-[10px] bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Activity className="w-[18px] h-[18px] text-white relative z-10" />
              </div>
              <span className="text-[17px] font-semibold tracking-tight text-white">
                Vital<span className="text-emerald-400">AI</span>
              </span>
            </Link>

            {/* ── Desktop nav links ── */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="relative px-3.5 py-2 text-[13.5px] font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all duration-200 group"
                >
                  {l.label}
                  {/* Hover underline dot */}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-200" />
                </Link>
              ))}
            </div>

            {/* ── Auth buttons ── */}
            <div className="flex items-center gap-2 shrink-0">
              <SignedOut>
                {/* Sign In — ghost */}
                <SignInButton mode="modal">
                  <button className="hidden sm:flex items-center h-9 px-4 text-[13px] font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-all duration-200">
                    Sign in
                  </button>
                </SignInButton>

                {/* Sign Up — gradient pill */}
                <SignUpButton mode="modal">
                  <button className="relative flex items-center h-9 px-4 text-[13px] font-semibold text-white rounded-xl overflow-hidden group">
                    {/* Gradient background */}
                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:from-emerald-400 group-hover:to-teal-400" />
                    {/* Shine sweep */}
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(105deg,transparent_20%,rgba(255,255,255,0.18)_50%,transparent_80%)] group-hover:translate-x-full translate-x-[-100%]" style={{ transition: "opacity 0.3s, transform 0.6s" }} />
                    {/* Glow */}
                    <span className="absolute inset-0 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative">Get started</span>
                  </button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                {/* User button with custom styling wrapper */}
                <div className="flex items-center gap-3">
                  {/* Divider */}
                  <div className="hidden sm:block w-px h-5 bg-white/10" />
                  <div className="ring-2 ring-white/10 hover:ring-emerald-500/40 rounded-full transition-all duration-300">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8",
                        },
                      }}
                    />
                  </div>
                </div>
              </SignedIn>

              {/* Mobile menu toggle */}
              <button
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-all duration-200 ml-1"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-5 pb-5 pt-2 border-t border-white/[0.06] bg-gray-950/90 backdrop-blur-2xl space-y-1">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center h-10 px-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all duration-150"
              >
                {l.label}
              </Link>
            ))}

            <SignedOut>
              <div className="pt-2 flex flex-col gap-2">
                <SignInButton mode="modal">
                  <button className="w-full h-10 text-sm font-medium text-gray-300 hover:text-white border border-white/10 hover:border-white/20 rounded-xl transition-all duration-200">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full h-10 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-200">
                    Get started free
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      </nav>
    </>
  )
}