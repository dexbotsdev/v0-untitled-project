import { Bell } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  return (
    <header className="flex h-12 items-center justify-between border-b border-stone-800 bg-stone-950 px-4">
      <div className="flex items-center space-x-12">
        <div className="text-xl font-bold text-amber-500">C</div>
      </div>
      <div className="flex items-center space-x-4">
        <Bell className="h-5 w-5 text-stone-400" />
        <Avatar className="h-6 w-6 bg-stone-800 border border-stone-700">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback className="text-amber-500">CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
