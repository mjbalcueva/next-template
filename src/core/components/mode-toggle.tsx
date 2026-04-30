"use client"

import { Moon02Icon, Sun03Icon, SystemUpdate01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTheme } from "next-themes"

import { Button } from "@/core/components/ui/button"

const THEMES = [
	{ name: "system", icon: SystemUpdate01Icon },
	{ name: "light", icon: Sun03Icon },
	{ name: "dark", icon: Moon02Icon },
] as const

export function ModeToggle() {
	const { theme, setTheme } = useTheme()

	const index = THEMES.findIndex(t => t.name === (theme ?? "system"))
	const current = THEMES[index] ?? THEMES[0]
	const next = THEMES[(index + 1) % THEMES.length]

	return (
		<Button
			variant="outline"
			size="icon"
			onClick={() => setTheme(next.name)}
			className="fixed bottom-4 left-4 rounded-full shadow-md"
		>
			{<HugeiconsIcon icon={current.icon} size={18} />}
		</Button>
	)
}
