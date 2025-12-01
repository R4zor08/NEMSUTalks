"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Heart, MessageCircle, Send, X, Clock, MessageSquareOff } from "lucide-react"
import { useUserSentimentStore } from "@/lib/user-sentiment-store"

const sentimentColors: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  Positive: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
    border: "border-emerald-200/50 dark:border-emerald-800/30",
  },
  Negative: {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-400",
    dot: "bg-rose-500",
    border: "border-rose-200/50 dark:border-rose-800/30",
  },
  Neutral: {
    bg: "bg-amber-50 dark:bg-amber-900/40",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
    border: "border-amber-200/50 dark:border-amber-800/30",
  },
}

const categoryColors: Record<string, string> = {
  "Physical Facilities & Equipment": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Administration: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Instruction: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  "Student Services": "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  "Campus Safety": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Other: "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400",
}

function SentimentCard({ sentimentId }: { sentimentId: number }) {
  const [showComments, setShowComments] = useState(false)
  const [commentInput, setCommentInput] = useState("")
  const [isLikeAnimating, setIsLikeAnimating] = useState(false)

  const { sentiments, toggleLike, addComment, isLikedByCurrentUser } = useUserSentimentStore()
  const item = sentiments.find((s) => s.id === sentimentId)

  if (!item) return null

  const isLiked = isLikedByCurrentUser(item.id)
  const isNew = item.createdAt && Date.now() - item.createdAt < 60000

  const handleLike = () => {
    setIsLikeAnimating(true)
    toggleLike(item.id)
    setTimeout(() => setIsLikeAnimating(false), 300)
  }

  const handleSubmitComment = () => {
    if (commentInput.trim()) {
      addComment(item.id, commentInput.trim())
      setCommentInput("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmitComment()
    }
  }

  return (
    <Card
      className={cn(
        "bg-card overflow-hidden group",
        "border-border/50 rounded-2xl",
        "shadow-sm hover:shadow-lg transition-all duration-300",
        "hover:border-primary/20 hover:-translate-y-0.5",
        isNew && "ring-2 ring-primary/30 ring-offset-2 ring-offset-background",
      )}
    >
      <CardContent className="p-3 sm:p-4 md:p-5">
        <div className="flex gap-3 sm:gap-4">
          <div className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs sm:text-sm md:text-base font-semibold shrink-0 shadow-sm">
            {item.avatar}
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-2.5">
              <div className="flex flex-col gap-1 sm:gap-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm sm:text-base font-semibold text-card-foreground">{item.author}</span>
                  {isNew && (
                    <Badge className="bg-primary/10 text-primary text-[10px] px-1.5 py-0 h-5 animate-pulse">New</Badge>
                  )}
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <Badge
                    className={cn(
                      "text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 flex items-center gap-1 sm:gap-1.5 border-0 rounded-full",
                      sentimentColors[item.sentiment].bg,
                      sentimentColors[item.sentiment].text,
                    )}
                    variant="outline"
                  >
                    <span className={cn("w-1.5 h-1.5 rounded-full", sentimentColors[item.sentiment].dot)} />
                    {item.sentiment}
                  </Badge>
                  {item.category && (
                    <Badge
                      className={cn(
                        "text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 border-0 rounded-full truncate max-w-[140px] sm:max-w-none",
                        categoryColors[item.category] || categoryColors["Other"],
                      )}
                      variant="outline"
                    >
                      {item.category}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs md:text-sm text-muted-foreground shrink-0">
                <Clock className="h-3 w-3" />
                <span>{item.timestamp}</span>
              </div>
            </div>

            {/* Content */}
            <p className="text-card-foreground leading-relaxed text-sm sm:text-base break-words">{item.content}</p>

            {/* Footer - Actions - Better touch targets */}
            <div className="flex items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-border/30">
              {/* Like Button */}
              <button
                onClick={handleLike}
                className={cn(
                  "flex items-center gap-1.5 px-3 sm:px-3.5 md:px-4 py-2 sm:py-2.5 rounded-full transition-all duration-200",
                  "min-h-[44px] justify-center",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                  "touch-manipulation",
                  isLiked
                    ? "bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 shadow-sm"
                    : "text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 active:bg-rose-100",
                )}
                aria-label={isLiked ? "Unlike" : "Like"}
                aria-pressed={isLiked}
              >
                <Heart
                  className={cn(
                    "h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300",
                    isLiked && "fill-current",
                    isLikeAnimating && "scale-125",
                  )}
                />
                <span className="font-medium text-xs sm:text-sm">{item.likes}</span>
              </button>

              {/* Comment Button */}
              <button
                onClick={() => setShowComments(!showComments)}
                className={cn(
                  "flex items-center gap-1.5 px-3 sm:px-3.5 md:px-4 py-2 sm:py-2.5 rounded-full transition-all duration-200",
                  "min-h-[44px] justify-center",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                  "touch-manipulation",
                  showComments
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/10 active:bg-primary/20",
                )}
                aria-label="Toggle comments"
                aria-expanded={showComments}
              >
                <MessageCircle className={cn("h-4 w-4 sm:h-5 sm:w-5", showComments && "fill-current")} />
                <span className="font-medium text-xs sm:text-sm">{item.comments.length}</span>
              </button>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border/30 animate-in slide-in-from-top-2 duration-200">
                {/* Comment Input - Better mobile layout */}
                <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-[10px] sm:text-xs font-semibold shrink-0 shadow-sm">
                    YU
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Write a comment..."
                      className={cn(
                        "flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm",
                        "bg-muted/50 border border-border/50",
                        "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
                        "placeholder:text-muted-foreground/60",
                        "min-h-[40px] sm:min-h-[44px] transition-all duration-200",
                        "hover:border-primary/30",
                      )}
                      aria-label="Write a comment"
                    />
                    <button
                      onClick={handleSubmitComment}
                      disabled={!commentInput.trim()}
                      className={cn(
                        "p-2 sm:p-2.5 md:p-3 rounded-full transition-all duration-200",
                        "min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                        "touch-manipulation",
                        commentInput.trim()
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                          : "bg-muted text-muted-foreground cursor-not-allowed",
                      )}
                      aria-label="Submit comment"
                    >
                      <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </div>

                {/* Comments List */}
                {item.comments.length > 0 ? (
                  <div className="space-y-2.5 sm:space-y-3 max-h-[250px] sm:max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                    {item.comments.map((comment, index) => (
                      <div
                        key={comment.id}
                        className="flex gap-2 sm:gap-3 group animate-in fade-in slide-in-from-bottom-2 duration-200"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-[9px] sm:text-[10px] md:text-xs font-semibold shrink-0 shadow-sm">
                          {comment.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="bg-muted/50 rounded-2xl px-3 sm:px-3.5 md:px-4 py-2 sm:py-2.5 md:py-3 shadow-sm">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1 flex-wrap">
                              <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-foreground">
                                {comment.author}
                              </span>
                              <span className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground">
                                {comment.timestamp}
                              </span>
                            </div>
                            <p className="text-[11px] sm:text-xs md:text-sm text-foreground/90 leading-relaxed break-words">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                        {comment.author === "You" && (
                          <button
                            onClick={() => useUserSentimentStore.getState().deleteComment(item.id, comment.id)}
                            className={cn(
                              "p-1.5 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200",
                              "text-muted-foreground hover:text-destructive hover:bg-destructive/10 active:bg-destructive/20",
                              "focus:outline-none focus:opacity-100",
                              "min-h-[32px] min-w-[32px] flex items-center justify-center",
                              "hover:scale-110 active:scale-95",
                              "touch-manipulation",
                            )}
                            aria-label="Delete comment"
                          >
                            <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5 sm:py-6 bg-muted/30 rounded-xl">
                    <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                      No comments yet. Be the first to comment!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <Card className="border-border/50 rounded-2xl shadow-sm bg-gradient-to-br from-card to-muted/20">
      <CardContent className="flex flex-col items-center justify-center py-10 sm:py-12 md:py-16 px-4 sm:px-6">
        <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-3 sm:mb-4 md:mb-5">
          <MessageSquareOff className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 text-muted-foreground/50" />
        </div>
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-foreground mb-1.5 sm:mb-2 text-center">
          No Sentiments Yet
        </h3>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground text-center max-w-sm leading-relaxed">
          Be the first to share your thoughts! Tap the chat bubble to post your feedback about NEMSU.
        </p>
      </CardContent>
    </Card>
  )
}

export function SentimentFeed() {
  const { sentiments } = useUserSentimentStore()

  if (sentiments.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid gap-3 sm:gap-4 md:gap-5">
      {sentiments.map((item, index) => (
        <div
          key={item.id}
          className="animate-in fade-in-0 slide-in-from-bottom-4"
          style={{ animationDelay: `${index * 80}ms`, animationFillMode: "backwards" }}
        >
          <SentimentCard sentimentId={item.id} />
        </div>
      ))}
    </div>
  )
}
