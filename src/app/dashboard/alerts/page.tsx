import { getAlerts, seedDefaultAlerts } from "@/actions/alerts.actions"
import { AlertsClient } from "@/components/forms/AlertsClient"

export default async function AlertsPage() {
    // Seed some default alerts the first time a user visits
    await seedDefaultAlerts()

    const result = await getAlerts()
    const alerts = result.data ?? []

    return <AlertsClient initialAlerts={alerts} />
}
