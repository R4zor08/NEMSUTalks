"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Newspaper, X, Sparkles, ChevronLeft } from "lucide-react"

interface DashboardSidebarProps {
  open: boolean
  onClose: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/news", label: "News/Updates", subtitle: "Announcements from the School", icon: Newspaper },
]

export function DashboardSidebar({ open, onClose, collapsed, onToggleCollapse }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-card/95 backdrop-blur-xl border-r border-border/50 dark:border-border transform transition-all duration-300 ease-in-out",
          collapsed ? "lg:w-20" : "lg:w-72",
          "w-[260px] sm:w-[280px]",
          open ? "translate-x-0 shadow-2xl shadow-primary/10" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border/50 dark:border-border bg-gradient-to-r from-card to-secondary/20 dark:from-card dark:to-secondary/30">
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-2 sm:gap-2.5 lg:gap-3 group flex-1 min-w-0",
                collapsed && "lg:justify-center",
              )}
            >
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg scale-125 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-white rounded-full dark:block hidden" />
                <Image
                  src="/images/nemsu-logo.jpg"
                  alt="NEMSU Logo"
                  width={44}
                  height={44}
                  className="relative rounded-full ring-2 ring-primary/30 group-hover:ring-primary/50 transition-all duration-300 w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11 shadow-md bg-white object-cover"
                  priority
                />
              </div>
              <div className={cn("transition-all duration-300 min-w-0", collapsed && "lg:hidden")}>
                <span className="text-sm sm:text-base lg:text-lg font-bold text-card-foreground flex items-center gap-1 sm:gap-1.5">
                  NEMSUTalks
                  <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 text-primary animate-pulse-soft" />
                </span>
                <span className="text-[9px] sm:text-[10px] text-muted-foreground font-medium tracking-wider uppercase">
                  Dashboard
                </span>
              </div>
            </Link>

            <button
              onClick={onToggleCollapse}
              className={cn(
                "hidden lg:flex items-center justify-center w-8 h-8 rounded-lg",
                "bg-secondary/60 hover:bg-primary/10 dark:bg-secondary/80 dark:hover:bg-primary/20",
                "border border-border/50 hover:border-primary/30 dark:border-border dark:hover:border-primary/40",
                "transition-all duration-300 ease-in-out active:scale-95",
                "text-muted-foreground hover:text-primary",
                "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1",
              )}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft
                className={cn("h-4 w-4 transition-transform duration-300 ease-in-out", collapsed && "rotate-180")}
              />
            </button>

            <button
              onClick={onClose}
              className="lg:hidden p-2 sm:p-2.5 hover:bg-secondary/60 rounded-xl transition-all duration-300 active:scale-95 ml-2"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 sm:p-3 space-y-1 sm:space-y-1.5 overflow-y-auto">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-start gap-2 sm:gap-3 rounded-xl transition-all duration-300 group",
                    collapsed ? "lg:justify-center lg:px-2 lg:py-3" : "px-3 sm:px-4 py-2.5 sm:py-3 lg:py-3.5",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-card-foreground hover:bg-secondary/60 active:scale-[0.98]",
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  title={collapsed ? item.label : undefined}
                >
                  <div
                    className={cn(
                      "w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300",
                      isActive ? "bg-primary-foreground/20" : "bg-secondary/60 group-hover:bg-secondary",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 transition-all duration-300",
                        isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground",
                      )}
                    />
                  </div>
                  <div className={cn("min-w-0 pt-0.5 transition-all duration-300", collapsed && "lg:hidden")}>
                    <span className="font-medium text-xs sm:text-sm block">{item.label}</span>
                    {item.subtitle && (
                      <p
                        className={cn(
                          "text-[10px] sm:text-xs mt-0.5 truncate transition-colors duration-300",
                          isActive ? "text-primary-foreground/80" : "text-muted-foreground",
                        )}
                      >
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Footer with branding */}
          <div
            className={cn(
              "p-3 sm:p-4 border-t border-border/50 dark:border-border bg-secondary/20 dark:bg-secondary/30",
              collapsed && "lg:p-2",
            )}
          >
            <div className={cn("flex items-center gap-3 px-2", collapsed && "lg:justify-center lg:px-0")}>
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-full dark:block hidden" />
                <Image
                  src="/images/nemsu-logo.jpg"
                  alt="NEMSU"
                  width={32}
                  height={32}
                  className="relative rounded-full opacity-70 w-7 h-7 sm:w-8 sm:h-8 bg-white object-cover"
                />
              </div>
              <div className={cn("flex-1 min-w-0 transition-all duration-300", collapsed && "lg:hidden")}>
                <p className="text-xs font-medium text-muted-foreground truncate">North Eastern Mindanao</p>
                <p className="text-xs text-muted-foreground/60 truncate">State University</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
