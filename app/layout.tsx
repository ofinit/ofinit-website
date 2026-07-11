import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SiteToaster } from "@/components/site-toaster"
import { AnalyticsTracker, GoogleAnalyticsTracker } from "@/components/public/analytics-tracker"
import { getSeoSettings } from "@/app/actions/seo-actions"

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings()
  return {
    title: seo.metaTitle || "OfinIT Solutions - Web, Software & AI Development",
    description:
      seo.metaDescription ||
      "We engineer digital excellence. Beautiful interfaces, intelligent systems, and scalable infrastructure that propel your business forward.",
    keywords: seo.metaKeywords || "web development, software development, mobile apps, AI integration, DevOps",
    generator: "v0.app",
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const seo = await getSeoSettings()
  const googleAnalyticsId = seo?.googleAnalyticsId?.trim()
  const googleSearchConsole = seo?.googleSearchConsole?.trim()

  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          type="image/svg+xml"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cstyle%3E.t%7Bfont-family:system-ui,-apple-system,sans-serif;font-size:18px;font-weight:900%7D.b%7Bfill:%232563eb%7D.c%7Bfill:%230f172a%7D@media(prefers-color-scheme:dark)%7B.c%7Bfill:%23ffffff%7D%7D%3C/style%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' class='t'%3E%3Ctspan class='b'%3E&lt;%3C/tspan%3E%3Ctspan class='c'%3EO%3C/tspan%3E%3Ctspan class='b'%3E/&gt;%3C/tspan%3E%3C/text%3E%3C/svg%3E"
        />
        {googleSearchConsole && (
          <meta name="google-site-verification" content={googleSearchConsole} />
        )}
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        {children}
        <SiteToaster />
        <AnalyticsTracker />
        {googleAnalyticsId && <GoogleAnalyticsTracker googleAnalyticsId={googleAnalyticsId} />}
      </body>
    </html>
  )
}

