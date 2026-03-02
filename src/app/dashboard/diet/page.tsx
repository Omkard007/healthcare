import { getLatestDietPlan } from "@/actions/diet.actions"
import { DietClient } from "@/components/forms/DietClient"

export default async function DietPage() {
    const result = await getLatestDietPlan()
    const plan = result.data ?? null

    return <DietClient plan={plan} />
}
