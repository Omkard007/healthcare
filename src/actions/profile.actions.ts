'use server'

import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { calculateBMI, calculateBMR, calculateDailyCalories } from "@/lib/calculations"
import { HealthProfileInput } from "@/types"

export async function upsertHealthProfile(data: HealthProfileInput): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId: clerkId } = await auth()

        if (!clerkId) {
            return { success: false, error: "Unauthorized" }
        }

        const user = await prisma.user.findUnique({
            where: { clerkId }
        })

        if (!user) {
            return { success: false, error: "User not found" }
        }

        const bmi = calculateBMI(data.weightKg, data.heightCm);
        const bmr = calculateBMR(data.weightKg, data.heightCm, data.age, data.gender);
        const dailyCalories = calculateDailyCalories(bmr, data.activityLevel, data.fitnessGoal);

        await prisma.healthProfile.upsert({
            where: {
                userId: user.id
            },
            update: {
                ...data,
                bmi,
                bmr,
                dailyCalories
            },
            create: {
                userId: user.id,
                ...data,
                bmi,
                bmr,
                dailyCalories
            }
        })

        return { success: true }
    } catch (error) {
        console.error("Error upserting health profile:", error)
        return { success: false, error: "Failed to save health profile" }
    }
}
