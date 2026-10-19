import { nanoid } from "nanoid"
import {
  pgTable,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core"

export const bots = pgTable(
  "bots",
  {
    id: text("id").$default(nanoid).primaryKey(),
    userid: text("userid").notNull(),
    name: text("name").notNull(),
    avatar: text("avatar").$default(nanoid).notNull(),
    job: text("job").notNull(),
    instructions: text("instructions"),
    sandboxid: text("sandboxid"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("userid_idx").on(table.userid),
  ]
)

export type Bot = typeof bots
export type NewBot = Omit<Bot, "id" | "avatar" | "createdAt">