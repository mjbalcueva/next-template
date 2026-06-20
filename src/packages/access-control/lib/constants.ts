/**
 * Permission & Role types.
 *
 * The backend (`/api/mock/permissions`) is the single source of truth
 * for the lists of permissions, actions, resources, and roles.
 *
 * To get the available values at runtime, use the hooks from `./store`:
 *   - `useAvailablePermissions()` — all `"resource:action"` strings
 *   - `useAvailableResources()`   — all resource names
 *   - `useAvailableActions()`     — all action names
 *   - `useAvailableRoles()`       — all role names
 *
 * ## Wildcard convention
 *
 * A user with `resource:manage` can perform any action on that resource.
 * This is a runtime convention, not enforced at the type level.
 */

export type Permission = string
export type Role = string
