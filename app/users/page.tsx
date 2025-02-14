import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { DataTable } from "@/components/data-table"
import { columns } from "./columns"

export default async function UsersPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch users data
  const { data: users, error } = await supabase.from("users").select("id, email, role, department")

  if (error) {
    console.error("Error fetching users:", error)
    return <div>Error loading users</div>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Users</h1>
      <DataTable columns={columns} data={users} />
    </div>
  )
}

