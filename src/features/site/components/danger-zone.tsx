"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/core/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card"
import { useLogoutMutation } from "@/features/auth/lib/mutations"
import { useDeleteAccountMutation } from "@/features/site/lib/mutations"

export function DangerZone() {
  const router = useRouter()
  const logoutMutation = useLogoutMutation()
  const deleteAccount = useDeleteAccountMutation()
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setError(null)
    try {
      await deleteAccount.mutateAsync()
      await logoutMutation.mutateAsync()
      router.push("/auth/sign-in")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete account.")
    }
  }

  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="text-destructive">Danger zone</CardTitle>
        <CardDescription>
          Permanently delete your account and all your data. This cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!confirming ? (
          <Button variant="destructive" size="sm" onClick={() => setConfirming(true)}>
            Delete account
          </Button>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium">Are you sure? This action cannot be reversed.</p>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={deleteAccount.isPending}
              >
                {deleteAccount.isPending ? "Deleting…" : "Yes, delete my account"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setConfirming(false)
                  setError(null)
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
