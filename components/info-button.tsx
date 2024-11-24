"use client"

import { Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export function InfoButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Info className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Security Information</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[300px] text-sm">
          <p>⚠️ Please note: Commands are stored unencrypted in the database. Do not save sensitive data or credentials.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
