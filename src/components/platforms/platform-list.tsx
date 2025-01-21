"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  MoreHorizontal, 
  Wind,
  Building2,
  ArrowUpRight,
  Settings,
  Gauge,
  Power,
  Activity
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


const platforms = [
  {
    id: "1",
    name: "Offshore Platform Alpha",
    description: "Deep-water wind turbine platform",
    status: "operational",
    type: "floating",
    capacity: "500 MW",
    location: "North Sea",
    turbineCount: 45,
    specifications: {
      waterDepth: "120m",
      foundation: "Semi-submersible",
      gridConnection: "HVDC",
    },
    turbines: [
      { id: "t1", model: "AW-3000", capacity: "3.0 MW", status: "active" },
      { id: "t2", model: "AW-4000", capacity: "4.0 MW", status: "maintenance" },
    
    ]
  },
 
]

interface PlatformListProps {
  className?: string
}

export function PlatformList({ className }: PlatformListProps) {
  const [viewType, setViewType] = useState<"grid" | "list">("grid")
  const [selectedPlatform, setSelectedPlatform] = useState<typeof platforms[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handlePlatformClick = (platform: typeof platforms[0]) => {
    setSelectedPlatform(platform)
    setIsDialogOpen(true)
  }

  return (
    <>
      <div className={cn("space-y-4", className)}>
        <div className={cn(
          "grid gap-4",
          viewType === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {platforms.map((platform) => (
            <motion.div
              key={platform.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card 
                className="group hover:shadow-md transition-all cursor-pointer"
                onClick={() => handlePlatformClick(platform)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg group-hover:text-primary">
                          {platform.name}
                        </h3>
                        <Badge variant="outline">{platform.capacity}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {platform.description}
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
                        <DropdownMenuItem>Edit Platform</DropdownMenuItem>
                        <DropdownMenuItem>View Turbines</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>Type: {platform.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Wind className="h-4 w-4 text-muted-foreground" />
                        <span>{platform.turbineCount} Turbines</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Settings className="h-4 w-4" />
                      <span>
                        Depth: {platform.specifications.waterDepth} | 
                        Foundation: {platform.specifications.foundation}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <Badge 
                        variant={platform.status === "operational" ? "default" : "secondary"}
                        className={cn(
                          "capitalize",
                          platform.status === "operational" ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                        )}
                      >
                        {platform.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <ArrowUpRight className="mr-2 h-4 w-4" />
                        View Turbines
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
              <span>{selectedPlatform?.name}</span>
              <Badge variant="outline">{selectedPlatform?.capacity}</Badge>
            </DialogTitle>
            <DialogDescription>
              Platform turbines and specifications
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[600px] rounded-md border p-4">
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {selectedPlatform?.turbines.map((turbine) => (
                  <Card key={turbine.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{turbine.model}</h4>
                        <Badge variant="outline">{turbine.capacity}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Power className="h-4 w-4 text-muted-foreground" />
                          <span>Status: {turbine.status}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <span>Performance: 98%</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
} 