"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"

export default function LicenseValidator() {
  const [licenseKey, setLicenseKey] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check if already authenticated
    const isAuthenticated = localStorage.getItem("boss_authenticated")
    if (isAuthenticated === "true") {
      router.push("/tokens")
    }
  }, [router])

  const handleValidateLicense = async () => {
    if (!licenseKey.trim()) {
      setError("Please enter a license key")
      return
    }

    setIsValidating(true)
    setError("")

    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, accept any key that starts with "BOSS-" and is at least 10 chars
      if (licenseKey.startsWith("BOSS-") && licenseKey.length >= 10) {
        // Store authentication state
        localStorage.setItem("boss_authenticated", "true")

        toast({
          title: "License Validated",
          description: "Welcome to BOSS Dashboard",
          variant: "default",
        })

        // Redirect to tokens page
        router.push("/tokens")
      } else {
        setError("Invalid license key. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsValidating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleValidateLicense()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0c0d16]">
      <div className="w-full max-w-md p-8 space-y-8 bg-[#1e2133] rounded-lg shadow-xl border border-amber-600/20">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="relative w-48 h-24">
            <Image src="/images/boss-logo.png" alt="BOSS Logo" fill style={{ objectFit: "contain" }} priority />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-center text-amber-500">License Validation</h2>
          <p className="text-sm text-gray-400">Enter your license key to access the dashboard</p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="license-key" className="text-sm font-medium text-gray-300">
              License Key
            </label>
            <Input
              id="license-key"
              type="text"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="BOSS-XXXX-XXXX-XXXX"
              className="bg-[#12131e] border-gray-700 focus:border-amber-500 focus:ring-amber-500"
              autoComplete="off"
              spellCheck="false"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div>
            <Button
              onClick={handleValidateLicense}
              disabled={isValidating}
              className="w-full bg-amber-600 hover:bg-amber-700 text-black font-medium"
            >
              {isValidating ? "Validating..." : "Authenticate"}
            </Button>
          </div>

          <div className="text-xs text-center text-gray-500">
            <p>For demo purposes, use any key that starts with "BOSS-" and is at least 10 characters long</p>
            <p className="mt-1">Example: BOSS-1234-5678</p>
          </div>
        </div>
      </div>
    </div>
  )
}
