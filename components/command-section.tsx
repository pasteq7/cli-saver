"use client"

import { Command } from "@/lib/types"
import { CommandSearch } from "./command-search"
import { CommandList } from "./command-list"
import { useState } from "react"
import { toast } from "sonner"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Plus, Search } from "lucide-react"
import { useHotkeys } from "react-hotkeys-hook"

interface CommandSectionProps {
  initialCommands: Command[]
}

export function CommandSection({ initialCommands }: CommandSectionProps) {
  const [commands, setCommands] = useState(initialCommands)
  const [newCommand, setNewCommand] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)

  useHotkeys('ctrl+k', (e) => {
    e.preventDefault()
    document.getElementById('command-search')?.focus()
  })

  useHotkeys('ctrl+f', (e) => {
    e.preventDefault()
    setShowSearch(true)
    setTimeout(() => {
      document.getElementById('command-search')?.focus()
    }, 0)
  })

  useHotkeys('ctrl+n', (e) => {
    e.preventDefault()
    document.getElementById('new-command')?.focus()
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setCommands(initialCommands)
      return
    }
    
    const filtered = initialCommands.filter(command => 
      command.command.toLowerCase().includes(query.toLowerCase()) 
    )
    setCommands(filtered)
  }

  const handleAddCommand = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCommand.trim()) return

    // Generate temporary ID for optimistic update
    const tempCommand: Command = {
      id: crypto.randomUUID(),
      user_id: "temp",
      command: newCommand,
      created_at: new Date().toISOString(),
    }
    
    // Optimistically update UI
    setCommands(prev => [tempCommand, ...prev])
    setNewCommand("")
    
    try {
      const response = await fetch("/api/commands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command: newCommand })
      })

      if (!response.ok) {
        throw new Error("Failed to save command")
      }

      const savedCommand = await response.json()
      setCommands(prev => [
        savedCommand,
        ...prev.filter(cmd => cmd.id !== tempCommand.id)
      ])
      toast.success("Command saved")
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unknown error occurred while saving the command'
      console.error('Error saving command:', errorMessage)
      setCommands(prev => prev.filter(cmd => cmd.id !== tempCommand.id))
      toast.error("Failed to save command")
    }
  }

  const handleDelete = async (id: string) => {
    // Optimistically remove from UI
    setCommands(prev => prev.filter(cmd => cmd.id !== id))
    
    try {
      const response = await fetch(`/api/commands?id=${id}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete command")
      }

      toast.success("Command deleted")
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unknown error occurred while deleting the command'
      console.error('Error deleting command:', errorMessage)
      // Restore command on error
      setCommands(prev => [...prev, initialCommands.find(cmd => cmd.id === id)!])
      toast.error("Failed to delete command")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              id="new-command"
              placeholder="Enter a new command..."
              value={newCommand}
              onChange={(e) => setNewCommand(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newCommand.trim()) {
                  handleAddCommand(e);
                }
              }}
              className="w-full hover-scale focus:ring-2 transition-all"
            />
          </div>
          <Button 
            onClick={handleAddCommand}
            className="hover-scale"
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setShowSearch(!showSearch)}
            variant="outline"
            className="hover-scale"
            size="icon"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        {showSearch && (
          <div className="animate-in">
            <CommandSearch onSearch={handleSearch} />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <CommandList commands={commands} onDelete={handleDelete} />
      </div>
    </div>
  )
}
