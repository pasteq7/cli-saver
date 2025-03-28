"use client"

import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export function SignIn() {
  const { signInWithGithub } = useAuth()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h2 className="text-2xl font-semibold text-center">
        Save and organize your CLI commands
      </h2>
      <p className="text-muted-foreground text-center max-w-md">
        Sign in with GitHub to start saving your frequently used commands and access them from anywhere.
      </p>
      <Button onClick={signInWithGithub}>
        <LogIn className="h-4 w-4 mr-2" />
        Sign in with GitHub
      </Button>
    </div>
  )
}
