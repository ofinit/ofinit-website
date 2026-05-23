import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ContactLeadForm } from "@/components/contact-lead-form"

type Props = {
  serviceName: string
}

export function ServiceLeadSection({ serviceName }: Props) {
  return (
    <section id="inquiry" className="scroll-mt-24 mt-16 pt-16 border-t border-border">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">
            Discuss your {serviceName} project
          </h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Share a few details about goals, timeline, and budget range. We route service inquiries to the right
            specialists and usually reply within one business day.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <li>· No obligation discovery call</li>
            <li>· NDA available for sensitive work</li>
            <li>· Flexible engagement: fixed scope or ongoing squad</li>
          </ul>
        </div>

        <Card className="shadow-sm border-border/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Request a consultation</CardTitle>
            <CardDescription>Fields marked * are required.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ContactLeadForm
              serviceName={serviceName}
              leadSource="service"
              messagePlaceholder={`Tell us about your ${serviceName} needs — goals, timeline, and any links to references.`}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
