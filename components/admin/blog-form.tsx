"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createBlogPost, updateBlogPost } from "@/app/actions/blog-actions"
import { getCategories } from "@/app/actions/category-actions"
import type { BlogPost } from "@/lib/blog-data"
import { Save, Plus } from "lucide-react"
import { ImageUpload } from "@/components/admin/image-upload"
import Link from "next/link"

interface BlogFormProps {
  post?: BlogPost
}

export function BlogForm({ post }: BlogFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [slug, setSlug] = useState(post?.slug || "")
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])

  useEffect(() => {
    // Load categories
    getCategories().then((result) => {
      if (result.success) {
        setCategories(result.categories)
      }
    })
  }, [])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    if (!post) {
      setSlug(generateSlug(title))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      let result
      if (post) {
        result = await updateBlogPost(post.id, formData)
      } else {
        result = await createBlogPost(formData)
      }

      if (result.success) {
        router.push("/admin/blogs")
        router.refresh()
      } else {
        alert(result.error || "Failed to save blog post")
      }
    } catch (error) {
      console.error("[v0] Error submitting form:", error)
      alert("An error occurred while saving the blog post")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="content" className="space-y-6">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="seo">SEO Settings</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={post?.title}
                  onChange={handleTitleChange}
                  required
                  placeholder="Enter blog post title"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  placeholder="url-friendly-slug"
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">URL: /blog/{slug}</p>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  defaultValue={post?.excerpt}
                  required
                  placeholder="Brief description of the blog post"
                  rows={3}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="content">Content (HTML) *</Label>
                <Textarea
                  id="content"
                  name="content"
                  defaultValue={post?.content}
                  required
                  placeholder="Enter your blog post content with HTML tags (h2, h3, p, etc.)"
                  rows={15}
                  className="mt-2 font-mono text-sm"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Use proper heading hierarchy: &lt;h2&gt; for main sections, &lt;h3&gt; for subsections
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="category">Category *</Label>
                    <Link href="/admin/categories/new" target="_blank">
                      <Button type="button" variant="outline" size="sm" className="gap-1 h-7 text-xs bg-transparent">
                        <Plus className="w-3 h-3" />
                        New
                      </Button>
                    </Link>
                  </div>
                  <select
                    id="category"
                    name="category"
                    defaultValue={post?.category}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="readTime">Read Time *</Label>
                  <Input
                    id="readTime"
                    name="readTime"
                    defaultValue={post?.readTime}
                    required
                    placeholder="e.g., 8 min read"
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Featured Image</h3>
            <div className="space-y-4">
              <ImageUpload
                label="Featured Image"
                name="image"
                defaultValue={post?.image}
                required
                placeholder="/path-to-image.jpg"
                description="Upload an image or enter a URL. Recommended size: 1200x630px"
              />

              <div>
                <Label htmlFor="imageAlt">Image Alt Text *</Label>
                <Input
                  id="imageAlt"
                  name="imageAlt"
                  defaultValue={post?.imageAlt}
                  required
                  placeholder="Descriptive alt text for SEO and accessibility"
                  className="mt-2"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Author Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="authorName">Author Name *</Label>
                <Input
                  id="authorName"
                  name="authorName"
                  defaultValue={post?.author.name}
                  required
                  placeholder="John Doe"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="authorRole">Author Role *</Label>
                <Input
                  id="authorRole"
                  name="authorRole"
                  defaultValue={post?.author.role}
                  required
                  placeholder="Senior Developer"
                  className="mt-2"
                />
              </div>

              <ImageUpload
                label="Author Avatar"
                name="authorAvatar"
                defaultValue={post?.author.avatar}
                placeholder="/author-avatar.png"
                description="Upload an avatar image or enter a URL. Recommended size: 200x200px"
              />
            </div>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Basic SEO</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title *</Label>
                <Input
                  id="metaTitle"
                  name="metaTitle"
                  defaultValue={post?.metaTitle}
                  required
                  placeholder="Optimized title for search engines (50-60 characters)"
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">Recommended: 50-60 characters</p>
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description *</Label>
                <Textarea
                  id="metaDescription"
                  name="metaDescription"
                  defaultValue={post?.metaDescription}
                  required
                  placeholder="Compelling description for search results (150-160 characters)"
                  rows={3}
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">Recommended: 150-160 characters</p>
              </div>

              <div>
                <Label htmlFor="metaKeywords">Meta Keywords *</Label>
                <Input
                  id="metaKeywords"
                  name="metaKeywords"
                  defaultValue={post?.metaKeywords.join(", ")}
                  required
                  placeholder="keyword1, keyword2, keyword3"
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">Separate keywords with commas</p>
              </div>

              <div>
                <Label htmlFor="canonicalUrl">Canonical URL</Label>
                <Input
                  id="canonicalUrl"
                  name="canonicalUrl"
                  defaultValue={post?.canonicalUrl}
                  placeholder="https://ofinit.com/blog/your-post-slug"
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">Leave empty to use default URL</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Open Graph (Facebook, LinkedIn)</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="ogTitle">OG Title</Label>
                <Input
                  id="ogTitle"
                  name="ogTitle"
                  defaultValue={post?.ogTitle}
                  placeholder="Leave empty to use meta title"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="ogDescription">OG Description</Label>
                <Textarea
                  id="ogDescription"
                  name="ogDescription"
                  defaultValue={post?.ogDescription}
                  placeholder="Leave empty to use meta description"
                  rows={3}
                  className="mt-2"
                />
              </div>

              <ImageUpload
                label="OG Image"
                name="ogImage"
                defaultValue={post?.ogImage}
                placeholder="Leave empty to use featured image"
                description="Recommended size: 1200x630px for optimal social media display"
              />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Twitter Card</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="twitterTitle">Twitter Title</Label>
                <Input
                  id="twitterTitle"
                  name="twitterTitle"
                  defaultValue={post?.twitterTitle}
                  placeholder="Leave empty to use meta title"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="twitterDescription">Twitter Description</Label>
                <Textarea
                  id="twitterDescription"
                  name="twitterDescription"
                  defaultValue={post?.twitterDescription}
                  placeholder="Leave empty to use meta description"
                  rows={3}
                  className="mt-2"
                />
              </div>

              <ImageUpload
                label="Twitter Image"
                name="twitterImage"
                defaultValue={post?.twitterImage}
                placeholder="Leave empty to use featured image"
                description="Recommended size: 1200x675px for Twitter cards"
              />
            </div>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Publication Settings</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">Status *</Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={post?.status || "draft"}
                  required
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  defaultChecked={post?.featured}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Featured Post (Show on homepage)
                </Label>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Cancel
        </Button>

        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            <Save className="w-4 h-4" />
            {isSubmitting ? "Saving..." : post ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </div>
    </form>
  )
}
