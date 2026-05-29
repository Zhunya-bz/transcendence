"use client";
import Image from "next/image";
import Link from "next/link";
import { UserButton } from "./UserButton";
import { MobileSidebar } from "./MobileSidebar";
import { ModalCreateTask } from "./modal-create-task";

export default function Navbar() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
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
          <span className="text-xl font-bold text-gray-900">Jirok</span>
        </div>
        <div>
          <ModalCreateTask />
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
