"use client";
import Image from "next/image";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserButton } from "./UserButton";
import { Icon } from "lucide-react";
import { FaPlus } from "react-icons/fa6";
import { MobileSidebar } from "./MobileSidebar";

export default function Navbar() {
  const pathname = usePathname();

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
          <Button
            size="lg"
            className="text-base px-6 py-4 font-semibold text-center sm:text-lg bg-blue-600 hover:bg-blue-800"
          >
            <FaPlus />
            Create
          </Button>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
