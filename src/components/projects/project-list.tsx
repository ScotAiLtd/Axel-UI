"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  MoreHorizontal,
  ArrowUpRight,
  Clock,
  MapPin
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"


const projects = [
  {
    id: "1",
    name: "North Sea Wind Farm",
    description: "Offshore wind turbine installation project",
    status: "in-progress",
    location: "North Sea, Block A-12",
    lastUpdated: "2 hours ago",
    completion: 65,
    budget: "€380M",
    timeline: {
      start: "2024-01-15",
      estimated_completion: "2025-06-30"
    },
    team: {
      lead: "Dr. Sarah Johnson",
      members: 45
    }
  },
  {
    id: "2",
    name: "Baltic Sea Platform Beta",
    description: "New platform development and installation",
    status: "planning",
    location: "Baltic Sea, Zone B-8",
    lastUpdated: "5 hours ago",
    completion: 25,
    budget: "€420M",
    timeline: {
      start: "2024-03-01",
      estimated_completion: "2025-09-30"
    },
    team: {
      lead: "Michael Chen",
      members: 38
    }
  },
  {
    id: "3",
    name: "Irish Sea Array Expansion",
    description: "Expansion of existing wind farm capacity",
    status: "approved",
    location: "Irish Sea, Section C-15",
    lastUpdated: "1 day ago",
    completion: 10,
    budget: "€290M",
    timeline: {
      start: "2024-04-15",
      estimated_completion: "2025-08-30"
    },
    team: {
      lead: "Emma Wilson",
      members: 32
    }
  }
]

interface ProjectListProps {
  className?: string
}

export function ProjectList({ className }: ProjectListProps) {
  const [viewType, setViewType] = useState<"grid" | "list">("grid")

  return (
    <div className={cn("space-y-4", className)}>
      <div className={cn(
        "grid gap-4",
        viewType === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
      )}>
        {projects.map((project) => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="group hover:shadow-md transition-all">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg group-hover:text-primary">
                      {project.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {project.description}
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
                      <DropdownMenuItem>Edit Project</DropdownMenuItem>
                      <DropdownMenuItem>View Timeline</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="secondary"
                      className="capitalize"
                    >
                      {project.status}
                    </Badge>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {project.lastUpdated}
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {project.location}
                  </div>

                  <div className="flex items-center justify-end pt-2 border-t">
                    <Button variant="ghost" size="sm">
                      <ArrowUpRight className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 