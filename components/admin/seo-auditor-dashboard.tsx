"use client"

import { useState, useTransition } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { 
  Sparkles, CheckCircle2, AlertCircle, HelpCircle, 
  Search, ShieldCheck, ShieldAlert, KeyRound, Globe, 
  ArrowUpDown, TrendingUp, RefreshCw, Pencil, ExternalLink,
  ChevronRight, AlertTriangle, Download, Brain, Loader2
} from "lucide-react"
import Link from "next/link"
import { 
  saveGoogleGscConfig, 
  disconnectGoogleGsc, 
  SeoPageReport, 
  GscKeywordRank,
  saveGeminiConfig,
  disconnectGemini,
  generateAiSeoFix,
  applyAiSeoFix
} from "@/app/actions/seo-auditor-actions"
import { toast } from "sonner"

interface SeoAuditorDashboardProps {
  initialPages: SeoPageReport[]
  initialRankings: GscKeywordRank[]
  initialGscConfig: { hasCredentials: boolean; propertyUrl: string; clientEmail?: string }
  initialConnected: boolean
  initialError?: string
  initialGeminiConfig: { hasGeminiKey: boolean }
}

export function SeoAuditorDashboard({
  initialPages,
  initialRankings,
  initialGscConfig,
  initialConnected,
  initialError,
  initialGeminiConfig
}: SeoAuditorDashboardProps) {
  const [activeTab, setActiveTab] = useState<"audit" | "rankings" | "setup">("audit")
  const [searchQuery, setSearchQuery] = useState("")
  const [pages, setPages] = useState<SeoPageReport[]>(initialPages)
  const [rankings, setRankings] = useState<GscKeywordRank[]>(initialRankings)
  const [gscConfig, setGscConfig] = useState(initialGscConfig)
  const [connected, setConnected] = useState(initialConnected)
  const [error, setError] = useState<string | undefined>(initialError)
  
  const [geminiConfig, setGeminiConfig] = useState(initialGeminiConfig)
  const [geminiApiKeyInput, setGeminiApiKeyInput] = useState("")
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const [aiFixSuggestions, setAiFixSuggestions] = useState<{
    optimizedTitle: string
    optimizedDescription: string
    optimizedKeywords: string[]
    aiExplanation: string
  } | null>(null)
  const [isAiPending, setIsAiPending] = useState(false)
  const [aiError, setAiError] = useState("")
  
  const [jsonKey, setJsonKey] = useState("")
  const [propertyUrl, setPropertyUrl] = useState(initialGscConfig.propertyUrl)
  const [isPending, startTransition] = useTransition()
  
  // Selected page for SEO Audit details dialog
  const [selectedPage, setSelectedPage] = useState<SeoPageReport | null>(null)
  
  // Sort state
  const [sortField, setSortField] = useState<"url" | "score">("score")
  const [sortAsc, setSortAsc] = useState(false)

  const handleSaveConfig = () => {
    if (!jsonKey.trim()) {
      toast.error("Please paste your Google Service Account JSON key.")
      return
    }
    if (!propertyUrl.trim()) {
      toast.error("Please specify your Google Search Console Property URL.")
      return
    }

    startTransition(async () => {
      const res = await saveGoogleGscConfig(jsonKey, propertyUrl)
      if (res.ok) {
        toast.success("Google Search Console settings saved successfully!")
        setConnected(true)
        setGscConfig({ hasCredentials: true, propertyUrl })
        setJsonKey("")
        // Trigger page refresh to reload live rankings
        window.location.reload()
      } else {
        toast.error(res.error || "Failed to save configurations.")
      }
    })
  }

  const handleDisconnect = () => {
    if (!confirm("Are you sure you want to disconnect Google Search Console?")) return

    startTransition(async () => {
      const res = await disconnectGoogleGsc()
      if (res.ok) {
        toast.success("Disconnected from Google Search Console.")
        setConnected(false)
        setGscConfig({ hasCredentials: false, propertyUrl: "https://ofinit.com" })
        setPropertyUrl("https://ofinit.com")
        // Trigger page refresh to load simulated rankings
        window.location.reload()
      } else {
        toast.error(res.error || "Failed to disconnect.")
      }
    })
  }

  const handleSaveGeminiKey = () => {
    if (!geminiApiKeyInput.trim()) {
      toast.error("Please enter a valid Gemini API Key.")
      return
    }

    startTransition(async () => {
      const res = await saveGeminiConfig(geminiApiKeyInput)
      if (res.ok) {
        toast.success("Gemini API Key saved successfully!")
        setGeminiConfig({ hasGeminiKey: true })
        setGeminiApiKeyInput("")
      } else {
        toast.error(res.error || "Failed to save Gemini Key.")
      }
    })
  }

  const handleDisconnectGemini = () => {
    if (!confirm("Are you sure you want to disconnect the Gemini API key?")) return

    startTransition(async () => {
      const res = await disconnectGemini()
      if (res.ok) {
        toast.success("Gemini API key disconnected.")
        setGeminiConfig({ hasGeminiKey: false })
      } else {
        toast.error(res.error || "Failed to disconnect Gemini.")
      }
    })
  }

  const handleExportMd = () => {
    let md = `# OfinIT SEO Audit & Rankings Report\n`
    md += `Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n\n`
    
    md += `## Executive Summary\n`
    md += `- **Average SEO Score**: ${averageScore}%\n`
    md += `- **Optimized Pages**: ${fullyOptimized} of ${pages.length}\n`
    md += `- **Tracked Keyword Queries**: ${totalKeywords}\n`
    md += `- **Average Google Search Rank**: #${avgPosition}\n`
    md += `- **Google Search Console Status**: ${connected ? "Connected (Live data)" : "Simulated Mode"}\n\n`
    
    md += `## On-Page SEO Pages Index\n\n`
    md += `| Page Path | Type | SEO Score | Word Count | H1 Count | Alt Tags | Target Keywords |\n`
    md += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`
    pages.forEach(p => {
      md += `| \`${p.url}\` | ${p.type} | **${p.seoScore}/100** | ${p.wordCount} | ${p.h1Count} | ${p.hasAltTags ? "Yes" : "Missing"} | ${p.keywords.join(", ") || "-"} |\n`
    })
    md += `\n`
    
    md += `## Keyword Rankings (Google Search Console)\n\n`
    md += `| Keyword Query | Search Position | Clicks (30d) | Impressions | CTR | Mapped URL |\n`
    md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`
    rankings.forEach(r => {
      md += `| **${r.keyword}** | #${r.position} | ${r.clicks} | ${r.impressions} | ${r.ctr}% | \`${r.pageUrl}\` |\n`
    })
    md += `\n`
    
    md += `## Detailed Page Audit Suggestion Checklists\n\n`
    pages.forEach(p => {
      md += `### URL: \`${p.url}\` (${p.type}) — Score: ${p.seoScore}/100\n`
      md += `- **Meta Title**: "${p.title || ""}"\n`
      md += `- **Meta Description**: "${p.description || ""}"\n`
      md += `- **Word Count**: ${p.wordCount} words\n`
      md += `- **Audits Checklist**:\n`
      p.checklist.forEach(item => {
        md += `  - [${item.passed ? "x" : " "}] **${item.label}** (${item.impact} impact): ${item.message}\n`
      })
      md += `\n`
    })
    
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `ofinit-seo-audit-report.md`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("AI-readable SEO report exported as .md successfully!")
  }

  const handleTriggerAiFix = (page: SeoPageReport) => {
    if (!geminiConfig.hasGeminiKey) {
      toast.error("Gemini API key is not configured. Go to 'Console & AI Settings' to connect.")
      return
    }

    setAiError("")
    setIsAiPending(true)
    setIsAiModalOpen(true)
    setAiFixSuggestions(null)

    // Trigger Server Action to fetch optimized metadata
    generateAiSeoFix(page.url, page.type)
      .then((res) => {
        if (res.ok) {
          setAiFixSuggestions(res.suggestions)
        } else {
          setAiError(res.error || "Failed to query Gemini API suggestion.")
        }
      })
      .catch((err) => {
        setAiError(err.message || "An unexpected error occurred.")
      })
      .finally(() => {
        setIsAiPending(false)
      })
  }

  const handleApplyAiFix = (page: SeoPageReport) => {
    if (!aiFixSuggestions) return

    setIsAiPending(true)
    applyAiSeoFix(
      page.url,
      page.type,
      aiFixSuggestions.optimizedTitle,
      aiFixSuggestions.optimizedDescription,
      aiFixSuggestions.optimizedKeywords
    )
      .then((res) => {
        if (res.ok) {
          toast.success("Optimized metadata successfully applied and saved!")
          setIsAiModalOpen(false)
          setSelectedPage(null)
          // Reload page to reflect newly updated metadata
          window.location.reload()
        } else {
          toast.error(res.error || "Failed to save suggested changes.")
        }
      })
      .catch((err) => {
        toast.error(err.message || "Could not apply optimization.")
      })
      .finally(() => {
        setIsAiPending(false)
      })
  }

  // Filter & sort pages
  const filteredPages = pages
    .filter((p) => {
      const query = searchQuery.toLowerCase()
      return (
        p.url.toLowerCase().includes(query) ||
        p.type.toLowerCase().includes(query) ||
        p.title.toLowerCase().includes(query) ||
        p.keywords.some((k) => k.toLowerCase().includes(query))
      )
    })
    .sort((a, b) => {
      if (sortField === "url") {
        return sortAsc ? a.url.localeCompare(b.url) : b.url.localeCompare(a.url)
      } else {
        return sortAsc ? a.seoScore - b.seoScore : b.seoScore - a.seoScore
      }
    })

  // Get edit URL helper
  const getEditUrl = (page: SeoPageReport) => {
    switch (page.type) {
      case "Home":
        return "/admin/settings"
      case "Blog":
        return "/admin/blogs"
      case "Service":
        return "/admin/services"
      case "Legal":
        return `/admin/pages/edit/${page.url.replace("/", "")}`
      case "Location":
        return "/admin/locations"
      default:
        return "/admin"
    }
  }

  // Aggregate stats
  const averageScore = Math.round(pages.reduce((acc, p) => acc + p.seoScore, 0) / (pages.length || 1))
  const fullyOptimized = pages.filter((p) => p.seoScore >= 80).length
  const totalKeywords = rankings.length
  const avgPosition = parseFloat((rankings.reduce((acc, r) => acc + r.position, 0) / (rankings.length || 1)).toFixed(1))

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
            SEO Auditor & Rankings
          </h1>
          <p className="text-gray-600 mt-2">
            Audit on-page SEO scores and monitor Google search engine keyword ranking positions.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {connected ? (
            <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 flex items-center gap-1.5 hover:bg-emerald-100 rounded-md">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              GSC Live Connected
            </Badge>
          ) : gscConfig.hasCredentials ? (
            <Badge className="bg-red-100 text-red-800 border border-red-200 px-3 py-1 flex items-center gap-1.5 hover:bg-red-100 rounded-md">
              <ShieldAlert className="w-4 h-4 text-red-600 animate-pulse" />
              Connection Failed
            </Badge>
          ) : (
            <Badge className="bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 flex items-center gap-1.5 hover:bg-amber-100 rounded-md">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Simulated Mode
            </Badge>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportMd}
            className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800"
          >
            <Download className="w-3.5 h-3.5" />
            Export AI Report (.md)
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Average SEO Score */}
        <Card className="shadow-sm border border-slate-100 bg-white hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg SEO Score</p>
                <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight mt-2">{averageScore}%</h3>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                averageScore >= 80 ? "bg-emerald-500" : averageScore >= 50 ? "bg-amber-500" : "bg-red-500"
              }`}>
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={averageScore} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Fully Optimized Pages */}
        <Card className="shadow-sm border border-slate-100 bg-white hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pages Optimized</p>
                <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight mt-2">
                  {fullyOptimized} <span className="text-sm font-normal text-gray-500">/ {pages.length}</span>
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Pages scoring 80% or higher in on-page audit.</p>
          </CardContent>
        </Card>

        {/* Tracked Keywords */}
        <Card className="shadow-sm border border-slate-100 bg-white hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tracked Keywords</p>
                <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight mt-2">{totalKeywords}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Unique search queries sending search traffic.</p>
          </CardContent>
        </Card>

        {/* Avg Search Position */}
        <Card className="shadow-sm border border-slate-100 bg-white hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg Google Position</p>
                <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight mt-2">#{avgPosition}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Average ranking index across search terms.</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-gray-200 gap-1 bg-gray-100/50 p-1 rounded-lg max-w-md">
        <button
          onClick={() => setActiveTab("audit")}
          className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-all ${
            activeTab === "audit"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50"
          }`}
        >
          On-Page Audit
        </button>
        <button
          onClick={() => setActiveTab("rankings")}
          className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-all ${
            activeTab === "rankings"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50"
          }`}
        >
          Keyword Rankings
        </button>
        <button
          onClick={() => setActiveTab("setup")}
          className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-all ${
            activeTab === "setup"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50"
          }`}
        >
          Console & AI Settings
        </button>
      </div>

      {/* TABS CONTENT */}

      {/* 1. ON-PAGE SEO AUDIT TAB */}
      {activeTab === "audit" && (
        <Card className="shadow-sm">
          <CardHeader className="border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 px-6">
            <div>
              <CardTitle className="text-lg font-bold">On-Page SEO Index</CardTitle>
              <CardDescription>Review titles, descriptions, heading structure, and image alt tags.</CardDescription>
            </div>
            
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search page URL or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/70 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 cursor-pointer" onClick={() => { setSortField("url"); setSortAsc(!sortAsc) }}>
                      <div className="flex items-center gap-1 hover:text-gray-800">
                        Page Path & Title <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3 cursor-pointer" onClick={() => { setSortField("score"); setSortAsc(!sortAsc) }}>
                      <div className="flex items-center gap-1 hover:text-gray-800">
                        SEO Score <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3">Words</th>
                    <th className="px-6 py-3">H1s</th>
                    <th className="px-6 py-3">Keywords</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredPages.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                        No pages match your filter query.
                      </td>
                    </tr>
                  ) : null}
                  {filteredPages.map((page) => {
                    const score = page.seoScore
                    return (
                      <tr key={page.url} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900 line-clamp-1">{page.title}</div>
                          <div className="text-xs text-gray-500 font-mono mt-0.5 flex items-center gap-1">
                            <span className="break-all">{page.url}</span>
                            <a href={page.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-600 inline-block shrink-0">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="capitalize text-xs">
                            {page.type}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold px-2 py-0.5 rounded text-xs text-white ${
                              score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-red-500"
                            }`}>
                              {score}/100
                            </span>
                            <Progress value={score} className="w-16 h-1.5 hidden sm:block" />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{page.wordCount}</td>
                        <td className="px-6 py-4">
                          <span className={`font-medium ${page.h1Count !== 1 ? "text-amber-600 font-bold" : "text-gray-700"}`}>
                            {page.h1Count}
                          </span>
                        </td>
                        <td className="px-6 py-4 max-w-[200px] truncate text-gray-500">
                          {page.keywords.join(", ") || "-"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedPage(page)}
                              className="text-xs h-8"
                            >
                              Audit Details
                            </Button>
                            <Link href={getEditUrl(page)}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                title="Edit page content & metadata"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 2. KEYWORD RANKINGS TAB */}
      {activeTab === "rankings" && (
        <Card className="shadow-sm">
          <CardHeader className="border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 px-6">
            <div>
              <CardTitle className="text-lg font-bold">Search Engine Keyword Performance</CardTitle>
              <CardDescription>
                Track query search positions, clicks, impressions, and Click-Through Rates (CTR).
              </CardDescription>
            </div>
            
            {!connected && (
              <Badge className="bg-amber-500/10 text-amber-700 border border-amber-200/50 text-xs shrink-0 self-start md:self-auto max-w-sm flex gap-1.5 rounded-md px-2 py-1 items-start">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Google Search Console is not connected. Displaying local estimates.</span>
              </Badge>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/70 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Keyword Query</th>
                    <th className="px-6 py-3">Mapped URL</th>
                    <th className="px-6 py-3">Search Position</th>
                    <th className="px-6 py-3">Clicks (30d)</th>
                    <th className="px-6 py-3">Impressions</th>
                    <th className="px-6 py-3">CTR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {rankings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                        No keyword rankings found. Ensure Google Search Console matches your URLs.
                      </td>
                    </tr>
                  ) : null}
                  {rankings.map((rank) => (
                    <tr key={rank.keyword} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-semibold text-gray-900">{rank.keyword}</td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">
                        <Link href={rank.pageUrl} className="hover:underline flex items-center gap-1 text-blue-600">
                          {rank.pageUrl}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center justify-center font-bold px-2 py-0.5 rounded text-xs ${
                            rank.position <= 3
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : rank.position <= 10
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            Position #{rank.position}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{rank.clicks}</td>
                      <td className="px-6 py-4 text-gray-600">{rank.impressions}</td>
                      <td className="px-6 py-4 text-gray-700 font-medium">{rank.ctr}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3. GOOGLE SEARCH CONSOLE SETUP TAB */}
      {activeTab === "setup" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Connection status and form */}
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Google Search Console Integration</CardTitle>
              <CardDescription>
                Connect search statistics directly inside your admin panel using a Google Service Account JSON key.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {connected ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-emerald-900 text-base">Search Console Verified</h3>
                      <p className="text-sm text-emerald-700 mt-1">
                        Your admin panel is connected and fetching live keyword ranking positions for:
                      </p>
                      <p className="text-sm font-semibold text-emerald-950 mt-1 font-mono break-all">
                        {gscConfig.propertyUrl}
                      </p>
                      {gscConfig.clientEmail && (
                        <p className="text-xs text-emerald-800 mt-1">
                          Connected via: <code className="bg-emerald-100 px-1 rounded">{gscConfig.clientEmail}</code>
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <Button
                      variant="outline"
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-100 bg-transparent flex items-center gap-1.5"
                      onClick={handleDisconnect}
                      disabled={isPending}
                    >
                      Disconnect Search Console
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {gscConfig.hasCredentials && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-red-100 rounded-full text-red-600">
                          <ShieldAlert className="w-6 h-6 animate-pulse" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-red-950 text-base">GSC Connection Failed</h3>
                          <p className="text-sm text-red-800">
                            Credentials are saved for: <code className="bg-red-100 px-1 py-0.5 rounded font-bold text-red-950">{gscConfig.clientEmail}</code> but the API connection failed.
                          </p>
                          {error && (
                            <div className="text-xs font-mono bg-red-100/50 text-red-900 p-3 border border-red-200 rounded mt-3 whitespace-pre-wrap max-h-36 overflow-y-auto">
                              {error}
                            </div>
                          )}
                          <p className="text-xs text-red-700 mt-3 pt-1">
                            <strong>Troubleshooting:</strong> Please ensure that this service account email has been added with <strong>Viewer</strong> (or Owner/Full) permission to the property <code>{propertyUrl}</code> inside the official Google Search Console dashboard.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-2">
                        <Button
                          variant="outline"
                          className="border-red-200 text-red-700 hover:bg-red-100 bg-transparent flex items-center gap-1.5 text-xs h-8"
                          onClick={handleDisconnect}
                          disabled={isPending}
                        >
                          Clear Stored Credentials
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-semibold text-gray-800">
                      {gscConfig.hasCredentials ? "Update / Overwrite Stored Key" : "Connection Credentials Setup"}
                    </h3>
                    
                    <div>
                      <Label htmlFor="propertyUrl">Search Console Property URL</Label>
                      <Input
                        id="propertyUrl"
                        placeholder="https://ofinit.com"
                        value={propertyUrl}
                        onChange={(e) => setPropertyUrl(e.target.value)}
                        className="mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Must match the site prefix URL (e.g. <code>https://ofinit.com</code>) or the domain property set in Google Search Console.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="jsonKey">Google Service Account JSON Key</Label>
                      <Textarea
                        id="jsonKey"
                        placeholder={
                          gscConfig.hasCredentials
                            ? `Credentials are already saved for ${gscConfig.clientEmail}. Paste a new JSON key here to overwrite it.`
                            : '{ "type": "service_account", "project_id": "...", "private_key_id": "...", "private_key": "...", "client_email": "...", ... }'
                        }
                        value={jsonKey}
                        onChange={(e) => setJsonKey(e.target.value)}
                        rows={6}
                        className="font-mono text-xs mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Paste the entire contents of the Service Account credentials key file you downloaded from Google Cloud.
                      </p>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        onClick={handleSaveConfig}
                        disabled={isPending}
                        className="flex items-center gap-1.5 text-xs"
                      >
                        {isPending ? "Connecting..." : gscConfig.hasCredentials ? "Update Credentials" : "Connect Search Console"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gemini AI Assistant card */}
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-600" />
                Gemini AI Optimizer Integration
              </CardTitle>
              <CardDescription>
                Provide a Gemini API Key to enable automated SEO metadata optimization suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {geminiConfig.hasGeminiKey ? (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
                      <Brain className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-indigo-900 text-base">Gemini AI Key Stored</h3>
                      <p className="text-sm text-indigo-700 mt-1">
                        Your Gemini API is configured. You can now use the **Fix with AI** button inside any page's audit card.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <Button
                      variant="outline"
                      className="border-indigo-200 text-indigo-700 hover:bg-indigo-100 bg-transparent flex items-center gap-1.5 text-xs h-8"
                      onClick={handleDisconnectGemini}
                      disabled={isPending}
                    >
                      Disconnect Gemini key
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="geminiApiKey">Gemini API Key</Label>
                    <Input
                      id="geminiApiKey"
                      type="password"
                      placeholder="AIzaSy..."
                      value={geminiApiKeyInput}
                      onChange={(e) => setGeminiApiKeyInput(e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Create an API key in the Google AI Studio to unlock automated SEO fixes.
                    </p>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={handleSaveGeminiKey}
                      disabled={isPending}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      {isPending ? "Saving..." : "Save Gemini Key"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick guide card */}
          <Card className="shadow-sm bg-slate-50 border-slate-100 flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-blue-600" />
                Connection Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-gray-600 flex-1">
              <p>
                To view live keywords and organic impressions directly in this admin panel, you must verify the site via a Google service account:
              </p>
              
              <ol className="list-decimal pl-4 space-y-2.5">
                <li>
                  Go to the <strong>Google Cloud Console</strong> and create a project.
                </li>
                <li>
                  Enable the <strong>Google Search Console API</strong> for your project.
                </li>
                <li>
                  Navigate to <strong>IAM &amp; Admin &gt; Service Accounts</strong>, create a service account, and create a new <strong>JSON Key</strong>. Download it.
                </li>
                <li>
                  Copy the service account email (e.g. <code>my-service-account@my-project.iam.gserviceaccount.com</code>).
                </li>
                <li>
                  Go to your official <strong>Google Search Console</strong> account, select the property, navigate to <strong>Settings &gt; Users and Permissions</strong>, and add the service account email as a user with <strong>Viewer</strong> access.
                </li>
                <li>
                  Paste the contents of the downloaded JSON Key into the textarea on the left.
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      )}

      {/* DETAILED AUDIT CHECKLIST MODAL */}
      <Dialog open={selectedPage !== null} onOpenChange={(open) => { if (!open) setSelectedPage(null) }}>
        <DialogContent className="max-w-xl">
          {selectedPage && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                  On-Page SEO Report
                  <Badge className={`text-xs text-white ${
                    selectedPage.seoScore >= 80 ? "bg-emerald-500" : selectedPage.seoScore >= 50 ? "bg-amber-500" : "bg-red-500"
                  }`}>
                    {selectedPage.seoScore}/100 Score
                  </Badge>
                </DialogTitle>
                <DialogDescription className="font-mono text-xs text-gray-500 break-all mt-1">
                  {selectedPage.url}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 my-2">
                <div className="grid grid-cols-3 gap-3 border-y py-3 text-center bg-gray-50/50 rounded-lg">
                  <div>
                    <div className="text-xs text-gray-500 font-semibold uppercase">Words count</div>
                    <div className="text-lg font-bold text-gray-900 mt-1">{selectedPage.wordCount}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-semibold uppercase">H1 headings</div>
                    <div className="text-lg font-bold text-gray-900 mt-1">{selectedPage.h1Count}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-semibold uppercase">Alt attributes</div>
                    <div className="text-lg font-bold mt-1 text-gray-900">{selectedPage.hasAltTags ? "Passed" : "Missing"}</div>
                  </div>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  <h4 className="font-semibold text-sm text-gray-900">Audit Checklist</h4>
                  
                  {selectedPage.checklist.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 items-start p-3 rounded-lg border text-sm ${
                        item.passed
                          ? "bg-emerald-50/30 border-emerald-100 text-emerald-950"
                          : item.impact === "high"
                          ? "bg-red-50/30 border-red-100 text-red-950"
                          : "bg-amber-50/30 border-amber-100 text-amber-950"
                      }`}
                    >
                      {item.passed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${
                          item.impact === "high" ? "text-red-600" : "text-amber-500"
                        }`} />
                      )}
                      
                      <div>
                        <div className="font-semibold flex items-center gap-1.5">
                          {item.label}
                          {!item.passed && (
                            <Badge variant="outline" className={`text-[10px] capitalize leading-none px-1.5 py-0.2 shrink-0 ${
                              item.impact === "high" ? "border-red-200 text-red-700 bg-red-50/50" : "border-amber-200 text-amber-700 bg-amber-50/50"
                            }`}>
                              {item.impact} impact
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{item.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                {selectedPage.type !== "Location" && (
                  <Button
                    size="sm"
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5"
                    onClick={() => handleTriggerAiFix(selectedPage)}
                  >
                    <Brain className="w-4 h-4" />
                    Fix with AI
                  </Button>
                )}
                
                <Link href={getEditUrl(selectedPage)}>
                  <Button size="sm" className="w-full sm:w-auto" onClick={() => setSelectedPage(null)}>
                    <Pencil className="w-4 h-4 mr-1.5" />
                    Edit Content
                  </Button>
                </Link>
                
                <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => setSelectedPage(null)}>
                  Close Report
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* AI SEO METADATA OPTIMIZER MODAL */}
      <Dialog open={isAiModalOpen} onOpenChange={(open) => { if (!open) setIsAiModalOpen(false) }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Brain className="w-6 h-6 text-indigo-600 animate-pulse" />
              Gemini AI SEO Metadata Fixer
            </DialogTitle>
            <DialogDescription className="font-mono text-xs text-gray-500 break-all mt-1">
              Optimizing URL: {selectedPage?.url}
            </DialogDescription>
          </DialogHeader>

          {isAiPending && !aiFixSuggestions ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              <p className="text-sm font-semibold text-gray-600 animate-pulse">
                Analyzing page content and optimizing metadata via Gemini AI...
              </p>
            </div>
          ) : aiError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 space-y-4 my-2">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-950 text-sm">AI Optimization Failed</h3>
                  <p className="text-xs text-red-800 mt-1 whitespace-pre-wrap">
                    {aiError === "api_key_missing" 
                      ? "Your Gemini API Key is missing. Please add a valid API key in the 'Console & AI Settings' tab first." 
                      : aiError}
                  </p>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button variant="outline" size="sm" onClick={() => setIsAiModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          ) : aiFixSuggestions ? (
            <div className="space-y-6 my-2">
              
              {/* Explanation Box */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-sm text-indigo-950">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-indigo-900">
                  <Sparkles className="w-4 h-4" />
                  AI Optimization Rationale
                </div>
                <p className="text-xs text-indigo-800 leading-relaxed">
                  {aiFixSuggestions.aiExplanation}
                </p>
              </div>

              {/* Side-by-side comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Current Cards */}
                <Card className="border border-slate-100 bg-slate-50/50 shadow-none">
                  <CardHeader className="py-3 px-4 border-b">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-gray-500">Current Metadata</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3.5 text-xs">
                    <div>
                      <div className="font-bold text-gray-700">Meta Title</div>
                      <div className="text-gray-900 font-medium mt-1 bg-white p-2 rounded border">{selectedPage?.title}</div>
                      <span className="text-[10px] text-gray-400 mt-1 block">{(selectedPage?.title || "").length} characters</span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-700">Meta Description</div>
                      <div className="text-gray-900 font-medium mt-1 bg-white p-2 rounded border line-clamp-4">{selectedPage?.description || "-"}</div>
                      <span className="text-[10px] text-gray-400 mt-1 block">{(selectedPage?.description || "").length} characters</span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-700">Meta Keywords</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedPage?.keywords.map(k => (
                          <Badge key={k} variant="outline" className="text-[10px]">{k}</Badge>
                        )) || "-"}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI suggested card */}
                <Card className="border border-emerald-100 bg-emerald-50/10 shadow-none">
                  <CardHeader className="py-3 px-4 border-b border-emerald-100">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-700">AI Suggested Fix</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3.5 text-xs">
                    <div>
                      <div className="font-bold text-emerald-800">Meta Title</div>
                      <div className="text-emerald-950 font-semibold mt-1 bg-white p-2 rounded border border-emerald-200">{aiFixSuggestions.optimizedTitle}</div>
                      <span className="text-[10px] text-emerald-600 mt-1 block">{aiFixSuggestions.optimizedTitle.length} characters</span>
                    </div>
                    <div>
                      <div className="font-bold text-emerald-800">Meta Description</div>
                      <div className="text-emerald-950 font-semibold mt-1 bg-white p-2 rounded border border-emerald-200 line-clamp-4">{aiFixSuggestions.optimizedDescription}</div>
                      <span className="text-[10px] text-emerald-600 mt-1 block">{aiFixSuggestions.optimizedDescription.length} characters</span>
                    </div>
                    <div>
                      <div className="font-bold text-emerald-800">Meta Keywords</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {aiFixSuggestions.optimizedKeywords.map(k => (
                          <Badge key={k} className="bg-emerald-100 text-emerald-800 text-[10px] hover:bg-emerald-100">{k}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>

              <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t">
                <Button
                  size="sm"
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
                  onClick={() => selectedPage && handleApplyAiFix(selectedPage)}
                  disabled={isAiPending}
                >
                  {isAiPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Apply AI Fixes
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => setIsAiModalOpen(false)}
                  disabled={isAiPending}
                >
                  Cancel
                </Button>
              </DialogFooter>

            </div>
          ) : null}
        </DialogContent>
      </Dialog>

    </div>
  )
}
