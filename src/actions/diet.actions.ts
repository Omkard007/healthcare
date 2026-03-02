'use server'

import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export interface MealItem {
    name: string
    cal: number
    protein: string
    carbs: string
    fat: string
}

export interface DietPlanData {
    id: string
    goal: string
    breakfast: MealItem[]
    lunch: MealItem[]
    dinner: MealItem[]
    snacks: MealItem[]
    totalCalories: number
    totalProtein: number
    createdAt: Date
}

const DEFAULT_DIET_PLAN = {
    goal: "maintenance",
    breakfast: [
        { name: "Steel-cut Oats with Almonds", cal: 280, protein: "12g", carbs: "48g", fat: "7g" },
        { name: "Banana + Mixed Berries", cal: 90, protein: "1g", carbs: "22g", fat: "0g" },
        { name: "Green Tea", cal: 5, protein: "0g", carbs: "1g", fat: "0g" },
    ],
    lunch: [
        { name: "Brown Rice (1 cup)", cal: 215, protein: "5g", carbs: "45g", fat: "2g" },
        { name: "Dal Tadka", cal: 180, protein: "10g", carbs: "28g", fat: "4g" },
        { name: "Mixed Vegetable Sabzi", cal: 120, protein: "3g", carbs: "18g", fat: "4g" },
        { name: "Cucumber Raita", cal: 60, protein: "3g", carbs: "7g", fat: "2g" },
    ],
    snacks: [
        { name: "Apple with Peanut Butter", cal: 180, protein: "5g", carbs: "25g", fat: "8g" },
        { name: "Black Coffee", cal: 5, protein: "0g", carbs: "0g", fat: "0g" },
    ],
    dinner: [
        { name: "2 Multigrain Rotis", cal: 175, protein: "5g", carbs: "32g", fat: "3g" },
        { name: "Palak Paneer", cal: 220, protein: "12g", carbs: "18g", fat: "12g" },
        { name: "Side Salad", cal: 45, protein: "1g", carbs: "8g", fat: "1g" },
    ],
    totalCalories: 1575,
    totalProtein: 57,
}

export async function getLatestDietPlan(): Promise<{ success: boolean; data?: DietPlanData | null; error?: string }> {
    try {
        const { userId: clerkId } = await auth()
        if (!clerkId) return { success: false, error: "Unauthorized" }

        const user = await prisma.user.findUnique({ where: { clerkId } })
        if (!user) return { success: false, error: "User not found" }

        const plan = await prisma.dietPlan.findFirst({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        })

        if (!plan) return { success: true, data: null }

        return {
            success: true,
            data: {
                id: plan.id,
                goal: plan.goal,
                breakfast: plan.breakfast as unknown as MealItem[],
                lunch: plan.lunch as unknown as MealItem[],
                dinner: plan.dinner as unknown as MealItem[],
                snacks: plan.snacks as unknown as MealItem[],
                totalCalories: plan.totalCalories,
                totalProtein: plan.totalProtein,
                createdAt: plan.createdAt,
            }
        }
    } catch (error) {
        console.error("Error fetching diet plan:", error)
        return { success: false, error: "Failed to fetch diet plan" }
    }
}

export async function generateDefaultDietPlan(): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId: clerkId } = await auth()
        if (!clerkId) return { success: false, error: "Unauthorized" }

        const user = await prisma.user.findUnique({
            where: { clerkId },
            include: { healthProfile: true }
        })
        if (!user) return { success: false, error: "User not found" }

        const goal = user.healthProfile?.fitnessGoal ?? "maintenance"

        await prisma.dietPlan.create({
            data: {
                userId: user.id,
                goal,
                breakfast: DEFAULT_DIET_PLAN.breakfast as unknown as object[],
                lunch: DEFAULT_DIET_PLAN.lunch as unknown as object[],
                dinner: DEFAULT_DIET_PLAN.dinner as unknown as object[],
                snacks: DEFAULT_DIET_PLAN.snacks as unknown as object[],
                totalCalories: DEFAULT_DIET_PLAN.totalCalories,
                totalProtein: DEFAULT_DIET_PLAN.totalProtein,
            }
        })

        return { success: true }
    } catch (error) {
        console.error("Error generating diet plan:", error)
        return { success: false, error: "Failed to generate diet plan" }
    }
}
