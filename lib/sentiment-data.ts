import { create } from "zustand"
import { useAdminNotificationStore } from "./admin-notifications-store"

export interface Sentiment {
  id: string
  studId: string
  sentiment: string
  category:
    | "Physical Facilities & Equipment"
    | "Administration"
    | "Instruction"
    | "Student Services"
    | "Campus Safety"
    | "Other"
  status: "On Process" | "Resolved"
  date: string
  sentimentType?: "Positive" | "Negative" | "Neutral"
}

interface SentimentStore {
  sentiments: Sentiment[]
  updateStatus: (id: string, status: "On Process" | "Resolved") => void
  getSentimentById: (id: string) => Sentiment | undefined
  getTrendData: () => { month: string; sentiments: number }[]
  getStats: () => {
    total: number
    onProcess: number
    resolved: number
    thisMonth: number
  }
  addSentiment: (sentiment: Omit<Sentiment, "id" | "studId" | "status" | "date">) => void
}

const initialSentiments: Sentiment[] = [
  {
    id: "STU-001",
    studId: "2024-0001",
    sentiment: "The wifi connection in Building C is unreliable and disconnects frequently during online classes.",
    category: "Physical Facilities & Equipment",
    status: "On Process",
    date: "2025-01-15",
    sentimentType: "Negative",
  },
  {
    id: "STU-002",
    studId: "2024-0045",
    sentiment: "Thank you to the Student Affairs Office for organizing the career fair! It was very informative.",
    category: "Administration",
    status: "Resolved",
    date: "2025-01-14",
    sentimentType: "Positive",
  },
  {
    id: "STU-003",
    studId: "2024-0123",
    sentiment: "Requesting for more electric fans in Room 301. The room gets really hot during afternoon classes.",
    category: "Physical Facilities & Equipment",
    status: "On Process",
    date: "2025-01-14",
    sentimentType: "Neutral",
  },
  {
    id: "STU-004",
    studId: "2024-0089",
    sentiment: "The canteen prices have increased but the portion sizes remain the same.",
    category: "Administration",
    status: "On Process",
    date: "2025-01-13",
    sentimentType: "Neutral",
  },
  {
    id: "STU-005",
    studId: "2024-0234",
    sentiment: "Prof. Garcia's teaching methods are very effective. I finally understood calculus!",
    category: "Instruction",
    status: "Resolved",
    date: "2025-01-12",
    sentimentType: "Positive",
  },
  {
    id: "STU-006",
    studId: "2024-0156",
    sentiment: "The drainage system near the Main Gate needs attention. It floods every time it rains.",
    category: "Physical Facilities & Equipment",
    status: "On Process",
    date: "2025-01-11",
    sentimentType: "Negative",
  },
  {
    id: "STU-007",
    studId: "2024-0078",
    sentiment: "The library should extend its operating hours during finals week.",
    category: "Administration",
    status: "Resolved",
    date: "2025-01-10",
    sentimentType: "Neutral",
  },
  {
    id: "STU-008",
    studId: "2024-0199",
    sentiment: "Great improvement in the science lab equipment this semester!",
    category: "Physical Facilities & Equipment",
    status: "Resolved",
    date: "2025-01-09",
    sentimentType: "Positive",
  },
]

export const useSentimentStore = create<SentimentStore>((set, get) => ({
  sentiments: initialSentiments,

  updateStatus: (id, status) => {
    const sentiment = get().sentiments.find((s) => s.id === id)
    if (sentiment) {
      useAdminNotificationStore.getState().addNotification({
        title: "Status Updated",
        message: `Sentiment ${id} has been marked as ${status}.`,
        type: "status_update",
        link: "/admin",
      })
    }
    set((state) => ({
      sentiments: state.sentiments.map((s) => (s.id === id ? { ...s, status } : s)),
    }))
  },

  getSentimentById: (id) => {
    return get().sentiments.find((s) => s.id === id)
  },

  getTrendData: () => {
    const sentiments = get().sentiments
    const monthlyData = [
      { month: "Jan", sentiments: Math.floor(sentiments.length * 0.4) + 10 },
      { month: "Feb", sentiments: Math.floor(sentiments.length * 0.45) + 15 },
      { month: "Mar", sentiments: Math.floor(sentiments.length * 0.5) + 20 },
      { month: "Apr", sentiments: Math.floor(sentiments.length * 0.55) + 25 },
      { month: "May", sentiments: Math.floor(sentiments.length * 0.6) + 30 },
      { month: "Jun", sentiments: Math.floor(sentiments.length * 0.65) + 35 },
      { month: "Jul", sentiments: Math.floor(sentiments.length * 0.7) + 40 },
      { month: "Aug", sentiments: Math.floor(sentiments.length * 0.75) + 45 },
      { month: "Sep", sentiments: Math.floor(sentiments.length * 0.8) + 50 },
      { month: "Oct", sentiments: Math.floor(sentiments.length * 0.85) + 55 },
      { month: "Nov", sentiments: Math.floor(sentiments.length * 0.9) + 60 },
      { month: "Dec", sentiments: sentiments.length + 65 },
    ]
    return monthlyData
  },

  getStats: () => {
    const sentiments = get().sentiments
    const now = new Date()
    const thisMonth = sentiments.filter((s) => {
      const date = new Date(s.date)
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }).length

    return {
      total: sentiments.length + 1226,
      onProcess: sentiments.filter((s) => s.status === "On Process").length + 85,
      resolved: sentiments.filter((s) => s.status === "Resolved").length + 1141,
      thisMonth: thisMonth + 148,
    }
  },

  addSentiment: (sentimentData) => {
    const sentiments = get().sentiments
    const newId = `STU-${String(sentiments.length + 1).padStart(3, "0")}`
    const newStudId = `2024-${String(Math.floor(Math.random() * 9000) + 1000)}`

    const newSentiment: Sentiment = {
      id: newId,
      studId: newStudId,
      sentiment: sentimentData.sentiment,
      category: sentimentData.category as Sentiment["category"],
      status: "On Process",
      date: new Date().toISOString().split("T")[0],
      sentimentType: sentimentData.sentimentType,
    }

    // Add admin notification
    useAdminNotificationStore.getState().addNotification({
      title: "New Sentiment Submitted",
      message: `A new ${sentimentData.sentimentType?.toLowerCase() || "neutral"} sentiment about ${sentimentData.category} has been submitted.`,
      type: "new_sentiment",
      link: "/admin",
    })

    set((state) => ({
      sentiments: [newSentiment, ...state.sentiments],
    }))
  },
}))
