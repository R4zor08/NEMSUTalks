"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Bell, MessageSquare, Megaphone, Heart, CheckCheck, Trash2, Sparkles, AlertTriangle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAnnouncementsStore } from "@/lib/announcements-store"
import Link from "next/link"

interface Notification {
  id: string
  type: "announcement" | "sentiment" | "like" | "system"
  title: string
  message: string
  time: string
  read: boolean
  announcementId?: string
  isDeleting?: boolean
}

const baseNotifications: Notification[] = [
  {
    id: "2",
    type: "like",
    title: "Your post received a like",
    message: "Someone liked your sentiment about campus facilities.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "sentiment",
    title: "New Sentiment Posted",
    message: "A new sentiment about academic concerns has been posted in your feed.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "4",
    type: "system",
    title: "Welcome to NEMSUTalks",
    message: "Thank you for joining NEMSUTalks! Start by sharing your first sentiment.",
    time: "1 day ago",
    read: true,
  },
]

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "announcement":
      return Megaphone
    case "sentiment":
      return MessageSquare
    case "like":
      return Heart
    case "system":
      return Bell
    default:
      return Bell
  }
}

const getNotificationColor = (type: Notification["type"]) => {
  switch (type) {
    case "announcement":
      return "bg-primary/10 text-primary"
    case "sentiment":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400"
    case "like":
      return "bg-pink-500/10 text-pink-600 dark:text-pink-400"
    case "system":
      return "bg-muted text-muted-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInHours < 1) return "Just now"
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
  if (diffInDays === 1) return "Yesterday"
  if (diffInDays < 7) return `${diffInDays} days ago`
  return date.toLocaleDateString()
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(baseNotifications)
  const { announcements, markAsRead: markAnnouncementAsRead } = useAnnouncementsStore()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const announcementNotifications: Notification[] = announcements
    .filter((a) => a.status === "Published")
    .map((a) => ({
      id: `announcement-${a.id}`,
      type: "announcement" as const,
      title: "New Announcement",
      message: a.title,
      time: getRelativeTime(a.date),
      read: !a.isNew,
      announcementId: a.id,
    }))

  const allNotifications = [...announcementNotifications, ...notifications]
  const unreadCount = allNotifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    if (id.startsWith("announcement-")) {
      const announcementId = id.replace("announcement-", "")
      markAnnouncementAsRead(announcementId)
    } else {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    }
  }

  const markAllAsRead = () => {
    announcements.forEach((a) => {
      if (a.isNew) markAnnouncementAsRead(a.id)
    })
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    if (!id.startsWith("announcement-")) {
      // First mark as deleting for animation
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isDeleting: true } : n)))
      // Then remove after animation
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
      }, 300)
    }
  }

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setPendingDeleteId(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (pendingDeleteId) {
      deleteNotification(pendingDeleteId)
      setPendingDeleteId(null)
    }
    setDeleteDialogOpen(false)
  }

  const clearAll = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isDeleting: true })))
    setTimeout(() => {
      setNotifications([])
    }, 300)
    setDeleteAllDialogOpen(false)
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-1 sm:px-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-start gap-3 animate-fade-in-up">
            <div className="p-2.5 sm:p-3 rounded-xl bg-primary/10 shrink-0">
              <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Notifications</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {unreadCount > 0 ? (
                  <span className="flex items-center gap-1.5">
                    You have <span className="text-primary font-medium">{unreadCount} unread</span> notifications
                    <Sparkles className="h-3 w-3 text-primary animate-pulse-soft" />
                  </span>
                ) : (
                  "You're all caught up!"
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-2 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="text-xs sm:text-sm h-9 sm:h-10 bg-transparent hover:bg-secondary/60 transition-all duration-300 hover:scale-105 active:scale-95 rounded-xl disabled:opacity-50"
            >
              <CheckCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              <span className="hidden xs:inline">Mark all</span> read
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteAllDialogOpen(true)}
              disabled={notifications.length === 0}
              className="text-xs sm:text-sm h-9 sm:h-10 bg-transparent hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all duration-300 hover:scale-105 active:scale-95 rounded-xl disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              <span className="hidden xs:inline">Delete</span> all
            </Button>
          </div>
        </div>

        {allNotifications.length === 0 ? (
          <Card className="animate-fade-in-up rounded-2xl border-border/50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Bell className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">No notifications</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                When you receive notifications, they will appear here. Stay tuned for updates!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {allNotifications.map((notification, index) => {
              const Icon = getNotificationIcon(notification.type)
              const isAnnouncement = notification.id.startsWith("announcement-")
              return (
                <Card
                  key={notification.id}
                  className={cn(
                    "transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] rounded-2xl border-border/50 animate-fade-in-up group overflow-hidden",
                    !notification.read &&
                      "border-primary/50 bg-primary/5 shadow-md shadow-primary/10 ring-1 ring-primary/20",
                    notification.isDeleting && "opacity-0 scale-95 -translate-x-4",
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <CardContent className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5">
                    <div className="relative">
                      <div
                        className={cn(
                          "p-2.5 sm:p-3 rounded-xl shrink-0 transition-all duration-300 group-hover:scale-110",
                          getNotificationColor(notification.type),
                          !notification.read && "shadow-md",
                        )}
                      >
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      {!notification.read && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-card animate-pulse" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-foreground flex items-center gap-2 flex-wrap text-sm sm:text-base">
                            <span className="truncate">{notification.title}</span>
                            {!notification.read && (
                              <Badge
                                variant="default"
                                className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0 sm:py-0.5 animate-pulse-soft shrink-0"
                              >
                                New
                              </Badge>
                            )}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-3 mt-2.5">
                            <p className="text-[10px] sm:text-xs text-muted-foreground/70 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {notification.time}
                            </p>
                            {isAnnouncement && (
                              <Link
                                href="/dashboard/news"
                                onClick={(e) => e.stopPropagation()}
                                className="text-[10px] sm:text-xs text-primary hover:underline font-medium"
                              >
                                View details
                              </Link>
                            )}
                          </div>
                        </div>
                        {!isAnnouncement && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0 h-9 w-9 sm:h-10 sm:w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl opacity-0 group-hover:opacity-100 sm:opacity-100 transition-all duration-300"
                            onClick={(e) => handleDeleteClick(e, notification.id)}
                          >
                            <Trash2 className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl sm:rounded-2xl max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Trash2 className="h-5 w-5 sm:h-6 sm:w-6 text-destructive" />
              </div>
              <AlertDialogTitle className="text-lg sm:text-xl">Delete Notification</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-sm sm:text-base">
              Are you sure you want to delete this notification? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3">
            <AlertDialogCancel className="rounded-xl h-10 sm:h-11 text-sm sm:text-base">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="rounded-xl h-10 sm:h-11 bg-destructive text-destructive-foreground hover:bg-destructive/90 text-sm sm:text-base"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
        <AlertDialogContent className="rounded-2xl sm:rounded-2xl max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-destructive" />
              </div>
              <AlertDialogTitle className="text-lg sm:text-xl">Delete All Notifications</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-sm sm:text-base">
              Are you sure you want to delete all {notifications.length} notification
              {notifications.length !== 1 ? "s" : ""}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3">
            <AlertDialogCancel className="rounded-xl h-10 sm:h-11 text-sm sm:text-base">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={clearAll}
              className="rounded-xl h-10 sm:h-11 bg-destructive text-destructive-foreground hover:bg-destructive/90 text-sm sm:text-base"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
