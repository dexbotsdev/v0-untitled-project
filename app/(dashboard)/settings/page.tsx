"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { Loader2, RefreshCw, Upload, Shield, Wallet, ArrowDownToLine, Repeat } from "lucide-react"

export default function SettingsPage() {
  const { toast } = useToast()

  // State for wallet management
  const [devWalletAddress, setDevWalletAddress] = useState("")
  const [fundingWalletAddress, setFundingWalletAddress] = useState("")
  const [importingDevWallet, setImportingDevWallet] = useState(false)
  const [importingFundingWallet, setImportingFundingWallet] = useState(false)
  const [generatingDevWallet, setGeneratingDevWallet] = useState(false)
  const [generatingFundingWallet, setGeneratingFundingWallet] = useState(false)
  const [privateKey, setPrivateKey] = useState("")

  // Add these after the existing state variables
  const [recoveringDevWallet, setRecoveringDevWallet] = useState(false)
  const [recoveringFundingWallet, setRecoveringFundingWallet] = useState(false)
  const [convertingDevWallet, setConvertingDevWallet] = useState(false)
  const [convertingFundingWallet, setConvertingFundingWallet] = useState(false)

  // State for transaction settings
  const [antiBubblemap, setAntiBubblemap] = useState(false)
  const [priorityFee, setPriorityFee] = useState(1.5)

  // Handle wallet import
  const handleImportWallet = async (type: "dev" | "funding") => {
    if (!privateKey) {
      toast({
        title: "Error",
        description: "Please enter a private key",
        variant: "destructive",
      })
      return
    }

    if (type === "dev") {
      setImportingDevWallet(true)
    } else {
      setImportingFundingWallet(true)
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockAddress = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`

    if (type === "dev") {
      setDevWalletAddress(mockAddress)
      setImportingDevWallet(false)
    } else {
      setFundingWalletAddress(mockAddress)
      setImportingFundingWallet(false)
    }

    setPrivateKey("")

    toast({
      title: "Success",
      description: `${type === "dev" ? "Development" : "Funding"} wallet imported successfully`,
    })
  }

  // Handle wallet generation
  const handleGenerateWallet = async (type: "dev" | "funding") => {
    if (type === "dev") {
      setGeneratingDevWallet(true)
    } else {
      setGeneratingFundingWallet(true)
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockAddress = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`

    if (type === "dev") {
      setDevWalletAddress(mockAddress)
      setGeneratingDevWallet(false)
    } else {
      setFundingWalletAddress(mockAddress)
      setGeneratingFundingWallet(false)
    }

    toast({
      title: "Success",
      description: `New ${type === "dev" ? "development" : "funding"} wallet generated`,
    })
  }

  // Handle wallet recovery
  const handleRecoverWallet = async (type: "dev" | "funding") => {
    if (type === "dev" && !devWalletAddress) {
      toast({
        title: "Error",
        description: "No development wallet address found",
        variant: "destructive",
      })
      return
    }

    if (type === "funding" && !fundingWalletAddress) {
      toast({
        title: "Error",
        description: "No funding wallet address found",
        variant: "destructive",
      })
      return
    }

    if (type === "dev") {
      setRecoveringDevWallet(true)
    } else {
      setRecoveringFundingWallet(true)
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (type === "dev") {
      setRecoveringDevWallet(false)
    } else {
      setRecoveringFundingWallet(false)
    }

    toast({
      title: "Recovery Successful",
      description: `Successfully recovered funds from ${type === "dev" ? "development" : "funding"} wallet`,
    })
  }

  // Handle SOL-WSOL conversion
  const handleSolWsolConversion = async (type: "dev" | "funding") => {
    if (type === "dev" && !devWalletAddress) {
      toast({
        title: "Error",
        description: "No development wallet address found",
        variant: "destructive",
      })
      return
    }

    if (type === "funding" && !fundingWalletAddress) {
      toast({
        title: "Error",
        description: "No funding wallet address found",
        variant: "destructive",
      })
      return
    }

    if (type === "dev") {
      setConvertingDevWallet(true)
    } else {
      setConvertingFundingWallet(true)
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (type === "dev") {
      setConvertingDevWallet(false)
    } else {
      setConvertingFundingWallet(false)
    }

    toast({
      title: "Conversion Successful",
      description: `Successfully converted SOL ↔ WSOL for ${type === "dev" ? "development" : "funding"} wallet`,
    })
  }

  // Handle anti-bubblemap toggle
  const handleAntiBubblemapToggle = () => {
    setAntiBubblemap(!antiBubblemap)
    toast({
      title: "Settings Updated",
      description: `Anti-Bubblemap protection ${!antiBubblemap ? "enabled" : "disabled"}`,
    })
  }

  // Handle priority fee change
  const handlePriorityFeeChange = (value: number[]) => {
    setPriorityFee(value[0])
  }

  return (
    <div className="container mx-auto p-6 space-y-8 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="h-8 w-8 text-amber-500" />
          Settings
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wallet Management */}
        <Card className="bg-black border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-amber-500" />
              Wallet Management
            </CardTitle>
            <CardDescription>Configure your development and funding wallets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="dev" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-[#111] mb-4">
                <TabsTrigger
                  value="dev"
                  className="data-[state=active]:bg-amber-600 data-[state=active]:text-black data-[state=active]:font-medium"
                >
                  Development Wallet
                </TabsTrigger>
                <TabsTrigger
                  value="funding"
                  className="data-[state=active]:bg-amber-600 data-[state=active]:text-black data-[state=active]:font-medium"
                >
                  Funding Wallet
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dev" className="space-y-4">
                {devWalletAddress ? (
                  <div className="p-3 bg-[#111] rounded-md">
                    <p className="text-sm text-gray-400 mb-1">Current Development Wallet</p>
                    <p className="font-mono text-sm break-all">{devWalletAddress}</p>
                  </div>
                ) : (
                  <div className="p-3 bg-[#111] rounded-md">
                    <p className="text-sm text-gray-400">No development wallet configured</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="dev-private-key">Private Key (for import)</Label>
                  <Input
                    id="dev-private-key"
                    type="password"
                    placeholder="Enter private key to import"
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                    className="font-mono"
                  />
                </div>

                <div className="flex gap-3 flex-wrap">
                  <Button
                    onClick={() => handleImportWallet("dev")}
                    disabled={importingDevWallet || !privateKey}
                    className="flex-1 min-w-[120px]"
                  >
                    {importingDevWallet && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {importingDevWallet ? "Importing..." : "Import Wallet"}
                    {!importingDevWallet && <Upload className="ml-2 h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={() => handleGenerateWallet("dev")}
                    disabled={generatingDevWallet}
                    variant="outline"
                    className="flex-1 min-w-[120px]"
                  >
                    {generatingDevWallet && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {generatingDevWallet ? "Generating..." : "Generate New"}
                    {!generatingDevWallet && <RefreshCw className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <Button
                    onClick={() => handleRecoverWallet("dev")}
                    disabled={recoveringDevWallet || !devWalletAddress}
                    variant="ghost"
                    className="flex-1 min-w-[120px] bg-amber-700/20 text-amber-400 hover:bg-amber-700/30 hover:text-amber-300"
                  >
                    {recoveringDevWallet && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {recoveringDevWallet ? "Recovering..." : "Recover"}
                    {!recoveringDevWallet && <ArrowDownToLine className="ml-2 h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={() => handleSolWsolConversion("dev")}
                    disabled={convertingDevWallet || !devWalletAddress}
                    variant="ghost"
                    className="flex-1 min-w-[120px] bg-blue-700/20 text-blue-400 hover:bg-blue-700/30 hover:text-blue-300"
                  >
                    {convertingDevWallet && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {convertingDevWallet ? "Converting..." : "SOL ↔ WSOL"}
                    {!convertingDevWallet && <Repeat className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="funding" className="space-y-4">
                {fundingWalletAddress ? (
                  <div className="p-3 bg-[#111] rounded-md">
                    <p className="text-sm text-gray-400 mb-1">Current Funding Wallet</p>
                    <p className="font-mono text-sm break-all">{fundingWalletAddress}</p>
                  </div>
                ) : (
                  <div className="p-3 bg-[#111] rounded-md">
                    <p className="text-sm text-gray-400">No funding wallet configured</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="funding-private-key">Private Key (for import)</Label>
                  <Input
                    id="funding-private-key"
                    type="password"
                    placeholder="Enter private key to import"
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                    className="font-mono"
                  />
                </div>

                <div className="flex gap-3 flex-wrap">
                  <Button
                    onClick={() => handleImportWallet("funding")}
                    disabled={importingFundingWallet || !privateKey}
                    className="flex-1 min-w-[120px]"
                  >
                    {importingFundingWallet && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {importingFundingWallet ? "Importing..." : "Import Wallet"}
                    {!importingFundingWallet && <Upload className="ml-2 h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={() => handleGenerateWallet("funding")}
                    disabled={generatingFundingWallet}
                    variant="outline"
                    className="flex-1 min-w-[120px]"
                  >
                    {generatingFundingWallet && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {generatingFundingWallet ? "Generating..." : "Generate New"}
                    {!generatingFundingWallet && <RefreshCw className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Transaction Settings */}
        <Card className="bg-black border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-500" />
              Transaction Settings
            </CardTitle>
            <CardDescription>Configure transaction behavior and security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="anti-bubblemap">Anti-Bubblemap Protection</Label>
                <p className="text-sm text-gray-400">Protect transactions from bubblemap attacks and frontrunning</p>
              </div>
              <Switch id="anti-bubblemap" checked={antiBubblemap} onCheckedChange={handleAntiBubblemapToggle} />
            </div>

            <div className="space-y-4">
              <div className="space-y-0.5">
                <Label htmlFor="priority-fee">Default Priority Fee (GWEI)</Label>
                <p className="text-sm text-gray-400">Higher values may result in faster transaction processing</p>
              </div>
              <div className="space-y-3">
                <Slider
                  id="priority-fee"
                  defaultValue={[priorityFee]}
                  max={10}
                  min={0.1}
                  step={0.1}
                  onValueChange={handlePriorityFeeChange}
                  className="w-full"
                />
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">0.1</span>
                  <span className="text-sm font-medium text-amber-500">{priorityFee.toFixed(1)}</span>
                  <span className="text-sm text-gray-400">10.0</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-gray-500">
              These settings will be applied to all new transactions. Existing transactions will not be affected.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
