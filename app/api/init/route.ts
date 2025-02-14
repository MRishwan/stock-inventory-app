import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Check if admin exists in auth.users
    const {
      data: { users },
      error: listError,
    } = await supabase.auth.admin.listUsers()

    if (listError) {
      throw listError
    }

    const adminUser = users.find((user) => user.email === "admin@example.com")

    if (!adminUser) {
      // Create admin user if it doesn't exist
      const { data: newUser, error: createError } = await supabase.auth.signUp({
        email: "admin@example.com",
        password: "Admin@999",
        options: {
          data: { role: "admin" },
        },
      })

      if (createError) {
        throw createError
      }

      if (newUser?.user) {
        // Insert into users table
        const { error: insertError } = await supabase.from("users").insert({
          id: newUser.user.id,
          email: "admin@example.com",
          role: "admin",
          created_at: new Date().toISOString(),
        })

        if (insertError) {
          throw insertError
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error during initialization:", error)
    return NextResponse.json({ error: "Initialization failed" }, { status: 500 })
  }
}

