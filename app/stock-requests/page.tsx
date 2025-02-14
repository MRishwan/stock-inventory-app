import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { DataTable } from "@/components/data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function StockRequestsPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch stock requests data
  const { data: stockRequests, error } = await supabase
    .from("stock_requests")
    .select("id, item_name, quantity, requesting_department, status, created_at")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching stock requests:", error)
    return <div>Error loading stock requests</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Stock Requests</h1>
        <Button asChild>
          <Link href="/stock-requests/new">New Request</Link>
        </Button>
      </div>
      <DataTable columns={columns} data={stockRequests} />
    </div>
  )
}

