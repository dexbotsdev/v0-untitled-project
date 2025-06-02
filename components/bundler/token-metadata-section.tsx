"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { X, ImageIcon } from "lucide-react"

interface TokenMetadataProps {
  tokenMetadata?: {
    name: string
    symbol: string
    description: string
    image?: string
    telegram?: string
    twitter?: string
    website?: string
  }
}

export function TokenMetadataSection({ tokenMetadata = {} }: TokenMetadataProps) {
  const [name, setName] = useState(tokenMetadata.name || "")
  const [symbol, setSymbol] = useState(tokenMetadata.symbol || "")
  const [description, setDescription] = useState(tokenMetadata.description || "")
  const [image, setImage] = useState<string | null>(tokenMetadata.image || null)
  const [telegram, setTelegram] = useState(tokenMetadata.telegram || "")
  const [twitter, setTwitter] = useState(tokenMetadata.twitter || "")
  const [website, setWebsite] = useState(tokenMetadata.website || "")
  const [isDragging, setIsDragging] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
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
    const file = e.dataTransfer.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImage(null)
  }

  const saveToLocalStorage = () => {
    const metadata = {
      name,
      symbol,
      description,
      image,
      telegram,
      twitter,
      website,
    }
    localStorage.setItem("tokenMetadata", JSON.stringify(metadata))
    alert("Token metadata saved to local storage")
  }

  return (
    <div className="space-y-6">
      <Card className="border-gray-800 bg-gray-900/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-400">Token Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token-name">Token Name</Label>
                <Input
                  id="token-name"
                  placeholder="e.g., Pepe Coin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="token-symbol">Token Symbol</Label>
                <Input
                  id="token-symbol"
                  placeholder="e.g., PEPE"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="token-description">Description</Label>
                <Textarea
                  id="token-description"
                  placeholder="Enter token description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white min-h-[100px]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Token Image</Label>
                {image ? (
                  <div className="relative w-full h-40 rounded-md overflow-hidden border border-gray-700">
                    <img src={image || "/placeholder.svg"} alt="Token" className="w-full h-full object-contain" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center h-40 transition-colors ${
                      isDragging
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-700 hover:border-gray-600 bg-gray-800/30"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <ImageIcon className="h-10 w-10 text-gray-500 mb-2" />
                    <p className="text-sm text-gray-400 mb-2">Drag & drop image or</p>
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <span className="bg-gray-700 hover:bg-gray-600 text-white text-xs py-1 px-3 rounded-md">
                        Browse Files
                      </span>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="telegram">Telegram</Label>
                  <Input
                    id="telegram"
                    placeholder="https://t.me/yourgroup"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    placeholder="https://twitter.com/youraccount"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://yourwebsite.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={saveToLocalStorage}>
              Save Token Metadata
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
