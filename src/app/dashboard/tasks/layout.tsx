import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tasks | Aurai Wind",
  description: "Manage and track wind turbine maintenance tasks",
}

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 space-y-6 p-6 pt-8">
      {children}
    </div>
  )
} 