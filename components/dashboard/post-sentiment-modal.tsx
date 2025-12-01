"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Send, MessageSquare, CheckCircle2, Sparkles, AlertCircle, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUserSentimentStore } from "@/lib/user-sentiment-store"
import { useSentimentStore } from "@/lib/sentiment-data"
import { toast } from "sonner"

interface PostSentimentModalProps {
  open: boolean
  onClose: () => void
}

export function PostSentimentModal({ open, onClose }: PostSentimentModalProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<{
    category: string
    sentimentType: string
    isAppropriate: boolean
    rewrittenContent: string
    reason?: string
  } | null>(null)

  const addUserSentiment = useUserSentimentStore((state) => state.addSentiment)
  const addAdminSentiment = useSentimentStore((state) => state.addSentiment)

  const handleAnalyze = async () => {
    if (!content.trim()) return

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze-sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      })

      if (!response.ok) throw new Error("Analysis failed")

      const result = await response.json()
      setAnalysisResult(result)
    } catch (error) {
      toast.error("Failed to analyze sentiment. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSubmit = async () => {
    if (!content.trim()) return

    setIsSubmitting(true)

    try {
      // If not already analyzed, analyze first
      let result = analysisResult
      if (!result) {
        const response = await fetch("/api/analyze-sentiment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: content.trim() }),
        })

        if (!response.ok) throw new Error("Analysis failed")
        result = await response.json()
      }

      // Use the rewritten content (which is the same as original if appropriate)
      const finalContent = result.rewrittenContent
      const category = result.category

      const newSentiment = addUserSentiment(finalContent, category as any)

      addAdminSentiment({
        sentiment: finalContent,
        category: category as any,
        sentimentType: result.sentimentType as any,
      })

      setIsSubmitting(false)
      setShowSuccess(true)

      // Show appropriate toast
      if (!result.isAppropriate) {
        toast.success("Sentiment Posted!", {
          description: "Your feedback was refined by AI for constructive communication.",
        })
      } else {
        toast.success("Sentiment Posted!", {
          description: `Categorized as ${category} with ${result.sentimentType} tone.`,
        })
      }

      // Reset after animation
      setTimeout(() => {
        setShowSuccess(false)
        setContent("")
        setAnalysisResult(null)
        onClose()
      }, 1500)
    } catch (error) {
      setIsSubmitting(false)
      toast.error("Failed to post sentiment. Please try again.")
    }
  }

  const handleClose = () => {
    setContent("")
    setAnalysisResult(null)
    onClose()
  }

  const characterCount = content.length
  const maxCharacters = 500

  if (showSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-lg rounded-2xl">
          <div className="flex flex-col items-center justify-center py-8 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400 animate-in zoom-in duration-300" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Sentiment Posted!</h3>
            <p className="text-sm text-muted-foreground text-center">
              Your feedback has been analyzed by AI and submitted successfully.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-lg rounded-2xl border-border/50 shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left">
          <DialogTitle className="text-foreground flex items-center gap-2.5 text-lg">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-sm">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            Post Sentiment
          </DialogTitle>
          <DialogDescription className="text-sm mt-1.5">
            Share your thoughts anonymously. AI will automatically categorize and ensure constructive feedback.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-3">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/10">
            <Sparkles className="h-4 w-4 text-primary shrink-0" />
            <p className="text-xs text-muted-foreground">
              AI will automatically classify your sentiment into the appropriate category and ensure it&apos;s
              constructive.
            </p>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="content" className="text-foreground text-sm font-medium">
              Your Sentiment
            </Label>
            <div className="relative">
              <Textarea
                id="content"
                placeholder="Share your thoughts, feedback, or suggestions about your experience at NEMSU..."
                value={content}
                onChange={(e) => {
                  setContent(e.target.value.slice(0, maxCharacters))
                  setAnalysisResult(null) // Reset analysis when content changes
                }}
                rows={5}
                className={cn(
                  "resize-none rounded-xl border-border/50 transition-all duration-200",
                  "focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
                  "placeholder:text-muted-foreground/60",
                  "hover:border-primary/30",
                )}
              />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">Be specific for better categorization</p>
              <p
                className={cn(
                  "text-xs font-medium transition-colors",
                  characterCount > maxCharacters * 0.9
                    ? "text-destructive"
                    : characterCount > maxCharacters * 0.7
                      ? "text-amber-500"
                      : "text-muted-foreground",
                )}
              >
                {characterCount}/{maxCharacters}
              </p>
            </div>
          </div>

          {/* AI Analysis Result */}
          {analysisResult && (
            <div className="space-y-3 p-4 rounded-xl bg-secondary/50 border border-border/50 animate-in fade-in-0 slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">AI Analysis</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-lg bg-background">
                  <p className="text-xs text-muted-foreground mb-1">Category</p>
                  <p className="text-sm font-medium text-foreground">{analysisResult.category}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-background">
                  <p className="text-xs text-muted-foreground mb-1">Sentiment</p>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      analysisResult.sentimentType === "Positive" && "text-emerald-600",
                      analysisResult.sentimentType === "Negative" && "text-red-500",
                      analysisResult.sentimentType === "Neutral" && "text-amber-500",
                    )}
                  >
                    {analysisResult.sentimentType}
                  </p>
                </div>
              </div>

              {!analysisResult.isAppropriate && analysisResult.reason && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">Content Refined</p>
                      <p className="text-xs text-muted-foreground">{analysisResult.reason}</p>
                      <p className="text-xs text-foreground mt-2 p-2 rounded bg-background">
                        &ldquo;{analysisResult.rewrittenContent}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-3 border-t border-border/50">
            <Button
              variant="outline"
              onClick={handleClose}
              className="h-11 rounded-xl bg-transparent hover:bg-muted/50 transition-all"
            >
              Cancel
            </Button>

            {/* Preview/Analyze button */}
            {!analysisResult && content.trim().length >= 10 && (
              <Button
                variant="outline"
                onClick={handleAnalyze}
                disabled={isAnalyzing || content.trim().length < 10}
                className="h-11 rounded-xl gap-2 border-primary/30 text-primary hover:bg-primary/10 transition-all bg-transparent"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Preview Analysis
                  </>
                )}
              </Button>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || content.trim().length < 10 || isSubmitting || isAnalyzing}
              className={cn(
                "h-11 rounded-xl shadow-sm transition-all duration-200",
                "hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Post Sentiment
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
