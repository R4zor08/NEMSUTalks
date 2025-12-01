import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Comment {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: string
  createdAt: number
}

export interface UserSentiment {
  id: number
  avatar: string
  author: string
  content: string
  timestamp: string
  sentiment: "Positive" | "Negative" | "Neutral"
  category:
    | "Physical Facilities & Equipment"
    | "Administration"
    | "Instruction"
    | "Student Services"
    | "Campus Safety"
    | "Other"
  likes: number
  likedBy: string[]
  comments: Comment[]
  createdAt: number
}

interface UserSentimentStore {
  sentiments: UserSentiment[]
  currentUserId: string
  toggleLike: (sentimentId: number) => void
  addComment: (sentimentId: number, content: string) => void
  deleteComment: (sentimentId: number, commentId: string) => void
  isLikedByCurrentUser: (sentimentId: number) => boolean
  addSentiment: (content: string, category: UserSentiment["category"]) => UserSentiment
}

const initialSentiments: UserSentiment[] = [
  {
    id: 1,
    avatar: "AS",
    author: "Anonymous Student",
    content:
      "The new library facilities are amazing! Finally, we have a quiet place to study during exam weeks. Great job, NEMSU!",
    timestamp: "2 hours ago",
    sentiment: "Positive",
    category: "Physical Facilities & Equipment",
    likes: 24,
    likedBy: [],
    comments: [
      {
        id: "c1",
        author: "Maria Santos",
        avatar: "MS",
        content: "Totally agree! The new study pods are perfect.",
        timestamp: "1 hour ago",
        createdAt: Date.now() - 3600000,
      },
      {
        id: "c2",
        author: "John Cruz",
        avatar: "JC",
        content: "The aircon is also working well now!",
        timestamp: "45 mins ago",
        createdAt: Date.now() - 2700000,
      },
    ],
    createdAt: Date.now() - 7200000,
  },
  {
    id: 2,
    avatar: "MS",
    author: "Anonymous Student",
    content:
      "Wifi connection in Building C is still unreliable. It disconnects frequently during online classes which is really frustrating.",
    timestamp: "4 hours ago",
    sentiment: "Negative",
    category: "Physical Facilities & Equipment",
    likes: 18,
    likedBy: [],
    comments: [
      {
        id: "c3",
        author: "Tech Support",
        avatar: "TS",
        content: "We are aware of this issue and working on upgrading the routers.",
        timestamp: "3 hours ago",
        createdAt: Date.now() - 10800000,
      },
    ],
    createdAt: Date.now() - 14400000,
  },
  {
    id: 3,
    avatar: "JD",
    author: "Anonymous Student",
    content:
      "The canteen prices have increased but the portion sizes remain the same. Hope the admin can look into this matter.",
    timestamp: "6 hours ago",
    sentiment: "Neutral",
    category: "Administration",
    likes: 31,
    likedBy: [],
    comments: [],
    createdAt: Date.now() - 21600000,
  },
  {
    id: 4,
    avatar: "RG",
    author: "Anonymous Student",
    content:
      "Thank you to the Student Affairs Office for organizing the career fair! It was very informative and helpful for us graduating students.",
    timestamp: "8 hours ago",
    sentiment: "Positive",
    category: "Administration",
    likes: 45,
    likedBy: [],
    comments: [
      {
        id: "c4",
        author: "SAO Admin",
        avatar: "SA",
        content: "Thank you for your feedback! We will have more events soon.",
        timestamp: "7 hours ago",
        createdAt: Date.now() - 25200000,
      },
    ],
    createdAt: Date.now() - 28800000,
  },
  {
    id: 5,
    avatar: "KC",
    author: "Anonymous Student",
    content:
      "The drainage system near the Main Gate needs attention. It floods every time it rains heavily, making it difficult to pass through.",
    timestamp: "12 hours ago",
    sentiment: "Negative",
    category: "Physical Facilities & Equipment",
    likes: 52,
    likedBy: [],
    comments: [],
    createdAt: Date.now() - 43200000,
  },
  {
    id: 6,
    avatar: "LM",
    author: "Anonymous Student",
    content:
      "Requesting for more electric fans in Room 301. The room gets really hot during afternoon classes especially this summer.",
    timestamp: "1 day ago",
    sentiment: "Neutral",
    category: "Physical Facilities & Equipment",
    likes: 28,
    likedBy: [],
    comments: [],
    createdAt: Date.now() - 86400000,
  },
]

