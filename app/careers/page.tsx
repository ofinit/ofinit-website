import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { loadPublicSiteContent } from "@/lib/site-content/load"
import { loadPublicPage } from "@/lib/public-pages/load"
import { PublicPageShell } from "@/components/public/public-page-shell"

export const metadata: Metadata = {
  title: "Careers | OfinIT Solutions",
  description: "Careers at OfinIT Solutions.",
}

export default async function CareersPage() {
  const [site, page] = await Promise.all([loadPublicSiteContent(), loadPublicPage("careers")])

  return (
    <>
      <Header content={site.header} />
      <PublicPageShell title={page.title} slug="careers" markdown={page.bodyMd} />
      <Footer content={site.footer} />
    </>
  )
}

