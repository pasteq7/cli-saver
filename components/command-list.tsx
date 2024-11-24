"use client"

import { Command } from "@/lib/types"
import { Button } from "./ui/button"
import { Copy, Trash2 } from "lucide-react"
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
            
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                className="px-3"
                onClick={() => copyToClipboard(command.command)}
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="px-3"
                onClick={() => onDelete(command.id)}
                title="Delete command"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(command.created_at), { addSuffix: true })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
