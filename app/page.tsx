import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Services } from "@/components/services"
import { Features } from "@/components/features"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"
import { loadPublicSiteContent } from "@/lib/site-content/load"

export default async function Home() {
  const site = await loadPublicSiteContent()

  return (
    <main className="min-h-screen">
      <Header content={site.header} />
      <Hero content={site.hero} />
      <Services content={site.services} />
      <Features content={site.features} />
      <About content={site.about} />
      <CTA content={site.cta} />
      <Footer content={site.footer} />
    </main>
  )
}
