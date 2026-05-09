export type PublicPageSlug = "privacy-policy" | "terms-of-service" | "cookie-policy" | "careers"

export type PublicPageContent = {
  slug: PublicPageSlug
  title: string
  bodyMd: string
}

export const PUBLIC_PAGE_SLUGS: PublicPageSlug[] = ["privacy-policy", "terms-of-service", "cookie-policy", "careers"]

