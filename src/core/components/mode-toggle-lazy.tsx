"use client"

import dynamic from "next/dynamic"

const ModeToggle = dynamic(() => import("@/core/components/mode-toggle").then(m => m.ModeToggle), {
  ssr: false,
})

export { ModeToggle as ModeToggleLazy }
