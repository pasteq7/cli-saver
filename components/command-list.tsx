"use client"

import { Command } from "@/lib/types"
import { Button } from "./ui/button"
import { Copy, Trash2, Edit } from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { ScrollArea } from "./ui/scroll-area"

interface CommandListProps {
  commands: Command[]
  onDelete: (id: string) => void
}

export function CommandList({ commands, onDelete }: CommandListProps) {
  const copyToClipboard = async (command: string) => {
    try {
      await navigator.clipboard.writeText(command)
      toast.success("Command copied to clipboard")
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      toast.error("Failed to copy command")
    }
  }

  if (commands.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No commands found
      </div>
    )
  }

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
      <div className="space-y-2">
        {commands.map((command) => (
          <div
            key={command.id}
            className="group flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div 
              className="flex-1 font-mono text-sm cursor-pointer hover:text-primary"
              onClick={() => copyToClipboard(command.command)}
              title="Click to copy"
            >
              {command.command}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => copyToClipboard(command.command)}
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {}} // TODO: Implement edit functionality
                  title="Edit command"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => onDelete(command.id)}
                  title="Delete command"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground group-hover:opacity-0 transition-opacity">
                {formatDistanceToNow(new Date(command.created_at), { addSuffix: true })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
