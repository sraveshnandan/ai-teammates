"use client"

import * as React from "react"
import { nanoid } from "nanoid"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Spinner } from "@/components/ui/spinner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

import { ChatAvatar } from "@/components/chat-avatar"
import { toast } from "@/components/ui/toast"

import { createBotSchema, type CreateBotInput } from "@/lib/validators/bot"
import { createBot } from "@/app/actions/bot"

const JOB_TAGS = ["Research assistant", "Code reviewer", "Writing editor", "Tutor"] as const

const ROLE_DESCRIPTIONS: Record<string, string> = {
  "Research assistant":
    "Answer briefly, cite sources, and ask before running anything destructive.",
  "Code reviewer":
    "Review code for bugs, security issues, and best practices before merging.",
  "Writing editor": "Edit and improve writing for clarity, tone, and grammar.",
  Tutor: "Explain concepts clearly and adapt to the learner's pace.",
}

function ShuffleIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mr-2 shrink-0"
    >
      <path d="M1 4v6a1 1 0 0 0 1 1h6" />
      <path d="M23 20v-6a1 1 0 0 0-1-1h-6" />
      <path d="M20.5 3.5L2.5 21.5" />
    </svg>
  )
}

export function BotDialog() {
  const [open, setOpen] = React.useState(false)
  const [selectedJob, setSelectedJob] = React.useState<string | null>("Research assistant")
  const [faceSeed, setFaceSeed] = React.useState(nanoid(10))
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateBotInput>({
    resolver: zodResolver(createBotSchema),
    defaultValues: {
      name: "",
      job: "Research assistant",
      instructions: ROLE_DESCRIPTIONS["Research assistant"],
    },
  })

  const handleShuffle = () => {
    setFaceSeed(nanoid(10))
  }

  const handleSelectJob = (job: string) => {
    setSelectedJob(job)
    setValue("job", job)
    setValue("instructions", ROLE_DESCRIPTIONS[job])
  }

  async function onSubmit(data: CreateBotInput) {
    try {
      const job = selectedJob ?? data.job
      await createBot({ ...data, job })
      toast.add({
        title: "Bot created!",
        description: "Your new bot is ready.",
      })
      setOpen(false)
      setSelectedJob("Research assistant")
      setFaceSeed(nanoid(10))
      reset({
        name: "",
        job: "Research assistant",
        instructions: ROLE_DESCRIPTIONS["Research assistant"],
      })
    } catch {
      toast.add({
        title: "Failed to create bot",
        description: "Please try again.",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm">Create bot</Button>} />
      <DialogContent className="max-w-sm p-0">
        <div className="space-y-6">
          <div className="px-6 py-4">
            <DialogTitle>New bot</DialogTitle>
            <DialogDescription>
              Give it a face, a name, and a job to do.
            </DialogDescription>
          </div>

          {/* Job tags */}
          <div className="px-6">
            <div className="flex flex-wrap gap-2">
              {JOB_TAGS.map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant={selectedJob === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSelectJob(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Face */}
            <div className="px-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ChatAvatar seed={faceSeed} />
                  <div className="flex flex-col gap-1">
                    <FieldLabel htmlFor="face">Face</FieldLabel>
                    <p className="text-xs text-muted-foreground">
                      Shuffle until you find one you like.
                    </p>
                  </div>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={handleShuffle}>
                  <ShuffleIcon /> Shuffle
                </Button>
              </div>
            </div>

            {/* Name */}
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <FieldContent>
                <Input id="name" className="rounded-full" {...register("name")} />
                {errors.name && <span className="text-xs text-destructive">{errors.name.message}</span>}
              </FieldContent>
            </Field>

            {/* Job */}
            <Field>
              <FieldLabel htmlFor="job">Job</FieldLabel>
              <FieldContent>
                <Input id="job" className="rounded-full" {...register("job")} />
                {errors.job && <span className="text-xs text-destructive">{errors.job.message}</span>}
              </FieldContent>
            </Field>

            {/* Instructions */}
            <Field>
              <FieldLabel htmlFor="instructions">How it should work</FieldLabel>
              <FieldContent>
                <Textarea
                  id="instructions"
                  className="rounded-full"
                  {...register("instructions")}
                />
                {errors.instructions && (
                  <span className="text-xs text-destructive">{errors.instructions.message}</span>
                )}
              </FieldContent>
            </Field>

            <DialogFooter className="bg-muted/50 pt-6 border-t border-border px-6 pb-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="secondary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner data-icon="inline-start" /> Creating...
                  </>
                ) : (
                  "Create bot"
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
