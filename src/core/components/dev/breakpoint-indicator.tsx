"use client"

import { useRef, useState } from "react"
import dynamic from "next/dynamic"

import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  Moon02Icon,
  Sun03Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQueryClient } from "@tanstack/react-query"
import { useTheme } from "next-themes"

import { Button } from "@/core/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/core/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/components/ui/tabs"
import { cn } from "@/core/lib/utils"

import { selectUser, useAuthStore } from "@/features/auth/lib/store"

const RQDevtoolsPanel = dynamic(
  () => import("@tanstack/react-query-devtools").then(m => m.ReactQueryDevtoolsPanel),
  { ssr: false }
)

// ─── Corner snap ──────────────────────────────────────────────────────

type Corner = "bottom-left" | "bottom-right" | "top-left" | "top-right"
type Side = "bottom" | "top" | "right" | "left"

const CORNERS: Record<Corner, string> = {
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "top-left": "top-4 left-4",
  "top-right": "top-4 right-4",
}

const SIDES: Side[] = ["bottom", "top", "right", "left"]

function loadCorner(): Corner {
  try {
    const s = localStorage.getItem("dev-corner")
    if (s && s in CORNERS) return s as Corner
  } catch {}
  return "bottom-left"
}

function loadSide(): Side {
  try {
    const s = localStorage.getItem("dev-side")
    if (s && SIDES.includes(s as Side)) return s as Side
  } catch {}
  return "right"
}

// ─── Storage helpers ──────────────────────────────────────────────────

type StorageItem = { key: string; value: string }

function getLocalStorageItems(): StorageItem[] {
  if (typeof window === "undefined") return []
  return Array.from({ length: localStorage.length }, (_, i) => {
    const key = localStorage.key(i) ?? ""
    return { key, value: localStorage.getItem(key) ?? "" }
  })
}

function getCookieItems(): StorageItem[] {
  if (typeof document === "undefined") return []
  return document.cookie
    .split(";")
    .filter(Boolean)
    .map(pair => {
      const [key, ...rest] = pair.split("=")
      return { key: key.trim(), value: decodeURIComponent(rest.join("=").trim()) }
    })
}

