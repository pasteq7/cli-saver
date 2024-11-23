"use client"

import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface CommandSearchProps {
  onSearch: (query: string) => void
  onAdd: () => void
}

export function CommandSearch({ onSearch, onAdd }: CommandSearchProps) {
  return (
    <div className="flex gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search commands..."
          className="pl-10"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <Button onClick={onAdd}>
        <Plus className="h-4 w-4 mr-2" />
        Add Command
      </Button>
    </div>
  )
}
