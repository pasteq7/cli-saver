"use client"

import { Command } from "@/lib/types"
import { Card, CardContent } from "./ui/card"
import { Copy, Trash2 } from "lucide-react"
import { Button } from "./ui/button"
import { toast } from "sonner"

interface CommandListProps {
  commands: Command[]
  onDelete?: (id: string) => void
}

export function CommandList({ commands, onDelete }: CommandListProps) {
  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    toast.success("Command copied to clipboard")
  }

  return (
    <div className="grid gap-4">
      {commands.map((command) => (
        <Card 
          key={command.id} 
          className="hover:bg-accent/10 hover:dark:bg-accent/20 cursor-pointer transition-colors"
          onClick={() => copyToClipboard(command.command)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <pre className="font-mono text-sm bg-muted/50 p-2 rounded-md overflow-x-auto">
                  {command.command}
                </pre>
              </div>
              <div className="flex gap-2">
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(command.id);
                    }}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    title="Delete command"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
