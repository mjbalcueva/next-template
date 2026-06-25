import Link from "next/link"
import { redirect } from "next/navigation"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card"

import { LoginForm } from "@/features/auth/components/login-form"

import { DEFAULT_AUTH_REDIRECT } from "@/packages/auth/lib/schemas"
import { getCurrentSession } from "@/packages/auth/lib/server"

export default async function LoginPage() {
  const session = await getCurrentSession()
  if (session) redirect(DEFAULT_AUTH_REDIRECT)

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Log in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <LoginForm />
            <p className="text-muted-foreground text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-foreground underline underline-offset-4">
                Register
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
