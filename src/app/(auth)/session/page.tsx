import { getCurrentSession } from "@/packages/auth/server"

export default async function SessionPage() {
  const session = await getCurrentSession()
  const debugSession = {
    user: session?.user ?? null,
    permissions: session?.permissions ?? [],
    isAuthenticated: session !== null,
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Session</h1>
      <p className="text-muted-foreground text-sm">
        Quick debug view for the current Sanctum cookie-backed session. No bearer token is stored in
        localStorage.
      </p>
      <pre className="bg-muted max-h-[60vh] overflow-auto rounded-2xl border p-4 text-xs leading-6">
        {JSON.stringify(debugSession, null, 2)}
      </pre>
    </main>
  )
}