function analyzeSentiment(content: string): "Positive" | "Negative" | "Neutral" {
  const positiveWords = [
    "thank",
    "great",
    "amazing",
    "excellent",
    "good",
    "love",
    "appreciate",
    "helpful",
    "fantastic",
    "wonderful",
    "improved",
    "best",
  ]
  const negativeWords = [
    "bad",
    "terrible",
    "poor",
    "frustrating",
    "unreliable",
    "broken",
    "needs attention",
    "problem",
    "issue",
    "difficult",
    "worse",
    "complaint",
  ]

  const lowerContent = content.toLowerCase()
  const positiveScore = positiveWords.filter((word) => lowerContent.includes(word)).length
  const negativeScore = negativeWords.filter((word) => lowerContent.includes(word)).length

  if (positiveScore > negativeScore) return "Positive"
  if (negativeScore > positiveScore) return "Negative"
  return "Neutral"
}

export const useUserSentimentStore = create<UserSentimentStore>()(
  persist(
    (set, get) => ({
      sentiments: initialSentiments,
      currentUserId: "current-user",

      toggleLike: (sentimentId) => {
        const { currentUserId } = get()
        set((state) => ({
          sentiments: state.sentiments.map((sentiment) => {
            if (sentiment.id === sentimentId) {
              const isLiked = sentiment.likedBy.includes(currentUserId)
              return {
                ...sentiment,
                likes: isLiked ? sentiment.likes - 1 : sentiment.likes + 1,
                likedBy: isLiked
                  ? sentiment.likedBy.filter((id) => id !== currentUserId)
                  : [...sentiment.likedBy, currentUserId],
              }
            }
            return sentiment
          }),
        }))
      },

      addComment: (sentimentId, content) => {
        const newComment: Comment = {
          id: `c${Date.now()}`,
          author: "You",
          avatar: "YU",
          content,
          timestamp: "Just now",
          createdAt: Date.now(),
        }
        set((state) => ({
          sentiments: state.sentiments.map((sentiment) => {
            if (sentiment.id === sentimentId) {
              return {
                ...sentiment,
                comments: [...sentiment.comments, newComment],
              }
            }
            return sentiment
          }),
        }))
      },

      deleteComment: (sentimentId, commentId) => {
        set((state) => ({
          sentiments: state.sentiments.map((sentiment) => {
            if (sentiment.id === sentimentId) {
              return {
                ...sentiment,
                comments: sentiment.comments.filter((c) => c.id !== commentId),
              }
            }
            return sentiment
          }),
        }))
      },

      isLikedByCurrentUser: (sentimentId) => {
        const { sentiments, currentUserId } = get()
        const sentiment = sentiments.find((s) => s.id === sentimentId)
        return sentiment?.likedBy.includes(currentUserId) ?? false
      },

      addSentiment: (content, category) => {
        const newSentiment: UserSentiment = {
          id: Date.now(),
          avatar: "YU",
          author: "Anonymous Student",
          content,
          timestamp: "Just now",
          sentiment: analyzeSentiment(content),
          category,
          likes: 0,
          likedBy: [],
          comments: [],
          createdAt: Date.now(),
        }

        set((state) => ({
          sentiments: [newSentiment, ...state.sentiments],
        }))

        return newSentiment
      },
    }),
    {
      name: "user-sentiment-storage",
    },
  ),
)
