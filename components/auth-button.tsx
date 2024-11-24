"use client"

import { Button } from "@/components/ui/button"
import { LogIn, LogOut, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export function AuthButton() {
  const { user, isLoading, signInWithGithub, signOut } = useAuth()

  console.log('AuthButton render:', { isLoading, hasUser: !!user })

  if (isLoading) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        className="hover:bg-muted"
      >
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    )
  }

  if (user) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={signOut}
        className="hover:bg-muted"
        title="Sign out"
      >
        <LogOut className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={signInWithGithub}
      className="hover:bg-muted"
      title="Sign in with GitHub"
    >
      <LogIn className="h-5 w-5" />
    </Button>
  )
}
