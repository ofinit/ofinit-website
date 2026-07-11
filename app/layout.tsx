import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SiteToaster } from "@/components/site-toaster"
import { AnalyticsTracker } from "@/components/public/analytics-tracker"
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
        {googleSearchConsole && (
          <meta name="google-site-verification" content={googleSearchConsole} />
        )}
        {googleAnalyticsId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${googleAnalyticsId}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        {children}
        <SiteToaster />
        <AnalyticsTracker />
      </body>
    </html>
  )
}

