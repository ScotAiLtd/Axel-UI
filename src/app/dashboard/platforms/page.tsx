import { Metadata } from "next"
import { PlatformList } from "@/components/platforms/platform-list"
import { PlatformViewToggle } from "@/components/platforms/platform-view-toggle"
import { PlatformFilters } from "@/components/platforms/platform-filters"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Platforms | Aurai Wind",
  description: "Manage and monitor wind turbine platforms",
}

export default function PlatformsPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platforms</h1>
          <p className="text-muted-foreground mt-2">
            Browse and manage wind turbine platforms and their configurations
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Platform
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <PlatformFilters />
        <PlatformViewToggle />
      </div>

      <PlatformList />
    </div>
  )
} 