import { getSeoPagesList, getSeoKeywordRankings, getGoogleGscConfig, getGeminiConfig } from "@/app/actions/seo-auditor-actions"
import { SeoAuditorDashboard } from "@/components/admin/seo-auditor-dashboard"

export const dynamic = "force-dynamic"

export default async function AdminSeoAuditorPage() {
  const [pages, rankingsResult, gscConfig, geminiConfig] = await Promise.all([
    getSeoPagesList(),
    getSeoKeywordRankings(),
    getGoogleGscConfig(),
    getGeminiConfig()
  ])

  return (
    <SeoAuditorDashboard
      initialPages={pages}
      initialRankings={rankingsResult.rankings}
      initialGscConfig={gscConfig}
      initialConnected={rankingsResult.connected}
      initialError={rankingsResult.error}
      initialGeminiConfig={geminiConfig}
    />
  )
}
