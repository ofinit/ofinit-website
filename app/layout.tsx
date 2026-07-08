import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SiteToaster } from "@/components/site-toaster"
import { AnalyticsTracker } from "@/components/public/analytics-tracker"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OfinIT Solutions - Web, Software & AI Development",
  description:
    "We engineer digital excellence. Beautiful interfaces, intelligent systems, and scalable infrastructure that propel your business forward.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans antialiased`}>
        {children}
        <SiteToaster />
        <AnalyticsTracker />
      </body>
    </html>
  )
}
