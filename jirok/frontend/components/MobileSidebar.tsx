"use client";
import { MenuIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Sidebar } from "./Siderbar";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const MobileSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    
    useEffect(() => {
        setIsOpen(false);
    }, []);
  return (
    <Sheet modal={true} open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon-lg"
          variant="ghost"
          className="lg:hidden bg-orange-300 hover:bg-orange-400"
        >
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        overlayClassName="z-40 bg-black/10 backdrop-blur-md"
        className="z-40 max-w-none bg-white border-r shadow-none data-[side=left]:w-[40vw] data-[side=left]:top-16 data-[side=left]:bottom-0 data-[side=left]:h-auto"
      >
        <SheetHeader className="hidden">
          <SheetTitle></SheetTitle>
        </SheetHeader>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
