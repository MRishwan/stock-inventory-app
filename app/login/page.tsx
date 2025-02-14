import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Image from "next/image"
import { LoginForm } from "@/components/login-form"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default async function LoginPage() {
  const supabase = createServerComponentClient({ cookies })

  try {
    console.log("Checking for existing session...")
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session) {
      console.log("Existing session found, redirecting...")
      redirect("/")
    }

    console.log("Checking for admin user...")
    const { data: existingUsers, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", "mrishwan@gmail.com")
      .single()

    if (userError) {
      console.error("Error checking for admin user:", userError)
    }

    if (!existingUsers) {
      console.log("Admin user not found, creating...")
      const { data: authUser, error: signUpError } = await supabase.auth.signUp({
        email: "mrishwan@gmail.com",
        password: "Admin@999",
        options: {
          data: {
            role: "admin",
          },
        },
      })

      if (signUpError) {
        console.error("Error creating admin auth user:", signUpError)
      } else if (authUser?.user) {
        console.log("Admin auth user created, inserting into users table...")
        const { error: insertError } = await supabase.from("users").insert([
          {
            id: authUser.user.id,
            email: "mrishwan@gmail.com",
            role: "admin",
            created_at: new Date().toISOString(),
          },
        ])

        if (insertError) {
          console.error("Error inserting admin user into users table:", insertError)
        } else {
          console.log("Admin user successfully created and inserted")
        }
      }
    } else {
      console.log("Admin user already exists")
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="text-center mb-8">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/467148830_902817538492899_3385861249107649985_n.jpg-alUmFrHmTBEImFGbEuVEd6jxxSrgiL.jpeg"
            alt="Vilimale Hospital Logo"
            width={120}
            height={120}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-primary">VILIMALE HOSPITAL</h1>
        </div>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <h2 className="text-xl font-semibold">Stock Management System</h2>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error("Error in LoginPage:", error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <p className="text-destructive">An error occurred. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    )
  }
}

