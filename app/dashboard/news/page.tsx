"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Calendar, FileText, Sparkles } from "lucide-react"
import { useAnnouncementsStore } from "@/lib/announcements-store"
import { useEffect } from "react"
import { cn } from "@/lib/utils"

export default function NewsPage() {
  const { announcements, markAsRead, getPublishedAnnouncements } = useAnnouncementsStore()
  const publishedAnnouncements = getPublishedAnnouncements()

  // Mark announcements as read when user views this page
  useEffect(() => {
    publishedAnnouncements.forEach((announcement) => {
      if (announcement.isNew) {
        markAsRead(announcement.id)
      }
    })
  }, [])

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "academic":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
      case "events":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
      case "facilities":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
      case "scholarship":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 px-1 sm:px-0">
        <div className="flex items-start gap-3">
          <div className="p-2.5 sm:p-3 rounded-xl bg-primary/10 shrink-0">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">News & Updates</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-0.5">
              Real-time announcements from the School Administration
            </p>
          </div>
        </div>

        {publishedAnnouncements.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-foreground mb-2">No announcements yet</h3>
              <p className="text-muted-foreground text-center text-sm sm:text-base max-w-sm">
                Check back later for updates from the school administration.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {publishedAnnouncements.map((announcement, index) => (
              <Card
                key={announcement.id}
                className={cn(
                  "bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]",
                  announcement.isNew && "ring-2 ring-primary/50",
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-2 sm:pb-4">
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300",
                          announcement.isNew
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                            : "bg-primary/10",
                        )}
                      >
                        <Bell
                          className={cn(
                            "h-5 w-5 sm:h-6 sm:w-6",
                            announcement.isNew ? "text-primary-foreground animate-pulse" : "text-primary",
                          )}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="text-base sm:text-lg text-card-foreground leading-tight">
                            {announcement.title}
                          </CardTitle>
                          {announcement.isNew && (
                            <Badge
                              variant="default"
                              className="text-[10px] sm:text-xs px-2 py-0.5 animate-pulse shadow-md"
                            >
                              New
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className={cn("text-[10px] sm:text-xs border", getCategoryColor(announcement.category))}
                          >
                            {announcement.category}
                          </Badge>
                          <span className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(announcement.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    {announcement.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
