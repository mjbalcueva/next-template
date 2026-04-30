import "server-only"

import { headers } from "next/headers"

import { auth } from "@/services/better-auth"

export const getSession = async () => auth.api.getSession({ headers: await headers() })
