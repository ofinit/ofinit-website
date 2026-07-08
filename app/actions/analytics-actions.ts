"use server"

import { getHistoricalAnalytics } from "@/lib/analytics/tracker"

export async function fetchAnalyticsData(days: number) {
  try {
    return await getHistoricalAnalytics(days)
  } catch (e) {
    console.error("Failed to fetch historical analytics data:", e)
    throw new Error("Failed to load analytics data")
  }
}
