"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { AutoLicenseValidator } from "@/components/auto-license-validator"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect directly to volume-bot page
    router.push("/volume-bot")
  }, [router])

  // Show loading state with FAB logo while redirecting
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <AutoLicenseValidator />
      <div className="text-center">
        <div className="relative w-[600px] max-w-full mx-auto">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/solvol.jpg-PUMob9GX9yIUdRhJfnrlyV8IVTg1wU.jpeg"
            alt="SOAR Logo"
            width={980}
            height={340}
            priority
            className="drop-shadow-[0_5px_5px_rgba(0,0,0,0.3)]"
          />
        </div>
        <p className="text-gray-400 mt-4">Loading platform...</p>
      </div>
    </div>
  )
}
