import { toNextJsHandler } from "better-auth/next-js"

import { auth } from "@/services/better-auth"

export const { GET, POST } = toNextJsHandler(auth.handler)
