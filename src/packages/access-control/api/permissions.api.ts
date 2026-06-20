import { PERMISSIONS_ENDPOINT } from "@/packages/tanstack/lib/api-schema"
import { $fetch } from "@/packages/tanstack/lib/client-core"

export async function fetchMyPermissions(): Promise<readonly string[]> {
  const data = (await $fetch(`/${PERMISSIONS_ENDPOINT}`)) as { permissions: string[] }
  return data.permissions
}
