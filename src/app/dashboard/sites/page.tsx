import { Metadata } from "next"
import { SiteList } from "@/components/sites/site-list"
import { SiteViewToggle } from "@/components/sites/site-view-toggle"
import { SiteFilters } from "@/components/sites/site-filters"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Sites | Aurai Wind",
  description: "Manage and monitor wind farm sites",
}

export default function SitesPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sites</h1>
          <p className="text-muted-foreground mt-2">
            Browse and manage wind farm sites and their platforms
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Site
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <SiteFilters />
        <SiteViewToggle />
      </div>

      <SiteList />
    </div>
  )
} 