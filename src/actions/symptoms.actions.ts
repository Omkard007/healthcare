'use server'

import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export interface SymptomLogInput {
    symptoms: string[]
    possibleCondition: string
    severity: string
    advice: string
    doctorNeeded: boolean
}

export interface SymptomLogData {
    id: string
    symptoms: string[]
    possibleCondition: string
    severity: string
    advice: string
    doctorNeeded: boolean
    createdAt: Date
}

export async function createSymptomLog(data: SymptomLogInput): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId: clerkId } = await auth()
        if (!clerkId) return { success: false, error: "Unauthorized" }

        const user = await prisma.user.findUnique({ where: { clerkId } })
        if (!user) return { success: false, error: "User not found" }

        await prisma.symptomLog.create({
            data: {
                userId: user.id,
                symptoms: data.symptoms,
                possibleCondition: data.possibleCondition,
                severity: data.severity,
                advice: data.advice,
                doctorNeeded: data.doctorNeeded,
            }
        })

        return { success: true }
    } catch (error) {
        console.error("Error creating symptom log:", error)
        return { success: false, error: "Failed to save symptom log" }
    }
}

export async function getSymptomLogs(): Promise<{ success: boolean; data?: SymptomLogData[]; error?: string }> {
    try {
        const { userId: clerkId } = await auth()
        if (!clerkId) return { success: false, error: "Unauthorized" }

        const user = await prisma.user.findUnique({ where: { clerkId } })
        if (!user) return { success: false, error: "User not found" }

        const logs = await prisma.symptomLog.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 10,
        })

        return { success: true, data: logs as SymptomLogData[] }
    } catch (error) {
        console.error("Error fetching symptom logs:", error)
        return { success: false, error: "Failed to fetch symptom logs" }
    }
}
