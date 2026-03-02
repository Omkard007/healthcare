'use server'

import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export interface Exercise {
    name: string
    sets: string
    muscle: string
}

export interface WorkoutBlock {
    title: string
    duration: string
    calories: number
    difficulty: string
    tag: string
    exercises: Exercise[]
}

export interface WorkoutPlanData {
    id: string
    goal: string
    type: string
    difficulty: string
    exercises: WorkoutBlock[]
    createdAt: Date
}

const DEFAULT_WORKOUT_PLAN: {
    goal: string; type: string; difficulty: string; exercises: WorkoutBlock[]
} = {
    goal: "maintenance",
    type: "mixed",
    difficulty: "moderate",
    exercises: [
        {
            title: "Upper Body Strength",
            duration: "45 min",
            calories: 380,
            difficulty: "Moderate",
            tag: "Today's Focus",
            exercises: [
                { name: "Push-Ups", sets: "3 × 15", muscle: "Chest, Triceps" },
                { name: "Dumbbell Rows", sets: "3 × 12", muscle: "Back, Biceps" },
                { name: "Shoulder Press", sets: "3 × 10", muscle: "Shoulders" },
                { name: "Tricep Dips", sets: "2 × 12", muscle: "Triceps" },
                { name: "Plank", sets: "3 × 45s", muscle: "Core" },
            ]
        },
        {
            title: "Cardio & HIIT",
            duration: "30 min",
            calories: 310,
            difficulty: "Hard",
            tag: "Tomorrow",
            exercises: [
                { name: "Jump Rope", sets: "5 × 2 min", muscle: "Full Body" },
                { name: "Burpees", sets: "4 × 10", muscle: "Full Body" },
                { name: "Mountain Climbers", sets: "3 × 30s", muscle: "Core, Legs" },
                { name: "High Knees", sets: "3 × 30s", muscle: "Legs, Cardio" },
            ]
        },
        {
            title: "Yoga & Flexibility",
            duration: "40 min",
            calories: 180,
            difficulty: "Easy",
            tag: "Recovery",
            exercises: [
                { name: "Sun Salutation", sets: "5 rounds", muscle: "Full Body" },
                { name: "Warrior I & II", sets: "3 min each", muscle: "Legs, Core" },
                { name: "Seated Forward Fold", sets: "2 × 60s", muscle: "Hamstrings" },
                { name: "Savasana", sets: "5 min", muscle: "Recovery" },
            ]
        },
    ]
}

export async function getLatestWorkoutPlan(): Promise<{ success: boolean; data?: WorkoutPlanData | null; error?: string }> {
    try {
        const { userId: clerkId } = await auth()
        if (!clerkId) return { success: false, error: "Unauthorized" }

        const user = await prisma.user.findUnique({ where: { clerkId } })
        if (!user) return { success: false, error: "User not found" }

        const plan = await prisma.workoutPlan.findFirst({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        })

        if (!plan) return { success: true, data: null }

        return {
            success: true,
            data: {
                id: plan.id,
                goal: plan.goal,
                type: plan.type,
                difficulty: plan.difficulty,
                exercises: plan.exercises as unknown as WorkoutBlock[],
                createdAt: plan.createdAt,
            }
        }
    } catch (error) {
        console.error("Error fetching workout plan:", error)
        return { success: false, error: "Failed to fetch workout plan" }
    }
}

export async function generateDefaultWorkoutPlan(): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId: clerkId } = await auth()
        if (!clerkId) return { success: false, error: "Unauthorized" }

        const user = await prisma.user.findUnique({
            where: { clerkId },
            include: { healthProfile: true }
        })
        if (!user) return { success: false, error: "User not found" }

        const goal = user.healthProfile?.fitnessGoal ?? "maintenance"

        await prisma.workoutPlan.create({
            data: {
                userId: user.id,
                goal,
                type: DEFAULT_WORKOUT_PLAN.type,
                difficulty: DEFAULT_WORKOUT_PLAN.difficulty,
                exercises: DEFAULT_WORKOUT_PLAN.exercises as unknown as object[],
            }
        })

        return { success: true }
    } catch (error) {
        console.error("Error generating workout plan:", error)
        return { success: false, error: "Failed to generate workout plan" }
    }
}
