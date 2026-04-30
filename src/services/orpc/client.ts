import { createORPCClient } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import type { RouterClient } from "@orpc/server"
import { createTanstackQueryUtils } from "@orpc/tanstack-query"

import type { router } from "@/services/orpc/router"

declare global {
	var $client: RouterClient<typeof router> | undefined
}

const link = new RPCLink({
	url: () => {
		if (typeof window === "undefined") {
			throw new Error("RPCLink is not allowed on the server side.")
		}
		return `${window.location.origin}/api/rpc`
	},
})

/**
 * On the server, falls back to the in-process router client set on
 * `globalThis.$client` by `./server.ts`. In the browser, uses RPCLink.
 */
export const client: RouterClient<typeof router> = globalThis.$client ?? createORPCClient(link)

export const orpc = createTanstackQueryUtils(client)
