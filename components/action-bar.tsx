"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, Download, Settings, Search } from "lucide-react"

interface ActionBarProps {
  title?: string
  onRefresh?: () => void
  onExport?: () => void
  onSettingsClick?: () => void
  className?: string
  children?: React.ReactNode
}

export function ActionBar({ title, onRefresh, onExport, onSettingsClick, className, children }: ActionBarProps) {
  return (
    <div className={`bg-[#191929] border border-gray-800 rounded-lg p-3 mb-4 ${className}`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {title && <h3 className="text-sm font-medium text-[#ECF1F0]">{title}</h3>}

          <div className="relative w-full sm:w-auto max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-9 h-9 bg-[#11111D] border-gray-800 text-[#ECF1F0] w-full"
            />
          </div>

          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-[130px] bg-[#11111D] border-gray-800 text-[#ECF1F0]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="bg-[#11111D] border-gray-800 text-[#ECF1F0]">
              <SelectItem value="all">All Tokens</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="stopped">Stopped</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          {children}

          <Button
            variant="outline"
            size="sm"
            className="h-9 border-gray-700 bg-transparent hover:bg-gray-800 text-[#ECF1F0]"
            onClick={onRefresh}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-9 border-gray-700 bg-transparent hover:bg-gray-800 text-[#ECF1F0]"
            onClick={onExport}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-9 border-gray-700 bg-transparent hover:bg-gray-800 text-[#ECF1F0]"
            onClick={onSettingsClick}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
