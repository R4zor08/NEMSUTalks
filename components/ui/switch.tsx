"use client"

import type * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // Base styles
        "peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full p-0.5",
        // Border and background
        "border-2 border-transparent bg-input",
        // Transitions
        "transition-all duration-300 ease-out",
        // Focus states
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        // Disabled states
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Checked state with glow effect
        "data-[state=checked]:bg-primary data-[state=checked]:shadow-[0_0_12px_-2px_var(--glow)]",
        // Unchecked state
        "data-[state=unchecked]:bg-muted",
        // Hover effects
        "hover:data-[state=unchecked]:bg-muted-foreground/20",
        "hover:data-[state=checked]:shadow-[0_0_18px_-2px_var(--glow)]",
        // Active press effect
        "active:scale-95",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // Base styles
          "pointer-events-none block h-6 w-6 rounded-full shadow-lg ring-0",
          // Background
          "bg-background",
          // Transitions with spring effect
          "transition-all duration-300 ease-out",
          // Transform states
          "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
          // Scale animation on state change
          "data-[state=checked]:scale-100 data-[state=unchecked]:scale-100",
          // Inner glow for checked state
          "data-[state=checked]:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.2)]",
          "data-[state=unchecked]:shadow-[0_2px_6px_-2px_rgba(0,0,0,0.1)]",
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
