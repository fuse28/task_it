"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import Sidebar from "./MainSidebar";
import ProjectSidebar from "./ProjectSidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const isProjectRoute = pathname.startsWith("/projects/");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const ActiveSidebar = isProjectRoute ? ProjectSidebar : Sidebar;

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:block">
        <ActiveSidebar />
      </div>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-64 p-0 [&>button]:hidden">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <ActiveSidebar />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-border p-3 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobileNavOpen(true)}>
            <MenuIcon className="size-5" />
          </Button>
          <span className="font-semibold text-foreground">TaskIt</span>
        </div>
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
