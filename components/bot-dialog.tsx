"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Spinner } from "@/components/ui/spinner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

import { toast } from "@/components/ui/toast"

import { createBotSchema, type CreateBotInput } from "@/lib/validators/bot"
import { createBot } from "@/app/actions/bot"

const JOB_TAGS = ["Research assistant", "Code reviewer", "Writing editor", "Tutor"] as const

export function BotDialog() {
  const [open, setOpen] = React.useState(false)
  const [selectedJob, setSelectedJob] = React.useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateBotInput>({
    resolver: zodResolver(createBotSchema),
    defaultValues: {
      name: "",
      job: "",
      instructions: undefined,
    },
  })

  async function onSubmit(data: CreateBotInput) {
    try {
      const job = selectedJob ?? data.job
      await createBot({ ...data, job })
      toast.add({
        title: "Bot created!",
        description: "Your new bot is ready.",
      })
      setOpen(false)
      setSelectedJob(null)
      reset({ name: "", job: "", instructions: undefined })
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
          <div className="flex flex-wrap gap-2 p-6 px-6">
            {JOB_TAGS.map((tag) => (
              <Button
                key={tag}
                type="button"
                variant={selectedJob === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedJob(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Face */}
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="face">Face</FieldLabel>
                <div className="flex items-center gap-3 mt-2">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-300 to-orange-400 flex items-center justify-center text-sm font-medium border border-pink-200">
                    A
                  </div>
                  <Button type="button" variant="outline" size="sm">
                    Shuffle
                  </Button>
                </div>
              </Field>
            </FieldGroup>

            {/* Name */}
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <FieldContent>
                <Input
                  id="name"
                  placeholder="My Support Bot"
                  {...register("name")}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <FieldError>{errors.name.message}</FieldError>}
              </FieldContent>
            </Field>

            {/* Job */}
            <Field data-invalid={!!errors.job}>
              <FieldLabel htmlFor="job">Job</FieldLabel>
              <FieldContent>
                <Input
                  id="job"
                  placeholder="Answering customer support tickets"
                  {...register("job")}
                  aria-invalid={!!errors.job}
                />
                {errors.job && <FieldError>{errors.job.message}</FieldError>}
              </FieldContent>
            </Field>

            {/* Instructions */}
            <Field>
              <FieldLabel htmlFor="instructions">How it should work</FieldLabel>
              <FieldContent>
                <Textarea
                  id="instructions"
                  placeholder="Be polite, friendly, and concise..."
                  {...register("instructions")}
                />
              </FieldContent>
            </Field>

            <DialogFooter className="bg-muted/50 pt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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