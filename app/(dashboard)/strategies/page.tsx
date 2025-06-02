"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import StrategyCard from "@/components/StrategyCard"
import { PlusIcon } from "@heroicons/react/24/solid"
import Link from "next/link"

const StrategiesPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [strategies, setStrategies] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") {
      return
    }

    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    const fetchStrategies = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/strategies", {
          cache: "no-store",
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setStrategies(data)
      } catch (error) {
        console.error("Failed to fetch strategies:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (status === "authenticated") {
      fetchStrategies()
    }
  }, [status])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading strategies...</p>
      </div>
    )
  }

  return (
    <div className="w-full p-6 space-y-8 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Strategies</h1>
        <Link href="/(dashboard)/strategies/create">
          <button className="btn btn-primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Strategy
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {strategies.map((strategy) => (
          <StrategyCard key={strategy.id} strategy={strategy} />
        ))}
      </div>
    </div>
  )
}

export default StrategiesPage
