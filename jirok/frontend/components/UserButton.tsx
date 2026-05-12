"use client";
import { getCurrentMe, logout } from "../actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader, LogOutIcon, UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import Link from "next/link";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const UserButton = () => {
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentMe,
  });

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear(); // clear all cached data
      router.push("/login");
    },
    onError: () => toast.error("Logout failed"),
  });
  const handleLogout = () => {
    mutation.mutate();
  };

  if (isLoading)
    return (
      <div className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border-neutral-300">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  if (!user) return <div>user is null</div>; // todo! make it NULL !
  // const { name, email } = user.results[0];
  const name = user.results[0].name.title;
  const email = user.results[0].email;
  console.log(user);
  const avatarFallback = name
    ? name.charAt(0).toUpperCase()
    : (email.charAt(0).toUpperCase() ?? "U");
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar size="lg" className="size-10 hover:opacity-85 transition">
          <AvatarImage
            src={user.results[0].picture.medium}
            alt="Avatar image"
          />
          <AvatarFallback className="bg-blue-500 font-medium text-gray-900 flex items-center justify-center">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-40"
        sideOffset={10}
      >
        <DropdownMenuItem>
          <UserIcon />
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
