import { defineConfig } from "drizzle-kit"

import { env } from "@/services/t3-env"

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/services/drizzle/schema/*",
	out: "./src/services/drizzle/migrations",
	casing: "snake_case",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
})
