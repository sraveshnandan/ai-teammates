import { nanoid } from "nanoid"
import {
  pgTable,
  text,
  timestamp,
  index,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const chatKind = pgEnum("chat_kind", ["direct", "group"])

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

export const chats = pgTable(
  "chats",
  {
    id: text("id").$default(nanoid).primaryKey(),
    userid: text("userid").notNull(),
    kind: chatKind("kind").notNull().default("direct"),
    name: text("name"),
    lastMessagePreview: text("last_message_preview"),
    lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("chats_userid_idx").on(table.userid),
  ]
)

export const chatMembers = pgTable(
  "chat_members",
  {
    chatId: text("chat_id")
      .notNull()
      .references(() => chats.id, { onDelete: "cascade" }),
    botId: text("bot_id")
      .notNull()
      .references(() => bots.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => ({
    botIdIndex: index("chat_members_bot_id_idx").on(table.botId),
    chatIdIndex: index("chat_members_chat_id_idx").on(table.chatId),
    pk: primaryKey({ columns: [table.botId, table.chatId] }),
  })
)

export const botsRelations = relations(bots, ({ many }) => ({
  memberships: many(chatMembers),
}))

export const chatsRelations = relations(chats, ({ many }) => ({
  members: many(chatMembers),
}))

export const chatMembersRelations = relations(chatMembers, ({ one }) => ({
  chat: one(chats, {
    fields: [chatMembers.chatId],
    references: [chats.id],
  }),
  bot: one(bots, {
    fields: [chatMembers.botId],
    references: [bots.id],
  }),
}))

export type Bot = typeof bots
export type NewBot = Omit<Bot, "id" | "avatar" | "createdAt">
export type Chat = typeof chats
export type NewChat = Omit<Chat, "id" | "createdAt" | "lastMessageAt" | "lastMessagePreview">
export type ChatMember = typeof chatMembers
export type NewChatMember = Omit<ChatMember, "joinedAt">
