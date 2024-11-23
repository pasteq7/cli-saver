"use client"

import { Button } from "@/components/ui/button"
import { LogIn, LogOut } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function AuthButton() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    }
    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    router.refresh()
  }

  if (isAuthenticated) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSignOut}
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
      onClick={handleSignIn}
      className="hover:bg-muted"
      title="Sign in with GitHub"
    >
      <LogIn className="h-5 w-5" />
    </Button>
  )
}
