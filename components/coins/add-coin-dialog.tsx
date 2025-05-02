"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, Search, Check, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export interface CoinFormData {
  name: string
  symbol: string
  address: string
  coinType: string
  description: string
  telegramUrl: string
  twitterUrl: string
  websiteUrl: string
  image: string | null
  hasAddress?: boolean
}

interface AddCoinDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: CoinFormData) => void
  initialData?: CoinFormData
  isEditing?: boolean
}

export function AddCoinDialog({ open, onOpenChange, onSave, initialData, isEditing = false }: AddCoinDialogProps) {
  const [activeTab, setActiveTab] = useState("load")
  const [formData, setFormData] = useState<CoinFormData>({
    name: "",
    symbol: "",
    address: "",
    coinType: "",
    description: "",
    telegramUrl: "",
    twitterUrl: "",
    websiteUrl: "",
    image: null,
    hasAddress: false,
  })

  const [addressInput, setAddressInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadedCoinData, setLoadedCoinData] = useState<any>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize form with initial data if provided (for editing)
  useEffect(() => {
    if (initialData && open) {
      setFormData(initialData)
      setAddressInput(initialData.address || "")

      // If editing, start on the metadata tab
      if (isEditing) {
        setActiveTab("metadata")
      }
    }
  }, [initialData, open, isEditing])

  // Reset form when dialog closes
  useEffect(() => {
    if (!open && !isEditing) {
      setFormData({
        name: "",
        symbol: "",
        address: "",
        coinType: "",
        description: "",
        telegramUrl: "",
        twitterUrl: "",
        websiteUrl: "",
        image: null,
        hasAddress: false,
      })
      setAddressInput("")
      setLoadedCoinData(null)
      setActiveTab("load")
    }
  }, [open, isEditing])

  const coinTypeOptions = [
    { id: "spl", label: "SPL Coin" },
    { id: "token-2022", label: "Coin 2022" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressInput(e.target.value)
  }

  const handleCoinTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      coinType: value,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData((prev) => ({
          ...prev,
          image: event.target.result as string,
        }))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleLoadCoin = async () => {
    if (!addressInput.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter a coin address to load",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate loading coin data from an API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real implementation, you would fetch coin data from an API
      // For now, we'll simulate finding a coin with mock data
      const mockCoinData = {
        name: `Coin ${addressInput.substring(0, 4)}`,
        symbol: addressInput.substring(0, 3).toUpperCase(),
        coinType: formData.coinType || (Math.random() > 0.5 ? "spl" : "token-2022"),
        description: "This coin was loaded from the blockchain.",
        telegramUrl: `https://t.me/${addressInput.substring(0, 6).toLowerCase()}`,
        twitterUrl: `https://twitter.com/${addressInput.substring(0, 6).toLowerCase()}`,
        websiteUrl: `https://${addressInput.substring(0, 6).toLowerCase()}.com`,
        totalSupply: Math.floor(Math.random() * 1000000000),
        holders: Math.floor(Math.random() * 10000),
        createdAt: new Date().toISOString(),
      }

      // Store the loaded coin data
      setLoadedCoinData(mockCoinData)

      // Update form with the loaded data
      setFormData((prev) => ({
        ...prev,
        name: mockCoinData.name,
        symbol: mockCoinData.symbol,
        address: addressInput,
        coinType: mockCoinData.coinType,
        description: mockCoinData.description,
        telegramUrl: mockCoinData.telegramUrl,
        twitterUrl: mockCoinData.twitterUrl,
        websiteUrl: mockCoinData.websiteUrl,
        hasAddress: true,
      }))

      toast({
        title: "Coin Loaded",
        description: `Successfully loaded ${mockCoinData.name} (${mockCoinData.symbol})`,
      })
    } catch (error) {
      toast({
        title: "Error Loading Coin",
        description: "Failed to load coin data. Please check the address and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveLoadedCoin = () => {
    if (!loadedCoinData) {
      toast({
        title: "No Coin Loaded",
        description: "Please load a coin first",
        variant: "destructive",
      })
      return
    }

    // Save the loaded coin data
    onSave({
      ...formData,
      address: addressInput,
      hasAddress: true,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate that a coin type is selected
    if (!formData.coinType) {
      toast({
        title: "Coin Type Required",
        description: "Please select a coin type",
        variant: "destructive",
      })
      return
    }

    // Update the form data with the current address input
    const finalFormData = {
      ...formData,
      address: addressInput,
      hasAddress: !!addressInput.trim(),
    }

    // Save the form data
    onSave(finalFormData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[80%] bg-[#11111D] border-gray-800 text-[#ECF1F0] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-gray-800 pb-2">
          <DialogTitle className="text-sm font-semibold text-[#ECF1F0]">
            {isEditing ? "Edit Coin" : "Add New Coin"}
          </DialogTitle>
        </DialogHeader>

        {/* Coin Type Selection - Always visible at the top */}
        <div className="border-b border-gray-800 pb-3 pt-2">
          <Label className="text-xs text-[#ECF1F0] mb-2 block">Coin Type (Required)</Label>
          <RadioGroup
            value={formData.coinType}
            onValueChange={handleCoinTypeChange}
            className="border border-gray-800 rounded-md p-2 bg-[#1A1A1A]"
          >
            <div className="grid grid-cols-2 gap-2">
              {coinTypeOptions.map((coinType) => (
                <div key={coinType.id} className="flex items-center space-x-2">
                  <RadioGroupItem id={coinType.id} value={coinType.id} className="border-gray-600 text-amber-600" />
                  <Label htmlFor={coinType.id} className="text-xs text-[#ECF1F0]">
                    {coinType.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2 mb-4 bg-[#1A1A1A] p-0.5 border border-gray-800">
            <TabsTrigger
              value="load"
              className="text-xs data-[state=active]:bg-amber-600 data-[state=active]:text-black data-[state=active]:font-medium data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-400"
            >
              Load Coin
            </TabsTrigger>
            <TabsTrigger
              value="metadata"
              className="text-xs data-[state=active]:bg-amber-600 data-[state=active]:text-black data-[state=active]:font-medium data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-400"
            >
              Coin Metadata
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Load Coin */}
          <TabsContent value="load" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-end space-x-2">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="coinAddress" className="text-xs text-[#ECF1F0]">
                    Coin Address
                  </Label>
                  <Input
                    id="coinAddress"
                    value={addressInput}
                    onChange={handleAddressInputChange}
                    className="h-7 text-xs bg-[#1A1A1A] border-gray-800 text-[#ECF1F0]"
                    placeholder="Enter coin address to load existing coin"
                    disabled={isEditing && initialData?.address !== ""}
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="h-7 px-3 text-xs gradient-green"
                  onClick={handleLoadCoin}
                  disabled={isLoading || (isEditing && initialData?.address !== "") || !addressInput.trim()}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spin h-3 w-3 border-2 border-white rounded-full border-t-transparent mr-1"></span>
                      Loading...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Search className="h-3 w-3 mr-1" /> Load
                    </span>
                  )}
                </Button>
              </div>
              <p className="text-[10px] text-gray-400">
                Enter a coin address to load existing coin data or go to the Metadata tab to create a new coin
              </p>

              {/* Display loaded coin data */}
              {loadedCoinData && (
                <div className="mt-4 border border-gray-800 rounded-md p-3 bg-[#1A1A1A]">
                  <h3 className="text-sm font-medium text-[#ECF1F0] mb-2 flex items-center">
                    <Check className="h-4 w-4 mr-1 text-green-500" /> Coin Loaded Successfully
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-400">Name</p>
                      <p className="text-sm text-[#ECF1F0]">{loadedCoinData.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Symbol</p>
                      <p className="text-sm text-[#ECF1F0]">{loadedCoinData.symbol}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Type</p>
                      <p className="text-sm text-[#ECF1F0]">
                        {loadedCoinData.coinType === "spl" ? "SPL Coin" : "Coin 2022"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Total Supply</p>
                      <p className="text-sm text-[#ECF1F0]">{loadedCoinData.totalSupply.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Holders</p>
                      <p className="text-sm text-[#ECF1F0]">{loadedCoinData.holders.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Created</p>
                      <p className="text-sm text-[#ECF1F0]">
                        {new Date(loadedCoinData.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs text-gray-400">Description</p>
                    <p className="text-sm text-[#ECF1F0]">{loadedCoinData.description}</p>
                  </div>

                  <div className="flex justify-between mt-4">
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 px-3 text-xs bg-transparent border-gray-700 text-[#ECF1F0] hover:bg-gray-800"
                        onClick={() => setActiveTab("metadata")}
                      >
                        Edit Metadata
                      </Button>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      className="h-7 px-3 text-xs gradient-green"
                      onClick={handleSaveLoadedCoin}
                    >
                      Save Coin
                    </Button>
                  </div>
                </div>
              )}

              {!loadedCoinData && !isLoading && addressInput.trim() && (
                <div className="mt-4 border border-gray-800 rounded-md p-3 bg-[#1A1A1A] flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                  <p className="text-xs text-gray-300">
                    Click Load to fetch coin data or go to the Metadata tab to enter details manually
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tab 2: Coin Metadata */}
          <TabsContent value="metadata">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-xs text-[#ECF1F0]">
                  Coin Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="h-7 text-xs bg-[#1A1A1A] border-gray-800 text-[#ECF1F0]"
                  placeholder="Enter coin name"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="symbol" className="text-xs text-[#ECF1F0]">
                  Coin Symbol
                </Label>
                <Input
                  id="symbol"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleInputChange}
                  className="h-7 text-xs bg-[#1A1A1A] border-gray-800 text-[#ECF1F0]"
                  placeholder="Enter coin symbol (e.g., BTC)"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="telegramUrl" className="text-xs text-[#ECF1F0]">
                  Telegram URL
                </Label>
                <Input
                  id="telegramUrl"
                  name="telegramUrl"
                  value={formData.telegramUrl}
                  onChange={handleInputChange}
                  className="h-7 text-xs bg-[#1A1A1A] border-gray-800 text-[#ECF1F0]"
                  placeholder="https://t.me/..."
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="twitterUrl" className="text-xs text-[#ECF1F0]">
                  Twitter URL
                </Label>
                <Input
                  id="twitterUrl"
                  name="twitterUrl"
                  value={formData.twitterUrl}
                  onChange={handleInputChange}
                  className="h-7 text-xs bg-[#1A1A1A] border-gray-800 text-[#ECF1F0]"
                  placeholder="https://twitter.com/..."
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="websiteUrl" className="text-xs text-[#ECF1F0]">
                  Website URL
                </Label>
                <Input
                  id="websiteUrl"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleInputChange}
                  className="h-7 text-xs bg-[#1A1A1A] border-gray-800 text-[#ECF1F0]"
                  placeholder="https://..."
                />
              </div>

              <div className="md:col-span-3 space-y-1">
                <Label htmlFor="description" className="text-xs text-[#ECF1F0]">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="text-xs bg-[#1A1A1A] border-gray-800 text-[#ECF1F0] min-h-[60px]"
                  placeholder="Enter coin description"
                />
              </div>

              <div className="md:col-span-4 space-y-2">
                <Label className="text-xs text-[#ECF1F0]">Coin Image</Label>
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 rounded-full border border-gray-700 flex items-center justify-center overflow-hidden bg-[#1A1A1A]">
                    {formData.image ? (
                      <img
                        src={formData.image || "/placeholder.svg"}
                        alt="Coin"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Upload className="h-6 w-6 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs bg-transparent border-gray-700 text-[#ECF1F0] hover:bg-gray-800"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Upload Image
                      </Button>
                      {formData.image && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs bg-transparent border-gray-700 text-red-400 hover:bg-gray-800 hover:text-red-300"
                          onClick={handleRemoveImage}
                        >
                          <X className="h-3 w-3 mr-1" /> Remove
                        </Button>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Recommended: Square image, 256x256px or larger</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 flex justify-end pt-2 border-t border-gray-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="mr-2 h-7 text-xs bg-transparent border-gray-700 text-[#ECF1F0] hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button type="submit" className="h-7 text-xs gradient-green">
                  {isEditing ? "Update" : "Save"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