function StorageViewer({ items }: { items: StorageItem[] }) {
  const [selected, setSelected] = useState<StorageItem | null>(null)

  function formatValue(raw: string): string {
    try {
      return JSON.stringify(JSON.parse(raw), null, 2)
    } catch {
      return raw
    }
  }

  return (
    <div className="flex h-full gap-3">
      {/* List */}
      <div className="w-2/5 shrink-0 overflow-auto rounded-md border">
        {items.length === 0 ? (
          <p className="text-muted-foreground p-4 text-xs italic">Empty</p>
        ) : (
          <table className="w-full table-auto text-xs">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground border-b text-left text-[10px] tracking-wider uppercase">
                <th className="px-3 py-1.5 font-medium">Key</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr
                  key={item.key}
                  onClick={() => setSelected(item)}
                  className={cn(
                    "border-border/50 cursor-pointer border-b font-mono transition-colors",
                    selected?.key === item.key
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted/50 text-muted-foreground"
                  )}
                >
                  <td className="max-w-0 truncate px-3 py-2">{item.key}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail */}
      <div className="flex min-w-0 flex-1 flex-col rounded-md border">
        {selected ? (
          <>
            <div className="text-muted-foreground truncate border-b px-3 py-1.5 text-[10px] font-medium tracking-wider uppercase">
              {selected.key}
            </div>
            <pre className="text-foreground/80 flex-1 overflow-auto p-3 font-mono text-xs leading-relaxed">
              {formatValue(selected.value)}
            </pre>
          </>
        ) : (
          <div className="text-muted-foreground flex flex-1 items-center justify-center text-xs italic">
            Select a key to view
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────

function DevToolsPanel() {
  const [open, setOpen] = useState(false)
  const [corner, setCorner] = useState<Corner>(loadCorner)
  const [side, setSide] = useState<Side>(loadSide)
  const btn = useRef<HTMLButtonElement>(null)
  const drag = useRef({ active: false, x: 0, y: 0 })
  const { resolvedTheme, setTheme } = useTheme()

  function pd(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { active: true, x: e.clientX, y: e.clientY }
  }

  function pm(e: React.PointerEvent) {
    if (!drag.current.active || !btn.current) return
    btn.current.style.transform = `translate(${e.clientX - drag.current.x}px, ${e.clientY - drag.current.y}px)`
  }

  function pu(e: React.PointerEvent) {
    if (!drag.current.active || !btn.current) return
    drag.current.active = false
    const dx = e.clientX - drag.current.x
    const dy = e.clientY - drag.current.y
    const el = btn.current

    if (Math.hypot(dx, dy) < 8) {
      el.style.transform = ""
      setOpen(true)
      return
    }

    const next: Corner =
      e.clientY < window.innerHeight / 2
        ? e.clientX < window.innerWidth / 2
          ? "top-left"
          : "top-right"
        : e.clientX < window.innerWidth / 2
          ? "bottom-left"
          : "bottom-right"

    el.style.transform = ""
    setCorner(next)
    localStorage.setItem("dev-corner", next)
  }

  const qc = useQueryClient()
  const user = useAuthStore(selectUser)

  function cycleSide() {
    const idx = SIDES.indexOf(side)
    const next = SIDES[(idx + 1) % SIDES.length]
    setSide(next)
    localStorage.setItem("dev-side", next)
  }

  const SIDE_ICONS: Record<Side, React.ReactNode> = {
    bottom: <HugeiconsIcon icon={ArrowDown01Icon} className="size-4" />,
    top: <HugeiconsIcon icon={ArrowUp01Icon} className="size-4" />,
    right: <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />,
    left: <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />,
  }

  return (
    <>
      {/* ── Pill ── */}
      <button
        ref={btn}
        type="button"
        suppressHydrationWarning
        onPointerDown={pd}
        onPointerMove={pm}
        onPointerUp={pu}
        onPointerCancel={pu}
        className={cn(
          "bg-background hover:bg-muted fixed z-9999 flex size-8 cursor-grab touch-none items-center justify-center rounded-full border font-mono text-xs font-semibold shadow-lg backdrop-blur-sm select-none active:cursor-grabbing",
          CORNERS[corner],
          open && "invisible"
        )}
      >
        <span className="sm:hidden">xs</span>
        <span className="hidden sm:inline md:hidden">sm</span>
        <span className="hidden md:inline lg:hidden">md</span>
        <span className="hidden lg:inline xl:hidden">lg</span>
        <span className="hidden xl:inline 2xl:hidden">xl</span>
        <span className="hidden 2xl:inline">2xl</span>
        <span className="3xl:inline 4xl:hidden hidden">3xl</span>
        <span className="4xl:inline hidden">4xl</span>
      </button>

      {/* ── Sheet ── */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side={side}
          showCloseButton={false}
          className="flex flex-col p-0"
          style={
            side === "left" || side === "right"
              ? { width: "75vw", maxWidth: "75vw" }
              : { height: "50vh" }
          }
        >
          <SheetHeader className="flex flex-row items-center justify-between px-4 pt-4 pb-0">
            <SheetTitle className="flex items-center gap-2 text-sm">
              <span className="size-2 animate-pulse rounded-full bg-green-500" />
              Dev Tools
            </SheetTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={cycleSide}
                title={`Sheet side: ${side} — click to cycle`}
              >
                {SIDE_ICONS[side]}
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
                title={`Switch to ${resolvedTheme === "light" ? "dark" : "light"} theme`}
              >
                <HugeiconsIcon
                  icon={resolvedTheme === "light" ? Moon02Icon : Sun03Icon}
                  className="size-4"
                />
              </Button>
            </div>
          </SheetHeader>

          <Tabs defaultValue="queries" className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 pt-2">
              <TabsList>
                <TabsTrigger value="queries" className="text-xs">
                  Queries
                </TabsTrigger>
                <TabsTrigger value="session" className="text-xs">
                  Session
                </TabsTrigger>
                <TabsTrigger value="localStorage" className="text-xs">
                  localStorage
                </TabsTrigger>
                <TabsTrigger value="cookies" className="text-xs">
                  Cookies
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="queries" className="flex-1 overflow-hidden p-4">
              <div className="bg-muted/50 h-full overflow-hidden rounded-md border">
                <RQDevtoolsPanel
                  client={qc}
                  theme={(resolvedTheme as "light" | "dark") || "light"}
                  style={{ height: "100%", width: "100%" }}
                />
              </div>
            </TabsContent>

            <TabsContent value="session" className="flex-1 overflow-auto p-4">
              <pre className="bg-muted/50 text-foreground/80 h-full overflow-auto rounded-md border p-4 font-mono text-xs">
                {user ? JSON.stringify(user, null, 2) : "No active session."}
              </pre>
            </TabsContent>

            <TabsContent value="localStorage" className="flex-1 overflow-hidden p-4">
              <StorageViewer items={getLocalStorageItems()} />
            </TabsContent>

            <TabsContent value="cookies" className="flex-1 overflow-hidden p-4">
              <StorageViewer items={getCookieItems()} />
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  )
}

export function DevTools() {
  // eslint-disable-next-line no-restricted-properties
  if (process.env.NODE_ENV !== "development") return null
  return <DevToolsPanel />
}
