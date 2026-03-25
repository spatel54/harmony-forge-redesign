"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ThemeToggle Atom
 * Extracts Pencil Node IDs:
 * - LqI9j (Light Mode Active state)
 * - 9DmQ7 (Dark Mode Active state)
 */
export const ThemeToggle = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid Hydration Mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a skeleton matching the layout to prevent CLS
    return <div className="w-[72px] h-[32px] rounded-full" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      ref={ref}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex items-center w-[72px] h-[32px] rounded-full p-[1px] transition-colors duration-200",
        isDark
          ? "bg-[var(--nocturne-detail)] ring-1 ring-inset ring-[var(--nocturne-surface-40)]"
          : "bg-[var(--neutral-200)] ring-1 ring-inset ring-[var(--sonata-detail)]",
        className,
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      {...props}
    >
      <div className="absolute inset-x-0 mx-auto flex w-full justify-between items-center px-[2px]">
        {/* Sun Container */}
        <div
          className={cn(
            "flex items-center justify-center w-[28px] h-[28px] rounded-full transition-colors duration-200 z-10",
            !isDark ? "bg-[var(--hf-accent)]" : "bg-transparent",
          )}
        >
          <Sun
            className={cn(
              "w-4 h-4 transition-colors duration-200",
              !isDark ? "text-[var(--text-on-light)]" : "text-[var(--nocturne-surface-40)]",
            )}
            strokeWidth={2}
          />
        </div>

        {/* Moon Container */}
        <div
          className={cn(
            "flex items-center justify-center w-[28px] h-[28px] rounded-full transition-colors duration-200 z-10",
            isDark ? "bg-[var(--hf-accent)]" : "bg-transparent",
          )}
        >
          <Moon
            className={cn(
              "w-4 h-4 transition-colors duration-200",
              isDark ? "text-[var(--neutral-900)]" : "text-[var(--neutral-700)]",
            )}
            strokeWidth={2}
          />
        </div>
      </div>
    </button>
  );
});

ThemeToggle.displayName = "ThemeToggle";
