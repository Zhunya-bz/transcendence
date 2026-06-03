"use client";

import { User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getBackendUrl } from "@/lib/backend";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string | null;
  alt?: string;
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function UserAvatar({
  src,
  alt = "User avatar",
  size = "default",
  className,
}: UserAvatarProps) {
  const avatarSrc = src ? getBackendUrl(src) : "";
  const hasImage = Boolean(avatarSrc);

  return (
    <Avatar size={size} className={cn("relative", className)}>
      {hasImage ? <AvatarImage src={avatarSrc} alt={alt} /> : null}
      <AvatarFallback className="bg-blue-100 text-blue-600">
        <User
          aria-hidden="true"
          className="size-4 group-data-[size=lg]/avatar:size-5 group-data-[size=sm]/avatar:size-3"
        />
      </AvatarFallback>
    </Avatar>
  );
}
