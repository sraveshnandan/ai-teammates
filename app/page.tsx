import { Show, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-end gap-3 p-4">
        <Show when="signed-out">
          <Button render={<a href="/sign-in" />} variant="ghost" size="sm">
            Sign in
          </Button>
          <Button render={<a href="/sign-up" />} size="sm">
            Sign up
          </Button>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="flex max-w-md flex-col gap-4 text-sm leading-loose">
          <div>
            <h1 className="font-medium">Project ready!</h1>
            <p>You may now add components and start building.</p>
            <p>We&apos;ve already added the button component for you.</p>
            <Button className="mt-2">Button</Button>
          </div>
          <Show when="signed-in">
            <div className="font-mono text-xs text-muted-foreground">
              You are signed in.
            </div>
          </Show>
          <div className="font-mono text-xs text-muted-foreground">
            (Press <kbd>d</kbd> to toggle dark mode)
          </div>
        </div>
      </main>
    </div>
  )
}
