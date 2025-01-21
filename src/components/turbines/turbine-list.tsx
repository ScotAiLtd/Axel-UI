"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  MoreHorizontal, 
  FileText,
  Wind,
  Gauge,
  ArrowUpRight,
  Boxes,
  File,
  FileImage,
  FileSpreadsheet,
  FileCog,
  Download
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


const fileCategories = {
  technical: [
    { id: 1, name: "Technical Specifications.pdf", type: "pdf", size: "2.4 MB", lastModified: "2024-02-15" },
    { id: 2, name: "Assembly Instructions.pdf", type: "pdf", size: "3.1 MB", lastModified: "2024-02-14" },
    { id: 3, name: "Component Diagrams.dwg", type: "cad", size: "5.7 MB", lastModified: "2024-02-13" },
  ],
  certification: [
    { id: 4, name: "Safety Certification.pdf", type: "pdf", size: "1.2 MB", lastModified: "2024-02-12" },
    { id: 5, name: "Quality Assurance Report.xlsx", type: "spreadsheet", size: "890 KB", lastModified: "2024-02-11" },
  ],
  maintenance: [
    { id: 6, name: "Maintenance Schedule.xlsx", type: "spreadsheet", size: "1.1 MB", lastModified: "2024-02-10" },
    { id: 7, name: "Service Manual.pdf", type: "pdf", size: "4.2 MB", lastModified: "2024-02-09" },
  ],
  operational: [
    { id: 8, name: "Performance Data.xlsx", type: "spreadsheet", size: "2.8 MB", lastModified: "2024-02-08" },
    { id: 9, name: "Configuration Settings.json", type: "json", size: "450 KB", lastModified: "2024-02-07" },
  ],
}


const turbines = [
  {
    id: "1",
    model: "AW-3000",
    manufacturer: "Aurai Wind",
    powerCapacity: "3.0 MW",
    rotorDiameter: "132m",
    hubHeight: "84m",
    status: "active",
    documentCount: 24,
    specifications: {
      cutInSpeed: "3 m/s",
      ratedSpeed: "12 m/s",
      cutOutSpeed: "25 m/s",
    },
    lastUpdated: "2024-02-15",
  },
  {
    id: "2",
    model: "AW-5000X",
    manufacturer: "Aurai Wind",
    powerCapacity: "5.0 MW",
    rotorDiameter: "158m",
    hubHeight: "100m",
    status: "maintenance",
    documentCount: 31,
    specifications: {
      cutInSpeed: "3.5 m/s",
      ratedSpeed: "13 m/s",
      cutOutSpeed: "27 m/s",
    },
    lastUpdated: "2024-02-14",
  },
  {
    id: "3",
    model: "AW-4500",
    manufacturer: "Aurai Wind",
    powerCapacity: "4.5 MW",
    rotorDiameter: "145m",
    hubHeight: "90m",
    status: "active",
    documentCount: 28,
    specifications: {
      cutInSpeed: "3 m/s",
      ratedSpeed: "11.5 m/s",
      cutOutSpeed: "25 m/s",
    },
    lastUpdated: "2024-02-13",
  }
]

interface TurbineListProps {
  className?: string
}

const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return <FileText className="h-4 w-4" />
    case 'spreadsheet':
      return <FileSpreadsheet className="h-4 w-4" />
    case 'cad':
      return <FileCog className="h-4 w-4" />
    case 'image':
      return <FileImage className="h-4 w-4" />
    default:
      return <File className="h-4 w-4" />
  }
}

export function TurbineList({ className }: TurbineListProps) {
  const [viewType, setViewType] = useState<"grid" | "list">("grid")
  const [selectedTurbine, setSelectedTurbine] = useState<typeof turbines[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleTurbineClick = (turbine: typeof turbines[0]) => {
    setSelectedTurbine(turbine)
    setIsDialogOpen(true)
  }

  return (
    <>
      <div className={cn("space-y-4", className)}>
        <div className={cn(
          "grid gap-4",
          viewType === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {turbines.map((turbine) => (
            <motion.div
              key={turbine.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card 
                className="group hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleTurbineClick(turbine)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg group-hover:text-primary">
                          {turbine.model}
                        </h3>
                        <Badge variant="outline">{turbine.powerCapacity}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {turbine.manufacturer}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Specifications</DropdownMenuItem>
                        <DropdownMenuItem>View Documents</DropdownMenuItem>
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2">
                              <Wind className="h-4 w-4 text-muted-foreground" />
                              <span>Rotor: {turbine.rotorDiameter}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>Rotor Diameter</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2">
                              <Boxes className="h-4 w-4 text-muted-foreground" />
                              <span>Hub: {turbine.hubHeight}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>Hub Height</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Cut-in: {turbine.specifications.cutInSpeed} | 
                        Rated: {turbine.specifications.ratedSpeed}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>{turbine.documentCount} Documents</span>
                      </div>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{selectedTurbine?.model}</span>
              <Badge variant="outline">{selectedTurbine?.powerCapacity}</Badge>
            </DialogTitle>
            <DialogDescription>
              Manage documentation and specifications for this turbine
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="technical" className="flex-1">
            <TabsList className="grid grid-cols-4 gap-4">
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="certification">Certification</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="operational">Operational</TabsTrigger>
            </TabsList>

            {Object.entries(fileCategories).map(([category, files]) => (
              <TabsContent 
                key={category} 
                value={category}
                className="border rounded-md mt-4"
              >
                <ScrollArea className="h-[calc(80vh-12rem)] rounded-md">
                  <div className="p-4 space-y-2">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.type)}
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {file.size} • Last modified {file.lastModified}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
} 