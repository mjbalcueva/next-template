import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card"

import { SignInForm } from "@/features/auth/components/sign-in-form"

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <SignInForm />
            <p className="text-muted-foreground text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/auth/sign-up" className="text-foreground underline underline-offset-4">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
