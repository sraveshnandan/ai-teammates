import { z } from "zod"

export const createBotSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  job: z.string().min(1, "Job is required").max(500),
  instructions: z.string().max(2000).optional(),
})

export type CreateBotInput = z.infer<typeof createBotSchema>