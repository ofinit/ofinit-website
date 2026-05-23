import { getDefaultSiteContent } from "@/lib/site-content/defaults"
import { getDefaultServiceBodyMd } from "@/lib/services/default-bodies"
import { serviceSlugFromName } from "./slug"

export type DefaultService = {
  slug: string
  name: string
  shortDescription: string
  bodyMd: string
  sortOrder: number
  published: boolean
}

export function getDefaultServices(): DefaultService[] {
  const site = getDefaultSiteContent()
  return site.services.items.map((it, i) => ({
    slug: serviceSlugFromName(it.title),
    name: it.title,
    shortDescription: it.description,
    bodyMd: getDefaultServiceBodyMd(serviceSlugFromName(it.title), it.description),
    sortOrder: i,
    published: true,
  }))
}

