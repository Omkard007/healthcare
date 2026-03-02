import { getLatestWorkoutPlan } from "@/actions/workout.actions"
import { WorkoutClient } from "@/components/forms/WorkoutClient"

export default async function WorkoutPage() {
    const result = await getLatestWorkoutPlan()
    const plan = result.data ?? null

    return <WorkoutClient plan={plan} />
}
