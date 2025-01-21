"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  MoreHorizontal, 
  Wind,
  MapPin,
  ArrowUpRight,
  Building2,
  Gauge,
  Cloud,
  Power,
  Waves
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"


const sites = [
  {
    id: "1",
    name: "North Sea Wind Farm Alpha",
    description: "Offshore wind farm in the North Sea",
    status: "operational",
    location: {
      coordinates: "54.2741° N, 2.7120° E",
      region: "North Sea",
      country: "Netherlands",
    },
    specifications: {
      totalCapacity: "800 MW",
      waterDepth: "25-35m",
      area: "75 km²",
    },
    environmentalData: {
      avgWindSpeed: "9.5 m/s",
      waveHeight: "2.3m",
      temperature: "12°C",
    },
    platforms: [
      { id: "p1", name: "Platform A1", type: "Floating", turbineCount: 15, status: "active" },
      { id: "p2", name: "Platform A2", type: "Fixed", turbineCount: 12, status: "maintenance" },
    ]
  },
  {
    id: "2",
    name: "Baltic Sea Platform Beta",
    description: "Advanced offshore wind energy project",
    status: "construction",
    location: {
      coordinates: "56.1234° N, 18.4567° E",
      region: "Baltic Sea",
      country: "Denmark",
    },
    specifications: {
      totalCapacity: "1200 MW",
      waterDepth: "40-50m",
      area: "95 km²",
    },
    environmentalData: {
      avgWindSpeed: "10.2 m/s",
      waveHeight: "1.8m",
      temperature: "10°C",
    },
    platforms: [
      { id: "p3", name: "Platform B1", type: "Floating", turbineCount: 20, status: "construction" },
      { id: "p4", name: "Platform B2", type: "Floating", turbineCount: 18, status: "planned" },
    ]
  },
  {
    id: "3",
    name: "Irish Sea Array",
    description: "Next-generation wind power facility",
    status: "planned",
    location: {
      coordinates: "53.4567° N, 5.1234° W",
      region: "Irish Sea",
      country: "Ireland",
    },
    specifications: {
      totalCapacity: "950 MW",
      waterDepth: "30-45m",
      area: "82 km²",
    },
    environmentalData: {
      avgWindSpeed: "11.0 m/s",
      waveHeight: "2.8m",
      temperature: "11°C",
    },
    platforms: [
      { id: "p5", name: "Platform C1", type: "Fixed", turbineCount: 16, status: "planned" },
      { id: "p6", name: "Platform C2", type: "Fixed", turbineCount: 14, status: "planned" },
    ]
  }
]

interface SiteListProps {
  className?: string
}

export function SiteList({ className }: SiteListProps) {
  const [viewType, setViewType] = useState<"grid" | "list">("grid")
  const [selectedSite, setSelectedSite] = useState<typeof sites[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <div className={cn("space-y-4", className)}>
        <div className={cn(
          "grid gap-4",
          viewType === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {sites.map((site) => (
            <motion.div
              key={site.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="group"
            >
              <Card className="overflow-hidden transition-all hover:shadow-lg">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold leading-none tracking-tight">
                        {site.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {site.description}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Site</DropdownMenuItem>
                        <DropdownMenuItem>View Timeline</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{site.location.region}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{site.platforms.length} Platforms</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Capacity: {site.specifications.totalCapacity}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <Badge 
                        variant="secondary"
                        className="capitalize"
                      >
                        {site.status}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedSite(site)
                          setIsDialogOpen(true)
                        }}
                      >
                        <ArrowUpRight className="mr-2 h-4 w-4" />
                        View Platforms
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{selectedSite?.name}</span>
              <Badge variant="outline">{selectedSite?.specifications.totalCapacity}</Badge>
            </DialogTitle>
            <DialogDescription>
              Site platforms and specifications
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Wind Speed</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedSite?.environmentalData.avgWindSpeed}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Waves className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Wave Height</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedSite?.environmentalData.waveHeight}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Temperature</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedSite?.environmentalData.temperature}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <ScrollArea className="h-[400px] rounded-md border p-4">
            <div className="space-y-4">
              {selectedSite?.platforms.map((platform) => (
                <Card key={platform.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{platform.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Type: {platform.type} • {platform.turbineCount} Turbines
                      </p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {platform.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
} 