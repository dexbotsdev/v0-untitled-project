"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Key, ShieldCheck } from "lucide-react"

export default function LicenseValidatorPage() {
  const [licenseKey, setLicenseKey] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleValidation = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!licenseKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a license key",
        variant: "destructive",
      })
      return
    }

    setIsValidating(true)

    // Simulate API validation call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For demo purposes, any key with at least 16 characters is considered valid
    const isValid = licenseKey.trim().length >= 16

    setIsValidating(false)

    if (isValid) {
      toast({
        title: "License Validated",
        description: "Your license key has been successfully validated",
      })

      // Store validation status in localStorage
      localStorage.setItem("licenseValidated", "true")

      // Redirect to strategies page after a short delay
      setTimeout(() => {
        router.push("/strategies")
      }, 1000)
    } else {
      toast({
        title: "Invalid License",
        description: "The license key you entered is invalid. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#11111D]">
      <div className="w-full max-w-md p-4">
        <div className="flex justify-center mb-8">
          <Image
            src="/images/iconlogo.png"
            alt="FAB Logo"
            width={80}
            height={80}
            priority
            className="drop-shadow-[0_5px_5px_rgba(0,0,0,0.3)]"
          />
        </div>

        <Card className="bg-black border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ShieldCheck className="h-5 w-5 text-amber-500" />
              License Validation
            </CardTitle>
            <CardDescription>Enter your license key to access the platform</CardDescription>
          </CardHeader>

          <form onSubmit={handleValidation}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Textarea
                    placeholder="Paste your license key here..."
                    value={licenseKey}
                    onChange={(e) => setLicenseKey(e.target.value)}
                    className="min-h-[120px] bg-gray-900/50 border-gray-800 font-mono text-sm resize-none"
                  />
                  <Key className="absolute top-3 right-3 h-5 w-5 text-gray-500" />
                </div>
                <p className="text-xs text-gray-400">
                  Your license key should be in the format provided in your purchase confirmation email
                </p>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-black"
                disabled={isValidating}
              >
                {isValidating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>Validate License</>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-xs text-gray-500 mt-4">
          If you don't have a license key, please contact support at support@fabcrypto.com
        </p>
      </div>
    </div>
  )
}
