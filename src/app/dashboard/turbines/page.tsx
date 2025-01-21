import { Metadata } from "next"
import { TurbineList } from "@/components/turbines/turbine-list"
import { TurbineViewToggle } from "@/components/turbines/turbine-view-toggle"
import { TurbineFilters } from "@/components/turbines/turbine-filters"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Turbines | Aurai Wind",
  description: "Manage and monitor wind turbine specifications and documentation",
}

export default function TurbinesPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Turbines</h1>
          <p className="text-muted-foreground mt-2">
            Browse and manage wind turbine specifications and documentation
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Turbine Type
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <TurbineFilters />
        <TurbineViewToggle />
      </div>

      <TurbineList />
    </div>
  )
} 