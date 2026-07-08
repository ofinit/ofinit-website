"use client"

import { useState } from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Users, Eye, Inbox, Globe, Share2, FileText, Activity } from "lucide-react"

// Theme colors
const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#64748b"]

interface AnalyticsChartsProps {
  data: {
    timeline: { date: string; views: number; conversions: number }[]
    locations: { name: string; value: number }[]
    referrers: { name: string; value: number }[]
    pages: { name: string; value: number }[]
    totalViews: number
    totalLeads: number
  }
  activeUsers: number
}

export function AnalyticsCharts({ data, activeUsers }: AnalyticsChartsProps) {
  const [activeTab, setActiveTab] = useState<"traffic" | "regions" | "referrers">("traffic")

  // Simple custom tooltip for recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-md text-xs">
          <p className="font-bold border-b pb-1 mb-1">{label}</p>
          {payload.map((p: any) => (
            <p key={p.name} style={{ color: p.stroke || p.fill }}>
              <span className="font-semibold">{p.name}:</span> {p.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      
      {/* Real-time Indicator and High-Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Real-Time Active Users Widget */}
        <Card className="border border-primary/20 bg-primary/[0.02] relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 h-24 w-24 bg-primary/5 blur-2xl pointer-events-none rounded-full" />
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Active Users Right Now</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-extrabold tracking-tight text-primary animate-pulse">{activeUsers}</h3>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-emerald-600 rounded-full animate-ping" />
                    Live
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Activity className="h-6 w-6" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Unique visits and interaction pings logged in the last 5 minutes.
            </p>
          </CardContent>
        </Card>

        {/* Total Pageviews */}
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total Pageviews (30d)</p>
                <h3 className="text-3xl font-bold tracking-tight text-foreground">{data.totalViews.toLocaleString()}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Eye className="h-6 w-6" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Avg. of {Math.floor(data.totalViews / 30)} daily hits across dynamic routes.
            </p>
          </CardContent>
        </Card>

        {/* Total Leads (30d) */}
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total Leads (30d)</p>
                <h3 className="text-3xl font-bold tracking-tight text-foreground">{data.totalLeads.toLocaleString()}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Inbox className="h-6 w-6" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Conversion rate: {((data.totalLeads / data.totalViews) * 100).toFixed(2)}% of total hits.
            </p>
          </CardContent>
        </Card>

      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Analytics Interactive Chart Panel */}
        <Card className="lg:col-span-2 shadow-sm flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
            <div>
              <CardTitle className="text-lg font-bold">Analytics Trends</CardTitle>
              <CardDescription className="text-xs mt-1">Daily overview of organic hits and conversions.</CardDescription>
            </div>
            <div className="flex bg-muted p-1 rounded-lg text-xs gap-1">
              <button
                onClick={() => setActiveTab("traffic")}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeTab === "traffic" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Traffic Trends
              </button>
              <button
                onClick={() => setActiveTab("regions")}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeTab === "regions" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Regions
              </button>
              <button
                onClick={() => setActiveTab("referrers")}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeTab === "referrers" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Referrers
              </button>
            </div>
          </CardHeader>

          <CardContent className="pt-6 h-[320px]">
            {activeTab === "traffic" && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.timeline} margin={{ left: -10, right: 10, top: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="views"
                    name="Pageviews"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="conversions"
                    name="Leads Created"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}

            {activeTab === "regions" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.locations.slice(0, 6)} layout="vertical" margin={{ left: 15, right: 10, top: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={80} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Pageviews" radius={[0, 4, 4, 0]}>
                    {data.locations.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}

            {activeTab === "referrers" && (
              <div className="flex flex-col md:flex-row h-full items-center justify-around">
                <div className="w-[180px] h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.referrers}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                      >
                        {data.referrers.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1.5 text-xs">
                  {data.referrers.map((ref, index) => (
                    <div key={ref.name} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="font-semibold text-gray-900">{ref.name}:</span>
                      <span className="text-muted-foreground">{ref.value.toLocaleString()} ({((ref.value / data.totalViews) * 100).toFixed(1)}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Popular Pages Sidebar Table */}
        <Card className="shadow-sm">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-lg font-bold">Top Content Paths</CardTitle>
            <CardDescription className="text-xs">Most viewed routes on your platform.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 text-xs">
              {data.pages.slice(0, 6).map((page, idx) => (
                <div key={page.name} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/50">
                  <div className="min-w-0 pr-4">
                    <span className="font-mono text-gray-600 block truncate" title={page.name}>
                      {page.name}
                    </span>
                  </div>
                  <span className="font-bold text-gray-900 shrink-0 bg-gray-100 px-2 py-0.5 rounded-md">
                    {page.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
