"use client"

import { useCallback, useEffect, useState } from "react"
import { getSiteContentForAdmin, saveSiteContent } from "@/app/actions/site-content-actions"
import { mergePublicSiteContent } from "@/lib/site-content/merge"
import { SERVICE_ICON_OPTIONS, STAT_ICON_OPTIONS } from "@/lib/site-content/icons"
import type { NavLink, PublicSiteContent, ServiceItem, StatItem } from "@/lib/site-content/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save } from "lucide-react"

function LinkListEditor({
  title,
  links,
  onChange,
}: {
  title: string
  links: NavLink[]
  onChange: (next: NavLink[]) => void
}) {
  return (
    <div className="space-y-3">
      {title ? <Label className="text-base font-semibold text-gray-900">{title}</Label> : null}
      {links.map((link, i) => (
        <div key={i} className="flex flex-wrap gap-2 items-center">
          <Input
            placeholder="Label"
            value={link.label}
            onChange={(e) => {
              const n = [...links]
              n[i] = { ...n[i], label: e.target.value }
              onChange(n)
            }}
            className="flex-1 min-w-[120px]"
          />
          <Input
            placeholder="/path or URL"
            value={link.href}
            onChange={(e) => {
              const n = [...links]
              n[i] = { ...n[i], href: e.target.value }
              onChange(n)
            }}
            className="flex-1 min-w-[160px] font-mono text-sm"
          />
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(links.filter((_, j) => j !== i))}>
            Remove
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...links, { label: "", href: "" }])}>
        Add link
      </Button>
    </div>
  )
}

