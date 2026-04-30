import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const todos = pgTable("todos", {
	id: uuid().primaryKey().defaultRandom(),
	text: text().notNull(),
	done: boolean().notNull().default(false),
	createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})
