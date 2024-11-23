"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface CommandSearchProps {
  onSearch: (query: string) => void
}

export function CommandSearch({ onSearch }: CommandSearchProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search commands..."
        className="pl-10"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  )
}
