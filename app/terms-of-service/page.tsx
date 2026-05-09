import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { loadPublicSiteContent } from "@/lib/site-content/load"
import { loadPublicPage } from "@/lib/public-pages/load"
import { PublicPageShell } from "@/components/public/public-page-shell"

export const metadata: Metadata = {
  title: "Terms of Service | OfinIT Solutions",
  description: "Terms of service for OfinIT Solutions.",
}

export default async function TermsOfServicePage() {
  const [site, page] = await Promise.all([loadPublicSiteContent(), loadPublicPage("terms-of-service")])

  return (
    <>
      <Header content={site.header} />
      <PublicPageShell title={page.title} slug="terms-of-service" markdown={page.bodyMd} />
      <Footer content={site.footer} />
    </>
  )
}

