import { Sidebar } from "@/components/dashboard/Sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-[70px] md:ml-64 min-h-screen">
        <div className="flex justify-end p-4">
          <ThemeToggle />
        </div>
        <div className="container p-8">{children}</div>
      </main>
    </div>
  )
} 