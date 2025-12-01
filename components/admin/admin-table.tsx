"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useSentimentStore } from "@/lib/sentiment-data"

interface AdminTableProps {
  statusFilter: string
  categoryFilter: string
  onUpdateStatus: (id: string) => void
}

export function AdminTable({ statusFilter, categoryFilter, onUpdateStatus }: AdminTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const sentiments = useSentimentStore((state) => state.sentiments)

  const filteredSentiments = sentiments.filter((s) => {
    if (statusFilter !== "all" && s.status.toLowerCase().replace(" ", "-") !== statusFilter) return false
    if (categoryFilter !== "all") {
      const categoryMap: Record<string, string> = {
        facilities: "Physical Facilities & Equipment",
        administration: "Administration",
        instruction: "Instruction",
      }
      if (s.category !== categoryMap[categoryFilter]) return false
    }
    return true
  })

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-card-foreground text-sm sm:text-base lg:text-lg">Sentiment Data</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[90px] lg:w-[100px] text-xs lg:text-sm">Stud ID</TableHead>
                <TableHead className="text-xs lg:text-sm">Sentiment</TableHead>
                <TableHead className="w-[160px] lg:w-[200px] text-xs lg:text-sm">Category</TableHead>
                <TableHead className="w-[100px] lg:w-[120px] text-xs lg:text-sm">Status</TableHead>
                <TableHead className="w-[80px] lg:w-[100px] text-xs lg:text-sm">Date</TableHead>
                <TableHead className="w-[80px] text-xs lg:text-sm">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSentiments.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium text-xs lg:text-sm">{item.studId}</TableCell>
                  <TableCell className="max-w-md">
                    <p className="truncate text-xs lg:text-sm">{item.sentiment}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] lg:text-xs whitespace-nowrap">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "text-[10px] lg:text-xs",
                        item.status === "Resolved"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                      )}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-[10px] lg:text-sm">
                    {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onUpdateStatus(item.id)}
                      className="h-8 w-8 lg:h-9 lg:w-auto lg:px-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-all"
                    >
                      <RefreshCw className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                      <span className="hidden lg:inline ml-2 text-xs">Update</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden space-y-2 sm:space-y-3 p-3 sm:p-4">
          {filteredSentiments.map((item) => (
            <div
              key={item.id}
              className="border border-border/50 rounded-xl p-3 sm:p-4 bg-card hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-card-foreground text-sm sm:text-base">{item.studId}</p>
                  <Badge variant="secondary" className="text-[10px] sm:text-xs mt-1">
                    {item.category}
                  </Badge>
                </div>
                <Badge
                  className={cn(
                    "text-[10px] sm:text-xs shrink-0",
                    item.status === "Resolved"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                  )}
                >
                  {item.status}
                </Badge>
              </div>

              <button
                className="flex items-center gap-1 text-xs sm:text-sm text-primary mt-3 py-1 hover:underline"
                onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}
              >
                {expandedRow === item.id ? (
                  <>
                    Hide Details <ChevronUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </>
                ) : (
                  <>
                    View Details <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </>
                )}
              </button>

              {expandedRow === item.id && (
                <div className="mt-3 pt-3 border-t border-border/50 space-y-3 animate-fade-in">
                  <p className="text-xs sm:text-sm text-card-foreground leading-relaxed">{item.sentiment}</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      {new Date(item.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <Button
                      size="sm"
                      onClick={() => onUpdateStatus(item.id)}
                      className="h-8 sm:h-9 rounded-lg text-xs sm:text-sm gap-1.5"
                    >
                      <RefreshCw className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      Update Status
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
