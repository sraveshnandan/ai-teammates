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

export function BotDialog() {
  const [open, setOpen] = React.useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateBotInput>({
    resolver: zodResolver(createBotSchema),
  })

  async function onSubmit(data: CreateBotInput) {
    try {
      await createBot(data)
      toast.add({
        title: "Bot created!",
        description: "Your new bot is ready.",
      })
      setOpen(false)
      reset()
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new bot</DialogTitle>
          <DialogDescription>
            Give your bot a face, a name, and a job to do.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
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

            <Field>
              <FieldLabel htmlFor="instructions">
                Instructions
                <FieldDescription>(optional)</FieldDescription>
              </FieldLabel>
              <FieldContent>
                <Textarea
                  id="instructions"
                  placeholder="Be polite, friendly, and concise..."
                  {...register("instructions")}
                />
              </FieldContent>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
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
      </DialogContent>
    </Dialog>
  )
}