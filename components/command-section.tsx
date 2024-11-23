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
    // TODO: Implement search logic
  }

  const handleAdd = () => {
    // TODO: Implement add logic
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
