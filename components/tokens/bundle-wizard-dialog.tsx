"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Check, InfoIcon } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import {
  RaydiumLogo,
  PumpFunLogo,
  MoonShotLogo,
  JustLaunchLogo,
  LaunchLabLogo,
  PumpSwapLogo,
  MeteoraLogo,
  CookMemeLogo,
  LetsBonkLogo,
} from "@/components/platform-logos"

// Define interfaces for data structures
interface WalletAccount {
  id: number
  name: string
  numberOfWallets: number
  isActive: boolean
  walletType: string
}

interface BundleWallet {
  id: number
  address: string
  amount: number
}

// Update the BundleData interface to include token settings
interface BundleData {
  platform: string
  mode: string
  tokenTax: number
  revokeFreeze: boolean
  revokeMint: boolean
  devWalletBuyAmount: number
  walletAccount: WalletAccount | null
  wallets: BundleWallet[]
  estimatedGasTotal: number
  estimatedTimeToComplete: string
  estimatedSuccess: number
}

interface BundleWizardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (bundleData: BundleData) => void
  // Mock wallet accounts to populate the dropdown
  availableWalletAccounts: WalletAccount[]
}

export function BundleWizardDialog({
  open,
  onOpenChange,
  onSave,
  availableWalletAccounts = [],
}: BundleWizardDialogProps) {
  // Track the current step
  const [currentStep, setCurrentStep] = useState(1)

  // Update the initial state to include the new fields
  const [bundleData, setBundleData] = useState<BundleData>({
    platform: "",
    mode: "bundleBlock0",
    tokenTax: 5,
    revokeFreeze: false,
    revokeMint: false,
    devWalletBuyAmount: 10,
    walletAccount: null,
    wallets: [],
    estimatedGasTotal: 0,
    estimatedTimeToComplete: "",
    estimatedSuccess: 0,
  })

  // Reset form when dialog opens - update to include new fields
  useEffect(() => {
    if (open) {
      setCurrentStep(1)
      setBundleData({
        platform: "",
        mode: "bundleBlock0",
        tokenTax: 5,
        revokeFreeze: false,
        revokeMint: false,
        devWalletBuyAmount: 10,
        walletAccount: null,
        wallets: [],
        estimatedGasTotal: 0,
        estimatedTimeToComplete: "",
        estimatedSuccess: 0,
      })
    }
  }, [open])

  // Generate wallets when wallet account is selected
  useEffect(() => {
    if (bundleData.walletAccount) {
      // Generate mockup wallets based on the wallet account
      const mockWallets: BundleWallet[] = Array.from(
        { length: bundleData.walletAccount.numberOfWallets },
        (_, index) => ({
          id: index + 1,
          address: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
          amount: Number.parseFloat((Math.random() * 1 + 0.1).toFixed(2)), // Random amount between 0.1 and 1.1
        }),
      )

      setBundleData((prev) => ({
        ...prev,
        wallets: mockWallets,
      }))
    }
  }, [bundleData.walletAccount])

  // Calculate statistics and estimates when needed data changes
  useEffect(() => {
    if (bundleData.walletAccount && bundleData.wallets.length > 0) {
      const totalAmount =
        bundleData.wallets.reduce((sum, wallet) => sum + wallet.amount, 0) + bundleData.devWalletBuyAmount
      const estimatedGas = totalAmount * 0.0015 // Mockup gas calculation

      // Estimate time based on the mode
      let timeEstimate = ""
      switch (bundleData.mode) {
        case "justLaunch":
          timeEstimate = "1-2 minutes"
          break
        case "bundleBlock0":
          timeEstimate = "30-60 seconds"
          break
        case "delayedLaunch":
          timeEstimate = "3-5 minutes"
          break
        case "stagLaunch":
          timeEstimate = "5-10 minutes"
          break
      }

      // Mockup success rate
      let successRate = 0
      switch (bundleData.mode) {
        case "justLaunch":
          successRate = 75
          break
        case "bundleBlock0":
          successRate = 95
          break
        case "delayedLaunch":
          successRate = 85
          break
        case "stagLaunch":
          successRate = 90
          break
      }

      setBundleData((prev) => ({
        ...prev,
        estimatedGasTotal: estimatedGas,
        estimatedTimeToComplete: timeEstimate,
        estimatedSuccess: successRate,
      }))
    }
  }, [bundleData.walletAccount, bundleData.wallets, bundleData.devWalletBuyAmount, bundleData.mode])

  // Handle mode selection
  const handleModeChange = (mode: string) => {
    setBundleData((prev) => ({
      ...prev,
      mode,
    }))
  }

  // Handle dev wallet buy amount change
  const handleDevAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value) || 0
    setBundleData((prev) => ({
      ...prev,
      devWalletBuyAmount: value,
    }))
  }

  // Handle wallet account selection
  const handleWalletAccountSelect = (accountId: string) => {
    const account = availableWalletAccounts.find((acc) => acc.id.toString() === accountId)
    setBundleData((prev) => ({
      ...prev,
      walletAccount: account || null,
    }))
  }

  // Handle wallet amount change
  const handleWalletAmountChange = (id: number, amount: number) => {
    setBundleData((prev) => ({
      ...prev,
      wallets: prev.wallets.map((wallet) => (wallet.id === id ? { ...wallet, amount } : wallet)),
    }))
  }

  // Add a function to handle platform selection
  const handlePlatformChange = (platform: string) => {
    setBundleData((prev) => ({
      ...prev,
      platform,
    }))
  }

  // Add handlers for the new fields
  const handleTokenTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value) || 0
    setBundleData((prev) => ({
      ...prev,
      tokenTax: Math.min(Math.max(value, 0), 100), // Clamp between 0 and 100
    }))
  }

  const handleRevokeToggle = (field: "revokeFreeze" | "revokeMint") => {
    setBundleData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  // Update the handleNextStep function to validate the new step
  const handleNextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 1 && !bundleData.platform) {
      toast({
        title: "Select a Platform",
        description: "Please select a platform to continue",
        variant: "destructive",
      })
      return
    }

    // Check if we need to skip the token settings step (for managed platforms)
    const isManagedPlatform = ["pump-fun", "moonshot", "just-launch", "launchlab", "cook-meme", "lets-bonk"].includes(
      bundleData.platform,
    )

    if (currentStep === 1 && isManagedPlatform) {
      // Skip to step 3 (Mode selection) for managed platforms
      setCurrentStep(3)
      return
    }

    // Add validation for the token settings step
    if (currentStep === 2) {
      const needsTokenTax = !["pump-fun", "moonshot", "just-launch", "launchlab", "cook-meme", "lets-bonk"].includes(
        bundleData.platform,
      )

      if (needsTokenTax && (bundleData.tokenTax < 0 || bundleData.tokenTax > 100)) {
        toast({
          title: "Invalid Token Tax",
          description: "Token tax must be between 0 and 100%",
          variant: "destructive",
        })
        return
      }
    }

    if (currentStep === 3 && !bundleData.mode) {
      toast({
        title: "Select a Mode",
        description: "Please select a bundling mode to continue",
        variant: "destructive",
      })
      return
    }

    if (currentStep === 4 && bundleData.devWalletBuyAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid dev wallet buy amount",
        variant: "destructive",
      })
      return
    }

    if (currentStep === 5 && !bundleData.walletAccount) {
      toast({
        title: "Select Wallet Account",
        description: "Please select a wallet account to continue",
        variant: "destructive",
      })
      return
    }

    if (currentStep === 6) {
      // Ensure all wallets have valid amounts
      const invalidWallets = bundleData.wallets.filter((w) => w.amount <= 0)
      if (invalidWallets.length > 0) {
        toast({
          title: "Invalid Wallet Amounts",
          description: `${invalidWallets.length} wallets have invalid amounts`,
          variant: "destructive",
        })
        return
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 7))
  }

  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep === 3) {
      const isManagedPlatform = ["pump-fun", "moonshot", "just-launch", "launchlab", "cook-meme", "lets-bonk"].includes(
        bundleData.platform,
      )

      if (isManagedPlatform) {
        setCurrentStep(1) // Skip back to platform selection for managed platforms
        return
      }
    }

    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  // Handle save
  const handleSave = () => {
    onSave(bundleData)
    onOpenChange(false)

    toast({
      title: "Bundle Setup Complete",
      description: "Your bundle has been set up successfully!",
    })
  }

  // Get mode description
  const getModeDescription = (mode: string) => {
    switch (mode) {
      case "justLaunch":
        return "Simple launch with minimal setup. Good for standard launches with less competition."
      case "bundleBlock0":
        return "Targets block 0 for maximum efficiency. Best for competitive launches where timing is critical."
      case "delayedLaunch":
        return "Staggered launch with delay periods. Good for avoiding front-running and distributing buys over time."
      case "stagLaunch":
        return "Multi-stage launch pattern with coordinated wallet groups. Best for complex launches with multiple phases."
      default:
        return ""
    }
  }

  // Add a helper function to get a readable platform label
  const getPlatformLabel = (platformId: string) => {
    switch (platformId) {
      case "raydium-amm":
        return "Raydium AMM"
      case "raydium-cpmm":
        return "Raydium CPMM"
      case "raydium-clmm":
        return "Raydium CLMM"
      case "pump-fun":
        return "Pump.Fun"
      case "pump-swap":
        return "PumpSwap"
      case "moonshot":
        return "MoonShot"
      case "meteora-dyn":
        return "Meteora DYN"
      case "just-launch":
        return "JustLaunch"
      case "launchlab":
        return "Launchlab"
      case "cook-meme":
        return "COOKMEME"
      case "lets-bonk":
        return "LETSBONK"
      default:
        return platformId
    }
  }

  // Function to render the platform logo based on platform ID
  const renderPlatformLogo = (platformId: string, className = "h-6 w-6") => {
    switch (platformId) {
      case "raydium-amm":
      case "raydium-cpmm":
      case "raydium-clmm":
        return <RaydiumLogo className={className} />
      case "pump-fun":
        return <PumpFunLogo className={className} />
      case "moonshot":
        return <MoonShotLogo className={className} />
      case "just-launch":
        return <JustLaunchLogo className={className} />
      case "launchlab":
        return <LaunchLabLogo className={className} />
      case "pump-swap":
        return <PumpSwapLogo className={className} />
      case "meteora-dyn":
        return <MeteoraLogo className={className} />
      case "cook-meme":
        return <CookMemeLogo className={className} />
      case "lets-bonk":
        return <LetsBonkLogo className={className} />
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[700px] bg-[#11111D] border-gray-800 text-[#ECF1F0] max-h-[90vh] overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b border-gray-800 pb-2">
          <DialogTitle className="text-sm font-semibold text-[#ECF1F0]">Bundle Configuration Wizard</DialogTitle>
        </DialogHeader>

        {/* Update the Progress indicator to include the new step */}
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Platform</span>
            <span>Settings</span>
            <span>Mode</span>
            <span>Dev Amount</span>
            <span>Wallet Account</span>
            <span>Configure</span>
            <span>Review</span>
          </div>
          <Progress value={(currentStep * 100) / 7} className="h-1 bg-gray-700" />
        </div>

        {/* Add the new Platform selection step */}
        {currentStep === 1 && (
          <div className="py-4 space-y-4">
            <h3 className="text-sm font-medium text-[#ECF1F0]">Select Platform</h3>
            <p className="text-xs text-gray-400 mb-4">Choose the platform for your token launch.</p>

            <div className="space-y-5">
              {/* Managed Platforms Section */}
              <div>
                <h4 className="text-xs font-medium text-amber-500 mb-3 border-b border-gray-800 pb-1">
                  Managed Platforms
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { id: "pump-fun", name: "Pump.Fun" },
                    { id: "moonshot", name: "MoonShot" },
                    { id: "just-launch", name: "JustLaunch" },
                    { id: "launchlab", name: "Launchlab" },
                    { id: "cook-meme", name: "COOKMEME" },
                    { id: "lets-bonk", name: "LETSBONK" },
                  ].map((platform) => (
                    <div
                      key={platform.id}
                      className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                        bundleData.platform === platform.id
                          ? "bg-amber-900/20 border-amber-600/50 text-amber-400"
                          : "bg-[#1A1A1A] border-gray-800 hover:bg-gray-800/30"
                      }`}
                      onClick={() => handlePlatformChange(platform.id)}
                    >
                      <div className="mr-3">{renderPlatformLogo(platform.id)}</div>
                      <div className="text-xs font-medium">{platform.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Manual Platforms Section */}
              <div>
                <h4 className="text-xs font-medium text-amber-500 mb-3 border-b border-gray-800 pb-1">
                  Manual Platforms
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { id: "raydium-amm", name: "Raydium AMM" },
                    { id: "raydium-cpmm", name: "Raydium CPMM" },
                    { id: "raydium-clmm", name: "Raydium CLMM" },
                    { id: "pump-swap", name: "PumpSwap" },
                    { id: "meteora-dyn", name: "Meteora DYN" },
                  ].map((platform) => (
                    <div
                      key={platform.id}
                      className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                        bundleData.platform === platform.id
                          ? "bg-amber-900/20 border-amber-600/50 text-amber-400"
                          : "bg-[#1A1A1A] border-gray-800 hover:bg-gray-800/30"
                      }`}
                      onClick={() => handlePlatformChange(platform.id)}
                    >
                      <div className="mr-3">{renderPlatformLogo(platform.id)}</div>
                      <div className="text-xs font-medium">{platform.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add the new Token Settings step */}
        {currentStep === 2 && (
          <div className="py-4 space-y-4">
            <h3 className="text-sm font-medium text-[#ECF1F0]">Token Settings</h3>
            <p className="text-xs text-gray-400 mb-4">
              Configure token-specific settings for {getPlatformLabel(bundleData.platform)}.
            </p>

            <div className="space-y-4 border border-gray-800 rounded-md p-4 bg-[#1A1A1A]">
              {/* Show Token Tax for all manual platforms */}
              {!["pump-fun", "moonshot", "just-launch", "launchlab", "cook-meme", "lets-bonk"].includes(
                bundleData.platform,
              ) && (
                <div className="space-y-2">
                  <Label htmlFor="tokenTax" className="text-xs text-[#ECF1F0]">
                    Token Tax (%)
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="tokenTax"
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      value={bundleData.tokenTax}
                      onChange={handleTokenTaxChange}
                      className="h-8 text-sm bg-[#11111D] border-gray-800 text-[#ECF1F0]"
                    />
                    <span className="text-xs text-amber-500">%</span>
                  </div>
                  <p className="text-xs text-gray-400">Set the tax percentage applied to token transactions.</p>
                </div>
              )}

              {/* Always show these options */}
              <div className="space-y-3 mt-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="revokeFreeze"
                    checked={bundleData.revokeFreeze}
                    onChange={() => handleRevokeToggle("revokeFreeze")}
                    className="h-4 w-4 rounded border-gray-700 bg-[#11111D] text-amber-600 focus:ring-amber-600"
                  />
                  <Label htmlFor="revokeFreeze" className="text-xs text-[#ECF1F0] cursor-pointer">
                    Revoke Freeze Authority
                  </Label>
                </div>
                <p className="text-xs text-gray-400 ml-6">Permanently revoke the ability to freeze token accounts.</p>

                <div className="flex items-center space-x-2 mt-3">
                  <input
                    type="checkbox"
                    id="revokeMint"
                    checked={bundleData.revokeMint}
                    onChange={() => handleRevokeToggle("revokeMint")}
                    className="h-4 w-4 rounded border-gray-700 bg-[#11111D] text-amber-600 focus:ring-amber-600"
                  />
                  <Label htmlFor="revokeMint" className="text-xs text-[#ECF1F0] cursor-pointer">
                    Revoke Mint Authority
                  </Label>
                </div>
                <p className="text-xs text-gray-400 ml-6">Permanently revoke the ability to mint additional tokens.</p>
              </div>
            </div>

            <div className="border border-amber-800/50 rounded-md p-4 bg-amber-900/10">
              <div className="flex items-start space-x-3">
                <InfoIcon className="h-4 w-4 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="text-xs font-medium text-[#ECF1F0] mb-1">
                    Platform: {getPlatformLabel(bundleData.platform)}
                  </h4>
                  <p className="text-xs text-gray-400">Configure token settings according to your launch strategy.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Update the mode selection step to be step 3 instead of 1 */}
        {currentStep === 3 && (
          <div className="py-4 space-y-4">
            <h3 className="text-sm font-medium text-[#ECF1F0]">Select Bundling Mode</h3>
            <p className="text-xs text-gray-400 mb-4">Choose how you want to bundle your token for launch.</p>

            <RadioGroup value={bundleData.mode} onValueChange={handleModeChange} className="space-y-3">
              {["justLaunch", "bundleBlock0", "delayedLaunch", "stagLaunch"].map((mode) => (
                <div
                  key={mode}
                  className={`flex items-start space-x-3 border border-gray-800 rounded-md p-3 cursor-pointer hover:bg-gray-800/30 ${
                    bundleData.mode === mode ? "bg-amber-900/20 border-amber-600/50" : "bg-[#1A1A1A]"
                  }`}
                  onClick={() => handleModeChange(mode)}
                >
                  <RadioGroupItem id={mode} value={mode} className="border-gray-600 text-amber-600 mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={mode} className="text-sm text-[#ECF1F0] cursor-pointer">
                      {mode === "justLaunch"
                        ? "Just Launch"
                        : mode === "bundleBlock0"
                          ? "Bundle Block 0"
                          : mode === "delayedLaunch"
                            ? "Delayed Launch"
                            : "Staggered Launch"}
                    </Label>
                    <p className="text-xs text-gray-400 mt-1">{getModeDescription(mode)}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Update the Dev Wallet step to be step 4 */}
        {currentStep === 4 && (
          <div className="py-4 space-y-4">
            <h3 className="text-sm font-medium text-[#ECF1F0]">Developer Wallet Configuration</h3>
            <p className="text-xs text-gray-400 mb-4">
              Set the amount that your developer wallet will use to buy tokens at launch.
            </p>

            <div className="space-y-3">
              <div className="border border-gray-800 rounded-md p-4 bg-[#1A1A1A]">
                <Label htmlFor="devAmount" className="text-xs text-[#ECF1F0] mb-2 block">
                  Dev Wallet Buy Amount (SOL)
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="devAmount"
                    type="number"
                    min={0.1}
                    step={0.1}
                    value={bundleData.devWalletBuyAmount}
                    onChange={handleDevAmountChange}
                    className="h-8 text-sm bg-[#11111D] border-gray-800 text-[#ECF1F0]"
                  />
                  <span className="text-xs text-amber-500">SOL</span>
                </div>
                <p className="text-xs text-gray-400 mt-2 flex items-center">
                  <InfoIcon className="h-3 w-3 mr-1 text-amber-500" />
                  This amount will be used by your dev wallet to buy tokens at launch.
                </p>
              </div>

              <div className="border border-gray-800 rounded-md p-4 bg-amber-900/10 border-amber-800/30">
                <h4 className="text-xs font-medium text-[#ECF1F0] mb-2">
                  Selected Platform: {getPlatformLabel(bundleData.platform)}
                </h4>
                <h4 className="text-xs font-medium text-[#ECF1F0] mb-2">
                  Selected Mode:{" "}
                  {bundleData.mode === "justLaunch"
                    ? "Just Launch"
                    : bundleData.mode === "bundleBlock0"
                      ? "Bundle Block 0"
                      : bundleData.mode === "delayedLaunch"
                        ? "Delayed Launch"
                        : "Staggered Launch"}
                </h4>
                <p className="text-xs text-gray-400">{getModeDescription(bundleData.mode)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Update the Wallet Account step to be step 5 */}
        {currentStep === 5 && (
          <div className="py-4 space-y-4">
            <h3 className="text-sm font-medium text-[#ECF1F0]">Select Wallet Account</h3>
            <p className="text-xs text-gray-400 mb-4">Choose which wallet account to use for this bundle.</p>

            <div className="space-y-3">
              <div className="border border-gray-800 rounded-md p-4 bg-[#1A1A1A]">
                <Label htmlFor="walletAccount" className="text-xs text-[#ECF1F0] mb-2 block">
                  Wallet Account
                </Label>

                <Select onValueChange={handleWalletAccountSelect} value={bundleData.walletAccount?.id.toString() || ""}>
                  <SelectTrigger className="w-full h-9 text-sm bg-[#11111D] border-gray-800 text-[#ECF1F0]">
                    <SelectValue placeholder="Select a wallet account" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#11111D] border-gray-800 text-[#ECF1F0]">
                    {availableWalletAccounts.length > 0 ? (
                      availableWalletAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id.toString()} className="hover:bg-gray-800">
                          {account.name} ({account.numberOfWallets} wallets)
                        </SelectItem>
                      ))
                    ) : (
                      <div className="py-2 px-2 text-xs text-gray-400 text-center">
                        No wallet accounts available. Please create one in the Wallets section.
                      </div>
                    )}
                  </SelectContent>
                </Select>

                {bundleData.walletAccount && (
                  <div className="mt-3 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-gray-400">Account Type:</div>
                      <div className="text-[#ECF1F0]">
                        {bundleData.walletAccount.walletType === "bundler"
                          ? "Bundler"
                          : bundleData.walletAccount.walletType === "volume"
                            ? "Volume Boost"
                            : "Sniper"}
                      </div>

                      <div className="text-gray-400">Number of Wallets:</div>
                      <div className="text-[#ECF1F0]">{bundleData.walletAccount.numberOfWallets}</div>

                      <div className="text-gray-400">Status:</div>
                      <div className="text-[#ECF1F0]">{bundleData.walletAccount.isActive ? "Active" : "Inactive"}</div>
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-3 flex items-center">
                  <InfoIcon className="h-3 w-3 mr-1 text-amber-500" />
                  The selected wallet account will be used for bundling. Make sure it has enough wallets.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Update the Wallet Amount Configuration step to be step 6 */}
        {currentStep === 6 && (
          <div className="py-4 space-y-4">
            <h3 className="text-sm font-medium text-[#ECF1F0]">Configure Wallet Amounts</h3>
            <p className="text-xs text-gray-400 mb-4">Set the amount each wallet will use to buy tokens at launch.</p>

            <div className="border border-gray-800 rounded-md overflow-hidden">
              <div className="max-h-[300px] overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-800/50 sticky top-0">
                    <tr>
                      <th className="py-2 px-3 text-left">#</th>
                      <th className="py-2 px-3 text-left">Wallet Address</th>
                      <th className="py-2 px-3 text-right">Amount (SOL)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/30">
                    {bundleData.wallets.map((wallet) => (
                      <tr key={wallet.id} className="hover:bg-gray-800/20">
                        <td className="py-2 px-3">{wallet.id}</td>
                        <td className="py-2 px-3 font-mono">
                          {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
                        </td>
                        <td className="py-2 px-3">
                          <Input
                            type="number"
                            min={0.001}
                            step={0.001}
                            value={wallet.amount}
                            onChange={(e) =>
                              handleWalletAmountChange(wallet.id, Number.parseFloat(e.target.value) || 0)
                            }
                            className="h-7 text-xs w-24 ml-auto bg-[#11111D] border-gray-800 text-[#ECF1F0]"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between items-center py-2 px-2 bg-amber-900/10 rounded-md border border-amber-800/30">
              <span className="text-xs text-gray-400">Total SOL to deploy:</span>
              <span className="text-sm font-medium text-amber-400">
                {bundleData.wallets.reduce((sum, wallet) => sum + wallet.amount, 0).toFixed(3)} SOL
              </span>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs bg-transparent border-gray-700 text-amber-500"
                onClick={() => {
                  // Set all wallet amounts to the same value
                  const amount = Number.parseFloat(prompt("Enter amount for all wallets:", "0.5") || "0")
                  if (!isNaN(amount) && amount > 0) {
                    setBundleData((prev) => ({
                      ...prev,
                      wallets: prev.wallets.map((wallet) => ({ ...wallet, amount })),
                    }))
                  }
                }}
              >
                Set All
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-xs bg-transparent border-gray-700 text-amber-500"
                onClick={() => {
                  // Distribute amounts randomly between a min and max
                  const min = Number.parseFloat(prompt("Enter minimum amount:", "0.1") || "0")
                  const max = Number.parseFloat(prompt("Enter maximum amount:", "1.0") || "0")

                  if (!isNaN(min) && !isNaN(max) && min > 0 && max > min) {
                    setBundleData((prev) => ({
                      ...prev,
                      wallets: prev.wallets.map((wallet) => ({
                        ...wallet,
                        amount: Number.parseFloat((Math.random() * (max - min) + min).toFixed(3)),
                      })),
                    }))
                  }
                }}
              >
                Randomize
              </Button>
            </div>
          </div>
        )}

        {/* Update the Review step to be step 7 and include platform information */}
        {currentStep === 7 && (
          <div className="py-4 space-y-4">
            <h3 className="text-sm font-medium text-[#ECF1F0]">Review Configuration</h3>
            <p className="text-xs text-gray-400 mb-4">Review your bundle configuration before saving.</p>

            <div className="space-y-4">
              <div className="border border-gray-800 rounded-md p-4 bg-[#1A1A1A]">
                <h4 className="text-xs font-medium text-[#ECF1F0] mb-2">Bundle Configuration</h4>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div className="text-gray-400">Platform:</div>
                  <div className="text-[#ECF1F0] flex items-center">
                    {renderPlatformLogo(bundleData.platform, "h-4 w-4")}
                    <span className="ml-2">{getPlatformLabel(bundleData.platform)}</span>
                  </div>

                  <div className="text-gray-400">Platform Type:</div>
                  <div className="text-[#ECF1F0]">
                    {["pump-fun", "moonshot", "just-launch", "launchlab", "cook-meme", "lets-bonk"].includes(
                      bundleData.platform,
                    )
                      ? "Managed"
                      : "Manual"}
                  </div>

                  {/* Show token settings if applicable */}
                  {!["pump-fun", "moonshot", "just-launch", "launchlab", "cook-meme", "lets-bonk"].includes(
                    bundleData.platform,
                  ) && (
                    <>
                      <div className="text-gray-400">Token Tax:</div>
                      <div className="text-[#ECF1F0]">{bundleData.tokenTax}%</div>
                    </>
                  )}

                  {!["pump-fun", "moonshot", "just-launch", "launchlab", "cook-meme", "lets-bonk"].includes(
                    bundleData.platform,
                  ) && (
                    <>
                      <div className="text-gray-400">Revoke Freeze Authority:</div>
                      <div className="text-[#ECF1F0]">{bundleData.revokeFreeze ? "Yes" : "No"}</div>

                      <div className="text-gray-400">Revoke Mint Authority:</div>
                      <div className="text-[#ECF1F0]">{bundleData.revokeMint ? "Yes" : "No"}</div>
                    </>
                  )}

                  <div className="text-gray-400">Bundling Mode:</div>
                  <div className="text-[#ECF1F0]">
                    {bundleData.mode === "justLaunch"
                      ? "Just Launch"
                      : bundleData.mode === "bundleBlock0"
                        ? "Bundle Block 0"
                        : bundleData.mode === "delayedLaunch"
                          ? "Delayed Launch"
                          : "Staggered Launch"}
                  </div>

                  <div className="text-gray-400">Dev Wallet Buy Amount:</div>
                  <div className="text-[#ECF1F0]">{bundleData.devWalletBuyAmount} SOL</div>

                  <div className="text-gray-400">Wallet Account:</div>
                  <div className="text-[#ECF1F0]">{bundleData.walletAccount?.name || "None"}</div>

                  <div className="text-gray-400">Number of Wallets:</div>
                  <div className="text-[#ECF1F0]">{bundleData.wallets.length}</div>

                  <div className="text-gray-400">Total Wallet Buy Amount:</div>
                  <div className="text-[#ECF1F0]">
                    {bundleData.wallets.reduce((sum, wallet) => sum + wallet.amount, 0).toFixed(3)} SOL
                  </div>

                  <div className="text-gray-400">Grand Total (incl. Dev):</div>
                  <div className="text-amber-400 font-medium">
                    {(
                      bundleData.wallets.reduce((sum, wallet) => sum + wallet.amount, 0) + bundleData.devWalletBuyAmount
                    ).toFixed(3)}{" "}
                    SOL
                  </div>
                </div>
              </div>

              <div className="border border-gray-800 rounded-md p-4 bg-[#1A1A1A]">
                <h4 className="text-xs font-medium text-[#ECF1F0] mb-2">Execution Estimates</h4>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div className="text-gray-400">Estimated Gas Total:</div>
                  <div className="text-[#ECF1F0]">{bundleData.estimatedGasTotal.toFixed(4)} SOL</div>

                  <div className="text-gray-400">Estimated Time to Complete:</div>
                  <div className="text-[#ECF1F0]">{bundleData.estimatedTimeToComplete}</div>

                  <div className="text-gray-400">Estimated Success Rate:</div>
                  <div className="text-[#ECF1F0]">{bundleData.estimatedSuccess}%</div>
                </div>
              </div>

              <div className="border border-amber-800/50 rounded-md p-4 bg-amber-900/10">
                <div className="flex items-start space-x-3">
                  <InfoIcon className="h-4 w-4 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-medium text-[#ECF1F0] mb-1">Ready to Execute</h4>
                    <p className="text-xs text-gray-400">
                      Your bundle configuration is ready to be saved. Click Save to proceed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between border-t border-gray-800 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className="h-8 text-xs bg-transparent border-gray-700 text-[#ECF1F0] hover:bg-gray-800"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Previous
          </Button>

          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs bg-transparent border-gray-700 text-[#ECF1F0] hover:bg-gray-800 mr-2"
            >
              Cancel
            </Button>

            {currentStep < 7 ? (
              <Button variant="default" size="sm" onClick={handleNextStep} className="h-8 text-xs gradient-green">
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button variant="default" size="sm" onClick={handleSave} className="h-8 text-xs gradient-green">
                <Check className="mr-1 h-4 w-4" /> Save Bundle
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
