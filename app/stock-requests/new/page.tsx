import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { NewStockRequestForm } from "@/components/new-stock-request-form"

export default async function NewStockRequestPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch departments for the dropdown
  const { data: departments } = await supabase.from("departments").select("id, name")

  // Fetch stock items for the dropdown
  const { data: stockItems } = await supabase.from("stock_items").select("id, name")

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">New Stock Request</h1>
      <NewStockRequestForm departments={departments} stockItems={stockItems} />
    </div>
  )
}

