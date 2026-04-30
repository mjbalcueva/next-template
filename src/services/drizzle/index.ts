import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as authSchema from "@/services/drizzle/schema/auth"
import * as todosSchema from "@/services/drizzle/schema/todos"
import { env } from "@/services/t3-env"

const schema = { ...authSchema, ...todosSchema }

const globalForDb = globalThis as unknown as {
	client: ReturnType<typeof postgres> | undefined
}

const client =
	globalForDb.client ??
	postgres(env.DATABASE_URL, {
		max: env.NODE_ENV === "production" ? 10 : 1,
	})

if (env.NODE_ENV !== "production") globalForDb.client = client

export const db = drizzle(client, { schema, casing: "snake_case" })
