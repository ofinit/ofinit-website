import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ContactLeadForm } from "@/components/contact-lead-form"

export function ContactLeadSection() {
  return (
    <section id="contact" className="scroll-mt-24 py-16 sm:py-24 px-8 sm:px-16 lg:px-24 xl:px-32 bg-muted/30 border-y border-border">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-balance">Start a conversation</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            Tell us about your project. We typically reply within one business day with next steps or a short discovery call.
          </p>
        </div>

        <Card className="shadow-sm border-border/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Project inquiry</CardTitle>
            <CardDescription>Fields marked * are required.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ContactLeadForm />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
