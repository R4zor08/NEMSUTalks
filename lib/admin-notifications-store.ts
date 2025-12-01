import { create } from "zustand"

export interface AdminNotification {
  id: string
  title: string
  message: string
  type: "new_sentiment" | "status_update" | "system" | "announcement"
  isRead: boolean
  createdAt: string
  link?: string
}

interface AdminNotificationStore {
  notifications: AdminNotification[]
  addNotification: (notification: Omit<AdminNotification, "id" | "isRead" | "createdAt">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  clearAll: () => void
  getUnreadCount: () => number
}

const initialNotifications: AdminNotification[] = [
  {
    id: "notif-1",
    title: "New Sentiment Submitted",
    message: "A student submitted feedback about wifi connectivity issues in Building C.",
    type: "new_sentiment",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    link: "/admin",
  },
  {
    id: "notif-2",
    title: "New Sentiment Submitted",
    message: "A student submitted feedback about canteen price increases.",
    type: "new_sentiment",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    link: "/admin",
  },
  {
    id: "notif-3",
    title: "Status Updated",
    message: "Sentiment STU-007 has been marked as Resolved.",
    type: "status_update",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    link: "/admin",
  },
  {
    id: "notif-4",
    title: "System Alert",
    message: "Weekly sentiment report is ready for review.",
    type: "system",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
  },
  {
    id: "notif-5",
    title: "New Sentiment Submitted",
    message: "A student submitted positive feedback about Prof. Garcia's teaching methods.",
    type: "new_sentiment",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    link: "/admin",
  },
]

export const useAdminNotificationStore = create<AdminNotificationStore>((set, get) => ({
  notifications: initialNotifications,

  addNotification: (notification) => {
    const newNotification: AdminNotification = {
      ...notification,
      id: `notif-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    }
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    }))
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    }))
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    }))
  },

  deleteNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },

  clearAll: () => {
    set({ notifications: [] })
  },

  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.isRead).length
  },
}))
