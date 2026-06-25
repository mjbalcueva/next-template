"use client"

import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
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

import { useAuth } from "@/packages/auth/store/auth.actions"

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

// ─── Copy button ──────────────────────────────────────────────────────

const CopyButton = memo(function CopyButton({ getValue }: { getValue: () => string }) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(() => {
    navigator.clipboard.writeText(getValue()).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    })
  }, [getValue])

  return (
    <button
      type="button"
      onClick={copy}
      className="text-muted-foreground hover:text-foreground ml-auto cursor-pointer text-[10px] font-medium tracking-wider uppercase transition-colors"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  )
})

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

const StorageViewer = memo(function StorageViewer({ items }: { items: StorageItem[] }) {
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
      <div className="flex w-2/5 shrink-0 flex-col overflow-hidden rounded-md border">
        <div className="flex-1 overflow-auto">
          {items.length === 0 ? (
            <p className="text-muted-foreground p-4 text-xs italic">Empty</p>
          ) : (
            <table className="w-full table-auto text-xs">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground border-b text-left text-[10px] tracking-wider uppercase">
                  <th className="px-3 py-1.5 font-medium">
                    <span className="flex items-center gap-2">
                      Key
                      <CopyButton
                        getValue={() =>
                          JSON.stringify(
                            Object.fromEntries(items.map(i => [i.key, i.value])),
                            null,
                            2
                          )
                        }
                      />
                    </span>
                  </th>
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
      </div>

      {/* Detail */}
      <div className="flex min-w-0 flex-1 flex-col rounded-md border">
        {selected ? (
          <>
            <div className="text-muted-foreground flex items-center truncate border-b px-3 py-1.5 text-[10px] font-medium tracking-wider uppercase">
              {selected.key}
              <CopyButton getValue={() => selected.value} />
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
})

// ─── Details (viewport + route) ───────────────────────────────────────

const BREAKPOINTS = [
  { name: "xs", range: "0–639" },
  { name: "sm", range: "640–767" },
  { name: "md", range: "768–1023" },
  { name: "lg", range: "1024–1279" },
  { name: "xl", range: "1280–1535" },
  { name: "2xl", range: "1536+" },
] as const

const RouteBreadcrumb = memo(function RouteBreadcrumb({ pathname }: { pathname: string }) {
  const segments = pathname === "/" ? ["/"] : pathname.split("/").filter(Boolean)
  const crumbs = ["{ localhost }", ...segments]

  return (
    <div className="text-foreground/80 flex min-w-0 flex-wrap items-center gap-2 font-mono text-xs">
      {crumbs.map((crumb, i) => (
        <Fragment key={`${crumb}-${i}`}>
          <span className={i === 0 ? "text-muted-foreground" : "font-medium"}>{crumb}</span>
          {i < crumbs.length - 1 && <span className="text-muted-foreground/60">/</span>}
        </Fragment>
      ))}
    </div>
  )
})

const DetailsTab = memo(function DetailsTab() {
  const [vp, setVp] = useState(() =>
    typeof window !== "undefined"
      ? { w: window.innerWidth, h: window.innerHeight }
      : { w: 800, h: 600 }
  )
  const [url, setUrl] = useState(() =>
    typeof window !== "undefined" ? new URL(window.location.href) : null
  )

  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    const onLocation = () => setUrl(new URL(window.location.href))
    window.addEventListener("resize", onResize)
    window.addEventListener("popstate", onLocation)
    const origPush = history.pushState
    const origReplace = history.replaceState
    history.pushState = (...args) => {
      origPush.apply(history, args)
      onLocation()
    }
    history.replaceState = (...args) => {
      origReplace.apply(history, args)
      onLocation()
    }
    return () => {
      window.removeEventListener("resize", onResize)
      window.removeEventListener("popstate", onLocation)
      history.pushState = origPush
      history.replaceState = origReplace
    }
  }, [])

  const params = url ? [...url.searchParams.entries()] : []

  return (
    <div className="flex min-h-full flex-col gap-5">
      {/* Route */}
      <section>
        <h3 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
          Route
        </h3>
        <div className="rounded-lg border">
          {/* Path */}
          <div className="bg-muted/40 flex items-center justify-between px-3 py-2">
            <RouteBreadcrumb pathname={url?.pathname ?? "/"} />
            <CopyButton getValue={() => window.location.href} />
          </div>
          {/* Query params table */}
          {params.length > 0 && (
            <table className="w-full table-auto text-xs">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground border-b text-left text-[10px] tracking-wider uppercase">
                  <th className="w-1/3 px-3 py-1.5 font-medium">Params</th>
                  <th className="px-3 py-1.5 font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {params.map(([key, value]) => (
                  <tr key={key} className="border-border/50 hover:bg-muted/30 border-b font-mono">
                    <td className="text-foreground/80 max-w-0 truncate px-3 py-2 font-semibold">
                      {key}
                    </td>
                    <td className="text-muted-foreground max-w-0 truncate px-3 py-2">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Breakpoints */}
      <section className="mb-0">
        <h3 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
          Breakpoints
        </h3>
        <div className="flex flex-wrap gap-2">
          {BREAKPOINTS.map(function (bp) {
            const parts = bp.range.split("+").join("").split("–")
            const min = parseInt(parts[0], 10)
            const max = parts[1] ? parseInt(parts[1], 10) : Infinity
            const isActive = vp.w >= min && vp.w <= max
            return (
              <span
                key={bp.name}
                className={cn(
                  "rounded-md px-2.5 py-1 font-mono text-xs",
                  isActive
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "text-muted-foreground"
                )}
              >
                {bp.name}
                <span className={cn("ml-1.5", !isActive && "opacity-60")}>{bp.range}</span>
              </span>
            )
          })}
        </div>
      </section>

      {/* Viewport */}
      <section>
        <h3 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
          Viewport
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/40 rounded-lg border p-3">
            <p className="text-muted-foreground mb-1 text-[10px] font-medium tracking-wider uppercase">
              Width
            </p>
            <p className="font-mono text-lg font-semibold tabular-nums">
              {vp.w}
              <span className="text-muted-foreground ml-0.5 text-xs font-normal">px</span>
            </p>
          </div>
          <div className="bg-muted/40 rounded-lg border p-3">
            <p className="text-muted-foreground mb-1 text-[10px] font-medium tracking-wider uppercase">
              Height
            </p>
            <p className="font-mono text-lg font-semibold tabular-nums">
              {vp.h}
              <span className="text-muted-foreground ml-0.5 text-xs font-normal">px</span>
            </p>
          </div>
        </div>
      </section>

      {/* Device */}
      <section>
        <h3 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
          Device
        </h3>
        <div className="bg-muted/40 rounded-lg border p-3">
          <p className="text-muted-foreground mb-1 text-[10px] font-medium tracking-wider uppercase">
            Pixel Ratio
          </p>
          <p className="font-mono text-lg font-semibold tabular-nums">
            {typeof window !== "undefined" ? window.devicePixelRatio.toFixed(2) : "1"}
            <span className="text-muted-foreground ml-0.5 text-xs font-normal">dppx</span>
          </p>
        </div>
      </section>
    </div>
  )
})

// ─── DevTools Panel ───────────────────────────────────────────────

function DevToolsPanel() {
  const [open, setOpen] = useState(false)
  const [corner, setCorner] = useState<Corner>(() =>
    typeof window === "undefined" ? "bottom-left" : loadCorner()
  )
  const [side, setSide] = useState<Side>(() =>
    typeof window === "undefined" ? "right" : loadSide()
  )
  const btn = useRef<HTMLButtonElement>(null)
  const drag = useRef({ active: false, x: 0, y: 0 })
  const { resolvedTheme, setTheme } = useTheme()

  const pd = useCallback((e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { active: true, x: e.clientX, y: e.clientY }
  }, [])

  const pm = useCallback((e: React.PointerEvent) => {
    if (!drag.current.active || !btn.current) return
    btn.current.style.transform = `translate(${e.clientX - drag.current.x}px, ${e.clientY - drag.current.y}px)`
  }, [])

  const pu = useCallback((e: React.PointerEvent) => {
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
  }, [])

  const qc = useQueryClient()
  const { user, permissions } = useAuth()
  const debugSession = useMemo(() => ({ user, permissions }), [user, permissions])

  const cycleSide = useCallback(() => {
    setSide(prev => {
      const idx = SIDES.indexOf(prev)
      const next = SIDES[(idx + 1) % SIDES.length]
      localStorage.setItem("dev-side", next)
      return next
    })
  }, [])

  const SIDE_ICONS = useMemo(
    () => ({
      bottom: <HugeiconsIcon icon={ArrowDown01Icon} className="size-4" />,
      top: <HugeiconsIcon icon={ArrowUp01Icon} className="size-4" />,
      right: <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />,
      left: <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />,
    }),
    []
  )

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
          "bg-background hover:bg-muted fixed z-9999 flex size-8 cursor-pointer touch-none items-center justify-center rounded-full border font-mono text-xs font-semibold shadow-lg backdrop-blur-sm select-none active:cursor-grabbing",
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
      </button>

      {/* ── Sheet ── */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side={side}
          showCloseButton={false}
          className="flex flex-col gap-0 p-0"
          style={
            side === "left" || side === "right"
              ? { width: "75vw", maxWidth: "75vw" }
              : { height: "75vh", maxHeight: "75vh" }
          }
        >
          <SheetHeader className="flex flex-row items-center justify-between px-4 pb-0">
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

          <Tabs defaultValue="details" className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4">
              <TabsList>
                <TabsTrigger value="details" className="text-xs">
                  Details
                </TabsTrigger>
                <TabsTrigger value="session" className="text-xs">
                  Session
                </TabsTrigger>
                <TabsTrigger value="cookies" className="text-xs">
                  Cookies
                </TabsTrigger>
                <TabsTrigger value="localStorage" className="text-xs">
                  Local Storage
                </TabsTrigger>
                <TabsTrigger value="queries" className="text-xs">
                  Queries
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="details" className="flex-1 overflow-auto p-4 pb-4">
              <DetailsTab />
            </TabsContent>

            <TabsContent value="queries" className="flex-1 overflow-hidden p-4">
              <div className="bg-muted/50 h-full overflow-hidden rounded-md border">
                <RQDevtoolsPanel
                  client={qc}
                  theme={(resolvedTheme as "light" | "dark") || "light"}
                  style={{ height: "100%", width: "100%" }}
                />
              </div>
            </TabsContent>

            <TabsContent value="cookies" className="flex-1 overflow-hidden p-4">
              <StorageViewer items={getCookieItems()} />
            </TabsContent>

            <TabsContent value="localStorage" className="flex-1 overflow-hidden p-4">
              <StorageViewer items={getLocalStorageItems()} />
            </TabsContent>

            <TabsContent value="session" className="flex-1 overflow-auto p-4">
              <div className="relative h-full">
                <div className="absolute top-3 right-3 z-10">
                  <CopyButton getValue={() => JSON.stringify(debugSession, null, 2)} />
                </div>
                <pre className="bg-muted/50 text-foreground/80 h-full overflow-auto rounded-md border p-4 pr-14 font-mono text-xs">
                  {debugSession.user ? JSON.stringify(debugSession, null, 2) : "No active session."}
                </pre>
              </div>
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
