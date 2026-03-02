import { getHealthProfile } from "@/actions/profile.actions"
import { ProfileForm } from "@/components/forms/ProfileForm"

export default async function ProfilePage() {
    const result = await getHealthProfile()
    const profile = result.data ?? null

    return <ProfileForm existingProfile={profile} />
}
