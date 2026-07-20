import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { loadPublicSiteContent } from "@/lib/site-content/load"
import { Home } from "lucide-react"
import Link from "next/link"

export default async function NotFound() {
  const site = await loadPublicSiteContent()

  return (
    <div className="flex flex-col min-h-screen">
      <Header content={site.header} />
      
      <main className="flex-grow flex flex-col items-center justify-center pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        {/* Decorative ambient light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-md w-full text-center relative z-10 mx-auto">
          <div className="mb-6 relative">
            <span className="text-9xl font-extrabold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent tracking-tight select-none">
              404
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Page Not Found
          </h1>
          
          <p className="text-muted-foreground mb-8 text-balance max-w-sm mx-auto leading-relaxed">
            The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
          </p>
          
          <div className="flex justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Back Home
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer content={site.footer} />
    </div>
  )
}
