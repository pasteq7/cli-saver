"use client"

import { Command } from "@/lib/types"
import { CommandSearch } from "./command-search"
import { CommandList } from "./command-list"
import { CommandDialog } from "./command-dialog"
import { useState } from "react"
import { toast } from "sonner"

interface CommandSectionProps {
  initialCommands: Command[]
}

export function CommandSection({ initialCommands }: CommandSectionProps) {
  const [commands, setCommands] = useState(initialCommands)

  const handleSearch = (query: string) => {
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

  const handleAdd = async (newCommand: Partial<Command>) => {
    // Generate temporary ID for optimistic update
    const tempCommand: Command = {
      id: crypto.randomUUID(),
      user_id: "temp",
      command: newCommand.command!,
      description: newCommand.description,
      created_at: new Date().toISOString(),
      tags: []
    }
    
    // Optimistically update UI
    setCommands(prev => [...prev, tempCommand])
    
    try {
      const response = await fetch("/api/commands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCommand)
      })

      if (!response.ok) {
        throw new Error("Failed to save command")
      }

      const savedCommand = await response.json()
      
      // Update the temporary command with the saved one
      setCommands(prev => prev.map(cmd => 
        cmd.id === tempCommand.id ? savedCommand : cmd
      ))
      
      toast.success("Command saved successfully")
    } catch (error) {
      console.error("Error saving command:", error)
      // Remove the temporary command on error
      setCommands(prev => prev.filter(cmd => cmd.id !== tempCommand.id))
      toast.error("Failed to save command")
    }
  }

  return (
    <>
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <CommandSearch onSearch={handleSearch} />
        </div>
        <CommandDialog onSave={handleAdd} />
      </div>
      <CommandList commands={commands} />
    </>
  )
}
