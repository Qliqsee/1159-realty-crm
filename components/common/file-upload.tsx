"use client"

import { useState, useRef, ChangeEvent } from "react"
import { Upload, X, File, Image as ImageIcon, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { FileUpload } from "@/types"

interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  onFilesChange: (files: FileUpload[]) => void
  allowUrl?: boolean
  className?: string
}

export function FileUploadComponent({
  accept = "*",
  multiple = false,
  maxSize = 10,
  onFilesChange,
  allowUrl = true,
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileUpload[]>([])
  const [urlInput, setUrlInput] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (selectedFiles: File[]) => {
    const newFiles: FileUpload[] = selectedFiles.map((file) => {
      const isImage = file.type.startsWith("image/")
      return {
        id: Math.random().toString(36).substring(7),
        file,
        name: file.name,
        type: file.type,
        size: file.size,
        preview: isImage ? URL.createObjectURL(file) : undefined,
        status: "pending",
        progress: 0,
      }
    })

    // Check file sizes
    const oversizedFiles = newFiles.filter((f) => f.size > maxSize * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      alert(`Some files exceed the ${maxSize}MB limit`)
      return
    }

    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(Array.from(e.target.files))
    }
  }

  const handleUrlAdd = () => {
    if (!urlInput.trim()) return

    const newFile: FileUpload = {
      id: Math.random().toString(36).substring(7),
      url: urlInput,
      name: urlInput.split("/").pop() || "Linked file",
      type: "url",
      size: 0,
      status: "pending",
      progress: 0,
    }

    const updatedFiles = multiple ? [...files, newFile] : [newFile]
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
    setUrlInput("")
  }

  const handleRemove = (id: string) => {
    const updatedFiles = files.filter((f) => f.id !== id)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      handleFileSelect(Array.from(e.dataTransfer.files))
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50"
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm font-medium mb-1">
          Click to upload or drag and drop
        </p>
        <p className="text-xs text-muted-foreground">
          {accept === "*" ? "Any file type" : accept} (Max {maxSize}MB)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* URL Input */}
      {allowUrl && (
        <div className="space-y-2">
          <Label>Or add file URL</Label>
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://example.com/file.pdf"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <Button type="button" onClick={handleUrlAdd} variant="outline">
              <LinkIcon className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <Label>Uploaded Files</Label>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 shadow-soft"
              >
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                ) : file.url ? (
                  <LinkIcon className="h-12 w-12 p-3 rounded bg-primary/10 text-primary" />
                ) : (
                  <File className="h-12 w-12 p-3 rounded bg-primary/10 text-primary" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {file.size > 0 ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "URL"}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(file.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
