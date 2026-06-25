import type { Metadata } from "next"
import { Figtree, Geist, Geist_Mono } from "next/font/google"

import { ThemeProvider } from "@/core/components/providers/theme-provider"
import { Toaster } from "@/core/components/ui/sonner"
import { cn } from "@/core/lib/utils"

import "@/core/styles/globals.css"

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
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
