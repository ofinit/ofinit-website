export type NavLink = {
  label: string
  href: string
}

export type ServiceItem = {
  icon: "Palette" | "Globe" | "Code" | "Smartphone" | "Brain" | "Server"
  title: string
  description: string
}

export type StatItem = {
  icon: "Users" | "Target" | "Award" | "Zap"
  label: string
  value: string
}

export type SiteHeaderContent = {
  logoAngleOpen: string
  logoText: string
  logoAngleClose: string
  navLinks: NavLink[]
  ctaLabel: string
  ctaHref: string
}

export type SiteFooterContent = {
  description: string
  socialGithub: string
  socialLinkedin: string
  socialTwitter: string
  servicesHeading: string
  servicesLinks: NavLink[]
  companyHeading: string
  companyLinks: NavLink[]
  policiesHeading: string
  policiesLinks: NavLink[]
  contactHeading: string
  contactEmail: string
  contactPhone: string
  contactAddressLine1: string
  contactAddressLine2: string
}

export type HeroContent = {
  badge: string
  headingBefore: string
  headingAccent: string
  headingAfter: string
  subheading: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
}

export type ServicesSectionContent = {
  title: string
  subtitle: string
  items: ServiceItem[]
}

export type FeaturesSectionContent = {
  title: string
  body: string
  imageSrc: string
  imageAlt: string
  bullets: string[]
}

export type AboutSectionContent = {
  title: string
  subtitle: string
  whoTitle: string
  whoParagraphs: string[]
  missionTitle: string
  missionText: string
  visionTitle: string
  visionText: string
  stats: StatItem[]
}

export type CtaSectionContent = {
  title: string
  body: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel: string
  secondaryHref: string
}

export type PublicSiteContent = {
  header: SiteHeaderContent
  footer: SiteFooterContent
  hero: HeroContent
  services: ServicesSectionContent
  features: FeaturesSectionContent
  about: AboutSectionContent
  cta: CtaSectionContent
}

export const PUBLIC_SITE_SETTING_KEY = "public_site_v1"
