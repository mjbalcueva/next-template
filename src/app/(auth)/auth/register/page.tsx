import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card"

import { RegisterForm } from "@/features/auth/components/register-form"

import { RedirectIfAuthenticated } from "@/packages/auth/components/access-control"

export default function RegisterPage() {
  return (
    <RedirectIfAuthenticated>
      <main className="flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
              <CardDescription>Get started by creating your free account</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <RegisterForm />
              <p className="text-muted-foreground text-center text-sm">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-foreground underline underline-offset-4">
                  Log in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </RedirectIfAuthenticated>
  )
}
