import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { DataTable } from "@/components/data-table"
import { columns } from "./columns"

export default async function StockItemsPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch stock items data
  const { data: stockItems, error } = await supabase.from("stock_items").select("id, name, quantity, department")

  if (error) {
    console.error("Error fetching stock items:", error)
    return <div>Error loading stock items</div>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Stock Items</h1>
      <DataTable columns={columns} data={stockItems} />
    </div>
  )
}

