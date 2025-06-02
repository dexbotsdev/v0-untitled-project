"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"

interface TokenConfigProps {
  tokenConfig?: {
    tokenType: string
    platform: string
    revokeAuthority: boolean
  }
}

export function TokenConfigurationSection({ tokenConfig = {} }: TokenConfigProps) {
  const [tokenType, setTokenType] = useState(tokenConfig.tokenType || "spl")
  const [platform, setPlatform] = useState(tokenConfig.platform || "raydium-amm")
  const [revokeAuthority, setRevokeAuthority] = useState(tokenConfig.revokeAuthority || false)

  // Platforms that support revoke authority
  const revokeAuthorityPlatforms = ["raydium-amm", "raydium-cpmm", "clmm", "meteora-dyn", "dlmm"]

  // Check if the selected platform supports revoke authority
  const supportsRevokeAuthority = revokeAuthorityPlatforms.includes(platform)

  // Reset revoke authority when switching to a platform that doesn't support it
  useEffect(() => {
    if (!supportsRevokeAuthority) {
      setRevokeAuthority(false)
    }
  }, [platform, supportsRevokeAuthority])

  const saveToLocalStorage = () => {
    const config = {
      tokenType,
      platform,
      revokeAuthority: supportsRevokeAuthority ? revokeAuthority : false,
    }
    localStorage.setItem("tokenConfig", JSON.stringify(config))
    alert("Token configuration saved to local storage")
  }

  return (
    <div className="space-y-6">
      <Card className="border-gray-800 bg-gray-900/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-400">Token Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Token Type</Label>
              <RadioGroup value={tokenType} onValueChange={setTokenType} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="spl" id="spl" className="border-gray-600" />
                  <Label htmlFor="spl" className="text-gray-300">
                    SPL Token
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="spl-2022" id="spl-2022" className="border-gray-600" />
                  <Label htmlFor="spl-2022" className="text-gray-300">
                    SPL Token 2022
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label htmlFor="platform" className="text-sm font-medium">
                Platform Selection
              </Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="raydium-amm">Raydium AMM</SelectItem>
                  <SelectItem value="raydium-cpmm">Raydium CPMM</SelectItem>
                  <SelectItem value="clmm">CLMM</SelectItem>
                  <SelectItem value="pumpfun">PumpFun</SelectItem>
                  <SelectItem value="launchlab">Launchlab</SelectItem>
                  <SelectItem value="moonshot">Moonshot</SelectItem>
                  <SelectItem value="letsbonk">LetsBonk</SelectItem>
                  <SelectItem value="cook">Cook</SelectItem>
                  <SelectItem value="meteora-dyn">Meteora DYN</SelectItem>
                  <SelectItem value="dlmm">DLMM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {supportsRevokeAuthority && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="revoke-authority" className="text-sm font-medium">
                      Enable Token Revoke Authority
                    </Label>
                    <p className="text-xs text-gray-400">Allows you to revoke token authority after launch</p>
                  </div>
                  <Switch id="revoke-authority" checked={revokeAuthority} onCheckedChange={setRevokeAuthority} />
                </div>
                {revokeAuthority && (
                  <div className="flex items-start p-3 bg-blue-900/20 border border-blue-800/30 rounded-md">
                    <Info className="h-4 w-4 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-xs text-blue-300">
                      With revoke authority enabled, you'll be able to revoke token authority after launch, which can
                      increase trust with your community. This feature is only available on selected platforms.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={saveToLocalStorage}>
                Save Token Configuration
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
