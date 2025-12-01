"use client"

import { Button } from "@/components/ui/button"
import { MessageSquarePlus, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface FloatingActionButtonProps {
  onPostClick: () => void
}

export function FloatingActionButton({ onPostClick }: FloatingActionButtonProps) {
  return (
    // Made visible across all screen sizes with proper spacing
    <div className="fixed bottom-6 sm:bottom-8 left-4 sm:left-6 lg:left-[19rem] z-40 group">
      {/* Glow effect background */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent opacity-30 blur-xl group-hover:opacity-50 transition-opacity duration-500" />

      {/* Ping animation for attention */}
      <span
        className="absolute inset-0 rounded-full bg-primary/30 animate-ping pointer-events-none"
        style={{ animationDuration: "2s" }}
      />

      <Button
        size="lg"
        className={cn(
          "relative rounded-full",
          "h-14 sm:h-16 lg:h-16",
          "px-5 sm:px-6 lg:px-8",
          "gap-2 sm:gap-3",
          // Shadow and depth
          "shadow-2xl hover:shadow-primary/30",
          // Gradient background
          "bg-gradient-to-r from-primary via-primary to-accent",
          "hover:from-primary/90 hover:via-primary/90 hover:to-accent/90",
          // Transitions and animations
          "transition-all duration-300 ease-out",
          "hover:scale-105 active:scale-95",
          // Border for definition
          "border-2 border-white/20",
          // Ring effect on hover
          "hover:ring-4 hover:ring-primary/20",
        )}
        onClick={onPostClick}
      >
        <MessageSquarePlus className="h-5 w-5 sm:h-6 sm:w-6" />
        <span className="text-sm sm:text-base font-semibold whitespace-nowrap">Post Sentiment</span>
        <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-foreground/80 animate-pulse" />
      </Button>
    </div>
  )
}
