"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, BarChart3, Megaphone, X, Shield, ChevronLeft } from "lucide-react"

interface AdminSidebarProps {
  open: boolean
  onClose: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/insights", label: "Insights", icon: BarChart3 },
  { href: "/admin/announce", label: "Announcements", icon: Megaphone },
]

export function AdminSidebar({ open, onClose, collapsed, onToggleCollapse }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-card border-r border-border dark:border-border transform transition-all duration-300 ease-out",
          collapsed ? "lg:w-20" : "lg:w-72",
          "w-64 sm:w-72",
          open ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center p-4 sm:p-5 border-b border-border dark:border-border bg-gradient-to-r from-card to-secondary/20 dark:from-card dark:to-secondary/30">
            <Link
              href="/admin"
              className={cn("flex items-center gap-3 group flex-1 min-w-0", collapsed && "lg:justify-center")}
            >
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-white rounded-full dark:block hidden" />
                <Image
                  src="/images/nemsu-logo.jpg"
                  alt="NEMSU Logo"
                  width={48}
                  height={48}
                  className="relative rounded-full ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300 w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 shadow-md bg-white object-cover"
                  priority
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-card" />
              </div>
              <div className={cn("transition-all duration-300 min-w-0", collapsed && "lg:hidden")}>
                <span className="text-lg sm:text-xl font-bold text-card-foreground tracking-tight">NEMSUTalks</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Shield className="h-3 w-3 text-primary shrink-0" />
                  <p className="text-xs text-muted-foreground font-medium">Admin Panel</p>
                </div>
              </div>
            </Link>

            <button
              onClick={onToggleCollapse}
              className={cn(
                "hidden lg:flex items-center justify-center w-8 h-8 rounded-lg",
                "bg-secondary/80 hover:bg-primary/10 dark:bg-secondary dark:hover:bg-primary/20",
                "border border-border/60 hover:border-primary/40 dark:border-border dark:hover:border-primary/50",
                "transition-all duration-300 ease-out active:scale-90",
                "text-muted-foreground hover:text-primary dark:text-muted-foreground dark:hover:text-primary",
                "shadow-sm hover:shadow-md",
                collapsed && "lg:absolute lg:right-1/2 lg:translate-x-1/2",
              )}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft
                className={cn("h-4 w-4 transition-transform duration-300 ease-out", collapsed && "rotate-180")}
              />
            </button>

            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-secondary rounded-xl transition-all duration-200 active:scale-95 ml-2"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <nav className="flex-1 p-3 sm:p-4 space-y-1.5 overflow-y-auto">
            <p
              className={cn(
                "px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider transition-all duration-300",
                collapsed && "lg:hidden",
              )}
            >
              Navigation
            </p>
            {navItems.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-xl transition-all duration-200 group",
                    collapsed ? "lg:justify-center lg:px-2 lg:py-3" : "px-3 py-3",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-card-foreground hover:bg-secondary/80 dark:hover:bg-secondary active:scale-[0.98]",
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  title={collapsed ? item.label : undefined}
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200",
                      isActive
                        ? "bg-primary-foreground/20"
                        : "bg-secondary dark:bg-secondary/80 group-hover:bg-primary/10 dark:group-hover:bg-primary/20",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-all duration-200",
                        isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary",
                      )}
                    />
                  </div>
                  <span className={cn("font-medium text-sm transition-all duration-300", collapsed && "lg:hidden")}>
                    {item.label}
                  </span>
                  {isActive && !collapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse lg:block hidden" />
                  )}
                </Link>
              )
            })}
          </nav>

          <div
            className={cn(
              "p-4 border-t border-border dark:border-border bg-secondary/20 dark:bg-secondary/30",
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
                  className="relative rounded-full opacity-70 bg-white object-cover"
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
