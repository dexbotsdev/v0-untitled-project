"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Check, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface BundleWizardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: any) => void
  availableWalletAccounts: Array<{
    id: number
    name: string
    numberOfWallets: number
    isActive: boolean
    walletType: string
  }>
}

export function BundleWizardDialog({ open, onOpenChange, onSave, availableWalletAccounts }: BundleWizardDialogProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPlatform, setSelectedPlatform] = useState("raydium-cpmm")
  const [selectedMode, setSelectedMode] = useState("justLaunch")
  const [selectedWalletAccount, setSelectedWalletAccount] = useState<number | null>(null)
  const [tokenTax, setTokenTax] = useState(5)
  const [revokeFreeze, setRevokeFreeze] = useState(true)
  const [revokeMint, setRevokeMint] = useState(true)
  const [wallets, setWallets] = useState<Array<{ address: string; amount: number }>>([])

  // Reset state when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset state
      setCurrentStep(1)
      setSelectedPlatform("raydium-cpmm")
      setSelectedMode("justLaunch")
      setSelectedWalletAccount(null)
      setTokenTax(5)
      setRevokeFreeze(true)
      setRevokeMint(true)
      setWallets([])
    }
    onOpenChange(open)
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = () => {
    // If no wallets have been generated yet, generate them
    if (wallets.length === 0 && selectedWalletAccount !== null) {
      const selectedAccount = availableWalletAccounts.find((account) => account.id === selectedWalletAccount)
      if (selectedAccount) {
        const generatedWallets = Array.from({ length: selectedAccount.numberOfWallets }, (_, i) => ({
          address: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
          amount: Math.random() * 2 + 0.5, // Random amount between 0.5 and 2.5 SOL
        }))
        setWallets(generatedWallets)

        // Save the bundle data
        onSave({
          platform: selectedPlatform,
          mode: selectedMode,
          walletAccountId: selectedWalletAccount,
          tokenTax: tokenTax,
          revokeFreeze: revokeFreeze,
          revokeMint: revokeMint,
          wallets: generatedWallets,
        })
      }
    } else {
      // Save the bundle data with existing wallets
      onSave({
        platform: selectedPlatform,
        mode: selectedMode,
        walletAccountId: selectedWalletAccount,
        tokenTax: tokenTax,
        revokeFreeze: revokeFreeze,
        revokeMint: revokeMint,
        wallets: wallets,
      })
    }

    // Close the dialog
    onOpenChange(false)
  }

  const platformOptions = [
    { id: "raydium-cpmm", label: "Raydium CPMM", description: "Constant Product Market Maker" },
    { id: "raydium-amm", label: "Raydium AMM", description: "Automated Market Maker" },
    { id: "raydium-clmm", label: "Raydium CLMM", description: "Concentrated Liquidity Market Maker" },
    { id: "pump-fun", label: "Pump.Fun", description: "Pump.Fun Platform" },
    { id: "pump-swap", label: "PumpSwap", description: "PumpSwap Platform" },
    { id: "moonshot", label: "MoonShot", description: "MoonShot Platform" },
    { id: "meteora-dyn", label: "Meteora DYN", description: "Meteora Dynamic AMM" },
  ]

  const modeOptions = [
    { id: "justLaunch", label: "Just Launch", description: "Simple launch without bundling" },
    { id: "bundleBlock0", label: "Bundle Block 0", description: "Bundle transactions in block 0" },
    { id: "delayedLaunch", label: "Delayed Launch", description: "Launch with a delay" },
    { id: "stagLaunch", label: "Staggered Launch", description: "Launch in stages" },
  ]

  // Check if the platform requires token tax settings
  const showTokenTaxSettings = selectedPlatform !== "pump-fun" && selectedPlatform !== "moonshot"

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[#11111D] border-gray-800 text-[#ECF1F0] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#ECF1F0]">Bundle Wizard</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                    currentStep === step
                      ? "bg-amber-700 text-white"
                      : currentStep > step
                        ? "bg-green-700 text-white"
                        : "bg-gray-800 text-gray-400",
                  )}
                >
                  {currentStep > step ? <Check className="h-4 w-4" /> : step}
                </div>
                <span
                  className={cn(
                    "text-xs mt-1",
                    currentStep === step ? "text-amber-400" : currentStep > step ? "text-green-400" : "text-gray-500",
                  )}
                >
                  {step === 1
                    ? "Platform"
                    : step === 2
                      ? "Mode"
                      : step === 3
                        ? "Wallets"
                        : step === 4
                          ? "Settings"
                          : ""}
                </span>
              </div>
            ))}
          </div>

          {/* Step 1: Platform Selection */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[#ECF1F0] mb-2">Select Platform</h3>
              <RadioGroup value={selectedPlatform} onValueChange={setSelectedPlatform} className="space-y-2">
                {platformOptions.map((platform) => (
                  <div
                    key={platform.id}
                    className={cn(
                      "flex items-center space-x-2 rounded-md border p-3 cursor-pointer",
                      selectedPlatform === platform.id
                        ? "border-amber-600 bg-amber-900/20"
                        : "border-gray-800 hover:bg-gray-800/30",
                    )}
                    onClick={() => setSelectedPlatform(platform.id)}
                  >
                    <RadioGroupItem value={platform.id} id={platform.id} className="border-gray-600 text-amber-600" />
                    <div className="flex-1">
                      <Label htmlFor={platform.id} className="text-sm font-medium text-[#ECF1F0] cursor-pointer">
                        {platform.label}
                      </Label>
                      <p className="text-xs text-gray-400">{platform.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Step 2: Mode Selection */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[#ECF1F0] mb-2">Select Bundle Mode</h3>
              <RadioGroup value={selectedMode} onValueChange={setSelectedMode} className="space-y-2">
                {modeOptions.map((mode) => (
                  <div
                    key={mode.id}
                    className={cn(
                      "flex items-center space-x-2 rounded-md border p-3 cursor-pointer",
                      selectedMode === mode.id
                        ? "border-amber-600 bg-amber-900/20"
                        : "border-gray-800 hover:bg-gray-800/30",
                    )}
                    onClick={() => setSelectedMode(mode.id)}
                  >
                    <RadioGroupItem value={mode.id} id={mode.id} className="border-gray-600 text-amber-600" />
                    <div className="flex-1">
                      <Label htmlFor={mode.id} className="text-sm font-medium text-[#ECF1F0] cursor-pointer">
                        {mode.label}
                      </Label>
                      <p className="text-xs text-gray-400">{mode.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Step 3: Wallet Selection */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[#ECF1F0] mb-2">Select Wallet Account</h3>
              <RadioGroup
                value={selectedWalletAccount?.toString() || ""}
                onValueChange={(value) => setSelectedWalletAccount(Number(value))}
                className="space-y-2"
              >
                {availableWalletAccounts.map((account) => (
                  <div
                    key={account.id}
                    className={cn(
                      "flex items-center space-x-2 rounded-md border p-3",
                      selectedWalletAccount === account.id
                        ? "border-amber-600 bg-amber-900/20"
                        : "border-gray-800 hover:bg-gray-800/30",
                      !account.isActive && "opacity-50",
                    )}
                  >
                    <RadioGroupItem
                      value={account.id.toString()}
                      id={`wallet-${account.id}`}
                      className="border-gray-600 text-amber-600"
                      disabled={!account.isActive}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor={`wallet-${account.id}`}
                          className="text-sm font-medium text-[#ECF1F0] cursor-pointer"
                        >
                          {account.name}
                        </Label>
                        <span className="text-xs px-2 py-0.5 bg-gray-800 rounded-full text-gray-300">
                          {account.numberOfWallets} wallets
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">Type: {account.walletType}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Step 4: Settings */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-sm font-medium text-[#ECF1F0] mb-2">Configure Bundle Settings</h3>

              {/* Token Tax Settings (only for certain platforms) */}
              {showTokenTaxSettings && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="token-tax" className="text-sm">
                      Token Tax (%)
                    </Label>
                    <span className="text-amber-400 font-medium">{tokenTax}%</span>
                  </div>
                  <Slider
                    id="token-tax"
                    min={0}
                    max={10}
                    step={0.5}
                    value={[tokenTax]}
                    onValueChange={(value) => setTokenTax(value[0])}
                    className="[&_[role=slider]]:bg-amber-600"
                  />
                  <p className="text-xs text-gray-400">
                    Set the token tax percentage. This will be applied to all transactions.
                  </p>
                </div>
              )}

              {/* Authority Settings */}
              <div className="space-y-4 border border-gray-800 rounded-md p-3 bg-[#1A1A1A]">
                <h4 className="text-sm font-medium text-[#ECF1F0]">Authority Settings</h4>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="revoke-freeze" className="text-sm">
                      Revoke Freeze Authority
                    </Label>
                    <p className="text-xs text-gray-400">Permanently remove the ability to freeze token accounts</p>
                  </div>
                  <Switch
                    id="revoke-freeze"
                    checked={revokeFreeze}
                    onCheckedChange={setRevokeFreeze}
                    className="data-[state=checked]:bg-amber-700"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="revoke-mint" className="text-sm">
                      Revoke Mint Authority
                    </Label>
                    <p className="text-xs text-gray-400">Permanently remove the ability to mint new tokens</p>
                  </div>
                  <Switch
                    id="revoke-mint"
                    checked={revokeMint}
                    onCheckedChange={setRevokeMint}
                    className="data-[state=checked]:bg-amber-700"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="border border-gray-800 rounded-md p-3 bg-[#1A1A1A]">
                <h4 className="text-sm font-medium text-[#ECF1F0] mb-2">Bundle Summary</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Platform:</span>
                    <span className="text-[#ECF1F0]">
                      {platformOptions.find((p) => p.id === selectedPlatform)?.label || selectedPlatform}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mode:</span>
                    <span className="text-[#ECF1F0]">
                      {modeOptions.find((m) => m.id === selectedMode)?.label || selectedMode}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Wallets:</span>
                    <span className="text-[#ECF1F0]">
                      {selectedWalletAccount
                        ? availableWalletAccounts.find((a) => a.id === selectedWalletAccount)?.numberOfWallets || 0
                        : 0}
                    </span>
                  </div>
                  {showTokenTaxSettings && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Token Tax:</span>
                      <span className="text-[#ECF1F0]">{tokenTax}%</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Authorities Revoked:</span>
                    <span className="text-[#ECF1F0]">
                      {revokeFreeze && revokeMint
                        ? "Freeze & Mint"
                        : revokeFreeze
                          ? "Freeze"
                          : revokeMint
                            ? "Mint"
                            : "None"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-4 pt-4 border-t border-gray-800">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="bg-transparent border-gray-700 text-[#ECF1F0] hover:bg-gray-800"
          >
            Back
          </Button>
          <div>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="mr-2 bg-transparent border-gray-700 text-[#ECF1F0] hover:bg-gray-800"
            >
              Cancel
            </Button>
            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                className="bg-amber-700 hover:bg-amber-600 text-white"
                disabled={
                  (currentStep === 3 && selectedWalletAccount === null) ||
                  (currentStep === 1 && !selectedPlatform) ||
                  (currentStep === 2 && !selectedMode)
                }
              >
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                className="bg-amber-700 hover:bg-amber-600 text-white"
                disabled={selectedWalletAccount === null}
              >
                Create Bundle
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
