import { getSymptomLogs } from "@/actions/symptoms.actions"
import { SymptomsClient } from "@/components/forms/SymptomsClient"

export default async function SymptomsPage() {
    const result = await getSymptomLogs()
    const recentLogs = result.data ?? []

    return <SymptomsClient recentLogs={recentLogs} />
}
