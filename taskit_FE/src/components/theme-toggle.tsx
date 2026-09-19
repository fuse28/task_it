"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function applyStoredTheme() {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = stored ? stored === "dark" : prefersDark;
  document.documentElement.classList.toggle("dark", dark);
}

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    applyStoredTheme();
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle(next: boolean) {
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <div className="flex items-center gap-2">
      <SunIcon className="size-4 text-muted-foreground" />
      <Switch checked={isDark} onCheckedChange={toggle} aria-label="Toggle dark mode" />
      <MoonIcon className="size-4 text-muted-foreground" />
    </div>
  );
}
