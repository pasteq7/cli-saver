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
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        setIsAuthenticated(!!user)
      } catch (error) {
        console.error('Error checking auth status:', error)
        setIsAuthenticated(false)
      }
    }
    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        try {
          const { data: { user }, error } = await supabase.auth.getUser()
          if (error) throw error
          setIsAuthenticated(!!user)
        } catch (error) {
          console.error('Error handling auth state change:', error)
          setIsAuthenticated(false)
        }
      }
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
    try {
      await supabase.auth.signOut()
      setIsAuthenticated(false)
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
      // toast.error('Failed to sign out') // toast is not defined, consider importing or defining it
    }
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
