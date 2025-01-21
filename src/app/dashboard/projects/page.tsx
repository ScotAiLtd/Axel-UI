import { Metadata } from "next"
import { ProjectList } from "@/components/projects/project-list"
import { ProjectViewToggle } from "@/components/projects/project-view-toggle"
import { ProjectFilters } from "@/components/projects/project-filters"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Projects | Aurai Wind",
  description: "Manage and monitor your wind turbine projects",
}

export default function ProjectsPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor your wind turbine projects
          </p>
        </div>
        <Link href="/dashboard/new-project">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <ProjectFilters />
        <ProjectViewToggle />
      </div>

      <ProjectList />
    </div>
  )
} 