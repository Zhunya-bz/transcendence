"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "./UserButton";
import { MobileSidebar } from "./MobileSidebar";
import { ModalCreateTask } from "./modal-create-task";
import { ThemeToggle } from "./theme-toggle";

export default function Navbar() {
  const pathname = usePathname();
  const isProjectsPage = pathname === "/projects";
  const isProfilePage = pathname === "/profile" || pathname.includes("/profile/");
  const hideCreateTaskButton = isProjectsPage || isProfilePage;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        <MobileSidebar />
        <div className="hidden lg:flex items-center space-x-2">
          <Link href="/">
            <Image
              src="/mascot-1.png"
              width={40}
              height={40}
              alt="Icon Jirok"
            />
          </Link>
          <span className="text-xl font-bold text-foreground">Jirok</span>
        </div>
        <div>{!hideCreateTaskButton && <ModalCreateTask />}</div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </header>
  );
}
