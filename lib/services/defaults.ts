import { getDefaultSiteContent } from "@/lib/site-content/defaults"
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
    bodyMd: `## Overview\n${it.description}\n\n## What we deliver\n- Discovery & planning\n- Design & implementation\n- Testing & launch\n- Support & iteration\n`,
    sortOrder: i,
    published: true,
  }))
}

