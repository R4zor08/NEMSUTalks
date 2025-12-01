import { create } from "zustand"

export interface Announcement {
  id: string
  title: string
  description: string
  category: string
  date: string
  status: "Published" | "Draft"
  isNew: boolean
}

interface AnnouncementsState {
  announcements: Announcement[]
  addAnnouncement: (announcement: Omit<Announcement, "id" | "date" | "isNew">) => void
  deleteAnnouncement: (id: string) => void
  publishDraft: (id: string) => void
  markAsRead: (id: string) => void
  getPublishedAnnouncements: () => Announcement[]
  getUnreadCount: () => number
}

const initialAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Enrollment Period for 2nd Semester",
    description:
      "Online enrollment for the 2nd Semester AY 2024-2025 will begin on January 15, 2025. Please prepare your requirements.",
    category: "Academic",
    date: "2025-01-10",
    status: "Published",
    isNew: true,
  },
  {
    id: "2",
    title: "University Foundation Day",
    description:
      "Join us in celebrating the 43rd Foundation Anniversary of NEMSU on February 14, 2025. Various activities and programs are scheduled.",
    category: "Events",
    date: "2025-01-08",
    status: "Published",
    isNew: true,
  },
  {
    id: "3",
    title: "Library Hours Extended",
    description:
      "The university library will extend its operating hours during the examination period from 7:00 AM to 9:00 PM.",
    category: "Facilities",
    date: "2025-01-05",
    status: "Draft",
    isNew: false,
  },
  {
    id: "4",
    title: "Scholarship Applications Open",
    description:
      "Applications for the NEMSU Academic Excellence Scholarship are now open. Submit your application at the Student Affairs Office.",
    category: "Scholarship",
    date: "2025-01-03",
    status: "Published",
    isNew: false,
  },
]

export const useAnnouncementsStore = create<AnnouncementsState>((set, get) => ({
  announcements: initialAnnouncements,

  addAnnouncement: (announcement) => {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      isNew: announcement.status === "Published",
    }
    set((state) => ({
      announcements: [newAnnouncement, ...state.announcements],
    }))
  },

  deleteAnnouncement: (id) => {
    set((state) => ({
      announcements: state.announcements.filter((a) => a.id !== id),
    }))
  },

  publishDraft: (id) => {
    set((state) => ({
      announcements: state.announcements.map((a) =>
        a.id === id ? { ...a, status: "Published" as const, isNew: true } : a,
      ),
    }))
  },

  markAsRead: (id) => {
    set((state) => ({
      announcements: state.announcements.map((a) => (a.id === id ? { ...a, isNew: false } : a)),
    }))
  },

  getPublishedAnnouncements: () => {
    return get().announcements.filter((a) => a.status === "Published")
  },

  getUnreadCount: () => {
    return get().announcements.filter((a) => a.status === "Published" && a.isNew).length
  },
}))
