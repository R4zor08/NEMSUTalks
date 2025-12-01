"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Menu,
  Bell,
  Shield,
  Settings,
  LogOut,
  ChevronRight,
  MessageSquare,
  RefreshCw,
  AlertCircle,
  Megaphone,
  Check,
  Trash2,
  X,
  Sparkles,
} from "lucide-react"
import { useAdminNotificationStore, type AdminNotification } from "@/lib/admin-notifications-store"
import { cn } from "@/lib/utils"

interface AdminHeaderProps {
  onMenuClick: () => void
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "Just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return date.toLocaleDateString()
}

function getNotificationIcon(type: AdminNotification["type"]) {
  switch (type) {
    case "new_sentiment":
      return <MessageSquare className="h-4 w-4" />
    case "status_update":
      return <RefreshCw className="h-4 w-4" />
    case "system":
      return <AlertCircle className="h-4 w-4" />
    case "announcement":
      return <Megaphone className="h-4 w-4" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

function getNotificationColor(type: AdminNotification["type"]) {
  switch (type) {
    case "new_sentiment":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400"
    case "status_update":
      return "bg-green-500/10 text-green-600 dark:text-green-400"
    case "system":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400"
    case "announcement":
      return "bg-primary/10 text-primary"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)

  const { notifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } =
    useAdminNotificationStore()

  const unreadCount = getUnreadCount()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleNotificationClick = (notification: AdminNotification) => {
    markAsRead(notification.id)
  }

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:bg-secondary transition-all duration-200 active:scale-95"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="lg:hidden flex items-center gap-2">
            <Image
              src="/images/nemsu-logo.png"
              alt="NEMSU Logo"
              width={32}
              height={32}
              className="rounded-full ring-2 ring-primary/10 w-7 h-7 sm:w-8 sm:h-8 object-cover bg-white"
              priority
            />
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="font-semibold text-foreground text-sm sm:text-base">Admin</span>
              <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative" ref={notificationRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className={cn(
                "relative h-9 w-9 sm:h-10 sm:w-10 rounded-xl transition-all duration-300 active:scale-95 group",
                unreadCount > 0 ? "hover:bg-primary/10" : "hover:bg-secondary",
                isNotificationOpen && "bg-secondary",
              )}
            >
              <Bell
                className={cn(
                  "h-4 w-4 sm:h-5 sm:w-5 transition-all duration-200",
                  unreadCount > 0 && "group-hover:animate-wiggle",
                )}
              />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 sm:top-0.5 sm:right-0.5 min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-[20px] bg-destructive rounded-full flex items-center justify-center text-[10px] sm:text-xs font-semibold text-destructive-foreground ring-2 ring-background animate-pulse-soft">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>

            {/* Notification dropdown with smooth animations */}
            <div
              className={cn(
                "absolute mt-2 bg-card rounded-2xl border border-border shadow-2xl overflow-hidden transition-all duration-300",
                "fixed left-1/2 -translate-x-1/2 w-[calc(100vw-32px)] max-w-[400px]",
                "sm:absolute sm:left-auto sm:translate-x-0 sm:right-0 sm:w-96",
                isNotificationOpen
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none",
              )}
              style={{ top: "100%" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="text-primary font-medium">{unreadCount}</span> unread
                        <Sparkles className="h-3 w-3 text-primary animate-pulse-soft" />
                      </span>
                    )}
                  </div>
                </div>
                {notifications.length > 0 && (
                  <div className="flex items-center gap-1">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="p-1.5 sm:p-2 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                        title="Mark all as read"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={clearAll}
                      className="p-1.5 sm:p-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                      title="Clear all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Notifications list */}
              <div className="max-h-[60vh] sm:max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 text-center">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-secondary flex items-center justify-center mb-3">
                      <Bell className="h-6 w-6 sm:h-7 sm:w-7 text-muted-foreground" />
                    </div>
                    <p className="text-sm sm:text-base font-medium text-foreground">No notifications</p>
                    <p className="text-xs sm:text-sm text-muted-foreground/70 mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {notifications.map((notification, index) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "relative p-3 sm:p-4 hover:bg-muted/50 transition-all duration-200 cursor-pointer group animate-fade-in-up",
                          !notification.isRead && "bg-primary/5",
                        )}
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex gap-3">
                          <div
                            className={cn(
                              "flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105",
                              getNotificationColor(notification.type),
                              !notification.isRead && "shadow-md",
                            )}
                          >
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p
                                className={cn(
                                  "text-sm font-medium line-clamp-1 transition-colors duration-200",
                                  !notification.isRead ? "text-foreground" : "text-muted-foreground",
                                )}
                              >
                                {notification.title}
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteNotification(notification.id)
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded-md transition-all duration-200 hover:scale-110"
                              >
                                <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                              </button>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-0.5">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5 sm:mt-2">
                              <span className="text-[10px] sm:text-xs text-muted-foreground/70">
                                {formatTimeAgo(notification.createdAt)}
                              </span>
                              {!notification.isRead && (
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-pulse" />
                              )}
                            </div>
                          </div>
                        </div>
                        {notification.link && (
                          <Link
                            href={notification.link}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute inset-0"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-2 sm:p-3 border-t border-border bg-muted/30">
                  <Link
                    href="/admin"
                    onClick={() => setIsNotificationOpen(false)}
                    className="block w-full py-2 sm:py-2.5 text-center text-xs sm:text-sm font-medium text-primary hover:bg-primary/10 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    View all activity
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-xl hover:bg-secondary transition-all duration-200 active:scale-[0.98]",
                isDropdownOpen && "bg-secondary",
              )}
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-semibold text-xs sm:text-sm shadow-sm transition-transform duration-200 hover:scale-105">
                AD
              </div>
              <ChevronRight
                className={cn(
                  "h-4 w-4 text-muted-foreground hidden sm:block transition-transform duration-300",
                  isDropdownOpen && "rotate-90",
                )}
              />
            </button>

            <div
              className={cn(
                "absolute right-0 mt-2 w-64 sm:w-72 bg-card rounded-2xl border border-border shadow-2xl overflow-hidden transition-all duration-300 origin-top-right",
                isDropdownOpen
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none",
              )}
            >
              <Link
                href="/admin/profile"
                onClick={() => setIsDropdownOpen(false)}
                className="block p-4 sm:p-5 border-b border-border bg-gradient-to-br from-primary/5 via-primary/10 to-transparent hover:from-primary/10 hover:via-primary/15 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-base sm:text-lg shadow-lg group-hover:scale-105 transition-transform duration-300">
                      AD
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-card flex items-center justify-center">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-card-foreground text-sm sm:text-base truncate">Admin User</p>
                      <Shield className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">admin@nemsu.edu.ph</p>
                    <p className="text-xs text-primary mt-1 flex items-center gap-1 group-hover:underline">
                      View Profile
                      <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </p>
                  </div>
                </div>
              </Link>

              {/* Menu items */}
              <div className="p-2 sm:p-2.5">
                <Link
                  href="/admin/settings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 sm:py-3 rounded-xl text-card-foreground hover:bg-secondary transition-all duration-200 active:scale-[0.98] group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-all duration-200">
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-sm sm:text-base">Settings</span>
                    <p className="text-xs text-muted-foreground">Preferences & configuration</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-200" />
                </Link>

                <div className="my-2 mx-3 border-t border-border" />

                <Link
                  href="/"
                  onClick={() => setIsDropdownOpen(false)}
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
