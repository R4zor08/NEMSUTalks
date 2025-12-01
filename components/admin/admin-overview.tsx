"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { MessageSquare, TrendingUp, Clock, CheckCircle, Filter, ArrowUpRight, RefreshCw } from "lucide-react"
import { AdminTable } from "./admin-table"
import { AdminChart } from "./admin-chart"
import { cn } from "@/lib/utils"
import { useSentimentStore } from "@/lib/sentiment-data"
import { toast } from "sonner"

export function AdminOverview() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [selectedSentiment, setSelectedSentiment] = useState<string | null>(null)
  const [newStatus, setNewStatus] = useState<"On Process" | "Resolved">("On Process")

  const { updateStatus, getSentimentById, getStats } = useSentimentStore()
  const stats = getStats()

  const statsData = [
    {
      label: "Total Sentiments",
      value: stats.total.toLocaleString(),
      icon: MessageSquare,
      trend: "+12%",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "On Process",
      value: stats.onProcess.toString(),
      icon: Clock,
      trend: "+5%",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Resolved",
      value: stats.resolved.toLocaleString(),
      icon: CheckCircle,
      trend: "+18%",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "This Month",
      value: stats.thisMonth.toString(),
      icon: TrendingUp,
      trend: "+23%",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ]

  const handleUpdateStatus = (id: string) => {
    setSelectedSentiment(id)
    const sentiment = getSentimentById(id)
    if (sentiment) {
      setNewStatus(sentiment.status)
    }
    setUpdateModalOpen(true)
  }

  const handleConfirmUpdate = () => {
    if (selectedSentiment) {
      const sentiment = getSentimentById(selectedSentiment)
      updateStatus(selectedSentiment, newStatus)
      setUpdateModalOpen(false)
      setSelectedSentiment(null)

      toast.success("Status Updated", {
        description: `Sentiment ${sentiment?.studId} has been updated to "${newStatus}"`,
      })
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="pb-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-1 text-xs sm:text-sm lg:text-base">
          Manage student sentiments and track analytics
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        {statsData.map((stat, index) => (
          <Card
            key={index}
            className="bg-card card-hover border-border/50 shadow-sm"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-3 sm:p-4 lg:p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                  <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground truncate">{stat.label}</p>
                  <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-card-foreground">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={cn(
                    "w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center shrink-0",
                    stat.bgColor,
                  )}
                >
                  <stat.icon className={cn("h-4 w-4 sm:h-5 sm:w-5", stat.color)} />
                </div>
              </div>
              <Badge
                variant="secondary"
                className="mt-2 sm:mt-3 text-[10px] sm:text-xs font-medium flex items-center gap-1 w-fit"
              >
                <ArrowUpRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="hidden xs:inline">{stat.trend} from last month</span>
                <span className="xs:hidden">{stat.trend}</span>
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        <AdminChart type="sentiment" />
        <AdminChart type="category" />
      </div>

      <Card className="bg-card border-border/50 shadow-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full xs:w-[140px] sm:w-[160px] h-9 sm:h-10 rounded-xl text-xs sm:text-sm bg-secondary/30 border-border/60">
                <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="on-process">On Process</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full xs:w-[180px] sm:w-[200px] h-9 sm:h-10 rounded-xl text-xs sm:text-sm bg-secondary/30 border-border/60">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="facilities">Physical Facilities</SelectItem>
                <SelectItem value="administration">Administration</SelectItem>
                <SelectItem value="instruction">Instruction</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Data Table */}
      <AdminTable statusFilter={statusFilter} categoryFilter={categoryFilter} onUpdateStatus={handleUpdateStatus} />

      <Dialog open={updateModalOpen} onOpenChange={setUpdateModalOpen}>
        <DialogContent className="sm:max-w-md mx-4 rounded-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-foreground text-base sm:text-lg">Update Sentiment Status</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {selectedSentiment && (
                <>
                  Change the status for sentiment{" "}
                  <span className="font-medium text-foreground">{getSentimentById(selectedSentiment)?.studId}</span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4 mt-2">
            {selectedSentiment && (
              <div className="p-3 bg-muted/50 rounded-xl border border-border/50">
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
                  {getSentimentById(selectedSentiment)?.sentiment}
                </p>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50">
                  <span className="text-[10px] sm:text-xs text-muted-foreground">Current Status:</span>
                  <Badge
                    className={cn(
                      "text-[10px] sm:text-xs",
                      getSentimentById(selectedSentiment)?.status === "Resolved"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                    )}
                  >
                    {getSentimentById(selectedSentiment)?.status}
                  </Badge>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-foreground">New Status</label>
              <Select value={newStatus} onValueChange={(value) => setNewStatus(value as "On Process" | "Resolved")}>
                <SelectTrigger className="h-10 sm:h-11 rounded-xl text-sm">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="On Process">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-500" />
                      On Process
                    </div>
                  </SelectItem>
                  <SelectItem value="Resolved">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Resolved
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setUpdateModalOpen(false)}
                className="h-9 sm:h-10 rounded-xl text-xs sm:text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmUpdate}
                className="h-9 sm:h-10 rounded-xl shadow-sm hover:shadow-md transition-all text-xs sm:text-sm"
              >
                <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                Update Status
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
