import { base } from "@/services/orpc/context"
import { authMiddleware } from "@/services/orpc/middlewares/auth"

export const pub = base

export const authorized = base.use(authMiddleware)
