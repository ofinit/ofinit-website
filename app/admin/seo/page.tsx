import { getSeoPagesList, getSeoKeywordRankings, getGoogleGscConfig } from "@/app/actions/seo-auditor-actions"
import { SeoAuditorDashboard } from "@/components/admin/seo-auditor-dashboard"

export const dynamic = "force-dynamic"

export default async function AdminSeoAuditorPage() {
  const [pages, rankingsResult, gscConfig] = await Promise.all([
    getSeoPagesList(),
    getSeoKeywordRankings(),
    getGoogleGscConfig()
  ])

  return (
    <SeoAuditorDashboard
      initialPages={pages}
      initialRankings={rankingsResult.rankings}
      initialGscConfig={gscConfig}
      initialConnected={rankingsResult.connected}
      initialError={rankingsResult.error}
    />
  )
}
