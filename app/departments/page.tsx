import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { DataTable } from "@/components/data-table"
import { columns } from "./columns"

export default async function DepartmentsPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch departments data
  const { data: departments, error } = await supabase.from("departments").select("id, name, manager")

  if (error) {
    console.error("Error fetching departments:", error)
    return <div>Error loading departments</div>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Departments</h1>
      <DataTable columns={columns} data={departments} />
    </div>
  )
}

