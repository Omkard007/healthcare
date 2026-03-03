'use server'

import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export interface Exercise {
    name: string
    sets?: number
    reps?: string
    duration?: string
    rest?: string
    notes?: string
}

export interface WorkoutPlanData {
    id: string
    goal: string
    type: string
    difficulty: string
    exercises: Exercise[]
    createdAt: Date
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const SUNDAY_CARDIO: Exercise[] = [
    { name: "Brisk Walk / Light Jog", duration: "30 min", notes: "Keep HR at 50–60% max" },
    { name: "Deep Breathing & Stretching", duration: "10 min" },
    { name: "Foam Rolling (full body)", duration: "10 min" },
]

type DayIndex = 1 | 2 | 3 | 4 | 5 | 6
type Difficulty = "beginner" | "intermediate" | "advanced"
interface DayPlan { type: string; exercises: Exercise[] }

// ─── Full Workout Library ─────────────────────────────────────────────────────
// Goals:       fat_loss | muscle_gain | maintenance | diabetic_friendly
// Difficulty:  beginner (Sedentary/Light) | intermediate (Moderate) | advanced (Active/Very Active)
// Days:        1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat  |  0=Sun always cardio

const WORKOUT_LIBRARY: Record<string, Record<Difficulty, Record<DayIndex, DayPlan>>> = {

    // ═══════════════════════════════════════════════════════════════════════════
    // FAT LOSS
    // ═══════════════════════════════════════════════════════════════════════════
    fat_loss: {
        beginner: {
            1: { type: "Full Body Circuit", exercises: [
                { name: "Jumping Jacks", sets: 3, reps: "30 sec", rest: "15 sec" },
                { name: "Bodyweight Squats", sets: 3, reps: "15", rest: "30 sec" },
                { name: "Push-ups (knee)", sets: 3, reps: "10", rest: "30 sec" },
                { name: "Glute Bridges", sets: 3, reps: "15", rest: "30 sec" },
                { name: "Mountain Climbers", sets: 3, reps: "20 sec", rest: "20 sec" },
                { name: "Brisk Walk", duration: "20 min" },
            ]},
            2: { type: "Low-Impact Cardio", exercises: [
                { name: "Walking Lunges", sets: 3, reps: "10 each leg", rest: "40 sec" },
                { name: "Step-ups (chair)", sets: 3, reps: "12 each", rest: "30 sec" },
                { name: "Seated Leg Raises", sets: 3, reps: "15", rest: "30 sec" },
                { name: "Stationary Bike / Walk", duration: "25 min", notes: "Moderate pace" },
            ]},
            3: { type: "Upper Body + Core", exercises: [
                { name: "Wall Push-ups", sets: 3, reps: "15", rest: "30 sec" },
                { name: "DB Shoulder Press (light)", sets: 3, reps: "12", rest: "40 sec" },
                { name: "Plank Hold", sets: 3, reps: "20 sec", rest: "30 sec" },
                { name: "Bicycle Crunches", sets: 3, reps: "20", rest: "30 sec" },
                { name: "Jump Rope / Simulate", duration: "10 min" },
            ]},
            4: { type: "Active Recovery Walk", exercises: [
                { name: "Outdoor / Treadmill Walk", duration: "35 min", notes: "Incline 2–3%" },
                { name: "Hip Flexor Stretch", duration: "5 min" },
                { name: "Full Body Stretch", duration: "10 min" },
            ]},
            5: { type: "Lower Body Burn", exercises: [
                { name: "Squats", sets: 4, reps: "15", rest: "40 sec" },
                { name: "Side-lying Leg Raises", sets: 3, reps: "15 each", rest: "30 sec" },
                { name: "Calf Raises", sets: 3, reps: "20", rest: "20 sec" },
                { name: "Wall Sit", sets: 3, reps: "30 sec", rest: "40 sec" },
                { name: "Jogging in Place", duration: "15 min" },
            ]},
            6: { type: "HIIT Lite + Stretch", exercises: [
                { name: "High Knees", sets: 4, reps: "30 sec", rest: "20 sec" },
                { name: "Burpees (modified)", sets: 3, reps: "8", rest: "40 sec" },
                { name: "Jump Squats (low impact)", sets: 3, reps: "10", rest: "40 sec" },
                { name: "Cool-down Walk", duration: "10 min" },
                { name: "Full Body Stretch", duration: "10 min" },
            ]},
        },
        intermediate: {
            1: { type: "HIIT Circuit", exercises: [
                { name: "Burpees", sets: 4, reps: "12", rest: "30 sec" },
                { name: "Jump Squats", sets: 4, reps: "15", rest: "30 sec" },
                { name: "Push-ups", sets: 4, reps: "15", rest: "30 sec" },
                { name: "Kettlebell / DB Swings", sets: 4, reps: "15", rest: "40 sec" },
                { name: "Box Jumps", sets: 3, reps: "10", rest: "40 sec" },
                { name: "Treadmill Run", duration: "15 min", notes: "8–9 km/h" },
            ]},
            2: { type: "Upper Body Strength + Cardio", exercises: [
                { name: "Pull-ups / Assisted Pull-ups", sets: 4, reps: "8", rest: "60 sec" },
                { name: "DB Bench Press", sets: 4, reps: "12", rest: "60 sec" },
                { name: "DB Rows", sets: 4, reps: "12 each", rest: "60 sec" },
                { name: "Shoulder Press", sets: 3, reps: "12", rest: "60 sec" },
                { name: "Jump Rope", duration: "15 min" },
            ]},
            3: { type: "Lower Body Strength", exercises: [
                { name: "Barbell / Goblet Squats", sets: 4, reps: "12", rest: "60 sec" },
                { name: "Romanian Deadlifts", sets: 4, reps: "12", rest: "60 sec" },
                { name: "Walking Lunges with DB", sets: 3, reps: "12 each", rest: "60 sec" },
                { name: "Leg Press", sets: 3, reps: "15", rest: "60 sec" },
                { name: "Stair Climber", duration: "15 min" },
            ]},
            4: { type: "Core + Steady State Cardio", exercises: [
                { name: "Plank", sets: 4, reps: "45 sec", rest: "30 sec" },
                { name: "Russian Twists", sets: 3, reps: "20", rest: "30 sec" },
                { name: "Hanging Leg Raises", sets: 3, reps: "12", rest: "40 sec" },
                { name: "Ab Wheel Rollout", sets: 3, reps: "10", rest: "40 sec" },
                { name: "Jog / Elliptical", duration: "25 min", notes: "Moderate pace" },
            ]},
            5: { type: "Full Body HIIT", exercises: [
                { name: "Thrusters (DB)", sets: 4, reps: "12", rest: "40 sec" },
                { name: "Battle Ropes", sets: 4, reps: "30 sec", rest: "30 sec" },
                { name: "Box Jumps", sets: 4, reps: "12", rest: "40 sec" },
                { name: "Sled Push / Sprint", sets: 4, reps: "20 m", rest: "60 sec" },
            ]},
            6: { type: "Cardio Endurance", exercises: [
                { name: "Run / Cycle", duration: "40 min", notes: "Zone 2 — conversational pace" },
                { name: "Core Finisher: Plank Variations", duration: "10 min" },
            ]},
        },
        advanced: {
            1: { type: "Metabolic Conditioning", exercises: [
                { name: "Barbell Complex (DL→Row→Hang Clean→Press)", sets: 5, reps: "6", rest: "90 sec" },
                { name: "Assault Bike Sprints", sets: 6, reps: "20 sec on / 10 sec off" },
                { name: "Weighted Vest Box Jumps", sets: 4, reps: "8", rest: "60 sec" },
                { name: "Burpee Pull-ups", sets: 3, reps: "10", rest: "60 sec" },
            ]},
            2: { type: "Upper Strength + Cardio Intervals", exercises: [
                { name: "Weighted Pull-ups", sets: 5, reps: "6", rest: "90 sec" },
                { name: "Barbell Bench Press", sets: 5, reps: "6", rest: "90 sec" },
                { name: "Pendlay Rows", sets: 4, reps: "8", rest: "90 sec" },
                { name: "Overhead Press", sets: 4, reps: "8", rest: "90 sec" },
                { name: "Treadmill Incline Sprint Intervals", duration: "15 min" },
            ]},
            3: { type: "Lower Power + Cardio", exercises: [
                { name: "Back Squat", sets: 5, reps: "5", rest: "2 min", notes: "85%+ 1RM" },
                { name: "Romanian Deadlift", sets: 4, reps: "8", rest: "90 sec" },
                { name: "Bulgarian Split Squat", sets: 3, reps: "8 each", rest: "90 sec" },
                { name: "Sled Drag", sets: 4, reps: "20 m", rest: "60 sec" },
                { name: "Run", duration: "15 min", notes: "Fast pace" },
            ]},
            4: { type: "Active Recovery + Mobility", exercises: [
                { name: "Yoga Flow / Mobility Circuit", duration: "30 min" },
                { name: "Swimming / Light Swim", duration: "20 min", notes: "Optional" },
                { name: "Foam Roll Full Body", duration: "10 min" },
            ]},
            5: { type: "CrossFit-style WOD", exercises: [
                { name: "Deadlift", sets: 3, reps: "5", rest: "2 min", notes: "Heavy" },
                { name: "AMRAP 20 min: 10 Pull-ups, 20 Push-ups, 30 Air Squats", duration: "20 min" },
                { name: "1-mile Run Cool-down", duration: "10 min" },
            ]},
            6: { type: "Long Cardio / Trail Run", exercises: [
                { name: "Run / Cycle / Row", duration: "50 min", notes: "Zone 2–3 steady state" },
                { name: "Core: L-Sit, Dragon Flag, Ab Wheel", sets: 3, reps: "8 each", rest: "60 sec" },
            ]},
        },
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // MUSCLE GAIN
    // ═══════════════════════════════════════════════════════════════════════════
    muscle_gain: {
        beginner: {
            1: { type: "Full Body — Compound Basics", exercises: [
                { name: "Goblet Squat", sets: 3, reps: "12", rest: "60 sec" },
                { name: "DB Bench Press", sets: 3, reps: "12", rest: "60 sec" },
                { name: "DB Row", sets: 3, reps: "12 each", rest: "60 sec" },
                { name: "DB Shoulder Press", sets: 3, reps: "10", rest: "60 sec" },
                { name: "Plank", sets: 3, reps: "30 sec", rest: "30 sec" },
            ]},
            2: { type: "Lower Body Focus", exercises: [
                { name: "Barbell / DB Squat", sets: 4, reps: "10", rest: "90 sec" },
                { name: "Romanian Deadlift", sets: 3, reps: "12", rest: "90 sec" },
                { name: "Leg Curl (machine)", sets: 3, reps: "12", rest: "60 sec" },
                { name: "Calf Raises", sets: 4, reps: "15", rest: "45 sec" },
                { name: "Glute Bridge", sets: 3, reps: "15", rest: "45 sec" },
            ]},
            3: { type: "Upper Body Push", exercises: [
                { name: "Incline DB Press", sets: 4, reps: "10", rest: "90 sec" },
                { name: "DB Lateral Raises", sets: 3, reps: "15", rest: "45 sec" },
                { name: "Tricep Pushdowns", sets: 3, reps: "12", rest: "60 sec" },
                { name: "Push-ups", sets: 3, reps: "max", rest: "60 sec" },
                { name: "Overhead DB Extension", sets: 3, reps: "12", rest: "60 sec" },
            ]},
            4: { type: "Upper Body Pull", exercises: [
                { name: "Lat Pulldown", sets: 4, reps: "10", rest: "90 sec" },
                { name: "Seated Cable Row", sets: 3, reps: "12", rest: "90 sec" },
                { name: "DB Bicep Curl", sets: 3, reps: "12", rest: "60 sec" },
                { name: "Face Pulls", sets: 3, reps: "15", rest: "45 sec" },
                { name: "Hammer Curls", sets: 3, reps: "12", rest: "60 sec" },
            ]},
            5: { type: "Full Body — Volume Day", exercises: [
                { name: "DB Squat", sets: 4, reps: "15", rest: "60 sec" },
                { name: "DB Chest Flyes", sets: 3, reps: "12", rest: "60 sec" },
                { name: "Inverted Row", sets: 3, reps: "12", rest: "60 sec" },
                { name: "DB Lunges", sets: 3, reps: "10 each", rest: "60 sec" },
                { name: "Cable Crunch", sets: 3, reps: "15", rest: "45 sec" },
            ]},
            6: { type: "Abs + Light Cardio", exercises: [
                { name: "Plank Variations", sets: 3, reps: "30–45 sec each", rest: "30 sec" },
                { name: "Hanging Knee Raises", sets: 3, reps: "12", rest: "30 sec" },
                { name: "Bicycle Crunches", sets: 3, reps: "20", rest: "30 sec" },
                { name: "Light Jog / Walk", duration: "20 min" },
            ]},
        },
        intermediate: {
            1: { type: "Push — Chest / Shoulders / Triceps", exercises: [
                { name: "Barbell Bench Press", sets: 4, reps: "8", rest: "90 sec" },
                { name: "Incline DB Press", sets: 4, reps: "10", rest: "90 sec" },
                { name: "Overhead Press", sets: 4, reps: "8", rest: "90 sec" },
                { name: "Lateral Raises", sets: 4, reps: "15", rest: "45 sec" },
                { name: "Skull Crushers", sets: 3, reps: "12", rest: "60 sec" },
            ]},
            2: { type: "Pull — Back / Biceps", exercises: [
                { name: "Weighted Pull-ups", sets: 4, reps: "8", rest: "90 sec" },
                { name: "Barbell Row", sets: 4, reps: "8", rest: "90 sec" },
                { name: "Seated Cable Row", sets: 3, reps: "12", rest: "60 sec" },
                { name: "DB Hammer Curl", sets: 3, reps: "12", rest: "60 sec" },
                { name: "Rear Delt Flyes", sets: 3, reps: "15", rest: "45 sec" },
            ]},
            3: { type: "Legs — Quad Dominant", exercises: [
                { name: "Back Squat", sets: 5, reps: "8", rest: "2 min" },
                { name: "Leg Press", sets: 4, reps: "12", rest: "90 sec" },
                { name: "Walking Lunges", sets: 3, reps: "12 each", rest: "90 sec" },
                { name: "Leg Extension", sets: 3, reps: "15", rest: "60 sec" },
                { name: "Standing Calf Raise", sets: 4, reps: "20", rest: "45 sec" },
            ]},
            4: { type: "Push — Volume", exercises: [
                { name: "DB Flat Press", sets: 4, reps: "12", rest: "75 sec" },
                { name: "Cable Crossover", sets: 3, reps: "15", rest: "60 sec" },
                { name: "Arnold Press", sets: 4, reps: "10", rest: "75 sec" },
                { name: "Tricep Dips", sets: 3, reps: "max", rest: "60 sec" },
                { name: "Cable Lateral Raise", sets: 3, reps: "15", rest: "45 sec" },
            ]},
            5: { type: "Pull — Volume", exercises: [
                { name: "Chest-supported Row", sets: 4, reps: "12", rest: "75 sec" },
                { name: "Single-arm DB Row", sets: 3, reps: "12 each", rest: "60 sec" },
                { name: "Straight-arm Pulldown", sets: 3, reps: "15", rest: "60 sec" },
                { name: "EZ-bar Curl", sets: 4, reps: "10", rest: "75 sec" },
                { name: "Concentration Curl", sets: 3, reps: "12", rest: "60 sec" },
            ]},
            6: { type: "Legs — Posterior Chain + Core", exercises: [
                { name: "Romanian Deadlift", sets: 4, reps: "10", rest: "90 sec" },
                { name: "Leg Curl", sets: 4, reps: "12", rest: "75 sec" },
                { name: "Bulgarian Split Squat", sets: 3, reps: "10 each", rest: "90 sec" },
                { name: "Hanging Leg Raise", sets: 3, reps: "12", rest: "45 sec" },
                { name: "Ab Wheel Rollout", sets: 3, reps: "10", rest: "45 sec" },
            ]},
        },
        advanced: {
            1: { type: "Chest / Shoulders / Triceps — Heavy", exercises: [
                { name: "Barbell Bench Press", sets: 5, reps: "5", rest: "2 min", notes: "85% 1RM" },
                { name: "Weighted Dips", sets: 4, reps: "8", rest: "90 sec" },
                { name: "Overhead Press", sets: 5, reps: "5", rest: "2 min" },
                { name: "Cable Lateral Raises", sets: 4, reps: "15", rest: "45 sec" },
                { name: "Close-grip Bench Press", sets: 3, reps: "8", rest: "90 sec" },
            ]},
            2: { type: "Back / Biceps — Heavy", exercises: [
                { name: "Deadlift", sets: 5, reps: "5", rest: "2–3 min", notes: "90% 1RM" },
                { name: "Weighted Pull-ups", sets: 4, reps: "6", rest: "2 min" },
                { name: "Pendlay Row", sets: 4, reps: "6", rest: "2 min" },
                { name: "Incline DB Curl", sets: 3, reps: "10", rest: "60 sec" },
                { name: "Meadows Row", sets: 3, reps: "8 each", rest: "75 sec" },
            ]},
            3: { type: "Legs — Squat Focus", exercises: [
                { name: "Back Squat", sets: 6, reps: "4", rest: "2–3 min", notes: "90% 1RM" },
                { name: "Pause Squat", sets: 3, reps: "5", rest: "2 min" },
                { name: "Hack Squat", sets: 4, reps: "10", rest: "90 sec" },
                { name: "Leg Curl", sets: 4, reps: "10", rest: "75 sec" },
                { name: "Seated Calf Raise", sets: 5, reps: "15", rest: "45 sec" },
            ]},
            4: { type: "Chest / Shoulders / Triceps — Volume", exercises: [
                { name: "Incline Barbell Press", sets: 5, reps: "10", rest: "90 sec" },
                { name: "Cable Flyes (low-to-high)", sets: 4, reps: "15", rest: "60 sec" },
                { name: "DB Lateral Raises", sets: 5, reps: "15", rest: "45 sec" },
                { name: "Overhead Tricep Extension", sets: 4, reps: "12", rest: "60 sec" },
                { name: "Pec Deck", sets: 3, reps: "15", rest: "60 sec" },
            ]},
            5: { type: "Back / Biceps — Volume", exercises: [
                { name: "Chest-supported T-Bar Row", sets: 5, reps: "10", rest: "90 sec" },
                { name: "Wide-grip Pull-up", sets: 4, reps: "max", rest: "90 sec" },
                { name: "Straight-arm Pulldown", sets: 4, reps: "15", rest: "60 sec" },
                { name: "Spider Curl", sets: 4, reps: "12", rest: "60 sec" },
                { name: "Reverse Curl", sets: 3, reps: "15", rest: "45 sec" },
            ]},
            6: { type: "Legs — Posterior Chain", exercises: [
                { name: "Romanian Deadlift", sets: 5, reps: "8", rest: "2 min" },
                { name: "Glute Ham Raise", sets: 4, reps: "8", rest: "90 sec" },
                { name: "Bulgarian Split Squat", sets: 4, reps: "8 each", rest: "90 sec" },
                { name: "Nordic Hamstring Curl", sets: 3, reps: "6", rest: "90 sec" },
                { name: "Hip Thrust", sets: 4, reps: "12", rest: "75 sec" },
            ]},
        },
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // MAINTENANCE
    // ═══════════════════════════════════════════════════════════════════════════
    maintenance: {
        beginner: {
            1: { type: "Full Body Strength", exercises: [
                { name: "Goblet Squat", sets: 3, reps: "12", rest: "60 sec" },
                { name: "Push-ups", sets: 3, reps: "12", rest: "60 sec" },
                { name: "DB Row", sets: 3, reps: "12 each", rest: "60 sec" },
                { name: "Plank", sets: 3, reps: "30 sec", rest: "30 sec" },
            ]},
            2: { type: "Cardio + Flexibility", exercises: [
                { name: "Brisk Walk / Light Jog", duration: "30 min" },
                { name: "Full Body Stretch Routine", duration: "15 min" },
            ]},
            3: { type: "Upper Body", exercises: [
                { name: "DB Shoulder Press", sets: 3, reps: "12", rest: "60 sec" },
                { name: "Lat Pulldown", sets: 3, reps: "12", rest: "60 sec" },
                { name: "Bicep Curl", sets: 3, reps: "12", rest: "60 sec" },
                { name: "Tricep Pushdown", sets: 3, reps: "12", rest: "60 sec" },
            ]},
            4: { type: "Active Recovery", exercises: [
                { name: "Yoga / Mobility Flow", duration: "30 min" },
                { name: "Light Walk", duration: "15 min" },
            ]},
            5: { type: "Lower Body", exercises: [
                { name: "Leg Press", sets: 3, reps: "15", rest: "60 sec" },
                { name: "Romanian Deadlift", sets: 3, reps: "12", rest: "60 sec" },
                { name: "Calf Raises", sets: 3, reps: "20", rest: "30 sec" },
                { name: "Glute Bridge", sets: 3, reps: "15", rest: "45 sec" },
            ]},
            6: { type: "Cardio + Core", exercises: [
                { name: "Cycling / Elliptical", duration: "25 min" },
                { name: "Crunches", sets: 3, reps: "20", rest: "30 sec" },
                { name: "Plank", sets: 3, reps: "30 sec", rest: "30 sec" },
                { name: "Stretch", duration: "10 min" },
            ]},
        },
        intermediate: {
            1: { type: "Upper Body Strength", exercises: [
                { name: "Barbell Bench Press", sets: 4, reps: "10", rest: "90 sec" },
                { name: "Barbell Row", sets: 4, reps: "10", rest: "90 sec" },
                { name: "Overhead Press", sets: 3, reps: "10", rest: "75 sec" },
                { name: "Pull-ups", sets: 3, reps: "max", rest: "75 sec" },
            ]},
            2: { type: "Lower Body Strength", exercises: [
                { name: "Back Squat", sets: 4, reps: "10", rest: "2 min" },
                { name: "Romanian Deadlift", sets: 4, reps: "10", rest: "2 min" },
                { name: "Walking Lunges", sets: 3, reps: "10 each", rest: "60 sec" },
                { name: "Calf Raises", sets: 4, reps: "15", rest: "45 sec" },
            ]},
            3: { type: "Cardio — Zone 2", exercises: [
                { name: "Run / Row / Cycle", duration: "35 min", notes: "HR 130–150 bpm" },
                { name: "Core Circuit", duration: "10 min" },
            ]},
            4: { type: "Upper Body Volume", exercises: [
                { name: "Incline DB Press", sets: 4, reps: "12", rest: "75 sec" },
                { name: "Seated Cable Row", sets: 4, reps: "12", rest: "75 sec" },
                { name: "Lateral Raises", sets: 3, reps: "15", rest: "45 sec" },
                { name: "Curl + Press Superset", sets: 3, reps: "10", rest: "60 sec" },
            ]},
            5: { type: "Lower Body Volume", exercises: [
                { name: "Leg Press", sets: 4, reps: "15", rest: "75 sec" },
                { name: "Leg Curl", sets: 4, reps: "12", rest: "60 sec" },
                { name: "Hip Thrust", sets: 4, reps: "12", rest: "75 sec" },
                { name: "Seated Calf Raise", sets: 4, reps: "15", rest: "45 sec" },
            ]},
            6: { type: "Cardio + Mobility", exercises: [
                { name: "Jog / Swim", duration: "40 min" },
                { name: "Stretching Routine", duration: "15 min" },
            ]},
        },
        advanced: {
            1: { type: "Strength — Full Body", exercises: [
                { name: "Deadlift", sets: 5, reps: "5", rest: "2–3 min" },
                { name: "Bench Press", sets: 5, reps: "5", rest: "2 min" },
                { name: "Barbell Row", sets: 5, reps: "5", rest: "2 min" },
            ]},
            2: { type: "Hypertrophy — Push", exercises: [
                { name: "Incline Press", sets: 4, reps: "10", rest: "90 sec" },
                { name: "OHP", sets: 4, reps: "10", rest: "90 sec" },
                { name: "Dips", sets: 4, reps: "12", rest: "60 sec" },
                { name: "Lateral Raises", sets: 4, reps: "15", rest: "45 sec" },
            ]},
            3: { type: "Cardio Endurance", exercises: [
                { name: "Long Run / Cycle", duration: "45–60 min", notes: "Zone 2–3" },
            ]},
            4: { type: "Hypertrophy — Pull + Legs", exercises: [
                { name: "Pull-ups", sets: 4, reps: "10", rest: "90 sec" },
                { name: "Squat", sets: 4, reps: "10", rest: "2 min" },
                { name: "RDL + Leg Curl", sets: 4, reps: "10", rest: "75 sec" },
                { name: "Barbell Row", sets: 4, reps: "10", rest: "90 sec" },
            ]},
            5: { type: "Power + Plyometrics", exercises: [
                { name: "Power Clean or Jump Squat", sets: 5, reps: "5", rest: "2 min" },
                { name: "Box Jumps", sets: 4, reps: "8", rest: "90 sec" },
                { name: "Sled Sprint", sets: 6, reps: "15 m", rest: "90 sec" },
            ]},
            6: { type: "Mobility + Light Cardio", exercises: [
                { name: "Yoga / Stretching", duration: "30 min" },
                { name: "Easy Run or Swim", duration: "20 min" },
            ]},
        },
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // DIABETIC FRIENDLY
    // Focus: low-intensity steady state, no spike-inducing extreme HIIT,
    //        post-meal walks, resistance to improve insulin sensitivity
    // ═══════════════════════════════════════════════════════════════════════════
    diabetic_friendly: {
        beginner: {
            1: { type: "Gentle Full Body + Post-Meal Walk", exercises: [
                { name: "Chair Squats", sets: 3, reps: "12", rest: "45 sec", notes: "Sit-to-stand from chair" },
                { name: "Wall Push-ups", sets: 3, reps: "12", rest: "45 sec" },
                { name: "Seated Leg Extensions", sets: 3, reps: "15", rest: "30 sec" },
                { name: "Resistance Band Rows", sets: 3, reps: "12", rest: "45 sec" },
                { name: "Post-meal Walk", duration: "15 min", notes: "After lunch — helps regulate blood glucose" },
            ]},
            2: { type: "Low-Impact Cardio", exercises: [
                { name: "Brisk Walk", duration: "30 min", notes: "Flat surface, comfortable pace" },
                { name: "Calf Raises (standing)", sets: 3, reps: "20", rest: "30 sec" },
                { name: "Seated Marching", sets: 3, reps: "30 sec", rest: "20 sec" },
                { name: "Full Body Stretch", duration: "10 min" },
            ]},
            3: { type: "Upper Body Resistance", exercises: [
                { name: "Resistance Band Bicep Curl", sets: 3, reps: "15", rest: "45 sec" },
                { name: "DB Shoulder Press (light)", sets: 3, reps: "12", rest: "45 sec" },
                { name: "Band Pull-aparts", sets: 3, reps: "15", rest: "30 sec" },
                { name: "Plank (modified)", sets: 3, reps: "20 sec", rest: "30 sec" },
                { name: "Post-meal Walk", duration: "15 min" },
            ]},
            4: { type: "Mobility + Gentle Yoga", exercises: [
                { name: "Cat-Cow Stretch", sets: 3, reps: "10 reps slow", rest: "20 sec" },
                { name: "Seated Spinal Twist", duration: "5 min each side" },
                { name: "Hip Flexor Stretch", duration: "5 min" },
                { name: "Diaphragmatic Breathing", duration: "10 min", notes: "Reduces cortisol / blood sugar" },
            ]},
            5: { type: "Lower Body Resistance", exercises: [
                { name: "Bodyweight Squats", sets: 3, reps: "12", rest: "45 sec" },
                { name: "Glute Bridges", sets: 3, reps: "15", rest: "30 sec" },
                { name: "Side-lying Leg Raises", sets: 3, reps: "12 each", rest: "30 sec" },
                { name: "Resistance Band Clamshells", sets: 3, reps: "15 each", rest: "30 sec" },
                { name: "Post-meal Walk", duration: "15 min" },
            ]},
            6: { type: "Active Recovery + Balance", exercises: [
                { name: "Single-leg Balance Hold", sets: 3, reps: "30 sec each", rest: "20 sec", notes: "Hold chair if needed" },
                { name: "Heel-to-Toe Walk", duration: "5 min" },
                { name: "Light Cycling / Stationary Bike", duration: "20 min", notes: "Low resistance" },
                { name: "Stretching Routine", duration: "10 min" },
            ]},
        },
        intermediate: {
            1: { type: "Full Body Resistance + Walk", exercises: [
                { name: "Goblet Squat", sets: 3, reps: "12", rest: "60 sec" },
                { name: "DB Bench Press (moderate)", sets: 3, reps: "12", rest: "60 sec" },
                { name: "DB Row", sets: 3, reps: "12 each", rest: "60 sec" },
                { name: "Plank", sets: 3, reps: "30 sec", rest: "30 sec" },
                { name: "Brisk Walk", duration: "20 min" },
            ]},
            2: { type: "Steady State Cardio + Core", exercises: [
                { name: "Cycling / Elliptical", duration: "35 min", notes: "Moderate pace, HR 110–130" },
                { name: "Dead Bug", sets: 3, reps: "10 each", rest: "30 sec" },
                { name: "Bird Dog", sets: 3, reps: "10 each", rest: "30 sec" },
            ]},
            3: { type: "Upper Body Strength", exercises: [
                { name: "Lat Pulldown", sets: 3, reps: "12", rest: "60 sec" },
                { name: "Seated Cable Row", sets: 3, reps: "12", rest: "60 sec" },
                { name: "DB Shoulder Press", sets: 3, reps: "12", rest: "60 sec" },
                { name: "Bicep Curl", sets: 3, reps: "12", rest: "45 sec" },
                { name: "Post-meal Walk", duration: "15 min" },
            ]},
            4: { type: "Yoga + Mobility", exercises: [
                { name: "Sun Salutation Flow", sets: 5, reps: "rounds", notes: "Slow and controlled" },
                { name: "Pigeon Pose", duration: "2 min each side" },
                { name: "Foam Rolling", duration: "10 min" },
            ]},
            5: { type: "Lower Body Strength", exercises: [
                { name: "Leg Press", sets: 3, reps: "15", rest: "60 sec" },
                { name: "Romanian Deadlift (light)", sets: 3, reps: "12", rest: "75 sec" },
                { name: "Walking Lunges", sets: 3, reps: "10 each", rest: "60 sec" },
                { name: "Calf Raises", sets: 3, reps: "20", rest: "30 sec" },
                { name: "Post-meal Walk", duration: "15 min" },
            ]},
            6: { type: "Zone 2 Cardio + Balance", exercises: [
                { name: "Swimming / Aqua Walk", duration: "30 min", notes: "Joint-friendly, excellent for glucose control" },
                { name: "Single-leg Balance", sets: 3, reps: "30 sec each" },
                { name: "Full Body Stretch", duration: "15 min" },
            ]},
        },
        advanced: {
            1: { type: "Strength Circuit + Cardio", exercises: [
                { name: "Barbell Squat (moderate load)", sets: 4, reps: "10", rest: "90 sec" },
                { name: "DB Bench Press", sets: 4, reps: "10", rest: "90 sec" },
                { name: "Barbell Row", sets: 4, reps: "10", rest: "90 sec" },
                { name: "Treadmill Walk / Light Jog", duration: "20 min", notes: "Post-workout, helps clear glucose" },
            ]},
            2: { type: "Zone 2 Cardio — Long", exercises: [
                { name: "Run / Cycle / Row", duration: "45 min", notes: "Conversational pace, HR 120–140" },
                { name: "Core: Plank + Dead Bug", sets: 3, reps: "45 sec / 10 each", rest: "45 sec" },
            ]},
            3: { type: "Upper Body Hypertrophy", exercises: [
                { name: "Weighted Pull-ups", sets: 4, reps: "8", rest: "90 sec" },
                { name: "Incline DB Press", sets: 4, reps: "10", rest: "90 sec" },
                { name: "Seated Cable Row", sets: 4, reps: "12", rest: "75 sec" },
                { name: "Lateral Raises", sets: 3, reps: "15", rest: "45 sec" },
                { name: "Post-meal Walk", duration: "15 min" },
            ]},
            4: { type: "Mobility + Stress Reduction", exercises: [
                { name: "Yoga Flow", duration: "30 min", notes: "Focus on breathwork — lowers cortisol" },
                { name: "Foam Rolling", duration: "10 min" },
                { name: "Meditation / Deep Breathing", duration: "10 min" },
            ]},
            5: { type: "Lower Body Hypertrophy", exercises: [
                { name: "Romanian Deadlift", sets: 4, reps: "10", rest: "90 sec" },
                { name: "Leg Press", sets: 4, reps: "12", rest: "75 sec" },
                { name: "Bulgarian Split Squat", sets: 3, reps: "10 each", rest: "90 sec" },
                { name: "Leg Curl", sets: 3, reps: "12", rest: "60 sec" },
                { name: "Post-meal Walk", duration: "15 min" },
            ]},
            6: { type: "Steady Cardio + Core", exercises: [
                { name: "Swim / Cycle / Row", duration: "40 min", notes: "Zone 2 — steady" },
                { name: "Ab Circuit: Plank, Bird Dog, Dead Bug", sets: 3, reps: "45 sec each" },
                { name: "Stretching", duration: "15 min" },
            ]},
        },
    },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeGoal(goal: string): string {
    const g = goal.toLowerCase().replace(/\s/g, "_")
    if (g.includes("fat") || g.includes("loss") || g.includes("cut")) return "fat_loss"
    if (g.includes("muscle") || g.includes("gain") || g.includes("bulk")) return "muscle_gain"
    if (g.includes("diabet")) return "diabetic_friendly"
    return "maintenance"
}

// Maps your exact activity level dropdown strings → difficulty
function normalizeDifficulty(activityLevel?: string | null): Difficulty {
    const a = (activityLevel ?? "").toLowerCase()
    if (a.includes("sedentary") || a.includes("light")) return "beginner"
    if (a.includes("very active") || a.includes("athlete") || a.includes("physical job")) return "advanced"
    // Moderate / Active both → intermediate (Active can push to advanced if desired)
    if (a.includes("active")) return "intermediate"
    return "intermediate"
}

// ─── Server Actions ───────────────────────────────────────────────────────────

export async function getTodaysWorkout(): Promise<{
    success: boolean
    data?: WorkoutPlanData | null
    dayName?: string
    isSunday?: boolean
    error?: string
}> {
    try {
        const { userId: clerkId } = await auth()
        if (!clerkId) return { success: false, error: "Unauthorized" }

        const user = await prisma.user.findUnique({
            where: { clerkId },
            include: { healthProfile: true },
        })
        if (!user) return { success: false, error: "User not found" }

        const dayIndex = new Date().getDay()
        const dayName = DAY_NAMES[dayIndex]
        const goal = normalizeGoal(user.healthProfile?.fitnessGoal ?? "maintenance")
        const difficulty = normalizeDifficulty(user.healthProfile?.activityLevel)

        // Sunday → light cardio for everyone
        if (dayIndex === 0) {
            const plan = await prisma.workoutPlan.create({
                data: {
                    userId: user.id,
                    goal,
                    type: "Sunday Cardio & Recovery",
                    difficulty,
                    exercises: SUNDAY_CARDIO as unknown as object[],
                },
            })
            return {
                success: true, isSunday: true, dayName,
                data: { id: plan.id, goal: plan.goal, type: plan.type, difficulty: plan.difficulty, exercises: plan.exercises as unknown as Exercise[], createdAt: plan.createdAt },
            }
        }

        const dayPlan =
            WORKOUT_LIBRARY[goal]?.[difficulty]?.[dayIndex as DayIndex]
            ?? WORKOUT_LIBRARY["maintenance"]["beginner"][dayIndex as DayIndex]

        const plan = await prisma.workoutPlan.create({
            data: {
                userId: user.id,
                goal,
                type: dayPlan.type,
                difficulty,
                exercises: dayPlan.exercises as unknown as object[],
            },
        })

        return {
            success: true, isSunday: false, dayName,
            data: { id: plan.id, goal: plan.goal, type: plan.type, difficulty: plan.difficulty, exercises: plan.exercises as unknown as Exercise[], createdAt: plan.createdAt },
        }
    } catch (error) {
        console.error("Error generating workout:", error)
        return { success: false, error: "Failed to generate workout" }
    }
}

export async function getLatestWorkoutPlan(): Promise<{
    success: boolean
    data?: WorkoutPlanData | null
    dayName?: string
    isSunday?: boolean
    error?: string
}> {
    try {
        const { userId: clerkId } = await auth()
        if (!clerkId) return { success: false, error: "Unauthorized" }

        const user = await prisma.user.findUnique({ where: { clerkId } })
        if (!user) return { success: false, error: "User not found" }

        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)

        const existing = await prisma.workoutPlan.findFirst({
            where: { userId: user.id, createdAt: { gte: startOfDay } },
            orderBy: { createdAt: "desc" },
        })

        const dayIndex = new Date().getDay()
        const dayName = DAY_NAMES[dayIndex]

        if (existing) {
            return {
                success: true, dayName, isSunday: dayIndex === 0,
                data: { id: existing.id, goal: existing.goal, type: existing.type, difficulty: existing.difficulty, exercises: existing.exercises as unknown as Exercise[], createdAt: existing.createdAt },
            }
        }

        return getTodaysWorkout()
    } catch (error) {
        console.error("Error fetching workout plan:", error)
        return { success: false, error: "Failed to fetch workout plan" }
    }
}