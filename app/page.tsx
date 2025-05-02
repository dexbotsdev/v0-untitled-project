"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if authenticated
    const isAuthenticated = localStorage.getItem("boss_authenticated")

    // Redirect to appropriate page
    if (isAuthenticated === "true") {
     // router.push("/tokens")
    } else {
     // router.push("/license-validator")
    }
  }, [router])

  // Show loading state while redirecting
  return (
    <div className="flex items-center justify-center h-screen bg-[#0c0d16]">
      <div className="text-center">
        <div className="wrapper mt-10">
          <div className="bg"> bloop </div>
          <div className="fg"> bloop </div>
        </div>
        <p className="text-gray-400 mt-4">Loading...</p>
      </div>
    </div>
  )
}
