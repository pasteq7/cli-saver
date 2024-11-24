"use client"

import { Command } from "@/lib/types"
import { Button } from "./ui/button"
import { Copy, Trash2, Terminal } from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { ScrollArea } from "./ui/scroll-area"
import { useEffect, useRef } from "react"
import gsap from "gsap"

interface CommandListProps {
  commands: Command[]
  onDelete: (id: string) => void
}

export function CommandList({ commands, onDelete }: CommandListProps) {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!listRef.current) return

    const items = listRef.current.children
    gsap.fromTo(
      items,
      { 
        opacity: 0, 
        y: 20,
      },
      { 
        opacity: 1, 
        y: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out"
      }
    )
  }, [commands])

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
      <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground space-y-4">
        <Terminal className="w-12 h-12 opacity-20" />
        <div className="text-center space-y-2">
          <p className="font-medium">No commands saved yet</p>
          <p className="text-sm">Your saved commands will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border">
      <div ref={listRef} className="divide-y divide-border">
        {commands.map((command) => (
          <div
            key={command.id}
            className="group relative flex items-center gap-4 p-4 hover:bg-muted/50 transition-all duration-200"
          >
            <div className="flex-1 min-w-0">
              <div 
                className="font-mono text-sm cursor-pointer truncate hover:text-primary transition-colors"
                onClick={() => copyToClipboard(command.command)}
                title={command.command}
              >
                {command.command}
              </div>
            </div>
            
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => copyToClipboard(command.command)}
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(command.id)}
                title="Delete command"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
