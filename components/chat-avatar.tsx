import Image from "next/image"
import { cn } from "@/lib/utils"

interface ChatAvatarProps {
  seed: string
  animated?: boolean
  className?: string
}

export function ChatAvatar({
  seed,
  animated = false,
  className,
}: ChatAvatarProps) {
  const params = new URLSearchParams({ seed })
  if (animated) {
    params.set("animationVariant", "medium")
  }
  const src = `https://api.dicebear.com/10.x/gaze/svg?${params}`

  return (
    <Image
      src={src}
      alt={`Avatar for ${seed}`}
      width={32}
      height={32}
      className={cn("rounded-full", className)}
      unoptimized
    />
  )
}