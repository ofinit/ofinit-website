import type { ReactNode } from "react"
import { Github, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"
import type { SiteFooterContent } from "@/lib/site-content/types"

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith("/") && !href.startsWith("/#")) {
    return (
      <Link href={href} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
        {children}
      </Link>
    )
  }
  return (
    <a href={href} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
      {children}
    </a>
  )
}

export function Footer({ content }: { content: SiteFooterContent }) {
  return (
    <footer id="contact" className="border-t border-border bg-white">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-xl font-bold text-blue-600">{"<"}</span>
              <span className="text-xl font-bold">OfinIT</span>
              <span className="text-xl font-bold text-blue-600">{"/>"}</span>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6">{content.description}</p>
            <div className="flex gap-4 mb-6">
              <a href={content.socialGithub} className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href={content.socialLinkedin} className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href={content.socialTwitter} className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{content.servicesHeading}</h3>
            <ul className="space-y-3">
              {content.servicesLinks.map((item) => (
                <li key={item.label + item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{content.companyHeading}</h3>
            <ul className="space-y-3">
              {content.companyLinks.map((item) => (
                <li key={item.label + item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{content.policiesHeading}</h3>
            <ul className="space-y-3">
              {content.policiesLinks.map((item) => (
                <li key={item.label + item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{content.contactHeading}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href={`mailto:${content.contactEmail}`} className="hover:text-foreground transition-colors">
                  {content.contactEmail}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href={`tel:${content.contactPhone.replace(/\s/g, "")}`} className="hover:text-foreground transition-colors">
                  {content.contactPhone}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  {content.contactAddressLine1}
                  <br />
                  {content.contactAddressLine2}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} OfinIT Solutions Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
