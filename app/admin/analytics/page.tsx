import { getHistoricalAnalytics, getRealtimeUsersList } from "@/lib/analytics/tracker"
import { DetailedAnalytics } from "@/components/admin/detailed-analytics"

export const dynamic = "force-dynamic"

export default async function AnalyticsPage() {
  const analyticsData = await getHistoricalAnalytics(30)
  const realtimeUsers = getRealtimeUsersList()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">
          Monitor your website's traffic, conversions, active audience, and user technology breakdowns.
        </p>
      </div>

      <DetailedAnalytics data={analyticsData} realtimeUsers={realtimeUsers} />
    </div>
  )
}
