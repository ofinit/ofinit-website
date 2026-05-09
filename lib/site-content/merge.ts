import type { PublicSiteContent } from "./types"
import { getDefaultSiteContent } from "./defaults"

function isNavLinks(x: unknown): x is PublicSiteContent["header"]["navLinks"] {
  return Array.isArray(x) && x.every((i) => i && typeof i === "object" && "label" in i && "href" in i)
}

function mapPlaceholderFooterLinks(links: PublicSiteContent["footer"]["policiesLinks"]): PublicSiteContent["footer"]["policiesLinks"] {
  const labelToHref: Record<string, string> = {
    "Privacy Policy": "/privacy-policy",
    "Terms of Service": "/terms-of-service",
    "Cookie Policy": "/cookie-policy",
    Careers: "/careers",
    "UI/UX Design": "/services/ui-ux-design",
    "Web Development": "/services/web-development",
    "Software Development": "/services/software-development",
    "Mobile App Development": "/services/mobile-app-development",
    "AI Integration": "/services/ai-integration",
    DevOps: "/services/devops-services",
    "DevOps Services": "/services/devops-services",
  }

  return links.map((l) => {
    const mapped = labelToHref[l.label]
    if (!mapped) return l
    if (!l.href || l.href === "#" || l.href.trim() === "") return { ...l, href: mapped }
    return l
  })
}

function mapHeaderLinks(links: PublicSiteContent["header"]["navLinks"]): PublicSiteContent["header"]["navLinks"] {
  return links.map((l) => {
    if (l.label !== "Services") return l
    if (l.href === "/#services" || l.href === "#" || l.href.trim() === "") {
      return { ...l, href: "/services" }
    }
    return l
  })
}

function isServiceItems(x: unknown): x is PublicSiteContent["services"]["items"] {
  return (
    Array.isArray(x) &&
    x.every(
      (i) =>
        i &&
        typeof i === "object" &&
        "icon" in i &&
        "title" in i &&
        "description" in i,
    )
  )
}

function isStatItems(x: unknown): x is PublicSiteContent["about"]["stats"] {
  return (
    Array.isArray(x) &&
    x.every(
      (i) =>
        i &&
        typeof i === "object" &&
        "icon" in i &&
        "label" in i &&
        "value" in i,
    )
  )
}

/** Merges partial JSON from DB with defaults so missing keys still render. */
export function mergePublicSiteContent(raw: unknown): PublicSiteContent {
  const d = getDefaultSiteContent()
  if (!raw || typeof raw !== "object") return d
  const p = raw as Partial<PublicSiteContent>

  return {
    header: {
      ...d.header,
      ...p.header,
      navLinks: isNavLinks(p.header?.navLinks) ? mapHeaderLinks(p.header!.navLinks) : d.header.navLinks,
    },
    footer: {
      ...d.footer,
      ...p.footer,
      servicesLinks: isNavLinks(p.footer?.servicesLinks)
        ? mapPlaceholderFooterLinks(p.footer!.servicesLinks)
        : d.footer.servicesLinks,
      companyLinks: isNavLinks(p.footer?.companyLinks)
        ? mapPlaceholderFooterLinks(p.footer!.companyLinks)
        : d.footer.companyLinks,
      policiesLinks: isNavLinks(p.footer?.policiesLinks)
        ? mapPlaceholderFooterLinks(p.footer!.policiesLinks)
        : d.footer.policiesLinks,
    },
    hero: { ...d.hero, ...p.hero },
    services: {
      ...d.services,
      ...p.services,
      items: isServiceItems(p.services?.items) ? p.services!.items : d.services.items,
    },
    features: {
      ...d.features,
      ...p.features,
      bullets: Array.isArray(p.features?.bullets) ? (p.features!.bullets as string[]) : d.features.bullets,
    },
    about: {
      ...d.about,
      ...p.about,
      whoParagraphs: Array.isArray(p.about?.whoParagraphs)
        ? (p.about!.whoParagraphs as string[])
        : d.about.whoParagraphs,
      stats: isStatItems(p.about?.stats) ? p.about!.stats : d.about.stats,
    },
    cta: { ...d.cta, ...p.cta },
  }
}
