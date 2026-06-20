import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card"

import { SignUpForm } from "@/features/auth/components/sign-up-form"

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>Get started by creating your free account</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <SignUpForm />
            <p className="text-muted-foreground text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/sign-in" className="text-foreground underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
