# Next Template

A server-first Next.js 16 / React 19 frontend template for apps backed by Laravel Sanctum.

Created by [@mjbalcueva](https://github.com/mjbalcueva).

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 App Router + React 19 |
| Server state | TanStack Query |
| Forms | TanStack Form + Zod |
| Tables | TanStack Table + URL-synced state |
| Charts | Recharts + shadcn chart wrappers |
| UI | shadcn/ui, reui primitives/blocks, Tailwind CSS 4 |
| Auth | Laravel Sanctum SPA cookie auth |
| Env | t3-env |

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

The default env points at the built-in mock backend, so the template runs without Laravel.

## Environment

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Mock backend defaults
NEXT_PUBLIC_API_URL=http://localhost:3000/api/mock
NEXT_PUBLIC_AUTH_URL=http://localhost:3000/api/mock
NEXT_PUBLIC_SANCTUM_CSRF_URL=http://localhost:3000/api/mock/sanctum/csrf-cookie
```

For Laravel Sanctum, set the same three backend URLs to your Laravel origin:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_AUTH_URL=http://localhost:8000
NEXT_PUBLIC_SANCTUM_CSRF_URL=http://localhost:8000/sanctum/csrf-cookie
```

The production assumption is first-party SPA auth on the same top-level domain or subdomains.

## Auth Model

This template uses Sanctum SPA cookie auth:

- Browser requests use `credentials: "include"`.
- Mutating browser requests bootstrap CSRF through `/sanctum/csrf-cookie`.
- The `XSRF-TOKEN` cookie is sent back as `X-XSRF-TOKEN`.
- Server requests forward incoming cookies to Laravel and send app `Origin` / `Referer`.
- No bearer token is stored in localStorage or a frontend-owned auth cookie.
- Protected app routes live under the protected route group and are guarded by `AuthGate`, backed by the app-level `SessionProvider`.

Shared auth code lives in `src/packages/auth/`.
User-facing auth UI and settings flows live in `src/features/auth/`.

## Mock Backend

The mock backend lives under `src/app/api/mock/`. It mirrors the Sanctum cookie shape closely enough for local frontend work.

To replace it with Laravel:

1. Set the env URLs above to Laravel.
2. Delete `src/app/api/mock/`.
3. Keep feature API calls pointed at resource paths like `todos`, `user`, and `permissions`.

You should not need to edit a spread of feature files just to switch backend origins.

## Architecture

```text
src/
├── app/                    # Server-first App Router routes
├── core/                   # shadcn/ui, reui, providers, global styles
├── features/               # User-facing feature modules
│   ├── auth/               # Auth forms, settings UI, auth mutations
│   ├── home/
│   └── todo/               # Example CRUD, table, charts, analytics
├── packages/               # Shared internal libraries
│   ├── api/                # schema-validated fetch + CSRF/session handling
│   ├── analytics/          # reusable chart panels/states
│   ├── auth/               # schemas, server helpers, session context, permissions
│   ├── table/              # reusable filter badge/table-state helpers
│   ├── tanstack/           # Query provider + query-key factory
│   └── url-state/          # nuqs + optional localStorage persistence
└── env.ts
```

No barrel files are required for app imports; import directly from the file that owns the behavior.

## Useful APIs

- `src/packages/api/fetch.ts`: `apiFetch()`
- `src/packages/api/csrf.ts`: `ensureCsrfCookie()`, `readXsrfToken()`
- `src/packages/auth/server.ts`: `getCurrentUser()`, `getCurrentSession()`, `requireUser()`, `can()`
- `src/packages/auth/session-provider.tsx`: `SessionProvider`, `useSession()`, `useAuth()`
- `src/packages/auth/components/access-control.tsx`: `AuthGate`, `RedirectIfAuthenticated`, `RoleGate`
- `src/packages/auth/components/can.tsx`: `<Can />`
- `src/packages/url-state/use-persistent-query-states.ts`: URL state with optional localStorage hydration
- `src/core/components/forms/tanstack-form.tsx`: reusable TanStack Form field adapters

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start development server |
| `pnpm typecheck` | Run TypeScript |
| `pnpm lint` | Run ESLint |
| `pnpm lint:strict` | Run ESLint with zero warnings |
| `pnpm check` | Run typecheck and lint |
| `pnpm build` | Production build |
| `pnpm format` | Format code with Prettier |

Vitest and Testing Library are intentionally not included in this pass.

## License

MIT
