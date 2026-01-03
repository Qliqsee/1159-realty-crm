"use client"

import { useState } from "react"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: number
  maxHeight?: number
  className?: string
}

/**
 * RichTextEditor - Simple markdown-style rich text editor
 *
 * Note: This is a basic implementation. For production, consider using
 * a library like TipTap, Slate, or Quill
 *
 * Usage:
 * <RichTextEditor
 *   value={content}
 *   onChange={setContent}
 *   placeholder="Write something..."
 * />
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  minHeight = 200,
  maxHeight = 500,
  className,
}: RichTextEditorProps) {
  const [selectionStart, setSelectionStart] = useState(0)
  const [selectionEnd, setSelectionEnd] = useState(0)

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    setSelectionStart(target.selectionStart)
    setSelectionEnd(target.selectionEnd)
  }

  const insertFormatting = (before: string, after: string = before) => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end)

    onChange(newText)

    // Restore selection
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + before.length,
        end + before.length
      )
    }, 0)
  }

  const toolbar = [
    {
      icon: Bold,
      label: "Bold",
      action: () => insertFormatting("**"),
    },
    {
      icon: Italic,
      label: "Italic",
      action: () => insertFormatting("*"),
    },
    {
      icon: Underline,
      label: "Underline",
      action: () => insertFormatting("__"),
    },
    {
      icon: Code,
      label: "Code",
      action: () => insertFormatting("`"),
    },
    {
      icon: List,
      label: "Bullet List",
      action: () => insertFormatting("\n- ", "\n"),
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      action: () => insertFormatting("\n1. ", "\n"),
    },
    {
      icon: Link,
      label: "Link",
      action: () => insertFormatting("[", "](url)"),
    },
    {
      icon: Image,
      label: "Image",
      action: () => insertFormatting("![alt](", ")"),
    },
  ]

  return (
    <div className={cn("space-y-2", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border rounded-t-lg bg-muted/30">
        {toolbar.map((tool, index) => {
          const Icon = tool.icon
          return (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              onClick={tool.action}
              className="h-8 w-8"
              title={tool.label}
              type="button"
            >
              <Icon className="h-4 w-4" />
            </Button>
          )
        })}
      </div>

      {/* Editor */}
      <Textarea
        value={value}
        onChange={handleTextareaChange}
        onSelect={handleSelect}
        placeholder={placeholder}
        className="font-mono text-sm rounded-t-none resize-none"
        style={{
          minHeight: `${minHeight}px`,
          maxHeight: `${maxHeight}px`,
        }}
      />

      {/* Character Count */}
      <div className="flex justify-end">
        <span className="text-xs text-muted-foreground">
          {value.length} characters
        </span>
      </div>
    </div>
  )
}
