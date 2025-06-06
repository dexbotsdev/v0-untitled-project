"use client"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-amber-500 rounded-full border-t-transparent mx-auto mb-4"></div>
        <p className="text-amber-500">Dashboard...</p>
      </div>
    </div>
  )
}
