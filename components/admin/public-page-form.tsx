"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"
import type { PublicPageContent, PublicPageSlug } from "@/lib/public-pages/types"
import { savePublicPageForAdmin } from "@/app/actions/public-pages-actions"

export function PublicPageForm({ page }: { page: PublicPageContent }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await savePublicPageForAdmin(page.slug as PublicPageSlug, formData)
      if (!res.success) {
        alert(res.error || "Failed to save page")
        return
      }
      router.push("/admin/pages")
      router.refresh()
    } catch (err) {
      console.error("Error saving page:", err)
      alert("Failed to save page")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" defaultValue={page.slug} readOnly className="mt-2 font-mono" />
            </div>
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" defaultValue={page.title} required className="mt-2" />
            </div>
          </div>

          <div>
            <Label htmlFor="bodyMd">Body (Markdown) *</Label>
            <Textarea
              id="bodyMd"
              name="bodyMd"
              defaultValue={page.bodyMd}
              required
              rows={18}
              className="mt-2 font-mono"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Supports basic Markdown and tables via GFM.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting} className="gap-2">
          <Save className="w-4 h-4" />
          {isSubmitting ? "Saving..." : "Update Page"}
        </Button>
      </div>
    </form>
  )
}

