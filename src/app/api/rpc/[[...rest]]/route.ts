import { RPCHandler } from "@orpc/server/fetch"

import { router } from "@/services/orpc/router"

const handler = new RPCHandler(router)

const handle = async (request: Request) => {
	const { response } = await handler.handle(request, {
		prefix: "/api/rpc",
		context: {
			headers: request.headers,
		},
	})
	return response ?? new Response("Not found", { status: 404 })
}

export {
	handle as GET,
	handle as POST,
	handle as PUT,
	handle as PATCH,
	handle as DELETE,
	handle as HEAD,
}
