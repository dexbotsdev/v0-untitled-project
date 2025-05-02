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
import { Loader2, RefreshCw, Upload, Key, Shield, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const { toast } = useToast()
  const router = useRouter()

  // State for wallet management
  const [devWalletAddress, setDevWalletAddress] = useState("")
  const [fundingWalletAddress, setFundingWalletAddress] = useState("")
  const [importingDevWallet, setImportingDevWallet] = useState(false)
  const [importingFundingWallet, setImportingFundingWallet] = useState(false)
  const [generatingDevWallet, setGeneratingDevWallet] = useState(false)
  const [generatingFundingWallet, setGeneratingFundingWallet] = useState(false)
  const [privateKey, setPrivateKey] = useState("")

  // State for transaction settings
  const [antiBubblemap, setAntiBubblemap] = useState(false)
  const [priorityFee, setPriorityFee] = useState(1.5)

  // State for license management
  const [licenseKey, setLicenseKey] = useState(localStorage.getItem("licenseKey") || "")
  const [updatingLicense, setUpdatingLicense] = useState(false)

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

  // Handle license key update
  const handleLicenseUpdate = async () => {
    if (!licenseKey) {
      toast({
        title: "Error",
        description: "Please enter a license key",
        variant: "destructive",
      })
      return
    }

    setUpdatingLicense(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Validate license key format
    if (!licenseKey.startsWith("BOSS-") || licenseKey.length < 10) {
      setUpdatingLicense(false)
      toast({
        title: "Invalid License",
        description: "License key format is invalid. Should start with BOSS- and be at least 10 characters.",
        variant: "destructive",
      })
      return
    }

    localStorage.setItem("licenseKey", licenseKey)
    localStorage.setItem("isAuthenticated", "true")

    setUpdatingLicense(false)

    toast({
      title: "License Updated",
      description: "Your license key has been updated successfully",
    })
  }

  // Handle license reset
  const handleLicenseReset = async () => {
    setUpdatingLicense(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    localStorage.removeItem("licenseKey")
    localStorage.removeItem("isAuthenticated")
    setLicenseKey("")

    setUpdatingLicense(false)

    toast({
      title: "License Reset",
      description: "Your license has been reset. You will need to authenticate again.",
    })

    // Redirect to license validator after a short delay
    setTimeout(() => {
      router.push("/license-validator")
    }, 1500)
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
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

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleImportWallet("dev")}
                    disabled={importingDevWallet || !privateKey}
                    className="flex-1"
                  >
                    {importingDevWallet && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {importingDevWallet ? "Importing..." : "Import Wallet"}
                    {!importingDevWallet && <Upload className="ml-2 h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={() => handleGenerateWallet("dev")}
                    disabled={generatingDevWallet}
                    variant="outline"
                    className="flex-1"
                  >
                    {generatingDevWallet && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {generatingDevWallet ? "Generating..." : "Generate New"}
                    {!generatingDevWallet && <RefreshCw className="ml-2 h-4 w-4" />}
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

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleImportWallet("funding")}
                    disabled={importingFundingWallet || !privateKey}
                    className="flex-1"
                  >
                    {importingFundingWallet && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {importingFundingWallet ? "Importing..." : "Import Wallet"}
                    {!importingFundingWallet && <Upload className="ml-2 h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={() => handleGenerateWallet("funding")}
                    disabled={generatingFundingWallet}
                    variant="outline"
                    className="flex-1"
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

        {/* License Management */}
        <Card className="bg-black border-gray-800 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-amber-500" />
              License Management
            </CardTitle>
            <CardDescription>Manage your BOSS license key</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="license-key">License Key</Label>
              <Input
                id="license-key"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                placeholder="Enter your BOSS license key"
                className="font-mono"
              />
            </div>

            <div className="p-3 bg-[#111] rounded-md">
              <p className="text-sm text-gray-400">
                Your license key provides access to all BOSS features. If you need to purchase a new license or have
                issues with your current one, please contact support.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleLicenseReset} disabled={updatingLicense}>
              {updatingLicense ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset License"}
            </Button>
            <Button onClick={handleLicenseUpdate} disabled={updatingLicense || !licenseKey}>
              {updatingLicense && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {updatingLicense ? "Updating..." : "Update License"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
