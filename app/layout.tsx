import { Inter } from "next/font/google"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Stock Management App",
  description: "Manage your stock with ease",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    return (
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SidebarProvider>
              {session ? (
                <div className="flex h-screen">
                  <AppSidebar />
                  <main className="flex-1 overflow-y-auto p-4">{children}</main>
                </div>
              ) : (
                children
              )}
            </SidebarProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    )
  } catch (error) {
    console.error("Error in RootLayout:", error)
    return (
      <html lang="en">
        <body className={inter.className}>
          <div>An error occurred. Please check your Supabase configuration.</div>
        </body>
      </html>
    )
  }
}



import './globals.css'