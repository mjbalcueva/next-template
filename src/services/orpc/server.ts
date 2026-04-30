import "server-only"

import { headers as nextHeaders } from "next/headers"
import { createRouterClient } from "@orpc/server"

import { router } from "@/services/orpc/router"

globalThis.$client = createRouterClient(router, {
	context: async () => ({
		headers: await nextHeaders(),
	}),
})
