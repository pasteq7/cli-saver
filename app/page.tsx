import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { CommandList } from "@/components/command-list"
import { ThemeToggle } from "@/components/theme-toggle"
import { AuthButton } from "@/components/auth-button"
import { SignIn } from "@/components/sign-in"
import { CommandSearch } from "@/components/command-search"

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  const { data: commands } = await supabase
    .from('commands')
    .select(`
      *,
      tags (
        id,
        name
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          CLI Saver
        </h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AuthButton />
        </div>
      </header>

      {session ? (
        <>
          <CommandSearch 
            onSearch={() => {}}
            onAdd={() => {}}
          />
          <CommandList commands={commands || []} />
        </>
      ) : (
        <SignIn />
      )}
    </div>
  )
}
