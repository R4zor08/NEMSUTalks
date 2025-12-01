"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Clock,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Activity,
} from "lucide-react"
import { AdminChart } from "./admin-chart"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { useSentimentStore } from "@/lib/sentiment-data"

export function AdminInsights() {
  const { getTrendData, getStats, sentiments } = useSentimentStore()
  const trendData = getTrendData()
  const stats = getStats()

  const categoryCount = sentiments.reduce(
    (acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const mostActiveCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]
  const categoryPercentage = mostActiveCategory ? Math.round((mostActiveCategory[1] / sentiments.length) * 100) : 0

  const resolutionRate = stats.total > 0 ? ((stats.resolved / stats.total) * 100).toFixed(1) : "0"

  const currentMonth = trendData[trendData.length - 1]?.sentiments || 0
  const previousMonth = trendData[trendData.length - 2]?.sentiments || 0
  const trendPercentage = previousMonth > 0 ? Math.round(((currentMonth - previousMonth) / previousMonth) * 100) : 0

  const insights = [
    {
      title: "Most Active Category",
      value: mostActiveCategory?.[0]?.split(" ")[0] || "N/A",
      subtext: `${categoryPercentage}% of all sentiments`,
      icon: Target,
      trend: "up",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
      iconColor: "text-white",
      borderColor: "hover:border-blue-500/50",
    },
    {
      title: "Average Response Time",
      value: "2.3 days",
      subtext: "Improved from 3.1 days",
      icon: Clock,
      trend: "up",
      gradient: "from-violet-500 to-purple-500",
      bgGradient: "from-violet-500/10 to-purple-500/10",
      iconBg: "bg-gradient-to-br from-violet-500 to-purple-500",
      iconColor: "text-white",
      borderColor: "hover:border-violet-500/50",
    },
    {
      title: "Active Students",
      value: "423",
      subtext: "This semester",
      icon: Users,
      trend: "up",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-500/10 to-teal-500/10",
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
      iconColor: "text-white",
      borderColor: "hover:border-emerald-500/50",
    },
    {
      title: "Resolution Rate",
      value: `${resolutionRate}%`,
      subtext: "Last 30 days",
      icon: MessageSquare,
      trend: Number.parseFloat(resolutionRate) >= 90 ? "up" : "down",
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-500/10 to-orange-500/10",
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
      iconColor: "text-white",
      borderColor: "hover:border-amber-500/50",
    },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-md border border-border rounded-xl p-3 sm:p-4 shadow-2xl">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-lg sm:text-2xl font-bold text-primary mt-1">{payload[0].value} sentiments</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
              <Activity className="h-6 w-6 sm:h-7 sm:w-7 text-primary-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
              Insights
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-0.5 sm:mt-1">
              Analytics and trends from student sentiments
            </p>
          </div>
        </div>
        <Sparkles className="absolute right-0 top-0 h-5 w-5 sm:h-6 sm:w-6 text-primary/40 animate-pulse hidden md:block" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {insights.map((insight, index) => (
          <Card
            key={index}
            className={`group relative overflow-hidden bg-card border border-border/50 ${insight.borderColor} hover:shadow-2xl transition-all duration-500 hover:-translate-y-1`}
          >
            {/* Animated gradient background on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${insight.bgGradient} opacity-0 group-hover:opacity-100 transition-all duration-500`}
            />
            {/* Subtle shine effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

            <CardContent className="relative p-3 sm:p-4 lg:p-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-xl ${insight.iconBg} flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}
                >
                  <insight.icon className={`h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${insight.iconColor}`} />
                </div>
                <Badge
                  variant="secondary"
                  className={`flex items-center gap-1 text-[9px] sm:text-[10px] lg:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full w-fit ${
                    insight.trend === "up"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                      : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800"
                  }`}
                >
                  {insight.trend === "up" ? (
                    <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  ) : (
                    <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  )}
                  <span className="hidden sm:inline">{insight.trend === "up" ? "Up" : "Down"}</span>
                </Badge>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <p className="text-[10px] sm:text-xs lg:text-sm font-medium text-muted-foreground line-clamp-1">
                  {insight.title}
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-card-foreground tracking-tight">
                  {insight.value}
                </p>
                <p className="text-[9px] sm:text-[10px] lg:text-xs text-muted-foreground flex items-center gap-1 line-clamp-1">
                  <span
                    className={`inline-block w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-gradient-to-r ${insight.gradient} flex-shrink-0`}
                  />
                  <span className="truncate">{insight.subtext}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border border-border/50 overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 lg:p-6 pb-2 sm:pb-3 lg:pb-4 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-sm sm:text-base lg:text-lg xl:text-xl text-card-foreground">
                Sentiment Trend
              </CardTitle>
              <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground mt-0.5">12 months overview</p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className={`flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs lg:text-sm font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full w-fit ${
              trendPercentage >= 0
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800"
            }`}
          >
            {trendPercentage >= 0 ? (
              <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
            ) : (
              <ArrowDownRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
            )}
            {Math.abs(trendPercentage)}% vs last month
          </Badge>
        </CardHeader>
        <CardContent className="p-2 sm:p-3 lg:p-6 pt-2 sm:pt-3 lg:pt-4">
          <div className="h-[180px] sm:h-[240px] md:h-[280px] lg:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                    <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.4} />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={8}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  tick={{ fontSize: 7, fill: "hsl(var(--muted-foreground))" }}
                  dy={8}
                  angle={-45}
                  textAnchor="end"
                  height={40}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={8}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                  width={30}
                  tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="sentiments"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#sentimentGradient)"
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 2, stroke: "hsl(var(--card))" }}
                  activeDot={{
                    r: 5,
                    fill: "hsl(var(--primary))",
                    stroke: "hsl(var(--card))",
                    strokeWidth: 2,
                    className: "drop-shadow-lg",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        <AdminChart type="sentiment" />
        <AdminChart type="category" />
      </div>
    </div>
  )
}
