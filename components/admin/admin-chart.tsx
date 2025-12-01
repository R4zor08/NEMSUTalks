"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { PieChartIcon, BarChart3, TrendingUp } from "lucide-react"

interface AdminChartProps {
  type: "sentiment" | "category"
}

const sentimentData = [
  { name: "Positive", value: 45, fill: "hsl(142, 76%, 36%)" },
  { name: "Neutral", value: 35, fill: "hsl(48, 96%, 53%)" },
  { name: "Negative", value: 20, fill: "hsl(0, 84%, 60%)" },
]

const categoryData = [
  { name: "Facilities", onProcess: 24, resolved: 45 },
  { name: "Admin", onProcess: 15, resolved: 32 },
  { name: "Instruction", onProcess: 8, resolved: 28 },
  { name: "Services", onProcess: 12, resolved: 20 },
]

const COLORS = ["hsl(142, 76%, 36%)", "hsl(48, 96%, 53%)", "hsl(0, 84%, 60%)"]

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, index }: any) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 1.6
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="hsl(var(--foreground))"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-[8px] sm:text-[10px] lg:text-xs font-semibold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-md border border-border rounded-xl p-2 sm:p-3 shadow-2xl min-w-[100px] sm:min-w-[140px]">
        {label && <p className="text-[10px] sm:text-xs font-semibold text-foreground mb-1.5 sm:mb-2">{label}</p>}
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-1.5 sm:gap-2 py-0.5">
            <span
              className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color || entry.payload.fill }}
            />
            <span className="text-[9px] sm:text-xs text-muted-foreground">{entry.name}:</span>
            <span className="text-[10px] sm:text-sm font-bold text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 mt-2 sm:mt-3 lg:mt-4 px-2">
      {payload.map((entry: any, index: number) => (
        <div
          key={index}
          className="flex items-center gap-1 sm:gap-1.5 bg-muted/50 rounded-full px-2 sm:px-3 py-1 sm:py-1.5"
        >
          <span
            className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[9px] sm:text-[10px] lg:text-xs font-medium text-muted-foreground whitespace-nowrap">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export function AdminChart({ type }: AdminChartProps) {
  if (type === "sentiment") {
    const total = sentimentData.reduce((acc, item) => acc + item.value, 0)

    return (
      <Card className="bg-card border border-border/50 overflow-hidden hover:shadow-xl hover:border-violet-500/30 transition-all duration-300">
        <CardHeader className="p-3 sm:p-4 lg:p-6 pb-2 sm:pb-3 lg:pb-4 bg-gradient-to-r from-violet-500/5 to-transparent">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-md">
                <PieChartIcon className="h-4 w-4 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm sm:text-base lg:text-lg text-card-foreground">
                  Sentiment Distribution
                </CardTitle>
                <p className="text-[9px] sm:text-[10px] lg:text-xs text-muted-foreground mt-0.5">
                  Overall sentiment breakdown
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="text-[9px] sm:text-[10px] lg:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800 w-fit"
            >
              Total: {total}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-2 sm:p-3 lg:p-6 pt-0 sm:pt-0 lg:pt-0">
          <div className="h-[200px] sm:h-[240px] md:h-[280px] lg:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="45%"
                  innerRadius="35%"
                  outerRadius="55%"
                  paddingAngle={4}
                  dataKey="value"
                  label={renderCustomizedLabel}
                  labelLine={{ strokeWidth: 1, stroke: "hsl(var(--muted-foreground))" }}
                  stroke="hsl(var(--card))"
                  strokeWidth={3}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="hover:opacity-80 transition-opacity cursor-pointer drop-shadow-md"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomChartTooltip />} />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border border-border/50 overflow-hidden hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300">
      <CardHeader className="p-3 sm:p-4 lg:p-6 pb-2 sm:pb-3 lg:pb-4 bg-gradient-to-r from-emerald-500/5 to-transparent">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
              <BarChart3 className="h-4 w-4 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm sm:text-base lg:text-lg text-card-foreground">Status by Category</CardTitle>
              <p className="text-[9px] sm:text-[10px] lg:text-xs text-muted-foreground mt-0.5">
                Processing vs resolved
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="text-[9px] sm:text-[10px] lg:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 w-fit flex items-center gap-1"
          >
            <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-3 lg:p-6 pt-0 sm:pt-0 lg:pt-0">
        <div className="h-[200px] sm:h-[240px] md:h-[280px] lg:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryData}
              layout="vertical"
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              barCategoryGap="25%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                horizontal={true}
                vertical={false}
                opacity={0.4}
              />
              <XAxis
                type="number"
                stroke="hsl(var(--muted-foreground))"
                fontSize={8}
                tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={55}
                stroke="hsl(var(--muted-foreground))"
                fontSize={8}
                tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend content={<CustomLegend />} />
              <Bar
                dataKey="onProcess"
                name="On Process"
                fill="hsl(48, 96%, 53%)"
                radius={[0, 6, 6, 0]}
                className="hover:opacity-80 transition-opacity cursor-pointer drop-shadow-sm"
              />
              <Bar
                dataKey="resolved"
                name="Resolved"
                fill="hsl(142, 76%, 36%)"
                radius={[0, 6, 6, 0]}
                className="hover:opacity-80 transition-opacity cursor-pointer drop-shadow-sm"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
