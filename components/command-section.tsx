"use client"

import { Command } from "@/lib/types"
import { CommandSearch } from "./command-search"
import { CommandList } from "./command-list"
import { useState } from "react"

interface CommandSectionProps {
  initialCommands: Command[]
}

export function CommandSection({ initialCommands }: CommandSectionProps) {
  const [commands, setCommands] = useState(initialCommands)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setCommands(initialCommands)
      return
    }
    
    const filtered = initialCommands.filter(command => 
      command.command.toLowerCase().includes(query.toLowerCase()) ||
      command.description?.toLowerCase().includes(query.toLowerCase()) ||
      command.tags?.some(tag => tag.name.toLowerCase().includes(query.toLowerCase()))
    )
    setCommands(filtered)
  }

  const handleAdd = () => {
    // TODO: Will be implemented when adding new commands
  }

  return (
    <>
      <CommandSearch 
        onSearch={handleSearch}
        onAdd={handleAdd}
      />
      <CommandList commands={commands} />
    </>
  )
}
