"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatbotModalProps {
  open: boolean
  onClose: () => void
}

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hello! I'm NEMSU AI, your intelligent assistant for NEMSUTalks. I can help you:\n\n• Improve your message wording\n• Classify sentiment tones (Positive/Neutral/Negative)\n• Filter and refine your sentiments\n\nHow can I assist you today?",
  },
]

export function ChatbotModal({ open, onClose }: ChatbotModalProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

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
      "I've analyzed your message. The sentiment appears to be neutral with constructive feedback. Would you like me to help rephrase it to be more formal?",
      "That's a positive sentiment! Your message clearly expresses appreciation. You might want to add specific details about what you appreciated most.",
      "I notice this feedback addresses facilities concerns. I can help you structure this more clearly if you'd like to submit it as a formal sentiment.",
      "Your message has been classified as constructive criticism. Would you like suggestions on how to make it more actionable for the administration?",
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-lg rounded-2xl border-border/50 shadow-xl max-h-[90vh] overflow-hidden flex flex-col p-0 mx-4">
        <DialogHeader className="p-4 border-b border-border/50 shrink-0 bg-card">
          <DialogTitle className="text-foreground flex items-center gap-2.5 text-lg">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-sm">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            NEMSU AI
          </DialogTitle>
          <DialogDescription className="text-sm mt-1.5">
            Get help with message improvement, sentiment classification, and feedback refinement.
          </DialogDescription>
        </DialogHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={cn("flex gap-3 animate-fade-in-up", message.role === "user" && "flex-row-reverse")}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all duration-200",
                    message.role === "assistant"
                      ? "bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20"
                      : "bg-secondary/80 ring-1 ring-border",
                  )}
                >
                  {message.role === "assistant" ? (
                    <Bot className="h-4 w-4 text-primary" />
                  ) : (
                    <User className="h-4 w-4 text-secondary-foreground" />
                  )}
                </div>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5 max-w-[80%] whitespace-pre-wrap text-sm leading-relaxed shadow-sm transition-all duration-200",
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
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
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

        <div className="p-4 border-t border-border/50 shrink-0 bg-card">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask NEMSU AI anything..."
              disabled={isLoading}
              className={cn(
                "flex-1 h-11 rounded-xl transition-all focus:ring-2 focus:ring-primary/20",
                "border-border/50 placeholder:text-muted-foreground/60",
                "hover:border-primary/30",
              )}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={cn(
                "h-11 w-11 rounded-xl shrink-0 shadow-sm hover:shadow-md transition-all duration-200",
                "hover:scale-[1.02] active:scale-[0.98]",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
              )}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
