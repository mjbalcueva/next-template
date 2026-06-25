import { Separator } from "@/core/components/ui/separator"

import { DangerZone } from "@/features/user/components/danger-zone"
import { PasswordSection } from "@/features/user/components/password-section"
import { ProfileSection } from "@/features/user/components/profile-section"

import { Gate } from "@/packages/auth/components/gate"

export default function SettingsPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 pt-8 pb-16">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your account preferences</p>
      </div>

      <Separator />

      <ProfileSection />
      <PasswordSection />
      <Gate roles={["admin"]}>
        <DangerZone />
      </Gate>
    </main>
  )
}
