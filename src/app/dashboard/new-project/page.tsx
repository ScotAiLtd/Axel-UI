import { Metadata } from "next"
import { NewProjectForm } from "@/components/forms/new-project-form"

export const metadata: Metadata = {
  title: "New Project | Aurai Wind",
  description: "Create a new wind turbine project with comprehensive documentation",
}

export default function NewProjectPage() {
  return (
    <div className="flex-1">
      <div className="space-y-6 p-6 pt-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground/90">Create New Project</h2>
          <p className="text-muted-foreground mt-2">Configure your wind turbine project specifications and documentation requirements.</p>
        </div>
        <NewProjectForm />
      </div>
    </div>
  )
} 