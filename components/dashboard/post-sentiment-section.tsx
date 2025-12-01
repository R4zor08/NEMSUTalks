"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Send, Sparkles, MessageSquarePlus, PenLine } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUserSentimentStore } from "@/lib/user-sentiment-store"
import { useSentimentStore } from "@/lib/sentiment-data"
import { toast } from "sonner"

const categories = [
  { value: "Physical Facilities & Equipment", label: "Facilities & Equipment", icon: "🏢" },
  { value: "Administration", label: "Administration", icon: "📋" },
  { value: "Instruction", label: "Instruction", icon: "📚" },
  { value: "Student Services", label: "Student Services", icon: "🎓" },
  { value: "Campus Safety", label: "Campus Safety", icon: "🛡️" },
  { value: "Other", label: "Other", icon: "💬" },
]

export function PostSentimentSection() {
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const addUserSentiment = useUserSentimentStore((state) => state.addSentiment)
  const addAdminSentiment = useSentimentStore((state) => state.addSentiment)

  const handleSubmit = async () => {
    if (!content.trim() || !category) return

    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 600))

    const newSentiment = addUserSentiment(content.trim(), category as any)

    addAdminSentiment({
      sentiment: content.trim(),
      category: category as any,
      sentimentType: newSentiment.sentiment,
    })

    setIsSubmitting(false)
    setContent("")
    setCategory("")
    setIsFocused(false)

    toast.success("Sentiment Posted!", {
      description: "Your feedback is now visible in the feed.",
    })
  }

  const characterCount = content.length
  const maxCharacters = 500
  const isExpanded = isFocused || content.length > 0

  return (
    <Card
      className={cn(
        "border-2 border-primary/20 rounded-2xl shadow-lg overflow-hidden transition-all duration-300",
        "bg-gradient-to-br from-card via-card to-primary/5",
        "hover:border-primary/30 hover:shadow-xl",
        isExpanded && "shadow-xl ring-2 ring-primary/20 border-primary/40",
      )}
    >
      <CardContent className="p-3 xs:p-4 sm:p-5 lg:p-6">
        {/* Header - More prominent */}
        <div className="flex items-start xs:items-center gap-2.5 xs:gap-3 sm:gap-4 mb-3 xs:mb-4 sm:mb-5">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-accent opacity-20 blur-sm" />
            <div className="relative w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center shadow-md border border-primary/20">
              <MessageSquarePlus className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm xs:text-base sm:text-lg font-bold text-foreground flex items-center gap-1.5 xs:gap-2 flex-wrap">
              <span className="truncate">Share Your Thoughts</span>
              <Sparkles className="h-3.5 w-3.5 xs:h-4 xs:w-4 text-amber-500 animate-pulse-soft shrink-0" />
            </h3>
            <p className="text-[11px] xs:text-xs sm:text-sm text-muted-foreground line-clamp-2">
              Your anonymous feedback helps improve NEMSU
            </p>
          </div>
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 shrink-0">
            <PenLine className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">Post Now</span>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-3 xs:space-y-4">
          {/* Textarea with enhanced styling */}
          <div className="relative">
            <Textarea
              placeholder="What's on your mind? Share your experience, suggestions, or feedback..."
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, maxCharacters))}
              onFocus={() => setIsFocused(true)}
              onBlur={() => !content && setIsFocused(false)}
              rows={isExpanded ? 4 : 2}
              className={cn(
                "resize-none rounded-xl border-2 border-border/50 transition-all duration-300",
                "focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
                "placeholder:text-muted-foreground/60",
                "hover:border-primary/30",
                "text-sm",
                isExpanded && "min-h-[100px] xs:min-h-[120px] border-primary/30",
              )}
            />
            {content.length > 10 && (
              <div className="absolute bottom-2 xs:bottom-3 left-2 xs:left-3 flex items-center gap-1 xs:gap-1.5 text-[10px] xs:text-xs text-muted-foreground/70 bg-background/80 backdrop-blur-sm px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-md">
                <Sparkles className="h-2.5 w-2.5 xs:h-3 xs:w-3 text-amber-500" />
                <span>AI analysis</span>
              </div>
            )}
          </div>

          {/* Bottom row - Category and Submit with improved layout */}
          <div
            className={cn(
              "flex flex-col gap-2.5 xs:gap-3 transition-all duration-300",
              isExpanded ? "opacity-100" : "opacity-80",
            )}
          >
            {/* Category Select - Full width on mobile */}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger
                className={cn(
                  "h-10 xs:h-11 sm:h-12 rounded-xl border-2 border-border/50 hover:border-primary/30 transition-colors",
                  "w-full",
                  category && "border-primary/30 bg-primary/5",
                )}
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value} className="cursor-pointer rounded-lg my-0.5">
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span className="text-sm">{cat.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Character count and submit - Row layout */}
            <div className="flex items-center gap-2 xs:gap-3">
              <span
                className={cn(
                  "text-[10px] xs:text-xs font-medium transition-colors whitespace-nowrap",
                  characterCount > maxCharacters * 0.9
                    ? "text-destructive"
                    : characterCount > maxCharacters * 0.7
                      ? "text-amber-500"
                      : "text-muted-foreground",
                )}
              >
                {characterCount}/{maxCharacters}
              </span>

              <Button
                onClick={handleSubmit}
                disabled={!content.trim() || !category || isSubmitting}
                className={cn(
                  "h-10 xs:h-11 sm:h-12 rounded-xl shadow-md transition-all duration-300 flex-1",
                  "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90",
                  "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                  "text-sm xs:text-base font-semibold px-3 xs:px-4",
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-1.5 xs:mr-2 h-3.5 w-3.5 xs:h-4 xs:w-4 animate-spin" />
                    <span className="hidden xs:inline">Posting...</span>
                    <span className="xs:hidden">...</span>
                  </>
                ) : (
                  <>
                    <Send className="mr-1.5 xs:mr-2 h-3.5 w-3.5 xs:h-4 xs:w-4" />
                    <span className="hidden xs:inline">Post Sentiment</span>
                    <span className="xs:hidden">Post</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
