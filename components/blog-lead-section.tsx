import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ContactLeadForm } from "@/components/contact-lead-form"

type Props = {
  postTitle: string
}

export function BlogLeadSection({ postTitle }: Props) {
  return (
    <section id="inquiry" className="scroll-mt-24 mt-14 pt-12 border-t border-border">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-start">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">Discuss your project</h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Read something useful here? Tell us what you are building—we route inquiries to the right team and usually
            reply within one business day.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <li>· No-obligation discovery call</li>
            <li>· NDA available for sensitive work</li>
            <li>· Flexible engagement models</li>
          </ul>
        </div>

        <Card className="shadow-sm border-border/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Request a consultation</CardTitle>
            <CardDescription>Fields marked * are required.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ContactLeadForm
              leadSource="blog"
              messagePlaceholder={`I read "${postTitle}" and would like to discuss…`}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
