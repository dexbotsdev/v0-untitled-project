"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Package, Tag } from "lucide-react"

interface TagBundlesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTagBundles: (bundles: string[], tag: string) => void
  bundleCount: number
}

export function TagBundlesDialog({ open, onOpenChange, onTagBundles, bundleCount }: TagBundlesDialogProps) {
  const [tag, setTag] = useState("")
  const [bundleRange, setBundleRange] = useState([Math.min(10, bundleCount)])

  const handleTag = () => {
    // Generate mock bundle IDs for the selected range
    const bundleIds = Array(bundleRange[0])
      .fill(0)
      .map((_, i) => `bundle-${Date.now()}-${i}`)

    onTagBundles(bundleIds, tag)

    // Reset form
    setTag("")
    setBundleRange([Math.min(10, bundleCount)])

    onOpenChange(false)
  }

  const isValid = tag.trim() !== "" && bundleRange[0] > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#1e2133] border-gray-800 text-stone-200">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Tag className="mr-2 h-5 w-5 text-blue-500" />
            Tag Bundle Groups
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Add tags to bundle groups for better organization and tracking.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="tag" className="text-sm font-medium">
              Tag Name
            </Label>
            <Input
              id="tag"
              placeholder="e.g., high-priority, test-batch"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Number of Bundles to Tag</Label>
              <Badge variant="outline" className="text-xs">
                {bundleRange[0]} bundles
              </Badge>
            </div>
            <Slider
              value={bundleRange}
              onValueChange={setBundleRange}
              max={bundleCount}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1 bundle</span>
              <span>{bundleCount} bundles</span>
            </div>
          </div>

          <div className="bg-gray-800/30 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Package className="mr-2 h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Bundle Selection Preview</span>
            </div>
            <div className="text-xs text-gray-400">
              This will tag the first {bundleRange[0]} available bundle groups with the tag "{tag || "your-tag"}".
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-700 text-gray-300">
            Cancel
          </Button>
          <Button onClick={handleTag} disabled={!isValid} className="bg-blue-600 hover:bg-blue-700 text-white">
            Tag Bundles
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
