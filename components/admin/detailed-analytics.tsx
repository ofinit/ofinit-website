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
import { 
  Users, Eye, Inbox, Globe, Share2, FileText, Activity, 
  Laptop, Smartphone, Tablet, ChevronRight, Compass,
  MapPin, ShieldAlert, Monitor, Sparkles, Loader2
} from "lucide-react"
import { fetchAnalyticsData } from "@/app/actions/analytics-actions"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#64748b"]

interface DetailedAnalyticsProps {
  data: {
    timeline: { date: string; views: number; conversions: number }[]
    locations: { name: string; value: number }[]
    referrers: { name: string; value: number }[]
    pages: { name: string; value: number }[]
    devices: { name: string; value: number }[]
    browsers: { name: string; value: number }[]
    osListBreakdown: { name: string; value: number }[]
    totalViews: number
    totalLeads: number
  }
  realtimeUsers: {
    timestamp: string
    url: string
    referrer: string
    ip: string
    city: string
    state: string
    country: string
    device: string
    browser: string
    os: string
  }[]
}

export function DetailedAnalytics({ data, realtimeUsers }: DetailedAnalyticsProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "realtime" | "audience" | "sources">("overview")
  const [timelineDays, setTimelineDays] = useState<7 | 30 | 90 | 180>(30)
  const [analyticsData, setAnalyticsData] = useState(data)
  const [isLoading, setIsLoading] = useState(false)
  const [showAllPages, setShowAllPages] = useState(false)
  const [showAllLocations, setShowAllLocations] = useState(false)

  const handleRangeChange = async (days: 7 | 30 | 90 | 180) => {
    setTimelineDays(days)
    setIsLoading(true)
    try {
      const newData = await fetchAnalyticsData(days)
      setAnalyticsData(newData)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  // Custom tooltips for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-md text-xs text-gray-800">
          <p className="font-bold border-b pb-1 mb-1 text-gray-900">{label}</p>
          {payload.map((p: any) => (
            <p key={p.name} className="flex justify-between gap-4 py-0.5">
              <span className="font-semibold" style={{ color: p.stroke || p.fill }}>{p.name}:</span>
              <span className="font-bold">{p.value}</span>
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Helper for device icons
  const getDeviceIcon = (deviceType: string) => {
    const type = (deviceType || "").toLowerCase()
    if (type === "mobile") return <Smartphone className="h-4 w-4 text-emerald-500" />
    if (type === "tablet") return <Tablet className="h-4 w-4 text-amber-500" />
    return <Laptop className="h-4 w-4 text-blue-500" />
  }

  // Format date helper
  const formatTimeAgo = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime()
      const diffSec = Math.floor(diffMs / 1000)
      if (diffSec < 60) return "Just now"
      const diffMin = Math.floor(diffSec / 60)
      if (diffMin < 60) return `${diffMin}m ago`
      return new Date(isoString).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    } catch {
      return "Recently"
    }
  }

  // Slice pages and locations list based on View More toggle state
  const displayedPages = showAllPages 
    ? analyticsData.pages.slice(0, 25) 
    : analyticsData.pages.slice(0, 5)

  const displayedLocations = showAllLocations 
    ? analyticsData.locations.slice(0, 25) 
    : analyticsData.locations.slice(0, 5)

  return (
    <div className="space-y-6">
      
      {/* Premium Tab Buttons */}
      <div className="flex flex-wrap items-center justify-between border-b border-gray-200 pb-2 gap-4">
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === "overview"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("realtime")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
              activeTab === "realtime"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-50"></span>
            </span>
            Real-Time ({realtimeUsers.length})
          </button>
          <button
            onClick={() => setActiveTab("audience")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === "audience"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Audience & Tech
          </button>
          <button
            onClick={() => setActiveTab("sources")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === "sources"
                ? "bg-white text-purple-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Pages & Sources
          </button>
        </div>

        {activeTab !== "realtime" && (
          <div className="flex items-center gap-2">
            {isLoading && <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              {[7, 30, 90, 180].map((days) => (
                <button
                  key={days}
                  onClick={() => handleRangeChange(days as 7 | 30 | 90 | 180)}
                  disabled={isLoading}
                  className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                    timelineDays === days 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-gray-500 hover:text-gray-900 disabled:opacity-50"
                  }`}
                >
                  {days}d
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* DASHBOARD GRID CONTAINER (FADES ON LOAD STATE) */}
      <div className={`transition-all duration-200 ${isLoading ? "opacity-60 pointer-events-none" : "opacity-100"}`}>
        
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Main Key Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Live Active */}
              <Card className="border border-emerald-100 bg-emerald-50/10 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Active Right Now</p>
                      <h3 className="text-4xl font-bold tracking-tight text-emerald-700 mt-2">{realtimeUsers.length}</h3>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <Activity className="h-5 w-5 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">Active users in the last 5 minutes.</p>
                </CardContent>
              </Card>

              {/* Total Pageviews */}
              <Card className="shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pageviews ({timelineDays}d)</p>
                      <h3 className="text-4xl font-bold tracking-tight text-gray-900 mt-2">
                        {analyticsData.timeline.reduce((acc, t) => acc + t.views, 0).toLocaleString()}
                      </h3>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Eye className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">Total volume of loaded pages.</p>
                </CardContent>
              </Card>

              {/* Total Conversions */}
              <Card className="shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Conversions ({timelineDays}d)</p>
                      <h3 className="text-4xl font-bold tracking-tight text-gray-900 mt-2">{analyticsData.totalLeads}</h3>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                      <Inbox className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">Form leads submitted by users.</p>
                </CardContent>
              </Card>

              {/* Conversion Rate */}
              <Card className="shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Conversion Rate</p>
                      <h3 className="text-4xl font-bold tracking-tight text-gray-900 mt-2">
                        {analyticsData.totalViews > 0 ? ((analyticsData.totalLeads / analyticsData.totalViews) * 100).toFixed(2) : "0.00"}%
                      </h3>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <Sparkles className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">Percentage of visits that convert.</p>
                </CardContent>
              </Card>
            </div>

            {/* Traffic Line Chart */}
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                <div>
                  <CardTitle className="text-lg font-bold">Traffic & Conversions Trend</CardTitle>
                  <CardDescription>Daily pageviews and lead form conversions ({timelineDays} days)</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData.timeline}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} tickLine={false} />
                      <YAxis yAxisId="left" stroke="#3b82f6" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="top" height={36} />
                      <Line yAxisId="left" type="monotone" dataKey="views" name="Pageviews" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 6 }} dot={{ r: 2 }} />
                      <Line yAxisId="right" type="monotone" dataKey="conversions" name="Conversions" stroke="#10b981" strokeWidth={2.5} dot={{ r: 1 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Bottom Overview Row (Popular Pages & Geographic Snapshot) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Top Pages */}
              <Card className="shadow-sm flex flex-col justify-between overflow-hidden">
                <div>
                  <CardHeader className="border-b">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" /> Popular Pages
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-100">
                      {displayedPages.map((page, index) => (
                        <div key={page.name} className="flex items-center justify-between p-4 hover:bg-gray-50/50">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-gray-400 w-4">{index + 1}</span>
                            <span className="text-sm font-medium text-gray-800 break-all">{page.name}</span>
                          </div>
                          <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded shrink-0 whitespace-nowrap ml-4">{page.value} views</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </div>
                {analyticsData.pages.length > 5 && (
                  <div className="p-4 bg-gray-50 border-t flex justify-center">
                    <button
                      onClick={() => setShowAllPages(!showAllPages)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                    >
                      {showAllPages ? "Show Less" : `View More (${analyticsData.pages.length - 5} more)`}
                    </button>
                  </div>
                )}
              </Card>

              {/* Geographic Breakdown */}
              <Card className="shadow-sm flex flex-col justify-between overflow-hidden">
                <div>
                  <CardHeader className="border-b">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Globe className="h-4 w-4 text-indigo-500" /> Geographic Audience
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-100">
                      {displayedLocations.map((loc, index) => (
                        <div key={loc.name} className="flex items-center justify-between p-4 hover:bg-gray-50/50">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-gray-400 w-4">{index + 1}</span>
                            <span className="text-sm font-medium text-gray-800">{loc.name}</span>
                          </div>
                          <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded shrink-0 whitespace-nowrap ml-4">{loc.value} visits</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </div>
                {analyticsData.locations.length > 5 && (
                  <div className="p-4 bg-gray-50 border-t flex justify-center">
                    <button
                      onClick={() => setShowAllLocations(!showAllLocations)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                    >
                      {showAllLocations ? "Show Less" : `View More (${analyticsData.locations.length - 5} more)`}
                    </button>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}

        {/* REAL-TIME TAB */}
        {activeTab === "realtime" && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            
            {/* Summary Banner */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-50"></span>
                  </span>
                  Real-Time Visitor Log
                </h2>
                <p className="text-sm text-emerald-700/80">
                  Displaying visitors and pages navigated in the last 5 minutes. Realtime data updates automatically.
                </p>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-emerald-100 flex items-baseline gap-2">
                <span className="text-sm text-gray-500 font-medium">Active Users</span>
                <span className="text-3xl font-extrabold text-emerald-600">{realtimeUsers.length}</span>
              </div>
            </div>

            {/* Real-time Users Table */}
            <Card className="shadow-sm overflow-hidden">
              <CardHeader className="border-b">
                <CardTitle className="text-base font-bold">Current Active Visitors</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
                        <th className="p-4">Visitor IP</th>
                        <th className="p-4">Location (City, State, Country)</th>
                        <th className="p-4">Device & Browser</th>
                        <th className="p-4">Operating System</th>
                        <th className="p-4">Active Page</th>
                        <th className="p-4">Referrer</th>
                        <th className="p-4 text-right">Last Ping</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {realtimeUsers.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-gray-500 font-medium">
                            No active visitors detected in the last 5 minutes.
                          </td>
                        </tr>
                      ) : (
                        realtimeUsers.map((user, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                            <td className="p-4 font-mono text-xs text-gray-600 font-semibold">{user.ip}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4.5 w-4.5 text-gray-400" />
                                <div>
                                  <span className="font-semibold text-gray-800">{user.city}</span>
                                  <span className="text-xs text-gray-500 block">
                                    {user.state ? `${user.state}, ` : ""}{user.country}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                {getDeviceIcon(user.device)}
                                <div>
                                  <span className="font-semibold text-gray-800">{user.browser}</span>
                                  <span className="text-xs text-gray-500 block capitalize">{user.device}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-gray-700 font-medium">
                              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-gray-100 text-xs font-semibold">
                                <Monitor className="h-3 w-3 text-gray-500" />
                                {user.os}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1">
                                <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded font-semibold break-all">
                                  {user.url}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded font-medium">
                                {user.referrer || "Direct"}
                              </span>
                            </td>
                            <td className="p-4 text-right text-xs font-semibold text-gray-600 whitespace-nowrap">
                              {formatTimeAgo(user.timestamp)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AUDIENCE TAB */}
        {activeTab === "audience" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in-50 duration-200">
            
            {/* Devices Pie Chart */}
            <Card className="shadow-sm flex flex-col justify-between">
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-base font-bold">Devices Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-2">
                <div className="h-60 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.devices}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {analyticsData.devices.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {analyticsData.devices.map((dev, index) => (
                    <div key={dev.name} className="flex items-center justify-between text-xs font-medium border-b pb-1.5 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-gray-700 capitalize">{dev.name}</span>
                      </div>
                      <span className="font-bold text-gray-900">{dev.value} views</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Browsers Chart */}
            <Card className="shadow-sm flex flex-col justify-between">
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-base font-bold">Browsers Usage</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-2">
                <div className="h-60 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.browsers}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {analyticsData.browsers.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {analyticsData.browsers.map((br, index) => (
                    <div key={br.name} className="flex items-center justify-between text-xs font-medium border-b pb-1.5 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[(index + 2) % COLORS.length] }} />
                        <span className="text-gray-700">{br.name}</span>
                      </div>
                      <span className="font-bold text-gray-900">{br.value} views</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* OS Chart */}
            <Card className="shadow-sm flex flex-col justify-between">
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-base font-bold">Operating Systems</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-2">
                <div className="h-60 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.osListBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {analyticsData.osListBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 4) % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {analyticsData.osListBreakdown.map((os, index) => (
                    <div key={os.name} className="flex items-center justify-between text-xs font-medium border-b pb-1.5 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[(index + 4) % COLORS.length] }} />
                        <span className="text-gray-700">{os.name}</span>
                      </div>
                      <span className="font-bold text-gray-900">{os.value} views</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* PAGES & SOURCES TAB */}
        {activeTab === "sources" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in-50 duration-200">
            
            {/* Detailed Pages Table */}
            <Card className="shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" /> Detailed Pageview Logs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[500px] overflow-y-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium sticky top-0">
                        <th className="p-4">Rank</th>
                        <th className="p-4">Page Path</th>
                        <th className="p-4 text-right">Hits</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {analyticsData.pages.map((page, index) => (
                        <tr key={page.name} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4 text-gray-400 font-bold w-12">{index + 1}</td>
                          <td className="p-4 font-mono text-xs text-gray-700 break-all">{page.name}</td>
                          <td className="p-4 text-right font-bold text-gray-900">{page.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Referring Sources Table */}
            <Card className="shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-indigo-500" /> Referral Traffic Sources
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[500px] overflow-y-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium sticky top-0">
                        <th className="p-4">Rank</th>
                        <th className="p-4">Source</th>
                        <th className="p-4 text-right">Referral Visits</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {analyticsData.referrers.map((ref, index) => (
                        <tr key={ref.name} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4 text-gray-400 font-bold w-12">{index + 1}</td>
                          <td className="p-4 text-gray-700 font-medium">{ref.name}</td>
                          <td className="p-4 text-right font-bold text-gray-900">{ref.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
