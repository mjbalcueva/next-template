---
name: next-template
description: >
  Server-first Next.js 16 / React 19 frontend template for Laravel Sanctum
  SPA cookie auth, TanStack Query/Form/Table, Recharts analytics, shadcn/ui,
  reui primitives, URL-synced state, and removable mock backend routes.
---

# next-template

Use this skill when working in this template, adding features, connecting a Laravel backend, or extending auth, forms, tables, analytics, and reusable packages.

## Architecture Rules

1. Prefer server-first App Router code. Fetch sessions and protect route groups on the server before rendering client UI.
2. Keep client components for actual interactivity: forms, mutations, filters, tables, charts, theme toggles, local UI state, and dev tools.
3. Do not add barrel files. Import directly from the file that owns the behavior.
4. Preserve `src/core/components/reui/` as reusable shadcn-like primitives and blocks.
5. Keep mocks easy to delete. Feature API calls should use resource paths like `todos`, `user`, and `permissions`; backend origin belongs in env.

## Auth

Use Laravel Sanctum SPA cookie auth:

- Browser requests use `credentials: "include"`.
- Mutating browser requests call `NEXT_PUBLIC_SANCTUM_CSRF_URL` first.
- Send the decoded `XSRF-TOKEN` cookie as `X-XSRF-TOKEN`.
- Server requests forward incoming cookies to Laravel and set `Origin` / `Referer`.
- Never store bearer tokens in localStorage or frontend-owned auth cookies.

Relevant files:

- `src/packages/api/fetch.ts`
- `src/packages/api/csrf.ts`
- `src/packages/auth/server.ts`
- `src/packages/auth/session-provider.tsx`
- `src/features/auth/api/auth.api.ts`

## Forms

Use TanStack Form with Zod validators and the shared shadcn adapters in `src/core/components/forms/tanstack-form.tsx`.

Prefer:

- `TextFormField`
- `PasswordFormField`
- `FormStatus`
- `SubmitButton`

Keep feature-specific schemas beside feature API code unless they are shared auth schemas.

## Tables And URL State

Use `src/packages/url-state/use-persistent-query-states.ts` for URL-synced state with optional localStorage persistence.

The intended behavior is:

- URL params are canonical.
- localStorage hydrates only when the URL has no query string.
- localStorage persistence can be disabled per surface.

Use `src/packages/table/filter-state.ts` for active filter badges and column filter key helpers.

## Analytics

Keep Recharts and shadcn chart wrappers. Do not add another runtime chart dependency unless the project has a concrete chart requirement Recharts cannot cover.

Use `src/packages/analytics/chart-panel.tsx` for reusable chart shells:

- `ChartPanel`
- `ChartSkeleton`
- `ChartEmptyState`

## Backend Switch

Mock backend defaults:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/mock
NEXT_PUBLIC_AUTH_URL=http://localhost:3000/api/mock
NEXT_PUBLIC_SANCTUM_CSRF_URL=http://localhost:3000/api/mock/sanctum/csrf-cookie
```

Laravel defaults:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_AUTH_URL=http://localhost:8000
NEXT_PUBLIC_SANCTUM_CSRF_URL=http://localhost:8000/sanctum/csrf-cookie
```

When Laravel is ready, set env and delete `src/app/api/mock/`.

## Verification

After code edits:

```bash
pnpm typecheck
pnpm lint
pnpm lint:strict
```

For Next compilation, use the repo's Next dev compile workflow before reporting completion.
