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
import { useState } from "react";

export const MobileSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
  return (
    <Sheet modal={true} open={isOpen} onOpenChange={setIsOpen} >
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
        overlayClassName="z-40 bg-black/10 backdrop-blur-md dark:bg-black/30"
        className="z-40 max-w-none border-r border-border bg-background shadow-none data-[side=left]:w-full sm:data-[side=left]:w-[40vw] data-[side=left]:top-16 data-[side=left]:bottom-0 data-[side=left]:h-auto"
      >
        <SheetHeader className="hidden">
          <SheetTitle></SheetTitle>
        </SheetHeader>
        <Sidebar onNavigate={() => setIsOpen(false)} />
      </SheetContent>
    </Sheet>
  );
};
