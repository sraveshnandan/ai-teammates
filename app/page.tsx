import { auth } from "@clerk/nextjs/server"
import { Show, UserButton } from "@clerk/nextjs"
import { ChatAvatar } from "@/components/chat-avatar"
import { BotDialog } from "@/components/bot-dialog"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty"
import { nanoid } from "nanoid"

export default async function Page() {
  await auth.protect()
  const seed = nanoid(10)

  return (
    <div className="flex min-h-svh flex-col dark">
      <header className="flex items-center justify-end gap-3 p-4">
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="flex w-full max-w-md flex-col">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ChatAvatar seed={seed} animated className="size-8" />
              </EmptyMedia>
              <EmptyTitle>No bots yet</EmptyTitle>
              <EmptyDescription>
                Create your first bot to get started. Bots are AI teammates
                that finish the work for you.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <BotDialog />
            </EmptyContent>
          </Empty>
        </div>
      </main>
    </div>
  )
}