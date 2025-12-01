"use client"

import type React from "react"
import { useState } from "react"
import { DashboardSidebar } from "./dashboard-sidebar"
import { DashboardHeader } from "./dashboard-header"
import { PostSentimentModal } from "./post-sentiment-modal"
import { FloatingChatbot } from "./floating-chatbot"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [postModalOpen, setPostModalOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleOpenPostModal = () => {
    setPostModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      </div>

      {/* Sidebar overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar - now with collapsed props */}
      <DashboardSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content - Dynamic padding based on collapsed state */}
      <div className={cn("transition-all duration-300 relative", sidebarCollapsed ? "lg:pl-20" : "lg:pl-72")}>
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8 animate-fade-in pb-24 sm:pb-28">{children}</main>
      </div>

      <PostSentimentModal open={postModalOpen} onClose={() => setPostModalOpen(false)} />
      <FloatingChatbot onPostSentimentClick={handleOpenPostModal} />
    </div>
  )
}
