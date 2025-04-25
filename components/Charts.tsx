"use client"

import { useEffect, useState } from "react"
import { TrendingDown, TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts"
import { format, startOfWeek, startOfMonth } from "date-fns"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import supabase from "@/lib/supabase"

const chartConfig = {
  xp: {
    label: "xp",
    color: "hsl(var(--chart-2))",
  },
}

export function Charts({ userId }: { userId: string }) {
  const [data, setData] = useState<any[]>([])
  const [view, setView] = useState<"daily" | "weekly" | "monthly">("weekly")

  useEffect(() => {
    const fetchData = async () => {
      const { data: completions, error } = await supabase
        .from("daily_completions")
        .select("date, completed")
        .eq("user_id", userId)
        .gte("date", format(startOfMonth(new Date()), "yyyy-MM-dd"))
        .order('date', {ascending: true})

      if (error) {
        console.error("Data fetch error:", error)
        return
      }

      const formatted = formatData(completions || [], view)
      setData(formatted)
    }

    fetchData()
  }, [view, userId])

  const formatData = (rows: any[], mode: "daily" | "weekly" | "monthly") => {
    const map = new Map<string, number>()

    for (const { date, completed } of rows) {
      const d = new Date(date)
      let key = ""

      if (mode === "daily") key = format(d, "dd MMM")
      else if (mode === "weekly") key = format(startOfWeek(d), "'Week of' dd MMM")
      else if (mode === "monthly") key = format(d, "MMM yyyy")

      map.set(key, (map.get(key) || 0) + completed)
    }

    return Array.from(map.entries()).map(([label, xp]) => ({ label, xp }))
  }

  const first = data[0]?.xp ?? 0
  const last = data[data.length - 1]?.xp ?? 0
  const uptrend = ((last - first) / (first || 1)) * 100

  const trendColor = uptrend >= 0 ? "#22c55e" : "#ef4444" // green-500 or red-500

  return (
    <Card className="w-full max-w-4xl mx-auto my-10">
      <CardHeader>
        <CardTitle>Progress Chart</CardTitle>
        <CardDescription>Showing completions {view}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex justify-center gap-2 mb-4">
          {["daily", "weekly", "monthly"].map((v) => (
            <Button
              key={v}
              variant={v === view ? "default" : "outline"}
              onClick={() => setView(v as any)}
              size="sm"
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>

        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{ top: 15, bottom: 0, left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="xp"
                type="natural"
                fill={trendColor}
                fillOpacity={0.4}
                stroke={trendColor}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-center justify-center gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending {uptrend >= 0 ? 'up' : 'down'} by {Math.abs(uptrend).toFixed(1)}%
              {uptrend >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {format(startOfMonth(new Date()), "MMMM yyyy")}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}