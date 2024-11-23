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
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        console.log('Current session:', session)
        setIsAuthenticated(!!session)
      } catch (error) {
        console.error('Error checking auth status:', error)
        setIsAuthenticated(false)
      }
    }
    
    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, 'Session:', session)
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true)
        router.refresh()
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false)
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase.auth])

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
      setIsAuthenticated(false) // Set state immediately
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.refresh()
      router.push('/') // Redirect to home page after sign out
    } catch (error) {
      console.error('Error signing out:', error)
      setIsAuthenticated(true) // Revert state if error
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
