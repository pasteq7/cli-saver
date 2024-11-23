import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { command, description } = body

    if (!command || typeof command !== "string") {
      return NextResponse.json(
        { error: "Command is required and must be a string" },
        { status: 400 }
      )
    }

    // Insert the command into the database
    console.log('Attempting to insert command:', {
      command,
      description: description || null,
      user_id: session.user.id,
    });
    
    const { data, error } = await supabase
      .from("commands")
      .insert({
        command,
        description: description || null,
        user_id: session.user.id,
      })
      .select()

    if (error) {
      console.error("Database error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      console.error("No data returned from insert")
      return NextResponse.json(
        { error: "Failed to create command - no data returned" },
        { status: 500 }
      )
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error creating command:", error)
    return NextResponse.json(
      { error: "Failed to create command" },
      { status: 500 }
    )
  }
}
