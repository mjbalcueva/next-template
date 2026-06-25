"use client"

import type { ReactNode } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card"
import { Skeleton } from "@/core/components/ui/skeleton"
import { cn } from "@/core/lib/utils"

export function ChartPanel({
  children,
  className,
  description,
  title,
}: {
  children: ReactNode
  className?: string
  description?: string
  title: string
}) {
  return (
    <Card className={className} size="sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function ChartSkeleton({
  className,
  shape = "block",
}: {
  className?: string
  shape?: "block" | "circle"
}) {
  return (
    <Card className={className} size="sm">
      <CardHeader>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-44" />
      </CardHeader>
      <CardContent>
        <Skeleton
          className={cn("h-64 w-full", shape === "circle" && "aspect-square h-auto rounded-full")}
        />
      </CardContent>
    </Card>
  )
}

export function ChartEmptyState({
  description = "Adjust your filters or add data to populate this chart.",
  title = "No data",
}: {
  description?: string
  title?: string
}) {
  return (
    <div className="border-border/70 bg-muted/20 flex h-64 flex-col items-center justify-center rounded-md border border-dashed px-6 text-center">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-muted-foreground mt-1 max-w-xs text-sm">{description}</p>
    </div>
  )
}
