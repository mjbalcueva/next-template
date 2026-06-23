import { Separator } from "@/core/components/ui/separator"

import { DangerZone } from "@/features/auth/components/danger-zone"
import { PasswordSection } from "@/features/auth/components/password-section"
import { ProfileSection } from "@/features/auth/components/profile-section"

import { RoleGate } from "@/packages/access-control/components/access-control"

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
      <RoleGate roles={["admin"]}>
        <DangerZone />
      </RoleGate>
    </main>
  )
}
