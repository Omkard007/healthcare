"use client"

import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "success" | "warning" | "danger"
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2",
                {
                    "bg-slate-100 text-slate-800": variant === "default",
                    "bg-emerald-100 text-emerald-700": variant === "success",
                    "bg-amber-100 text-amber-700": variant === "warning",
                    "bg-red-100 text-red-700": variant === "danger",
                },
                className
            )}
            {...props}
        />
    )
}
