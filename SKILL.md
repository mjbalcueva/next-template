---
name: next-template
description: Frontend-first Next.js template with RBAC/ABAC permissions, TanStack Query, better-fetch, Jotai, and shadcn/ui. Created by mjbalcueva.
---

# next-template

A production-ready, frontend-first Next.js template designed for enterprise applications.

## Tech Stack

- **Next.js 16** (App Router) with React 19
- **TanStack Query** — server state, caching, mutations
- **better-fetch** — type-safe fetch with Zod runtime validation
- **Jotai** — atomic UI state (auth, permissions)
- **shadcn/ui** — accessible, customizable UI components
- **Tailwind CSS 4** — utility-first styling

## When to use

- Building frontend applications that talk to any REST API (Laravel, Express, Go, etc.)
- SaaS dashboards, admin panels, and permission-gated apps
- Projects that need RBAC/ABAC from day one
- Teams that want a feature-based folder structure with clear separation of concerns

## Architecture

### Folder structure

```
src/
  app/                      # Next.js App Router pages, layouts, and API mock routes
  core/                     # Reusable primitives shared across the app
    components/             # shadcn/ui and shared UI components
    hooks/                  # Shared React hooks
    lib/                    # Utility functions (cn, etc.)
    providers/              # React context providers (theme, etc.)
    styles/                 # Global styles
  features/                 # Self-contained feature modules
    feat/                   # e.g. auth, settings, dashboard — each owns:
      api/                  # Zod schemas + feature-specific API calls
      components/           # Feature-specific React components
      lib/                  # TanStack Query options and mutations
  packages/                 # Shared libraries consumed across features (permissions, tanstack, etc.)
  services/                 # Third-party integrations (API client setup, SDK wrappers)
  env.ts                    # t3-env: type-safe environment variables
  proxy.ts                  # Route protection (token existence check)
```

### Data flow

```

Component → TanStack Query hook → feature client ($fetch) → Backend API
↕ ↕
Jotai atoms better-fetch
(auth state, (schema validation,
permissions) auth token injection)

```

## Permission System

Two ways to check permissions:

### Function-based (hooks)

```ts
const canDelete = useCan("todos:delete")
const canManage = useCanAll(["todos:update", "todos:delete"])
```

### JSX-based (component)

```tsx
<Can permission="todos:delete" fallback={<LockIcon />}>
  <DeleteButton />
</Can>
```

## Instructions for AI agents

1. Keep the feature-based folder structure — each feature owns its API client, queries, mutations, and components.
2. Use `queryOptions()` with key factories for TanStack Query (follow Tanner Linsley's patterns).
3. Use Zod schemas for API input/output validation — they live in `feature/api/*.schema.ts`.
4. Use `$fetch` from `@/services/tanstack/client` for all API calls — never use raw `fetch`.
5. Permission checks go in components via `<Can>` or `useCan()` — never in the proxy.
6. The proxy only checks for token existence — actual auth validation happens in the backend API.
7. Jotai atoms for UI state only — server data stays in TanStack Query.
