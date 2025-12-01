import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SentimentFeed } from "@/components/dashboard/sentiment-feed"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header Section */}

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-border/30">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">Recent Sentiments</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Latest feedback from the NEMSU community</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full border border-border/50">
                Showing latest posts
              </span>
            </div>
          </div>

          {/* Sentiment Feed with proper padding for chatbot */}
          <div className="pb-20 sm:pb-4">
            <SentimentFeed />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
