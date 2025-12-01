"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Bot, Send, X, Sparkles, Minimize2, Maximize2, MessageSquarePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
}

interface FloatingChatbotProps {
  onPostSentimentClick?: () => void
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hello! I'm NEMSU AI, your intelligent assistant for NEMSUTalks. I can help you:\n\n• Improve your message wording\n• Classify sentiment tones\n• Answer questions about NEMSU\n\nHow can I assist you today?",
  },
]

export function FloatingChatbot({ onPostSentimentClick }: FloatingChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        setHasNewMessage(true)
        setTimeout(() => setHasNewMessage(false), 1000)
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [isOpen])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const responses = [
      "I've analyzed your message. The sentiment appears to be neutral with constructive feedback. Would you like me to help rephrase it?",
      "That's a positive sentiment! Your message clearly expresses appreciation. You might want to add specific details.",
      "I notice this feedback addresses facilities concerns. I can help you structure this more clearly.",
      "Your message has been classified as constructive criticism. Would you like suggestions on how to make it more actionable?",
    ]

    const assistantMessage: Message = {
      id: Date.now() + 1,
      role: "assistant",
      content: responses[Math.floor(Math.random() * responses.length)],
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleNemsuAIClick = () => {
    setShowMenu(false)
    router.push("/dashboard/chatbot")
  }

  const handlePostSentimentClick = () => {
    setShowMenu(false)
    if (onPostSentimentClick) {
      onPostSentimentClick()
    }
  }

  const handleMouseEnter = () => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current)
    }
    setShowMenu(true)
  }

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setShowMenu(false)
    }, 300)
  }

  const handleBubbleClick = () => {
    if ("ontouchstart" in window) {
      setShowMenu(!showMenu)
    } else {
      router.push("/dashboard/chatbot")
    }
  }

  return (
    <>
      <div
        ref={containerRef}
        className="fixed z-50 bottom-6 sm:bottom-8 right-4 sm:right-6 lg:right-8 group transition-all duration-300 ease-out"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={cn(
            "absolute bottom-full right-0 mb-3 transition-all duration-300 ease-out",
            showMenu ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none",
          )}
        >
          <div className="bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden min-w-[200px] sm:min-w-[240px]">
            <button
              onClick={handleNemsuAIClick}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-4 sm:py-3.5",
                "hover:bg-primary/10 active:bg-primary/20 transition-colors duration-200",
                "border-b border-border/50",
                "touch-manipulation",
              )}
            >
              <div className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm shrink-0">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  NEMSU AI
                  <Sparkles className="h-3 w-3 text-amber-500" />
                </p>
                <p className="text-xs text-muted-foreground truncate">Chat with AI assistant</p>
              </div>
            </button>

            <button
              onClick={handlePostSentimentClick}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-4 sm:py-3.5",
                "hover:bg-primary/10 active:bg-primary/20 transition-colors duration-200",
                "touch-manipulation",
              )}
            >
              <div className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm shrink-0">
                <MessageSquarePlus className="h-5 w-5 text-white" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">Post Sentiments</p>
                <p className="text-xs text-muted-foreground truncate">Share your feedback</p>
              </div>
            </button>
          </div>

          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-card border-r border-b border-border/50 transform rotate-45" />
        </div>

        <button
          onClick={handleBubbleClick}
          className={cn(
            "relative w-14 h-14 sm:w-16 sm:h-16",
            "rounded-full",
            "bg-gradient-to-br from-primary via-primary to-accent",
            "shadow-lg hover:shadow-2xl hover:shadow-primary/30",
            "hover:scale-110 active:scale-95",
            "transition-all duration-300",
            "touch-manipulation",
            "focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/50",
            hasNewMessage && "animate-wiggle",
          )}
          aria-label="Open NEMSU AI options"
          aria-expanded={showMenu}
        >
          <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping-slow pointer-events-none" />

          <span className="relative flex items-center justify-center w-full h-full">
            <Bot className="h-6 w-6 sm:h-7 sm:w-7 text-primary-foreground transition-transform duration-300 group-hover:scale-110" />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 text-amber-300 animate-pulse" />
          </span>
        </button>
      </div>

      {isOpen && !isMinimized && (
        <div
          className={cn(
            "fixed z-50 transition-all duration-500 ease-out",
            "bottom-24 sm:bottom-28 right-4 sm:right-6 lg:right-8",
            "w-[calc(100vw-2rem)] sm:w-[380px] md:w-[400px] max-w-[420px]",
            "opacity-100 translate-y-0 scale-100 pointer-events-auto",
          )}
        >
          <div className="bg-card rounded-2xl shadow-2xl overflow-hidden border border-border">
            <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-primary to-accent">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary-foreground/20 backdrop-blur flex items-center justify-center">
                  <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-primary-foreground font-semibold text-sm sm:text-base flex items-center gap-1.5">
                    NEMSU AI
                    <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-pulse-soft" />
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-primary-foreground/80 text-xs">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/20 transition-all duration-200"
                  onClick={() => setIsMinimized(true)}
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/20 transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[300px] sm:h-[340px] p-3 sm:p-4 bg-card" ref={scrollRef}>
              <div className="space-y-3 sm:space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2 sm:gap-3 animate-fade-in-up",
                      message.role === "user" && "flex-row-reverse",
                    )}
                  >
                    <div
                      className={cn(
                        "w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm transition-all duration-200",
                        message.role === "assistant"
                          ? "bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20"
                          : "bg-secondary/80 ring-1 ring-border",
                      )}
                    >
                      {message.role === "assistant" ? (
                        <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                      ) : (
                        <span className="text-xs font-medium text-secondary-foreground">You</span>
                      )}
                    </div>
                    <div
                      className={cn(
                        "rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 max-w-[80%] text-xs sm:text-sm leading-relaxed whitespace-pre-wrap transition-all duration-200 shadow-sm",
                        message.role === "assistant"
                          ? "bg-secondary/60 text-secondary-foreground rounded-tl-md border border-border/30"
                          : "bg-primary text-primary-foreground rounded-tr-md",
                      )}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-2 sm:gap-3 animate-fade-in">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20 flex items-center justify-center">
                      <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                    </div>
                    <div className="bg-secondary/60 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-border/30">
                      <div className="flex gap-1.5">
                        <div
                          className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-3 sm:p-4 border-t border-border bg-card">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask NEMSU AI anything..."
                  disabled={isLoading}
                  className="flex-1 h-10 sm:h-11 rounded-xl text-sm bg-secondary border-border focus:border-primary transition-all duration-200"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl shrink-0 transition-all duration-200 hover:scale-105 active:scale-95"
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isOpen && isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          className={cn(
            "fixed z-50 bottom-24 sm:bottom-28 right-4 sm:right-6 lg:right-8",
            "bg-card border border-border rounded-2xl shadow-xl px-4 py-3",
            "flex items-center gap-3 hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95",
            "animate-fade-in-up",
          )}
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-medium text-card-foreground">NEMSU AI</span>
          <Maximize2 className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
    </>
  )
}
