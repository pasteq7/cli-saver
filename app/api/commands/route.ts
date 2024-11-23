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
    const { command } = body

    if (!command || typeof command !== "string") {
      return NextResponse.json(
        { error: "Command is required and must be a string" },
        { status: 400 }
      )
    }

    // Insert the command into the database
    console.log('Attempting to insert command:', {
      command,
      user_id: session.user.id,
    });
    
    const { data, error } = await supabase
      .from("commands")
      .insert({
        command,
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

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { data, error } = await supabase
      .from("commands")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: "Command ID is required" },
        { status: 400 }
      )
    }

    // Verify the command belongs to the user before deleting
    const { data: command } = await supabase
      .from("commands")
      .select("user_id")
      .eq("id", id)
      .single()

    if (!command) {
      return NextResponse.json(
        { error: "Command not found" },
        { status: 404 }
      )
    }

    if (command.user_id !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from("commands")
      .delete()
      .eq("id", id)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting command:", error)
    return NextResponse.json(
      { error: "Failed to delete command" },
      { status: 500 }
    )
  }
}
