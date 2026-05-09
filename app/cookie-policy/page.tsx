import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { loadPublicSiteContent } from "@/lib/site-content/load"
import { loadPublicPage } from "@/lib/public-pages/load"
import { PublicPageShell } from "@/components/public/public-page-shell"

export const metadata: Metadata = {
  title: "Cookie Policy | OfinIT Solutions",
  description: "Cookie policy for OfinIT Solutions.",
}

export default async function CookiePolicyPage() {
  const [site, page] = await Promise.all([loadPublicSiteContent(), loadPublicPage("cookie-policy")])

  return (
    <>
      <Header content={site.header} />
      <PublicPageShell title={page.title} slug="cookie-policy" markdown={page.bodyMd} />
      <Footer content={site.footer} />
    </>
  )
}

