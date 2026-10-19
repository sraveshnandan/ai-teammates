"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { bots } from "@/lib/schema"
import { createBotSchema, type CreateBotInput } from "@/lib/validators/bot"
import { nanoid } from "nanoid"

export async function createBot(input: CreateBotInput) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const parsed = createBotSchema.parse(input)

  const [bot] = await db
    .insert(bots)
    .values({
      id: nanoid(10),
      userid: userId,
      name: parsed.name,
      job: parsed.job,
      instructions: parsed.instructions,
      avatar: nanoid(10),
    })
    .returning()

  if (!bot) {
    throw new Error("Failed to create bot")
  }

  return { success: true, bot }
}