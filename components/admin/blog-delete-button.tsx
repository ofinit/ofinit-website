"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteBlogPost } from "@/app/actions/blog-actions"

export function BlogDeleteButton({ postId }: { postId: string }) {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="sm"
      type="button"
      onClick={async () => {
        if (!confirm("Delete this blog post?")) return
        const res = await deleteBlogPost(postId)
        if (res.success) router.refresh()
        else alert(res.error || "Delete failed")
      }}
    >
      <Trash2 className="w-4 h-4 text-red-600" />
    </Button>
  )
}
