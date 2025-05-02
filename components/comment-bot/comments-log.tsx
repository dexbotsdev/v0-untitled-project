"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Download } from "lucide-react"

interface CommentsLogProps {
  comments: any[]
}

export function CommentsLog({ comments }: CommentsLogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [autoScroll, setAutoScroll] = useState(true)

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // Filter comments based on search query
  const filteredComments = comments.filter(
    (comment) =>
      comment.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.targetToken.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b border-gray-800 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search comments..."
            className="pl-8 bg-gray-900 border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Filter className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Download className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-3">
        {filteredComments.length > 0 ? (
          <div className="space-y-3">
            {filteredComments.map((comment) => (
              <div key={comment.id} className="p-3 rounded-md bg-gray-900 border border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-gray-500 truncate" title={comment.targetToken}>
                    Target: {comment.targetToken.substring(0, 6)}...
                    {comment.targetToken.substring(comment.targetToken.length - 4)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        comment.status === "posted" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                      }`}
                    >
                      {comment.status === "posted" ? "Posted" : "Failed"}
                    </span>
                    <span className="text-xs text-gray-500">{formatTimestamp(comment.timestamp)}</span>
                  </div>
                </div>

                <p className="text-sm text-white">{comment.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">{searchQuery ? "No comments match your search" : "No comments yet"}</p>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
