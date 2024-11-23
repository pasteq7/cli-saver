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
        <Card key={command.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <pre className="font-mono text-sm bg-muted p-2 rounded-md overflow-x-auto">
                  {command.command}
                </pre>
                {command.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {command.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(command.command)}
                  title="Copy command"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(command.id)}
                    className="text-destructive hover:text-destructive"
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
