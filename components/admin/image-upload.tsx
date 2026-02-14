"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  label: string
  name: string
  defaultValue?: string
  required?: boolean
  description?: string
}

export function ImageUpload({ label, name, defaultValue = "", required = false, description }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(defaultValue)
  const [previewUrl, setPreviewUrl] = useState(defaultValue)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB")
      return
    }

    setIsUploading(true)

    try {
      // Create a local preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to server
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      setImageUrl(data.url)
    } catch (error) {
      console.error("[v0] Upload error:", error)
      alert("Failed to upload image. Using local preview instead.")
      // Keep the local preview even if upload fails
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setImageUrl("")
    setPreviewUrl("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <Label htmlFor={name}>
        {label} {required && "*"}
      </Label>

      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={imageUrl} />

      {/* Image Preview */}
      {previewUrl && (
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
          <Image src={previewUrl || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        className="w-full gap-2 bg-transparent"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        <Upload className="w-4 h-4" />
        {isUploading ? "Uploading..." : "Browse & Upload Image"}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label={`Upload ${label}`}
      />

      {description && <p className="text-sm text-gray-500">{description}</p>}

      {!previewUrl && (
        <div className="flex items-center justify-center w-full h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">No image selected</p>
          </div>
        </div>
      )}
    </div>
  )
}
