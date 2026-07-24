import { NextRequest, NextResponse } from "next/server"
import { getSeoPagesList, generateAiSeoFix, applyAiSeoFix } from "@/app/actions/seo-auditor-actions"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  // 1. Authenticate Request using Authorization: Bearer <CRON_SECRET>
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    return NextResponse.json(
      { error: "CRON_SECRET environment variable is not configured on the server." },
      { status: 500 }
    )
  }

  if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: "Unauthorized access. Invalid or missing authorization header." },
      { status: 401 }
    )
  }

  try {
    console.log("[SEO Autopilot Cron] Starting 24/7 autonomous SEO audit execution...")
    
    // 2. Fetch all pages and their SEO scores
    const pages = await getSeoPagesList()
    const updatedPages: Array<{ url: string; scoreBefore: number; title: string }> = []
    const skippedPages: Array<{ url: string; score: number; reason: string }> = []

    // 3. Filter pages with scores < 85 to optimize
    for (const page of pages) {
      // Dynamic location layout templates skip direct DB write optimizations
      if (page.type === "Location") {
        skippedPages.push({ url: page.url, score: page.seoScore, reason: "Dynamic location layout skipped" })
        continue
      }

      if (page.seoScore >= 85) {
        skippedPages.push({ url: page.url, score: page.seoScore, reason: "SEO score already optimal (>=85%)" })
        continue
      }

      console.log(`[SEO Autopilot Cron] Optimizing: ${page.url} (Score: ${page.seoScore}%)`)

      // 4. Generate metadata suggestions via Gemini
      const fixResult = await generateAiSeoFix(page.url, page.type)
      if (!fixResult.ok) {
        console.error(`[SEO Autopilot Cron] Gemini failed for ${page.url}: ${fixResult.error}`)
        skippedPages.push({ url: page.url, score: page.seoScore, reason: `Gemini optimization failed: ${fixResult.error}` })
        continue
      }

      const { optimizedTitle, optimizedDescription, optimizedKeywords } = fixResult.suggestions

      // 5. Apply the AI suggestions securely bypassing the admin auth check
      const saveResult = await applyAiSeoFix(
        page.url,
        page.type,
        optimizedTitle,
        optimizedDescription,
        optimizedKeywords,
        cronSecret
      )

      if (!saveResult.ok) {
        console.error(`[SEO Autopilot Cron] Save failed for ${page.url}: ${saveResult.error}`)
        skippedPages.push({ url: page.url, score: page.seoScore, reason: `Failed to save changes: ${saveResult.error}` })
        continue
      }

      updatedPages.push({
        url: page.url,
        scoreBefore: page.seoScore,
        title: optimizedTitle
      })
    }

    console.log(`[SEO Autopilot Cron] Completed! Optimized: ${updatedPages.length} pages. Skipped/Failed: ${skippedPages.length} pages.`)

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      summary: {
        totalChecked: pages.length,
        optimizedCount: updatedPages.length,
        skippedCount: skippedPages.length
      },
      optimized: updatedPages,
      skipped: skippedPages
    })
  } catch (error: any) {
    console.error("[SEO Autopilot Cron] Execution crash error:", error)
    return NextResponse.json(
      { error: "Autopilot run failed.", details: error?.message || error },
      { status: 500 }
    )
  }
}
