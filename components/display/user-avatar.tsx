import { Avatar, AvatarFallback, AvatarImage } from "@/components/display/avatar"
import type { User } from "@/types"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  user: User | { fullName: string; profileImage?: string }
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const sizeClasses = {
  sm: "h-6 w-6 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
}

export function UserAvatar({ user, size = "md", className }: UserAvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={user.profileImage} alt={user.fullName} />
      <AvatarFallback className="bg-primary text-primary-foreground">
        {getInitials(user.fullName)}
      </AvatarFallback>
    </Avatar>
  )
}
