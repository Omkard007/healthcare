'use server'

import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export interface AlertData {
    id: string
    type: string
    message: string
    severity: string
    read: boolean
    createdAt: Date
}

export async function getAlerts(): Promise<{ success: boolean; data?: AlertData[]; error?: string }> {
    try {
        const { userId: clerkId } = await auth()
        if (!clerkId) return { success: false, error: "Unauthorized" }

        const user = await prisma.user.findUnique({ where: { clerkId } })
        if (!user) return { success: false, error: "User not found" }

        const alerts = await prisma.alert.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        })

        return { success: true, data: alerts as AlertData[] }
    } catch (error) {
        console.error("Error fetching alerts:", error)
        return { success: false, error: "Failed to fetch alerts" }
    }
}

export async function markAlertRead(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId: clerkId } = await auth()
        if (!clerkId) return { success: false, error: "Unauthorized" }

        const user = await prisma.user.findUnique({ where: { clerkId } })
        if (!user) return { success: false, error: "User not found" }

        await prisma.alert.update({
            where: { id, userId: user.id },
            data: { read: true }
        })

        return { success: true }
    } catch (error) {
        console.error("Error marking alert read:", error)
        return { success: false, error: "Failed to update alert" }
    }
}

export async function dismissAlert(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId: clerkId } = await auth()
        if (!clerkId) return { success: false, error: "Unauthorized" }

        const user = await prisma.user.findUnique({ where: { clerkId } })
        if (!user) return { success: false, error: "User not found" }

        await prisma.alert.delete({
            where: { id, userId: user.id }
        })

        return { success: true }
    } catch (error) {
        console.error("Error dismissing alert:", error)
        return { success: false, error: "Failed to dismiss alert" }
    }
}

export async function markAllAlertsRead(): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId: clerkId } = await auth()
        if (!clerkId) return { success: false, error: "Unauthorized" }

        const user = await prisma.user.findUnique({ where: { clerkId } })
        if (!user) return { success: false, error: "User not found" }

        await prisma.alert.updateMany({
            where: { userId: user.id, read: false },
            data: { read: true }
        })

        return { success: true }
    } catch (error) {
        console.error("Error marking all alerts read:", error)
        return { success: false, error: "Failed to update alerts" }
    }
}

export async function seedDefaultAlerts(): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId: clerkId } = await auth()
        if (!clerkId) return { success: false, error: "Unauthorized" }

        const user = await prisma.user.findUnique({ where: { clerkId } })
        if (!user) return { success: false, error: "User not found" }

        const existing = await prisma.alert.findFirst({ where: { userId: user.id } })
        if (existing) return { success: true } // already seeded

        await prisma.alert.createMany({
            data: [
                { userId: user.id, type: "BP", message: "Your systolic pressure was elevated recently. Monitor closely and consider reducing salt intake.", severity: "warning", read: false },
                { userId: user.id, type: "Sleep", message: "You've averaged below your sleep target this week. Aim to sleep by 10:30 PM tonight.", severity: "warning", read: false },
                { userId: user.id, type: "Hydration", message: "Hydration below target. Drink more water throughout the day to stay focused and healthy.", severity: "info", read: false },
                { userId: user.id, type: "Streak", message: "Congratulations! Keep logging consistently to build healthy habits.", severity: "success", read: true },
            ]
        })

        return { success: true }
    } catch (error) {
        console.error("Error seeding alerts:", error)
        return { success: false, error: "Failed to seed alerts" }
    }
}
