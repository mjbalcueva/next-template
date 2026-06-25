import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

import type { AuthUser, Permission } from "../lib/schemas"

// ─── Types ─────────────────────────────────────────────────────────────

type AuthState = {
  user: AuthUser | null
  permissions: Permission[]
}

// ─── Store ─────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  immer(() => ({
    user: null,
    permissions: [],
  }))
)
