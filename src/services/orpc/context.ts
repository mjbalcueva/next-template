import { os } from "@orpc/server"

export type ORPCContext = {
	headers: Headers
}

export const base = os.$context<ORPCContext>()
