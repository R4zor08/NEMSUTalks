"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Send, Trash2, Bell, Calendar, Save, FileText, Megaphone } from "lucide-react"
import { useAnnouncementsStore } from "@/lib/announcements-store"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function AdminAnnounce() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { announcements, addAnnouncement, deleteAnnouncement, publishDraft } = useAnnouncementsStore()

  const resetForm = () => {
    setTitle("")
    setContent("")
    setCategory("")
  }

  const handlePublish = () => {
    if (!title.trim()) {
      toast.error("Please enter a title for your announcement")
      return
    }
    if (!category) {
      toast.error("Please select a category")
      return
    }
    if (!content.trim()) {
      toast.error("Please enter the announcement content")
      return
    }

    addAnnouncement({
      title: title.trim(),
      description: content.trim(),
      category: category.charAt(0).toUpperCase() + category.slice(1),
      status: "Published",
    })

    toast.success("Announcement published successfully!", {
      description: "Users will be notified about this announcement.",
      icon: <Megaphone className="h-4 w-4" />,
    })
    resetForm()
  }

  const handleSaveDraft = () => {
    if (!title.trim()) {
      toast.error("Please enter a title for your draft")
      return
    }

    addAnnouncement({
      title: title.trim(),
      description: content.trim() || "No content yet",
      category: category ? category.charAt(0).toUpperCase() + category.slice(1) : "General",
      status: "Draft",
    })

    toast.success("Draft saved successfully!", {
      description: "You can publish it later from Recent Announcements.",
      icon: <Save className="h-4 w-4" />,
    })
    resetForm()
  }

  const handleDelete = (id: string) => {
    deleteAnnouncement(id)
    setDeleteId(null)
    toast.success("Announcement deleted successfully")
  }

  const handlePublishDraft = (id: string) => {
    publishDraft(id)
    toast.success("Draft published successfully!", {
      description: "Users will now be notified about this announcement.",
    })
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Announcements</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Create and manage school announcements</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
        {/* Create Announcement */}
        <Card className="bg-card border-border/50 shadow-sm order-1">
          <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-4 md:px-6">
            <CardTitle className="flex items-center gap-2 text-card-foreground text-base sm:text-lg">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <span className="truncate">Create Announcement</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-4 md:px-6">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="title" className="text-card-foreground text-xs sm:text-sm font-medium">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Announcement title..."
                className="h-10 sm:h-11 rounded-xl text-sm sm:text-base bg-secondary/30 border-border/60 hover:border-primary/40 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="category" className="text-card-foreground text-xs sm:text-sm font-medium">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-10 sm:h-11 rounded-xl text-sm sm:text-base bg-secondary/30 border-border/60">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                  <SelectItem value="facilities">Facilities</SelectItem>
                  <SelectItem value="scholarship">Scholarship</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="content" className="text-card-foreground text-xs sm:text-sm font-medium">
                Content
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your announcement..."
                rows={4}
                className="text-sm sm:text-base resize-none rounded-xl bg-secondary/30 border-border/60 hover:border-primary/40 focus:ring-2 focus:ring-primary/20 min-h-[100px] sm:min-h-[120px]"
              />
            </div>

            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 bg-secondary/50 hover:bg-secondary h-11 sm:h-11 text-sm rounded-xl border-border/60 min-h-[44px]"
                onClick={handleSaveDraft}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                className="flex-1 h-11 sm:h-11 text-sm rounded-xl shadow-md hover:shadow-lg transition-all min-h-[44px]"
                onClick={handlePublish}
              >
                <Send className="h-4 w-4 mr-2" />
                Publish
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card className="bg-card border-border/50 shadow-sm order-2">
          <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-4 md:px-6">
            <CardTitle className="flex items-center gap-2 text-card-foreground text-base sm:text-lg">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <span className="truncate">Recent Announcements</span>
              <Badge variant="secondary" className="ml-auto text-xs px-2 py-0.5 shrink-0">
                {announcements.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 md:px-6">
            {announcements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-3">
                  <FileText className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">No announcements yet</p>
                <p className="text-xs text-muted-foreground mt-1">Create your first announcement above</p>
              </div>
            ) : (
              <div className="space-y-2.5 sm:space-y-3 max-h-[280px] sm:max-h-[320px] md:max-h-[360px] lg:max-h-[400px] overflow-y-auto pr-1 -mr-1 scrollbar-thin">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-3 sm:p-4 border border-border/50 rounded-xl hover:bg-secondary/30 hover:border-primary/20 transition-all duration-200"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <h4 className="font-medium text-card-foreground text-sm sm:text-base line-clamp-2 leading-snug">
                        {announcement.title}
                      </h4>
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-[10px] sm:text-xs h-5 sm:h-auto">
                          {announcement.category}
                        </Badge>
                        <Badge
                          variant={announcement.status === "Published" ? "default" : "outline"}
                          className="text-[10px] sm:text-xs h-5 sm:h-auto"
                        >
                          {announcement.status}
                        </Badge>
                      </div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3 shrink-0" />
                        {new Date(announcement.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-1 shrink-0 self-end sm:self-start">
                      {announcement.status === "Draft" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 sm:h-8 sm:w-8 text-primary hover:text-primary hover:bg-primary/10 rounded-lg"
                          onClick={() => handlePublishDraft(announcement.id)}
                          title="Publish draft"
                        >
                          <Send className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 sm:h-8 sm:w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
                        onClick={() => setDeleteId(announcement.id)}
                        title="Delete announcement"
                      >
                        <Trash2 className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="max-w-[92vw] sm:max-w-md rounded-2xl mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Announcement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this announcement? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="mt-0 rounded-xl min-h-[44px]">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl min-h-[44px]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
