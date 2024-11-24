"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'

type AuthContextType = {
  user: User | null
  isLoading: boolean
  signInWithGithub: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log('Checking user auth status...')
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        console.log('User auth status:', user ? 'logged in' : 'not logged in')
        setUser(user)
      } catch (error) {
        console.error('Error checking auth status:', error)
        toast.error('Authentication error. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event)
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null)
        router.refresh()
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        router.refresh()
        router.push('/')
      }
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const signInWithGithub = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error) {
      console.error('Error signing in with Github:', error)
      toast.error('Failed to sign in with Github. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      router.refresh()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Failed to sign out. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signInWithGithub, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
