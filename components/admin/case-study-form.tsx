"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { createCaseStudy, updateCaseStudy } from "@/app/actions/case-study-actions"
import type { CaseStudy } from "@/lib/case-studies-data"
import { ImageUpload } from "./image-upload"
import { X } from "lucide-react"

interface CaseStudyFormProps {
  caseStudy?: CaseStudy
}

export function CaseStudyForm({ caseStudy }: CaseStudyFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<string[]>(caseStudy?.tags || [])
  const [tagInput, setTagInput] = useState("")

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title") as string,
      client: formData.get("client") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      image: formData.get("image") as string,
      imageAlt: formData.get("imageAlt") as string,
      projectUrl: formData.get("projectUrl") as string,
      tags,
      published: formData.get("published") === "on",
    }

    try {
      if (caseStudy) {
        await updateCaseStudy(caseStudy.id, data)
      } else {
        await createCaseStudy(data)
      }
      router.push("/admin/case-studies")
      router.refresh()
    } catch (error) {
      console.error("Error saving case study:", error)
      alert("Failed to save case study")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                name="title"
                defaultValue={caseStudy?.title}
                placeholder="E-Commerce Platform Redesign"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client">Client Name *</Label>
                <Input id="client" name="client" defaultValue={caseStudy?.client} placeholder="RetailCo" required />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  name="category"
                  defaultValue={caseStudy?.category}
                  placeholder="UI/UX Design & Web Development"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Project Description *</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={caseStudy?.description}
                placeholder="Describe the project, challenges, and solutions..."
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="projectUrl">Project URL (Optional)</Label>
              <Input
                id="projectUrl"
                name="projectUrl"
                type="url"
                defaultValue={caseStudy?.projectUrl}
                placeholder="https://example.com"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Featured Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUpload
              name="image"
              label="Project Image"
              defaultValue={caseStudy?.image}
              recommendedSize="1200x675px (16:9 aspect ratio)"
            />

            <div>
              <Label htmlFor="imageAlt">Image Alt Text *</Label>
              <Input
                id="imageAlt"
                name="imageAlt"
                defaultValue={caseStudy?.imageAlt}
                placeholder="Descriptive alt text for SEO and accessibility"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technologies & Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tagInput">Add Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tagInput"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                  placeholder="e.g., React, Next.js, UI/UX"
                />
                <Button type="button" onClick={handleAddTag} variant="outline">
                  Add
                </Button>
              </div>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-primary/70">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publication Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="published">Publish Case Study</Label>
                <p className="text-sm text-gray-600">Make this case study visible on the website</p>
              </div>
              <Switch id="published" name="published" defaultChecked={caseStudy?.published ?? true} />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : caseStudy ? "Update Case Study" : "Create Case Study"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/case-studies")}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  )
}
