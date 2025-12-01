"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, Bell, Sparkles, User, Settings, LogOut, ChevronRight } from "lucide-react"
import { useAnnouncementsStore } from "@/lib/announcements-store"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  onMenuClick: () => void
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { getUnreadCount } = useAnnouncementsStore()
  const unreadCount = getUnreadCount()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-30 glass-effect border-b border-border/50">
      <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18 px-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 rounded-xl hover:bg-secondary/60 active:scale-95 transition-all duration-300"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-1.5 sm:gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-md scale-125" />
              <Image
                src="/images/nemsu-logo.png"
                alt="NEMSU Logo"
                width={32}
                height={32}
                className="relative rounded-full ring-2 ring-primary/30 shadow-md w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 object-cover bg-white"
                priority
              />
            </div>
            <span className="font-bold text-foreground flex items-center gap-1 text-sm sm:text-base">
              NEMSUTalks
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary animate-pulse-soft" />
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "relative h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 rounded-xl transition-all duration-300 active:scale-95 group",
              unreadCount > 0 ? "hover:bg-primary/10 hover:text-primary" : "hover:bg-secondary/60",
            )}
            asChild
          >
            <Link href="/dashboard/notifications">
              <Bell
                className={cn(
                  "h-4 w-4 sm:h-5 sm:w-5 transition-all duration-200",
                  unreadCount > 0 && "group-hover:animate-wiggle",
                )}
              />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 sm:top-0.5 sm:right-0.5 min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-[20px] bg-primary rounded-full ring-2 ring-background flex items-center justify-center text-[10px] sm:text-xs font-medium text-primary-foreground shadow-lg shadow-primary/50 animate-pulse-soft">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          </Button>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={cn(
                "relative group cursor-pointer flex items-center gap-1.5 p-1 rounded-xl transition-all duration-300",
                isProfileOpen ? "bg-secondary/60" : "hover:bg-secondary/40",
              )}
            >
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-semibold text-xs sm:text-sm shadow-lg transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
                JS
              </div>
              <ChevronRight
                className={cn(
                  "h-4 w-4 text-muted-foreground hidden sm:block transition-transform duration-300",
                  isProfileOpen && "rotate-90",
                )}
              />
            </button>

            {/* Profile Dropdown Menu */}
            <div
              className={cn(
                "absolute right-0 mt-2 w-64 sm:w-72 bg-card rounded-2xl border border-border/50 shadow-2xl overflow-hidden transition-all duration-300 origin-top-right",
                isProfileOpen
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none",
              )}
            >
              {/* User Info Header */}
              <Link
                href="/dashboard/profile"
                onClick={() => setIsProfileOpen(false)}
                className="block p-4 sm:p-5 border-b border-border/50 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent hover:from-primary/10 hover:via-primary/15 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-base sm:text-lg shadow-lg group-hover:scale-105 transition-transform duration-300">
                      JS
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-card flex items-center justify-center">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-card-foreground text-sm sm:text-base truncate">John Student</p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">student@nemsu.edu.ph</p>
                    <p className="text-xs text-primary mt-1 flex items-center gap-1 group-hover:underline">
                      View Profile
                      <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </p>
                  </div>
                </div>
              </Link>

              {/* Menu Items */}
              <div className="p-2 sm:p-2.5">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 sm:py-3 rounded-xl text-card-foreground hover:bg-secondary/60 transition-all duration-200 active:scale-[0.98] group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-secondary/80 flex items-center justify-center group-hover:bg-primary/10 transition-all duration-200">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-sm sm:text-base">Profile</span>
                    <p className="text-xs text-muted-foreground">Manage your account</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-200" />
                </Link>

                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 sm:py-3 rounded-xl text-card-foreground hover:bg-secondary/60 transition-all duration-200 active:scale-[0.98] group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-secondary/80 flex items-center justify-center group-hover:bg-primary/10 transition-all duration-200">
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-sm sm:text-base">Settings</span>
                    <p className="text-xs text-muted-foreground">Preferences & configuration</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-200" />
                </Link>

                <div className="my-2 mx-3 border-t border-border/50" />

                <Link
                  href="/"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 sm:py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-200 active:scale-[0.98] group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-all duration-200">
                    <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-sm sm:text-base">Logout</span>
                    <p className="text-xs text-destructive/70">Sign out of your account</p>
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
