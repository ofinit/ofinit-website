"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "@/components/admin/image-upload"
import { Save } from "lucide-react"
import type { AdminService } from "@/app/actions/service-actions"
import { createServiceForAdmin, updateServiceForAdmin } from "@/app/actions/service-actions"
import { serviceSlugFromName } from "@/lib/services/slug"

export function ServiceForm({ service }: { service?: AdminService }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState(service?.name ?? "")
  const [slug, setSlug] = useState(service?.slug ?? "")
  const [slugEdited, setSlugEdited] = useState(Boolean(service?.slug))

  const autoSlug = useMemo(() => serviceSlugFromName(name), [name])

  useEffect(() => {
    if (!slugEdited) setSlug(autoSlug)
  }, [autoSlug, slugEdited])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    try {
      const res = service ? await updateServiceForAdmin(service.id, formData) : await createServiceForAdmin(formData)
      if (!res.success) {
        alert(res.error || "Failed to save service")
        return
      }
      router.push("/admin/services")
      router.refresh()
    } catch (err) {
      console.error("Error saving service:", err)
      alert("Failed to save service")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-2"
                  placeholder="UI/UX Design"
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlugEdited(true)
                    setSlug(e.target.value)
                  }}
                  required
                  className="mt-2 font-mono"
                  placeholder="ui-ux-design"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Public URL will be <span className="font-mono">/services/{slug || "..."}</span>
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="shortDescription">Short description *</Label>
              <Textarea
                id="shortDescription"
                name="shortDescription"
                defaultValue={service?.shortDescription ?? ""}
                required
                rows={3}
                className="mt-2"
                placeholder="Short summary shown on cards and SEO."
              />
            </div>

            <ImageUpload
              label="Logo Image"
              name="logoUrl"
              defaultValue={service?.logoUrl ?? ""}
              description="Optional. Used on the service detail page."
            />

            <div>
              <Label htmlFor="bodyMd">Detail page content (Markdown) *</Label>
              <Textarea
                id="bodyMd"
                name="bodyMd"
                defaultValue={service?.bodyMd ?? ""}
                required
                rows={16}
                className="mt-2 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <Label htmlFor="sortOrder">Sort order</Label>
                <Input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  defaultValue={service?.sortOrder ?? 0}
                  className="mt-2"
                />
              </div>

              <div className="flex items-center justify-between border rounded-md px-3 py-2 mt-6 md:mt-0">
                <div>
                  <Label htmlFor="published">Published</Label>
                  <p className="text-xs text-muted-foreground">Only published services show publicly.</p>
                </div>
                <Switch id="published" name="published" defaultChecked={service?.published ?? true} />
              </div>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            <Save className="w-4 h-4" />
            {isSubmitting ? "Saving..." : service ? "Update Service" : "Create Service"}
          </Button>
        </div>
      </div>
    </form>
  )
}

