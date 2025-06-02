"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PathBreadcrumb } from "@/components/path-breadcrumb"

export default function NewVolBotPage() {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <PathBreadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "New Volume Bot", href: "/new-vol-bot" },
          ]}
        />
      </div>
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid gap-6">
          <Card className="border-gray-800 bg-gray-950 text-white">
            <CardHeader>
              <CardTitle>New Volume Bot</CardTitle>
              <CardDescription className="text-gray-400">Configure and deploy your new volume bot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-gray-400">This is a blank template for the new volume bot interface.</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
