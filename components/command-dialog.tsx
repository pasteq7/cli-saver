"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Plus } from "lucide-react"
import { Command } from "@/lib/types"
import { Alert } from "./ui/alert"

interface CommandDialogProps {
  onSave: (command: Partial<Command>) => void
}

export function CommandDialog({ onSave }: CommandDialogProps) {
  const [open, setOpen] = useState(false)
  const [command, setCommand] = useState("")


  const handleSave = () => {
    onSave({
      command,
    })
    setOpen(false)
    setCommand("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button >
          <Plus className="h-4 w-4 mr-2" />
          Add Command
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Command</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Alert
            icon="info"
            className="mb-4"
          >
            Note: Commands are stored unencrypted and visible to database administrators. 
            Avoid storing sensitive information like passwords or API keys.
          </Alert>
          <div className="space-y-2">
            <Label htmlFor="command">Command</Label>
            <Input
              id="command"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="git commit -m 'feat: add new feature'"
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
