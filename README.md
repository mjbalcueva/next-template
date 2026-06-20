# Next Template

A **frontend-first Next.js template** for enterprise applications. Built with RBAC/ABAC permissions, TanStack Query, better-fetch, Zustand, and shadcn/ui.

Created by [@mjbalcueva](https://github.com/mjbalcueva).

## Tech Stack

| Layer         | Technology                                                                                     |
| ------------- | ---------------------------------------------------------------------------------------------- |
| Framework     | Next.js 16 (App Router) + React 19                                                             |
| Data Fetching | [TanStack Query](https://tanstack.com/query) + [better-fetch](https://better-fetch.vercel.app) |
| State         | [Zustand](https://zustand.docs.pmnd.rs) (auth, permissions, client state)                    |
| Validation    | [Zod](https://zod.dev) (runtime schema validation)                                             |
| UI            | [shadcn/ui](https://ui.shadcn.com) + [Tailwind CSS 4](https://tailwindcss.com)                 |
| Auth          | Backend-agnostic (token-based, works with any REST API)                                        |
| Permissions   | RBAC/ABAC matrix with `<Can>` component + `useCan()` hooks                                     |
| Env           | [t3-env](https://env.t3.gg) (type-safe environment variables)                                  |

## Getting Started

```bash
pn install
pn dev
```

Open [http://localhost:3000](http://localhost:3000).

### Mock API

The template includes Next.js API route handlers in `src/app/api/` that serve mock data so the app runs without any backend. When you connect a real backend:

1. Set `NEXT_PUBLIC_API_URL` to your API
2. Delete `src/app/api/` — the entire folder

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Architecture

```
src/
├── app/                    # Next.js App Router pages + API mock routes
├── core/                   # Low-level primitives (shadcn/ui, utils, styles)
│   ├── components/ui/      # shadcn components
│   ├── lib/                # cn(), getApiUrl()
│   └── styles/             # globals.css
├── packages/               # Internal shared libraries (reused everywhere)
│   ├── tanstack/           # better-fetch client, QueryClient provider, query-factory
│   └── access-control/     # RBAC/ABAC — store, constants, <Can>, hooks, routes
├── services/               # Third-party service integrations (payment, email, etc.)
├── features/               # Self-contained feature modules
│   ├── auth/               # Zustand auth store (login, logout, session, token)
│   ├── todo/               # Example feature
│   │   ├── api/            # Zod schemas + API client
│   │   ├── lib/            # TanStack Query (query-options + mutations)
│   │   └── components/     # React components
│   ├── site/               # Site shell (header)
│   └── home/               # Home page components
├── env.ts                  # t3-env: type-safe environment variables
└── proxy.ts                # Route protection (auth token check)
```

### Permission System

Define permissions once, use anywhere:

```tsx
// Hook (function-based)
const canDelete = useCan("todos:delete")

// Component (JSX-based)
<Can permission="todos:delete" fallback={<LockIcon />}>
  <DeleteButton />
</Can>
```

Edit `src/packages/permissions/constants.ts` to customize roles and permissions.

### Route Protection

Edit `src/packages/permissions/routes.ts` to control which routes require authentication:

```ts
export const PROXY_PROTECTED_PREFIXES = ["/todos", "/settings"]
```

## Connecting to a Backend

This template is backend-agnostic:

1. Set `NEXT_PUBLIC_API_URL` to your API's base URL.
2. Update the API schema in `src/packages/tanstack/client.ts` to match your endpoints.
3. The auth flow expects `POST /auth/login` and `POST /auth/register` returning `{ token, user }`.
4. The token is stored in localStorage and sent as `Authorization: Bearer <token>`.

### Laravel Sanctum Example

With Laravel Sanctum API tokens:

1. Create a token on login: `$user->createToken('api')->plainTextToken`
2. Return it in the login response as `{ token: "...", user: {...} }`
3. The template automatically injects the token into all API requests.

## Scripts

| Command     | Description               |
| ----------- | ------------------------- |
| `pn dev`    | Start development server  |
| `pn build`  | Production build          |
| `pn format` | Format code with Prettier |
| `pn lint`   | Lint with ESLint          |

## License

MIT
