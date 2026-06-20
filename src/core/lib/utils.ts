import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { env } from "@/env"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getApiUrl() {
  const appUrl = env.NEXT_PUBLIC_APP_URL
  if (appUrl) {
    return appUrl.replace(/\/$/, "")
  }

  if (typeof window !== "undefined") {
    return window.location.origin
  }

  return "http://localhost:3000"
}
