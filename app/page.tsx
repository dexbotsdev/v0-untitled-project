"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if license is already validated
    const isLicenseValidated = localStorage.getItem("licenseValidated") === "true"

    // If validated, redirect to volume-bot page after a short delay
    if (isLicenseValidated) {
      const timeout = setTimeout(() => {
        router.push("/volume-bot")
      }, 2500)

      return () => clearTimeout(timeout)
    }
  }, [router])

  const handleAccessClick = () => {
    router.push("/license-validator")
  }

  // Show loading state with FAB logo while redirecting
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <div className="text-center">
        <div className="relative w-[600px] max-w-full mx-auto">
          <Image
            src="/images/fab-logo-new.png"
            alt="FAB Logo"
            width={980}
            height={340}
            priority
            className="drop-shadow-[0_5px_5px_rgba(0,0,0,0.3)]"
          />
        </div>

        <div className="mt-8">
          <Button
            onClick={handleAccessClick}
            className="bg-amber-600 hover:bg-amber-700 text-black px-8 py-6 text-lg rounded-lg"
          >
            <Lock className="mr-2 h-5 w-5" />
            Access Platform
          </Button>
        </div>

        <p className="text-gray-400 mt-4">Enter your license key to access the platform</p>
      </div>
    </div>
  )
}
