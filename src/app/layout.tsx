import type { Metadata } from "next"
import { Figtree, Geist, Geist_Mono } from "next/font/google"

import { NuqsAdapter } from "nuqs/adapters/next/app"

import { DevTools } from "@/core/components/dev-tools"
import { ThemeProvider } from "@/core/components/providers/theme-provider"
import { Toaster } from "@/core/components/ui/sonner"
import { TooltipProvider } from "@/core/components/ui/tooltip"
import { cn } from "@/core/lib/utils"

import "@/core/styles/globals.css"

import { SessionLoader } from "@/packages/auth/components/session-loader"
import { ReactQueryProvider } from "@/packages/tanstack/providers/provider"

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Next Template",
  description:
    "A server-first Next.js template with Laravel Sanctum auth, RBAC permissions, TanStack Query/Form/Table, and shadcn/ui. Created by mjbalcueva.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        figtree.variable
      )}
    >
      <body suppressHydrationWarning className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <ReactQueryProvider>
              <SessionLoader>
                <TooltipProvider>
                  {children}
                  <DevTools />
                </TooltipProvider>
              </SessionLoader>
            </ReactQueryProvider>
          </NuqsAdapter>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
