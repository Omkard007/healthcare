'use server'

import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export interface DailyLogInput {
    weightKg?: number
    steps?: number
    waterLiters?: number
    sleepHours?: number
    systolic?: number
    diastolic?: number
    glucoseMgDl?: number
}

export interface DailyLogData {
    id: string
    date: Date
    weightKg: number | null
    steps: number | null
    waterLiters: number | null
    sleepHours: number | null
    systolic: number | null
    diastolic: number | null
    glucoseMgDl: number | null
}

function startOfDay(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
function endOfDay(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999)
}

export async function upsertTodayLog(data: DailyLogInput): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId: clerkId } = await auth()
        if (!clerkId) return { success: false, error: "Unauthorized" }

        const user = await prisma.user.findUnique({ where: { clerkId } })
        if (!user) return { success: false, error: "User not found" }

        const now = new Date()
        const existing = await prisma.dailyLog.findFirst({
            where: {
                userId: user.id,
                date: { gte: startOfDay(now), lte: endOfDay(now) }
            }
        })

        if (existing) {
            await prisma.dailyLog.update({
                where: { id: existing.id },
                data: { ...data }
            })
        } else {
            await prisma.dailyLog.create({
                data: { userId: user.id, ...data }
            })
        }

        return { success: true }
    } catch (error) {
        console.error("Error upserting daily log:", error)
        return { success: false, error: "Failed to save daily log" }
    }
}

export async function getWeeklyLogs(): Promise<{ success: boolean; data?: DailyLogData[]; todayLog?: DailyLogData | null; error?: string }> {
    try {
        const { userId: clerkId } = await auth()
        if (!clerkId) return { success: false, error: "Unauthorized" }

        const user = await prisma.user.findUnique({ where: { clerkId } })
        if (!user) return { success: false, error: "User not found" }

        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
        sevenDaysAgo.setHours(0, 0, 0, 0)

        const logs = await prisma.dailyLog.findMany({
            where: { userId: user.id, date: { gte: sevenDaysAgo } },
            orderBy: { date: 'desc' },
            take: 7,
        })

        const now = new Date()
        const todayLog = logs.find(l =>
            l.date >= startOfDay(now) && l.date <= endOfDay(now)
        ) ?? null

        return { success: true, data: logs as DailyLogData[], todayLog: todayLog as DailyLogData | null }
    } catch (error) {
        console.error("Error fetching weekly logs:", error)
        return { success: false, error: "Failed to fetch logs" }
    }
}
