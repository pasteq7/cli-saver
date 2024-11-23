"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { Plus } from "lucide-react"
import { Command } from "@/lib/types"

interface CommandDialogProps {
  onSave: (command: Partial<Command>) => void
}

export function CommandDialog({ onSave }: CommandDialogProps) {
  const [open, setOpen] = useState(false)
  const [command, setCommand] = useState("")
  const [description, setDescription] = useState("")

  const handleSave = () => {
    onSave({
      command,
      description: description || undefined,
    })
    setOpen(false)
    setCommand("")
    setDescription("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Command
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Command</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="command">Command</Label>
            <Input
              id="command"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="git commit -m 'feat: add new feature'"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Creates a commit with a conventional commit message"
            />
          </div>
          <Button onClick={handleSave} disabled={!command.trim()}>
            Save Command
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
