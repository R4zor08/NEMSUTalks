"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { Bot, Send, User, Sparkles, ArrowLeft, Trash2, RefreshCw, MessageSquare, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import Link from "next/link"

const CHAT_HISTORY_KEY = "nemsu-ai-chat-history"

interface StoredMessage {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt?: string
}

export default function ChatbotPage() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [inputValue, setInputValue] = useState("")
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false)

  const welcomeMessage: StoredMessage = {
    id: "welcome",
    role: "assistant",
    content: `Hello! I'm NEMSU AI, your intelligent assistant. I can help you with virtually anything:

• Answer questions on any topic
• Help with writing, editing, and brainstorming
• Explain complex concepts simply
• Assist with academic work and research
• Provide information about NEMSU
• And much more!

What would you like to talk about?`,
    createdAt: new Date().toISOString(),
  }

  const { messages, sendMessage, status, setMessages } = useChat({
    api: "/api/chat",
    initialMessages: [welcomeMessage],
    onFinish: (message) => {
      // Save to history when AI responds
      saveToHistory([...messages, message])
    },
  })

  const isLoading = status === "streaming" || status === "submitted"

  useEffect(() => {
    const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY)
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory) as StoredMessage[]
        if (parsed.length > 0) {
          setMessages(parsed)
        }
      } catch (e) {
        console.error("Failed to parse chat history", e)
      }
    }
    setIsHistoryLoaded(true)
  }, [setMessages])

  const saveToHistory = (msgs: StoredMessage[]) => {
    try {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(msgs))
    } catch (e) {
      console.error("Failed to save chat history", e)
    }
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
    }
  }, [inputValue])

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return
    const newMessages = [
      ...messages,
      {
        id: Date.now().toString(),
        role: "user" as const,
        content: inputValue.trim(),
        createdAt: new Date().toISOString(),
      },
    ]
    saveToHistory(newMessages)
    sendMessage({ role: "user", content: inputValue.trim() })
    setInputValue("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleClearChat = () => {
    setMessages([welcomeMessage])
    localStorage.removeItem(CHAT_HISTORY_KEY)
  }

  // Format timestamp
  const formatTime = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (!isHistoryLoaded) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] bg-background">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-5 w-5 text-primary animate-spin" />
          <span className="text-muted-foreground">Loading chat history...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-background/95">
      {/* Header */}
      <div className="shrink-0 border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center justify-between p-3 sm:p-4 lg:p-5 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:bg-primary/10 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                  <Bot className="h-5 w-5 sm:h-5 sm:w-5 text-primary-foreground" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card animate-pulse" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-1.5">
                  NEMSU AI
                  <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500" />
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Intelligent Assistant</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 px-2.5 py-1.5 rounded-lg border border-border/50">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{messages.length} messages</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearChat}
              className="h-9 sm:h-10 rounded-xl gap-1.5 sm:gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all duration-200 bg-transparent text-xs sm:text-sm"
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-3 sm:px-4 lg:px-6 py-4 sm:py-6" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4 pb-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-2 sm:gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
                message.role === "user" && "flex-row-reverse",
              )}
              style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all duration-200",
                  message.role === "assistant"
                    ? "bg-gradient-to-br from-primary/15 to-primary/5 ring-1 ring-primary/20"
                    : "bg-gradient-to-br from-secondary to-secondary/80 ring-1 ring-border/50",
                )}
              >
                {message.role === "assistant" ? (
                  <Bot className="h-4 w-4 text-primary" />
                ) : (
                  <User className="h-4 w-4 text-secondary-foreground" />
                )}
              </div>
              <div className="flex flex-col gap-1 max-w-[85%] sm:max-w-[80%]">
                <div
                  className={cn(
                    "rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 whitespace-pre-wrap text-sm sm:text-[15px] leading-relaxed shadow-sm transition-all duration-200",
                    message.role === "assistant"
                      ? "bg-card text-card-foreground rounded-tl-md border border-border/40"
                      : "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-tr-md",
                  )}
                >
                  {message.content}
                </div>
                {message.createdAt && (
                  <div
                    className={cn(
                      "flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground/70 px-1",
                      message.role === "user" && "justify-end",
                    )}
                  >
                    <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    <span>{formatTime(message.createdAt as string)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex gap-2 sm:gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 ring-1 ring-primary/20 flex items-center justify-center shadow-sm">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-card rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-border/40">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground ml-1">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area - Replaced Input with Textarea for multi-line support */}
      <div className="shrink-0 border-t border-border/50 bg-card/80 backdrop-blur-md p-3 sm:p-4 lg:p-5">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2 sm:gap-3 items-end">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message NEMSU AI..."
                disabled={isLoading}
                rows={1}
                className={cn(
                  "min-h-[44px] sm:min-h-[48px] max-h-[150px] resize-none rounded-xl text-sm sm:text-[15px]",
                  "bg-background border-border/50 pr-4",
                  "focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
                  "placeholder:text-muted-foreground/60",
                  "transition-all duration-200",
                )}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className={cn(
                "h-11 w-11 sm:h-12 sm:w-12 rounded-xl shrink-0",
                "bg-gradient-to-br from-primary to-primary/90",
                "shadow-md hover:shadow-lg hover:shadow-primary/20",
                "transition-all duration-200 hover:scale-105 active:scale-95",
                "disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none",
              )}
              size="icon"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground/70 text-center mt-2 sm:mt-3">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
