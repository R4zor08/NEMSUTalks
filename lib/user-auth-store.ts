import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: string
  fullName: string
  email: string
  studentId: string
  password: string
  createdAt: string
  avatar?: string
}

interface UserAuthStore {
  users: User[]
  currentUser: User | null
  registerUser: (user: Omit<User, "id" | "createdAt">) => { success: boolean; message: string }
  loginUser: (identifier: string, password: string) => { success: boolean; message: string; isAdmin?: boolean }
  logoutUser: () => void
  getCurrentUser: () => User | null
  updateUser: (id: string, updates: Partial<User>) => void
}

export const useUserAuthStore = create<UserAuthStore>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,

      registerUser: (userData) => {
        const { users } = get()

        // Check if email already exists
        const emailExists = users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase())
        if (emailExists) {
          return { success: false, message: "An account with this email already exists" }
        }

        // Check if student ID already exists
        const studentIdExists = users.some((u) => u.studentId.toLowerCase() === userData.studentId.toLowerCase())
        if (studentIdExists) {
          return { success: false, message: "An account with this Student ID already exists" }
        }

        const newUser: User = {
          ...userData,
          id: `user-${Date.now()}`,
          createdAt: new Date().toISOString(),
        }

        set({ users: [...users, newUser] })
        return { success: true, message: "Account created successfully! Please sign in." }
      },

      loginUser: (identifier, password) => {
        const { users } = get()

        // Check admin credentials first
        if (identifier.toLowerCase() === "admin@nemsu.edu.ph" && password === "admin123") {
          return { success: true, message: "Admin login successful", isAdmin: true }
        }

        // Find user by email or student ID
        const user = users.find(
          (u) =>
            (u.email.toLowerCase() === identifier.toLowerCase() ||
              u.studentId.toLowerCase() === identifier.toLowerCase()) &&
            u.password === password,
        )

        if (user) {
          set({ currentUser: user })
          return { success: true, message: "Login successful" }
        }

        return { success: false, message: "Invalid email/student ID or password" }
      },

      logoutUser: () => {
        set({ currentUser: null })
      },

      getCurrentUser: () => {
        return get().currentUser
      },

      updateUser: (id, updates) => {
        const { users, currentUser } = get()
        const updatedUsers = users.map((u) => (u.id === id ? { ...u, ...updates } : u))
        set({
          users: updatedUsers,
          currentUser: currentUser?.id === id ? { ...currentUser, ...updates } : currentUser,
        })
      },
    }),
    {
      name: "nemsu-user-auth",
    },
  ),
)
