"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // router.push("/tokens")
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen/2">
      <div className="text-center">
        <div className="wrapper mt-10">
          <div className="bg"> BoSS </div>
          <div className="fg"> BoSS </div>
        </div>
      </div>
    </div>
  )
}
