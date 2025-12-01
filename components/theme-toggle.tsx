"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Moon, Sun, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function ThemeToggle({ className, size = "md" }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className={cn(
          "relative rounded-full bg-secondary p-1",
          size === "sm" && "w-14 h-7",
          size === "md" && "w-16 h-8",
          size === "lg" && "w-20 h-10",
          className,
        )}
      />
    )
  }

  const isDark = resolvedTheme === "dark"

  const toggleTheme = () => {
    setIsAnimating(true)
    setTheme(isDark ? "light" : "dark")
    setTimeout(() => setIsAnimating(false), 700)
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "group relative rounded-full transition-all duration-500 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background overflow-hidden",
        isDark
          ? "bg-gradient-to-r from-[oklch(0.06_0.02_250)] via-[oklch(0.1_0.03_250)] to-[oklch(0.06_0.02_250)] shadow-[0_0_25px_oklch(0.65_0.28_250_/_0.4),inset_0_1px_1px_oklch(1_0_0_/_0.1)]"
          : "bg-gradient-to-r from-[oklch(0.55_0.25_250)] via-[oklch(0.6_0.22_250)] to-[oklch(0.55_0.25_250)] shadow-[0_4px_20px_oklch(0.55_0.25_250_/_0.5)]",
        size === "sm" && "w-14 h-7",
        size === "md" && "w-16 h-8",
        size === "lg" && "w-20 h-10",
        className,
      )}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {isDark ? (
          <>
            {/* Stars for dark mode */}
            <span
              className={cn(
                "absolute w-1 h-1 rounded-full bg-white/70 transition-all duration-700",
                size === "sm" ? "top-1 left-2" : size === "md" ? "top-1.5 left-2.5" : "top-2 left-3",
                isAnimating ? "opacity-100 scale-150" : "opacity-50 animate-pulse",
              )}
            />
            <span
              className={cn(
                "absolute w-0.5 h-0.5 rounded-full bg-white/50 transition-all duration-700 delay-100",
                size === "sm" ? "top-3 left-4" : size === "md" ? "top-4 left-5" : "top-5 left-6",
                isAnimating ? "opacity-100 scale-150" : "opacity-40 animate-pulse",
              )}
              style={{ animationDelay: "0.5s" }}
            />
            <span
              className={cn(
                "absolute w-1.5 h-1.5 rounded-full bg-[oklch(0.65_0.28_250)] transition-all duration-700 delay-200",
                size === "sm" ? "bottom-1.5 left-3" : size === "md" ? "bottom-2 left-4" : "bottom-2.5 left-5",
                isAnimating ? "opacity-100 scale-150" : "opacity-60 animate-pulse",
              )}
              style={{ animationDelay: "1s" }}
            />
            {/* Neon glow line */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[oklch(0.65_0.28_250)] to-transparent opacity-50" />
          </>
        ) : (
          <>
            {/* Light rays for light mode */}
            <span
              className={cn(
                "absolute w-2 h-2 rounded-full bg-white/40 blur-[2px] transition-all duration-700",
                size === "sm" ? "top-0.5 right-2.5" : size === "md" ? "top-1 right-3" : "top-1.5 right-4",
                isAnimating ? "opacity-100 scale-150" : "opacity-70",
              )}
            />
            <span
              className={cn(
                "absolute w-1.5 h-1.5 rounded-full bg-white/30 blur-[1px] transition-all duration-700 delay-100",
                size === "sm" ? "bottom-0.5 right-4" : size === "md" ? "bottom-1 right-5" : "bottom-1.5 right-6",
                isAnimating ? "opacity-100 scale-150" : "opacity-50",
              )}
            />
          </>
        )}
      </div>

      {/* Track icons - sun and moon on opposite sides */}
      <div className="absolute inset-0 flex items-center justify-between px-1.5">
        <Sun
          className={cn(
            "transition-all duration-500",
            size === "sm" && "h-3.5 w-3.5",
            size === "md" && "h-4 w-4",
            size === "lg" && "h-5 w-5",
            isDark ? "text-[oklch(0.65_0.28_250)]/60 rotate-0" : "text-white/0 -rotate-90 scale-0",
          )}
        />
        <Moon
          className={cn(
            "transition-all duration-500",
            size === "sm" && "h-3.5 w-3.5",
            size === "md" && "h-4 w-4",
            size === "lg" && "h-5 w-5",
            isDark ? "text-white/0 rotate-90 scale-0" : "text-white/50 rotate-0",
          )}
        />
      </div>

      {/* Sliding thumb with icon */}
      <div
        className={cn(
          "absolute top-0.5 flex items-center justify-center rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          isDark
            ? "bg-gradient-to-br from-[oklch(0.14_0.03_250)] to-[oklch(0.08_0.02_250)] shadow-[0_0_20px_oklch(0.65_0.28_250_/_0.7),0_0_40px_oklch(0.65_0.28_250_/_0.4),inset_0_1px_2px_oklch(1_0_0_/_0.15)]"
            : "bg-white shadow-[0_2px_12px_oklch(0_0_0_/_0.25)]",
          size === "sm" && "w-6 h-6",
          size === "md" && "w-7 h-7",
          size === "lg" && "w-9 h-9",
          isDark
            ? size === "sm"
              ? "left-[calc(100%-1.625rem)]"
              : size === "md"
                ? "left-[calc(100%-1.875rem)]"
                : "left-[calc(100%-2.375rem)]"
            : "left-0.5",
          isAnimating && "scale-90",
        )}
      >
        {/* Neon ring animation for dark mode */}
        {isDark && (
          <>
            <div className="absolute inset-0 rounded-full border border-[oklch(0.65_0.28_250_/_0.6)] animate-pulse" />
            <div className="absolute inset-[-2px] rounded-full border border-[oklch(0.65_0.28_250_/_0.3)] animate-ping-slow" />
          </>
        )}

        {/* Icon inside thumb */}
        {isDark ? (
          <div className="relative flex items-center justify-center">
            <Moon
              className={cn(
                "text-[oklch(0.7_0.32_250)] transition-all duration-500 drop-shadow-[0_0_10px_oklch(0.65_0.28_250)]",
                size === "sm" && "h-3.5 w-3.5",
                size === "md" && "h-4 w-4",
                size === "lg" && "h-5 w-5",
                isAnimating ? "rotate-[360deg] scale-110" : "rotate-0",
              )}
            />
            {/* Sparkle effect */}
            <Sparkles
              className={cn(
                "absolute -top-0.5 -right-0.5 text-[oklch(0.7_0.32_250)] transition-all duration-300",
                size === "sm" && "h-2 w-2",
                size === "md" && "h-2.5 w-2.5",
                size === "lg" && "h-3 w-3",
                isAnimating ? "opacity-100 scale-125" : "opacity-0 scale-75",
              )}
            />
          </div>
        ) : (
          <Sun
            className={cn(
              "text-[oklch(0.55_0.25_250)] transition-all duration-500",
              size === "sm" && "h-3.5 w-3.5",
              size === "md" && "h-4 w-4",
              size === "lg" && "h-5 w-5",
              isAnimating ? "rotate-180 scale-110" : "rotate-0",
            )}
          />
        )}
      </div>

      {/* Hover glow effect */}
      <div
        className={cn(
          "absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          isDark
            ? "bg-[radial-gradient(circle_at_center,oklch(0.65_0.28_250_/_0.2),transparent_70%)]"
            : "bg-[radial-gradient(circle_at_center,oklch(1_0_0_/_0.25),transparent_70%)]",
        )}
      />
    </button>
  )
}
