"use client";

import { Button } from "#/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      {theme === "dark" ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme("light")}
        >
          <SunIcon className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme("dark")}
        >
          <MoonIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