export function SiteContentForm() {
  const [content, setContent] = useState<PublicSiteContent | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  useEffect(() => {
    getSiteContentForAdmin()
      .then((c) => {
        setContent(c)
        setLoadError(null)
      })
      .catch(() => setLoadError("Could not load site content. Are you logged in as admin?"))
  }, [])

  const update = useCallback((patch: Partial<PublicSiteContent>) => {
    setContent((prev) => (prev ? { ...prev, ...patch } : prev))
  }, [])

  const handleSave = async () => {
    if (!content) return
    setSaving(true)
    setSaveMessage(null)
    try {
      const merged = mergePublicSiteContent(content)
      await saveSiteContent(merged)
      setContent(merged)
      setSaveMessage("Saved. Public pages will show updates after refresh.")
    } catch {
      setSaveMessage("Save failed. Check your session and try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loadError) {
    return <p className="text-red-600">{loadError}</p>
  }

  if (!content) {
    return <p className="text-gray-600">Loading site content…</p>
  }

  const featuresBulletsText = content.features.bullets.join("\n")
  const whoParagraphsText = content.about.whoParagraphs.join("\n\n")

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving…" : "Save all changes"}
        </Button>
        {saveMessage ? <span className="text-sm text-gray-600">{saveMessage}</span> : null}
      </div>

      <Tabs defaultValue="header" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="cta">CTA</TabsTrigger>
        </TabsList>

        <TabsContent value="header">
          <Card className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Logo (open bracket)</Label>
                <Input
                  value={content.header.logoAngleOpen}
                  onChange={(e) => update({ header: { ...content.header, logoAngleOpen: e.target.value } })}
                />
              </div>
              <div>
                <Label>Logo text</Label>
                <Input
                  value={content.header.logoText}
                  onChange={(e) => update({ header: { ...content.header, logoText: e.target.value } })}
                />
              </div>
              <div>
                <Label>Logo (close)</Label>
                <Input
                  value={content.header.logoAngleClose}
                  onChange={(e) => update({ header: { ...content.header, logoAngleClose: e.target.value } })}
                />
              </div>
            </div>
            <LinkListEditor
              title="Navigation links"
              links={content.header.navLinks}
              onChange={(navLinks) => update({ header: { ...content.header, navLinks } })}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Header CTA label</Label>
                <Input
                  value={content.header.ctaLabel}
                  onChange={(e) => update({ header: { ...content.header, ctaLabel: e.target.value } })}
                />
              </div>
              <div>
                <Label>Header CTA href</Label>
                <Input
                  value={content.header.ctaHref}
                  onChange={(e) => update({ header: { ...content.header, ctaHref: e.target.value } })}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="footer">
          <Card className="p-6 space-y-8">
            <div>
              <Label>Description</Label>
              <Textarea
                rows={5}
                value={content.footer.description}
                onChange={(e) => update({ footer: { ...content.footer, description: e.target.value } })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>GitHub URL</Label>
                <Input
                  value={content.footer.socialGithub}
                  onChange={(e) => update({ footer: { ...content.footer, socialGithub: e.target.value } })}
                />
              </div>
              <div>
                <Label>LinkedIn URL</Label>
                <Input
                  value={content.footer.socialLinkedin}
                  onChange={(e) => update({ footer: { ...content.footer, socialLinkedin: e.target.value } })}
                />
              </div>
              <div>
                <Label>Twitter / X URL</Label>
                <Input
                  value={content.footer.socialTwitter}
                  onChange={(e) => update({ footer: { ...content.footer, socialTwitter: e.target.value } })}
                />
              </div>
            </div>
            <div>
              <Input
                className="max-w-xs mb-2 font-semibold"
                value={content.footer.servicesHeading}
                onChange={(e) => update({ footer: { ...content.footer, servicesHeading: e.target.value } })}
              />
              <LinkListEditor
                title=""
                links={content.footer.servicesLinks}
                onChange={(servicesLinks) => update({ footer: { ...content.footer, servicesLinks } })}
              />
            </div>
            <div>
              <Input
                className="max-w-xs mb-2 font-semibold"
                value={content.footer.companyHeading}
                onChange={(e) => update({ footer: { ...content.footer, companyHeading: e.target.value } })}
              />
              <LinkListEditor
                title=""
                links={content.footer.companyLinks}
                onChange={(companyLinks) => update({ footer: { ...content.footer, companyLinks } })}
              />
            </div>
            <div>
              <Input
                className="max-w-xs mb-2 font-semibold"
                value={content.footer.policiesHeading}
                onChange={(e) => update({ footer: { ...content.footer, policiesHeading: e.target.value } })}
              />
              <LinkListEditor
                title=""
                links={content.footer.policiesLinks}
                onChange={(policiesLinks) => update({ footer: { ...content.footer, policiesLinks } })}
              />
            </div>
            <div>
              <Input
                className="max-w-xs mb-4 font-semibold"
                value={content.footer.contactHeading}
                onChange={(e) => update({ footer: { ...content.footer, contactHeading: e.target.value } })}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    value={content.footer.contactEmail}
                    onChange={(e) => update({ footer: { ...content.footer, contactEmail: e.target.value } })}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={content.footer.contactPhone}
                    onChange={(e) => update({ footer: { ...content.footer, contactPhone: e.target.value } })}
                  />
                </div>
                <div>
                  <Label>Address line 1</Label>
                  <Input
                    value={content.footer.contactAddressLine1}
                    onChange={(e) => update({ footer: { ...content.footer, contactAddressLine1: e.target.value } })}
                  />
                </div>
                <div>
                  <Label>Address line 2</Label>
                  <Input
                    value={content.footer.contactAddressLine2}
                    onChange={(e) => update({ footer: { ...content.footer, contactAddressLine2: e.target.value } })}
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="hero">
          <Card className="p-6 space-y-4">
            <div>
              <Label>Badge</Label>
              <Input value={content.hero.badge} onChange={(e) => update({ hero: { ...content.hero, badge: e.target.value } })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Heading (before accent)</Label>
                <Input
                  value={content.hero.headingBefore}
                  onChange={(e) => update({ hero: { ...content.hero, headingBefore: e.target.value } })}
                />
              </div>
              <div>
                <Label>Heading (accent)</Label>
                <Input
                  value={content.hero.headingAccent}
                  onChange={(e) => update({ hero: { ...content.hero, headingAccent: e.target.value } })}
                />
              </div>
              <div>
                <Label>Heading (after accent)</Label>
                <Input
                  value={content.hero.headingAfter}
                  onChange={(e) => update({ hero: { ...content.hero, headingAfter: e.target.value } })}
                />
              </div>
            </div>
            <div>
              <Label>Subheading</Label>
              <Textarea
                rows={3}
                value={content.hero.subheading}
                onChange={(e) => update({ hero: { ...content.hero, subheading: e.target.value } })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Primary CTA label</Label>
                <Input
                  value={content.hero.primaryCtaLabel}
                  onChange={(e) => update({ hero: { ...content.hero, primaryCtaLabel: e.target.value } })}
                />
              </div>
              <div>
                <Label>Primary CTA href</Label>
                <Input
                  value={content.hero.primaryCtaHref}
                  onChange={(e) => update({ hero: { ...content.hero, primaryCtaHref: e.target.value } })}
                />
              </div>
              <div>
                <Label>Secondary CTA label</Label>
                <Input
                  value={content.hero.secondaryCtaLabel}
                  onChange={(e) => update({ hero: { ...content.hero, secondaryCtaLabel: e.target.value } })}
                />
              </div>
              <div>
                <Label>Secondary CTA href</Label>
                <Input
                  value={content.hero.secondaryCtaHref}
                  onChange={(e) => update({ hero: { ...content.hero, secondaryCtaHref: e.target.value } })}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Section title</Label>
                <Input
                  value={content.services.title}
                  onChange={(e) => update({ services: { ...content.services, title: e.target.value } })}
                />
              </div>
              <div>
                <Label>Subtitle</Label>
                <Input
                  value={content.services.subtitle}
                  onChange={(e) => update({ services: { ...content.services, subtitle: e.target.value } })}
                />
              </div>
            </div>
            <div className="space-y-6">
              <Label className="text-base font-semibold">Service cards</Label>
              {content.services.items.map((item, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-3">
                  <div className="flex flex-wrap gap-2 items-center">
                    <Select
                      value={item.icon}
                      onValueChange={(v) => {
                        const items = [...content.services.items]
                        items[i] = { ...items[i], icon: v as ServiceItem["icon"] }
                        update({ services: { ...content.services, items } })
                      }}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICE_ICON_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Title"
                      className="flex-1 min-w-[200px]"
                      value={item.title}
                      onChange={(e) => {
                        const items = [...content.services.items]
                        items[i] = { ...items[i], title: e.target.value }
                        update({ services: { ...content.services, items } })
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        update({
                          services: {
                            ...content.services,
                            items: content.services.items.filter((_, j) => j !== i),
                          },
                        })
                      }
                    >
                      Remove
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Description"
                    rows={3}
                    value={item.description}
                    onChange={(e) => {
                      const items = [...content.services.items]
                      items[i] = { ...items[i], description: e.target.value }
                      update({ services: { ...content.services, items } })
                    }}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  update({
                    services: {
                      ...content.services,
                      items: [
                        ...content.services.items,
                        { icon: "Code", title: "", description: "" } satisfies ServiceItem,
                      ],
                    },
                  })
                }
              >
                Add service
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card className="p-6 space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={content.features.title}
                onChange={(e) => update({ features: { ...content.features, title: e.target.value } })}
              />
            </div>
            <div>
              <Label>Body</Label>
              <Textarea
                rows={6}
                value={content.features.body}
                onChange={(e) => update({ features: { ...content.features, body: e.target.value } })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Image path</Label>
                <Input
                  value={content.features.imageSrc}
                  onChange={(e) => update({ features: { ...content.features, imageSrc: e.target.value } })}
                  className="font-mono text-sm"
                />
              </div>
              <div>
                <Label>Image alt</Label>
                <Input
                  value={content.features.imageAlt}
                  onChange={(e) => update({ features: { ...content.features, imageAlt: e.target.value } })}
                />
              </div>
            </div>
            <div>
              <Label>Bullet points (one per line)</Label>
              <Textarea
                rows={12}
                value={featuresBulletsText}
                onChange={(e) =>
                  update({
                    features: {
                      ...content.features,
                      bullets: e.target.value.split("\n").map((l) => l.trim()).filter(Boolean),
                    },
                  })
                }
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={content.about.title}
                  onChange={(e) => update({ about: { ...content.about, title: e.target.value } })}
                />
              </div>
              <div>
                <Label>Subtitle</Label>
                <Input
                  value={content.about.subtitle}
                  onChange={(e) => update({ about: { ...content.about, subtitle: e.target.value } })}
                />
              </div>
            </div>
            <div>
              <Label>Who we are — title</Label>
              <Input
                value={content.about.whoTitle}
                onChange={(e) => update({ about: { ...content.about, whoTitle: e.target.value } })}
              />
            </div>
            <div>
              <Label>Who we are — paragraphs (blank line between paragraphs)</Label>
              <Textarea
                rows={8}
                value={whoParagraphsText}
                onChange={(e) =>
                  update({
                    about: {
                      ...content.about,
                      whoParagraphs: e.target.value
                        .split(/\n\s*\n/)
                        .map((p) => p.trim())
                        .filter(Boolean),
                    },
                  })
                }
              />
            </div>
            <div>
              <Label>Mission title</Label>
              <Input
                value={content.about.missionTitle}
                onChange={(e) => update({ about: { ...content.about, missionTitle: e.target.value } })}
              />
            </div>
            <div>
              <Label>Mission text</Label>
              <Textarea
                rows={3}
                value={content.about.missionText}
                onChange={(e) => update({ about: { ...content.about, missionText: e.target.value } })}
              />
            </div>
            <div>
              <Label>Vision title</Label>
              <Input
                value={content.about.visionTitle}
                onChange={(e) => update({ about: { ...content.about, visionTitle: e.target.value } })}
              />
            </div>
            <div>
              <Label>Vision text</Label>
              <Textarea
                rows={3}
                value={content.about.visionText}
                onChange={(e) => update({ about: { ...content.about, visionText: e.target.value } })}
              />
            </div>
            <div className="space-y-4">
              <Label className="text-base font-semibold">Stats</Label>
              {content.about.stats.map((stat, i) => (
                <div key={i} className="flex flex-wrap gap-2 items-center border rounded-lg p-3">
                  <Select
                    value={stat.icon}
                    onValueChange={(v) => {
                      const stats = [...content.about.stats]
                      stats[i] = { ...stats[i], icon: v as StatItem["icon"] }
                      update({ about: { ...content.about, stats } })
                    }}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STAT_ICON_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Label"
                    className="flex-1 min-w-[120px]"
                    value={stat.label}
                    onChange={(e) => {
                      const stats = [...content.about.stats]
                      stats[i] = { ...stats[i], label: e.target.value }
                      update({ about: { ...content.about, stats } })
                    }}
                  />
                  <Input
                    placeholder="Value"
                    className="w-24"
                    value={stat.value}
                    onChange={(e) => {
                      const stats = [...content.about.stats]
                      stats[i] = { ...stats[i], value: e.target.value }
                      update({ about: { ...content.about, stats } })
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      update({
                        about: {
                          ...content.about,
                          stats: content.about.stats.filter((_, j) => j !== i),
                        },
                      })
                    }
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  update({
                    about: {
                      ...content.about,
                      stats: [...content.about.stats, { icon: "Users", label: "", value: "" } satisfies StatItem],
                    },
                  })
                }
              >
                Add stat
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="cta">
          <Card className="p-6 space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={content.cta.title} onChange={(e) => update({ cta: { ...content.cta, title: e.target.value } })} />
            </div>
            <div>
              <Label>Body</Label>
              <Textarea
                rows={3}
                value={content.cta.body}
                onChange={(e) => update({ cta: { ...content.cta, body: e.target.value } })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Primary label</Label>
                <Input
                  value={content.cta.primaryLabel}
                  onChange={(e) => update({ cta: { ...content.cta, primaryLabel: e.target.value } })}
                />
              </div>
              <div>
                <Label>Primary href</Label>
                <Input
                  value={content.cta.primaryHref}
                  onChange={(e) => update({ cta: { ...content.cta, primaryHref: e.target.value } })}
                />
              </div>
              <div>
                <Label>Secondary label</Label>
                <Input
                  value={content.cta.secondaryLabel}
                  onChange={(e) => update({ cta: { ...content.cta, secondaryLabel: e.target.value } })}
                />
              </div>
              <div>
                <Label>Secondary href</Label>
                <Input
                  value={content.cta.secondaryHref}
                  onChange={(e) => update({ cta: { ...content.cta, secondaryHref: e.target.value } })}
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
