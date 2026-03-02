import { getWeeklyLogs } from "@/actions/tracker.actions"
import { TrackerClient } from "@/components/forms/TrackerClient"

export default async function TrackerPage() {
    const result = await getWeeklyLogs()
    const weeklyLogs = result.data ?? []
    const todayLog = result.todayLog ?? null

    return <TrackerClient weeklyLogs={weeklyLogs} todayLog={todayLog} />
}
